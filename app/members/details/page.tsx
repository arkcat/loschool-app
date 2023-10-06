'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Button, TextField } from '@mui/material';

export default function MemberDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || ""

  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select('id, nick_name, primary_color, text_color')
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching member:', error);
      else setMember(data);
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handleUpdateMember = async () => {
    try {
      const { error } = await supabase
        .from('Member')
        .update({
          nick_name: member.nick_name,
          primary_color: member.primary_color,
          text_color: member.text_color,
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      console.log('Member 정보가 업데이트되었습니다.');
    } catch (error: any) {
      console.error('Error updating member:', error.message);
    }
  };

  return (
    <div>
      {member && (
        <div>
          <h1>{member.nick_name} 수정</h1>
          <div>
            <label>Nick Name:</label>
            <TextField
              size='small'
              type="text"
              value={member.nick_name}
              onChange={(e) =>
                setMember({ ...member, nick_name: e.target.value })
              }
            />
          </div>
          <div>
            <label>Primary Color:</label>
            <TextField
              size='small'
              type="text"
              value={member.primary_color}
              onChange={(e) =>
                setMember({ ...member, primary_color: e.target.value })
              }
            />
          </div>
          <div>
            <label>Text Color:</label>
            <TextField
              size='small'
              type="text"
              value={member.text_color}
              onChange={(e) =>
                setMember({ ...member, text_color: e.target.value })
              }
            />
          </div>
          <Button variant='contained' onClick={handleUpdateMember}>저장</Button>
        </div>
      )}
    </div>
  );
}