'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { Button, Grid, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { parseJsonText } from 'typescript'
import { MemberData } from '@/lib/database.types'
const SignUp = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [members, setMemebers] = useState<MemberData[]>([])

    const defaultPermission = 'freshman'
    const defaultPersonalColor = '#ffffff'
    const defaultTextColor = '#000000'
    const defaultSchedule = JSON.parse('{"fri":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"mon":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"sat":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"sun":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"thu":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"tue":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0},"wed":{"10":0,"11":0,"12":0,"13":0,"14":0,"15":0,"16":0,"17":0,"18":0,"19":0,"20":0,"21":0,"22":0,"23":0,"24":0,"01":0,"02":0}}')

    useEffect(() => {
        const fetchMembers = async () => {
            const { data, error } = await supabase
                .from('Member')
                .select()
                .order('id')
            if (error) console.error('Error fetching members:', error)
            else setMemebers(data)
        }

        fetchMembers()
    }, [])

    const handleSignUp = async (e: any) => {
        e.preventDefault()

        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error('회원 가입 에러:', error.message)
            return
        }

        const lastMemeberId = members[members.length - 1].id

        const { data, error: memberError } = await supabase.from('Member').upsert([
            {
                id: lastMemeberId + 1,
                uid: user?.id,
                nick_name: nickname,
                permission: defaultPermission,
                personal_color: defaultPersonalColor,
                text_color: defaultTextColor,
                schedule: defaultSchedule
            },
        ])

        if (memberError) {
            console.error('멤버 정보 추가 에러:', memberError.message)
            return
        }

        console.log('회원 가입 성공:', data)
        handleSuccessAddMember()
    }

    const handleSuccessAddMember = () => {
        alert('회원 가입에 성공했습니다.')
        router.push('/')
    }

    return (
        <div>
            <Typography variant='h3' paddingBottom={3} paddingTop={3} align='center'>회원 가입 페이지</Typography>
            <form onSubmit={handleSignUp}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                    <Grid item xs={12} justifyContent={'center'} alignItems={'center'}>
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
    )
}

export default SignUp