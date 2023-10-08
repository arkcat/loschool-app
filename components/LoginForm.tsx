import { supabase } from '@/utils/supabase';
import { Button, Grid, Link, TextField } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = ({ onLoginSuccess }: { onLoginSuccess: any }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const router = useRouter();
    
    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
          const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) {
            throw error;
          }
          router.push('/dashboard'); // 로그인 성공 시 리다이렉트할 경로
        } catch (error: any) {
          console.error('로그인 오류:', error.message);
        }
      };

    return (
        <form onSubmit={handleLogin}
            className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action="/auth/sign-in"
            method="post">
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
                    <Link href="/signup">
                        {"Don't have an account? Sign Up"}
                    </Link>
                </Grid>
            </Grid>
        </form>
    );
};

export default LoginForm;