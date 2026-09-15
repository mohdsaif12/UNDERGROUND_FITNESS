import { createClient } from '@/lib/supabase/server'
import type { MenuItem } from '@/lib/types'
import { MenuClient } from './menu-client'

export const dynamic = 'force-dynamic'

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: items } = await supabase
    .from('menu_items')
    .select('*')
    .eq('is_available', true)
    .order('category')
    .order('sort_order')

  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 'main')
    .single()

  return (
    <MenuClient
      items={(items as MenuItem[]) ?? []}
      banner={settings?.banner_active ? settings.banner_text : null}
    />
  )
}
