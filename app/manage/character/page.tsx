"use client";

import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";
import FilteredData from "./filter-page";
import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
} from "@mui/material";
import AllCharactersUpdate from "@/app/api/UpdateCharacters";

export default function CharactersPage() {
  const [options, setOptions] = useState<any[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>("0");

  useEffect(() => {
    async function fetchOptions() {
      const { data, error } = await supabase
        .from("Member")
        .select()
        .neq("id", 9999)
        .order("id");

      if (data) {
        setOptions(data);
      }
    }
    fetchOptions();
  }, []);

  const handleChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" position="relative" height="100dvh">
      <Typography variant='h3' className='page-title'>캐릭터 목록</Typography>
      <FormControl>
        <Select value={selectedOption}
          variant='outlined'
          sx={{ background: '#fff', minWidth: 250, height: 40, borderRadius: 18 }}
          onChange={handleChange}>
          <MenuItem value="0">전체</MenuItem>
          {options?.map((option) => {
            return <MenuItem value={option.id}>{option.nick_name}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        sx={{ margin: "5px" }}
        onClick={AllCharactersUpdate}
      >캐릭터 정보 업데이트</Button>
      <FilteredData members={options} selectedOption={selectedOption} />
    </Box>
  );
}
