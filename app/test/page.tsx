'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react';
import FilteredData from './server-component';
import { FormControl, Select, MenuItem } from '@mui/material';

const Page = () => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    useEffect(() => {
        async function fetchOptions() {
            const { data, error } = await supabase.from('Member').select().order('id')
            if (data) {
                setOptions(data);
            }
        }
        fetchOptions();
    }, []);

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };

    return (
        <div>
            <h1>페이지</h1>
            <FormControl>
                <Select MenuProps={{ PaperProps: { sx: { maxHeight: 300 } } }}
                    onChange={handleChange}>
                    <MenuItem value="0">전체</MenuItem>
                    {options?.map((option) => {
                        return <MenuItem value={option.id}>{option.nick_name}</MenuItem>
                    })}
                </Select>
            </FormControl>
            {/* 선택된 드롭다운 값으로 데이터 필터링 */}
            <FilteredData members={options} selectedOption={selectedOption} />
        </div>
    );
};

export default Page;