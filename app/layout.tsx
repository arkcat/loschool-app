'use client'

import './globals.css'
import { RecoilRoot } from 'recoil'
import SwipeDrawer from '@/components/SwipeDrawer'
import { Box, useMediaQuery } from '@mui/material'
import mokokoImage from "@/app/res/mokoko.png";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <Box>
            <main className="min-h-screen bg-background flex flex-col items-center"
              style={{ position: 'relative', backgroundColor: '#d1d7b1' }}>
              <SwipeDrawer />
              <img
                className='mokoko-image'
                src={mokokoImage.src}
                alt="mokoko"
              />
              <Box sx={{backgroundColor:'#7a6a58', width:'100%', height:'30px', position:'absolute', bottom:0}}></Box>
              {children}
            </main>
          </Box>
        </RecoilRoot>
      </body>
    </html>
  )
}
