'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/utils/supabase'
import { Box, Button, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import { getPlainText } from '@/utils/TextUtils'
import { supabaseAdmin } from '@/utils/supabaseAdmin'
import { MemberData } from '@/lib/database.types'

export default function MemberDetailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = getPlainText(searchParams.get('id') || "")
  const caller = searchParams.get('caller') || ''
  console.log(id)
  console.log(caller)
  const [member, setMember] = useState<MemberData | null>(null)
  const [selectedOption, setSelectedOption] = useState('freshman')

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .eq('uid', id)
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
        .eq('uid', id)

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

    router.back()
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100dvh">
      <Box pb={3} pt={10}>
        <Grid container
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}>
          <Grid item xs={12}>
            {member && (
              <Typography variant='h3' className='page-title'>{member.nick_name} 수정</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>닉네임</Typography>
            <TextField
              variant='outlined'
              size='small'
              type="text"
              value={member?.nick_name}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setMember({
                  ...(member as MemberData),
                  nick_name: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>퍼스널 컬러</Typography>
            <TextField
              size='small'
              type="text"
              value={member?.personal_color}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setMember({
                  ...(member as MemberData),
                  personal_color: e.target.value
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>텍스트 컬러</Typography>
            <TextField
              size='small'
              type="text"
              value={member?.text_color}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setMember({
                  ...(member as MemberData),
                  text_color: e.target.value
                })
              }
            />
          </Grid>
          {caller !== '' && (
            <Grid item xs={12}>
              <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>권한</Typography>
              <Select value={selectedOption}
                variant='outlined'
                sx={{background:'#fff', minWidth:250, height:40, borderRadius:18}}
                onChange={(e) => {
                  setSelectedOption(e.target.value)
                  setMember({
                    ...(member as MemberData),
                    permission: e.target.value
                  })
                }}>
                <MenuItem value="freshman">Freshman</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
                <MenuItem value="professor">Professor</MenuItem>
              </Select>
            </Grid>
          )}
        </Grid>
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', gap: '15px' }}>
          <Button variant='contained' onClick={handleUpdateMember}>
            저장
          </Button>
          {caller !== '' && (
            <Button variant='contained' onClick={() => {
              const shouldDelete = window.confirm(`[${member?.nick_name}] 정말로 삭제하시겠습니까?`)
              if (member && shouldDelete) {
                deleteMember(member.nick_name, member.uid)
              }
            }}>멤버삭제</Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}