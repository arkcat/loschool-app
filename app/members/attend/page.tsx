'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBase64Text, getPlainText } from '@/utils/TextUtils'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Typography, TextField } from '@mui/material'
import { RaidData, CharacterData, MemberData } from '@/lib/database.types'
import { LostArkCharacterData, fetchCharactersFromServer } from '@/utils/LostArkApiUtil'

export default function AttendancePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = getPlainText(searchParams.get('id') || "")

    const [member, setMember] = useState<MemberData | null>()
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
                    setMember(memberData)
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

    const updateCharacterInfo = async (id: number, className: string, classType: string, itemLevel: string) => {
        try {
            const { data, error } = await supabase
                .from('Character')
                .update({
                    char_class: className,
                    char_type: classType,
                    char_level: parseInt(itemLevel)
                })
                .eq('id', id)

            if (error) {
                throw error
            }

            setCharacters(prevCharacters =>
                prevCharacters.map(character =>
                    character.id === id
                        ? {
                            ...character,
                            char_class: className,
                            char_type: classType,
                            char_level: parseInt(itemLevel)
                        }
                        : character
                )
            )
        } catch (error) {
            console.error('캐릭터 정보 업데이트 에러 발생 : ', error)
        }
    }

    const handleUpdate = async () => {
        try {
            let characterNames: string[] = characters.map((c) => c.char_name);
            let serverCallCount = 0;
            while (characterNames.length > 0) {
                const response = await fetchCharactersFromServer(characterNames[0]);
                console.log(`fetch call ${serverCallCount++} with ${characterNames[0]}`);
                if (!response) {
                    console.log(`Can't find ${characterNames[0]}`);
                    characterNames = characterNames.filter(
                        (item) => item !== characterNames[0]
                    );
                    continue;
                }

                const characterList = response as LostArkCharacterData[];
                const ourServers = characterList.filter(
                    (character) => character.ServerName === "실리안"
                );

                if (ourServers.length === 0) {
                    console.log(`Can't find in '실리안' ${characterNames[0]}`);
                    characterNames = characterNames.filter(
                        (item) => item !== characterNames[0]
                    );
                    continue;
                }

                characters.map((char) => {
                    const charInfo = ourServers.filter(
                        (c) => c.CharacterName === char.char_name
                    )[0];
                    if (charInfo) {
                        characterNames = characterNames.filter(
                            (item) => item !== char.char_name
                        );
                        const className = charInfo.CharacterClassName;
                        let classType = "D";
                        if (
                            className === "바드" ||
                            className === "홀리나이트" ||
                            className === "도화가"
                        ) {
                            classType = "S";
                        }
                        const itemLevel = charInfo.ItemMaxLevel.replace(/[,]/g, "");
                        updateCharacterInfo(char.id, className, classType, itemLevel);
                    }
                });
            }

            alert("캐릭터 정보 업데이트 완료");
        } catch (error) {
            console.error("에러 발생 : ", error);
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
        if (member) {
            let id
            if (characters.length === 0) {
                id = ((member.id - 8000) * 100)
            } else {
                id = characters[characters.length - 1].id
            }

            try {
                const { data, error } = await supabase
                    .from('Character')
                    .insert([
                        {
                            id: id + 1,
                            member_id: member.id,
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
                fetchCharactersData(member.id)
            } catch (error) {
                console.error('캐릭터 추가 에러:', error)
            }
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
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100dvh">
            <Typography variant='h3' className='page-title'>출석부</Typography>
            <Box display="flex" alignItems="center" justifyContent={'center'} sx={{ border: '1px #e6bd76 solid', backgroundColor: '#f3e07c', textAlign: 'center' }} padding='5px' marginBottom={2}>
                <Typography className='page-description'>캐릭터를 추가하려면 하단 텍스트박스에 캐릭터 이름을 적고 추가 버튼을 눌러주세요.<br />
                    업데이트 버튼을 누르면 캐릭터 정보가 로아 서버로부터 업데이트 됩니다.<br />
                    캐릭터 정보를 모두 업데이트 한 뒤 저장 버튼을 눌러주세요.
                </Typography>
            </Box>
            <TableContainer component={Paper} sx={{ maxHeight: '550px', maxWidth: '1800px' }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ position: 'sticky', left: 0, zIndex: 99, fontFamily: 'S-CoreDream-3Light', fontSize: '13px' }} sx={{ minWidth: '100px', textAlign: 'center', borderRight: '2px #f3e07c solid', borderBottom: '2px #f3e07c solid' }}>캐릭터</TableCell>
                            <TableCell sx={{ minWidth: '30px', textAlign: 'center', borderBottom: '2px #f3e07c solid' }} style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '13px' }}>레벨</TableCell>
                            {raids.map(raid => (
                                <TableCell sx={{ minWidth: '100px', borderBottom: '2px #f3e07c solid', background: raid.raid_color, color: '#fff' }} key={raid.id} align='center'>
                                    <Typography style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '13px' }}>{raid.raid_name}</Typography>
                                    <Typography style={{ fontFamily: 'S-CoreDream-3Light', fontSize: '13px' }}>{raid.raid_level}</Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {characters.map((character: any) => (
                            <TableRow key={character.id}>
                                <TableCell sx={{ textAlign: 'center', borderRight: '2px #f3e07c solid' }}
                                    style={{ backgroundColor: colorInfo.pColor, color: colorInfo.tColor, position: 'sticky', left: 0, zIndex: 98 }}>
                                    {character.char_name}<br />
                                    [{character.char_class}]
                                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '3px' }}>
                                        <Button variant='contained' onClick={() => {
                                            router.push(`/members/character?id=${getBase64Text(String(character.id))}`)
                                        }}>관리</Button>
                                    </Box>
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center' }} style={{ backgroundColor: colorInfo.pColor, color: colorInfo.tColor }}>
                                    {character.char_level}
                                </TableCell>
                                {raids.map((raid: RaidData) => (
                                    <TableCell key={raid.id} style={{ textAlign: 'center' }}>
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
                <Button variant="contained" color="primary" style={{ marginLeft: 15, marginRight: 10 }} onClick={handleSave}>저장</Button>
                <Button variant="contained" color="primary" style={{ marginLeft: 10, marginRight: 15 }} onClick={handleUpdate}>업데이트</Button>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px', paddingBottom: '5px' }}>
                <TextField
                    variant='outlined'
                    size='small'
                    InputProps={{
                        style: {
                            border: 'none',
                            borderRadius: 18,
                            background: '#fff'
                        }
                    }}
                    value={addCharName}
                    onChange={(e) => setAddCharName(e.target.value)} />
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