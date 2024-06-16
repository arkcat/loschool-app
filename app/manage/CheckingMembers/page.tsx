"use client";

import { getBase64Text } from "@/utils/TextUtils";
import { supabase } from "@/utils/supabase";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Popover,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CharacterData, MemberData, PartyData } from "@/lib/database.types";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";
import CancelIcon from "@mui/icons-material/CancelOutlined";
import CheckIcon from "@mui/icons-material/CheckCircleOutlined";
import InfoIcon from "@mui/icons-material/InfoOutlined";
export const dynamic = "force-dynamic";

export default function CheckingMembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<MemberData[]>([]);
  const [parties, setParties] = useState<PartyData[]>([]);
  const [characters, setCharacters] = useState<CharacterData[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      const { data, error } = await supabase.from("Party").select().order("id");
      if (error) console.error("Error fetching parties:", error);
      else setParties(data);
    };

    fetchParties();

    const fetchCharacters = async () => {
      const { data, error } = await supabase
        .from("Character")
        .select()
        .neq("member_id", 9999)
        .order("id");
      if (error) console.error("Error fetching characters:", error);
      else setCharacters(data);
    };

    fetchCharacters();

    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("Member")
        .select()
        .neq("id", 9999)
        .order("id");
      if (error) console.error("Error fetching members:", error);
      else setMembers(data);
    };

    fetchMembers();
  }, []);

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  function checkPartiesCount(member: MemberData): number {
    if (member.schedule_check !== true) {
      return -1;
    }

    var count = 0;
    var chars = characters.filter((char) => char.member_id === member.id);

    parties?.forEach((party) => {
      chars?.forEach((char) => {
        if (party.member.includes(char.id)) {
          console.log(char.char_name);
          count++;
        }
      });
    });

    return count;
  }

  interface MemberWithCount {
    member: MemberData;
    count: number;
  }

  const info: MemberWithCount[] = [];
  members.forEach((member) => {
    const count = checkPartiesCount(member);
    info.push({ member, count });
  });
  info.sort((a, b) => a.count - b.count);

  function makeMember(info: MemberWithCount) {
    const row = info.member;
    return (
      <TableRow hover tabIndex={-1} key={row.id} sx={{ cursor: "pointer" }}>
        <TableCell
          component="th"
          scope="row"
          style={{ padding: 15, fontFamily: "S-CoreDream-3Light" }}
        >
          {row.nick_name}
        </TableCell>
        <TableCell align="right" style={{ paddingRight: "15px" }}>
          {info.count >= 2 ? (
            <CheckIcon color="success" />
          ) : info.count === -1 ? (
            <CancelIcon color="error" />
          ) : (
            <InfoIcon color="info" />
          )}
        </TableCell>
        <TableCell
          style={{
            fontFamily: "S-CoreDream-3Light",
            fontWeight: 800,
            paddingRight: "15px",
          }}
        >
          {row.comment}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <MainPageBox>
      <Typography className="page-title">공대 참여 현황</Typography>
      <TableContainer
        component={Paper}
        sx={{
          width: "90%",
          mb: 5,
          height: "90dvh",
          maxWidth: "550px",
          overflow: "auto",
        }}
      >
        <Table aria-labelledby="tableTitle" size={"small"} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                scope="row"
                style={{
                  padding: 15,
                  fontFamily: "SUIT-Regular",
                  fontWeight: 800,
                  width: "25%",
                }}
              >
                닉네임
              </TableCell>
              <TableCell
                align="right"
                style={{
                  fontFamily: "SUIT-Regular",
                  fontWeight: 800,
                  width: "15%",
                  paddingRight: "15px",
                }}
              >
                공대참여
              </TableCell>
              <TableCell
                align="center"
                style={{
                  fontFamily: "SUIT-Regular",
                  fontWeight: 800,
                  width: "30%",
                  paddingRight: "15px",
                }}
              >
                코멘트
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{info.map((i) => makeMember(i))}</TableBody>
        </Table>
      </TableContainer>
    </MainPageBox>
  );
}
