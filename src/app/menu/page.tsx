import { createClient } from '@/lib/supabase/server'
import type { MenuItem } from '@/lib/types'
import { MenuClient } from './menu-client'

export const dynamic = 'force-dynamic'

const FALLBACK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Protein Shake',
    description: 'Whey protein, banana, milk',
    price: 350,
    prep_minutes: 3,
    category: 'Shakes & Smoothies',
    image_url: null,
    is_available: true,
    sort_order: 1,
  },
  {
    id: '2',
    name: 'Peanut Butter Banana Smoothie',
    description: 'Peanut butter, banana, oats, milk',
    price: 400,
    prep_minutes: 4,
    category: 'Shakes & Smoothies',
    image_url: null,
    is_available: true,
    sort_order: 2,
  },
  {
    id: '3',
    name: 'Grilled Chicken Sandwich',
    description: 'Grilled chicken breast, whole wheat bread, veggies',
    price: 550,
    prep_minutes: 12,
    category: 'Post-Workout Meals',
    image_url: null,
    is_available: true,
    sort_order: 1,
  },
  {
    id: '4',
    name: 'Egg White Omelette',
    description: '4 egg whites, spinach, mushrooms',
    price: 450,
    prep_minutes: 10,
    category: 'Post-Workout Meals',
    image_url: null,
    is_available: true,
    sort_order: 2,
  },
  {
    id: '5',
    name: 'Chicken & Rice Bowl',
    description: 'Grilled chicken, brown rice, steamed veggies',
    price: 650,
    prep_minutes: 15,
    category: 'Post-Workout Meals',
    image_url: null,
    is_available: true,
    sort_order: 3,
  },
  {
    id: '6',
    name: 'Greek Yogurt Bowl',
    description: 'Greek yogurt, honey, granola, berries',
    price: 380,
    prep_minutes: 5,
    category: 'Light Bites',
    image_url: null,
    is_available: true,
    sort_order: 1,
  },
  {
    id: '7',
    name: 'Boiled Eggs (2 pcs)',
    description: 'Simple, quick protein',
    price: 150,
    prep_minutes: 3,
    category: 'Light Bites',
    image_url: null,
    is_available: true,
    sort_order: 2,
  },
  {
    id: '8',
    name: 'Black Coffee',
    description: 'Freshly brewed',
    price: 200,
    prep_minutes: 3,
    category: 'Drinks',
    image_url: null,
    is_available: true,
    sort_order: 1,
  },
  {
    id: '9',
    name: 'Fresh Lime Water',
    description: 'Still or sparkling',
    price: 150,
    prep_minutes: 2,
    category: 'Drinks',
    image_url: null,
    is_available: true,
    sort_order: 2,
  },
]

export default async function MenuPage() {
  let items: MenuItem[] = []
  let banner: string | null = null

  try {
    const supabase = await createClient()

    const { data: menuData, error: itemsError } = await supabase
      .from('menu_items')
      .select('*')
      .eq('is_available', true)
      .order('category')
      .order('sort_order')

    if (!itemsError && menuData && menuData.length > 0) {
      items = menuData as MenuItem[]
    } else {
      items = FALLBACK_MENU_ITEMS
    }

    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'main')
      .maybeSingle()

    if (settings?.banner_active) {
      banner = settings.banner_text
    }
  } catch (err) {
    console.error('Error fetching menu items:', err)
    items = FALLBACK_MENU_ITEMS
  }

  return <MenuClient items={items} banner={banner} />
}

