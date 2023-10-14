'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Select, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { CharacterData, MemberData, PartyData, RaidData, days, daysOfWeek, timeSlots } from '@/lib/database.types'

import { supabase } from '@/utils/supabase'

export default function Index() {
    const router = useRouter()

    const [partyData, setPartyData] = useState<PartyData[]>([])
    const [raidData, setRaidData] = useState<RaidData[]>([])
    const [characterData, setCharacterData] = useState<CharacterData[]>([])
    const [memberData, setMemberData] = useState<MemberData[]>([])

    useEffect(() => {
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

        fetchMemberData()
        fetchCharacterData()
        fetchRaidData()
        fetchPartyData()

    }, [])

    function handleDragStart(e: any, character: CharacterData) {
        e.dataTransfer?.setData('characterId', character.id);
    }

    function handleDrop(e: any, partyData: PartyData) {
        e.preventDefault();
        const characterId = parseInt(e.dataTransfer?.getData('characterId'))
        const partyId = partyData.id

        setPartyData(prevPartyData => {
            return prevPartyData.map(party => {
                if (party.id === partyId) {
                    const updatedGroup = party.member.includes(characterId)
                        ? party.member
                        : [...party.member, characterId]

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
        setPartyData(prevPartyData => {
            return prevPartyData.map(party => {
                if (party.id === partyId) {
                    const updatedGroup = party.member.includes(characterId)
                        ? party.member.filter(id => id !== characterId)
                        : party.member

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
            <Box key={partyData.id}
                style={{ border: '4px solid #ccc' }}
                marginLeft={2}
                marginBottom={1}
                padding={2}
                onDrop={(e) => handleDrop(e, partyData)}
                onDragOver={(e) => handleDragOver(e)}>
                <Typography marginBottom={1}>{raidInfo.raid_name} {days[partyData.day]}요일, {partyData.time}시
                    <Button>삭제</Button>
                </Typography>
                {
                    partyData.member.map((id) => {
                        const character = characterData.filter(character => character.id == id)[0]
                        if (character === undefined) return <Box></Box>
                        return makeCharacter(String(partyData.id) + String(character.id), character, true, partyData.id)
                    })
                }
            </Box>
        )
    }

    function makeCharacter(key: string, character: CharacterData, showRemove: boolean = false, partyId: number = 0) {
        const member = memberData.filter(member => member.id === character.member_id)[0]
        const bgColor = member?.personal_color
        const textColor = member?.text_color

        return (
            <Card key={key}
                style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', backgroundColor: bgColor, color: textColor, height: '30px' }}
                draggable={!showRemove}
                onDragStart={(e) => handleDragStart(e, character)}>
                <CardContent style={{ padding: '0 10px' }}>
                    <Typography style={{ fontSize: '15px' }}>{character.char_name} {character.char_class} {character.char_level}
                        {showRemove === true &&
                            <IconButton onClick={() => { removeCharacterFromParty(partyId, character.id) }}>
                                <DeleteIcon style={{ fontSize: 20 }} />
                            </IconButton>}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    function showTopMenu() {
        return (
            <Box display="flex" justifyContent="flex-end" paddingRight={3} gap={2}>
                <Select value={raidData[0].id}>
                    {raidData?.map((raid) => {
                        return <MenuItem key={raid.id} value={raid.id}>{raid.raid_name}</MenuItem>
                    })}
                </Select>
                <Select value={days[0]}>
                    {days?.map((day) => {
                        return <MenuItem key={day} value={day}>{day}요일</MenuItem>
                    })}
                </Select>
                <Select value={timeSlots[0]}>
                    {timeSlots?.map((time) => {
                        return <MenuItem key={time} value={time}>{time}시</MenuItem>
                    })}
                </Select>
                <Button variant='contained'
                    onClick={() => { }}>추가</Button>
                <Button variant='contained'
                    onClick={() => { }}>전체 삭제</Button>
            </Box>
        )
    }

    return (
        <Box>
            { showTopMenu() }
            <Box display="flex" padding={2}>
                <Box flex={0.4} style={{ overflowY: 'auto', maxHeight: '750px' }}>
                    {
                        characterData.map((character) => {
                            return makeCharacter(String(character.id), character)
                        })
                    }
                </Box>
                <Box flex={1} style={{ overflowY: 'auto', maxHeight: '750px' }}>
                    {
                        partyData && partyData.map((data) => {
                            return makePartyBox(data)
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}
