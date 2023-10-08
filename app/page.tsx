'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRecoilState } from 'recoil';
import { userAtom } from '../recoil/userAtom';
import Link from 'next/link'
import LoginForm from '@/components/LoginForm'
import UserMenu from '@/components/UserMenu'
import Button from '@mui/material/Button'

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
          setUserState(currentSession.user.id);
          handleUpdateMember(currentSession.user.id)
        } else {
          setUserState('');
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
        .select('id, nick_name')
        .eq('uid', uid);

      if (error) {
        throw error;
      }

      console.log('Member 정보가 업데이트되었습니다.');
      if (data.length == 1) {
        setMember(data[0])
      }
    } catch (error: any) {
      console.error('Error updating member:', error.message);
    }
  };

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('로그아웃 오류:', error.message);
    } else {
      setUserState('')
    }
  }

  function hasUserState(): boolean {
    return userState.length > 0
  }
  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          {
            hasUserState() ?
              (
                <h1>환영합니다, {member.nick_name} 님! <Button variant='outlined' onClick={handleLogout}>로그아웃</Button></h1>
              ) : (
                <h1>로그인해주세요</h1>
              )
          }
        </div>
      </nav>
      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            <strong>로스쿨</strong>
          </p>
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
        </div>
        {hasUserState() && (<UserMenu />)}
      </div>

      <div className="flex justify-center text-center text-xs">
        <p>
          Powered by{' '}
          <Link
            href="https://supabase.com/"
            target="_blank"
            className="font-bold"
          >
            Supabase
          </Link>
        </p>
      </div>
    </div>
  )
}

