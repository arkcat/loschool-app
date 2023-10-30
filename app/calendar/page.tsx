'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

import { useSearchParams } from 'next/navigation'
import { getPlainText } from '@/utils/TextUtils'
import { PartyData, RaidData, CharacterData, days, daysOfWeek, timeSlots, MemberData } from '@/lib/database.types'
import { getDayBgColor, getDayHeadBgColor } from '@/utils/ColorUtils'
import { Card, CardContent, Typography, Tooltip, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Tabs, useMediaQuery, Tab } from '@mui/material'

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

  function makeEmptyCharacter(key: string, index: number, showRemove: boolean = false, partyId: number = 0) {
    return (
      <Card key={key}
        style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', height: '30px', marginTop: '3px' }}>
        <CardContent style={{ padding: '0 10px' }}>
          <Typography style={{ fontSize: '12px', fontFamily: 'SUIT-Regular' }}>{index === 3 || index === 7 ? "서폿" : "딜러"}</Typography>
        </CardContent>
      </Card>
    )
  }

  function makeCharacter(key: string, character: CharacterData, showRemove: boolean = false, partyId: number = 0) {
    const member = memberData.filter(member => member.id === character.member_id)[0]
    const bgColor = member?.personal_color
    const textColor = member?.text_color

    return (
      <Tooltip title={member?.nick_name}>
        <Card key={key}
          style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', backgroundColor: bgColor, color: textColor, minHeight: '30px', marginTop: '3px' }}>
          <CardContent style={{ padding: '0 10px' }}>
            <Typography style={{ fontSize: '14px', fontFamily: 'SUIT-Regular' }}>{character.char_name} [{character.char_class}]</Typography>
          </CardContent>
        </Card>
      </Tooltip>
    )
  }

  function isDealer(id: number): boolean {
    const character = characterData.filter(character => character.id == id)[0]
    if (character === undefined) return false
    return character.char_type === 'D'
  }

  function isSupporter(id: number): boolean {
    const character = characterData.filter(character => character.id == id)[0]
    if (character === undefined) return false
    return character.char_type === 'S'
  }

  function makePartyBox(partyData: PartyData, index: number) {
    const raidInfo = raidData[partyData.raid_id]
    if (raidInfo === undefined) {
      return <Box></Box>
    }

    const dealerCount = partyData.member.filter(id => isDealer(id)).length
    const supperterCount = partyData.member.filter(id => isSupporter(id)).length
    const remainingDealers = dealerCount < 6 ? 6 - dealerCount : 0
    const remainingSupporters = supperterCount < 2 ? 2 - supperterCount : 0

    if (partyData.member.map((id) => {
      const hasCharacter = characterData.filter(character => character.id === id && character.member_id === currentMember?.id).length > 0
      if (hasCharacter) {
        partyStates[partyData.id] = true
      }
    }))

      return (
        <Box
          marginBottom={1}
          border={1}
          borderRadius={6}
          padding={2}
          bgcolor={raidInfo.raid_color}
          borderColor={raidInfo.raid_color}
          boxShadow={2}>
          <Typography style={{ fontFamily: 'NanumBarunGothic', fontSize: 14, color: 'white' }} onClick={() => handleToggle(partyData.id)}>
            {raidInfo.raid_name + ` ${dealerCount + supperterCount}/8`} <br />
            {remainingDealers > 0 && `랏딜: ${remainingDealers}`} {remainingSupporters > 0 && ` 랏폿: ${remainingSupporters}`}
          </Typography>

          <Box marginTop={1} sx={{ display: partyStates[partyData.id] ? 'block' : 'none', padding: '1px' }}>
            {
              partyData.member.map((id, memberIdx) => {
                if (id === 0) return makeEmptyCharacter(String(partyData.id) + String(memberIdx + 900000), memberIdx, true, partyData.id)
                const character = characterData.filter(character => character.id == id)[0]
                if (character === undefined) return <Box></Box>
                return makeCharacter(String(partyData.id) + String(character.id), character, true, partyData.id)
              })
            }
          </Box>
        </Box>
      )
  }

  interface WeekData {
    hour: number,
    schedule: {
      day: string,
      parties: PartyData[]
    }[]
  }

  function wideScreenLayout() {

    const weeklyPlan: WeekData[] = []

    for (let j = 14; j <= 26; j++) {
      const hourData = partyData.filter(party => party.time === j)
      const daySchedule = []
      for (let i = 0; i < 7; i++) {
        const dayData = hourData.filter(party => party.day === i)
        daySchedule.push({ day: days[i], parties: dayData })
      }
      weeklyPlan.push({ hour: j, schedule: daySchedule })
    }

    return (
      <TableContainer sx={{ mb: 5 }} style={{ maxHeight: '800px', maxWidth: '1800px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align={'center'}
                style={{ position: 'sticky', left: 0, zIndex: 99, fontFamily: "NanumBarunGothic", fontSize: '14px' }}
                sx={{ minWidth: '30px', textAlign: 'center', backgroundColor: '#b7bd98' }}>
                시간
              </TableCell>
              {days.map((day, index) => (
                <TableCell key={index} align={'center'}
                  sx={{
                    borderLeft: 1,
                    backgroundColor: getDayHeadBgColor(day),
                    minWidth: 150,
                  }}
                  style={{
                    fontFamily: "NanumBarunGothic",
                    fontSize: '14px'
                  }}>{day}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {weeklyPlan.map((daySchedule, index) => (
              <TableRow key={index}>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    backgroundColor: '#b7bd98'
                  }}
                  style={{
                    position: 'sticky', left: 0, zIndex: 98,
                    fontFamily: "NanumBarunGothic",
                    fontSize: '14px'
                  }}
                  key={days[index]}
                  align={'center'}>{timeSlots[index]}</TableCell>
                {daySchedule.schedule.map(hourData => (
                  <TableCell key={hourData.day}
                    align={'center'}
                    sx={{ borderLeft: 1, backgroundColor: getDayBgColor(hourData.day) }}>
                    {hourData.parties.map((party, partyIndex) => (
                      <Box key={party.id}>
                        {makePartyBox(party, partyIndex)}
                      </Box>
                    ))}
                  </TableCell >
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  const isNarrowScreen = useMediaQuery('(max-width:600px)');
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (e: any, newValue: any) => {
    setSelectedTab(newValue);
  }

  function narrowScreenLayout() {
    const dailyParties: PartyData[] = partyData.filter(party => party.day === selectedTab)
    return (
      <Box display="flex" flexDirection="column" sx={{ mb: 5 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          {days.map((day, index) => (
            <Tab label={day} key={index} sx={{ minWidth: 0, fontFamily: 'Pretendard-Regular', fontWeight: 600 }} />
          ))}
        </Tabs>
        <TableContainer sx={{ maxHeight: '650px', overflow: 'auto' }}>
          {dailyParties.length > 0 ? (
            <Table stickyHeader>
              <TableBody>
                <TableRow sx={{ background: getDayBgColor(days[dailyParties[0].day]) }}>
                  <TableCell align={'center'}>
                    {dailyParties.map((party, index) => (
                      <Box key={party.id}>
                        <Typography sx={{ fontFamily: 'Pretendard-Regular', fontWeight: 600 }}>{party.time} 시</Typography>
                        {makePartyBox(party, index)}
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : <Box></Box>}
        </TableContainer>
      </Box>
    )
  }

  function generatePlan() {

    return (
      <Grid spacing={1} overflow={'auto'}>
        {isNarrowScreen ? (
          narrowScreenLayout()
        ) : (
          wideScreenLayout()
        )}
      </Grid>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100dvh">
      <Typography variant='h3' className='page-title'>이번주 시간표</Typography>
      {generatePlan()}
    </Box>
  )

}