import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Game registry — add new games here
const GAMES = [
  {
    id: 'nfl-college-trivia',
    path: '/games/nfl-college-trivia',
    title: 'NFL College Trivia',
    sport: 'NFL',
    description: 'Name the college for 576 NFL players. How long can you streak?',
    accent: '#e74c3c',
    tag: 'STREAKS',
    available: true,
  },
  {
    id: 'nba-college-trivia',
    path: '/games/nba-college-trivia',
    title: 'NBA College Trivia',
    sport: 'NBA',
    description: 'Coming soon.',
    accent: '#e67e22',
    tag: 'COMING SOON',
    available: false,
  },
  {
    id: 'mlb-draft-trivia',
    path: '/games/mlb-draft-trivia',
    title: 'MLB Draft Trivia',
    sport: 'MLB',
    description: 'Coming soon.',
    accent: '#3498db',
    tag: 'COMING SOON',
    available: false,
  },
  {
    id: 'soccer-trivia',
    path: '/games/soccer-trivia',
    title: 'Soccer Trivia',
    sport: 'SOCCER',
    description: 'Coming soon.',
    accent: '#27ae60',
    tag: 'COMING SOON',
    available: false,
  },
]

const SPORT_COLORS = {
  NFL: '#e74c3c',
  NBA: '#e67e22',
  MLB: '#3498db',
  SOCCER: '#27ae60',
}

function GameCard({ game, index }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        animation: `fadeUp 0.5s ease both`,
        animationDelay: `${0.1 + index * 0.08}s`,
      }}
    >
      {game.available ? (
        <Link
          to={game.path}
          style={{ textDecoration: 'none' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CardInner game={game} hovered={hovered} />
        </Link>
      ) : (
        <div
          style={{ cursor: 'default', opacity: 0.45 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <CardInner game={game} hovered={false} />
        </div>
      )}
    </div>
  )
}

function CardInner({ game, hovered }) {
  return (
    <div style={{
      background: hovered
        ? `linear-gradient(135deg, #0e0e1e, #111126)`
        : 'linear-gradient(135deg, #0a0a18, #0d0d1f)',
      border: `1px solid ${hovered ? game.accent + '44' : '#ffffff0a'}`,
      borderRadius: 16,
      padding: '28px 26px',
      transition: 'all 0.25s ease',
      transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      boxShadow: hovered
        ? `0 16px 40px ${game.accent}18, 0 4px 12px #00000066`
        : '0 2px 8px #00000044',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Accent glow top-left */}
      <div style={{
        position: 'absolute',
        top: -20,
        left: -20,
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: game.accent,
        opacity: hovered ? 0.06 : 0.03,
        filter: 'blur(30px)',
        transition: 'opacity 0.3s',
        pointerEvents: 'none',
      }} />

      {/* Sport tag */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
      }}>
        <span style={{
          fontSize: 9,
          fontWeight: 800,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: game.accent,
          background: game.accent + '15',
          padding: '3px 8px',
          borderRadius: 4,
        }}>
          {game.sport}
        </span>
        <span style={{
          fontSize: 9,
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          color: '#ffffff22',
        }}>
          {game.tag}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 22,
        fontWeight: 900,
        fontFamily: "'Barlow Condensed', sans-serif",
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: hovered ? '#ffffff' : '#ddddee',
        margin: '0 0 10px',
        lineHeight: 1.1,
        transition: 'color 0.2s',
      }}>
        {game.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: 13,
        color: '#ffffff44',
        lineHeight: 1.6,
        margin: 0,
        fontFamily: 'Georgia, serif',
      }}>
        {game.description}
      </p>

      {/* Play arrow */}
      {game.available && (
        <div style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateX(0)' : 'translateX(-8px)',
          transition: 'all 0.25s ease',
        }}>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: game.accent,
          }}>
            Play Now →
          </span>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#07070f',
      fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif",
      paddingTop: 56,
    }}>
      {/* Load Barlow Condensed from Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>

      {/* Hero */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '80px 28px 72px',
        textAlign: 'center',
        borderBottom: '1px solid #ffffff06',
      }}>
        {/* Background grid */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(200,160,80,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,160,80,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }} />

        {/* Radial glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, #c8a05012 0%, transparent 70%)',
          pointerEvents: 'none',
          animation: 'pulse 4s ease infinite',
        }} />

        <div style={{
          position: 'relative',
          animation: 'heroIn 0.6s ease both',
          maxWidth: 640,
          margin: '0 auto',
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 5,
            textTransform: 'uppercase',
            color: '#c8a050',
            marginBottom: 20,
            opacity: 0.8,
          }}>
            Ball Knowledge Games
          </div>

          <h1 style={{
            fontSize: 'clamp(52px, 10vw, 88px)',
            fontWeight: 900,
            letterSpacing: -1,
            textTransform: 'uppercase',
            lineHeight: 0.9,
            margin: '0 0 24px',
            color: '#ffffff',
          }}>
            Prove Your{' '}
            <span style={{
              color: 'transparent',
              WebkitTextStroke: '1px #c8a050',
            }}>
              Ball
            </span>
            {' '}Knowledge
          </h1>

          <p style={{
            fontSize: 16,
            color: '#ffffff44',
            lineHeight: 1.7,
            fontFamily: 'Georgia, serif',
            maxWidth: 420,
            margin: '0 auto',
            fontWeight: 400,
          }}>
            Sports trivia games that separate the true fans from the casuals.
          </p>
        </div>
      </div>

      {/* Games grid */}
      <div style={{
        maxWidth: 960,
        margin: '0 auto',
        padding: '56px 28px 80px',
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: 'uppercase',
          color: '#ffffff22',
          marginBottom: 24,
          animation: 'fadeUp 0.5s ease both',
          animationDelay: '0.05s',
        }}>
          All Games
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}>
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #ffffff06',
        padding: '24px 28px',
        textAlign: 'center',
      }}>
        <span style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: '#ffffff15',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}>
          Ball Knowledge Games
        </span>
      </div>
    </div>
  )
}
