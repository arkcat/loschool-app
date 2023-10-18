'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { Box, Button, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { getPlainText } from '@/utils/TextUtils'
import { PartyData, RaidData, CharacterData, days, daysOfWeek, timeSlots, MemberData } from '@/lib/database.types'
import { getDayBgColor } from '@/utils/ColorUtils'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  }
}))

export default function WeeklyPlan() {

  const searchParams = useSearchParams()
  const id = getPlainText(searchParams.get('id') || "")

  const [partyData, setPartyData] = useState<PartyData[]>([])
  const [raidData, setRaidData] = useState<RaidData[]>([])
  const [characterData, setCharacterData] = useState<CharacterData[]>([])
  const [memberData, setMemberData] = useState<MemberData[]>([])
  const [currentMember, setCurrentMember] = useState<MemberData>()
  useEffect(() => {
    const fetchPartyData = async () => {
      const { data, error } = await supabase.from('Party').select('*')
      if (error) {
        console.error('Error fetching party data:', error)
      } else {
        setPartyData(data as PartyData[])
      }
    }

    const fetchRaidData = async () => {
      const { data, error } = await supabase
        .from('Raid')
        .select()
        .order('id')

      if (data) {
        console.log('complete fetch raid data')
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
        console.log('complete fetch character data')
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
        console.log('complete fetch member data')
        setMemberData(data)
        const member = data.find(d => d.uid === id)
        setCurrentMember(member)
      } else {
        console.error('Error fetching member data:', error)
      }
    }

    fetchPartyData()
    fetchRaidData()
    fetchCharacterData()
    fetchMemberData()
  }, [])

  const [partyStates, setPartyStates] = useState(
    partyData.reduce((acc: any, party) => {
      acc[party.id] = false
      return acc
    }, {})
  )

  const handleToggle = (id: number) => {
    setPartyStates((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }))
  }

  function makeCharacter(key: string, character: CharacterData, showRemove: boolean = false, partyId: number = 0) {
    const member = memberData.filter(member => member.id === character.member_id)[0]
    const bgColor = member?.personal_color
    const textColor = member?.text_color

    return (
      <Card key={key}
        style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', backgroundColor: bgColor, color: textColor, height: '30px', marginTop: '3px' }}>
        <CardContent style={{ padding: '0 10px' }}>
          <Typography style={{ fontSize: '12px' }}>{character.char_name} {character.char_class}</Typography>
        </CardContent>
      </Card>
    )
  }

  function makePartyBox(partyData: PartyData, index: number) {
    const raidInfo = raidData[partyData.raid_id]
    if (raidInfo === undefined) {
      return <Box></Box>
    }

    if (partyData.member.map((id) => {
      const hasCharacter = characterData.filter(character => character.id === id && character.member_id === currentMember?.id).length > 0
      if (hasCharacter) {
        partyStates[partyData.id] = true
      }
    }))

      return (
        <Box
          marginBottom={1}
          border={2}
          borderRadius={1}
          padding={1}
          bgcolor={raidInfo.raid_color}
          borderColor={raidInfo.raid_color}>
          <Typography marginBottom={1} fontSize={15} style={{ color: 'white' }} onClick={() => handleToggle(partyData.id)}>{raidInfo.raid_name}</Typography>
          <Box sx={{ display: partyStates[partyData.id] ? 'block' : 'none', padding: '1px' }}>
            {
              partyData.member.map((id) => {
                const character = characterData.filter(character => character.id == id)[0]
                if (character === undefined) return <Box></Box>
                return makeCharacter(String(partyData.id) + String(character.id), character, true, partyData.id)
              })
            }
          </Box>
        </Box>
      )
  }

  function generateWeeklyPlan() {

    const weeklyPlan = []

    for (let j = 13; j <= 26; j++) {
      const hourData = partyData.filter(party => party.time === j)
      const daySchedule = []
      for (let i = 0; i < 7; i++) {
        const dayData = hourData.filter(party => party.day === i)
        daySchedule.push({ day: days[i], parties: dayData })
      }
      weeklyPlan.push({ hour: j, schedule: daySchedule })
    }

    return (
      <Paper sx={{ overflow: 'hidden', padding: 1 }}>
        <TableContainer sx={{ maxHeight: 800, border: 1, margin: 1 }}>
          <Table stickyHeader aria-label="sticky table" style={{ overflowX: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell align={'center'}>요일</TableCell>
                {days.map((day, index) => (
                  <TableCell key={index} align={'center'} sx={{
                    borderLeft: 1,
                    backgroundColor: getDayBgColor(day)
                  }}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklyPlan.map((daySchedule, index) => (
                <StyledTableRow key={index}>
                  <TableCell
                    key={days[index]}
                    align={'center'}>{timeSlots[index]}</TableCell>
                  {daySchedule.schedule.map(hourData => (
                    <StyledTableCell key={hourData.day}
                      align={'center'}
                      sx={{ borderLeft: 1, backgroundColor: getDayBgColor(hourData.day) }}>
                      {hourData.parties.map((party, partyIndex) => (
                        <Box key={party.id}>
                          {makePartyBox(party, partyIndex)}
                        </Box>
                      ))}
                    </StyledTableCell >
                  ))}
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    )
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin={1}
    >
      <Typography variant='h3' align='center'>이번주 시간표</Typography>
      {generateWeeklyPlan()}
    </Box>
  )

}