"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/userAtom";
import LoginForm from "@/components/LoginForm";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import titleImage from "./res/title.png";
import PartyListItem, { CombinedData } from "@/components/PartyListItem";
import { getDayOfWeek } from "@/utils/DateUtils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getBase64Text, getPlainText } from "@/utils/TextUtils";
import { MemberData } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default function Index() {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userState, setUserState] = useRecoilState<any | null>(userAtom);
  const [mainComment, setMainComment] = useState<string>("");
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [hasShowPopup, setShowPopup] = useState<Boolean>(false);
  const [isChecked, setIsChecked] = useState<Boolean>(true);

  const [user, setUser] = useState<any>(null);

  const searchParams = useSearchParams();
  const id = getPlainText(searchParams.get("id") || "");

  const router = useRouter();

  useEffect(() => {
    const fetchMainComment = async () => {
      try {
        const { data, error } = await supabase
          .from("Member")
          .select("comment")
          .eq("id", 9999);

        if (error) {
          throw error;
        }

        if (data.length > 0) {
          setMainComment(data[0].comment);
        }
      } catch (error: any) {
        console.error("코멘트 불러오기 오류 : ", error);
      }
    };

    const fetchUserAndMemberData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.info("Error fetching user:", userError);
        return;
      }

      setUser(user);

      const { data: member, error: memberError } = await supabase
        .from("Member")
        .select("*")
        .eq("uid", user.id)
        .single();

      if (memberError) {
        console.error("Error fetching member data:", memberError);
        return;
      }

      if (hasShowPopup === false) {
        if (member.schedule_check === false) {
          setShowPopup(true);
          alert("스케쥴이 확정되지 않았습니다.");
          router.push(`/members/schedule?id=${getBase64Text(user.id)}`);
        }
      }
    };

    const fetchPartyData = async () => {
      // PartyData 가져오기
      const today = getDayOfWeek();

      const { data: partyData, error: partyError } = await supabase
        .from("Party")
        .select("*")
        .eq("day", today)
        .order("time");

      if (partyError) {
        console.error("Error fetching party data:", partyError);
        return;
      }

      // RaidData 가져오기
      const { data: raidData, error: raidError } = await supabase
        .from("Raid")
        .select("*")
        .order("id");

      if (raidError) {
        console.error("Error fetching raid data:", raidError);
        return;
      }

      // MemberData 가져오기
      const characterIds = partyData.flatMap((party) => party.member);
      const { data: characterData, error: characterError } = await supabase
        .from("Character")
        .select("*")
        .in("id", characterIds);

      if (characterError) {
        console.error("Error fetching character data:", characterError);
        return;
      }

      // 조합된 데이터 생성
      const combinedData = partyData.map((party) => {
        const raid = raidData[party.raid_id];
        const members = characterData.filter((character) =>
          party.member.includes(character.id)
        );

        return {
          party,
          raid: raid,
          members: members,
        };
      });

      setCombinedData(combinedData);
    };

    fetchMainComment();
    fetchPartyData();
    fetchUserAndMemberData();
  }, []);

  const handleUpdateMember = async (uid: string) => {
    try {
      if (!userState) {
        const { data, error } = await supabase
          .from("Member")
          .select()
          .eq("uid", uid);

        if (error) {
          throw error;
        }

        if (data.length > 0) {
          setUserState(data[0]);
          setShowLoginForm(false);
        }
      }
    } catch (error: any) {
      console.error("Error updating member:", error.message);
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        position: "relative",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100dvh",
      }}
    >
      <Box
        display="flex"
        position="relative"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={3}
      >
        <Box>
          <img src={titleImage.src} className="title-image" alt="Title" />
        </Box>
        <Box>
          {!userState && (
            <div className="outlined">
              {showLoginForm === false ? (
                <div
                  onClick={() => setShowLoginForm(true)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "NanumBarunGothic",
                    fontSize: "30px",
                  }}
                >
                  로그인
                </div>
              ) : (
                <div className="loginForm">
                  <LoginForm onLoginSuccess={handleUpdateMember} />
                </div>
              )}
            </div>
          )}
        </Box>
        <Box>
          {userState && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h4"
                    textAlign={"center"}
                    sx={{ mt: 2, mb: 2 }}
                    style={{
                      fontFamily: "SUIT-Regular",
                      fontSize: "32px",
                      fontWeight: "600",
                    }}
                  >
                    오늘의 공대
                  </Typography>
                  <div className="main-post">
                    <List dense>
                      {combinedData.map((data) => (
                        <PartyListItem
                          key={data.party.id}
                          memberId={userState.id}
                          data={data}
                        />
                      ))}
                      {combinedData.length === 0 && (
                        <ListItem>
                          <ListItemText
                            primary={
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  fontFamily: "NanumBarunGothic",
                                  fontSize: "20px",
                                }}
                              >
                                <span
                                  style={{
                                    lineHeight: "20px",
                                    paddingLeft: "10px",
                                  }}
                                >{`오늘은 일정이 없어요`}</span>
                              </Box>
                            }
                          />
                        </ListItem>
                      )}
                    </List>
                  </div>
                  <div>
                    <Typography variant="body1" textAlign={"center"}>
                      <Link
                        legacyBehavior
                        href="https://docs.google.com/spreadsheets/d/1T7hfww6gQEiQ1UCnNZfqBhoyfU-Lf0gG-w2OZ22mk8g/edit?gid=0#gid=0"
                        passHref
                      >
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontFamily: "SUIT-Regular",
                            fontSize: "24px",
                            fontWeight: "600",
                            textDecoration: "underline",
                            color: "#1976d2",
                            cursor: "pointer",
                          }}
                        >
                          벌금 확인 페이지
                        </a>
                      </Link>
                    </Typography>
                  </div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="h4"
                    textAlign={"center"}
                    sx={{ mt: 2, mb: 2 }}
                    style={{
                      fontFamily: "SUIT-Regular",
                      fontSize: "32px",
                      fontWeight: "600",
                    }}
                  >
                    운영진 공지
                  </Typography>
                  <div className="main-post">
                    {mainComment.split("\n").map((line, index) => (
                      <Typography
                        key={index}
                        style={{
                          fontFamily: "NanumBarunGothic",
                          fontSize: "20px",
                          textAlign: "center",
                        }}
                      >
                        {line}
                      </Typography>
                    ))}
                  </div>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
