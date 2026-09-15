'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import type { MenuItem } from '@/lib/types'
import { toast } from 'sonner'

export function MenuClient({
  items,
  banner,
}: {
  items: MenuItem[]
  banner: string | null
}) {
  const { lines, addItem, setQuantity, totalItems, totalAmount } = useCartStore()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(items.map((i) => i.category)))
    return cats
  }, [items])

  const filtered = useMemo(() => {
    let list = items
    if (activeCategory) list = list.filter((i) => i.category === activeCategory)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
    }
    return list
  }, [items, activeCategory, search])

  const getQty = (id: string) => lines.find((l) => l.id === id)?.quantity ?? 0

  // Fallback high-res gym food imagery per category
  const getImageForItem = (item: MenuItem) => {
    if (item.image_url) return item.image_url
    const name = item.name.toLowerCase()
    if (name.includes('chicken') || name.includes('rice') || name.includes('steak')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCI4wl_LNZl_IM2_BZz1PuCc-3pud1OeMzoSdqz6_buSq6AzPmMwYbyLzi78TS_MVOpE-vJEoz5-4z5DxyCWQVukZJTshod4rd6VSsKih_slLP0vCowil8XbWPwSOBQQawIp9BNv01HIaC70JdMq5U0wwqmKIo3F2T5hNm5wu7ydwwrVb2T2CtC5CvCueUzabcpFEsGkt5mSyZBR__lMYqMCClJTpeyhKSpkKR31Q10Bn2vo8vxN00'
    }
    if (name.includes('shake') || name.includes('whey') || name.includes('protein')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBt4XHKUHJBsZjn-Fxfp3MMjRIEHe8QU7XsL8gQn-1jLpYjA2EEJRsPrDR_2CwMNmkCT2wlaZXtaGxKHnQy7y9GAPJD8X1uahhWsyLrHJjeisA6YlUtqyhBiRVUmKEsZp3X5VONhWbr-EVoQ7tZ3Sw9KDpAafcapuUd447-ppNNU89prA9i8scPBR_CKtwnzLncPQdyOIZ4KXCnnjTwnmyc7mJqbHwHl96pelWyC6U3RQYt4nPBNPE'
    }
    if (name.includes('bar') || name.includes('oat') || name.includes('peanut')) {
      return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZm08Ges4n4affFEDxGAKdjcqDH5AQxmqYV6dnLAu2oohGdv8DlLWrj4Vi3nydXRgBtz-TSAUEh2chiUqhdT9t9Xxl9dQAWn_mI9KnPytFo03mYTIKSndjvYGEu8j6srNSq3LjDgqDU_EbYs-GhpuA7A0wngyr4Nu_foJ19NhvIJ96UGWO6qU3EHL2s5yer0p9Lz2cu4Kl_iq-SwNnKviu8UKMC4VjtJ8NKQTsM3KLeUW49TdOvj8'
    }
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1POi_oa9F_ORQDazGBF6McXEeWxkuikOyDOwCDbO52L5Bvh6XQXqXWggRH9VjUGbN0MTHXjiWg8luW7CtGdXxVj7T5OAMCulGjA7JIRv4eMbE13xtmKN2B83SI4vWv_PK_i4VARGGPaZuPi9Sa5TccLJ-_ucZKeDepZKdFESc8sYhQincn7WFyAkjPu5Y-CB_eFW9ybrtXNwsFWsevHm1QoK3qUhx33hxNvnu9V1FEOwyq2bL7jw'
  }

  // Calculate total protein in cart
  const cartProtein = lines.reduce((acc, curr) => {
    // estimate 30g per item if unspecified
    return acc + (curr.prep_minutes ? curr.prep_minutes * 2 : 30) * curr.quantity
  }, 0)

  return (
    <div className="flex flex-col relative w-full pt-16 pb-32 bg-[#131313] min-h-screen">
      {/* Target Fuel Hero / Goal Status Strip */}
      <section className="px-4 pt-4 pb-2 flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <h1 className="font-headline-md text-2xl uppercase text-white tracking-tight font-black">
            Fuel Station
          </h1>
          <span className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">
            Cart Pro: <span className="text-[#caf300] font-bold">{cartProtein}g</span> / 160g Goal
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative mt-2">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#8f9378]">
            search
          </span>
          <input
            type="text"
            placeholder="SEARCH NUTRITION, SHAKES & MEALS..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded bg-[#1c1b1b] border border-[#2a2a2a] text-xs font-mono text-white placeholder-[#8f9378] outline-none focus:border-[#caf300] transition-colors"
          />
        </div>
      </section>

      {/* Banner */}
      {banner && (
        <div className="mx-4 mt-2 px-3 py-2 rounded bg-[#2a2a2a] border border-[#caf300]/40 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#caf300]">campaign</span>
          <p className="font-label-sm text-[11px] text-white uppercase">{banner}</p>
        </div>
      )}

      {/* Category Filter Pills */}
      <section className="px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 min-w-max">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full font-label-md text-[11px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              !activeCategory
                ? 'bg-[#caf300] text-[#2a3400] font-bold shadow-sm'
                : 'bg-[#201f1f] text-[#c5c9ac] hover:text-white border border-[#2a2a2a]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">apps</span>
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
              className={`px-4 py-1.5 rounded-full font-label-md text-[11px] uppercase tracking-wider transition-all ${
                activeCategory === cat
                  ? 'bg-[#caf300] text-[#2a3400] font-bold shadow-sm'
                  : 'bg-[#201f1f] text-[#c5c9ac] hover:text-white border border-[#2a2a2a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product List Stream */}
      <section className="px-4 flex flex-col gap-4 pt-1">
        {filtered.map((item) => {
          const qty = getQty(item.id)
          const imgUrl = getImageForItem(item)

          return (
            <article
              key={item.id}
              className="w-full bg-[#1c1b1b] rounded-xl overflow-hidden shadow-md flex flex-col border border-[#2a2a2a] group"
            >
              <div className="relative w-full h-44 overflow-hidden bg-[#0e0e0e]">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#131313]/90 backdrop-blur-md border border-[#2a2a2a]">
                    <span className="material-symbols-outlined text-[14px] text-[#caf300]">timer</span>
                    <span className="font-label-sm text-[10px] text-white uppercase">{item.prep_minutes} min</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-headline-sm text-lg text-white tracking-tight font-black">{item.name}</h3>
                    {item.description && (
                      <p className="font-body-sm text-[13px] text-[#c5c9ac] line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="font-headline-sm text-lg text-white whitespace-nowrap font-bold">
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="font-label-sm text-[11px] text-[#c5c9ac]">
                    <span className="text-[#caf300] font-bold">High Protein</span> · Fresh Prep
                  </span>

                  {qty === 0 ? (
                    <button
                      onClick={() => {
                        addItem(item)
                        toast.success(`${item.name} added to order`)
                      }}
                      className="flex items-center justify-center gap-1 bg-[#2a2a2a] hover:bg-[#caf300] hover:text-[#2a3400] text-white px-4 h-10 rounded-lg transition-colors font-label-md text-[11px] uppercase tracking-wider font-bold active:scale-95 border border-[#444932]"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                      ADD
                    </button>
                  ) : (
                    <div className="flex items-center bg-[#0e0e0e] border border-[#caf300] rounded-lg p-1">
                      <button
                        onClick={() => setQuantity(item.id, qty - 1)}
                        className="w-8 h-8 rounded bg-[#2a2a2a] text-white flex items-center justify-center hover:bg-red-900 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">remove</span>
                      </button>
                      <span className="w-8 text-center font-label-md text-[12px] text-[#caf300] font-bold">
                        {qty}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 rounded bg-[#caf300] text-[#2a3400] flex items-center justify-center hover:bg-[#b0d500] transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-[#8f9378] mb-2">search_off</span>
            <p className="text-[#c5c9ac] font-mono text-sm">No items matching filter</p>
          </div>
        )}
      </section>

      {/* Persistent Floating Cart Drawer / Anchor Bar */}
      {totalItems() > 0 && (
        <div className="fixed bottom-16 inset-x-0 z-40 px-4 max-w-lg mx-auto pointer-events-none mb-2">
          <div className="w-full bg-[#353534]/95 backdrop-blur-xl rounded-xl p-3 flex items-center justify-between shadow-2xl border border-[#caf300]/30 pointer-events-auto">
            <div className="flex items-center gap-3 min-w-0 pr-2">
              <div className="w-10 h-10 rounded-lg bg-[#201f1f] flex items-center justify-center shrink-0 border border-[#2a2a2a]">
                <span className="material-symbols-outlined text-[#caf300] text-[20px]">shopping_bag</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-headline-sm text-base text-white font-bold">
                  {totalItems()} Item{totalItems() > 1 ? 's' : ''}
                </span>
                <span className="text-[#c5c9ac]">•</span>
                <span className="font-headline-sm text-base text-[#caf300] font-black">
                  ₹{totalAmount()}
                </span>
              </div>
            </div>
            <Link
              href="/cart"
              className="shrink-0 bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] px-4 py-2.5 rounded-lg font-headline-sm text-sm uppercase tracking-tight flex items-center gap-1 active:scale-95 transition-all font-black shadow-[0_0_16px_rgba(202,243,0,0.3)]"
            >
              <span>View Order</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

