'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBase64Text, getPlainText } from '@/utils/TextUtils'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Typography, TextField } from '@mui/material'
import { RaidData, CharacterData } from '@/lib/database.types'

export default function AttendancePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = getPlainText(searchParams.get('id') || "")

    const [characters, setCharacters] = useState<CharacterData[]>([])
    const [raids, setRaids] = useState<RaidData[]>([])

    const [colorInfo, setColorInfo] = useState<any>({})

    const [addCharName, setAddCharName] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await supabase
                    .from('Member')
                    .select()
                    .eq('uid', id)
                    .single()

                const memberData = data
                if (memberData) {
                    fetchCharactersData(memberData.id)
                    setColorInfo({ pColor: memberData.personal_color, tColor: memberData.text_color })
                } else {
                    throw new Error('사용자 정보를 찾을 수 없습니다.')
                }
            } catch (error) {
                console.error('에러 발생:', error)
            }
        }

        const fetchRaid = async () => {
            try {
                const { data } = await supabase
                    .from('Raid')
                    .select()
                    .order('id')

                if (data) {
                    setRaids(data)
                } else {
                    throw new Error('레이드 정보를 찾을 수 없습니다.')
                }
            } catch (error) {
                console.error(`에러 : {error}`)
            }
        }

        fetchData()
        fetchRaid()
    }, [])

    const fetchCharactersData = async (memberId: number) => {
        try {
            const { data } = await supabase
                .from('Character')
                .select()
                .eq('member_id', memberId)
                .order('id')

            if (data) {
                setCharacters(data)
            }
        } catch (error) {
            console.error('에러 발생 : ', error)
        }
    }

    const handleCheckboxChange = (raidId: number, characterId: number) => {
        setRaids(prevRaids => {
            return prevRaids.map(raid => {
                if (raid.id === raidId) {
                    const updatedGroup = raid.raid_group.includes(characterId)
                        ? raid.raid_group.filter(id => id !== characterId)
                        : [...raid.raid_group, characterId]
                    return { ...raid, raid_group: updatedGroup }
                }
                return raid
            })
        })
    }

    const handleSave = async () => {
        for (const raid of raids) {
            const { data, error } = await supabase
                .from('Raid')
                .update({ raid_group: raid.raid_group })
                .eq('id', raid.id)

            if (error) {
                console.error(`Error updating raid ${raid.id}:`, error)
            } else {
                console.log(`Raid ${raid.id} updated successfully!`)
            }
        }
        alert("레이드 정보를 업데이트 했습니다.")
    }

    const handleAddCharacter = async () => {
        const lastCharacterId = characters[characters.length - 1].id
        const memberId = characters[0].member_id
        try {
            const { data, error } = await supabase
                .from('Character')
                .insert([
                    {
                        id: lastCharacterId + 1,
                        member_id: memberId,
                        char_name: addCharName,
                        char_class: '',
                        char_type: '',
                        char_level: 0,
                    }
                ])

            if (error) {
                throw error
            }

            alert("캐릭터 추가 성공")
            fetchCharactersData(memberId)
        } catch (error) {
            console.error('캐릭터 추가 에러:', error)
        }
    }

    const handleDeleteCharacter = async (charId: number) => {
        const memberId = characters[0].member_id
        try {
            const { data, error } = await supabase
                .from('Character')
                .delete()
                .eq('id', charId)

            if (error) {
                throw error
            }

            alert("캐릭터 삭제 성공")
            fetchCharactersData(memberId)
        } catch (error) {
            console.error('캐릭터 삭제 에러:', error)
        }
    }

    return (
        <Box padding={2}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>캐릭터</TableCell>
                            <TableCell>직업</TableCell>
                            <TableCell>레벨</TableCell>
                            {raids.map((raid: any) => (
                                <TableCell key={raid.id} align='center'>
                                    <Typography variant='body1'>{raid.raid_name}</Typography>
                                    <Typography variant='caption'>{raid.raid_level}</Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characters.map((character: any) => (
                            <TableRow key={character.id}>
                                <TableCell style={{ backgroundColor: colorInfo.pColor, color: colorInfo.tColor }}>
                                    {character.char_name}
                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3px' }}>
                                        <Button style={{ fontSize: '10px' }} onClick={() => {
                                            router.push(`/members/character?id=${getBase64Text(String(character.id))}`)
                                        }}>관리</Button>
                                        {/* <Button style={{ fontSize: '10px' }} onClick={() => {
                                            const shouldDelete = window.confirm(`[${character.char_name}] 를 정말로 삭제하시겠습니까?`)
                                            if (shouldDelete) {
                                                handleDeleteCharacter(character.id)
                                            }
                                        }}>삭제</Button> */}
                                    </Box>
                                </TableCell>
                                <TableCell style={{ backgroundColor: colorInfo.pColor, color: colorInfo.tColor }}>
                                    {character.char_class}
                                </TableCell>
                                <TableCell style={{ backgroundColor: colorInfo.pColor, color: colorInfo.tColor }}>
                                    {character.char_level}
                                </TableCell>
                                {raids.map((raid: RaidData) => (
                                    <TableCell key={raid.id}>
                                        <Checkbox
                                            disabled={character.char_level < raid.raid_level}
                                            checked={raid.raid_group.includes(character.id)}
                                            onChange={(e) => {
                                                handleCheckboxChange(raid.id, character.id)
                                            }}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                <Button variant="contained" color="primary" onClick={handleSave}>
                    저장
                </Button>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '15px' }}>
                <TextField value={addCharName} onChange={(e) => setAddCharName(e.target.value)} />
                <Button variant="contained" color="primary" onClick={() => {
                    if (addCharName.length < 2) {
                        alert('캐릭터 이름을 정확히 입력해주세요.')
                    } else {
                        const shouldDelete = window.confirm(`[${addCharName}] 를 추가하시겠습니까?`)
                        if (shouldDelete) {
                            handleAddCharacter()
                        }
                    }
                }} style={{ marginLeft: '15px' }}>
                    캐릭터 추가
                </Button>
            </Box>
        </Box>
    )
}