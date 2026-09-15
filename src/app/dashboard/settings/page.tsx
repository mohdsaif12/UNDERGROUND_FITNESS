'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Megaphone,
  Save,
  Loader2,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Plus,
  UtensilsCrossed,
  ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import type { Settings, MenuItem } from '@/lib/types'
import { toast } from 'sonner'

export default function SettingsPage() {
  const supabase = createClient()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // New item form
  const [showNewItem, setShowNewItem] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    prep_minutes: '10',
    category: 'General',
    image_url: '',
  })

  useEffect(() => {
    async function load() {
      const [{ data: s }, { data: m }] = await Promise.all([
        supabase.from('settings').select('*').eq('id', 'main').single(),
        supabase.from('menu_items').select('*').order('category').order('sort_order'),
      ])
      setSettings(s as Settings)
      setMenuItems((m as MenuItem[]) ?? [])
      setLoading(false)
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveSettings = async () => {
    if (!settings) return
    setSaving(true)
    const { error } = await supabase
      .from('settings')
      .update({
        banner_text: settings.banner_text,
        banner_active: settings.banner_active,
      })
      .eq('id', 'main')

    if (error) {
      toast.error('Failed to save settings')
    } else {
      toast.success('Settings saved')
    }
    setSaving(false)
  }

  const toggleAvailability = async (item: MenuItem) => {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id)

    if (error) {
      toast.error('Failed to update')
      return
    }

    setMenuItems((prev) =>
      prev.map((m) => (m.id === item.id ? { ...m, is_available: !m.is_available } : m))
    )
    toast.success(`${item.name} ${!item.is_available ? 'enabled' : 'disabled'}`)
  }

  const deleteItem = async (item: MenuItem) => {
    if (!confirm(`Delete "${item.name}"?`)) return
    const { error } = await supabase.from('menu_items').delete().eq('id', item.id)
    if (error) {
      toast.error('Failed to delete')
      return
    }
    setMenuItems((prev) => prev.filter((m) => m.id !== item.id))
    toast.success(`${item.name} deleted`)
  }

  const addItem = async () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Name and price are required')
      return
    }
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        name: newItem.name,
        description: newItem.description || null,
        price: parseFloat(newItem.price),
        prep_minutes: parseInt(newItem.prep_minutes) || 10,
        category: newItem.category || 'General',
        image_url: newItem.image_url || null,
      })
      .select()
      .single()

    if (error) {
      toast.error('Failed to add item')
      return
    }

    setMenuItems((prev) => [...prev, data as MenuItem])
    setNewItem({ name: '', description: '', price: '', prep_minutes: '10', category: 'General', image_url: '' })
    setShowNewItem(false)
    toast.success('Item added')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-dvh bg-gray-100">
        <Loader2 className="size-8 text-emerald-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 px-6 h-16">
          <Link href="/dashboard" className="p-1.5 -ml-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <ArrowLeft className="size-5 text-gray-700" />
          </Link>
          <h1 className="text-base font-extrabold text-gray-900">Settings</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-5 space-y-5">
        {/* Banner / Offer */}
        <Card className="ring-0 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="size-4 text-amber-600" />
              Banner / Offer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Show banner on menu</span>
              <button
                onClick={() =>
                  setSettings((s) => (s ? { ...s, banner_active: !s.banner_active } : s))
                }
              >
                {settings?.banner_active ? (
                  <ToggleRight className="size-8 text-emerald-500" />
                ) : (
                  <ToggleLeft className="size-8 text-gray-300" />
                )}
              </button>
            </div>
            <textarea
              rows={2}
              placeholder="e.g. 🎉 20% off on all protein shakes today!"
              value={settings?.banner_text ?? ''}
              onChange={(e) =>
                setSettings((s) => (s ? { ...s, banner_text: e.target.value } : s))
              }
              className="w-full rounded-xl bg-gray-50 ring-1 ring-gray-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 resize-none placeholder:text-gray-400"
            />
            <Button
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 rounded-lg gap-1.5"
              onClick={saveSettings}
              disabled={saving}
            >
              {saving ? <Loader2 className="size-3.5 animate-spin" /> : <Save className="size-3.5" />}
              Save
            </Button>
          </CardContent>
        </Card>

        {/* Menu management */}
        <Card className="ring-0 border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UtensilsCrossed className="size-4 text-emerald-600" />
                Menu Items
              </CardTitle>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg gap-1.5 text-xs"
                onClick={() => setShowNewItem(!showNewItem)}
              >
                <Plus className="size-3.5" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* New item form */}
            {showNewItem && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 space-y-3 animate-slide-up">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Name *"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="col-span-2 h-9 px-3 rounded-lg bg-white ring-1 ring-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-400"
                  />
                  <input
                    placeholder="Price *"
                    type="number"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="h-9 px-3 rounded-lg bg-white ring-1 ring-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-400"
                  />
                  <input
                    placeholder="Prep mins"
                    type="number"
                    value={newItem.prep_minutes}
                    onChange={(e) => setNewItem({ ...newItem, prep_minutes: e.target.value })}
                    className="h-9 px-3 rounded-lg bg-white ring-1 ring-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-400"
                  />
                  <input
                    placeholder="Category"
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="h-9 px-3 rounded-lg bg-white ring-1 ring-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-400"
                  />
                  <input
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    className="h-9 px-3 rounded-lg bg-white ring-1 ring-gray-200 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 rounded-lg gap-1.5"
                    onClick={addItem}
                  >
                    <Plus className="size-3.5" />
                    Add
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-lg"
                    onClick={() => setShowNewItem(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Item list */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-xl ring-1 ring-gray-100 transition-all ${
                    item.is_available ? 'bg-white' : 'bg-gray-50 opacity-60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    {item.image_url ? (
                      <ImageIcon className="size-4 text-emerald-500" />
                    ) : (
                      <UtensilsCrossed className="size-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="font-medium text-emerald-600">₹{item.price}</span>
                      <span>·</span>
                      <span>{item.prep_minutes}min</span>
                      <span>·</span>
                      <span>{item.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAvailability(item)}
                    className="shrink-0"
                    title={item.is_available ? 'Disable' : 'Enable'}
                  >
                    {item.is_available ? (
                      <ToggleRight className="size-6 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="size-6 text-gray-300" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteItem(item)}
                    className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
