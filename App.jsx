import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router-dom"
import Nav from "./Nav.jsx"
import Home from "./Home.jsx"

const NFLCollegeTrivia = lazy(() => import("./NFLCollegeTrivia.jsx"))
const SoccerLeaguesTrivia = lazy(() => import("./SoccerLeaguesTrivia.jsx"))
const NBAScorersGrid = lazy(() => import("./NBAScorersGrid.jsx"))
const SuperBowlTrivia = lazy(() => import("./SuperBowlTrivia.jsx"))
const WorldSeriesTrivia = lazy(() => import("./WorldSeriesTrivia.jsx"))
const NFLNameDump = lazy(() => import("./NFLNameDump.jsx"))
const MLSTeams = lazy(() => import("./MLSTeams.jsx"))
const NFLChain = lazy(() => import("./NFLChain.jsx"))
const PLTeams = lazy(() => import("./PLTeams.jsx"))
const OlympicsHostCities = lazy(() => import("./OlympicsHostCities.jsx"))
const NFLMockDraft = lazy(() => import("./NFLMockDraft.jsx"))
const WhoHasMore = lazy(() => import("./WhoHasMore.jsx"))
const DraftClassQuiz = lazy(() => import("./DraftClassQuiz.jsx"))
const WhoWoreIt = lazy(() => import("./WhoWoreIt.jsx"))

export default function App() {
  return (
    <div style={{ minHeight: "100vh", background: "#07070f", color: "#e8e8f0" }}>
      <Nav />
      <Suspense fallback={
        <div style={{
          minHeight: "100vh",
          background: "#07070f",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#ffffff40",
          fontFamily: "'Oswald', sans-serif",
          fontSize: 13,
          letterSpacing: 3,
          textTransform: "uppercase",
        }}>
          Loading...
        </div>
      }>
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
          <Route path="/games/nfl-mock-draft" element={<NFLMockDraft />} />
          <Route path="/games/who-has-more" element={<WhoHasMore />} />
          <Route path="/games/draft-class-quiz" element={<DraftClassQuiz />} />
          <Route path="/games/who-wore-it" element={<WhoWoreIt />} />
        </Routes>
      </Suspense>
    </div>
  )
}
