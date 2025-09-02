'use client'

import './globals.css'
import { RecoilRoot } from 'recoil'
import SwipeDrawer from '@/components/SwipeDrawer'
import { Box, useMediaQuery } from '@mui/material'
import mokokoImage from "@/app/res/mokoko.png";

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  console.log("document.cookie:", value);
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleNativeMessage = (event: MessageEvent) => {
      console.log("앱에서 받은 메시지:", event.data);

      if (event.data === "request_info") {
        const sa_id = getCookie("sa_id");
        const sa_state = getCookie("sa_state");
        const latest_url = window.location.href;

        const payload = {
          sa_id,
          sa_state,
          latest_url
        };

        // 참고: navigator.postMessage는 표준 웹 API가 아닙니다.
        if ('postMessage' in navigator) {
          (navigator as any).postMessage(JSON.stringify(payload));
        } else {
          console.warn('navigator.postMessage is not available in this environment.');
        }
      }
    };

    // 참고: navigator.onmessage 또한 표준 웹 API가 아닙니다.
    (navigator as any).onmessage = handleNativeMessage;

    // 컴포넌트가 언마운트될 때 핸들러를 정리합니다.
    return () => {
      (navigator as any).onmessage = null;
    };
  }, []);
  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <Box>
            <main className="100dvh bg-background flex flex-col items-center"
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
