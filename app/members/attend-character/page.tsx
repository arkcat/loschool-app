'use client'

import MainPageBox from "@/components/MainPageBox"
import { RaidData, CharacterData, MemberData } from '@/lib/database.types'
import useRequireAuth from "@/utils/AuthUtils";
import { getBase64Text, getPlainText } from "@/utils/TextUtils";
import { supabase } from "@/utils/supabase";
import { Box, Button, Checkbox, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function pages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = parseInt(getPlainText(searchParams.get("id") || ""));
  const [raids, setRaids] = useState<RaidData[]>([])
  const [characters, setCharacters] = useState<CharacterData[]>([])

  useEffect(() => {

    const fetchRaid = async () => {
      try {
        const { data } = await supabase
          .from('Raid')
          .select()
          .order('id')

        if (data) {
          setRaids(data)
        } else {
          throw new Error('레이드 정보를 찾을 수 없습니다.')
        }
      } catch (error) {
        console.error(`에러 : {error}`)
      }
    }


    const fetchCharactersData = async () => {
      try {
        console.log(characterId)
        const { data } = await supabase
          .from('Character')
          .select()
          .eq('id', characterId)

        if (data) {
          console.log(data)
          setCharacters(data)
        }
      } catch (error) {
        console.error('에러 발생 : ', error)
      }
    }

    fetchRaid()
    fetchCharactersData()
  }, [])


  const handleSave = async () => {
    for (const raid of raids) {
      const { data, error } = await supabase
        .from('Raid')
        .update({ raid_group: raid.raid_group })
        .eq('id', raid.id)

      if (error) {
        console.error(`Error updating raid ${raid.id}:`, error)
      } else {
        console.log(`Raid ${raid.id} updated successfully!`)
      }
    }
    alert("레이드 정보를 업데이트 했습니다.")
  }


  const handleCheckboxChange = (raidId: number, characterId: number) => {
    var relatedRaidId = 0
    if (raidId === 40002) {
      relatedRaidId = 40001
    } else if (raidId === 40004) {
      relatedRaidId = 40003
    } else if (raidId === 40009) {
      relatedRaidId = 40008
    }

    setRaids(prevRaids => {
      return prevRaids.map(raid => {
        if (raid.id === raidId) {
          const updatedGroup = raid.raid_group.includes(characterId)
            ? raid.raid_group.filter(id => id !== characterId)
            : [...raid.raid_group, characterId]
          return { ...raid, raid_group: updatedGroup }
        }
        if (relatedRaidId > 0 && raid.id === relatedRaidId) {
          if (!raid.raid_group.includes(characterId)) {
            const updatedGroup = [...raid.raid_group, characterId]
            return { ...raid, raid_group: updatedGroup }
          }
        }
        return raid
      })
    })
  }

  function checkRelatedRaid(raidId: number, charId: number) {
    return raids.filter(raid => raid.id === raidId)[0].raid_group.includes(charId)
  }

  function checkRaidDisabled(raid: RaidData, char: CharacterData) {
    if (char.char_level < raid.raid_level) {
      return true
    }

    var raidFor2Week = false
    var relRaid = false
    if (raid.id === 40001 || raid.id === 40002) {
      relRaid = checkRelatedRaid(40003, char.id) || checkRelatedRaid(40004, char.id)
    } else if (raid.id === 40003 || raid.id === 40004) {
      //relRaid = checkRelatedRaid(40001, char.id) || checkRelatedRaid(40002, char.id)
    } else if (raid.id === 40005) {
      relRaid = checkRelatedRaid(40006, char.id)
    } else if (raid.id === 40006) {
      relRaid = checkRelatedRaid(40005, char.id)
    } else if (raid.id === 40007) {
      relRaid = checkRelatedRaid(40008, char.id) || checkRelatedRaid(40009, char.id)
    } else if (raid.id === 40008 || raid.id === 40009) {
      relRaid = checkRelatedRaid(40007, char.id)
    }
    if (relRaid === true) {
      return true
    }

    if (raid.id === 40001) {
      raidFor2Week = checkRelatedRaid(40002, char.id)
    } else if (raid.id === 40003) {
      raidFor2Week = checkRelatedRaid(40004, char.id)
    } else if (raid.id === 40008) {
      raidFor2Week = checkRelatedRaid(40009, char.id)
    }
    if (raidFor2Week === true) {
      return true
    }

    return false
  }


  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  if (characters.length === 0) {
    return (<Box></Box>)
  } else {
    return (
      <MainPageBox>
        <Box display="flex" position='absolute' left={0}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            style={{
              position: "relative",
              top: "10px",
              left: "30px",
            }}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackIcon style={{ fontSize: 40 }} />
          </IconButton>
        </Box>
        <Typography className='page-title'>{characters[0].char_name} 출석부</Typography>
        <Box>
          <Button variant='contained' onClick={() => {
            handleSave()
          }}>저장</Button>
        </Box>
        <Box display={'flex'}>
          <TableContainer component={Paper} sx={{ maxHeight: '85dvh', minWidth: '70dvw', overflowY: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ position: 'sticky', left: 0, zIndex: 99, fontFamily: 'S-CoreDream-3Light', fontSize: '12px' }} sx={{ minWidth: '50px', textAlign: 'center', borderRight: '2px #f3e07c solid', borderBottom: '2px #f3e07c solid' }}>레이드</TableCell>
                  <TableCell sx={{ minWidth: '30px', textAlign: 'center', borderBottom: '2px #f3e07c solid' }} style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '12px' }}>참가</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {raids.filter(raid => raid.id >= 40003).map((raid: RaidData) => (
                  <TableRow key={raid.id} style={{ textAlign: 'center' }}>
                    <TableCell sx={{ minWidth: '80px', borderBottom: '2px #f3e07c solid', background: raid.raid_color, color: '#fff' }} key={raid.id} align='center'>
                      <Typography style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '12px' }}>{raid.raid_name}</Typography>
                      <Typography style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '10px' }}>{raid.raid_level}</Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        disabled={checkRaidDisabled(raid, characters[0])}
                        checked={raid.raid_group.includes(characterId)}
                        onChange={(e) => {
                          handleCheckboxChange(raid.id, characterId)
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainPageBox>
    )
  }
}