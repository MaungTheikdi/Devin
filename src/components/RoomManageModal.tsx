import { useMemo, useState } from 'react'
import type { MenuCategory, Room } from '../types'
import { useStore } from '../store/store'
import { useNow, useT } from '../lib/hooks'
import { categoryLabel } from '../i18n'
import { computeBill } from '../lib/billing'
import { formatDuration, formatMMK, formatTime } from '../lib/format'
import { Button, Modal } from './ui'
import { CheckoutModal } from './CheckoutModal'

const categoryOrder: MenuCategory[] = ['beer', 'drink', 'food', 'snack', 'other']

export function RoomManageModal({
  room,
  onClose,
}: {
  room: Room
  onClose: () => void
}) {
  const { state, addOrderItem, changeQty, removeOrderItem } = useStore()
  const t = useT()
  const now = useNow()
  const [checkingOut, setCheckingOut] = useState(false)
  const [activeCat, setActiveCat] = useState<MenuCategory>('beer')

  const bill = useMemo(
    () => computeBill(room, state.settings, now),
    [room, state.settings, now],
  )

  const menuByCat = useMemo(
    () => state.menu.filter((m) => m.available && m.category === activeCat),
    [state.menu, activeCat],
  )

  const items = room.session?.items ?? []
  const lang = state.settings.language

  return (
    <>
      <Modal
        open={!checkingOut}
        onClose={onClose}
        size="xl"
        title={
          <span className="flex items-center gap-3">
            {room.name}
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
              {room.type}
            </span>
          </span>
        }
      >
        <div className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
          {/* Menu picker */}
          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              {categoryOrder.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeCat === c
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {categoryLabel(t, c)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {menuByCat.map((m) => (
                <button
                  key={m.id}
                  onClick={() => addOrderItem(room.id, m)}
                  className="flex flex-col items-start rounded-lg border border-slate-700 bg-slate-800 p-3 text-left transition-colors hover:border-indigo-500 hover:bg-slate-700"
                >
                  <span className="text-sm font-medium text-white">
                    {lang === 'my' ? m.nameMy : m.name}
                  </span>
                  <span className="mt-1 text-xs text-indigo-300">
                    {formatMMK(m.price)}
                  </span>
                </button>
              ))}
              {menuByCat.length === 0 && (
                <p className="col-span-full py-6 text-center text-sm text-slate-500">
                  {t('noItems')}
                </p>
              )}
            </div>
          </div>

          {/* Order + bill */}
          <div className="flex flex-col rounded-xl border border-slate-700 bg-slate-800/50">
            <div className="border-b border-slate-700 px-4 py-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">{t('elapsed')}</span>
                <span className="font-mono text-lg font-semibold text-emerald-300">
                  {formatDuration(bill.durationMs)}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                <span>
                  {t('running')} {formatTime(room.session?.startedAt ?? now)}
                </span>
                <span>
                  {formatMMK(room.hourlyRate)}
                  {t('perHour')}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
                {t('orderItems')}
              </p>
              {items.length === 0 && (
                <p className="py-4 text-center text-sm text-slate-500">
                  {t('noItems')}
                </p>
              )}
              <ul className="space-y-2">
                {items.map((it) => (
                  <li
                    key={it.menuItemId}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">
                        {lang === 'my' ? it.nameMy : it.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatMMK(it.price)} × {it.qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => changeQty(room.id, it.menuItemId, -1)}
                        className="h-6 w-6 rounded bg-slate-700 text-white hover:bg-slate-600"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{it.qty}</span>
                      <button
                        onClick={() => changeQty(room.id, it.menuItemId, 1)}
                        className="h-6 w-6 rounded bg-slate-700 text-white hover:bg-slate-600"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeOrderItem(room.id, it.menuItemId)}
                        className="ml-1 text-slate-500 hover:text-rose-400"
                        aria-label={t('delete')}
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1.5 border-t border-slate-700 px-4 py-3 text-sm">
              <Row label={t('roomCharge')} value={formatMMK(bill.roomCharge)} />
              <Row label={t('itemsTotal')} value={formatMMK(bill.itemsTotal)} />
              <Row
                label={`${t('serviceCharge')} (${state.settings.serviceChargePct}%)`}
                value={formatMMK(bill.serviceCharge)}
              />
              <div className="mt-1 flex items-center justify-between border-t border-slate-700 pt-2">
                <span className="font-semibold text-white">{t('total')}</span>
                <span className="text-xl font-bold text-emerald-300">
                  {formatMMK(bill.total)}
                </span>
              </div>
              <Button
                variant="success"
                className="mt-2 w-full"
                onClick={() => setCheckingOut(true)}
              >
                {t('checkout')}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {checkingOut && (
        <CheckoutModal
          room={room}
          onCancel={() => setCheckingOut(false)}
          onDone={onClose}
        />
      )}
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200">{value}</span>
    </div>
  )
}
