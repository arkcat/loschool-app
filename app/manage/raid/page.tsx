"use client";

import { Box, Typography, Grid, Card, CardContent } from "@mui/material";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";
import { RaidData } from "@/lib/database.types";
export const dynamic = "force-dynamic";

function makeRaidCard(raidId: number, raidName: string) {
  return (
    <Grid item xs={6} lg={4} key={raidId}>
      <Card>
        <CardContent>
          <Typography variant="h6">{raidName}</Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

export default function RaidPage() {
  const [raids, setRaids] = useState<RaidData[]>([]);

  useEffect(() => {
    const fetchRaid = async () => {
      const { data, error } = await supabase.from("Raid").select().order("id");

      if (error) console.error("Error fetching raids:", error);
      else setRaids(data);
    };

    fetchRaid();
  }, []);

  return (
    <Box padding={2}>
      <Typography variant="h2" align={"center"} margin={2}>
        Raid
      </Typography>
      <Box>
        <Grid container spacing={2}>
          {raids?.map((raid: any) => {
            return makeRaidCard(raid.id, raid.raid_name);
          })}
        </Grid>
      </Box>
    </Box>
  );
}
