'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRecoilState } from 'recoil'
import { userAtom } from '../recoil/userAtom'
import LoginForm from '@/components/LoginForm'
import { Box, Grid, List, ListItem, ListItemText, Typography } from '@mui/material'
import titleImage from './res/title.png'
import questIcon from './res/Dungeon_Quest_Icon.png'
import { PartyData, RaidData, CharacterData } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

interface CombinedData {
  party: PartyData
  raid: RaidData
  members: CharacterData[]
}

export default function Index() {
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [userState, setUserState] = useRecoilState<any | null>(userAtom)
  const [mainComment, setMainComment] = useState<string>('')
  const [combinedData, setCombinedData] = useState<CombinedData[]>([])

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

    const fetchPartyData = async () => {
      // PartyData 가져오기
      const today = getDayOfWeek()
      const { data: partyData, error: partyError } = await supabase
        .from('Party')
        .select('*')
        .eq('day', today)
        .order('time')

      if (partyError) {
        console.error('Error fetching party data:', partyError);
        return;
      }

      // RaidData 가져오기
      const { data: raidData, error: raidError } = await supabase
        .from('Raid')
        .select('*')
        .order('id')

      if (raidError) {
        console.error('Error fetching raid data:', raidError);
        return;
      }

      // MemberData 가져오기
      const characterIds = partyData.flatMap(party => party.member);
      const { data: characterData, error: characterError } = await supabase
        .from('Character')
        .select('*')
        .in('id', characterIds);

      if (characterError) {
        console.error('Error fetching character data:', characterError);
        return;
      }

      // 조합된 데이터 생성
      const combinedData = partyData.map(party => {
        const raid = raidData[party.raid_id];
        const members = characterData.filter(character => party.member.includes(character.id));

        return {
          party,
          raid: raid,
          members: members,
        };
      });

      setCombinedData(combinedData)
    }

    fetchMainComment()
    fetchPartyData()
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
    data: CombinedData
  }

  const PartyItem: React.FC<PartyItemProps> = ({ data }) => {
    if (data === undefined) {
      return <Box></Box>
    }
    console.log(data)
    const raidInfo = data.raid
    const isMy = data.members.filter(char => { return char.member_id === userState.id }).length > 0
    console.log(userState.id, isMy)
    return (
      <ListItem>
        <ListItemText
          primary={
            <Box style={{ display: 'flex', alignItems: 'center', fontFamily: 'NanumBarunGothic', fontSize: '20px' }}>
              <span style={{ lineHeight: '20px' }}>{`${raidInfo.raid_name} ${data.party.time} 시`}</span>
              {isMy && <img src={questIcon.src} style={{ width: '25px', marginLeft: '10px' }} />}
            </Box>
          }
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
          {!userState &&
            (
              <div className='outlined'>
                {showLoginForm === false ?
                  <div onClick={() => setShowLoginForm(true)} style={{ cursor: 'pointer', fontFamily: 'NanumBarunGothic', fontSize: '30px' }}>로그인</div> :
                  <div className="loginForm">
                    <LoginForm onLoginSuccess={handleUpdateMember} />
                  </div>
                }
              </div>
            )}
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
                      {combinedData.map((data) => (
                        <PartyItem key={data.party.id} data={data} />
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
                    {mainComment.split('\n').map((line, index) => (
                      <Typography key={index} style={{ fontFamily: 'NanumBarunGothic', fontSize: '20px', textAlign: 'center' }}>
                        {line}
                      </Typography>
                    ))}
                  </div>
                </Grid>
              </Grid>
            </Box>)}
        </Box>
      </Box>
    </Box>
  )
}

