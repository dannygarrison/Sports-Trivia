import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function Nav() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 28px',
      height: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled || !isHome ? 'rgba(7,7,15,0.96)' : 'transparent',
      borderBottom: scrolled || !isHome ? '1px solid #ffffff08' : '1px solid transparent',
      backdropFilter: scrolled || !isHome ? 'blur(12px)' : 'none',
      transition: 'background 0.3s, border-color 0.3s, backdrop-filter 0.3s',
    }}>
      <Link to="/" style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#ffffff33',
          lineHeight: 1,
        }}>
          Project
        </span>
        <span style={{
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#ffffff',
          lineHeight: 1,
        }}>
          Ball
        </span>
        <span style={{
          fontSize: 18,
          fontWeight: 900,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#c8a050',
          lineHeight: 1,
        }}>
          Knowledge
        </span>
      </Link>

      {!isHome && (
        <Link to="/" style={{
          textDecoration: 'none',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          color: '#ffffff44',
          fontFamily: "'Barlow Condensed', sans-serif",
          transition: 'color 0.2s',
          ':hover': { color: '#ffffff99' },
        }}
          onMouseEnter={e => e.target.style.color = '#ffffff99'}
          onMouseLeave={e => e.target.style.color = '#ffffff44'}
        >
          ← All Games
        </Link>
      )}
    </nav>
  )
}
