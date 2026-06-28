import { useState, type ReactNode } from 'react'
import { useT } from './lib/hooks'
import { useStore } from './store/store'
import { DashboardView } from './components/DashboardView'
import { RoomsView } from './components/RoomsView'
import { MenuView } from './components/MenuView'
import { SalesView } from './components/SalesView'
import { SettingsView } from './components/SettingsView'

type Page = 'dashboard' | 'rooms' | 'menu' | 'sales' | 'settings'

const icons: Record<Page, ReactNode> = {
  dashboard: <Icon path="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />,
  rooms: <Icon path="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M4 21h16M4 21H2m18 0h2M9 7h.01M9 11h.01M9 15h.01" />,
  menu: <Icon path="M4 6h16M4 12h16M4 18h10" />,
  sales: <Icon path="M3 3v18h18M7 14l3-3 3 3 5-5" />,
  settings: <Icon path="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.2-1.8l2-1.6-2-3.4-2.4 1a8 8 0 0 0-3-1.8L14 1h-4l-.4 2.6a8 8 0 0 0-3 1.8l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12c0 .6 0 1.2.2 1.8l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 3 1.8L10 23h4l.4-2.6a8 8 0 0 0 3-1.8l2.4 1 2-3.4-2-1.6c.2-.6.2-1.2.2-1.8Z" />,
}

export default function App() {
  const t = useT()
  const { state } = useStore()
  const [page, setPage] = useState<Page>('dashboard')

  const pages: Page[] = ['dashboard', 'rooms', 'menu', 'sales', 'settings']

  return (
    <div className="flex min-h-full">
      <aside className="flex w-16 flex-col items-center gap-1 border-r border-slate-800 bg-slate-900/80 py-4 sm:w-56 sm:items-stretch sm:px-3">
        <div className="mb-4 flex items-center justify-center gap-2 px-2 sm:justify-start">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
            K
          </div>
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold text-white">
              {state.settings.shopName}
            </p>
            <p className="text-xs text-slate-500">{t('appName')}</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                page === p
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="shrink-0">{icons[p]}</span>
              <span className="hidden sm:inline">{t(p)}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        {page === 'dashboard' && <DashboardView />}
        {page === 'rooms' && <RoomsView />}
        {page === 'menu' && <MenuView />}
        {page === 'sales' && <SalesView />}
        {page === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}

function Icon({ path }: { path: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}
