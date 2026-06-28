import type { Lang } from '../types'
import { useStore } from '../store/store'
import { useT } from '../lib/hooks'
import { Button, Card, Field, inputClass } from './ui'

export function SettingsView() {
  const { state, updateSettings, resetData } = useStore()
  const t = useT()
  const s = state.settings

  return (
    <div className="max-w-xl">
      <h1 className="mb-5 text-2xl font-bold text-white">{t('settings')}</h1>

      <Card className="space-y-4 p-5">
        <Field label={t('shopName')}>
          <input
            className={inputClass}
            value={s.shopName}
            onChange={(e) => updateSettings({ shopName: e.target.value })}
          />
        </Field>

        <Field label={t('language')}>
          <select
            className={inputClass}
            value={s.language}
            onChange={(e) =>
              updateSettings({ language: e.target.value as Lang })
            }
          >
            <option value="my">မြန်မာ</option>
            <option value="en">English</option>
          </select>
        </Field>

        <Field label={t('serviceChargePct')}>
          <input
            type="number"
            min={0}
            max={100}
            className={inputClass}
            value={s.serviceChargePct}
            onChange={(e) =>
              updateSettings({ serviceChargePct: Number(e.target.value) })
            }
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={s.billWholeHour}
            onChange={(e) => updateSettings({ billWholeHour: e.target.checked })}
          />
          {t('billWholeHour')}
        </label>
      </Card>

      <Card className="mt-5 border-rose-500/30 p-5">
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm(t('resetConfirm'))) resetData()
          }}
        >
          {t('resetData')}
        </Button>
      </Card>
    </div>
  )
}
