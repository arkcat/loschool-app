import { Typography } from '@mui/material'
import React, { useState } from 'react'

function ScheduleBox({ number, value, onClick }: { number: string, value: number, onClick: any }) {
    const [clicked, setClicked] = useState(value === 1)

    const toggleColor = () => {
        setClicked(!clicked)
        onClick(value)
    }

    const color = clicked ? '#f3e07c' : '#d1d7b1'
    const borderColor = clicked ? '#e6bd76' : '#d1d7b1'
    return (
        <div
            onClick={toggleColor}
            style={{
                width: '25px',
                height: '25px',
                background: color,
                display: 'inline-block',
                border: `2px solid ${borderColor}`
            }}
        > <Typography align='center'>{number}</Typography> </div>
    )
}

export default ScheduleBox