import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Toaster } from 'sonner'
import './globals.css'

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Landjugend Untere Emme',
    template: '%s | Landjugend Untere Emme',
  },
  description: 'Die Landjugend Untere Emme – Zusammen erleben, gemeinsam wachsen. Jugend auf dem Land in der Region Burgdorf.',
  keywords: ['Landjugend', 'Untere Emme', 'Burgdorf', 'Jugend', 'Verein'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${geist.variable} h-full antialiased`}>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
