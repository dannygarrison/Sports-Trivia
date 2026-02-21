// supabase.js - shared Supabase client
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://plemzelkftwubxoaiogx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsZW16ZWxrZnR3dWJ4b2Fpb2d4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3MDY2NzgsImV4cCI6MjA4NzI4MjY3OH0.oJEaWUu2hkZUIOAKRF5eS_Ou7-lhkVhpKqHpoLvOkCw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Call this once on first interaction to increment play count
export async function recordPlay(gameId) {
  await supabase.rpc('increment_play', { game_id_input: gameId })
}

// Fetch all play counts (for sorting on home page)
export async function fetchPlayCounts() {
  const { data, error } = await supabase
    .from('play_counts')
    .select('game_id, plays')
  if (error) return {}
  return Object.fromEntries(data.map(r => [r.game_id, r.plays]))
}
