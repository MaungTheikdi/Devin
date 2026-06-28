export type Lang = 'my' | 'en'

export type RoomStatus = 'available' | 'occupied'

export type MenuCategory = 'beer' | 'drink' | 'food' | 'snack' | 'other'

export interface MenuItem {
  id: string
  name: string
  nameMy: string
  category: MenuCategory
  price: number
  available: boolean
}

export interface OrderItem {
  menuItemId: string
  name: string
  nameMy: string
  price: number
  qty: number
}

export interface RoomSession {
  id: string
  startedAt: number
  items: OrderItem[]
}

export interface Room {
  id: string
  name: string
  type: string
  hourlyRate: number
  status: RoomStatus
  session: RoomSession | null
}

export type PaymentMethod = 'cash' | 'kpay' | 'wave' | 'card'

export interface Sale {
  id: string
  roomId: string
  roomName: string
  startedAt: number
  endedAt: number
  durationMs: number
  hourlyRate: number
  roomCharge: number
  items: OrderItem[]
  itemsTotal: number
  subtotal: number
  serviceChargePct: number
  serviceCharge: number
  total: number
  paymentMethod: PaymentMethod
}

export interface Settings {
  shopName: string
  serviceChargePct: number
  /** Round the room charge up to whole started hours instead of prorating by the minute. */
  billWholeHour: boolean
  language: Lang
}

export interface AppState {
  rooms: Room[]
  menu: MenuItem[]
  sales: Sale[]
  settings: Settings
}
