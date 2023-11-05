"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import {
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { getPlainText } from "@/utils/TextUtils";
import { CharacterData } from "@/lib/database.types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";

export default function CharacterDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = parseInt(getPlainText(searchParams.get("id") || ""));

  const [character, setCharacter] = useState<CharacterData | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      const { data, error } = await supabase
        .from("Character")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching member:", error);
      } else {
        setCharacter(data);
      }
    };

    if (id) {
      fetchMember();
    }
  }, [id]);

  const handleUpdateMember = async () => {
    try {
      const { error } = await supabase
        .from("Character")
        .update({
          char_name: character?.char_name,
          char_class: character?.char_class,
          char_level: character?.char_level,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      alert("멤버 정보가 저장되었습니다.");
    } catch (error: any) {
      console.error("Error updating member:", error.message);
    }
  };

  const handleDeleteCharacter = async (charId: number) => {
    const memberId = character?.member_id;
    try {
      const { data, error } = await supabase
        .from("Character")
        .delete()
        .eq("id", charId);

      if (error) {
        throw error;
      }

      alert("캐릭터 삭제 성공");
      router.back();
    } catch (error) {
      console.error("캐릭터 삭제 에러:", error);
    }
  };

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  return (
    <MainPageBox>
      <Box pb={3} pt={10}>
        <Box display="flex" position='absolute' left={0}>
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
        <Grid
          container
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Grid item xs={12}>
            {character && (
              <Typography className='page-title'>{character?.char_name} 수정</Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>이름</Typography>
            <TextField
              size="small"
              type="text"
              value={character?.char_name}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setCharacter({
                  ...(character as CharacterData),
                  char_name: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>직업</Typography>
            <TextField
              size="small"
              type="text"
              value={character?.char_class}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setCharacter({
                  ...(character as CharacterData),
                  char_class: e.target.value,
                })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography style={{ marginLeft: 10, fontFamily: 'S-CoreDream-3Light', fontWeight: 700, fontSize: '20px' }}>레벨</Typography>
            <TextField
              size="small"
              type="text"
              value={character?.char_level}
              InputProps={{
                style: {
                  border: 'none',
                  borderRadius: 18,
                  background: '#fff'
                }
              }}
              onChange={(e) =>
                setCharacter({
                  ...(character as CharacterData),
                  char_level: parseInt(e.target.value),
                })
              }
            />
          </Grid>
        </Grid>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "15px",
            gap: "15px",
          }}
        >
          <Button variant="contained" onClick={handleUpdateMember}>
            저장
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              const shouldDelete = window.confirm(
                `[${character?.char_name}] 정말로 삭제하시겠습니까?`
              );
              if (character && shouldDelete) {
                handleDeleteCharacter(character.id);
              }
            }}
          >
            캐릭터 삭제
          </Button>
        </Box>
      </Box>
    </MainPageBox>
  );
}
