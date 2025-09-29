import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DesafioPersonaliza - Gerenciamento de Pacientes',
  description: 'Sistema moderno para gerenciar fichas de pacientes com anexos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
          <Header />
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
