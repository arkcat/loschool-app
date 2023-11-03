'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRecoilState } from 'recoil'
import { userAtom } from '../recoil/userAtom'
import LoginForm from '@/components/LoginForm'
import { Box, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import Image from 'next/image'
import logo from './res/logo.png'
import titleImage from './res/title.png'

import { PartyData, RaidData } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export default function Index() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [userState, setUserState] = useRecoilState<any | null>(userAtom)
  const [memberId, setMemberId] = useState<number>(0)
  const [partyData, setPartyData] = useState<PartyData[]>([])
  const [raidData, setRaidData] = useState<RaidData[]>([])
  const [mainComment, setMainComment] = useState<string>('')

  useEffect(() => {
    const fetchMainComment = async () => {
      try {
        const { data, error } = await supabase
          .from('Member')
          .select('comment')
          .eq('id', 9999)

        if (error) {
          throw error
        }

        if (data.length > 0) {
          setMainComment(data[0].comment)
        }
      } catch (error: any) {
        console.error("코멘트 불러오기 오류 : ", error)
      }
    }

    const fetchUser = async () => {
      try {
        if (!userState) {
          const authSession = supabase.auth.getSession()
          const currentSession = (await authSession).data.session
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

    const fetchPartyData = async () => {
      try {
        const today = getDayOfWeek()
        const { data, error } = await supabase
          .from('Party')
          .select()
          .eq('day', today)
          .order('time')

        if (error) {
          console.error('Error fetching party data:', error)
        } else {
          setPartyData(data as PartyData[])
        }
      } catch (error: any) {
        console.error('사용자 정보 가져오기 오류:', error.message)
      }
    }

    const fetchRaidData = async () => {
      const { data, error } = await supabase
        .from('Raid')
        .select()
        .order('id')

      if (data) {
        setRaidData(data)
      } else {
        console.error('Error fetching raid data:', error)
      }
    }

    fetchUser()
    fetchMainComment()
    fetchPartyData()
    fetchRaidData()
  }, [])

  function getDayOfWeek(): number {
    const now = new Date();
    const dayIndex = now.getDay()
    return (dayIndex + 4) % 7;
  }

  const handleUpdateMember = async (uid: string) => {
    try {
      if (!userState) {
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

  interface PartyItemProps {
    data: PartyData
  }
  const PartyItem: React.FC<PartyItemProps> = ({ data }) => {
    const raidInfo = raidData[data.raid_id]
    if (raidInfo === undefined) {
      return <Box></Box>
    }
    return (
      <ListItem>
        <ListItemText
          primary={<Box style={{ fontFamily: 'NanumBarunGothic', fontSize: '20px' }}>{`${raidInfo.raid_name} ${data.time} 시`}</Box>}
        />
      </ListItem>
    )
  }

  return (
    <Box display="flex" position="relative" flexDirection="column" alignItems="center" justifyContent="center" height="100dvh">
      <Box display="flex" position="relative" flexDirection="column" alignItems="center" justifyContent="center" gap={3}>
        <Box>
          <img src={titleImage.src} className='title-image' alt="Title" />
        </Box>
        <Box>
          {
            !userState &&
            (
              <div className='outlined'>
                {showLoginForm === false ?
                  <div onClick={() => setShowLoginForm(true)} style={{ cursor: 'pointer', fontFamily: 'NanumBarunGothic', fontSize: '30px' }}>로그인</div> :
                  <div className="loginForm">
                    <LoginForm onLoginSuccess={handleUpdateMember} />
                  </div>
                }
              </div>
            )
          }
        </Box>
        <Box>
          {userState &&
            (<Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} >
                  <Typography variant="h4"
                    textAlign={'center'}
                    sx={{ mt: 2, mb: 2 }}
                    style={{ fontFamily: 'SUIT-Regular', fontSize: '32px', fontWeight: '600' }}>오늘의 공대</Typography>
                  <div className='main-post'>
                    <List dense>
                      {partyData.map((data) => (
                        <PartyItem key={data.id} data={data} />
                      ))}
                    </List>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h4"
                    textAlign={'center'}
                    sx={{ mt: 2, mb: 2 }}
                    style={{ fontFamily: 'SUIT-Regular', fontSize: '32px', fontWeight: '600' }}>운영진 공지</Typography>
                  <div className='main-post'>
                    <Typography style={{ fontFamily: 'NanumBarunGothic', fontSize: '20px', textAlign: 'center' }}>
                      {mainComment.split('\n').map((line, index) => (
                        <div key={index}>
                          {line}
                        </div>
                      ))}
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </Box>)
          }
        </Box>
      </Box>
    </Box>
  )
}

