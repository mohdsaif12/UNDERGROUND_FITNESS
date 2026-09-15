'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Order } from '@/lib/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [searched, setSearched] = useState(false)

  const search = async () => {
    if (!phone || phone.length < 10) return
    setLoading(true)
    setSearched(true)

    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false })
      .limit(20)

    setOrders((data as Order[]) ?? [])
    setLoading(false)
  }

  return (
    <div className="flex flex-col relative w-full pt-16 pb-28 bg-[#131313] min-h-screen">
      <div className="px-4 py-5 max-w-md mx-auto w-full">
        <h1 className="font-headline-md text-2xl uppercase text-white font-black tracking-tight mb-1">
          Order History
        </h1>
        <p className="font-body-sm text-xs text-[#c5c9ac] mb-4">
          Lookup past gym cafe pickup tokens by phone number
        </p>

        {/* Phone Search */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
              call
            </span>
            <input
              type="tel"
              placeholder="ENTER 10-DIGIT PHONE..."
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              className="w-full h-12 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={search}
            disabled={phone.length < 10}
            className="h-12 px-5 rounded bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-xs uppercase font-black tracking-wider disabled:opacity-40 transition-all"
          >
            Search
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-3xl text-[#caf300] animate-spin mb-2">
              progress_activity
            </span>
            <p className="font-label-sm text-xs text-[#c5c9ac] uppercase">Fetching Orders...</p>
          </div>
        )}

        {!loading && !searched && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-[#8f9378] mb-2">history</span>
            <p className="font-label-sm text-xs text-[#c5c9ac] uppercase">Enter phone number to view history</p>
          </div>
        )}

        {!loading && searched && orders.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-[#8f9378] mb-2">search_off</span>
            <p className="font-label-sm text-xs text-[#c5c9ac] uppercase">No orders found for this phone</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-3">
            {orders.map((order) => {
              const date = new Date(order.created_at)
              const formattedToken = `#A${order.token_number.toString().padStart(2, '0')}`

              return (
                <Link key={order.id} href={`/order/${order.id}`}>
                  <div className="bg-[#1c1b1b] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#caf300] transition-all flex items-center justify-between gap-3">
                    <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] border border-[#caf300]/30 flex flex-col items-center justify-center text-[#caf300] shrink-0">
                      <span className="font-headline-md text-sm font-black leading-tight">
                        {formattedToken}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-headline-sm text-sm text-white font-bold">
                          {order.items.length} Item{order.items.length > 1 ? 's' : ''}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#2a2a2a] font-label-sm text-[9px] uppercase text-[#caf300] font-bold">
                          {order.status}
                        </span>
                      </div>
                      <p className="font-body-sm text-xs text-[#c5c9ac] truncate">
                        {order.items.map((i) => i.name).join(', ')}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="font-headline-sm text-xs text-[#caf300] font-black">
                          ₹{order.total_amount}
                        </span>
                        <span className="font-label-sm text-[9px] text-[#8f9378]">
                          {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}{' '}
                          {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <span className="material-symbols-outlined text-[#8f9378] text-[20px] shrink-0">
                      chevron_right
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
