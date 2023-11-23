'use client'

import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Paper, Select, TextField, Typography, useMediaQuery } from '@mui/material'
import { CharacterData, MemberData, PartyData, RaidData, days, daysOfWeek, timeSlots } from '@/lib/database.types'
import { supabase } from '@/utils/supabase'
import { getDayBgColor, hexToRgba } from '@/utils/ColorUtils'
import SearchIcon from '@mui/icons-material/SearchOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import MainPageBox from '@/components/MainPageBox'
import useRequireAuth from '@/utils/AuthUtils'
export const dynamic = 'force-dynamic'

export default function PartyPage() {
  const [partyData, setPartyData] = useState<PartyData[]>([])
  const [raidData, setRaidData] = useState<RaidData[]>([])
  const [characterData, setCharacterData] = useState<CharacterData[]>([])
  const [memberData, setMemberData] = useState<MemberData[]>([])
  const isNarrowScreen = useMediaQuery('(max-width:600px)');
  useEffect(() => {

    const fetchPartyData = async () => {
      const { data, error } = await supabase
        .from('Party')
        .select()
        .order('id')

      if (data) {
        setPartyData(data)
      } else {
        console.error('Error fetching party data:', error)
      }
    }

    const fetchRaidData = async () => {
      const { data, error } = await supabase
        .from('Raid')
        .select()
        .order('id')

      if (data) {
        setRaidData(data)
      } else {
        console.error('Error fetching raid data:', error)
      }
    }

    const fetchCharacterData = async () => {
      const { data, error } = await supabase
        .from('Character')
        .select()
        .order('id')

      if (data) {
        setCharacterData(data)
      } else {
        console.error('Error fetching character data:', error)
      }
    }

    const fetchMemberData = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .order('id')

      if (data) {
        setMemberData(data)
      } else {
        console.error('Error fetching member data:', error)
      }
    }

    fetchMemberData()
    fetchCharacterData()
    fetchRaidData()
    fetchPartyData()
  }, [])

  const [selectedRaid, setSelectedRaid] = useState<string>('0')
  const [selectedDay, setSelectedDay] = useState<string>('0')
  const [selectedTime, setSelectedTime] = useState<string>('0')
  const [searchCharacterName, setSearchCharacterName] = useState<string>('')

  function getFilteredCharacters(): CharacterData[] {
    const currentRaidInfo = raidData[parseInt(selectedRaid)]
    const day = daysOfWeek[parseInt(selectedDay)]
    const time = timeSlots[parseInt(selectedTime)]

    if (searchCharacterName.length > 0) {
      return characterData.filter(character => {
        const regex = new RegExp(searchCharacterName, 'i')
        return regex.test(character.char_name)
      })
    }

    if (currentRaidInfo) {
      const includeRaidCharacters = characterData.filter(character => currentRaidInfo.raid_group.includes(character.id))
      const canMembers = memberData.filter(member => member.schedule_check === true && member.schedule[day][time] === 1)
      const canCharacters = includeRaidCharacters.filter(character => canMembers.filter(member => member.id === character.member_id).length > 0)
      return canCharacters
    } else {
      return []
    }
  }

  const sortedPartyData = useMemo(() => {
    // day 값에 따라 분류
    const groupedByDay = partyData.reduce((acc: any, data) => {
      const { day } = data;
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(data);
      return acc;
    }, {});

    // time 값에 따라 정렬
    Object.keys(groupedByDay).forEach(day => {
      groupedByDay[day].sort((a: any, b: any) => a.time - b.time);
    });

    return groupedByDay as PartyData[][];
  }, [partyData]);

  const handleAddParty = () => {
    let id;

    if (partyData.length === 0) {
      id = 0
    } else {
      id = partyData[partyData.length - 1].id
    }

    const selectedRaidId = parseInt(selectedRaid)
    const selectedDayInt = parseInt(selectedDay)
    const selectedTimeInt = parseInt(timeSlots[parseInt(selectedTime)])

    const newParty = {
      id: id + 1,
      raid_id: selectedRaidId,
      member: [0, 0, 0, 0, 0, 0, 0, 0],
      day: selectedDayInt,
      time: selectedTimeInt
    }

    setPartyData(prevPartyData => [...prevPartyData, newParty])
  }

  const handleDeleteAllParty = () => {
    const shouldDelete = window.confirm('모든 파티를 삭제하시겠습니까?')
    if (shouldDelete) {
      setPartyData([])
    }
  }

  const handleDeleteParty = (id: number) => {
    const shouldDelete = window.confirm(`이 파티를 삭제하시겠습니까?`)
    if (shouldDelete) {
      setPartyData(prevPartyData => prevPartyData.filter(party => party.id !== id));
    }
  }

  const saveParties = async () => {
    try {
      console.log(partyData)
      const shouldDelete = window.confirm(`파티 정보를 저장하시겠습니까?`)
      if (shouldDelete) {
        const { error: deleteError } = await supabase
          .from('Party')
          .delete()
          .neq('day', -1)

        if (deleteError) {
          console.error(deleteError)
          throw new Error("파티 정보 삭제 에러")
        }

        const { error: insertError } = await supabase
          .from('Party')
          .insert(partyData)

        if (insertError) {
          console.error(insertError)
          throw new Error("파티 정보 추가 에러")
        }

        alert('파티 정보를 저장했습니다.')
      }
    } catch (error) {
      console.error("파티 정보 변경 에러 : ", error)
    }
  }

  function handleDragStart(e: any, character: CharacterData) {
    e.dataTransfer?.setData('characterId', character.id);
    e.dataTransfer?.setData('characterType', character.char_type);
  }

  function handleRightClick(e: any, showRemove: boolean, character: CharacterData, partyId: number) {
    e.preventDefault();
    if (!showRemove) return
    removeCharacterFromParty(partyId, character.id)
  }

  function handleDrop(e: any, partyData: PartyData) {
    e.preventDefault();
    const characterId = parseInt(e.dataTransfer?.getData('characterId'))
    const characterType = e.dataTransfer?.getData('characterType')
    const partyId = partyData.id

    setPartyData(prevPartyData => {
      return prevPartyData.map(party => {
        if (party.id === partyId) {
          let updatedGroup = [...party.member]

          if (characterType === "D") {
            if (updatedGroup[0] === 0) {
              updatedGroup[0] = characterId;
            } else if (updatedGroup[1] === 0) {
              updatedGroup[1] = characterId;
            } else if (updatedGroup[2] === 0) {
              updatedGroup[2] = characterId;
            } else if (updatedGroup[4] === 0) {
              updatedGroup[4] = characterId;
            } else if (updatedGroup[5] === 0) {
              updatedGroup[5] = characterId;
            } else if (updatedGroup[6] === 0) {
              updatedGroup[6] = characterId;
            }
          } else if (characterType === "S") {
            if (updatedGroup[3] === 0) {
              updatedGroup[3] = characterId;
            } else if (updatedGroup[7] === 0) {
              updatedGroup[7] = characterId;
            }
          }

          return { ...party, member: updatedGroup }
        }
        return party
      })
    })
  }

  function handleDragOver(e: any) {
    e.preventDefault();
  }

  function removeCharacterFromParty(partyId: number, characterId: number) {
    console.log("Remove : ", partyId, characterId)
    setPartyData(prevPartyData => {
      return prevPartyData.map(party => {
        if (party.id === partyId) {
          const updatedGroup = party.member.map(id => {
            if (id === characterId) {
              return 0;
            }
            return id;
          });
          return { ...party, member: updatedGroup }
        }
        return party
      })
    })
  }

  function makePartyBox(partyData: PartyData) {
    const raidInfo = raidData[partyData.raid_id]
    if (raidInfo === undefined) {
      return <Box></Box>
    }

    const selectedRaidId = parseInt(selectedRaid)
    const selectedDayInt = parseInt(selectedDay)
    const selectedTimeInt = parseInt(timeSlots[parseInt(selectedTime)])
    const selected = (partyData.raid_id === selectedRaidId && partyData.day === selectedDayInt && partyData.time === selectedTimeInt)
    return (
      <Box
        key={partyData.id}
        marginBottom={1}
        border={selected ? 3 : 1}
        borderRadius={1}
        padding={1}
        bgcolor={raidInfo.raid_color}
        borderColor={selected ? 'red' : raidInfo.raid_color}
        boxShadow={selected ? 1 : 2}
        onClick={() => {
          setSelectedRaid(String(partyData.raid_id))
          setSelectedDay(String(partyData.day))
          setSelectedTime(String(timeSlots.indexOf(String(partyData.time))))
        }}
        onDrop={(e) => handleDrop(e, partyData)}
        onDragOver={(e) => handleDragOver(e)}>
        <Typography fontSize={15} style={{ color: 'white', display: 'flex', justifyContent: 'space-between' }} >{raidInfo.short_name}
          <DeleteIcon style={{ fontSize: 17 }} onClick={() => { handleDeleteParty(partyData.id) }} />
        </Typography>
        <Typography marginBottom={1} fontSize={14} style={{ color: 'white' }}>{days[partyData.day]}요일, {partyData.time}시</Typography>
        {
          partyData.member.map((id, characterIdx) => {
            if (id === 0) return makeEmptyCharacter(String(partyData.id) + String(characterIdx + 900000), characterIdx, true, partyData.id)
            const character = characterData.filter(character => character.id == id)[0]
            if (character === undefined) return <Box></Box>
            return makeCharacter(String(partyData.id) + String(character.id), character, true, partyData.id)
          })
        }
      </Box>
    )
  }

  function makeEmptyCharacter(key: string, index: number, showRemove: boolean = false, partyId: number = 0) {
    return (
      <Card key={key}
        style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', height: '30px', marginTop: '3px' }}>
        <CardContent style={{ padding: '0 10px' }}>
          <Typography style={{ fontSize: '12px' }}>{index === 3 || index === 7 ? "서폿" : "딜러"}</Typography>
        </CardContent>
      </Card>
    )
  }

  function makeCharacter(key: string, character: CharacterData, showRemove: boolean = false, partyId: number = 0) {
    const member = memberData.filter(member => member.id === character.member_id)[0]
    const bgColor = member?.personal_color
    const textColor = member?.text_color

    return (
      <Card key={key}
        style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', backgroundColor: bgColor, color: textColor, height: '30px', marginTop: '3px' }}
        draggable={!showRemove}
        onDragStart={(e) => handleDragStart(e, character)}
        onContextMenu={(e) => handleRightClick(e, showRemove, character, partyId)}>
        <CardContent style={{ padding: '0 10px' }}>
          <Typography style={{ fontSize: '12px' }}>{character.char_name} {character.char_class} {!showRemove && character.char_level}</Typography>
        </CardContent>
      </Card>
    )
  }

  function checkEntryCharacter(characterId: number): boolean {
    const raidId = parseInt(selectedRaid)
    var filteredParties = []
    if (raidId === 0 || raidId === 1) {
      filteredParties = partyData
        .filter(p => p.raid_id === 0 || p.raid_id === 1)
    } else if (raidId === 2 || raidId === 3) {
      filteredParties = partyData
        .filter(p => p.raid_id === 2 || p.raid_id === 3)
    } else if (raidId === 7 || raidId === 8) {
      filteredParties = partyData
        .filter(p => p.raid_id === 7 || p.raid_id === 8)
    } else {
      filteredParties = partyData
        .filter(p => p.raid_id === raidId)
    }
    const includedParty = filteredParties
      .filter(p => p.member.includes(characterId)).length
    return includedParty > 0
  }

  const getCharacterIDsInParty = useMemo((): number[] => {
    const day = parseInt(selectedDay)
    const time = parseInt(timeSlots[parseInt(selectedTime)])
    const ids = partyData
      .filter(party => party.day === day && party.time === time)
      .map(party => party.member)
      .reduce((acc, curr) => {
        curr.forEach(item => {
          if (!acc.includes(item)) {
            acc.push(item)
          }
        })
        return acc;
      }, [])
      .map(id => {
        return characterData.filter(c => c.id === id)
          .map(c => c.member_id)
      })
      .reduce((acc, curr) => {
        curr.forEach(item => {
          if (!acc.includes(item)) {
            acc.push(item)
          }
        })
        return acc;
      }, [])

    return ids
  }, [selectedDay, selectedTime, partyData])

  function handleAddCharacterToParty(e: any, character: CharacterData): void {
    e.preventDefault();
    console.log(selectedRaid, selectedDay, selectedTime)
    const selectedRaidId = parseInt(selectedRaid)
    const selectedDayInt = parseInt(selectedDay)
    const selectedTimeInt = parseInt(timeSlots[parseInt(selectedTime)])
    const characterId = character.id
    const characterType = character.char_type
    console.log(selectedRaidId, selectedDayInt, selectedTimeInt)
    setPartyData(prevPartyData => {
      return prevPartyData.map(party => {
        if (party.raid_id === selectedRaidId && party.day === selectedDayInt && party.time === selectedTimeInt) {
          console.log("found raid party")
          let updatedGroup = [...party.member]

          if (characterType === "D") {
            if (updatedGroup[0] === 0) {
              updatedGroup[0] = characterId;
            } else if (updatedGroup[1] === 0) {
              updatedGroup[1] = characterId;
            } else if (updatedGroup[2] === 0) {
              updatedGroup[2] = characterId;
            } else if (updatedGroup[4] === 0) {
              updatedGroup[4] = characterId;
            } else if (updatedGroup[5] === 0) {
              updatedGroup[5] = characterId;
            } else if (updatedGroup[6] === 0) {
              updatedGroup[6] = characterId;
            }
          } else if (characterType === "S") {
            if (updatedGroup[3] === 0) {
              updatedGroup[3] = characterId;
            } else if (updatedGroup[7] === 0) {
              updatedGroup[7] = characterId;
            }
          }

          return { ...party, member: updatedGroup }
        }
        console.log("not found raid party")
        return party
      })
    })
  }

  function makeCandiCharacter(key: string, character: CharacterData) {
    const member = memberData.filter(member => member.id === character.member_id)[0]
    const bgColor = member?.personal_color
    const textColor = member?.text_color

    const entyCharacter = checkEntryCharacter(character.id)
    const otherCharacterInParty = getCharacterIDsInParty.includes(character.member_id)

    const dragable = !(entyCharacter || otherCharacterInParty)
    return (
      <Card key={key}
        style={{
          position: 'relative',
          display: 'flex', alignItems: 'center', border: '1px solid #ccc',
          backgroundColor: bgColor,
          color: textColor, height: '30px', marginTop: '3px'
        }}
        draggable={dragable}
        onDragStart={(e) => handleDragStart(e, character)}
        onContextMenu={(e) => {
          if (dragable) {
            handleAddCharacterToParty(e, character)
          }
        }}>
        {!dragable && (
          <Box style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.8)',
          }}
            alignItems="center" justifyContent="center"
          >
            <Typography style={{ fontFamily: 'S-CoreDream-3Light', fontWeight: 600, fontSize: '18px', color: '#fff', textAlign: 'center' }}>편성중</Typography>
          </Box>
        )}

        <CardContent style={{ padding: '0 10px' }}>
          <Typography style={{ fontSize: '12px' }}>{character.char_name} {character.char_class} {character.char_level}</Typography>
        </CardContent>
      </Card>
    )
  }

  function showTopMenu() {
    if (raidData.length === 0) return <Box></Box>

    return (
      <Box display="flex">
        <Box display="flex" flex={1} justifyContent="flex-start" paddingLeft={3} gap={2}>
          <Button variant='contained'
            onClick={saveParties}>파티 편성 확정</Button>
        </Box>
        <Box display="flex" flex={1} justifyContent="flex-end" paddingRight={3} gap={2}>
          <Select value={selectedRaid} onChange={(e) => {
            setSelectedRaid(e.target.value)
          }}>
            {raidData?.map((raid, index) => {
              return <MenuItem key={raid.id} value={index}>{raid.raid_name}</MenuItem>
            })}
          </Select>
          <Select value={selectedDay} onChange={(e) => {
            setSelectedDay(e.target.value)
          }}>
            {days?.map((day, index) => {
              return <MenuItem key={day} value={index}>{day}요일</MenuItem>
            })}
          </Select>
          <Select value={selectedTime} onChange={(e) => {
            setSelectedTime(e.target.value)
          }}>
            {timeSlots?.map((time, index) => {
              return <MenuItem key={time} value={index}>{time}시</MenuItem>
            })}
          </Select>
          <Button variant='contained'
            onClick={handleAddParty}>추가</Button>
          <Button variant='contained'
            onClick={handleDeleteAllParty}>전체 삭제</Button>
        </Box>
      </Box>)
  }

  const tableData = days.map((day, index) => {
    const partyArray = sortedPartyData[index] || [];
    return {
      day,
      index,
      parties: partyArray
    };
  });

  const PartyComponent: React.FC<{ party: any }> = ({ party }) => {
    return (
      <Paper style={{ margin: '10px 10px' }}>
        {makePartyBox(party)}
      </Paper>
    );
  };

  const DayComponent: React.FC<{ dayData: any }> = ({ dayData }) => {
    return (
      <Grid item xs borderLeft={1} borderTop={1} bgcolor={getDayBgColor(dayData.day)}>
        <Typography variant="h6" borderBottom={1} style={{ textAlign: 'center' }} onClick={() => { setSelectedDay(String(dayData.index)) }}>{dayData.day}</Typography>
        {dayData.parties.map((party: any) => (
          <PartyComponent key={party.id} party={party} />
        ))}
      </Grid>
    );
  };

  const TableComponent = () => {
    return (
      <Grid container sx={{ height: '100%' }}>
        {tableData.map(dayData => (
          <DayComponent key={dayData.day} dayData={dayData} />
        ))}
      </Grid>
    );
  };

  const [showSearch, setShowSearch] = useState<boolean>(false)

  function narrowScreenPage() {
    return (
      <Box pb={3} pt={8} sx={{ width: '100dvw' }}>
        <Box display="flex">
          <Box display="flex" flex={1} justifyContent="flex-start" paddingLeft={2} gap={2}>
            <Button variant='contained'
              onClick={saveParties}>파티 편성 확정</Button>
          </Box>
          <Box display="flex" flex={1} justifyContent="flex-end" paddingRight={2} gap={2}>
            <Select value={selectedDay} onChange={(e) => {
              setSelectedDay(e.target.value)
            }}>
              {days?.map((day, index) => {
                return <MenuItem key={day} value={index}>{day}요일</MenuItem>
              })}
            </Select>
          </Box>
        </Box>

        <Box display="flex" padding={2} style={{ height: '74dvh' }}>
          <Box flex={1} border={1} style={{ overflowY: 'auto' }} padding={1}>
            <Typography variant='h6' borderBottom={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>캐릭터 목록
              <IconButton onClick={() => { setShowSearch(true) }}>
                <SearchIcon />
              </IconButton>
            </Typography>
            <Box>
              {showSearch === true ?
                <TextField
                  size='small'
                  type="text"
                  sx={{ marginTop: 1, marginBottom: 1 }}
                  fullWidth
                  value={searchCharacterName}
                  onChange={(e) =>
                    setSearchCharacterName(e.target.value)
                  }
                /> : <Box></Box>
              }
            </Box>
            {
              getFilteredCharacters().map((character) => {
                return makeCandiCharacter(String(character.id), character)
              })
            }
          </Box>
          <Box flex={1} border={1} sx={{ overflowY: 'auto' }} marginLeft={2}>
            {tableData.filter(dayData => dayData.day === days[parseInt(selectedDay)]).map(dayData => (
              <DayComponent key={dayData.day} dayData={dayData} />
            ))}
          </Box>
        </Box>
      </Box>
    )
  }

  function wideScreenPage() {
    return (
      <Box pb={3} pt={10} sx={{ width: '90dvw' }}>
        {showTopMenu()}
        <Box display="flex" padding={2} style={{ height: '80dvh' }}>
          <Box flex={1} border={1} style={{ overflowY: 'auto' }} padding={1}>
            <Typography variant='h6' borderBottom={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>캐릭터 목록
              <IconButton onClick={() => { setShowSearch(true) }}>
                <SearchIcon />
              </IconButton>
            </Typography>
            <Box>
              {showSearch === true ?
                <TextField
                  size='small'
                  type="text"
                  sx={{ marginTop: 1, marginBottom: 1 }}
                  fullWidth
                  value={searchCharacterName}
                  onChange={(e) =>
                    setSearchCharacterName(e.target.value)
                  }
                /> : <Box></Box>
              }
            </Box>
            {
              getFilteredCharacters().map((character) => {
                return makeCandiCharacter(String(character.id), character)
              })
            }
          </Box>
          <Box flex={6} borderRight={1} borderTop={1} borderBottom={1} style={{ overflowY: 'auto' }} marginLeft={2}>
            <Typography variant='h6' borderLeft={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>파티 목록</Typography>
            <TableComponent />
          </Box>
        </Box>
      </Box>
    )
  }

  function makePartyPage() {
    return (
      <Box>
        {isNarrowScreen ? (
          narrowScreenPage()
        ) : (
          wideScreenPage()
        )}
      </Box>
    )
  }

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  return (
    <MainPageBox>
      {makePartyPage()}
    </MainPageBox>
  )
}
