import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GymPilot',
  description: 'AI-powered personalized fitness and workout plan generator.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <title>GymPilot</title>
        <meta name="description" content="AI-powered personalized fitness and workout plan generator." />
      </head>
      <body>{children}</body>
    </html>
  )
}
