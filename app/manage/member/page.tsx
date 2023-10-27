'use client'

import { getBase64Text } from '@/utils/TextUtils'
import { supabase } from '@/utils/supabase'
import { Grid, Box, Typography, Card, CardContent, Button, Popover } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MemberData } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

export default function MemberPage() {

  const router = useRouter()
  const [members, setMembers] = useState<MemberData[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .neq('id', 9999)
        .order('id')
      if (error) console.error('Error fetching members:', error)
      else setMembers(data)
    }

    fetchMembers()
  }, [])

  function makeMemberCard(member: MemberData) {

    function handleClickMemberCard(): void {
      router.push(`/members/details?id=${getBase64Text(String(member.id))}`)
    }

    const bgColor = member.personal_color
    const textColor = member.text_color
    console.log(member)
    return (
      <Grid item xs={6} lg={2} key={member.id}>
        <Card onClick={handleClickMemberCard} style={{ backgroundColor: bgColor, color: textColor }}>
          <CardContent>
            <Typography variant="h4">
              {member.nick_name}
            </Typography>
            <Box marginTop={2}>
              <Typography variant="body2">{bgColor}</Typography>
              <Typography variant="body2">{textColor}</Typography>
              <Typography variant="body2">{member.permission}</Typography>
              <Typography variant="body2">{String(member.schedule_check)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100vh">
      <Typography variant='h3' pb={3} pt={10} style={{ fontFamily: 'PuradakGentleGothicR', fontSize: '50px' }}>멤버 관리</Typography>
      <Box>
        <Grid container spacing={2} style={{ overflow: 'auto', maxHeight: '800px', maxWidth: '1800px' }}>
          {
            members?.map((member: any) => {
              return (makeMemberCard(member))
            })
          }
        </Grid>
      </Box>
    </Box>
  )
}
