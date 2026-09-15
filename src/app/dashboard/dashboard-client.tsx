'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { Order, OrderStatus } from '@/lib/types'
import { toast } from 'sonner'

// ── receipt printer ──────────────────────────────────────────────
function printReceipt(order: Order) {
  const w = window.open('', '_blank', 'width=320,height=600')
  if (!w) return
  w.document.write(`
    <html>
    <head><title>Token #${order.token_number}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family:monospace; font-size:12px; padding:8mm; width:80mm; background:#fff; color:#000; }
      .center { text-align:center; }
      .big { font-size:48px; font-weight:900; }
      hr { border:none; border-top:1px dashed #000; margin:6px 0; }
      .row { display:flex; justify-content:space-between; padding:2px 0; }
      .bold { font-weight:700; }
      .mt { margin-top:8px; }
    </style></head>
    <body>
      <div class="center"><b>UNDERGROUND JIMMY CAFE</b></div>
      <div class="center">POS KITCHEN RECEIPT</div>
      <hr/>
      <div class="center mt">TOKEN</div>
      <div class="center big">#A${order.token_number}</div>
      <hr/>
      <div class="row"><span>Customer: ${order.customer_name}</span></div>
      <div class="row"><span>Phone: ${order.customer_phone}</span></div>
      <hr/>
      ${order.items.map((i) => `<div class="row"><span>${i.quantity}x ${i.name}</span><span>₹${i.price * i.quantity}</span></div>`).join('')}
      <hr/>
      <div class="row bold"><span>TOTAL PAID</span><span>₹${order.total_amount}</span></div>
      <hr/>
      <div class="center mt" style="font-size:10px;">${new Date(order.created_at).toLocaleString('en-IN')}</div>
    </body></html>
  `)
  w.document.close()
  setTimeout(() => {
    w.print()
    w.close()
  }, 400)
}

