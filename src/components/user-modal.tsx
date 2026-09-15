'use client'

import { useState, useEffect } from 'react'
import { useUserStore } from '@/store/user'
import { toast } from 'sonner'

export function UserModal({
  openOverride = false,
  onCloseOverride,
}: {
  openOverride?: boolean
  onCloseOverride?: () => void
}) {
  const { name: savedName, phone: savedPhone, isLoggedIn, setUserProfile } = useUserStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (savedName) setName(savedName)
    if (savedPhone) setPhone(savedPhone)
  }, [savedName, savedPhone])

  if (!mounted) return null

  const showModal = openOverride || !isLoggedIn

  if (!showModal) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a 10-digit phone number')
      return
    }

    setUserProfile(name.trim(), cleanPhone)
    toast.success(`Welcome ${name.trim()}! Account linked.`)
    if (onCloseOverride) onCloseOverride()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-pop-in">
      <div className="w-full max-w-sm bg-[#0e0e0e] rounded-2xl p-6 border border-[#2a2a2a] shadow-2xl flex flex-col items-center text-center">
        {/* Monolithic Icon */}
        <div className="w-16 h-16 rounded-xl bg-[#2a2a2a] border border-[#caf300]/40 flex items-center justify-center text-[#caf300] mb-4">
          <span className="material-symbols-outlined text-[32px]">badge</span>
        </div>

        <h2 className="font-headline-md text-xl uppercase text-white font-black tracking-tight">
          Gym Refuel Account
        </h2>
        <p className="font-body-sm text-xs text-[#c5c9ac] mt-1 mb-6">
          Enter your name and phone number once. We&apos;ll auto-link your live orders &amp; tokens.
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
              person
            </span>
            <input
              type="text"
              placeholder="YOUR FULL NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors uppercase"
              required
            />
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
              call
            </span>
            <input
              type="tel"
              placeholder="10-DIGIT PHONE NUMBER"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full h-12 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full h-14 bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-sm uppercase font-black tracking-wide rounded-xl shadow-[0_0_20px_rgba(202,243,0,0.3)] transition-all active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
          >
            <span>Save &amp; Start Fueling</span>
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </form>

        {openOverride && onCloseOverride && (
          <button
            type="button"
            onClick={onCloseOverride}
            className="mt-4 font-label-sm text-[10px] text-[#8f9378] uppercase hover:underline"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
