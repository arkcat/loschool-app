'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { Hash } from 'crypto';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [members, setMemebers] = useState<any>([])

    useEffect(() => {
        const fetchMembers = async () => {
            console.log("Load members")
            const { data, error } = await supabase
                .from('Member')
                .select('id, nick_name, primary_color, text_color')
                .order('id');
            if (error) console.error('Error fetching members:', error);
            else setMemebers(data);
        };

        fetchMembers();
    }, []);

    const handleSignUp = async (e: any) => {
        e.preventDefault();

        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            console.error('회원 가입 에러:', error.message);
            return;
        }

        const lastMemeberId = members[members.length - 1].id

        console.log(lastMemeberId)
        // Auth 테이블에 가입 정보 추가
        const { data, error: memberError } = await supabase.from('Member').upsert([
            {
                id: lastMemeberId + 1,
                uid: user?.id, // Auth 테이블에서 생성된 유저의 ID 사용
                nick_name: nickname,
                permission: 'freshman'
                // 다른 멤버 정보 추가
            },
        ]);

        if (memberError) {
            console.error('멤버 정보 추가 에러:', memberError.message);
            return;
        }

        console.log('회원 가입 성공:', data);
    };

    return (
        <div>
            <Typography variant='h3' paddingBottom={3} paddingTop={3} align='center'>회원 가입 페이지</Typography>
            <form onSubmit={handleSignUp}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                    <Grid xs={12} justifyContent={'center'} alignItems={'center'}>
                        <Grid paddingBottom={2}>
                            <TextField
                                type="email"
                                placeholder="이메일"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid paddingBottom={2}>
                            <TextField
                                type="password"
                                placeholder="비밀번호"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Grid>
                        <Grid paddingBottom={2}>
                            <TextField
                                type="text"
                                placeholder="닉네임"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                required
                            />
                        </Grid>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                            <Button variant='outlined' type="submit">가입하기</Button>
                        </div>
                    </Grid>
                </div>
            </form>
        </div>
    );
};

export default SignUp;