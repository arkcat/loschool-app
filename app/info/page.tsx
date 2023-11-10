"use client";

import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";

import {
  FormControl,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  Grid,
} from "@mui/material";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";
import RaidInfo, { RaidReward } from "./RaidInfo";


const raidList: RaidReward[] = [
  {
    name: '카양겔', normal: {
      totalGold: 4500, reward: [
        { step: 1, gold: 1000, item: [{ name: '빛', count: 11 },] },
        { step: 2, gold: 1500, item: [{ name: '빛', count: 12 }, { name: '빛무리', count: 1 },] },
        { step: 3, gold: 2000, item: [{ name: '빛', count: 17 }, { name: '빛무리', count: 2 },] }
      ]
    }, hard: {
      totalGold: 6500, reward: [
        { step: 1, gold: 1500, item: [{ name: '빛', count: 14 }, { name: '빛무리', count: 1 },] },
        { step: 2, gold: 2000, item: [{ name: '빛', count: 16 }, { name: '빛무리', count: 1 },] },
        { step: 3, gold: 3000, item: [{ name: '빛', count: 20 }, { name: '빛무리', count: 3 },] }
      ]
    }
  },
  {
    name: '혼돈의 상아탑',
    normal: {
      totalGold: 9000, reward: [
        { step: 1, gold: 1500, item: [{ name: '기운', count: 2 }] },
        { step: 2, gold: 1750, item: [{ name: '기운', count: 2 }] },
        { step: 3, gold: 2500, item: [{ name: '기운', count: 3 }] },
        { step: 4, gold: 3250, item: [{ name: '기운', count: 1 }, { name: '엘릭서', count: 1 }] }
      ]
    },
    hard: {
      totalGold: 14500, reward: [
        { step: 1, gold: 2000, item: [{ name: '기운', count: 2 }] },
        { step: 2, gold: 2500, item: [{ name: '기운', count: 2 }] },
        { step: 3, gold: 4000, item: [{ name: '기운', count: 3 }] },
        { step: 4, gold: 6000, item: [{ name: '기운', count: 1 }, { name: '엘릭서', count: 1 }] }
      ]
    }
  },
  {
    name: '발탄',
    normal: {
      totalGold: 1200, reward: [
        { step: 1, gold: 500, item: [{ name: '뼈', count: 1 }] },
        { step: 2, gold: 700, item: [{ name: '뼈', count: 2 }] }
      ]
    },
    hard: {
      totalGold: 1800, reward: [
        { step: 1, gold: 700, item: [{ name: '뼈', count: 3 }] },
        { step: 2, gold: 1100, item: [{ name: '뼈', count: 3 }] }
      ]
    }
  },
  {
    name: '비아키스',
    normal: {
      totalGold: 1600, reward: [
        { step: 1, gold: 600, item: [{ name: '날개', count: 1 }] },
        { step: 2, gold: 1000, item: [{ name: '날개', count: 2 }] }
      ]
    },
    hard: {
      totalGold: 2400, reward: [
        { step: 1, gold: 900, item: [{ name: '날개', count: 3 }] },
        { step: 2, gold: 1500, item: [{ name: '날개', count: 3 }] }
      ]
    }
  },
  {
    name: '쿠크세이튼',
    normal: {
      totalGold: 3000, reward: [
        { step: 1, gold: 600, item: [{ name: '나팔', count: 1 }] },
        { step: 2, gold: 900, item: [{ name: '나팔', count: 2 }] },
        { step: 3, gold: 1500, item: [{ name: '나팔', count: 2 }] }
      ]
    },
    hard: {
      totalGold: 0, reward: []
    }
  },
  {
    name: '아브렐슈드',
    normal: {
      totalGold: 7000, reward: [
        { step: 1, gold: 1500, item: [{ name: '사념', count: 4 }] },
        { step: 2, gold: 1500, item: [{ name: '사념', count: 4 }] },
        { step: 3, gold: 1500, item: [{ name: '사념', count: 5 }] },
        { step: 4, gold: 2500, item: [{ name: '사념', count: 7 }] }
      ]
    },
    hard: {
      totalGold: 9000, reward: [
        { step: 1, gold: 2000, item: [{ name: '사념', count: 6 }] },
        { step: 2, gold: 2000, item: [{ name: '사념', count: 6 }] },
        { step: 3, gold: 2000, item: [{ name: '사념', count: 7 }] },
        { step: 4, gold: 3000, item: [{ name: '사념', count: 10 }] }
      ]
    }
  },
  {
    name: '일리아칸',
    normal: {
      totalGold: 7500, reward: [
        { step: 1, gold: 1500, item: [{ name: '눈동자', count: 3 }] },
        { step: 2, gold: 2000, item: [{ name: '눈동자', count: 3 }] },
        { step: 3, gold: 4000, item: [{ name: '눈동자', count: 5 }] }
      ]
    },
    hard: {
      totalGold: 10000, reward: [
        { step: 1, gold: 1750, item: [{ name: '눈동자', count: 7 }] },
        { step: 2, gold: 2500, item: [{ name: '눈동자', count: 7 }] },
        { step: 3, gold: 5750, item: [{ name: '눈동자', count: 8 }] }
      ]
    }
  },
  {
    name: '카멘',
    normal: {
      totalGold: 13000, reward: [
        {
          step: 1, gold: 3500, item: [
            { name: '불', count: 3 },
            { name: '샘물', count: 2 },
          ]
        },
        {
          step: 2, gold: 4000, item: [
            { name: '불', count: 4 },
            { name: '샘물', count: 3 },]
        },
        {
          step: 3, gold: 5500, item: [
            { name: '불', count: 6 },
            { name: '샘물', count: 4 },]
        }
      ]
    },
    hard: {
      totalGold: 41000, reward: [
        {
          step: 1, gold: 5000, item: [
            { name: '불', count: 6 },
            { name: '샘물', count: 6 },]
        },
        {
          step: 2, gold: 6000, item: [
            { name: '불', count: 8 },
            { name: '샘물', count: 9 },]
        },
        {
          step: 3, gold: 9000, item: [
            { name: '불', count: 12 },
            { name: '샘물', count: 12 },]
        },
        {
          step: 4, gold: 21000, item: [
            { name: '불', count: 12 },
            { name: '샘물', count: 12 },]
        }
      ]
    }
  },
]

export default function CharactersPage() {

  const userSession = useRequireAuth();

  if (!userSession) {
    return <div>Loading...</div>;
  }

  return (
    <MainPageBox>
      <Typography className='page-title'>레이드 보상 정보</Typography>
      <Grid container spacing={2} sx={{ height: '100%', overflow: 'auto' }} padding={2}>
        {raidList.map((raid, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <RaidInfo raid={raid} />
          </Grid>
        ))}
      </Grid>
    </MainPageBox>
  );
}
