'use client'

import { useState, useEffect } from "react"
import MainPageBox from "@/components/MainPageBox"
import { supabase } from "@/utils/supabase"
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"

export const dynamic = 'force-dynamic'

interface PenaltyItem {
  id: number,
  name: string,
  datetime: Date
}

export default function PenaltyPage() {
  const [penaltyList, setPenaltyList] = useState<PenaltyItem[]>([])
  useEffect(() => {
    const fetchPenalty = async () => {
      const { data, error } = await supabase
        .from("Penalty")
        .select()
        .order('id')

      if (error) console.error('Error fetching raids:', error)
      else setPenaltyList(data)
    }

    fetchPenalty()
  }, [])

  return (
    <MainPageBox>
      <Typography className='page-title'>지각 리스트</Typography>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell>날짜</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainPageBox>
  )
}
