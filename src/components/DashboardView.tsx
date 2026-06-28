import { useMemo } from 'react'
import { useStore } from '../store/store'
import { useNow, useT } from '../lib/hooks'
import { computeBill } from '../lib/billing'
import {
  formatDuration,
  formatMMK,
  formatTime,
  isSameDay,
} from '../lib/format'
import { Card } from './ui'

export function DashboardView() {
  const { state } = useStore()
  const t = useT()
  const now = useNow()

  const occupiedRooms = state.rooms.filter((r) => r.status === 'occupied')

  const todaySales = useMemo(
    () => state.sales.filter((s) => isSameDay(s.endedAt, now)),
    [state.sales, now],
  )
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)
  const liveTotal = occupiedRooms.reduce(
    (sum, r) => sum + computeBill(r, state.settings, now).total,
    0,
  )

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-white">{t('dashboard')}</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label={t('roomsOccupied')}
          value={`${occupiedRooms.length} / ${state.rooms.length}`}
          accent="text-emerald-300"
        />
        <Stat
          label={t('todaySales')}
          value={formatMMK(todayTotal)}
          accent="text-indigo-300"
        />
        <Stat
          label={t('todayBills')}
          value={`${todaySales.length}`}
          accent="text-sky-300"
        />
        <Stat
          label={t('liveRoomCharge')}
          value={formatMMK(liveTotal)}
          accent="text-amber-300"
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 font-semibold text-white">{t('occupied')}</h2>
          {occupiedRooms.length === 0 && (
            <p className="py-4 text-sm text-slate-500">
              {t('emptyRoomsTitle')}
            </p>
          )}
          <ul className="space-y-2">
            {occupiedRooms.map((r) => {
              const bill = computeBill(r, state.settings, now)
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-white">{r.name}</p>
                    <p className="text-xs text-slate-400">
                      {t('running')} {formatTime(r.session?.startedAt ?? now)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm text-emerald-300">
                      {formatDuration(bill.durationMs)}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {formatMMK(bill.total)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 font-semibold text-white">{t('recentSales')}</h2>
          {state.sales.length === 0 && (
            <p className="py-4 text-sm text-slate-500">{t('noSales')}</p>
          )}
          <ul className="space-y-2">
            {state.sales.slice(0, 6).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2"
              >
                <div>
                  <p className="font-medium text-white">{s.roomName}</p>
                  <p className="text-xs text-slate-400">
                    {formatTime(s.endedAt)} · {formatDuration(s.durationMs)}
                  </p>
                </div>
                <span className="font-semibold text-white">
                  {formatMMK(s.total)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent: string
}) {
  return (
    <Card className="p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent}`}>{value}</p>
    </Card>
  )
}
