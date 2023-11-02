'use client'

import { useEffect, useMemo, useState } from 'react'
import { Box, Button, Card, CardContent, Grid, IconButton, MenuItem, Paper, Select, TextField, Typography } from '@mui/material'
import { CharacterData, MemberData, PartyData, RaidData, days, daysOfWeek, timeSlots } from '@/lib/database.types'
import { supabase } from '@/utils/supabase'
import { getDayBgColor, hexToRgba } from '@/utils/ColorUtils'
import SearchIcon from '@mui/icons-material/SearchOutlined'

export const dynamic = 'force-dynamic'

export default function AutoPartyPage() {
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


    function getAvailableMemberIds(dayIdx: number, timeIdx: number): number[] {
        const day = daysOfWeek[dayIdx]
        const time = timeSlots[timeIdx]
        const availableMemberIds = memberData.filter(member => member.schedule[day][time] === 1)
            .map(member => member.id)
        return availableMemberIds
    }

    function getAvailableCharacterIds(day: number, time: number, raidId: number): number[] {
        if (memberData.length > 0 && characterData.length > 0) {
            const memberIds = getAvailableMemberIds(day, time)
            const characterIds = characterData
                .filter(char => memberIds.includes(char.member_id))
                .map(char => char.id)
            const selectedRaid = raidData.filter(raid => raid.id === raidId)[0]
            const availableCharacterIds = selectedRaid?.raid_group.filter(charId => characterIds.includes(charId))

            return availableCharacterIds
        }

        return []
    }

    function getEntryCharacterIds(selectedDay: number, selectedTime: number): Map<number, number[]> {
        const mapData = new Map<number, number[]>()

        const day = selectedDay
        const time = parseInt(timeSlots[selectedTime])
        const memberIds = getAvailableMemberIds(day, time)
        const ids = raidData.map(info => {
            info.raid_group
        })

        return mapData
    }

    interface DayTimePartyInfo {
        day: string
        time: string
        raid_entry: Map<number, number[]>
    }

    const getRaidName = (id: number) => {
        return raidData.filter(r => r.id === id)[0].raid_name
    }

    const isDealer = (id: number) => {
        const character = characterData.filter(character => character.id == id)[0]
        if (character === undefined) return false
        return character.char_type === 'D'
    }

    const isSupporter = (id: number) => {
        const character = characterData.filter(character => character.id == id)[0]
        if (character === undefined) return false
        return character.char_type === 'S'
    }

    interface RaidTest {
        name: string
        party: {
            [day: string]: {
                [time: string]: {
                    deal: number
                    pot: number
                }
            }
        }
    }
    function makeParties() {
        const dataDayTimeTable: DayTimePartyInfo[] = []
        days.forEach((day, dayIdx) => {
            timeSlots.forEach((time, timeIdx) => {
                const entry = new Map<number, number[]>()
                raidData.forEach(raid => {
                    const charIds = getAvailableCharacterIds(dayIdx, timeIdx, raid.id)
                    if (charIds.length > 5) {
                        entry.set(raid.id, charIds)
                    }
                })
                if (entry.size > 0) {
                    dataDayTimeTable.push({ day: day, time: time, raid_entry: entry })
                }
            })
        })

        const testParties = new Map<number, RaidTest[]>()
        dataDayTimeTable.forEach(info => {
            info.raid_entry.forEach((entry, key) => {
                const name = getRaidName(key)
                let d = 0
                let s = 0

                entry.forEach(id => {
                    if (isDealer(id)) {
                        d++
                    } else {
                        s++
                    }
                })
                const raidTest: RaidTest = {
                    name: name, // getRaidName 함수가 있어야 함
                    party: {
                        [info.day]: {
                            [info.time]: {
                                deal: d, // getDealersCount 함수가 있어야 함
                                pot: s,
                            },
                        },
                    },
                };
                if (testParties.has(key)) {
                    testParties.get(key)?.push(raidTest);
                } else {
                    testParties.set(key, [raidTest]);
                }
            })
        })

        testParties.forEach((value, key) => {
            value.forEach(p => {
                console.log(p.party['목']['22'])
            })
        })

        return (<Box></Box>)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100dvh">
            {makeParties()}
        </Box>
    )
}