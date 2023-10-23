'use client'

import './globals.css'
import { RecoilRoot } from 'recoil'
import SwipeDrawer from '@/components/SwipeDrawer'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" sizes="96x96" href="res/12_RM.png" />
      </head>
      <body>
        <RecoilRoot>
          <SwipeDrawer />
          <main className="min-h-screen bg-background flex flex-col items-center">
            {children}
          </main>
        </RecoilRoot>
      </body>
    </html>
  )
}
