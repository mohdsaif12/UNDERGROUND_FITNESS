'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUserStore } from '@/store/user'
import { UserModal } from '@/components/user-modal'

export function TopHeader() {
  const pathname = usePathname()
  const { name, isLoggedIn, logout } = useUserStore()
  const [showEditModal, setShowEditModal] = useState(false)

  if (pathname.startsWith('/dashboard')) return null

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#131313]/90 backdrop-blur-xl pt-safe shadow-[0_1px_12px_rgba(0,0,0,0.4)] border-b border-[#2a2a2a]">
        <div className="h-16 px-4 flex items-center justify-between max-w-lg mx-auto">
          <Link href="/menu" className="flex items-center gap-2">
            <span className="font-headline-sm text-lg uppercase text-white tracking-tight font-black">Underground</span>
            <span className="px-2 py-0.5 bg-[#caf300] text-[#2a3400] font-label-sm text-[10px] uppercase rounded font-bold tracking-wider">
              Jimmy Cafe
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201f1f] border border-[#2a2a2a] hover:border-[#caf300] transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#caf300] animate-pulse" />
                  <span className="font-label-sm text-[10px] uppercase text-white font-bold truncate max-w-[90px]">
                    {name.split(' ')[0]}
                  </span>
                </button>

                <button
                  onClick={logout}
                  className="p-1 rounded text-[#8f9378] hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-2.5 py-1 rounded bg-[#caf300] text-[#2a3400] font-label-sm text-[10px] uppercase font-bold"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <UserModal
        openOverride={showEditModal}
        onCloseOverride={() => setShowEditModal(false)}
      />
    </>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  if (pathname.startsWith('/dashboard')) return null

  const isHome = pathname === '/' || pathname === '/menu'
  const isOrders = pathname === '/orders' || pathname.startsWith('/order/')
  const isDashboard = pathname.startsWith('/dashboard')

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0e0e0e]/95 backdrop-blur-xl border-t border-[#2a2a2a] shadow-[0_-1px_16px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around h-16 px-4 max-w-lg mx-auto">
        <Link
          href="/menu"
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 px-3 rounded transition-colors ${
            isHome ? 'text-[#caf300] bg-[#2a2a2a]' : 'text-[#c5c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">local_cafe</span>
          <span className="font-label-sm text-[10px] uppercase mt-0.5 font-bold">Menu</span>
        </Link>
        <Link
          href="/orders"
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 px-3 rounded transition-colors ${
            isOrders ? 'text-[#caf300] bg-[#2a2a2a]' : 'text-[#c5c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span className="font-label-sm text-[10px] uppercase mt-0.5 font-bold">Orders</span>
        </Link>
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center min-w-[64px] h-12 px-3 rounded transition-colors ${
            isDashboard ? 'text-[#caf300] bg-[#2a2a2a]' : 'text-[#c5c9ac] hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]">space_dashboard</span>
          <span className="font-label-sm text-[10px] uppercase mt-0.5 font-bold">Kitchen</span>
        </Link>
      </div>
    </nav>
  )
}

