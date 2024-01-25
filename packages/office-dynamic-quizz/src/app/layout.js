import './globals.css'

import { Inter } from 'next/font/google'
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dynamic quizz with OpenAI',
  description: 'Make a dynamic quizz with OpenAI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
