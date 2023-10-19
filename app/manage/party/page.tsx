'use client'

import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { CharacterData, MemberData, PartyData, RaidData, days, daysOfWeek, timeSlots } from '@/lib/database.types'
import { supabase } from '@/utils/supabase'
import { assert } from 'console'
import { getDayBgColor } from '@/utils/ColorUtils'

export const dynamic = 'force-dynamic'

export default function PartyPage() {
    const [partyData, setPartyData] = useState<PartyData[]>([])
    const [raidData, setRaidData] = useState<RaidData[]>([])
    const [characterData, setCharacterData] = useState<CharacterData[]>([])
    const [memberData, setMemberData] = useState<MemberData[]>([])

    useEffect(() => {
        fetchMemberData()
        fetchCharacterData()
        fetchRaidData()
        fetchPartyData()
    }, [])

    const fetchPartyData = async () => {
        const { data, error } = await supabase
            .from('Party')
            .select()
            .order('id')

        if (data) {
            console.log('complete fetch party data')
            setPartyData(data)
        } else {
            console.error('Error fetching party data:', error)
        }
    }

    const fetchRaidData = async () => {
        const { data, error } = await supabase
            .from('Raid')
            .select()
            .order('id')

        if (data) {
            console.log('complete fetch raid data')
            setRaidData(data)
        } else {
            console.error('Error fetching raid data:', error)
        }
    }

    const fetchCharacterData = async () => {
        const { data, error } = await supabase
            .from('Character')
            .select()
            .order('id')

        if (data) {
            console.log('complete fetch character data')
            setCharacterData(data)
        } else {
            console.error('Error fetching character data:', error)
        }
    }

    const fetchMemberData = async () => {
        const { data, error } = await supabase
            .from('Member')
            .select()
            .order('id')

        if (data) {
            console.log('complete fetch member data')
            setMemberData(data)
        } else {
            console.error('Error fetching member data:', error)
        }
    }

    const sortedPartyData = useMemo(() => {
        // day 값에 따라 분류
        const groupedByDay = partyData.reduce((acc: any, data) => {
            const { day } = data;
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(data);
            return acc;
        }, {});

        // time 값에 따라 정렬
        Object.keys(groupedByDay).forEach(day => {
            groupedByDay[day].sort((a: any, b: any) => a.time - b.time);
        });

        return groupedByDay as PartyData[][];
    }, [partyData]);

    const handleAddParty = async () => {
        let id;

        if (partyData.length === 0) {
            id = 0
        } else {
            id = partyData[partyData.length - 1].id + 1
        }

        const selectedRaidId = parseInt(selectedRaid)
        const selectedDayInt = parseInt(selectedDay)
        const selectedTimeInt = parseInt(timeSlots[parseInt(selectedTime)])

        try {
            const { data, error } = await supabase
                .from('Party')
                .insert([
                    {
                        id: id + 1,
                        raid_id: selectedRaidId,
                        member: [0, 0, 0, 0, 0, 0, 0, 0],
                        day: selectedDayInt,
                        time: selectedTimeInt
                    }
                ])

            if (error) {
                throw error
            }

            fetchPartyData()
        } catch (error) {
            console.error('파티 추가 에러:', error)
        }
    }

    const handleDeleteParty = async (id: number) => {
        try {
            const { data, error } = await supabase
                .from('Party')
                .delete()
                .eq('id', id)

            if (error) {
                throw error
            }

            fetchPartyData()
        } catch (error) {
            console.error('파티 추가 에러:', error)
        }
    }

    function handleDragStart(e: any, character: CharacterData) {
        e.dataTransfer?.setData('characterId', character.id);
        e.dataTransfer?.setData('characterType', character.char_type);
    }

    function handleRightClick(e: any, showRemove: boolean, character: CharacterData, partyId: number) {
        e.preventDefault();
        console.log(character.char_name, showRemove)
        if (!showRemove) return
        removeCharacterFromParty(partyId, character.id)
    }

    function handleDrop(e: any, partyData: PartyData) {
        e.preventDefault();
        const characterId = parseInt(e.dataTransfer?.getData('characterId'))
        const characterType = e.dataTransfer?.getData('characterType')
        const partyId = partyData.id

        setPartyData(prevPartyData => {
            return prevPartyData.map(party => {
                if (party.id === partyId) {
                    let updatedGroup = [...party.member]

                    if (characterType === "D") {
                        if (updatedGroup[0] === 0) {
                            updatedGroup[0] = characterId;
                        } else if (updatedGroup[1] === 0) {
                            updatedGroup[1] = characterId;
                        } else if (updatedGroup[2] === 0) {
                            updatedGroup[2] = characterId;
                        } else if (updatedGroup[4] === 0) {
                            updatedGroup[4] = characterId;
                        } else if (updatedGroup[5] === 0) {
                            updatedGroup[5] = characterId;
                        } else if (updatedGroup[6] === 0) {
                            updatedGroup[6] = characterId;
                        }
                    } else if (characterType === "S") {
                        if (updatedGroup[3] === 0) {
                            updatedGroup[3] = characterId;
                        } else if (updatedGroup[7] === 0) {
                            updatedGroup[7] = characterId;
                        }
                    }

                    return { ...party, member: updatedGroup }
                }
                return party
            })
        })
    }

    function handleDragOver(e: any) {
        e.preventDefault();
    }

    function removeCharacterFromParty(partyId: number, characterId: number) {
        console.log("Remove : ", partyId, characterId)
        setPartyData(prevPartyData => {
            return prevPartyData.map(party => {
                if (party.id === partyId) {
                    const updatedGroup = party.member.map(id => {
                        if (id === characterId) {
                            return 0;
                        }
                        return id;
                    });
                    console.log(updatedGroup)
                    return { ...party, member: updatedGroup }
                }
                return party
            })
        })
    }

    function makePartyBox(partyData: PartyData) {
        const raidInfo = raidData[partyData.raid_id]
        if (raidInfo === undefined) {
            return <Box></Box>
        }

        return (
            <Box
                key={partyData.id}
                marginBottom={1}
                border={2}
                borderRadius={1}
                padding={1}
                bgcolor={raidInfo.raid_color}
                borderColor={raidInfo.raid_color}
                onDrop={(e) => handleDrop(e, partyData)}
                onDragOver={(e) => handleDragOver(e)}>
                <Typography fontSize={15} style={{ color: 'white' }}>{raidInfo.short_name} <Button style={{ color: 'white', fontSize: '10px' }} onClick={() => { handleDeleteParty(partyData.id) }}>삭제</Button></Typography>
                <Typography marginBottom={1} fontSize={14} style={{ color: 'white' }}>{days[partyData.day]}요일, {partyData.time}시</Typography>
                {
                    partyData.member.map((id, memberIdx) => {
                        if (id === 0) return makeEmptyCharacter(String(partyData.id) + String(memberIdx + 900000), memberIdx, true, partyData.id)
                        const character = characterData.filter(character => character.id == id)[0]
                        if (character === undefined) return <Box></Box>
                        return makeCharacter(String(partyData.id) + String(character.id), character, true, partyData.id)
                    })
                }
            </Box>
        )
    }

    function makeEmptyCharacter(key: string, index: number, showRemove: boolean = false, partyId: number = 0) {
        return (
            <Card key={key}
                style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', height: '30px', marginTop: '3px' }}>
                <CardContent style={{ padding: '0 10px' }}>
                    <Typography style={{ fontSize: '12px' }}>{index === 3 || index === 7 ? "서폿" : "딜러"}</Typography>
                </CardContent>
            </Card>
        )
    }

    function makeCharacter(key: string, character: CharacterData, showRemove: boolean = false, partyId: number = 0) {
        const member = memberData.filter(member => member.id === character.member_id)[0]
        const bgColor = member?.personal_color
        const textColor = member?.text_color

        return (
            <Card key={key}
                style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', backgroundColor: bgColor, color: textColor, height: '30px', marginTop: '3px' }}
                draggable={!showRemove}
                onDragStart={(e) => handleDragStart(e, character)}
                onContextMenu={(e) => handleRightClick(e, showRemove, character, partyId)}>
                <CardContent style={{ padding: '0 10px' }}>
                    <Typography style={{ fontSize: '12px' }}>{character.char_name} {character.char_class} {!showRemove && character.char_level}</Typography>
                </CardContent>
            </Card>
        )
    }

    const [selectedRaid, setSelectedRaid] = useState<string>('0')
    const [selectedDay, setSelectedDay] = useState<string>('0')
    const [selectedTime, setSelectedTime] = useState<string>('0')

    function getFilteredCharacters(): CharacterData[] {
        const currentRaidInfo = raidData[parseInt(selectedRaid)]
        const day = daysOfWeek[parseInt(selectedDay)]
        const time = timeSlots[parseInt(selectedTime)]

        if (currentRaidInfo) {
            const includeRaidCharacters = characterData.filter(character => currentRaidInfo.raid_group.includes(character.id))
            const canMembers = memberData.filter(member => member.schedule[day][time] === 1)
            const canCharacters = includeRaidCharacters.filter(character => canMembers.filter(member => member.id === character.member_id).length > 0)
            return canCharacters
        } else {
            return []
        }
    }

    function showTopMenu() {
        if (raidData.length === 0) return <Box></Box>

        return (
            <Box display="flex">
                <Box display="flex" flex={1} justifyContent="flex-start" paddingLeft={3} gap={2}>
                    <Button variant='contained'
                        onClick={handleAddParty}>파티 편성 확정</Button>
                </Box>
                <Box display="flex" flex={1} justifyContent="flex-end" paddingRight={3} gap={2}>
                    <Select value={selectedRaid} onChange={(e) => {
                        setSelectedRaid(e.target.value)
                    }}>
                        {raidData?.map((raid, index) => {
                            return <MenuItem key={raid.id} value={index}>{raid.raid_name}</MenuItem>
                        })}
                    </Select>
                    <Select value={selectedDay} onChange={(e) => {
                        setSelectedDay(e.target.value)
                    }}>
                        {days?.map((day, index) => {
                            return <MenuItem key={day} value={index}>{day}요일</MenuItem>
                        })}
                    </Select>
                    <Select value={selectedTime} onChange={(e) => {
                        setSelectedTime(e.target.value)
                    }}>
                        {timeSlots?.map((time, index) => {
                            return <MenuItem key={time} value={index}>{time}시</MenuItem>
                        })}
                    </Select>
                    <Button variant='contained'
                        onClick={handleAddParty}>추가</Button>
                    <Button variant='contained'
                        onClick={() => { }}>전체 삭제</Button>
                </Box>
            </Box>)
    }

    const tableData = days.map((day, index) => {
        const partyArray = sortedPartyData[index] || [];
        return {
            day,
            index,
            parties: partyArray
        };
    });

    const PartyComponent: React.FC<{ party: any }> = ({ party }) => {
        return (
            <Paper style={{ margin: '10px 10px' }}>
                {makePartyBox(party)}
            </Paper>
        );
    };

    const DayComponent: React.FC<{ dayData: any }> = ({ dayData }) => {
        return (
            <Grid item xs borderLeft={1} borderTop={1} bgcolor={getDayBgColor(dayData.day)}>
                <Typography variant="h6" borderBottom={1} style={{ textAlign: 'center' }} onClick={() => { setSelectedDay(String(dayData.index)) }}>{dayData.day}</Typography>
                {dayData.parties.map((party: any) => (
                    <PartyComponent key={party.id} party={party} />
                ))}
            </Grid>
        );
    };

    const TableComponent = () => {
        return (
            <Grid container>
                {tableData.map(dayData => (
                    <DayComponent key={dayData.day} dayData={dayData} />
                ))}
            </Grid>
        );
    };

    return (
        <Box>
            {showTopMenu()}
            <Box display="flex" padding={2} style={{ maxHeight: '800px' }}>
                <Box flex={1} border={1} style={{ overflowY: 'auto' }} padding={1}>
                    <Typography variant='h6' borderBottom={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>캐릭터 목록</Typography>
                    {
                        getFilteredCharacters().map((character) => {
                            return makeCharacter(String(character.id), character)
                        })
                    }
                </Box>
                <Box flex={6} borderRight={1} borderTop={1} borderBottom={1} style={{ overflowY: 'auto' }} marginLeft={2}>
                    <Typography variant='h6' borderLeft={1} style={{ fontWeight: 'bold', textAlign: 'center' }}>파티 목록</Typography>
                    <TableComponent />
                </Box>
            </Box>
        </Box>
    )
}
