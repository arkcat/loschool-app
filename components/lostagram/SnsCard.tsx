import { Box } from "@mui/material";
import React from "react";
import Image from "next/image";

export interface ISnsCard {
  id: number;
  image_path: string;
  title: string;
  content: string;
  nick_name: string;
  replyList: IReply[];
}

interface IReply {
  id: string;
  name: string;
  reply: string;
}

interface SnsCardProps {
  SnsObj: ISnsCard;
}

export default function SnsCard({ SnsObj }: SnsCardProps) {
  return (
    <Box
      sx={{
        width: "400px",
        height: "300px",
        backgroundColor: "green",
        cursor: "pointer",
      }}
    >
      {SnsObj.image_path && (
        <Image
          src={SnsObj.image_path}
          alt="background"
          layout="contain"
          width={400}
          height={300}
        />
      )}
    </Box>
  );
}
