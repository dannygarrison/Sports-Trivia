import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
import { useState, useRef, useEffect } from 'react'

const SPORT_META = {
  ALL:     { label: 'All',      accent: '#c8a050' },
  NFL:     { label: 'NFL',      accent: '#e74c3c' },
  NBA:     { label: 'NBA',      accent: '#e67e22' },
  MLB:     { label: 'MLB',      accent: '#3498db' },
  SOCCER:  { label: 'Soccer',   accent: '#27ae60' },
  OLYMPICS:{ label: 'Olympics', accent: '#9b59b6' },
}

const GAMES = [
  {
    id: 'nfl-college-trivia',
    path: '/games/nfl-college-trivia',
    title: 'NFL Alma Maters',
    sport: 'NFL',
    description: 'Name the college for each NFL player. How long can you streak?',
    tag: 'STREAKS',
    available: true,
    dateAdded: 1,
    plays: 500,
  },
  {
    id: 'super-bowl-history',
    path: '/games/super-bowl-history',
    title: 'Super Bowl History',
    sport: 'NFL',
    description: 'Name the winner, loser, and MVP for all 60 Super Bowls.',
    tag: 'COMPLETE THE SET',
    available: true,
    dateAdded: 2,
    plays: 300,
  },
  {
    id: 'nfl-name-dump',
    path: '/games/nfl-name-dump',
    title: 'Just Naming Dudes',
    sport: 'NFL',
    description: 'Just name as many NFL players as you can.',
    tag: 'FREE RECALL',
    available: true,
    dateAdded: 3,
    plays: 400,
  },
  {
    id: 'nfl-chain',
    path: '/games/nfl-chain',
    title: 'Complete The Chain',
    sport: 'NFL',
    description: 'Link all 32 NFL teams through players and colleges. No repeats allowed.',
    tag: 'CHAIN GAME',
    available: true,
    dateAdded: 9,
    plays: 100,
  },
  {
    id: 'nba-scorers-grid',
    path: '/games/nba-scorers-grid',
    title: 'All-Time Scorers',
    sport: 'NBA',
    description: 'Name the top 5 all-time scorers for all 30 NBA franchises.',
    tag: 'COMPLETE THE SET',
    available: true,
    dateAdded: 4,
    plays: 250,
  },
  {
    id: 'world-series-history',
    path: '/games/world-series-history',
    title: 'World Series History',
    sport: 'MLB',
    description: 'Name the winner, loser, and MVP for every World Series since 1903.',
    tag: 'COMPLETE THE SET',
    available: true,
    dateAdded: 5,
    plays: 150,
  },
  {
    id: 'soccer-trivia',
    path: '/games/soccer-leagues-trivia',
    title: 'Top 5 Leagues',
    sport: 'SOCCER',
    description: 'Name all 96 teams across the EPL, La Liga, Bundesliga, Serie A, and Ligue 1.',
    tag: 'FILL IN THE BLANK',
    available: true,
    dateAdded: 6,
    plays: 200,
  },
  {
    id: 'mls-teams',
    path: '/games/mls-teams',
    title: 'MLS Teams',
    sport: 'SOCCER',
    description: 'Name all 30 Major League Soccer clubs across the Eastern and Western Conferences.',
    tag: 'FILL IN THE BLANK',
    available: true,
    dateAdded: 7,
    plays: 175,
  },
  {
    id: 'pl-teams',
    path: '/games/pl-teams',
    title: 'All-Time Premier League Teams',
    sport: 'SOCCER',
    description: 'Name all 51 clubs that have ever played in the Premier League since 1992.',
    tag: 'FILL IN THE BLANK',
    available: true,
    dateAdded: 8,
    plays: 125,
  },
  {
    id: 'olympics-host-cities',
    path: '/games/olympics-host-cities',
    title: 'Olympic Host Cities',
    sport: 'OLYMPICS',
    description: 'Name all 55 cities that have hosted the Summer and Winter Olympic Games.',
    tag: 'FILL IN THE BLANK',
    available: true,
    dateAdded: 10,
    plays: 0,
  },
  {
    id: 'nfl-mock-draft',
    path: '/games/nfl-mock-draft',
    title: 'Build Your Own Mock Draft',
    sport: 'NFL',
    description: 'Use pick suggestions and the big board to create a shareable 2026 NFL Draft 1st round mock.',
    tag: 'MOCK DRAFT',
    available: true,
    dateAdded: 11,
    plays: 0,
  },
]

