'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Button, Grid, Typography } from '@mui/material';
import ScheduleBox from '@/components/ScheduleBox';

interface MemberData {
  id: number;
  nick_name: string;
  schedule: {
    [day: string]: {
      [hour: string]: number;
    };
  };
}

export default function MemberSchedulePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || ""

  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [schedule, setSchedule] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from('Member')
          .select('id, nick_name, schedule')
          .eq('id', id)
          .single();

        if (data) {
          setMemberData(data)
          setSchedule(data.schedule)
        }

        console.log(memberData)

        if (error) {
          throw error;
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBoxClick = async (day: string, hour: string) => {
    console.log({ day }, { hour })
    const updatedSchedule = {
      ...schedule,
      [day]: {
        ...schedule[day],
        [hour]: schedule[day][hour] === 0 ? 1 : 0,
      },
    };
    setSchedule(updatedSchedule);

    console.log(updatedSchedule)
  };

  const handleApplyClick = async () => {
    try {
      const { data, error } = await supabase
        .from('Member')
        .update({ schedule: schedule })
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('Schedule updated successfully:', data);
    } catch (error) {
      console.error('Error updating schedule:', error);
    }
  };

  const daysOfWeek = ['wed', 'thu', 'fri', 'sat', 'sun', 'mon', 'tue'];
  const timeSlots = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '01', '02']

  return (
    <div style={{padding:'45px'}}>
      <Typography variant='h3' paddingBottom={3} align='center'>{memberData?.nick_name} 스케쥴</Typography>

      {memberData && daysOfWeek.map(day => (
        <Grid container key={day}>
          <Grid item xs>
            <Typography variant="h6" align="center" width={60}>{day.toUpperCase()}</Typography>
          </Grid>
          {timeSlots.map(time => (
            <Grid item key={time}>
              <ScheduleBox
                number={time}
                value={memberData.schedule[day][time]}
                onClick={() => handleBoxClick(day, time)}
              />
            </Grid>
          ))}
        </Grid>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px'}}>
      <Button variant="outlined" color="primary" onClick={handleApplyClick}>
        반영
      </Button>
      </div>
    </div>
  );
}
