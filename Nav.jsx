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
      top: 0, left: 0, right: 0,
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

      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
        <img
          src="/ts_whistle_logo_blueoutline.png"
          alt="Trivial Sports"
          style={{ height: 36, width: 36, objectFit: 'contain' }}
        />
      </Link>

      {!isHome && (
        <Link to="/"
          style={{
            textDecoration: 'none',
            fontSize: 11, fontWeight: 700,
            letterSpacing: 2.5, textTransform: 'uppercase',
            color: '#ffffff44',
            fontFamily: "'Oswald', sans-serif",
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#ffffff99'}
          onMouseLeave={e => e.target.style.color = '#ffffff44'}
        >
          &larr; All Games
        </Link>
      )}

      
        href="https://docs.google.com/forms/d/e/1FAIpQLSe_CaVhmcpFGCdIqTX5Rjh2SDGef486kZUrHV6L71nepl4Eeg/viewform"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: 'none',
          fontSize: 11, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase',
          fontFamily: "'Oswald', sans-serif",
          color: '#c8a050',
          background: '#c8a05018',
          border: '1px solid #c8a05044',
          borderRadius: 8,
          padding: '7px 14px',
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = '#c8a05030'
          e.currentTarget.style.borderColor = '#c8a05088'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = '#c8a05018'
          e.currentTarget.style.borderColor = '#c8a05044'
        }}
      >
        Suggest a Game
      </a>

    </nav>
  )
}
