'use client'

import { getBase64Text } from '@/utils/TextUtils'
import { supabase } from '@/utils/supabase'
import { Grid, Box, Typography, Card, CardContent, Button, Popover } from '@mui/material'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export const dynamic = 'force-dynamic'

export default function Index() {
  const router = useRouter()
  const [members, setMembers] = useState<any>([])

  const [clickMember, setClickMember] = useState<any>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .order('id')
      if (error) console.error('Error fetching members:', error)
      else setMembers(data)
    }

    fetchMembers()
  }, [])

  const [anchorEl, setAnchorEl] = useState(null)

  const handleMenuClick = (event: any) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = (action: any) => {
    handleClose()
    switch (action) {
      case 'details':
        router.push(`/members/details?id=${getBase64Text(String(clickMember.id))}`)
        break
      case 'edit':
        break
      case 'delete':
        break
      default:
        break
    }
  }

  return (
    <Box padding={2}>
      <Typography variant="h2" align={'center'} margin={2}>Members</Typography>
      <Box>
        <Grid container spacing={2}>
          {members?.map((member: any) => {
            let bgColor = member.personal_color
            let textColor = member.text_color

            return (
              <Grid item xs={6} lg={2} key={member.id}>
                <Card onClick={() => { router.push(`/members/details?id=${getBase64Text(String(member.id))}`) }} style={{ backgroundColor: bgColor, color: textColor }}>
                  <CardContent>
                    <Typography variant="h4" className="font-bold mb-2 min-h-[20px] lg:min-h-[30px]">
                      {member.nick_name}
                    </Typography>
                    {/* <SettingIcon onClick={(event) => { setClickMember(member) handleMenuClick(event) }} /> */}
                    <Box marginTop={2}>
                      <Typography variant="body2">{bgColor}</Typography>
                      <Typography variant="body2">{textColor}</Typography>
                      <Typography variant="body2">{member.permission}</Typography>
                    </Box>
                  </CardContent>
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                  >
                    <Box p={2}>
                      <Button onClick={() => handleMenuItemClick('details')}>Details</Button>
                      <Button onClick={() => handleMenuItemClick('edit')}>Edit</Button>
                      <Button onClick={() => handleMenuItemClick('delete')}>Delete</Button>
                    </Box>
                  </Popover>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Box>
  )
}
