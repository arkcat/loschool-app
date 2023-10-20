'use client'

import { supabase } from '@/utils/supabase'
import { useState, useEffect } from 'react'
import FilteredData from './filter-page'
import { FormControl, Select, MenuItem, Typography, Box } from '@mui/material'

export default function CharactersPage() {

  const [options, setOptions] = useState<any[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')

  useEffect(() => {
    async function fetchOptions() {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .neq('id', 9999)
        .order('id')

      if (data) {
        setOptions(data)
      }
    }
    fetchOptions()
  }, [])

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value)
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h1" align={'center'} margin={2}>Characters</Typography>
      <FormControl>
        <Select value={selectedOption} onChange={handleChange}>
          <MenuItem value="0">전체</MenuItem>
          {options?.map((option) => {
            return <MenuItem value={option.id}>{option.nick_name}</MenuItem>
          })}
        </Select>
      </FormControl>
      <FilteredData members={options} selectedOption={selectedOption} />
    </Box>
  )
}
