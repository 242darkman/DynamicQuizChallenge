import './globals.css'

import AuthProvider from '@/app/_context/AuthContext';
import { Inter } from 'next/font/google'
import RoomProvider from '@/app/_context/RoomContext';
import SocketProvider from '@/app/_context/SocketContext';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dynamic quizz with OpenAI',
  description: 'Make a dynamic quizz with OpenAI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <SocketProvider>
          <RoomProvider>
            <body className={inter.className}>
              {children}
              <Toaster />
            </body>
          </RoomProvider>
        </SocketProvider>
      </AuthProvider>
    </html>
  )
}
