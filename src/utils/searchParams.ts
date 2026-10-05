import type { useSearchParams } from 'react-router-dom'

type SetSearchParams = ReturnType<typeof useSearchParams>[1]

// Clones the current search params, lets the caller mutate the clone, and
// commits it with `replace: true` so every filter/sort tweak doesn't pile up
// browser history entries.
export function updateSearchParams(setSearchParams: SetSearchParams, mutate: (next: URLSearchParams) => void) {
  setSearchParams((prev) => {
    const next = new URLSearchParams(prev)
    mutate(next)
    return next
  }, { replace: true })
}
