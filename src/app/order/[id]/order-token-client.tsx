'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Order } from '@/lib/types'

export function OrderTokenClient({ order }: { order: Order }) {
  const [timeLeft, setTimeLeft] = useState<string>('11:44')

  useEffect(() => {
    if (!order.estimated_ready_at) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const target = new Date(order.estimated_ready_at!).getTime()
      const diff = Math.max(0, Math.floor((target - now) / 1000))

      const mins = Math.floor(diff / 60)
      const secs = diff % 60
      setTimeLeft(
        `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [order.estimated_ready_at])

  // Formatting token number
  const formattedToken = `#A${order.token_number.toString().padStart(2, '0')}`

  // Calculate estimated macros
  const totalProtein = order.items.reduce((acc, curr) => acc + 36 * curr.quantity, 0)
  const totalCarbs = order.items.reduce((acc, curr) => acc + 44 * curr.quantity, 0)
  const totalCalories = order.items.reduce((acc, curr) => acc + 490 * curr.quantity, 0)

  // Status mapping
  const isNew = order.status === 'new'
  const isPrep = order.status === 'preparing'
  const isCompleted = order.status === 'completed'

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 bg-[#131313] min-h-screen">
      <div className="flex flex-col w-full px-4 pb-8 space-y-4 select-none max-w-md mx-auto">
        {/* Streamlined Brand Strip */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#caf300] animate-pulse" />
            <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#c5c9ac]">
              Counter B • Floor 1
            </span>
          </div>
          <span className="font-label-sm text-[10px] uppercase text-[#d8ee48] bg-[#2a2a2a] px-2.5 py-1 rounded font-bold">
            Live Order
          </span>
        </div>

        {/* Massive Hero Token Card */}
        <div className="relative w-full bg-[#0e0e0e] rounded-xl p-6 flex flex-col items-center justify-center text-center overflow-hidden shadow-2xl border border-[#2a2a2a] py-8">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#caf300]/10 rounded-full blur-3xl pointer-events-none" />
          <span className="font-label-sm text-[10px] text-[#c5c9ac] tracking-widest uppercase mb-2">
            Pickup Station Token
          </span>
          <div className="py-2 px-8 my-1">
            <h1 className="font-display-mobile text-[56px] leading-none tracking-tighter text-[#caf300] uppercase font-black">
              {formattedToken}
            </h1>
          </div>
          <p className="font-body-sm text-[12px] text-[#c5c9ac] mt-2">
            Show this number at Counter B when called
          </p>
        </div>

        {/* Streamlined Status Progression & ETA */}
        <div className="w-full bg-[#201f1f] rounded-xl p-4 space-y-4 shadow-md border border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#caf300] text-[20px] animate-spin">
                cyclone
              </span>
              <span className="font-headline-sm text-base text-white uppercase font-bold">
                {isCompleted ? 'Order Ready' : 'Estimated Prep'}
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-label-lg text-base text-[#caf300] font-bold tracking-tight">
                {isCompleted ? '00:00' : timeLeft}
              </span>
              <span className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">mins</span>
            </div>
          </div>

          {/* 4-step indicator */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            {/* Step 1: Paid */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#caf300] border border-[#caf300]/40">
                <span className="material-symbols-outlined text-[16px]">check</span>
              </div>
              <span className="font-label-sm text-[9px] uppercase text-[#caf300] font-bold">Paid</span>
            </div>

            {/* Step 2: Prep */}
            <div className={`flex flex-col items-center space-y-1 ${isNew || isPrep || isCompleted ? 'opacity-100' : 'opacity-40'}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isPrep
                    ? 'bg-[#caf300] text-[#2a3400] shadow-[0_0_12px_rgba(202,243,0,0.4)]'
                    : 'bg-[#2a2a2a] text-[#caf300]'
                }`}
              >
                {isPrep ? (
                  <span className="w-2 h-2 rounded-full bg-[#2a3400] animate-pulse" />
                ) : (
                  <span className="material-symbols-outlined text-[16px]">cooking</span>
                )}
              </div>
              <span className={`font-label-sm text-[9px] uppercase font-bold ${isPrep ? 'text-white' : 'text-[#c5c9ac]'}`}>
                Prep
              </span>
            </div>

            {/* Step 3: Ready */}
            <div className={`flex flex-col items-center space-y-1 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-[#caf300] text-[#2a3400] shadow-[0_0_12px_rgba(202,243,0,0.4)]'
                    : 'bg-[#2a2a2a] text-[#c5c9ac]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">notifications</span>
              </div>
              <span className={`font-label-sm text-[9px] uppercase ${isCompleted ? 'text-[#caf300] font-bold' : 'text-[#c5c9ac]'}`}>
                Ready
              </span>
            </div>

            {/* Step 4: Picked Up */}
            <div className="flex flex-col items-center space-y-1 opacity-40">
              <div className="w-8 h-8 rounded-full bg-[#2a2a2a] flex items-center justify-center text-[#c5c9ac]">
                <span className="material-symbols-outlined text-[16px]">done_all</span>
              </div>
              <span className="font-label-sm text-[9px] uppercase text-[#c5c9ac]">Picked Up</span>
            </div>
          </div>
        </div>

        {/* Decluttered Order Summary Ticket */}
        <div className="w-full bg-[#1c1b1b] rounded-xl p-4 space-y-3 shadow-md border border-[#2a2a2a]">
          <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
            <span className="font-label-md text-xs text-white uppercase font-bold">Order Ticket</span>
            <span className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">
              {order.items.reduce((acc, curr) => acc + curr.quantity, 0)} Items
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <div>
                  <p className="font-body-md text-sm text-white font-bold">{item.name}</p>
                  <p className="font-label-sm text-[10px] text-[#c5c9ac]">Qty {item.quantity}</p>
                </div>
                <span className="font-label-md text-xs text-white font-bold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Macro Summary Box */}
          <div className="flex items-center justify-around bg-[#2a2a2a] py-2 px-3 rounded-lg text-center mt-3">
            <div>
              <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase block">Protein</span>
              <span className="font-label-md text-xs text-[#caf300] font-bold">{totalProtein}g</span>
            </div>
            <div className="w-px h-6 bg-[#353534]" />
            <div>
              <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase block">Carbs</span>
              <span className="font-label-md text-xs text-white font-bold">{totalCarbs}g</span>
            </div>
            <div className="w-px h-6 bg-[#353534]" />
            <div>
              <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase block">Calories</span>
              <span className="font-label-md text-xs text-[#bfd42e] font-bold">{totalCalories} kcal</span>
            </div>
          </div>

          {/* Total Paid */}
          <div className="flex justify-between items-center pt-2 text-white font-headline-sm text-lg">
            <span>Total Paid</span>
            <span className="text-[#caf300] font-black">₹{order.total_amount}</span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Link
            href="/orders"
            className="h-14 bg-[#201f1f] text-[#c5c9ac] hover:text-white rounded-lg flex items-center justify-center gap-2 font-label-md text-[11px] uppercase tracking-wider transition-colors border border-[#2a2a2a] font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>All Orders</span>
          </Link>

          <Link
            href="/menu"
            className="h-14 bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] rounded-lg flex items-center justify-center gap-2 font-label-md text-[11px] uppercase font-bold tracking-wider transition-all active:scale-[0.98] shadow-[0_0_16px_rgba(202,243,0,0.3)] font-black"
          >
            <span className="material-symbols-outlined text-[18px]">storefront</span>
            <span>Back to Menu</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