// ── notification sound ───────────────────────────────────────────
function playNotificationSound() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.setValueAtTime(800, ctx.currentTime)
    osc.frequency.setValueAtTime(1000, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(800, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch {
    // AudioContext not available
  }
}

// ── column component ─────────────────────────────────────────────
function OrderColumn({
  title,
  icon,
  orders,
  headerBg,
  headerText,
  onAction,
  actionLabel,
  showPrint,
}: {
  title: string
  icon: string
  orders: Order[]
  headerBg: string
  headerText: string
  onAction?: (order: Order) => void
  actionLabel?: string
  showPrint?: boolean
}) {
  return (
    <div className="flex-1 min-w-[320px] max-w-md flex flex-col rounded-xl bg-[#0e0e0e] border border-[#2a2a2a] overflow-hidden">
      {/* Column header */}
      <div className={`flex items-center gap-2 px-4 py-3 border-b border-[#2a2a2a] ${headerBg}`}>
        <span className={`material-symbols-outlined text-[20px] ${headerText}`}>{icon}</span>
        <span className={`font-headline-sm text-sm uppercase tracking-wide font-black ${headerText}`}>
          {title}
        </span>
        <span className="ml-auto font-label-sm text-xs font-bold text-[#c5c9ac] px-2 py-0.5 rounded bg-[#131313]/50">
          {orders.length}
        </span>
      </div>

      {/* Cards Stream */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-200px)]">
        {orders.length === 0 && (
          <p className="text-center font-label-sm text-xs text-[#8f9378] py-12 uppercase">
            No active orders
          </p>
        )}
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#1c1b1b] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#caf300]/50 transition-all flex flex-col gap-3"
          >
            {/* Top Row: Token & Customer */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] border border-[#caf300]/30 flex flex-col items-center justify-center text-[#caf300]">
                  <span className="font-label-sm text-[8px] text-[#c5c9ac] uppercase">TOKEN</span>
                  <span className="font-headline-md text-lg font-black leading-tight">
                    #{order.token_number}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#c5c9ac]">person</span>
                    <span className="font-body-md text-sm text-white font-bold">{order.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-[#8f9378]">call</span>
                    <span className="font-label-sm text-[10px] text-[#c5c9ac]">{order.customer_phone}</span>
                  </div>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-[#8f9378]">
                {new Date(order.created_at).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {/* Itemized List */}
            <div className="h-px bg-[#2a2a2a]" />
            <div className="space-y-1.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="font-body-sm text-xs text-[#e5e2e1]">
                    <span className="font-bold text-[#caf300]">{item.quantity}×</span> {item.name}
                  </span>
                  <span className="font-label-sm text-[11px] text-[#c5c9ac]">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac]">Total</span>
              <span className="font-headline-sm text-base text-[#caf300] font-black">
                ₹{order.total_amount}
              </span>
            </div>

            {/* Actions */}
            {(onAction || showPrint) && (
              <>
                <div className="h-px bg-[#2a2a2a]" />
                <div className="flex gap-2">
                  {showPrint && (
                    <button
                      type="button"
                      onClick={() => printReceipt(order)}
                      className="flex-1 h-10 rounded bg-[#2a2a2a] hover:bg-[#353534] text-white font-label-sm text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 font-bold border border-[#444932]"
                    >
                      <span className="material-symbols-outlined text-[16px]">print</span>
                      Print
                    </button>
                  )}
                  {onAction && (
                    <button
                      type="button"
                      onClick={() => onAction(order)}
                      className="flex-1 h-10 rounded bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-label-sm text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 font-black shadow-[0_0_12px_rgba(202,243,0,0.2)]"
                    >
                      <span className="material-symbols-outlined text-[16px]">bolt</span>
                      {actionLabel}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── main dashboard ───────────────────────────────────────────────
export function DashboardClient() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [pinVerified, setPinVerified] = useState(false)
  const [pin, setPin] = useState('')
  const prevOrderIdsRef = useRef<Set<string>>(new Set())

  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    const fetched = (data as Order[]) ?? []
    setOrders(fetched)
    setLoading(false)

    // Check for new orders
    const newIds = new Set(fetched.map((o) => o.id))
    if (prevOrderIdsRef.current.size > 0) {
      const brandNew = fetched.filter(
        (o) => !prevOrderIdsRef.current.has(o.id) && o.status === 'new'
      )
      if (brandNew.length > 0 && soundEnabled) {
        playNotificationSound()
        brandNew.forEach((o) =>
          toast.success(`New Order #${o.token_number} — ${o.customer_name}`, {
            duration: 5000,
          })
        )
      }
    }
    prevOrderIdsRef.current = newIds
  }, [supabase, soundEnabled])

  // Initial load + realtime subscription
  useEffect(() => {
    if (!pinVerified) return

    fetchOrders()

    const channel = supabase
      .channel('orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pinVerified, fetchOrders, supabase])

  const updateStatus = async (order: Order, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', order.id)

    if (error) {
      toast.error('Failed to update order')
      return
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
    )

    if (newStatus === 'preparing') {
      toast.info(`Order #${order.token_number} → Preparing`)
    } else if (newStatus === 'completed') {
      toast.success(`Order #${order.token_number} → Completed`)
    }
  }

  // ── PIN gate ─────────────────────────────────────────────────
  if (!pinVerified) {
    const dashPin = process.env.NEXT_PUBLIC_DASHBOARD_PIN || '1234'
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#131313] p-4">
        <div className="w-full max-w-xs bg-[#0e0e0e] rounded-xl p-6 border border-[#2a2a2a] flex flex-col items-center text-center shadow-2xl">
          <div className="w-16 h-16 rounded-xl bg-[#2a2a2a] border border-[#caf300]/40 flex items-center justify-center text-[#caf300] mb-4">
            <span className="material-symbols-outlined text-[32px]">soup_kitchen</span>
          </div>
          <h1 className="font-headline-md text-xl uppercase text-white font-black">Underground Kitchen</h1>
          <p className="font-label-sm text-[10px] text-[#c5c9ac] uppercase mt-1 mb-6">Enter Staff Access PIN</p>

          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (pin === dashPin) {
                  setPinVerified(true)
                } else {
                  toast.error('Incorrect PIN')
                  setPin('')
                }
              }
            }}
            className="w-full h-14 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-center text-2xl font-mono text-[#caf300] tracking-[0.5em] outline-none focus:border-[#caf300] transition-colors mb-4"
          />
          <button
            type="button"
            onClick={() => {
              if (pin === dashPin) {
                setPinVerified(true)
              } else {
                toast.error('Incorrect PIN')
                setPin('')
              }
            }}
            className="w-full h-12 rounded bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-sm uppercase font-black tracking-wide transition-all shadow-[0_0_16px_rgba(202,243,0,0.3)]"
          >
            Unlock POS Deck
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard Layout ──────────────────────────────────────────
  const newOrders = orders.filter((o) => o.status === 'new')
  const preparing = orders.filter((o) => o.status === 'preparing')
  const completed = orders.filter((o) => o.status === 'completed')

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      {/* Top POS Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0e0e0e] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-4 px-6 h-16 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-[#2a2a2a] border border-[#caf300]/40 flex items-center justify-center text-[#caf300]">
              <span className="material-symbols-outlined text-[20px]">soup_kitchen</span>
            </div>
            <div>
              <h1 className="font-headline-sm text-base uppercase text-white font-black tracking-tight">
                Underground POS Display
              </h1>
              <p className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">Kitchen Order Flow</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* Realtime Live Counts */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201f1f] border border-[#2a2a2a]">
              <span className="w-2 h-2 rounded-full bg-[#caf300] animate-ping" />
              <span className="font-label-sm text-[10px] uppercase text-white font-bold">
                {newOrders.length} New
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201f1f] border border-[#2a2a2a]">
              <span className="w-2 h-2 rounded-full bg-[#bfd42e]" />
              <span className="font-label-sm text-[10px] uppercase text-white font-bold">
                {preparing.length} Prep
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#201f1f] border border-[#2a2a2a]">
              <span className="w-2 h-2 rounded-full bg-[#8f9378]" />
              <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac] font-bold">
                {completed.length} Done
              </span>
            </div>
          </div>

          {/* Sound toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded transition-colors border border-[#2a2a2a] ${
              soundEnabled
                ? 'bg-[#2a2a2a] text-[#caf300]'
                : 'bg-[#1c1b1b] text-[#8f9378]'
            }`}
            title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {soundEnabled ? 'notifications_active' : 'notifications_off'}
            </span>
          </button>

          {/* Refresh */}
          <button
            type="button"
            onClick={() => fetchOrders()}
            className="p-2 rounded bg-[#2a2a2a] text-white hover:bg-[#353534] transition-colors border border-[#2a2a2a]"
            title="Refresh Orders"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>

          {/* Settings */}
          <Link
            href="/dashboard/settings"
            className="p-2 rounded bg-[#2a2a2a] text-white hover:bg-[#353534] transition-colors border border-[#2a2a2a]"
            title="Settings"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </Link>
        </div>
      </header>

      {/* Kanban Board Container */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-4xl text-[#caf300] animate-spin mb-2">
            progress_activity
          </span>
          <p className="font-label-sm text-xs text-[#c5c9ac] uppercase">Syncing Kitchen Orders...</p>
        </div>
      ) : (
        <div className="flex gap-4 p-6 overflow-x-auto max-w-7xl mx-auto">
          <OrderColumn
            title="New Tickets"
            icon="notifications"
            orders={newOrders}
            headerBg="bg-[#201f1f]"
            headerText="text-[#caf300]"
            onAction={(o) => {
              printReceipt(o)
              updateStatus(o, 'preparing')
            }}
            actionLabel="Print & Prepare"
            showPrint={true}
          />
          <OrderColumn
            title="In Preparation"
            icon="cooking"
            orders={preparing}
            headerBg="bg-[#201f1f]"
            headerText="text-[#bfd42e]"
            onAction={(o) => updateStatus(o, 'completed')}
            actionLabel="Mark Ready"
          />
          <OrderColumn
            title="Completed"
            icon="task_alt"
            orders={completed}
            headerBg="bg-[#201f1f]"
            headerText="text-[#c5c9ac]"
          />
        </div>
      )}
    </div>
  )
}

