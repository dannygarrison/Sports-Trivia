// usePlayCount.js - call once on first player interaction
import { useRef } from 'react'
import { recordPlay } from './supabase.jsx'

export function usePlayCount(gameId) {
  const recorded = useRef(false)

  function trackPlay() {
    if (recorded.current) return
    recorded.current = true
    recordPlay(gameId)
  }

  return trackPlay
}
