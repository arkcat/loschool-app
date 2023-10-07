import { supabase } from '@/utils/supabase';
import { Button, Grid, Link, TextField } from '@mui/material';
import { useState } from 'react';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: any }) => {
    const [nickname, setNickname] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async (e: any) => {
        e.preventDefault();
        
        const { data, error } = await supabase
            .from('Member')
            .select('id, nick_name')
            .eq('nick_name', nickname)

        if (error) {
            console.error('에러 발생:', error.message);
            return;
        }

        if (data.length > 0) {
            onLoginSuccess(data[0].id);
        } else {
            console.error('일치하는 사용자가 없습니다.');
        }
    };

    return (
        <form onSubmit={handleLogin}
            className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action="/auth/sign-in"
            method="post">
            <TextField
                type="text"
                placeholder="닉네임"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
            />
            <TextField
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <Button type="submit" variant="outlined" color="primary">
                로그인
            </Button>

            <Grid container>
                <Grid item xs>
                    <Link href="#">
                        Forgot password?
                    </Link>
                </Grid>
                <Grid item>
                    <Link href="#">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;