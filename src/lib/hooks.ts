import { useEffect, useState } from 'react'
import { makeT } from '../i18n'
import { useStore } from '../store/store'

/** Returns the current timestamp, refreshed on an interval (default 1s). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}

/** Translation function bound to the current language setting. */
export function useT() {
  const { state } = useStore()
  return makeT(state.settings.language)
}
