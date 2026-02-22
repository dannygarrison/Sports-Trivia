// usePlayCount.js - call once on first player interaction
import { useRef } from 'react'

export function usePlayCount(gameId) {
  const recorded = useRef(false)
  function trackPlay() {
    if (recorded.current) return
    recorded.current = true
    import('./supabase.jsx').then(({ recordPlay }) => {
      recordPlay(gameId)
    })
  }
  return trackPlay
}