function GameCard({ game, index, playCount }) {
  const [hovered, setHovered] = useState(false)
  const accent = SPORT_META[game.sport].accent

  const inner = (
    <div style={{
      background: hovered ? 'linear-gradient(135deg,#0e0e1e,#111126)' : 'linear-gradient(135deg,#0a0a18,#0d0d1f)',
      border: `1px solid ${hovered ? accent + '44' : '#ffffff0a'}`,
      borderRadius: 16, padding: '26px 24px',
      transition: 'all 0.22s ease',
      transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: hovered ? `0 16px 40px ${accent}18, 0 4px 12px #00000066` : '0 2px 8px #00000044',
      position: 'relative', overflow: 'hidden', height: '100%',
    }}>
      <div style={{
        position: 'absolute', top: -20, left: -20, width: 120, height: 120,
        borderRadius: '50%', background: accent, opacity: hovered ? 0.07 : 0.03,
        filter: 'blur(30px)', transition: 'opacity 0.3s', pointerEvents: 'none',
      }} />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, fontFamily: "'Oswald', sans-serif",
          letterSpacing: 3, textTransform: 'uppercase',
          color: accent, background: accent + '18', padding: '3px 8px', borderRadius: 4,
        }}>{game.sport}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, fontFamily: "'Oswald', sans-serif",
          letterSpacing: 2.5, textTransform: 'uppercase', color: '#ffffff22',
        }}>{game.tag}</span>
      </div>
      <h3 style={{
        fontSize: 21, fontWeight: 900, fontFamily: "'Oswald', sans-serif",
        letterSpacing: 1, textTransform: 'uppercase',
        color: hovered ? '#ffffff' : '#ddddee',
        margin: '0 0 8px', lineHeight: 1.1, transition: 'color 0.2s',
      }}>{game.title}</h3>
      <p style={{ fontSize: 13, color: '#c8a050', lineHeight: 1.6, margin: 0, fontFamily: 'Georgia, serif' }}>
        {game.description}
      </p>
      {playCount > 0 && (
        <div style={{
          marginTop: 12, fontSize: 10, fontWeight: 700,
          fontFamily: "'Oswald', sans-serif", letterSpacing: 2,
          color: '#ffffff28', textTransform: 'uppercase',
        }}>
          🎮 {playCount.toLocaleString()} plays
        </div>
      )}
      {game.available && (
        <div style={{
          marginTop: 18, display: 'flex', alignItems: 'center', gap: 6,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'all 0.22s ease',
        }}>
          <span style={{
            fontSize: 11, fontWeight: 800, fontFamily: "'Oswald', sans-serif",
            letterSpacing: 3, textTransform: 'uppercase', color: accent,
          }}>Play Now →</span>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ animation: 'fadeUp 0.45s ease both', animationDelay: `${index * 0.07}s` }}>
      {game.available
        ? <Link to={game.path} style={{ textDecoration: 'none', display: 'block', height: '100%' }}
            onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {inner}
          </Link>
        : <div style={{ cursor: 'default', opacity: 0.42, height: '100%' }}>{inner}</div>
      }
    </div>
  )
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [search, setSearch] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [sortBy, setSortBy] = useState('popular')
  const [playCounts, setPlayCounts] = useState({})
  const inputRef = useRef(null)

  useEffect(() => {
    import('./supabase.jsx').then(({ fetchPlayCounts }) => {
      fetchPlayCounts().then(counts => setPlayCounts(counts))
    })
  }, [])

  function sortGames(games) {
    if (sortBy === 'newest') return [...games].sort((a, b) => b.dateAdded - a.dateAdded)
    if (sortBy === 'popular') return [...games].sort((a, b) => (playCounts[b.id] ?? b.plays) - (playCounts[a.id] ?? a.plays))
    return games
  }

  const SPORT_ALIASES = {
    NFL: ['football', 'nfl', 'american football'],
    NBA: ['basketball', 'nba', 'hoops'],
    MLB: ['baseball', 'mlb'],
    SOCCER: ['soccer', 'football', 'futbol', 'mls', 'premier league', 'epl'],
    OLYMPICS: ['olympics', 'olympic'],
  }

  const filteredGames = sortGames(GAMES.filter(g => {
    const matchesSport = activeTab === 'ALL' || g.sport === activeTab
    const q = search.toLowerCase()
    const sportAliasMatch = Object.entries(SPORT_ALIASES).some(([sport, aliases]) =>
      g.sport === sport && aliases.some(alias => alias.includes(q) || q.includes(alias))
    )
    const matchesSearch = g.title.toLowerCase().includes(q) ||
      g.sport.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      sportAliasMatch
    return matchesSport && matchesSearch
  }))

  const sports = ['NFL', 'NBA', 'MLB', 'SOCCER', 'OLYMPICS']
  const groupedBySport = sports.map(sport => ({
    sport,
    games: filteredGames.filter(g => g.sport === sport),
  })).filter(s => s.games.length > 0)

  const showGrouped = false

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', fontFamily: "'Oswald', sans-serif", paddingTop: 56 }}>
      <Helmet>
        <title>TrivialSports – Free Sports Trivia Games for NFL, NBA & Soccer</title>
        <meta name="description" content="Test your sports knowledge with free trivia games covering the NFL, NBA, Premier League, MLS, MLB, Olympics, and more. Play now at TrivialSports." />
        <meta property="og:title" content="TrivialSports – Free Sports Trivia Games for NFL, NBA & Soccer" />
        <meta property="og:description" content="Test your sports knowledge with free trivia games covering the NFL, NBA, Premier League, MLS, MLB, Olympics, and more. Play now at TrivialSports." />
        <meta property="og:url" content="https://trivialsports.com" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heroIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.7; } }
        @media (max-width: 600px) { .hero-grid { display: none !important; } }
        input[type=text]::placeholder { color: #ffffff28; }
        input[type=text]:focus { outline: none; }
        .tab-btn:hover { background: rgba(255,255,255,0.06) !important; color: #ffffff88 !important; }
        .sport-label:hover { background: rgba(200,160,80,0.22) !important; }
        select option { background: #0e0e22; }
      `}</style>

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '28px 28px 20px', textAlign: 'center', borderBottom: '1px solid #ffffff06' }}>
        <div className="hero-grid" style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(200,160,80,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(200,160,80,0.018) 1px, transparent 1px)`,
          backgroundSize: '48px 48px', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 600, height: 300, background: 'radial-gradient(ellipse, #c8a05010 0%, transparent 70%)',
          pointerEvents: 'none', animation: 'pulse 4s ease infinite',
        }} />
        <div style={{ position: 'relative', animation: 'heroIn 0.55s ease both', maxWidth: 600, margin: '0 auto' }}>
          <picture>
            <source srcSet="/ts_logo_blueoutline_420.webp" type="image/webp" />
            <img
              src="/ts_logo_blueoutline_420.png"
              alt="Trivial Sports Logo"
              width="120"
              height="120"
              style={{ width: 120, display: 'block', margin: '0 auto 8px' }}
            />
          </picture>
          <svg viewBox="0 0 520 90" style={{ width: 'clamp(300px, 70vw, 520px)', display: 'block', margin: '0 auto 16px', overflow: 'visible' }}>
            <defs>
              <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f0d070" />
                <stop offset="100%" stopColor="#5bb8f5" />
              </linearGradient>
            </defs>
            <text x="50%" y="78" textAnchor="middle" fontFamily="'Oswald', sans-serif" fontWeight="900" fontSize="82" letterSpacing="-1" fill="url(#goldGrad)">TRIVIAL SPORTS</text>
          </svg>
          {/* Search bar in hero */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: searchFocused ? '#0e0e22' : '#0c0c1e',
            border: `1px solid ${searchFocused ? '#c8a05066' : '#ffffff18'}`,
            borderRadius: 12, padding: '10px 18px',
            transition: 'all 0.2s ease',
            maxWidth: 400, margin: '0 auto',
            boxShadow: searchFocused ? '0 0 0 3px #c8a05018' : 'none',
          }}>
            <span style={{ color: '#ffffff44', fontSize: 16, lineHeight: 1 }}>⌕</span>
            <input
              type="text"
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search games..."
              style={{
                background: 'transparent', border: 'none', color: '#ffffff',
                fontSize: 15, fontFamily: "'Oswald', sans-serif",
                fontWeight: 600, letterSpacing: 1.5, width: '100%',
                outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c8a05099', fontSize: 14, padding: 0, lineHeight: 1 }}>✕</button>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '14px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        {/* Sport tabs */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(SPORT_META).map(([key, meta]) => {
            const isActive = activeTab === key
            return (
              <button key={key} className="tab-btn" onClick={() => setActiveTab(key)} style={{
                fontSize: 11, fontWeight: 800, fontFamily: "'Oswald', sans-serif",
                letterSpacing: 2.5, textTransform: 'uppercase',
                padding: '7px 16px', borderRadius: 8, cursor: 'pointer',
                border: `1px solid ${isActive ? meta.accent + '55' : '#ffffff10'}`,
                background: isActive ? meta.accent + '18' : 'transparent',
                color: isActive ? meta.accent : '#ffffff44',
                transition: 'all 0.18s ease',
              }}>
                {meta.label}
              </button>
            )
          })}
        </div>

        {/* Sort only */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={{
            background: '#0a0a18', border: '1px solid #ffffff10',
            borderRadius: 10, padding: '8px 14px',
            color: '#ffffff66', fontSize: 12,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 600, letterSpacing: 1,
            cursor: 'pointer', outline: 'none',
          }}
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      {/* Games */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '12px 28px 48px' }}>
        {filteredGames.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#c8a05066', fontFamily: 'Georgia, serif', fontSize: 14 }}>
            No games found for "{search}"
          </div>
        ) : showGrouped ? (
          groupedBySport.map((section, si) => (
            <div key={section.sport} style={{ marginBottom: 28, animation: 'fadeUp 0.45s ease both', animationDelay: `${si * 0.08}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <button
                  className="sport-label"
                  onClick={() => setActiveTab(section.sport)}
                  style={{
                    fontSize: 10, fontWeight: 800, cursor: 'pointer',
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: 4, textTransform: 'uppercase',
                    color: SPORT_META[section.sport].accent,
                    background: SPORT_META[section.sport].accent + '14',
                    border: `1px solid ${SPORT_META[section.sport].accent}28`,
                    padding: '4px 12px', borderRadius: 5, transition: 'background 0.18s',
                  }}
                >
                  {SPORT_META[section.sport].label}
                </button>
                <div style={{ flex: 1, height: 1, background: '#ffffff07' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
                {section.games.map((game, i) => <GameCard key={game.id} game={game} index={i} playCount={playCounts[game.id] ?? game.plays} />)}
              </div>
            </div>
          ))
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filteredGames.map((game, i) => <GameCard key={game.id} game={game} index={i} playCount={playCounts[game.id] ?? game.plays} />)}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #ffffff06', padding: '22px 28px', textAlign: 'center' }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#ffffff12', fontFamily: "'Oswald', sans-serif" }}>
          Trivial Sports
        </span>
      </div>
    </div>
  )
}
