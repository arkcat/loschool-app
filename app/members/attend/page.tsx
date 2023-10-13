'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useSearchParams } from 'next/navigation'
import { getPlainText } from '@/utils/TextUtils'
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Button, Typography } from '@mui/material'
import ScheduleBox from '@/components/ScheduleBox'

interface RaidData {
    id: number
    raid_name: string
    raid_level: number
    raid_group: number[]
}
export default function AttendancePage() {
    const searchParams = useSearchParams()
    const id = getPlainText(searchParams.get('id') || "")

    const [characters, setCharacters] = useState<any[]>([])
    const [raids, setRaids] = useState<RaidData[]>([])

    const [colorInfo, setColorInfo] = useState<any>({})

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await supabase
                    .from('Member')
                    .select()
                    .eq('uid', id);

                const memberData = data
                if (memberData && memberData.length > 0) {
                    const currentUserUid: any = memberData[0].id;
                    const { data } = await supabase
                        .from('Character')
                        .select()
                        .eq('member_id', currentUserUid);

                    if (data) {
                        setCharacters(data);
                        setColorInfo({ pColor: memberData[0].personal_color, tColor: memberData[0].text_color })
                    }
                } else {
                    throw new Error('사용자 정보를 찾을 수 없습니다.');
                }
            } catch (error) {
                console.error('에러 발생:', error);
            }
        }

        const fetchRaid = async () => {
            try {
                const { data, error } = await supabase
                    .from('Raid')
                    .select()
                    .order('id')

                if (data) {
                    setRaids(data)
                }
            } catch (error) {
                console.error(`에러 : {error}`)
            }
        }

        fetchData()
        fetchRaid()
    }, [])

    const handleCheckboxChange = (raidId: number, characterId: number) => {
        setRaids(prevRaids => {
            return prevRaids.map(raid => {
                if (raid.id === raidId) {
                    const updatedGroup = raid.raid_group.includes(characterId)
                        ? raid.raid_group.filter(id => id !== characterId)
                        : [...raid.raid_group, characterId];
                    return { ...raid, raid_group: updatedGroup };
                }
                return raid;
            });
        });
    };

    const handleSave = async () => {
        for (const raid of raids) {
            const { data, error } = await supabase
                .from('Raid')
                .update({ raid_group: raid.raid_group })
                .eq('id', raid.id);

            if (error) {
                console.error(`Error updating raid ${raid.id}:`, error);
            } else {
                console.log(`Raid ${raid.id} updated successfully!`);
            }
        }
        alert("레이드 정보를 업데이트 했습니다.")
    };

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
        </Box>
    )
}