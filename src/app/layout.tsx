import 'react-quill/dist/quill.snow.css';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/Header'
const inter = Inter({ subsets: ['latin'] })
import Provider from "../common/Provider"

export const metadata: Metadata = {
  title: 'CampaignkartAdmin',
  description: 'Admin app for campaignKart',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={"3xl:px-[20%] 2xl:px-0"}>
        <Provider>
        <Header/>
        {children}
        </Provider>
        </body>
    </html>
  )
}
