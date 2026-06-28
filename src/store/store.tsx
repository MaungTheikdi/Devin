import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppState,
  MenuItem,
  PaymentMethod,
  Room,
  Sale,
  Settings,
} from '../types'
import { initialState } from '../data/seed'
import { computeBill } from '../lib/billing'

const STORAGE_KEY = 'ktv-pos-state-v1'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      rooms: parsed.rooms ?? initialState.rooms,
      menu: parsed.menu ?? initialState.menu,
      sales: parsed.sales ?? initialState.sales,
      settings: { ...initialState.settings, ...parsed.settings },
    }
  } catch {
    return initialState
  }
}

function newId(): string {
  return crypto.randomUUID()
}

interface Store {
  state: AppState
  openRoom: (roomId: string) => void
  addOrderItem: (roomId: string, item: MenuItem) => void
  changeQty: (roomId: string, menuItemId: string, delta: number) => void
  removeOrderItem: (roomId: string, menuItemId: string) => void
  checkout: (roomId: string, payment: PaymentMethod) => Sale | null
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void
  updateMenuItem: (item: MenuItem) => void
  deleteMenuItem: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  resetData: () => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const mapRoom = useCallback(
    (roomId: string, fn: (r: Room) => Room) =>
      setState((s) => ({
        ...s,
        rooms: s.rooms.map((r) => (r.id === roomId ? fn(r) : r)),
      })),
    [],
  )

  const openRoom = useCallback(
    (roomId: string) =>
      mapRoom(roomId, (r) =>
        r.status === 'occupied'
          ? r
          : {
              ...r,
              status: 'occupied',
              session: { id: newId(), startedAt: Date.now(), items: [] },
            },
      ),
    [mapRoom],
  )

  const addOrderItem = useCallback(
    (roomId: string, item: MenuItem) =>
      mapRoom(roomId, (r) => {
        if (!r.session) return r
        const existing = r.session.items.find(
          (i) => i.menuItemId === item.id,
        )
        const items = existing
          ? r.session.items.map((i) =>
              i.menuItemId === item.id ? { ...i, qty: i.qty + 1 } : i,
            )
          : [
              ...r.session.items,
              {
                menuItemId: item.id,
                name: item.name,
                nameMy: item.nameMy,
                price: item.price,
                qty: 1,
              },
            ]
        return { ...r, session: { ...r.session, items } }
      }),
    [mapRoom],
  )

  const changeQty = useCallback(
    (roomId: string, menuItemId: string, delta: number) =>
      mapRoom(roomId, (r) => {
        if (!r.session) return r
        const items = r.session.items
          .map((i) =>
            i.menuItemId === menuItemId
              ? { ...i, qty: i.qty + delta }
              : i,
          )
          .filter((i) => i.qty > 0)
        return { ...r, session: { ...r.session, items } }
      }),
    [mapRoom],
  )

  const removeOrderItem = useCallback(
    (roomId: string, menuItemId: string) =>
      mapRoom(roomId, (r) => {
        if (!r.session) return r
        return {
          ...r,
          session: {
            ...r.session,
            items: r.session.items.filter((i) => i.menuItemId !== menuItemId),
          },
        }
      }),
    [mapRoom],
  )

  const checkout = useCallback(
    (roomId: string, payment: PaymentMethod): Sale | null => {
      const room = state.rooms.find((r) => r.id === roomId)
      if (!room || !room.session) return null
      const now = Date.now()
      const bill = computeBill(room, state.settings, now)
      const sale: Sale = {
        id: newId(),
        roomId: room.id,
        roomName: room.name,
        startedAt: room.session.startedAt,
        endedAt: now,
        durationMs: bill.durationMs,
        hourlyRate: room.hourlyRate,
        roomCharge: bill.roomCharge,
        items: room.session.items,
        itemsTotal: bill.itemsTotal,
        subtotal: bill.subtotal,
        serviceChargePct: state.settings.serviceChargePct,
        serviceCharge: bill.serviceCharge,
        total: bill.total,
        paymentMethod: payment,
      }
      setState((s) => ({
        ...s,
        sales: [sale, ...s.sales],
        rooms: s.rooms.map((r) =>
          r.id === roomId
            ? { ...r, status: 'available', session: null }
            : r,
        ),
      }))
      return sale
    },
    [state.rooms, state.settings],
  )

  const addMenuItem = useCallback(
    (item: Omit<MenuItem, 'id'>) =>
      setState((s) => ({
        ...s,
        menu: [...s.menu, { ...item, id: newId() }],
      })),
    [],
  )

  const updateMenuItem = useCallback(
    (item: MenuItem) =>
      setState((s) => ({
        ...s,
        menu: s.menu.map((m) => (m.id === item.id ? item : m)),
      })),
    [],
  )

  const deleteMenuItem = useCallback(
    (id: string) =>
      setState((s) => ({ ...s, menu: s.menu.filter((m) => m.id !== id) })),
    [],
  )

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      setState((s) => ({ ...s, settings: { ...s.settings, ...patch } })),
    [],
  )

  const resetData = useCallback(() => setState(initialState), [])

  const value = useMemo<Store>(
    () => ({
      state,
      openRoom,
      addOrderItem,
      changeQty,
      removeOrderItem,
      checkout,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateSettings,
      resetData,
    }),
    [
      state,
      openRoom,
      addOrderItem,
      changeQty,
      removeOrderItem,
      checkout,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      updateSettings,
      resetData,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): Store {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
