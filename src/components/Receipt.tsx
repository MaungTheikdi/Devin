import type { Sale } from '../types'
import { useStore } from '../store/store'
import { useT } from '../lib/hooks'
import { paymentLabel } from '../i18n'
import { formatDateTime, formatDuration, formatMMK } from '../lib/format'
import { Button } from './ui'

export function Receipt({ sale, onClose }: { sale: Sale; onClose: () => void }) {
  const { state } = useStore()
  const t = useT()
  const lang = state.settings.language

  return (
    <div>
      <div
        id="receipt-print"
        className="rounded-xl border border-slate-700 bg-white p-5 text-slate-900"
      >
        <div className="text-center">
          <h3 className="text-lg font-bold">{state.settings.shopName}</h3>
          <p className="text-xs text-slate-500">KTV / Karaoke</p>
        </div>
        <div className="my-3 border-t border-dashed border-slate-300" />
        <div className="space-y-1 text-sm">
          <Line label={t('room')} value={`${sale.roomName}`} />
          <Line label={t('date')} value={formatDateTime(sale.endedAt, lang)} />
          <Line
            label={t('duration')}
            value={formatDuration(sale.durationMs)}
          />
        </div>
        <div className="my-3 border-t border-dashed border-slate-300" />

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="pb-1">{t('order')}</th>
              <th className="pb-1 text-center">{t('qty')}</th>
              <th className="pb-1 text-right">{t('total')}</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((it) => (
              <tr key={it.menuItemId}>
                <td className="py-0.5">{lang === 'my' ? it.nameMy : it.name}</td>
                <td className="py-0.5 text-center">{it.qty}</td>
                <td className="py-0.5 text-right">
                  {formatMMK(it.price * it.qty)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="my-3 border-t border-dashed border-slate-300" />
        <div className="space-y-1 text-sm">
          <Line label={t('roomCharge')} value={formatMMK(sale.roomCharge)} />
          <Line label={t('itemsTotal')} value={formatMMK(sale.itemsTotal)} />
          <Line label={t('subtotal')} value={formatMMK(sale.subtotal)} />
          <Line
            label={`${t('serviceCharge')} (${sale.serviceChargePct}%)`}
            value={formatMMK(sale.serviceCharge)}
          />
        </div>
        <div className="my-2 border-t border-slate-400" />
        <div className="flex items-center justify-between text-base font-bold">
          <span>{t('total')}</span>
          <span>{formatMMK(sale.total)}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
          <span>{t('paymentMethod')}</span>
          <span>{paymentLabel(t, sale.paymentMethod)}</span>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          Thank you! ကျေးဇူးတင်ပါသည်။
        </p>
      </div>

      <div className="mt-4 flex gap-2 print:hidden">
        <Button variant="secondary" className="flex-1" onClick={onClose}>
          {t('close')}
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={() => window.print()}
        >
          {t('print')}
        </Button>
      </div>
    </div>
  )
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
