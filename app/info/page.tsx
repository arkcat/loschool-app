"use client";

import { Typography, TableContainer, Box, } from "@mui/material";
import MainPageBox from "@/components/MainPageBox";
import useRequireAuth from "@/utils/AuthUtils";
import RaidInfo, { RaidReward } from "./RaidInfo";
import 시련의빛 from "@/app/res/items/시련의빛.png"
import 관조의빛무리 from "@/app/res/items/관조의빛무리.png"
import 노말기운 from "@/app/res/items/선명한지혜의기운.png"
import 노말엘릭서 from "@/app/res/items/선명한지혜의엘릭서.png"
import 하드기운 from "@/app/res/items/빛나는지혜의기운.png"
import 하드엘릭서 from "@/app/res/items/빛나는지혜의엘릭서.png"
import 마수의뼈 from "@/app/res/items/마수의뼈.png"
import 욕망의날개 from "@/app/res/items/욕망의날개.png"
import 광기의나팔 from "@/app/res/items/광기의나팔.png"
import 몽환의사념 from "@/app/res/items/몽환의사념.png"
import 쇠락의눈동자 from "@/app/res/items/쇠락의눈동자.png"
import 마력의샘물 from "@/app/res/items/마력의샘물.png"
import 어둠의불 from "@/app/res/items/어둠의불.png"
import 아그리스의비늘 from "@/app/res/items/아그리스비늘.png"
import 알키오네의눈 from "@/app/res/items/알키오네눈.png"
import 베히모스의비늘 from "@/app/res/items/베히모스의비늘.png"

