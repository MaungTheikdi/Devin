import { useState } from 'react'
import type { Sale } from '../types'
import { useStore } from '../store/store'
import { useT } from '../lib/hooks'
import { paymentLabel } from '../i18n'
import { formatDateTime, formatDuration, formatMMK } from '../lib/format'
import { Button, Card, Modal } from './ui'
import { Receipt } from './Receipt'

export function SalesView() {
  const { state } = useStore()
  const t = useT()
  const [viewing, setViewing] = useState<Sale | null>(null)
  const lang = state.settings.language

  const totalRevenue = state.sales.reduce((sum, s) => sum + s.total, 0)

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('sales')}</h1>
        <div className="text-right">
          <p className="text-xs text-slate-400">{t('totalRevenue')}</p>
          <p className="text-xl font-bold text-emerald-300">
            {formatMMK(totalRevenue)}
          </p>
        </div>
      </div>

      {state.sales.length === 0 ? (
        <Card className="p-8 text-center text-slate-500">{t('noSales')}</Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3">{t('date')}</th>
                <th className="px-4 py-3">{t('room')}</th>
                <th className="px-4 py-3">{t('duration')}</th>
                <th className="px-4 py-3">{t('paymentMethod')}</th>
                <th className="px-4 py-3 text-right">{t('total')}</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {state.sales.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40"
                >
                  <td className="px-4 py-3 text-slate-300">
                    {formatDateTime(s.endedAt, lang)}
                  </td>
                  <td className="px-4 py-3 text-white">{s.roomName}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {formatDuration(s.durationMs)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {paymentLabel(t, s.paymentMethod)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-white">
                    {formatMMK(s.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="ghost"
                      className="px-2 py-1 text-xs"
                      onClick={() => setViewing(s)}
                    >
                      {t('view')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal
        open={viewing !== null}
        onClose={() => setViewing(null)}
        title={t('receipt')}
      >
        {viewing && (
          <Receipt sale={viewing} onClose={() => setViewing(null)} />
        )}
      </Modal>
    </div>
  )
}
