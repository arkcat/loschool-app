'use client'
import * as React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material"

import { ReactNode } from "react"

interface Member {
    id: number
    nick_name: string
    primary_color: string
    text_color: string
    schedule: JSON
}

export var memberId: number
export default function SelectMember({ members }: { members: Member[] | null }) {
    const [age, setAge] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setAge(event.target.value);
    };

    return (
        <FormControl>
            <Select MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                onChange={handleChange}>
                {members?.map((member) => {
                    return <MenuItem value={member.id}>{member.nick_name}</MenuItem>
                })}
            </Select>
        </FormControl>
    )
}
