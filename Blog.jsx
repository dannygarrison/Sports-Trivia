import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'nfl-chain-cheat-codes',
    title: 'Top 7 NFL Chain Game Cheat Codes: Obscure College Connections You Need to Know',
    date: 'February 28, 2026',
    preview: 'The secret to NFL Chain isn\'t Alabama or Ohio State. It\'s the schools that don\'t show up in the College Football Playoff.',
    game: { name: 'NFL Chain', path: '/games/nfl-chain' },
  },
]

export default function Blog() {
  return (
    <>
      <Helmet>
        <title>Blog - Trivial Sports</title>
        <meta name="description" content="Sports trivia tips, strategy guides, and cheat codes for TrivialSports.com games." />
        <link rel="canonical" href="https://trivialsports.com/blog" />
      </Helmet>

      <div style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '100px 20px 60px',
        fontFamily: "'Oswald', sans-serif",
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 42px)',
          fontWeight: 700,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#f0d070',
          marginBottom: 40,
        }}>
          Blog
        </h1>

        {POSTS.map(post => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            style={{
              display: 'block',
              textDecoration: 'none',
              padding: '28px 24px',
              marginBottom: 20,
              borderRadius: 10,
              background: '#0e0e1a',
              border: '1px solid #ffffff10',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#f0d07040'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = '#ffffff10'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div style={{
              fontSize: 12,
              fontWeight: 400,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: '#ffffff44',
              marginBottom: 10,
            }}>
              {post.date}
            </div>
            <h2 style={{
              fontSize: 'clamp(18px, 3vw, 24px)',
              fontWeight: 600,
              color: '#e8e8f0',
              lineHeight: 1.3,
              margin: '0 0 12px',
            }}>
              {post.title}
            </h2>
            <p style={{
              fontSize: 15,
              fontWeight: 300,
              color: '#ffffff88',
              lineHeight: 1.5,
              margin: 0,
            }}>
              {post.preview}
            </p>
            {post.game && (
              <div style={{
                display: 'inline-block',
                marginTop: 14,
                padding: '4px 10px',
                borderRadius: 4,
                background: '#f0d07015',
                color: '#f0d070',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
              }}>
                {post.game.name}
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
