import { supabase } from '@/utils/supabase';
import { Box, Button, Link, TextField } from '@mui/material';
import { useState } from 'react';
import { userAtom } from '../recoil/userAtom';
import { useSetRecoilState } from 'recoil';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: any }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const setUser = useSetRecoilState(userAtom);

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                throw error;
            }

            setUser({ id: data.user.id, name: '' })
            onLoginSuccess(data.user.id)
        } catch (error: any) {
            console.error('로그인 오류:', error.message);
            alert("로그인에 실패했습니다.")
        }
    };

    return (
        <form onSubmit={handleLogin}
            className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action="/auth/sign-in"
            method="post">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                gap={2}
            >
                <TextField
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <Button type="submit" variant="contained" color="primary">
                    로그인
                </Button>

                <Link href="/signup">
                    {"계정이 없으시면 회원 가입을 해주세요"}
                </Link>
            </Box>
        </form>
    );
};

export default LoginForm;