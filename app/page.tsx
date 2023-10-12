'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRecoilState } from 'recoil'
import { userAtom } from '../recoil/userAtom'
import LoginForm from '@/components/LoginForm'
import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import logo from './res/logo.png'

export const dynamic = 'force-dynamic'

export default function Index() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [userState, setUserState] = useRecoilState<any | null>(userAtom)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log(`fetch user session ${userState}`)
        if (!userState) {
          const authSession = supabase.auth.getSession()
          const currentSession = (await authSession).data.session
          console.log(`session = ${currentSession}`)
          if (currentSession !== null) {
            handleUpdateMember(currentSession.user.id)
          } else {
            setUserState(null)
          }
        }
      } catch (error: any) {
        console.error('사용자 정보 가져오기 오류:', error.message)
      }
    }

    fetchUser()
  }, [])

  const handleUpdateMember = async (uid: string) => {
    try {
      if (!userState) {
        console.log(`handle member update: ${uid}`)
        const { data, error } = await supabase
          .from('Member')
          .select()
          .eq('uid', uid)

        if (error) {
          throw error
        }

        if (data.length > 0) {
          setUserState(data[0])
          setShowLoginForm(false)
        }
      }
    } catch (error: any) {
      console.error('Error updating member:', error.message)
    }
  }

  return (
    <Box
      display="flex" position="relative" flexDirection="column" alignItems="center" justifyContent="center" height="95vh"
    >
      <Box
        display="flex" position="relative" flexDirection="column" alignItems="center" justifyContent="center" gap={5} marginTop={-25}
      >
        <Typography
          variant="h1" style={{ fontFamily: 'Times New Roman, serif', fontWeight: 'bold' }}
        >
          Lo, School
        </Typography>

        <Box>
          {
            !userState &&
            (
              <div className='outlined'>
                {showLoginForm === false ?
                  <div onClick={() => setShowLoginForm(true)}>로그인</div> :
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

