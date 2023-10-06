'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Box, Stack } from '@mui/material';
import { CheckBox } from '@mui/icons-material';

export default function MemberSchedulePage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || ""

  const [schedule, setSchedule] = useState([]);
  const [updatedSchedule, setUpdatedSchedule] = useState<boolean[]>([false]);

  useEffect(() => {
    const fetchSchedule = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select('schedule')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching schedule:', error);
      else setSchedule(data.schedule);
    };

    if (id) {
      fetchSchedule();
    }
  }, [id]);

  const handleCheckboxChange = (index: number) => {
    const newSchedule: boolean[] = [...updatedSchedule];
    newSchedule[index] = !newSchedule[index];
    setUpdatedSchedule(newSchedule);
  };

  const handleApplyChanges = async () => {
    // 업데이트 로직을 여기에 추가
  };

  return (
    <div>
      <Stack direction="row"> 스케줄</Stack>
      <Stack spacing={0.5}>
        {['수', '목', '금','토','일','월','화'].map((item) => (
          <Stack key={item} direction="row" spacing={0.5}>
            {['10', '11', '12'].map((sitem) => (
              <CheckBox key={sitem} onClick={() => {
                console.log(item, sitem)
              }}/>
            ))}
          </Stack>
        ))}
      </Stack >
    </div>
  );
}