const raidList: RaidReward[] = [
  {
    name: '카양겔',
    color: "#fce5cd",
    itemLevel: "1540 / 1580",
    normal: {
      totalGold: '3600', reward: [
        { step: 1, gold: 800, item: [{ image: 시련의빛.src, count: 11 },] },
        { step: 2, gold: 1200, item: [{ image: 시련의빛.src, count: 12 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 3, gold: 1600, item: [{ image: 시련의빛.src, count: 17 }, { image: 관조의빛무리.src, count: 2 },] }
      ],
      moreReward: [
        { step: 1, gold: 300, item: [{ image: 시련의빛.src, count: 11 },] },
        { step: 2, gold: 400, item: [{ image: 시련의빛.src, count: 12 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 3, gold: 500, item: [{ image: 시련의빛.src, count: 17 }, { image: 관조의빛무리.src, count: 2 },] }
      ]
    }, hard: {
      totalGold: '4800', reward: [
        { step: 1, gold: 1000, item: [{ image: 시련의빛.src, count: 14 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 2, gold: 1600, item: [{ image: 시련의빛.src, count: 16 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 3, gold: 2200, item: [{ image: 시련의빛.src, count: 20 }, { image: 관조의빛무리.src, count: 3 },] }
      ],
      moreReward: [
        { step: 1, gold: 350, item: [{ image: 시련의빛.src, count: 14 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 2, gold: 500, item: [{ image: 시련의빛.src, count: 16 }, { image: 관조의빛무리.src, count: 1 },] },
        { step: 3, gold: 700, item: [{ image: 시련의빛.src, count: 20 }, { image: 관조의빛무리.src, count: 3 },] }
      ]
    }
  },
  {
    name: '혼돈의 상아탑',
    color: "#fce5cd",
    itemLevel: "1600 / 1620",
    normal: {
      totalGold: '6500', reward: [
        { step: 1, gold: 1500, item: [{ image: 노말기운.src, count: 4 }] },
        { step: 2, gold: 2000, item: [{ image: 노말기운.src, count: 4 }] },
        { step: 3, gold: 3000, item: [{ image: 노말기운.src, count: 8 }, { image: 노말엘릭서.src, count: 2 }] }
      ],
      moreReward: [
        { step: 1, gold: 600, item: [{ image: 노말기운.src, count: 4 }] },
        { step: 2, gold: 650, item: [{ image: 노말기운.src, count: 4 }] },
        { step: 4, gold: 1000, item: [{ image: 노말기운.src, count: 8 }, { image: 노말엘릭서.src, count: 2 }] }
      ]
    },
    hard: {
      totalGold: '13000', reward: [
        { step: 1, gold: 3000, item: [{ image: 하드기운.src, count: 4 }] },
        { step: 2, gold: 4000, item: [{ image: 하드기운.src, count: 4 }] },
        { step: 4, gold: 6000, item: [{ image: 하드기운.src, count: 8 }, { image: 하드엘릭서.src, count: 2 }] }
      ],
      moreReward: [
        { step: 1, gold: 1200, item: [{ image: 하드기운.src, count: 4 }] },
        { step: 2, gold: 1450, item: [{ image: 하드기운.src, count: 4 }] },
        { step: 4, gold: 2000, item: [{ image: 하드기운.src, count: 8 }, { image: 하드엘릭서.src, count: 2 }] }
      ]
    }
  },
  {
    name: '발탄',
    color: "#6d9eeb",
    itemLevel: "1415 / 1445",
    normal: {
      totalGold: '1200', reward: [
        { step: 1, gold: 500, item: [{ image: 마수의뼈.src, count: 1 }] },
        { step: 2, gold: 700, item: [{ image: 마수의뼈.src, count: 2 }] }
      ],
      moreReward: [
        { step: 1, gold: 300, item: [{ image: 마수의뼈.src, count: 1 }] },
        { step: 2, gold: 400, item: [{ image: 마수의뼈.src, count: 2 }] }
      ]
    },
    hard: {
      totalGold: '1800', reward: [
        { step: 1, gold: 700, item: [{ image: 마수의뼈.src, count: 3 }] },
        { step: 2, gold: 1100, item: [{ image: 마수의뼈.src, count: 3 }] }
      ],
      moreReward: [
        { step: 1, gold: 450, item: [{ image: 마수의뼈.src, count: 3 }] },
        { step: 2, gold: 600, item: [{ image: 마수의뼈.src, count: 3 }] }
      ]
    }
  },
  {
    name: '비아키스',
    color: "#e06666",
    itemLevel: "1430 / 1460",
    normal: {
      totalGold: '1600', reward: [
        { step: 1, gold: 600, item: [{ image: 욕망의날개.src, count: 1 }] },
        { step: 2, gold: 1000, item: [{ image: 욕망의날개.src, count: 2 }] }
      ],
      moreReward: [
        { step: 1, gold: 300, item: [{ image: 욕망의날개.src, count: 1 }] },
        { step: 2, gold: 45, item: [{ image: 욕망의날개.src, count: 2 }] }
      ]
    },
    hard: {
      totalGold: '2400', reward: [
        { step: 1, gold: 900, item: [{ image: 욕망의날개.src, count: 3 }] },
        { step: 2, gold: 1500, item: [{ image: 욕망의날개.src, count: 3 }] }
      ],
      moreReward: [
        { step: 1, gold: 500, item: [{ image: 욕망의날개.src, count: 3 }] },
        { step: 2, gold: 650, item: [{ image: 욕망의날개.src, count: 3 }] }
      ]
    }
  },
  {
    name: '쿠크세이튼',
    color: "#ffff00",
    itemLevel: "1475",
    normal: {
      totalGold: '3000', reward: [
        { step: 1, gold: 600, item: [{ image: 광기의나팔.src, count: 1 }] },
        { step: 2, gold: 900, item: [{ image: 광기의나팔.src, count: 2 }] },
        { step: 3, gold: 1500, item: [{ image: 광기의나팔.src, count: 2 }] }
      ],
      moreReward: [
        { step: 1, gold: 300, item: [{ image: 광기의나팔.src, count: 1 }] },
        { step: 2, gold: 500, item: [{ image: 광기의나팔.src, count: 2 }] },
        { step: 3, gold: 700, item: [{ image: 광기의나팔.src, count: 2 }] }
      ]
    },
    hard: {
      totalGold: '0', reward: [], moreReward: []
    }
  },
  {
    name: '아브렐슈드',
    color: "#8e7cc3",
    itemLevel: "1~2 : 1500 / 1540\n3 : 1500 / 1550\n4 : 1520 / 1560",
    normal: {
      totalGold: '1-3: 3000 \n4: 1600', reward: [
        { step: 1, gold: 1000, item: [{ image: 몽환의사념.src, count: 4 }] },
        { step: 2, gold: 1000, item: [{ image: 몽환의사념.src, count: 4 }] },
        { step: 3, gold: 1000, item: [{ image: 몽환의사념.src, count: 5 }] },
        { step: 4, gold: 1600, item: [{ image: 몽환의사념.src, count: 7 }] }
      ],
      moreReward: [
        { step: 1, gold: 250, item: [{ image: 몽환의사념.src, count: 4 }] },
        { step: 2, gold: 300, item: [{ image: 몽환의사념.src, count: 4 }] },
        { step: 3, gold: 400, item: [{ image: 몽환의사념.src, count: 5 }] },
        { step: 4, gold: 600, item: [{ image: 몽환의사념.src, count: 7 }] }
      ]
    },
    hard: {
      totalGold: '1-3: 3600 \n4: 2000', reward: [
        { step: 1, gold: 1200, item: [{ image: 몽환의사념.src, count: 6 }] },
        { step: 2, gold: 1200, item: [{ image: 몽환의사념.src, count: 6 }] },
        { step: 3, gold: 1200, item: [{ image: 몽환의사념.src, count: 7 }] },
        { step: 4, gold: 2000, item: [{ image: 몽환의사념.src, count: 10 }] }
      ],
      moreReward: [
        { step: 1, gold: 400, item: [{ image: 몽환의사념.src, count: 6 }] },
        { step: 2, gold: 400, item: [{ image: 몽환의사념.src, count: 6 }] },
        { step: 3, gold: 500, item: [{ image: 몽환의사념.src, count: 7 }] },
        { step: 4, gold: 800, item: [{ image: 몽환의사념.src, count: 10 }] }
      ]
    }
  },
  {
    name: '일리아칸',
    color: "#38761d",
    itemLevel: "1580 / 1600",
    normal: {
      totalGold: '4800', reward: [
        { step: 1, gold: 1000, item: [{ image: 쇠락의눈동자.src, count: 3 }] },
        { step: 2, gold: 1600, item: [{ image: 쇠락의눈동자.src, count: 3 }] },
        { step: 3, gold: 2200, item: [{ image: 쇠락의눈동자.src, count: 5 }] }
      ],
      moreReward: [
        { step: 1, gold: 350, item: [{ image: 쇠락의눈동자.src, count: 3 }] },
        { step: 2, gold: 500, item: [{ image: 쇠락의눈동자.src, count: 3 }] },
        { step: 3, gold: 700, item: [{ image: 쇠락의눈동자.src, count: 5 }] }
      ]
    },
    hard: {
      totalGold: '7500', reward: [
        { step: 1, gold: 1500, item: [{ image: 쇠락의눈동자.src, count: 7 }] },
        { step: 2, gold: 2500, item: [{ image: 쇠락의눈동자.src, count: 7 }] },
        { step: 3, gold: 3500, item: [{ image: 쇠락의눈동자.src, count: 8 }] }
      ],
      moreReward: [
        { step: 1, gold: 600, item: [{ image: 쇠락의눈동자.src, count: 7 }] },
        { step: 2, gold: 650, item: [{ image: 쇠락의눈동자.src, count: 7 }] },
        { step: 3, gold: 950, item: [{ image: 쇠락의눈동자.src, count: 8 }] }
      ]
    }
  },
  {
    name: '카멘',
    color: "#073763",
    itemLevel: "1610 / 1630",
    normal: {
      totalGold: '13000', reward: [
        { step: 1, gold: 3500, item: [{ image: 어둠의불.src, count: 3 }, { image: 마력의샘물.src, count: 2 },] },
        { step: 2, gold: 4000, item: [{ image: 어둠의불.src, count: 4 }, { image: 마력의샘물.src, count: 3 },] },
        { step: 3, gold: 5500, item: [{ image: 어둠의불.src, count: 6 }, { image: 마력의샘물.src, count: 4 },] }
      ],
      moreReward: [
        { step: 1, gold: 1500, item: [{ image: 어둠의불.src, count: 3 }, { image: 마력의샘물.src, count: 2 },] },
        { step: 2, gold: 1800, item: [{ image: 어둠의불.src, count: 4 }, { image: 마력의샘물.src, count: 3 },] },
        { step: 3, gold: 2500, item: [{ image: 어둠의불.src, count: 6 }, { image: 마력의샘물.src, count: 4 },] }
      ]
    },
    hard: {
      totalGold: '1-3: 20000 \n4: 21000', reward: [
        { step: 1, gold: 5000, item: [{ image: 어둠의불.src, count: 6 }, { image: 마력의샘물.src, count: 6 },] },
        { step: 2, gold: 6000, item: [{ image: 어둠의불.src, count: 8 }, { image: 마력의샘물.src, count: 9 },] },
        { step: 3, gold: 9000, item: [{ image: 어둠의불.src, count: 12 }, { image: 마력의샘물.src, count: 12 },] },
        { step: 4, gold: 21000, item: [{ image: 어둠의불.src, count: 12 }, { image: 마력의샘물.src, count: 12 },] }
      ],
      moreReward: [
        { step: 1, gold: 2000, item: [{ image: 어둠의불.src, count: 6 }, { image: 마력의샘물.src, count: 6 },] },
        { step: 2, gold: 2400, item: [{ image: 어둠의불.src, count: 8 }, { image: 마력의샘물.src, count: 9 },] },
        { step: 3, gold: 2800, item: [{ image: 어둠의불.src, count: 12 }, { image: 마력의샘물.src, count: 12 },] },
        { step: 4, gold: 3600, item: [{ image: 어둠의불.src, count: 12 }, { image: 마력의샘물.src, count: 12 },] }
      ]
    }
  },
  {
    name: '에키드나',
    color: "#e06666",
    itemLevel: "1620 / 1630",
    normal: {
      totalGold: '14500', reward: [
        { step: 1, gold: 5000, item: [{ image: 아그리스의비늘.src, count: 3 }] },
        { step: 2, gold: 9500, item: [{ image: 아그리스의비늘.src, count: 6 }] }
      ],
      moreReward: [
        { step: 1, gold: 2200, item: [{ image: 아그리스의비늘.src, count: 3 }] },
        { step: 2, gold: 3400, item: [{ image: 아그리스의비늘.src, count: 6 }] }
      ]
    },
    hard: {
      totalGold: '18500', reward: [
        { step: 1, gold: 6000, item: [{ image: 알키오네의눈.src, count: 3 }] },
        { step: 2, gold: 12500, item: [{ image: 알키오네의눈.src, count: 6 }] }
      ],
      moreReward: [
        { step: 1, gold: 2800, item: [{ image: 알키오네의눈.src, count: 3 }] },
        { step: 2, gold: 4100, item: [{ image: 알키오네의눈.src, count: 6 }] }
      ]
    }
  },
  {
    name: '베히모스',
    color: "#375995",
    itemLevel: "1640",
    normal: {
      totalGold: '21500', reward: [
        { step: 1, gold: 7000, item: [{ image: 베히모스의비늘.src, count: 10 }, { image: 마력의샘물.src, count: 10 }] },
        { step: 2, gold: 14500, item: [{ image: 베히모스의비늘.src, count: 10 }, { image: 마력의샘물.src, count: 10 }] }
      ],
      moreReward: [
        { step: 1, gold: 3100, item: [{ image: 베히모스의비늘.src, count: 10 }, { image: 마력의샘물.src, count: 10 }] },
        { step: 2, gold: 4900, item: [{ image: 베히모스의비늘.src, count: 20 }, { image: 마력의샘물.src, count: 18 }] }
      ]
    },
    hard: {
      totalGold: '0', reward: [], moreReward: []
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
      <Box sx={{ mb: 4, height: '95dvh', overflowY: 'auto' }}>
        {raidList.map((raid, index) => (
          <RaidInfo key={index} raid={raid} />
        ))}
      </Box>
    </MainPageBox>
  );
}
