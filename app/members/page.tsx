'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';
import { Button, Stack, Typography } from '@mui/material';
import { getBase64Text } from '@/utils/TextUtils';
import { supabaseAdmin } from '@/utils/supabaseAdmin'

export default function MembersPage() {
    const router = useRouter()
    const [members, setMembers] = useState<any>([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('Member')
                .select('id, uid, nick_name, personal_color, text_color')
                .order('id');
            if (error) console.error('Error fetching members:', error);
            else setMembers(data);
        };

        fetchMembers();
    }, []);

    const updateMemberList = async () => {
        const { data, error } = await supabase
            .from('Member')
            .select('id, uid, nick_name, personal_color, text_color')
            .order('id');
        if (error) console.error('Error fetching members:', error);
        else setMembers(data);
    }

    const deleteMember = async (name: string, uid: string) => {
        const { data, error } = await supabaseAdmin.auth.admin.deleteUser(uid);
        if (error) {
            console.error("유저 삭제 실패")
            return
        }

        const deletePromises = members.map(async (member: any) => {
            const { error: deleteError } = await supabase
                .from('Member')
                .delete()
                .eq('uid', uid);

            if (deleteError) {
                throw deleteError;
            }

            updateMemberList()
        });

        await Promise.all(deletePromises);

        console.log(`${name} 유저 삭제`)
    }

    return (
        <div>
            <h1>Member 목록</h1>
            <ul>
                {members.map((member: any) => (
                    <div key={member.id}>
                        <Stack direction="row" spacing={2}>
                            <Typography onClick={() => {
                                router.push(`/members/details?id=${getBase64Text(String(member.id))}`)
                            }}>{member.nick_name}</Typography>

                            <Typography onClick={() => {
                                router.push(`/members/schedule?id=${getBase64Text(String(member.id))}`)
                            }}>스케쥴</Typography>

                            <Button onClick={() => {
                                const shouldDelete = window.confirm(`[${member.nick_name}] 정말로 삭제하시겠습니까?`);
                                if (shouldDelete) {
                                    deleteMember(member.nick_name, member.uid)
                                }
                            }}>삭제</Button>
                        </Stack>
                    </div>
                ))}
            </ul>
        </div>
    );
}