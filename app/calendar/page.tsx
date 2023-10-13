
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, styled, tableCellClasses } from '@mui/material'
import { useSearchParams } from 'next/navigation'
import { getPlainText } from '@/utils/TextUtils'
import { PartyData } from '@/lib/database.types'

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

  useEffect(() => {
    const fetchPartyData = async () => {
      const { data, error } = await supabase.from('Party').select('*')
      if (error) {
        console.error('Error fetching party data:', error)
      } else {
        setPartyData(data as PartyData[])
      }
    }

    fetchPartyData()
  }, [])

  function generateWeeklyPlan() {
    const days = ['수', '목', '금', '토', '일', '월', '화']
    const timeSlots = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '01', '02']
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
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 800, borderTop: 1, borderRight: 1 }}>
          <Table stickyHeader aria-label="sticky table" style={{ overflowX: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell align={'center'} sx={{ borderLeft: 1 }}>요일</TableCell>
                {days.map((day, index) => (
                  <TableCell key={index} align={'center'} sx={{ borderLeft: 1 }}>{day}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklyPlan.map((daySchedule, index) => (
                <StyledTableRow key={index}>
                  <TableCell
                    key={days[index]}
                    align={'center'}
                    sx={{ borderLeft: 1 }}>{timeSlots[index]}</TableCell>
                  {daySchedule.schedule.map(hourData => (
                    <StyledTableCell key={hourData.day}
                      align={'center'}
                      sx={{ borderLeft: 1 }}>
                      {hourData.parties.map(party => (
                        <div key={party.id} className='outlined'>
                          <div>
                            raid_id: {party.raid_id}, id: {party.id}
                          </div>
                          {party.member.map((member, index) => (
                            <div key={index}>{member}</div>
                          ))}
                        </div>
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
      <Typography variant='h3' paddingBottom={3} align='center'>이번주 시간표</Typography>
      {generateWeeklyPlan()}
    </Box>
  )

}