'use client'

import RecoilProvider from './RecoilProvider';
import './globals.css'
import { useEffect, useState } from "react";
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

interface WebToAppMessage {
  type: string;
  url: string;
  // 필요에 따라 다른 필드를 추가할 수 있습니다.
  // timestamp?: string;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {

    window.addEventListener('message', (event: MessageEvent) => {
      // 메시지를 보낸 출처(origin)를 확인하여 보안을 강화하는 것이 좋습니다.
      // 예: TWA가 등록된 앱의 스킴과 호스트를 알고 있다면 해당 출처만 허용합니다.
      // const trustedOrigin = "https://your-app-id.apps.googleusercontent.com"; // 또는 앱의 assetlinks.json에 있는 호스트
      // if (event.origin !== trustedOrigin) {
      //   console.warn(`Message from untrusted origin: ${event.origin}. Ignoring.`);
      //   return;
      // }

      if (event.data === 'request_current_url') {
        const currentUrl = window.location.href;

        const responsePayload: WebToAppMessage = {
          type: 'CURRENT_URL_INFO', // 앱에서 이 type을 보고 메시지를 식별할 수 있습니다.
          url: currentUrl
          // timestamp: new Date().toISOString() // 필요시 타임스탬프 추가
        };

        // 메시지를 보낸 TWA 호스트 앱으로 응답을 다시 보냅니다.
        // event.source는 메시지를 보낸 window 객체이며, event.origin은 해당 window의 출처입니다.
        if (event.source && typeof (event.source as Window).postMessage === 'function') {
          try {
            (event.source as Window).postMessage(JSON.stringify(responsePayload), event.origin);
            console.log(`Sent message to TWA host: ${JSON.stringify(responsePayload)} (to origin ${event.origin})`);
          } catch (e) {
            console.error('Failed to post message to TWA host:', e);
          }
        } else {
          console.warn(
            "Could not send message back to TWA host: 'event.source' is not a valid window or 'postMessage' is not available."
          );
          // 대체: 만약 MessageChannel의 port가 `window.twaMessagePort`와 같이 전역적으로 설정되어 있다면,
          // 해당 포트를 사용할 수 있습니다.
          // if (window.twaMessagePort && typeof window.twaMessagePort.postMessage === 'function') {
          //   window.twaMessagePort.postMessage(JSON.stringify(responsePayload));
          // }
        }
      }
    });

  }, []);

  const isMobile = useMediaQuery("(max-width:600px)");
  return (
    <html lang="en">
      <body>
        <RecoilProvider>
          <Box>
            <main className="100dvh bg-background flex flex-col items-center"
              style={{ position: 'relative', backgroundColor: '#d1d7b1' }}>
              {/* <SwipeDrawer />
              <img
                className='mokoko-image'
                src={mokokoImage.src}
                alt="mokoko"
              /> */}
              <Box sx={{ backgroundColor: '#7a6a58', width: '100%', height: '30px', position: 'absolute', bottom: 0 }}></Box>
              {children}
            </main>
          </Box>
        </RecoilProvider>
      </body>
    </html>
  )
}
