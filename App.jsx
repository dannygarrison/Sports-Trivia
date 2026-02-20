import { Routes, Route } from 'react-router-dom'
import Nav from './Nav.jsx'
import Home from './Home.jsx'
import NFLCollegeTrivia from './NFLCollegeTrivia.jsx'
import SoccerLeaguesTrivia from './SoccerLeaguesTrivia.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/nfl-college-trivia" element={<NFLCollegeTrivia />} />
        <Route path="/games/soccer-leagues-trivia" element={<SoccerLeaguesTrivia />} />
      </Routes>
    </div>
  )
}
