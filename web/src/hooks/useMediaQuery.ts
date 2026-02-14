import { useSyncExternalStore } from "react"
import { breakpoints } from "../configs"

type BreakpointKey = keyof typeof breakpoints

function createMediaQueryStore(query: string) {
  function subscribe(callback: () => void) {
    const mql = window.matchMedia(query)
    mql.addEventListener("change", callback)
    return () => mql.removeEventListener("change", callback)
  }

  function getSnapshot() {
    return window.matchMedia(query).matches
  }

  function getServerSnapshot() {
    return false
  }

  return { subscribe, getSnapshot, getServerSnapshot }
}

const storeCache = new Map<
  string,
  ReturnType<typeof createMediaQueryStore>
>()

function getStore(query: string) {
  const cached = storeCache.get(query)
  if (cached) return cached

  const store = createMediaQueryStore(query)
  storeCache.set(query, store)
  return store
}

export function useMediaQuery(key: BreakpointKey): boolean {
  const query = `(min-width: ${breakpoints[key]}px)`
  const store = getStore(query)

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  )
}
