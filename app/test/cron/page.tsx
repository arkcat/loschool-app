'use client'

import AllCharactersUpdate from "@/app/api/UpdateCharacters";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default async function cronTest() {
  return (
    <Box>
      <Button onClick={() => {
        AllCharactersUpdate()
      }}>cron test</Button>
    </Box>
  );
}
