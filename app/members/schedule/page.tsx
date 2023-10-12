'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { Box, Button, Grid, Typography } from '@mui/material'
import ScheduleBox from '@/components/ScheduleBox'
import { getPlainText } from '@/utils/TextUtils'

interface MemberData {
  id: number
  nick_name: string
  schedule: {
    [day: string]: {
      [hour: string]: number
    }
  }
}

export default function MemberSchedulePage() {
  const searchParams = useSearchParams()
  const id = getPlainText(searchParams.get('id') || "")

  const [memberData, setMemberData] = useState<MemberData | null>(null)
  const [schedule, setSchedule] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('Member')
          .select('id, uid, nick_name, schedule')
          .eq('uid', id)
          .single()

        if (data) {
          setMemberData(data)
          setSchedule(data.schedule)
        }

        if (error) {
          throw error
        }

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handleBoxClick = async (day: string, hour: string) => {
    console.log({ day }, { hour })
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [hour]: schedule[day][hour] === 0 ? 1 : 0,
      },
    }
    setSchedule(updatedSchedule)

    console.log(updatedSchedule)
  }

  const handleApplyClick = async () => {
    try {
      const { data, error } = await supabase
        .from('Member')
        .update({ schedule: schedule })
        .eq('uid', id)

      if (error) {
        throw error
      }

      alert("스케쥴 저장에 성공했습니다.")
    } catch (error) {
      console.error('Error updating schedule:', error)
    }
  }

  const daysOfWeek = ['wed', 'thu', 'fri', 'sat', 'sun', 'mon', 'tue']
  const timeSlots = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '01', '02']

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      margin={1}
    >

      <Typography variant='h3' paddingBottom={3}>{memberData?.nick_name} 스케쥴</Typography>

      <Box>
        {memberData && daysOfWeek.map(day => (
          <Grid key={day} item container justifyContent="center" alignItems="center" border={1} margin={1}>
            <Grid>
              <Typography variant="h6" align="center"><strong>{day.toUpperCase()}</strong></Typography>
            </Grid>
            <Grid item container justifyContent="center" alignItems="center" height={35}>
              {timeSlots.map(time => (
                <Grid key={time} alignItems={'center'} height={35}>
                  <ScheduleBox
                    number={time}
                    value={memberData.schedule[day][time]}
                    onClick={() => handleBoxClick(day, time)}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
          <Button variant="outlined" color="primary" onClick={handleApplyClick}>
            반영
          </Button>
        </div>
      </Box>
    </Box>
  )
}
