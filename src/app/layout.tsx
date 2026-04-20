import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Maturity Benchmarking Suite',
  description: 'AIMM Assessment Platform for Organizational Maturity',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black selection:bg-black selection:text-white`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b-2 border-black sticky top-0 z-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between sm:h-24 items-center py-4 sm:py-0 gap-4">
                  <div className="flex-shrink-0 flex items-center">
                    <a href="/" className="text-3xl font-black text-black tracking-tighter uppercase">
                      E-Maturity
                    </a>
                  </div>
                  <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 items-center">
                    <a href="/" className="text-neutral-500 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Home</a>
                    <a href="/assessment" className="text-neutral-500 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Services</a>
                    {session && (
                      <a href="/consultant" className="text-neutral-500 hover:text-black text-xs font-black uppercase tracking-widest transition-colors">Dashboard</a>
                    )}
                  </nav>
                  <div className="flex items-center gap-4">
                    {session ? (
                      <>
                        <div className="hidden sm:flex flex-col items-end">
                          <span className="text-xs font-black text-black uppercase tracking-widest truncate max-w-[180px]">
                            {session.user?.name || session.user?.email}
                          </span>
                          {(session.user as any)?.organizationName && (
                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest truncate max-w-[180px]">
                              {(session.user as any).organizationName}
                            </span>
                          )}
                        </div>
                        <a href="/api/auth/signout" className="px-6 py-3 bg-black text-white hover:bg-neutral-800 rounded-none text-xs font-black uppercase tracking-widest transition-colors">Sign Out</a>
                      </>
                    ) : (
                      <a href="/auth/signin" className="px-6 py-3 bg-black text-white hover:bg-neutral-800 rounded-none text-xs font-black uppercase tracking-widest transition-colors">Sign In</a>
                    )}
                  </div>
                </div>
              </div>
            </header>
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {children}
            </main>
            <footer className="bg-white border-t-2 border-black mt-auto">
              <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center text-black font-black text-xs flex flex-col md:flex-row justify-between items-center gap-6 uppercase tracking-widest">
                <span>&copy; {new Date().getFullYear()} E-Maturity Benchmarking Suite.</span>
                <div className="flex flex-wrap justify-center gap-6">
                  <a href="#" className="hover:text-neutral-500 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-neutral-500 transition-colors">Terms</a>
                  <a href="/contact" className="hover:text-neutral-500 transition-colors">Contact</a>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
