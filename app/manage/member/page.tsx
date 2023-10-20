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

  function makeMemberCard(member: any) {

    function handleClickMemberCard(): void {
      router.push(`/members/details?id=${getBase64Text(String(member.id))}`)
    }
    
    const bgColor = member.personal_color
    const textColor = member.text_color

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
            </Box>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Box padding={2}>
      <Typography variant="h2" align={'center'} margin={2}>Members</Typography>
      <Box>
        <Grid container spacing={2}>
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
