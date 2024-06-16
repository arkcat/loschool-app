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
import AllCharactersUpdate from "@/utils/UpdateCharacters";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";

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

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  return (
    <MainPageBox>
      <Typography className="page-title">캐릭터 목록</Typography>
      <FormControl>
        <Select
          value={selectedOption}
          variant="outlined"
          sx={{
            background: "#fff",
            minWidth: 250,
            height: 40,
            borderRadius: 18,
          }}
          onChange={handleChange}
        >
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
      >
        캐릭터 정보 업데이트
      </Button>
      <FilteredData members={options} selectedOption={selectedOption} />
    </MainPageBox>
  );
}
