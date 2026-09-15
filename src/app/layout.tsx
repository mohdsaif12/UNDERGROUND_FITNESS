import type { Metadata, Viewport } from 'next'
import { Chivo, Space_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { TopHeader, BottomNav } from '@/components/navigation'

const chivo = Chivo({
  variable: '--font-chivo',
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Underground Jimmy Cafe — Gym Refuel',
  description: 'Targeted nutrition, protein shakes & recovery meals. Train hard, refuel fast.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Jimmy Cafe',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#131313',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${chivo.variable} ${spaceMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#131313] text-[#e5e2e1] font-sans">
        <TopHeader />
        <div className="flex-1 w-full">
          {children}
        </div>
        <BottomNav />
        <Toaster richColors position="bottom-center" duration={1500} />
      </body>
    </html>
  )
}


