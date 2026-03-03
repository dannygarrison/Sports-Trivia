import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function BlogSlimeSoccer() {
  const h2Style = {
    fontSize: 'clamp(20px, 3.5vw, 26px)',
    fontWeight: 600,
    color: '#f0d070',
    margin: '48px 0 16px',
    lineHeight: 1.3,
    fontFamily: "'Oswald', sans-serif",
  }

  const pStyle = {
    fontSize: 16,
    fontWeight: 300,
    color: '#d0d0d8',
    lineHeight: 1.75,
    margin: '0 0 16px',
    fontFamily: "'Oswald', sans-serif",
  }

  const divider = {
    border: 'none',
    borderTop: '1px solid #ffffff10',
    margin: '40px 0',
  }

  return (
    <>
      <Helmet>
        <title>Whatever Happened to Slime Soccer? – Trivial Sports</title>
        <meta name="description" content="The story of Slime Soccer: how a university student built it instead of writing an essay, how it spread through school computer labs, and why it disappeared." />
        <meta property="og:title" content="Whatever Happened to Slime Soccer? – Trivial Sports" />
        <meta property="og:description" content="The story of Slime Soccer: how a university student built it instead of writing an essay, how it spread through school computer labs, and why it disappeared." />
        <meta property="og:url" content="https://trivialsports.com/blog/whatever-happened-to-slime-soccer" />
        <meta property="og:type" content="article" />
        <link rel="canonical" href="https://trivialsports.com/blog/whatever-happened-to-slime-soccer" />
      </Helmet>

      <article style={{
        maxWidth: 720,
        margin: '0 auto',
        padding: '100px 20px 60px',
      }}>
        {/* Back to blog */}
        <Link to="/blog" style={{
          textDecoration: 'none',
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: '#ffffff44',
          fontFamily: "'Oswald', sans-serif",
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = '#ffffff99'}
          onMouseLeave={e => e.target.style.color = '#ffffff44'}
        >
          ← Blog
        </Link>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(26px, 5vw, 40px)',
          fontWeight: 700,
          letterSpacing: 1,
          color: '#e8e8f0',
          lineHeight: 1.2,
          margin: '24px 0 16px',
          fontFamily: "'Oswald', sans-serif",
        }}>
          Whatever Happened to Slime Soccer?
        </h1>

        <div style={{ fontSize: 13, color: '#ffffff44', fontFamily: "'Oswald', sans-serif", letterSpacing: 1, marginBottom: 32 }}>
          MARCH 2, 2026
        </div>

        {/* Intro */}
        <p style={{ ...pStyle, fontSize: 17, color: '#e8e8f0', fontStyle: 'italic', marginBottom: 32 }}>
          If you had access to a computer in a school classroom between 2002 and 2012, there's a very good chance you played Slime Soccer. Two half-circle blobs, a ball, two goals, and physics that felt just wrong enough to be right. No instructions needed. You just played.
        </p>
        <p style={{ ...pStyle, marginBottom: 32 }}>
          Then one day, without most of us even noticing, it was gone.
        </p>

        <hr style={divider} />

        {/* Where It Came From */}
        <h2 style={h2Style}>Where It Came From</h2>
        <p style={pStyle}>
          The story of Slime Soccer starts with Slime Volleyball, and Slime Volleyball starts at the University of Western Australia in 1999.
        </p>
        <p style={pStyle}>
          A computer science student found a crude one-player volleyball game floating around the internet. It had bad graphics and dodgy physics but it was weirdly addictive. Quin Pendragon saw his classmate playing and decided to write a two-player version with better physics. He coded it in a hackathon-style sprint, and Two-Player Slime Volleyball was born.
        </p>
        <p style={pStyle}>
          It spread through the computer science department like wildfire. Tournaments were organized. Rivalries formed. Another student started modding the game, added stats tracking, created Aussie rules football team jerseys, and eventually built One Slime: a single-player mode with AI opponents that became the most popular page on UWA's entire student web server.
        </p>
        <p style={pStyle}>
          By late 2001, One Slime was pulling over 100,000 hits per month on a university server. Even with the Internet still finding its legs, the game had escaped campus entirely.
        </p>

        <hr style={divider} />

        {/* The Soccer Spin-Off */}
        <h2 style={h2Style}>The Soccer Spin-Off</h2>
        <p style={pStyle}>
          In May 2002, legend has it, Pendragon had a 15-page essay due in 36 hours. So he decided to write a soccer game instead. By morning, Slime Soccer was basically done. It was the product of what the group called, "the fourth great slime hackathon."
        </p>
        <p style={pStyle}>
          Within hours of being posted, traffic was hitting the site at about a hit per minute. Slime had struck again.
        </p>
        <p style={pStyle}>
          Slime Soccer took the same core physics that made Slime Volleyball so satisfying. It was the weight of the slimes, the arc of the ball, the way you could learn to curve shots with the top of your dome. And it put it all in a format that felt immediately familiar to anyone who'd ever kicked a ball.
        </p>

        <hr style={divider} />

        {/* How It Spread */}
        <h2 style={h2Style}>How It Spread</h2>
        <p style={pStyle}>
          These were Java applet games. You didn't download anything. You went to a website, the game loaded in your browser, and you played. This was before Flash dominated browser gaming, and Java applets were one of the few ways to run real interactive content on a webpage.
        </p>
        <p style={pStyle}>
          The games lived on sites like oneslime.net, slimegames.co.uk, and dozens of unofficial mirrors. They showed up on free game aggregator sites alongside other browser classics. Teachers couldn't block them fast enough. Kids emailed links to each other. For a generation of students, Slime Soccer was the game you played when you were supposed to be doing something else.
        </p>

        <hr style={divider} />

        {/* The Death of Java */}
        <h2 style={h2Style}>The Death of Java in the Browser</h2>
        <p style={pStyle}>
          Then browsers killed Java applets.
        </p>
        <p style={pStyle}>
          Google Chrome dropped support for the NPAPI plugin architecture in September 2015, which meant Java applets simply stopped working. Firefox followed suit in 2017. Microsoft Edge never supported them at all. Oracle themselves deprecated the Java browser plugin, effectively signing the death certificate.
        </p>
        <p style={pStyle}>
          It wasn't personal. Java applets had become a massive security liability, and browsers were right to cut them off. But a lot got wiped out in the process. Thousands of browser games, educational tools, and interactive experiments just stopped working overnight. Slime Soccer was one of them.
        </p>
        <p style={pStyle}>
          If you tried to visit the old Slime Soccer sites after 2015, you'd see a broken page. Maybe a grey rectangle where the game used to be. Maybe nothing at all. The game was gone.
        </p>

        <hr style={divider} />

        {/* The Quiet Aftermath */}
        <h2 style={h2Style}>The Quiet Aftermath</h2>
        <p style={pStyle}>
          A few fan remakes have popped up over the years (a Godot engine rebuild on itch.io, a few JavaScript ports on GitHub) but none captured the same widespread attention as the original. The game that once crashed university servers became a fading memory, something you'd occasionally think about and wonder whatever happened to it.
        </p>

        <hr style={divider} />

        {/* Playing Slime Soccer Today */}
        <h2 style={{ ...h2Style, color: '#e8e8f0' }}>Playing Slime Soccer Today</h2>
        <p style={pStyle}>
          It turns out a lot of people have been quietly missing this game.
        </p>
        <p style={pStyle}>
          I rebuilt Slime Soccer from scratch as a free browser game right here on TrivialSports.com. It runs on modern web technology (no Java required), works on both desktop and mobile, and includes some additions the original never had: dozens of playable countries with custom kit designs, a local two-player mode, a CPU vs CPU match simulator, and goal celebrations that react to how you score.
        </p>
        <p style={pStyle}>
          The core physics, the thing that actually made Slime Soccer feel like Slime Soccer, are faithful to the original. The weight, the bounce, the way you can learn to angle shots off the top of your slime. If you played the original, it'll feel right.
        </p>
        <p style={pStyle}>
          If you never played the original, now you know what everyone was doing in the computer lab instead of their homework.
        </p>

        {/* CTA */}
        <Link to="/games/slime-soccer" style={{
          display: 'inline-block',
          marginTop: 24,
          padding: '14px 28px',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #f0d070, #e8a030)',
          color: '#07070f',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px #f0d07033'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Play Slime Soccer Now →
        </Link>
      </article>
    </>
  )
}
