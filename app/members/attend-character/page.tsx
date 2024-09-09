"use client";

import MainPageBox from "@/components/MainPageBox";
import { RaidData, CharacterData, MemberData } from "@/lib/database.types";
import useRequireAuth from "@/utils/AuthUtils";
import { getBase64Text, getPlainText } from "@/utils/TextUtils";
import { supabase } from "@/utils/supabase";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { checkRaidDisabled } from "../common/attendUtils";

export default function pages() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const characterId = parseInt(getPlainText(searchParams.get("id") || ""));
  const [raids, setRaids] = useState<RaidData[]>([]);
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    const fetchRaid = async () => {
      try {
        const { data } = await supabase.from("Raid").select().order("id");

        if (data) {
          setRaids(data);
        } else {
          throw new Error("레이드 정보를 찾을 수 없습니다.");
        }
      } catch (error) {
        console.error(`에러 : {error}`);
      }
    };

    const fetchCharactersData = async () => {
      try {
        console.log(characterId);
        const { data } = await supabase
          .from("Character")
          .select()
          .eq("id", characterId);

        if (data) {
          console.log(data);
          setCharacters(data);
        }
      } catch (error) {
        console.error("에러 발생 : ", error);
      }
    };

    fetchRaid();
    fetchCharactersData();
  }, []);

  const handleSave = async () => {
    for (const raid of raids) {
      const { data, error } = await supabase
        .from("Raid")
        .update({ raid_group: raid.raid_group })
        .eq("id", raid.id);

      if (error) {
        console.error(`Error updating raid ${raid.id}:`, error);
      } else {
        console.log(`Raid ${raid.id} updated successfully!`);
      }
    }
    alert("레이드 정보를 업데이트 했습니다.");
  };

  const handleCheckboxChange = (raidId: number, characterId: number) => {
    var relatedRaidId = 0;
    if (raidId === 40009) {
      relatedRaidId = 40008;
    }

    setRaids((prevRaids) => {
      return prevRaids.map((raid) => {
        if (raid.id === raidId) {
          const updatedGroup = raid.raid_group.includes(characterId)
            ? raid.raid_group.filter((id) => id !== characterId)
            : [...raid.raid_group, characterId];
          return { ...raid, raid_group: updatedGroup };
        }
        if (relatedRaidId > 0 && raid.id === relatedRaidId) {
          if (!raid.raid_group.includes(characterId)) {
            const updatedGroup = [...raid.raid_group, characterId];
            return { ...raid, raid_group: updatedGroup };
          }
        }
        return raid;
      });
    });
  };

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  if (characters.length === 0) {
    return <Box></Box>;
  } else {
    return (
      <MainPageBox>
        <Box display="flex" position="absolute" left={0}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            style={{
              position: "relative",
              top: "10px",
              left: "30px",
            }}
            onClick={() => {
              router.back();
            }}
          >
            <ArrowBackIcon style={{ fontSize: 40 }} />
          </IconButton>
        </Box>
        <Typography className="page-title">
          {characters[0].char_name} 출석부
        </Typography>
        <Box>
          <Button
            variant="contained"
            onClick={() => {
              handleSave();
            }}
          >
            저장
          </Button>
        </Box>
        <Box display={"flex"}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "85dvh", minWidth: "70dvw", overflowY: "auto" }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 99,
                      fontFamily: "S-CoreDream-3Light",
                      fontSize: "12px",
                    }}
                    sx={{
                      minWidth: "50px",
                      textAlign: "center",
                      borderRight: "2px #f3e07c solid",
                      borderBottom: "2px #f3e07c solid",
                    }}
                  >
                    레이드
                  </TableCell>
                  <TableCell
                    sx={{
                      minWidth: "30px",
                      textAlign: "center",
                      borderBottom: "2px #f3e07c solid",
                    }}
                    style={{
                      fontFamily: "S-CoreDream-3Light",
                      fontSize: "12px",
                    }}
                  >
                    참가
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {raids.map((raid: RaidData) => (
                  <TableRow key={raid.id} style={{ textAlign: "center" }}>
                    <TableCell
                      sx={{
                        minWidth: "80px",
                        borderBottom: "2px #f3e07c solid",
                        background: raid.raid_color,
                        color: "#fff",
                      }}
                      key={raid.id}
                      align="center"
                    >
                      <Typography
                        style={{
                          fontFamily: "S-CoreDream-3Light",
                          fontSize: "12px",
                        }}
                      >
                        {raid.raid_name}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "S-CoreDream-3Light",
                          fontSize: "10px",
                        }}
                      >
                        {raid.raid_level}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        disabled={checkRaidDisabled(raids, raid, characters[0])}
                        checked={raid.raid_group.includes(characterId)}
                        onChange={(e) => {
                          handleCheckboxChange(raid.id, characterId);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </MainPageBox>
    );
  }
}
