'use client'
import './globals.css'
import { RecoilRoot } from 'recoil';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          <main className="min-h-screen bg-background flex flex-col items-center">
            {children}
          </main>
        </RecoilRoot>
      </body>
    </html>
  )
}
