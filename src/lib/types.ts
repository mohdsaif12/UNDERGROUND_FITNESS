export type MenuItem = {
  id: string
  name: string
  description: string | null
  price: number
  prep_minutes: number
  category: string
  image_url: string | null
  is_available: boolean
  sort_order: number
}

export type OrderStatus = 'new' | 'preparing' | 'completed'

export type OrderLineItem = {
  id: string
  name: string
  price: number
  quantity: number
  prep_minutes: number
}

export type Order = {
  id: string
  token_number: number
  customer_name: string
  customer_phone: string
  items: OrderLineItem[]
  total_amount: number
  status: OrderStatus
  estimated_ready_at: string | null
  created_at: string
  updated_at: string
}

export type Settings = {
  id: string
  banner_text: string
  banner_active: boolean
  updated_at: string
}
