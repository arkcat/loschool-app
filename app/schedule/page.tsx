'use client'

import { FormControl, Select, MenuItem } from '@mui/material'
import { supabase } from '@/utils/supabase'
import { useState, useEffect, ChangeEvent } from 'react'

export const dynamic = 'force-dynamic'

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
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <div>
          <h3 className="font-bold mb-2  min-h-[40px] lg:min-h-[60px] text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            스케쥴
          </h3>
          <FormControl>
            <select value={selectedOption} onChange={handleChange}>
              <option value="0">전체</option>
              {options?.map((option) => {
                return <option key={option.id} value={option.id}>{option.nick_name}</option>
              })}
            </select>
          </FormControl>
        </div>
      </div>
    </div>
  )
};

export default Page;