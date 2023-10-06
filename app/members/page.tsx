'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { Button, Stack, Typography } from '@mui/material';


export default function MembersPage() {
    const router = useRouter()
    const [members, setMembers] = useState<any>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('Member')
                .select('id, nick_name, primary_color, text_color')
                .order('id');
            if (error) console.error('Error fetching members:', error);
            else setMembers(data);
        };

        fetchMembers();
    }, []);

    return (
        <div>
            <h1>Member 목록</h1>
            <ul>
                {members.map((member: any) => (
                    <div key={member.id}>
                        <Stack direction="row" spacing={2}>
                            <Typography onClick={() => {
                                router.push(`/members/details?id=${member.id}`)
                            }}>{member.nick_name}</Typography>

                            <Typography onClick={() => {
                                router.push(`/members/schedule?id=${member.id}`)
                            }}>스케쥴</Typography>
                        </Stack>
                    </div>
                ))}
            </ul>
        </div>
    );
}