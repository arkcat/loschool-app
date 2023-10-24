'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { Box, Button, Grid, Typography } from '@mui/material'
import ScheduleBox from '@/components/ScheduleBox'
import { getPlainText } from '@/utils/TextUtils'
import { MemberData, days, daysOfWeek, timeSlots } from '@/lib/database.types'

export default function MemberSchedulePage() {
  const searchParams = useSearchParams()
  const id = getPlainText(searchParams.get('id') || "")

  const [memberData, setMemberData] = useState<MemberData>()
  const [schedule, setSchedule] = useState<any>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('Member')
          .select()
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
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [hour]: schedule[day][hour] === 0 ? 1 : 0,
      },
    }
    setSchedule(updatedSchedule)
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center" margin={1} position="relative" height="90vh">
      <Typography variant='h3' paddingBottom={3} style={{ fontFamily: 'PuradakGentleGothicR', fontSize: '50px' }}>{memberData?.nick_name} 스케쥴</Typography>
      <Box display="flex" alignItems="center" justifyContent={'center'} sx={{ border: '1px #e6bd76 solid', backgroundColor: '#f3e07c', textAlign: 'center' }} padding='5px' marginBottom={2}>
        <Typography style={{ fontFamily: 'S-CoreDream-3Light' }}>레이드 참여 가능한 시간을 클릭하면 색상이 채워집니다.<br /> 모두 선택 후 하단에 반영 버튼을 눌러주세요.</Typography>
      </Box>
      <Box>
        {memberData && daysOfWeek.map((day, index) => (
          <Grid key={day} item container justifyContent="center" alignItems="center" border={1}>
            <Grid>
              <Typography variant="h6" align="center"><strong>{days[index]}요일</strong></Typography>
            </Grid>
            <Grid item container justifyContent="center" alignItems="center">
              {timeSlots.map(time => (
                <Grid key={time} alignItems={'center'} minHeight={35}>
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
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
          <Button variant="contained" color="primary" onClick={handleApplyClick}>
            반영
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
