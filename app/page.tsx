'use client'

import Link from 'next/link'
import SupabaseLogo from '../components/SupabaseLogo'
import NextJsLogo from '../components/NextJsLogo'
import LoginForm from '@/components/LoginForm'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase'

export const dynamic = 'force-dynamic'

export default function Index() {
  const router = useRouter()
  const [showLoginForm, setShowLoginForm] = useState(false)
  const user = useUser()
  const handleLoginSuccess = (id: number) => {
    router.push(`/members/schedule?id=${id}`)
  };

  return (
    <div className="w-full flex flex-col items-center">

      <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
        <div className="flex flex-col items-center mb-4 lg:mb-12">
          <div className="flex gap-8 justify-center items-center">
            <Link href="https://supabase.com/" target="_blank">
              <SupabaseLogo />
            </Link>
            <span className="border-l rotate-45 h-6" />
            <NextJsLogo />
          </div>
          <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            <strong>로스쿨</strong>
          </p>
          <div className='outlined'>
            {user ? (
              <div>
                <h1>환영합니다, {user.email} 님!</h1>
                <button onClick={() => supabase.auth.signOut()}>로그아웃</button>
              </div>
            ) : (
              showLoginForm === false ?
                <div onClick={() => setShowLoginForm(true)}>로그인하기</div> :
                <div className="loginForm">
                  <LoginForm onLoginSuccess={handleLoginSuccess} />
                </div>
            )
            }
          </div>
        </div>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />

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
    </div>
  )
}

function useUser() {
  throw new Error('Function not implemented.')
}

