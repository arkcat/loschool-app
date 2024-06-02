"use client";
import MainPageBox from "@/components/MainPageBox";
import SnsCard, { ISnsCard } from "@/components/lostagram/SnsCard";
import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";

import React, { useEffect } from "react";
import FormDialog from "./FormDialog";
import { supabase } from "@/utils/supabase";

function page() {
  const [snsList, setSnsList] = React.useState<ISnsCard[]>([]);

  useEffect(() => {
    const fetchSns = async () => {
      const { data, error } = await supabase
        .from("Sns")
        .select()
        .filter("use_yn", "eq", "Y");
      if (error) {
        console.error(error);
        throw new Error("SNS 조회 에러");
      }
      console.log(data);
      setSnsList(data);
    };
    fetchSns();
  }, []);

  return (
    <MainPageBox>
      <Stack
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        spacing={3}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          pt={5}
          spacing={3}
        >
          <Typography variant="h4">Lostagram</Typography>
          <FormDialog setSnsList={setSnsList} />
        </Stack>
        <Grid
          container
          maxWidth={"1200px"}
          overflow={"scroll"}
          maxHeight={"600px"}
        >
          {snsList?.map((snsObj) => (
            <Grid item xs={4}>
              <SnsCard key={snsObj.id} SnsObj={snsObj} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </MainPageBox>
  );
}

export default page;
