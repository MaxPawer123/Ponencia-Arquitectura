import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Evento de Ponencias de Arquitectura - FAADU UMSA',
  description: 'Participa en nuestro evento de ponencias de arquitectura con expertos internacionales y acceso a transmisiones en vivo.',
  icons: {
    icon: [
      {
        url: '/logo_crtp.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo_crtp.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo_crtp.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo_crtp.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E5820C' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
