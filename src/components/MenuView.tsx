import { useState } from 'react'
import type { MenuCategory, MenuItem } from '../types'
import { useStore } from '../store/store'
import { useT } from '../lib/hooks'
import { categoryLabel } from '../i18n'
import { formatMMK } from '../lib/format'
import { Button, Card, Field, inputClass, Modal } from './ui'

const categories: MenuCategory[] = ['beer', 'drink', 'food', 'snack', 'other']

type Draft = Omit<MenuItem, 'id'> & { id?: string }

const emptyDraft = (): Draft => ({
  name: '',
  nameMy: '',
  category: 'beer',
  price: 0,
  available: true,
})

export function MenuView() {
  const { state, addMenuItem, updateMenuItem, deleteMenuItem } = useStore()
  const t = useT()
  const [draft, setDraft] = useState<Draft | null>(null)
  const lang = state.settings.language

  const save = () => {
    if (!draft) return
    if (!draft.name.trim() && !draft.nameMy.trim()) return
    if (draft.id) {
      updateMenuItem(draft as MenuItem)
    } else {
      const { id: _omit, ...rest } = draft
      void _omit
      addMenuItem(rest)
    }
    setDraft(null)
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">{t('menu')}</h1>
        <Button onClick={() => setDraft(emptyDraft())}>+ {t('addItem')}</Button>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => {
          const items = state.menu.filter((m) => m.category === cat)
          if (items.length === 0) return null
          return (
            <div key={cat}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-400">
                {categoryLabel(t, cat)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((m) => (
                  <Card key={m.id} className="flex items-center justify-between p-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-white">
                        {lang === 'my' ? m.nameMy : m.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {lang === 'my' ? m.name : m.nameMy}
                      </p>
                      <p className="mt-0.5 text-sm text-indigo-300">
                        {formatMMK(m.price)}
                        {!m.available && (
                          <span className="ml-2 text-xs text-rose-400">
                            {t('unavailable')}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col gap-1">
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-xs"
                        onClick={() => setDraft({ ...m })}
                      >
                        {t('edit')}
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-2 py-1 text-xs text-rose-400"
                        onClick={() => deleteMenuItem(m.id)}
                      >
                        {t('delete')}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <Modal
        open={draft !== null}
        onClose={() => setDraft(null)}
        title={draft?.id ? t('editItem') : t('addItem')}
      >
        {draft && (
          <div className="space-y-3">
            <Field label={t('nameMy')}>
              <input
                className={inputClass}
                value={draft.nameMy}
                onChange={(e) => setDraft({ ...draft, nameMy: e.target.value })}
              />
            </Field>
            <Field label={t('name')}>
              <input
                className={inputClass}
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t('category')}>
                <select
                  className={inputClass}
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      category: e.target.value as MenuCategory,
                    })
                  }
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {categoryLabel(t, c)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={`${t('price')} (Ks)`}>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={draft.price}
                  onChange={(e) =>
                    setDraft({ ...draft, price: Number(e.target.value) })
                  }
                />
              </Field>
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={draft.available}
                onChange={(e) =>
                  setDraft({ ...draft, available: e.target.checked })
                }
              />
              {t('available_label')}
            </label>
            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setDraft(null)}
              >
                {t('cancel')}
              </Button>
              <Button variant="primary" className="flex-1" onClick={save}>
                {t('save')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
