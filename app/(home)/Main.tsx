"use client";
import LoginForm from "@/components/LoginForm";
import PartyListItem from "@/components/PartyListItem";
import SwipeDrawer from "@/components/SwipeDrawer";
import { supabase } from "@/utils/supabase";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { RecoilRoot } from "recoil";

interface Props {
  mainComment: any;
  raidList: { party: any; raid: any; members: any[] }[];
}

export default function Main({ mainComment, raidList }: Props) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [userState, setUserState] = useState<any>({});
  const [subjug, setSubjug] = useState<boolean>(false);

  console.log(String(mainComment));
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
    <Box>
      <main
        className="100dvh bg-background flex flex-col items-center"
        style={{ position: "relative", backgroundColor: "#d1d7b1" }}
      >
        <RecoilRoot>
          <SwipeDrawer />
        </RecoilRoot>
        {/* <img className="mokoko-image" src={mokokoImage.src} alt="mokoko" /> */}
        <Box
          sx={{
            backgroundColor: "#7a6a58",
            width: "100%",
            height: "30px",
            position: "absolute",
            bottom: 0,
          }}
        ></Box>
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
              {/* <img src={titleImage.src} className="title-image" alt="Title" /> */}
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
                          {subjug === true && (
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
                                        color: "green",
                                      }}
                                    >{`21:20`}</span>
                                    <span
                                      style={{
                                        lineHeight: "20px",
                                        paddingLeft: "10px",
                                      }}
                                    >{`길드 토벌전`}</span>
                                  </Box>
                                }
                              />
                            </ListItem>
                          )}
                          {raidList.map((data) => (
                            <PartyListItem
                              key={data.party.id}
                              memberId={userState.id}
                              data={data}
                            />
                          ))}
                          {raidList.length === 0 && subjug === false && (
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
                        <Typography
                          sx={{
                            whiteSpace: "pre-wrap",
                            fontFamily: "NanumBarunGothic",
                            fontSize: "20px",
                            textAlign: "center",
                            p: 1,
                          }}
                        >
                          {mainComment.replace(/\\n/g, "\n")}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </main>
    </Box>
  );
}
