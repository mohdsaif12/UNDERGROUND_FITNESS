'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function CartPage() {
  const {
    lines,
    setQuantity,
    removeItem,
    clear,
    totalAmount,
    totalPrepMinutes,
    totalItems,
  } = useCartStore()
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedPay, setSelectedPay] = useState<'upi' | 'card' | 'apple'>('upi')
  const [selectedCarb, setSelectedCarb] = useState('brown')
  const [submitting, setSubmitting] = useState(false)

  const handleOrder = async () => {
    if (!name.trim()) {
      toast.error('Please enter your name')
      return
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error('Please enter a 10-digit phone number')
      return
    }
    if (lines.length === 0) {
      toast.error('Cart is empty')
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()

      const orderItems = lines.map((l) => ({
        id: l.id,
        name: l.name,
        price: l.price,
        quantity: l.quantity,
        prep_minutes: l.prep_minutes,
      }))

      const maxPrep = totalPrepMinutes()
      const estimatedReady = new Date(Date.now() + maxPrep * 60_000).toISOString()

      const { data, error } = await supabase
        .from('orders')
        .insert({
          token_number: 0, // trigger auto-sets this
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          items: orderItems,
          total_amount: totalAmount(),
          status: 'new',
          estimated_ready_at: estimatedReady,
        })
        .select('id, token_number')
        .single()

      if (error) throw error

      clear()
      router.push(`/order/${data.id}`)
    } catch (err: any) {
      console.error('Order creation error:', err)
      toast.error(err.message || 'Failed to place order. Ensure DB patch is applied.')
    } finally {
      setSubmitting(false)
    }
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col relative w-full pt-20 pb-24 bg-[#131313] min-h-screen text-center px-4 justify-center items-center">
        <div className="w-20 h-20 rounded-full bg-[#1c1b1b] border border-[#2a2a2a] flex items-center justify-center text-[#8f9378] mb-4">
          <span className="material-symbols-outlined text-[36px]">shopping_bag</span>
        </div>
        <h2 className="font-headline-md text-xl uppercase text-white font-black">Your Fuel Cart is Empty</h2>
        <p className="font-body-sm text-sm text-[#c5c9ac] mt-1 mb-6 max-w-xs">
          Add protein shakes, meals or snacks from the fuel station to continue.
        </p>
        <Link
          href="/menu"
          className="px-6 py-3.5 bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-sm uppercase tracking-wider rounded-lg font-black transition-all"
        >
          Browse Menu
        </Link>
      </div>
    )
  }

  // Estimated Macros for Cart
  const totalProtein = lines.reduce((acc, curr) => acc + 36 * curr.quantity, 0)
  const totalCarbs = lines.reduce((acc, curr) => acc + 45 * curr.quantity, 0)
  const totalFat = lines.reduce((acc, curr) => acc + 12 * curr.quantity, 0)
  const totalCalories = lines.reduce((acc, curr) => acc + 480 * curr.quantity, 0)

  return (
    <div className="flex flex-col relative w-full pt-16 pb-32 bg-[#131313] min-h-screen">
      {/* Top Hero Visual */}
      <div className="relative w-full h-52 bg-[#0e0e0e] overflow-hidden border-b border-[#2a2a2a]">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEG0I4-1R3yt2EnaeZkP3CpZzw3-XG0H1Rx7Avk0q-GC2-wVvcnGpieYxZ424eN3fbY0VvPorui5hrpbz5R8Gj1LOjcBe32iBBDxYDx2GR0j59x1dIPxmXJ_ccOlhgM5OGtIX_rgYmPwpoPEWkCiuQVVR7GVdtzF1PWug9_7ma8ToS9sWL4sw37q39F8nsPzWExYyk8TV91VgAgJ5Es29IRTVQK3Ln6vsCgN4dIF3Gvq-aZtBH4Nc"
          alt="Fuel Items"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/50 to-transparent" />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2.5 py-1 bg-[#131313]/90 text-[#caf300] font-label-sm text-[10px] uppercase tracking-wider rounded backdrop-blur-md border border-[#2a2a2a] font-bold">
            High Protein · {totalCalories} kcal
          </span>
        </div>
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac] tracking-widest block mb-0.5">
              Jimmy Refuel Station
            </span>
            <h2 className="font-headline-md text-2xl text-white tracking-tight font-black">
              Checkout &amp; Pay
            </h2>
          </div>
          <div className="bg-[#2a2a2a] px-3 py-1.5 rounded-lg border border-[#caf300]/40">
            <span className="font-label-lg text-sm text-[#caf300] font-bold tracking-tight">
              ₹{totalAmount()}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-5 mt-3">
        {/* Macro Summary Strip */}
        <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-[#1c1b1b] border border-[#2a2a2a]">
          <div className="flex items-baseline gap-1">
            <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase">Protein</span>
            <span className="font-label-lg text-xs text-[#caf300] font-bold">{totalProtein}g</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase">Carbs</span>
            <span className="font-label-lg text-xs text-white font-bold">{totalCarbs}g</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase">Fat</span>
            <span className="font-label-lg text-xs text-white font-bold">{totalFat}g</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-label-sm text-[9px] text-[#c5c9ac] uppercase">Energy</span>
            <span className="font-label-lg text-xs text-[#bfd42e] font-bold">{totalCalories} kcal</span>
          </div>
        </div>

        {/* Selected Items Breakdown */}
        <div className="bg-[#0e0e0e] rounded-xl p-4 border border-[#2a2a2a] flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#2a2a2a]">
            <span className="font-label-md text-xs text-white uppercase font-bold">Selected Items</span>
            <button
              onClick={() => {
                clear()
                toast('Cart cleared')
              }}
              className="font-label-sm text-[10px] text-red-400 uppercase hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {lines.map((line) => (
              <div key={line.id} className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-sm text-white font-bold truncate">{line.name}</p>
                  <p className="font-label-sm text-[10px] text-[#c5c9ac]">
                    ₹{line.price} × {line.quantity}
                  </p>
                </div>
                <div className="flex items-center bg-[#1c1b1b] border border-[#2a2a2a] rounded p-1">
                  <button
                    onClick={() => setQuantity(line.id, line.quantity - 1)}
                    className="w-7 h-7 rounded bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-red-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <span className="w-7 text-center font-label-md text-xs text-[#caf300] font-bold">
                    {line.quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(line.id, line.quantity + 1)}
                    className="w-7 h-7 rounded bg-[#caf300] text-[#2a3400] flex items-center justify-center hover:bg-[#b0d500] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-0.5 bg-[#2a2a2a] my-1" />
          <div className="flex justify-between items-baseline">
            <span className="font-label-md text-xs uppercase text-[#c5c9ac]">Total Payable</span>
            <span className="font-headline-md text-xl text-[#caf300] font-black">₹{totalAmount()}</span>
          </div>
        </div>

        {/* Custom Grain Base Options */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac] tracking-wider">
            Preparation Customization
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'brown', label: 'Brown Rice' },
              { id: 'jasmine', label: 'Jasmine Rice' },
              { id: 'quinoa', label: 'Quinoa (+₹30)' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedCarb(opt.id)}
                className={`py-2 px-2 rounded-lg font-label-sm text-[10px] text-center transition-all ${
                  selectedCarb === opt.id
                    ? 'bg-[#caf300] text-[#2a3400] font-bold'
                    : 'bg-[#201f1f] text-[#c5c9ac] border border-[#2a2a2a] hover:bg-[#2a2a2a]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Customer Information */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac] tracking-wider">
            Member Pickup Details
          </span>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
                person
              </span>
              <input
                type="text"
                placeholder="YOUR NAME (E.G. ALEX R.)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors"
              />
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
                call
              </span>
              <input
                type="tel"
                placeholder="PHONE NUMBER (10 DIGITS)"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full h-12 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="flex flex-col gap-2">
          <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac] tracking-wider">
            Payment Method
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'upi', label: 'UPI', icon: 'qr_code_scanner' },
              { id: 'card', label: 'Card', icon: 'credit_card' },
              { id: 'apple', label: 'Apple Pay', icon: 'contactless' },
            ].map((pay) => (
              <button
                key={pay.id}
                type="button"
                onClick={() => setSelectedPay(pay.id as any)}
                className={`flex items-center justify-center gap-1.5 p-3 rounded-xl transition-all ${
                  selectedPay === pay.id
                    ? 'bg-[#caf300] text-[#2a3400] font-bold'
                    : 'bg-[#201f1f] text-[#c5c9ac] border border-[#2a2a2a] hover:bg-[#2a2a2a]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{pay.icon}</span>
                <span className="font-label-sm text-[10px] uppercase">{pay.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Checkout Trigger */}
        <button
          type="button"
          onClick={handleOrder}
          disabled={submitting}
          className="w-full h-14 bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-base uppercase tracking-normal rounded-xl shadow-lg flex items-center justify-center gap-2 px-6 active:scale-[0.98] transition-all font-black mt-2 disabled:opacity-60"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-[22px]">progress_activity</span>
              Securing Fuel...
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[22px]">bolt</span>
              <span>Pay ₹{totalAmount()} • Place Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

