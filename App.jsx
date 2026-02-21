import { Routes, Route } from 'react-router-dom'
import Nav from './Nav.jsx'
import Home from './Home.jsx'
import NFLCollegeTrivia from './NFLCollegeTrivia.jsx'
import SoccerLeaguesTrivia from './SoccerLeaguesTrivia.jsx'
import NBAScorersGrid from './NBAScorersGrid.jsx'
import SuperBowlTrivia from './SuperBowlTrivia.jsx'
import WorldSeriesTrivia from './WorldSeriesTrivia.jsx'
import NFLNameDump from './NFLNameDump.jsx'
import MLSTeams from './MLSTeams.jsx'
import NFLChain from './NFLChain.jsx'
import PLTeams from './PLTeams.jsx'
import OlympicsHostCities from './OlympicsHostCities.jsx'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: '#07070f', color: '#e8e8f0' }}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/games/nfl-college-trivia" element={<NFLCollegeTrivia />} />
        <Route path="/games/soccer-leagues-trivia" element={<SoccerLeaguesTrivia />} />
        <Route path="/games/nba-scorers-grid" element={<NBAScorersGrid />} />
        <Route path="/games/super-bowl-history" element={<SuperBowlTrivia />} />
        <Route path="/games/world-series-history" element={<WorldSeriesTrivia />} />
        <Route path="/games/nfl-name-dump" element={<NFLNameDump />} />
        <Route path="/games/mls-teams" element={<MLSTeams />} />
        <Route path="/games/nfl-chain" element={<NFLChain />} />
        <Route path="/games/pl-teams" element={<PLTeams />} />
        <Route path="/games/olympics-host-cities" element={<OlympicsHostCities />} />
      </Routes>
    </div>
  )
}
