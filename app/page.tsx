'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import LoginForm from '@/components/LoginForm'
import { Box, Typography } from '@mui/material';
import Image from 'next/image'
import logo from './res/logo.png'

export const dynamic = 'force-dynamic'

export default function Index() {
  const [member, setMember] = useState<any>([]);
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [userState, setUserState] = useRecoilState(userAtom);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(`fetch user session ${userState}`)
        const authSession = supabase.auth.getSession();
        console.log(authSession)
        const currentSession = (await authSession).data.session
        if (currentSession !== null) {
          setUserState({ id: currentSession.user.id, name: member.nick_name });
          handleUpdateMember(currentSession.user.id)
        } else {
          setUserState({ id: '', name: '' });
        }
      } catch (error: any) {
        console.error('사용자 정보 가져오기 오류:', error.message);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateMember = async (uid: string) => {
    try {
      console.log(`fetch members ${uid}`)
      const { data, error } = await supabase
        .from('Member')
        .select('id, uid, nick_name')
        .eq('uid', uid);

      if (error) {
        throw error;
      }

      console.log('Member 정보가 업데이트되었습니다.');
      if (data.length == 1) {
        setMember(data[0])
        setUserState({ id: data[0].uid, name: data[0].nick_name })
        setShowLoginForm(false)
      }
    } catch (error: any) {
      console.error('Error updating member:', error.message);
    }
  };

  function hasUserState(): boolean {
    return userState.id != ''
  }
  return (
    <Box
      display="flex"
      position="relative"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="95vh">
      <Box
        display="flex"
        position="relative"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="50vh"
        gap={5}
      >
        <Typography variant="h1" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'bold' }}>
          Lo, School
        </Typography>

        <Box>
          {
            !hasUserState() &&
            (
              <div className='outlined'>
                {showLoginForm === false ?
                  <div onClick={() => setShowLoginForm(true)}>로그인하기</div> :
                  <div className="loginForm">
                    <LoginForm onLoginSuccess={handleUpdateMember} />
                  </div>
                }
              </div>
            )
          }
        </Box>
      </Box>

      <Box position={'absolute'} bottom={0} marginBottom={5}>
        <Image
          src={logo}
          width="150" height="50"
          alt="Logo" />
      </Box>
    </Box>
  )
}

