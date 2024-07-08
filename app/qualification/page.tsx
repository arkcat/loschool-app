"use client";

import { Typography, TableContainer, Box, Button } from "@mui/material";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";
import QualificationInfo from "./QualificationInfo";
import { useEffect, useState } from "react";
import { MemberData, RaidData } from "@/lib/database.types";
import { supabase } from "@/utils/supabase";

export default function CharactersPage() {
  const userSession = useRequireAuth();

  const [raids, setRaids] = useState<RaidData[]>([]);

  const [userPermission, setPermission] = useState<String>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authSession = supabase.auth.getSession();
        const currentSession = (await authSession).data.session;
        if (currentSession !== null) {
          getLoginMember(currentSession.user.id);
        } else {
          setPermission("");
        }
      } catch (error: any) {
        console.error("사용자 정보 가져오기 오류:", error.message);
      }
    };

    fetchUser();
  }, []);

  const getLoginMember = async (uid: string) => {
    try {
      console.log("get login memeber info : " + uid);
      const { data, error } = await supabase
        .from("Member")
        .select()
        .eq("uid", uid);

      if (error) {
        throw error;
      }

      if (data) {
        data[0] as MemberData;
        setPermission(data[0].permission);
      }
    } catch (error: any) {
      console.error("Error updating member:", error.message);
    }
  };

  useEffect(() => {
    const fetchRaid = async () => {
      const { data, error } = await supabase.from("Raid").select().order("id");

      if (error) console.error("Error fetching raids:", error);
      else setRaids(data);
    };

    fetchRaid();
  }, []);

  if (!userSession) {
    return <div>Loading...</div>;
  }

  const handleTextUpdate = (index: number, updatedText: string) => {
    const newRaidData = [...raids];
    newRaidData[index].raid_qualify = updatedText;
    console.log(updatedText);
    setRaids(newRaidData);
  };

  const handleSave = async () => {
    try {
      for (const raid of raids) {
        const { data, error } = await supabase
          .from("Raid")
          .update({ raid_qualify: raid.raid_qualify })
          .eq("id", raid.id);

        if (error) {
          throw error;
        }
      }

      alert("데이터가 성공적으로 저장되었습니다!");
    } catch (error: any) {
      console.error("데이터 저장 중 오류 발생:", error.message);
      alert("데이터 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <MainPageBox>
      <Typography className="page-title">레이드 참여 스펙</Typography>
      {userPermission === "professor" && (
        <Button
          variant="contained"
          sx={{ marginBottom: "5px" }}
          onClick={handleSave}
        >
          업데이트
        </Button>
      )}
      <Box sx={{ mb: 4, height: "95dvh", overflowY: "auto" }}>
        {raids.map((raid, index) => (
          <QualificationInfo
            key={index}
            raid={raid}
            isReadOnly={userPermission !== "professor"}
            onTextChanged={(updatedText) =>
              handleTextUpdate(index, updatedText)
            }
          />
        ))}
      </Box>
    </MainPageBox>
  );
}
