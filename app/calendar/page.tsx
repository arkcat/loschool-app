"use client";

import tag4thImg from "@/app/res/gate4.png";
import MainPageBox from "@/components/MainPageBox";
import {
  CharacterData,
  MemberData,
  PartyData,
  RaidData,
  days,
  timeSlots,
} from "@/lib/database.types";
import useRequireAuth from "@/utils/AuthUtils";
import { getDayBgColor, getDayHeadBgColor } from "@/utils/ColorUtils";
import { getDayOfWeek } from "@/utils/DateUtils";
import { getPlainText } from "@/utils/TextUtils";
import { supabase } from "@/utils/supabase";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WeeklyPlan() {
  const searchParams = useSearchParams();
  const id = getPlainText(searchParams.get("id") || "");

  const [partyData, setPartyData] = useState<PartyData[]>([]);
  const [raidData, setRaidData] = useState<RaidData[]>([]);
  const [characterData, setCharacterData] = useState<CharacterData[]>([]);
  const [memberData, setMemberData] = useState<MemberData[]>([]);
  const [currentMember, setCurrentMember] = useState<MemberData>();

  useEffect(() => {
    const fetchPartyData = async () => {
      const { data, error } = await supabase.from("Party").select("*");
      if (error) {
        console.error("Error fetching party data:", error);
      } else {
        setPartyData(data as PartyData[]);
      }
    };

    const fetchRaidData = async () => {
      const { data, error } = await supabase.from("Raid").select().order("id");

      if (data) {
        setRaidData(data);
      } else {
        console.error("Error fetching raid data:", error);
      }
    };

    const fetchCharacterData = async () => {
      const { data, error } = await supabase
        .from("Character")
        .select()
        .order("id");

      if (data) {
        setCharacterData(data);
      } else {
        console.error("Error fetching character data:", error);
      }
    };

    const fetchMemberData = async () => {
      const { data, error } = await supabase
        .from("Member")
        .select()
        .order("id");

      if (data) {
        setMemberData(data);
        const member = data.find((d) => d.uid === id);
        setCurrentMember(member);
      } else {
        console.error("Error fetching member data:", error);
      }
    };

    fetchPartyData();
    fetchRaidData();
    fetchCharacterData();
    fetchMemberData();

    setSelectedTab(getDayOfWeek());
  }, []);

  const [partyStates, setPartyStates] = useState(
    partyData.reduce((acc: any, party) => {
      acc[party.id] = false;
      return acc;
    }, {})
  );

  const handleToggle = (id: number) => {
    setPartyStates((prevState: any) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  function makeEmptyCharacter(
    key: string,
    index: number,
    showRemove: boolean = false,
    partyId: number = 0
  ) {
    return (
      <Card
        key={key}
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #ccc",
          height: "30px",
          marginTop: "3px",
        }}
      >
        <CardContent style={{ padding: "0 10px" }}>
          <Typography style={{ fontSize: "12px", fontFamily: "SUIT-Regular" }}>
            {index === 3 || index === 7 ? "서폿" : "딜러"}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  function makeCharacter(
    key: string,
    character: CharacterData,
    showRemove: boolean = false,
    partyId: number = 0
  ) {
    const member = memberData.filter(
      (member) => member.id === character.member_id
    )[0];
    const bgColor = member?.personal_color;
    const textColor = member?.text_color;

    return (
      <Tooltip key={key} title={member?.nick_name} followCursor>
        <Card
          style={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ccc",
            backgroundColor: bgColor,
            color: textColor,
            minHeight: "30px",
            marginTop: "3px",
          }}
        >
          <CardContent style={{ padding: "0 10px" }}>
            <Typography
              style={{ fontSize: "14px", fontFamily: "SUIT-Regular" }}
            >
              {character.char_name} [{character.char_class}]
            </Typography>
          </CardContent>
        </Card>
      </Tooltip>
    );
  }

  function isDealer(id: number): boolean {
    const character = characterData.filter(
      (character) => character.id == id
    )[0];
    if (character === undefined) return false;
    return character.char_type === "D";
  }

  function isSupporter(id: number): boolean {
    const character = characterData.filter(
      (character) => character.id == id
    )[0];
    if (character === undefined) return false;
    return character.char_type === "S";
  }

  function makePartyBox(partyData: PartyData, index: number) {
    const raidInfo = raidData[partyData.raid_id];
    if (raidInfo === undefined) {
      return <Box></Box>;
    }

    const maxDealerCount = (raidInfo.raid_type / 4) * 3;
    const maxSupporterCount = raidInfo.raid_type / 4;
    const dealerCount = partyData.member.filter((id) => isDealer(id)).length;
    const supperterCount = partyData.member.filter((id) =>
      isSupporter(id)
    ).length;
    const remainingDealers =
      dealerCount < maxDealerCount ? maxDealerCount - dealerCount : 0;
    const remainingSupporters =
      supperterCount < maxSupporterCount
        ? maxSupporterCount - supperterCount
        : 0;

    if (
      partyData.member.map((id) => {
        const hasCharacter =
          characterData.filter(
            (character) =>
              character.id === id && character.member_id === currentMember?.id
          ).length > 0;
        if (hasCharacter) {
          partyStates[partyData.id] = true;
        }
      })
    )
      return (
        <Box
          marginBottom={1}
          border={1}
          borderRadius={6}
          padding={2}
          bgcolor={raidInfo.raid_color}
          borderColor={raidInfo.raid_color}
          boxShadow={2}
        >
          <Typography
            style={{
              fontFamily: "NanumBarunGothic",
              fontSize: 14,
              color: "white",
            }}
            onClick={() => handleToggle(partyData.id)}
          >
            {raidInfo.raid_name +
              ` ${dealerCount + supperterCount}/${raidInfo.raid_type}`}{" "}
            <br />
            {remainingDealers > 0 && `랏딜: ${remainingDealers}`}{" "}
            {remainingSupporters > 0 && ` 랏폿: ${remainingSupporters}`}
          </Typography>

          <Box
            marginTop={1}
            sx={{
              display: partyStates[partyData.id] ? "block" : "none",
              padding: "1px",
            }}
          >
            {partyData.member.map((id, memberIdx) => {
              if (id === 0)
                return makeEmptyCharacter(
                  String(partyData.id) + String(memberIdx + 900000),
                  memberIdx,
                  true,
                  partyData.id
                );
              const character = characterData.filter(
                (character) => character.id == id
              )[0];
              if (character === undefined) return <Box></Box>;
              return makeCharacter(
                String(partyData.id) + String(character.id),
                character,
                true,
                partyData.id
              );
            })}
          </Box>
        </Box>
      );
  }

  interface WeekData {
    hour: number;
    schedule: {
      day: string;
      parties: PartyData[];
    }[];
  }

  function wideScreenLayout() {
    const weeklyPlan: WeekData[] = [];

    for (let j = 14; j <= 26; j++) {
      const hourData = partyData.filter((party) => party.time === j);
      const daySchedule = [];
      for (let i = 0; i < 7; i++) {
        const dayData = hourData.filter((party) => party.day === i);
        daySchedule.push({ day: days[i], parties: dayData });
      }
      weeklyPlan.push({ hour: j, schedule: daySchedule });
    }

    return (
      <Box>
        <TableContainer
          sx={{ maxWidth: "100dvw", maxHeight: "80dvh", overflow: "auto" }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  align={"center"}
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 99,
                    fontFamily: "NanumBarunGothic",
                    fontSize: "14px",
                  }}
                  sx={{
                    minWidth: "30px",
                    textAlign: "center",
                    backgroundColor: "#b7bd98",
                  }}
                >
                  시간
                </TableCell>
                {days.map((day, index) => (
                  <TableCell
                    key={index}
                    align={"center"}
                    sx={{
                      borderLeft: 1,
                      backgroundColor:
                        selectedTab === index
                          ? "#f3e07c"
                          : getDayHeadBgColor(day),
                      minWidth: 150,
                    }}
                    style={{
                      fontFamily: "NanumBarunGothic",
                      fontSize: "14px",
                    }}
                  >
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {weeklyPlan.map((daySchedule, index) => (
                <TableRow key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#b7bd98",
                    }}
                    style={{
                      position: "sticky",
                      left: 0,
                      zIndex: 98,
                      fontFamily: "NanumBarunGothic",
                      fontSize: "14px",
                    }}
                    key={days[index]}
                    align={"center"}
                  >
                    {timeSlots[index]}
                  </TableCell>
                  {daySchedule.schedule.map((hourData) => (
                    <TableCell
                      key={hourData.day}
                      align={"center"}
                      sx={{
                        borderLeft: 1,
                        backgroundColor: getDayBgColor(hourData.day),
                      }}
                    >
                      {daySchedule.hour === 21 && hourData.day === "일" && (
                        <Box
                          key={"토벌전"}
                          border={1}
                          borderRadius={6}
                          padding={2}
                          boxShadow={2}
                          bgcolor={"#f3e07c"}
                          borderColor={"#f3e07c"}
                        >
                          <Typography
                            style={{
                              fontFamily: "NanumBarunGothic",
                              fontSize: 19,
                            }}
                          >
                            길드 토벌전
                          </Typography>
                          <Typography
                            style={{
                              fontFamily: "S-CoreDream-3Light",
                              fontSize: 15,
                            }}
                          >
                            21시 20분 시작
                            <br />
                            본길드부터 2회씩
                          </Typography>
                        </Box>
                      )}
                      {hourData.parties.map((party, partyIndex) => (
                        <Box key={party.id}>
                          {makePartyBox(party, partyIndex)}
                        </Box>
                      ))}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
  const isNarrowScreen = useMediaQuery("(max-width:600px)");
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (e: any, newValue: any) => {
    setSelectedTab(newValue);

    const tableContainer = document.getElementById("narrowCalendarTable");
    if (tableContainer) {
      tableContainer.scrollTop = 0;
    }
  };

  function handleSwipe(direction: string) {
    if (direction === "left") {
      if (selectedTab < days.length - 1) {
        setSelectedTab(selectedTab + 1);
      }
    } else if (direction === "right") {
      if (selectedTab > 0) {
        setSelectedTab(selectedTab - 1);
      }
    }
  }

  let touchStartX = 0;

  function handleTouchStart(e: any) {
    touchStartX = e.touches[0].clientX;
  }

  const thresholdX = 135
  function handleTouchEnd(e: any) {
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (Math.abs(deltaX) > thresholdX) {
      if (deltaX > 0) {
        handleSwipe("right");
      } else {
        handleSwipe("left");
      }
    }
  }

  function narrowScreenLayout() {
    const dailyParties: PartyData[] = partyData
      .filter((party) => party.day === selectedTab)
      .sort((a, b) => {
        return a.time - b.time;
      });

    return (
      <Box
        display="flex"
        flexDirection="column"
        sx={{ mb: 5, height: "80dvh" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Tabs value={selectedTab} onChange={handleTabChange}>
          {days.map((day, index) => (
            <Tab
              label={day}
              key={index}
              sx={{
                minWidth: 0,
                fontFamily: "Pretendard-Regular",
                fontWeight: 600,
              }}
            />
          ))}
        </Tabs>
        <TableContainer
          id="narrowCalendarTable"
          sx={{ maxHeight: "650px", overflow: "auto" }}
        >
          <Table>
            <TableBody>
              {selectedTab === 4 && (
                <TableRow>
                  <TableCell align={"center"} sx={{ border: "none" }}>
                    <Box
                      key={"토벌전"}
                      border={1}
                      borderRadius={6}
                      padding={2}
                      boxShadow={2}
                      bgcolor={"#f3e07c"}
                      borderColor={"#f3e07c"}
                    >
                      <Typography
                        style={{ fontFamily: "NanumBarunGothic", fontSize: 19 }}
                      >
                        길드 토벌전
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "S-CoreDream-3Light",
                          fontSize: 15,
                        }}
                      >
                        21시 20분 시작
                        <br />
                        본길드부터 2회씩
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {dailyParties.length > 0 && (
                <TableRow sx={{ background: getDayBgColor(days[selectedTab]) }}>
                  <TableCell align={"center"} sx={{ border: "none" }}>
                    {dailyParties.map((party, index) => (
                      <Box key={party.id}>
                        <Typography
                          sx={{
                            fontFamily: "Pretendard-Regular",
                            fontWeight: 600,
                          }}
                        >
                          {party.time} 시
                        </Typography>
                        {makePartyBox(party, index)}
                      </Box>
                    ))}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  function generatePlan() {
    return (
      <Grid overflow={"auto"}>
        {isNarrowScreen ? narrowScreenLayout() : wideScreenLayout()}
      </Grid>
    );
  }

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  function checkWeek() {
    const startDate = new Date(2023, 10, 29, 6, 0, 0, 0);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - startDate.getTime();
    const weeksPassed = Math.floor(timeDifference / (7 * 24 * 60 * 60 * 1000));
    console.log(weeksPassed);
    return weeksPassed % 2 !== 0;
  }

  return (
    <MainPageBox>
      <Box display="flex" flexDirection={"column"} position="relative">
        <Typography variant="h4" className="page-title">
          이번주 시간표
        </Typography>
        {checkWeek() && (
          <Box
            position="absolute"
            bottom={isNarrowScreen ? -10 : 10}
            left={isNarrowScreen ? 50 : 150}
            width="100%"
          >
            <Box display="flex" justifyContent="center">
              <img
                src={tag4thImg.src}
                style={{ width: "170px" }}
                alt="이미지 설명"
              />
            </Box>
          </Box>
        )}
      </Box>
      {generatePlan()}
    </MainPageBox>
  );
}
