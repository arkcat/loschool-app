'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect, ChangeEvent } from 'react';
import FilteredData from './server-component';
import { FormControl, Select, MenuItem } from '@mui/material';

interface PageProps { }

const Page: React.FC<PageProps> = () => {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  useEffect(() => {
    async function fetchOptions() {
      const { data, error } = await supabase.from('Member').select().order('id')
      if (data) {
        setOptions(data);
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <h1>페이지</h1>
      <FormControl>
        <select value={selectedOption} onChange={handleChange}>
          <option value="0">전체</option>
          {options?.map((option) => {
            return <option value={option.id}>{option.nick_name}</option>
          })}
        </select>
      </FormControl>
      {/* 선택된 드롭다운 값으로 데이터 필터링 */}
      <FilteredData members={options} selectedOption={selectedOption} />
    </div>
  );
};

export default Page;