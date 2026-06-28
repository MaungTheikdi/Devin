import { useState } from 'react'
import type { Room } from '../types'
import { useStore } from '../store/store'
import { useNow, useT } from '../lib/hooks'
import { computeBill } from '../lib/billing'
import { formatDuration, formatMMK } from '../lib/format'
import { Button, Card } from './ui'
import { RoomManageModal } from './RoomManageModal'

export function RoomsView() {
  const { state, openRoom } = useStore()
  const t = useT()
  const now = useNow()
  const [manageId, setManageId] = useState<string | null>(null)

  const managed = state.rooms.find((r) => r.id === manageId) ?? null

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold text-white">{t('rooms')}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {state.rooms.map((room) => (
          <RoomCard
            key={room.id}
            room={room}
            now={now}
            onOpen={() => openRoom(room.id)}
            onManage={() => setManageId(room.id)}
          />
        ))}
      </div>

      {managed && (
        <RoomManageModal room={managed} onClose={() => setManageId(null)} />
      )}
    </div>
  )
}

function RoomCard({
  room,
  now,
  onOpen,
  onManage,
}: {
  room: Room
  now: number
  onOpen: () => void
  onManage: () => void
}) {
  const { state } = useStore()
  const t = useT()
  const occupied = room.status === 'occupied'
  const bill = occupied ? computeBill(room, state.settings, now) : null
  const itemCount = room.session?.items.reduce((n, i) => n + i.qty, 0) ?? 0

  return (
    <Card
      className={`overflow-hidden ${
        occupied ? 'ring-1 ring-emerald-500/40' : ''
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{room.name}</h3>
          <p className="text-xs text-slate-400">
            {room.type} · {formatMMK(room.hourlyRate)}
            {t('perHour')}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            occupied
              ? 'bg-emerald-500/20 text-emerald-300'
              : 'bg-slate-600/40 text-slate-300'
          }`}
        >
          {occupied ? t('occupied') : t('available')}
        </span>
      </div>

      <div className="px-4 py-4">
        {occupied && bill ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t('elapsed')}</span>
              <span className="font-mono text-base font-semibold text-emerald-300">
                {formatDuration(bill.durationMs)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{t('total')}</span>
              <span className="text-base font-bold text-white">
                {formatMMK(bill.total)}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t('order')}: {itemCount}
            </p>
          </div>
        ) : (
          <p className="py-2 text-sm text-slate-500">{t('available')}</p>
        )}
      </div>

      <div className="px-4 pb-4">
        {occupied ? (
          <Button variant="primary" className="w-full" onClick={onManage}>
            {t('manage')}
          </Button>
        ) : (
          <Button variant="success" className="w-full" onClick={onOpen}>
            {t('openRoom')}
          </Button>
        )}
      </div>
    </Card>
  )
}
