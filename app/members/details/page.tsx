'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { getPlainText } from '@/utils/TextUtils'
import { supabaseAdmin } from '@/utils/supabaseAdmin'

export default function MemberDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = parseInt(getPlainText(searchParams.get('id') || ""))

  const [member, setMember] = useState<any>(null)
  const [selectedOption, setSelectedOption] = useState('freshman')

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .eq('id', id)
        .single()

      if (error) { console.error('Error fetching member:', error) }
      else {
        setMember(data)
        if (data.permission) {
          setSelectedOption(data.permission)
        }
      }
    }

    if (id) {
      fetchMember()
    }
  }, [id])

  const handleUpdateMember = async () => {
    try {
      const { error } = await supabase
        .from('Member')
        .update({
          nick_name: member?.nick_name,
          personal_color: member?.personal_color,
          text_color: member?.text_color,
          permission: member?.permission
        })
        .eq('id', id)

      if (error) {
        throw error
      }

      alert("멤버 정보가 저장되었습니다.")
    } catch (error: any) {
      console.error('Error updating member:', error.message)
    }
  }

  const deletePromises = async (uid: string) => {
    const { error: deleteError } = await supabase
      .from('Member')
      .delete()
      .eq('uid', uid)

    if (deleteError) {
      throw deleteError
    }
  }

  const deleteMember = async (name: string, uid: string) => {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(uid)
    if (error) {
      console.error("유저 삭제 실패")
      return
    }
    deletePromises(uid)

    console.log(`${name} 유저 삭제`)
    router.back()
  }

  return (
    <Box>
      <Grid container
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}>
        <Grid item xs={12}>
          {member && (
            <Typography variant='h3' paddingBottom={3} align='center'>{member.nick_name} 수정</Typography>
          )}
        </Grid>
        <Grid item xs={12}>
          <Typography>Nick Name</Typography>
          <TextField
            size='small'
            type="text"
            value={member?.nick_name}
            onChange={(e) =>
              setMember({ ...member, nick_name: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Personal Color</Typography>
          <TextField
            size='small'
            type="text"
            value={member?.personal_color}
            onChange={(e) =>
              setMember({ ...member, personal_color: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Text Color</Typography>
          <TextField
            size='small'
            type="text"
            value={member?.text_color}
            onChange={(e) =>
              setMember({ ...member, text_color: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <Typography>Permission</Typography>
          <Select value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e.target.value)
              setMember({ ...member, permission: e.target.value })
            }}>
            <MenuItem value="freshman">Freshman</MenuItem>
            <MenuItem value="senior">Senior</MenuItem>
            <MenuItem value="professor">Professor</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', gap: '15px' }}>

        <Button variant='contained' onClick={handleUpdateMember}>
          저장
        </Button>

        <Button variant='contained' onClick={() => {
          const shouldDelete = window.confirm(`[${member.nick_name}] 정말로 삭제하시겠습니까?`)
          if (shouldDelete) {
            deleteMember(member.nick_name, member.uid)
          }
        }}>멤버삭제</Button>
      </Box>
    </Box>
  )
}