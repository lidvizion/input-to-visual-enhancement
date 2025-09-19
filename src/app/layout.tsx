import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Input to Visual Enhancement',
  description: 'Simulate visual transformations from real-world inputs (photos or scans), with or without 3D conversion. Supports before/after comparison, region-based editing, and report export.',
  keywords: ['visual enhancement', 'image editing', '3D modeling', 'posture correction', 'cosmetic enhancement'],
  authors: [{ name: 'Lid Vizion' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
          {children}
        </div>
      </body>
    </html>
  )
}
