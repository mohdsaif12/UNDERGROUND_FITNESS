import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MenuItem } from '@/lib/types'

export type CartLine = {
  id: string
  name: string
  price: number
  prep_minutes: number
  quantity: number
}

type CartState = {
  lines: CartLine[]
  addItem: (item: MenuItem) => void
  removeItem: (id: string) => void
  setQuantity: (id: string, quantity: number) => void
  clear: () => void
  totalAmount: () => number
  totalPrepMinutes: () => number
  totalItems: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      addItem: (item) => {
        set((state) => {
          const existing = state.lines.find((l) => l.id === item.id)
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === item.id ? { ...l, quantity: l.quantity + 1 } : l
              ),
            }
          }
          return {
            lines: [
              ...state.lines,
              {
                id: item.id,
                name: item.name,
                price: item.price,
                prep_minutes: item.prep_minutes,
                quantity: 1,
              },
            ],
          }
        })
      },
      removeItem: (id) => {
        set((state) => ({ lines: state.lines.filter((l) => l.id !== id) }))
      },
      setQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          lines: state.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
        }))
      },
      clear: () => set({ lines: [] }),
      totalAmount: () =>
        get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
      totalPrepMinutes: () =>
        get().lines.reduce((max, l) => Math.max(max, l.prep_minutes), 0),
      totalItems: () => get().lines.reduce((sum, l) => sum + l.quantity, 0),
    }),
    { name: 'gym-cafe-cart' }
  )
)
