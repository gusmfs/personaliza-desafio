'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">DesafioPersonaliza</h1>
            </div>
          </Link>

          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                pathname === '/' 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="font-medium">Início</span>
            </Link>
            
            <Link 
              href="/patients/new" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all ${
                pathname === '/patients/new' 
                  ? 'bg-white/20 text-white' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Novo Paciente</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
