import { useState } from 'react'
import type { PaymentMethod, Room, Sale } from '../types'
import { useStore } from '../store/store'
import { useT } from '../lib/hooks'
import { paymentLabel } from '../i18n'
import { Button, Modal } from './ui'
import { Receipt } from './Receipt'

const methods: PaymentMethod[] = ['cash', 'kpay', 'wave', 'card']

export function CheckoutModal({
  room,
  onCancel,
  onDone,
}: {
  room: Room
  onCancel: () => void
  onDone: () => void
}) {
  const { checkout } = useStore()
  const t = useT()
  const [payment, setPayment] = useState<PaymentMethod>('cash')
  const [sale, setSale] = useState<Sale | null>(null)

  const confirm = () => {
    const result = checkout(room.id, payment)
    if (result) setSale(result)
  }

  if (sale) {
    return (
      <Modal open onClose={onDone} title={t('receipt')} size="md">
        <Receipt sale={sale} onClose={onDone} />
      </Modal>
    )
  }

  return (
    <Modal open onClose={onCancel} title={t('checkout')} size="md">
      <p className="mb-3 text-sm text-slate-400">{t('paymentMethod')}</p>
      <div className="grid grid-cols-2 gap-2">
        {methods.map((m) => (
          <button
            key={m}
            onClick={() => setPayment(m)}
            className={`rounded-lg border px-3 py-3 text-sm font-medium transition-colors ${
              payment === m
                ? 'border-indigo-500 bg-indigo-600/20 text-white'
                : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {paymentLabel(t, m)}
          </button>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>
          {t('cancel')}
        </Button>
        <Button variant="success" className="flex-1" onClick={confirm}>
          {t('confirmCheckout')}
        </Button>
      </div>
    </Modal>
  )
}
