import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'One Source, Two Posts',
  description: 'NoteとXのためのAI搭載コンテンツジェネレーター',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <div className="background-mesh" />
        {children}
      </body>
    </html>
  )
}
