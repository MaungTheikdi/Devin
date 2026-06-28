import type { OrderItem, Room, Settings } from '../types'

const HOUR_MS = 60 * 60 * 1000

/** Room charge for an elapsed duration, rounded to the nearest 100 Ks when prorated. */
export function computeRoomCharge(
  hourlyRate: number,
  durationMs: number,
  billWholeHour: boolean,
): number {
  if (durationMs <= 0) return 0
  if (billWholeHour) {
    const hours = Math.max(1, Math.ceil(durationMs / HOUR_MS))
    return hours * hourlyRate
  }
  const raw = (durationMs / HOUR_MS) * hourlyRate
  return Math.round(raw / 100) * 100
}

export function itemsTotal(items: OrderItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0)
}

export interface BillBreakdown {
  durationMs: number
  roomCharge: number
  itemsTotal: number
  subtotal: number
  serviceCharge: number
  total: number
}

export function computeBill(
  room: Room,
  settings: Settings,
  now: number,
): BillBreakdown {
  const startedAt = room.session?.startedAt ?? now
  const items = room.session?.items ?? []
  const durationMs = Math.max(0, now - startedAt)
  const roomCharge = computeRoomCharge(
    room.hourlyRate,
    durationMs,
    settings.billWholeHour,
  )
  const itTotal = itemsTotal(items)
  const subtotal = roomCharge + itTotal
  const serviceCharge = Math.round((subtotal * settings.serviceChargePct) / 100)
  const total = subtotal + serviceCharge
  return {
    durationMs,
    roomCharge,
    itemsTotal: itTotal,
    subtotal,
    serviceCharge,
    total,
  }
}
