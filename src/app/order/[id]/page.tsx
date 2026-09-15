import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Order } from '@/lib/types'
import { OrderTokenClient } from './order-token-client'

export const dynamic = 'force-dynamic'

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !order) return notFound()

  return <OrderTokenClient order={order as Order} />
}
