import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PhishGuard Dashboard',
  description: 'Real-Time Phishing Detection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">{children}</body>
    </html>
  )
}
