import { Typography } from '@mui/material';
import React, { useState } from 'react';

function ScheduleBox({ number, value, onClick }: { number: string, value: number, onClick: any }) {
    const [clicked, setClicked] = useState(value === 1);

    const toggleColor = () => {
        setClicked(!clicked);
        onClick(value);
    };

    const color = clicked ? '#00ffff' : '#cecece';

    return (
        <div
            onClick={toggleColor}
            style={{
                width: '25px',
                height: '25px',
                background: color,
                margin: '1px',
                display: 'inline-block',
            }}
        > <Typography align='center'>{number}</Typography> </div>
    );
}

export default ScheduleBox;