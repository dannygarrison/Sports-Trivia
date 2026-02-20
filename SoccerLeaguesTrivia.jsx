import { useState, useRef, useEffect } from "react";

const LEAGUES = [
  {
    id: "epl",
    name: "Premier League",
    country: "England",
    accent: "#3d195b",
    textAccent: "#a855f7",
    teams: [
      { name: "Arsenal", aliases: [] },
      { name: "Aston Villa", aliases: ["Villa"] },
      { name: "Bournemouth", aliases: ["AFC Bournemouth"] },
      { name: "Brentford", aliases: [] },
      { name: "Brighton", aliases: ["Brighton & Hove Albion", "Brighton and Hove Albion", "BHAFC"] },
      { name: "Burnley", aliases: [] },
      { name: "Chelsea", aliases: [] },
      { name: "Crystal Palace", aliases: ["Palace"] },
      { name: "Everton", aliases: ["Toffees"] },
      { name: "Fulham", aliases: [] },
      { name: "Leeds United", aliases: ["Leeds"] },
      { name: "Liverpool", aliases: [] },
      { name: "Manchester City", aliases: ["Man City"] },
      { name: "Manchester United", aliases: ["Man United", "Man Utd", "Manchester Utd"] },
      { name: "Newcastle United", aliases: ["Newcastle"] },
      { name: "Nottingham Forest", aliases: ["Notts Forest", "Forest"] },
      { name: "Sunderland", aliases: [] },
      { name: "Tottenham Hotspur", aliases: ["Tottenham", "Spurs"] },
      { name: "West Ham United", aliases: ["West Ham"] },
      { name: "Wolverhampton Wanderers", aliases: ["Wolves", "Wolverhampton"] },
    ],
  },
  {
    id: "laliga",
    name: "La Liga",
    country: "Spain",
    accent: "#1a0a2e",
    textAccent: "#f59e0b",
    teams: [
      { name: "Alaves", aliases: ["Deportivo Alaves", "Deportivo Alavés", "Alavés"] },
      { name: "Athletic Bilbao", aliases: ["Athletic Club"] },
      { name: "Atletico Madrid", aliases: ["Atlético Madrid", "Atletico de Madrid", "Atlético de Madrid", "Atl Madrid"] },
      { name: "Barcelona", aliases: ["FC Barcelona", "Barca", "Barça"] },
      { name: "Celta Vigo", aliases: ["Celta de Vigo", "RC Celta"] },
      { name: "Elche", aliases: ["Elche CF"] },
      { name: "Espanyol", aliases: ["RCD Espanyol"] },
      { name: "Getafe", aliases: ["Getafe CF"] },
      { name: "Girona", aliases: ["Girona FC"] },
      { name: "Levante", aliases: ["Levante UD"] },
      { name: "Mallorca", aliases: ["RCD Mallorca", "Real Mallorca"] },
      { name: "Osasuna", aliases: ["CA Osasuna"] },
      { name: "Rayo Vallecano", aliases: ["Rayo"] },
      { name: "Real Betis", aliases: ["Betis", "Real Betis Balompie"] },
      { name: "Real Madrid", aliases: ["Madrid"] },
      { name: "Real Oviedo", aliases: ["Oviedo"] },
      { name: "Real Sociedad", aliases: ["Sociedad"] },
      { name: "Sevilla", aliases: ["Sevilla FC"] },
      { name: "Valencia", aliases: ["Valencia CF"] },
      { name: "Villarreal", aliases: ["Villarreal CF", "Yellow Submarine"] },
    ],
  },
  {
    id: "bundesliga",
    name: "Bundesliga",
    country: "Germany",
    accent: "#1a0000",
    textAccent: "#ef4444",
    teams: [
      { name: "Augsburg", aliases: ["FC Augsburg"] },
      { name: "Bayern Munich", aliases: ["FC Bayern", "FC Bayern Munich", "Bayern"] },
      { name: "Bayer Leverkusen", aliases: ["Leverkusen"] },
      { name: "Borussia Dortmund", aliases: ["Dortmund", "BVB"] },
      { name: "Borussia Mönchengladbach", aliases: ["Monchengladbach", "Mönchengladbach", "Gladbach", "BMG"] },
      { name: "Eintracht Frankfurt", aliases: ["Frankfurt"] },
      { name: "Freiburg", aliases: ["SC Freiburg"] },
      { name: "Hamburg", aliases: ["Hamburger SV", "HSV"] },
      { name: "Heidenheim", aliases: ["1. FC Heidenheim", "FC Heidenheim"] },
      { name: "Hoffenheim", aliases: ["TSG Hoffenheim", "1899 Hoffenheim", "TSG 1899"] },
      { name: "1. FC Köln", aliases: ["Koln", "Köln", "FC Koln", "FC Köln", "Cologne"] },
      { name: "Mainz", aliases: ["FSV Mainz", "Mainz 05", "1. FSV Mainz 05"] },
      { name: "RB Leipzig", aliases: ["Leipzig"] },
      { name: "St. Pauli", aliases: ["FC St. Pauli", "St Pauli"] },
      { name: "Stuttgart", aliases: ["VfB Stuttgart"] },
      { name: "Union Berlin", aliases: ["1. FC Union Berlin"] },
      { name: "Werder Bremen", aliases: ["Werder", "SV Werder Bremen"] },
      { name: "Wolfsburg", aliases: ["VfL Wolfsburg"] },
    ],
  },
  {
    id: "seriea",
    name: "Serie A",
    country: "Italy",
    accent: "#001a33",
    textAccent: "#38bdf8",
    teams: [
      { name: "Atalanta", aliases: [] },
      { name: "Bologna", aliases: ["Bologna FC"] },
      { name: "Cagliari", aliases: [] },
      { name: "Como", aliases: ["Como 1907"] },
      { name: "Cremonese", aliases: ["US Cremonese"] },
      { name: "Fiorentina", aliases: ["ACF Fiorentina", "La Viola"] },
      { name: "Genoa", aliases: ["Genoa CFC"] },
      { name: "Inter", aliases: ["Inter Milan", "Internazionale", "FC Internazionale"] },
      { name: "Juventus", aliases: ["Juve", "Juventus FC"] },
      { name: "Lazio", aliases: ["SS Lazio"] },
      { name: "Lecce", aliases: ["US Lecce"] },
      { name: "Milan", aliases: ["AC Milan"] },
      { name: "Napoli", aliases: ["SSC Napoli"] },
      { name: "Parma", aliases: ["Parma Calcio"] },
      { name: "Pisa", aliases: ["AC Pisa", "Pisa SC"] },
      { name: "Roma", aliases: ["AS Roma"] },
      { name: "Sassuolo", aliases: ["US Sassuolo"] },
      { name: "Torino", aliases: ["Toro", "Torino FC"] },
      { name: "Udinese", aliases: ["Udinese Calcio"] },
      { name: "Verona", aliases: ["Hellas Verona", "Hellas"] },
    ],
  },
  {
    id: "ligue1",
    name: "Ligue 1",
    country: "France",
    accent: "#001a0a",
    textAccent: "#22c55e",
    teams: [
      { name: "Angers", aliases: ["Angers SCO"] },
      { name: "Auxerre", aliases: ["AJ Auxerre"] },
      { name: "Brest", aliases: ["Stade Brestois", "Stade Brestois 29"] },
      { name: "Le Havre", aliases: ["HAC", "Le Havre AC"] },
      { name: "Lens", aliases: ["RC Lens"] },
      { name: "Lille", aliases: ["Lille OSC", "LOSC", "LOSC Lille"] },
      { name: "Lorient", aliases: ["FC Lorient"] },
      { name: "Lyon", aliases: ["Olympique Lyonnais", "OL"] },
      { name: "Marseille", aliases: ["Olympique de Marseille", "OM"] },
      { name: "Metz", aliases: ["FC Metz"] },
      { name: "Monaco", aliases: ["AS Monaco"] },
      { name: "Nantes", aliases: ["FC Nantes"] },
      { name: "Nice", aliases: ["OGC Nice"] },
      { name: "Paris FC", aliases: ["PFC"] },
      { name: "PSG", aliases: ["Paris Saint-Germain", "Paris SG", "Paris Saint Germain"] },
      { name: "Rennes", aliases: ["Stade Rennais", "Stade Rennais FC"] },
      { name: "Strasbourg", aliases: ["RC Strasbourg", "RCSA"] },
      { name: "Toulouse", aliases: ["Toulouse FC", "TFC"] },
    ],
  },
];

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/['']/g, "'")
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9 '\.]/g, "");
}

function checkGuess(guess, team) {
  const g = normalize(guess);
  if (normalize(team.name) === g) return true;
  return team.aliases.some(a => normalize(a) === g);
}

function LeagueColumn({ league, solvedSet, onSolve, activeLeagueId, setActiveLeague }) {
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null);
  const inputRef = useRef(null);
  const isActive = activeLeagueId === league.id;
  const solved = league.teams.filter(t => solvedSet.has(t.name));
  const remaining = league.teams.filter(t => !solvedSet.has(t.name));
  const allDone = remaining.length === 0;

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    const match = remaining.find(t => checkGuess(val, t));
    if (match) {
      onSolve(league.id, match.name);
      setInput("");
      setFlash(match.name);
      setTimeout(() => setFlash(null), 800);
    }
  };

  const handleFocus = () => setActiveLeague(league.id);

  return (
    <div style={{
      flex: "1 1 180px",
      minWidth: 0,
      background: "#09091e",
      border: `1px solid ${isActive ? league.textAccent + "55" : "#ffffff0a"}`,
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px 12px",
        background: league.accent,
        borderBottom: `1px solid ${league.textAccent}22`,
      }}>
        <div style={{
          fontSize: 10,
          fontWeight: 800,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
          color: league.textAccent,
          marginBottom: 2,
        }}>{league.country}</div>
        <div style={{
          fontSize: 17,
          fontWeight: 900,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#ffffff",
          lineHeight: 1.1,
        }}>{league.name}</div>
        <div style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: "'Barlow Condensed', sans-serif",
          color: allDone ? league.textAccent : "#ffffff44",
          fontWeight: 700,
          letterSpacing: 1,
        }}>
          {allDone ? "✓ Complete!" : `${solved.length} / ${league.teams.length}`}
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 6, height: 3, background: "#ffffff10", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(solved.length / league.teams.length) * 100}%`,
            background: league.textAccent,
            borderRadius: 2,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Input */}
      {!allDone && (
        <div style={{ padding: "10px 12px 0" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            onFocus={handleFocus}
            placeholder="Type a team..."
            style={{
              width: "100%",
              background: isActive ? "#0f0f28" : "#080818",
              border: `1px solid ${isActive ? league.textAccent + "44" : "#ffffff0a"}`,
              borderRadius: 8,
              padding: "8px 10px",
              color: "#ffffff",
              fontSize: 13,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600,
              letterSpacing: 0.5,
              outline: "none",
              transition: "all 0.18s",
              boxSizing: "border-box",
            }}
          />
        </div>
      )}

      {/* Team list */}
      <div style={{ padding: "10px 12px 14px", flex: 1, overflowY: "auto" }}>
        {league.teams.map(team => {
          const isSolved = solvedSet.has(team.name);
          const isFlashing = flash === team.name;
          return (
            <div key={team.name} style={{
              padding: "5px 8px",
              marginBottom: 3,
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: isSolved ? 700 : 400,
              letterSpacing: 0.5,
              color: isSolved ? "#ffffff" : "#ffffff18",
              background: isFlashing ? league.textAccent + "25" : isSolved ? "#ffffff08" : "transparent",
              transition: "all 0.25s",
              borderLeft: isSolved ? `2px solid ${league.textAccent}` : "2px solid transparent",
            }}>
              {isSolved ? team.name : "—"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SoccerLeaguesTrivia() {
  const [solved, setSolved] = useState({
    epl: new Set(), laliga: new Set(), bundesliga: new Set(), seriea: new Set(), ligue1: new Set(),
  });
  const [activeLeague, setActiveLeague] = useState("epl");
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const [finishTime, setFinishTime] = useState(null);

  const totalTeams = LEAGUES.reduce((sum, l) => sum + l.teams.length, 0);
  const totalSolved = LEAGUES.reduce((sum, l) => sum + solved[l.id].size, 0);

  useEffect(() => {
    if (finished) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000);
    return () => clearInterval(interval);
  }, [finished, startTime]);

  useEffect(() => {
    if (totalSolved === totalTeams && !finished) {
      setFinished(true);
      setFinishTime(elapsed);
    }
  }, [totalSolved, totalTeams, finished, elapsed]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleSolve = (leagueId, teamName) => {
    setSolved(prev => {
      const next = { ...prev, [leagueId]: new Set(prev[leagueId]) };
      next[leagueId].add(teamName);
      return next;
    });
  };

  const handleReset = () => {
    setSolved({ epl: new Set(), laliga: new Set(), bundesliga: new Set(), seriea: new Set(), ligue1: new Set() });
    setFinished(false);
    setFinishTime(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d22 0%, #07070f 60%)",
      color: "#f0f0f0",
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: "84px 16px 56px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes confetti { 0% { transform: scale(0.8); opacity: 0; } 50% { transform: scale(1.05); } 100% { transform: scale(1); opacity: 1; } }
        input::placeholder { color: #ffffff20; }
        input:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1200, margin: "0 auto 28px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#22c55e", marginBottom: 6, opacity: 0.8 }}>
              Soccer Trivia
            </div>
            <h1 style={{ fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, letterSpacing: 0, textTransform: "uppercase", lineHeight: 1, margin: 0, color: "#ffffff" }}>
              Top 5 Leagues
            </h1>
            <p style={{ fontSize: 13, color: "#ffffff33", margin: "8px 0 0", fontFamily: "Georgia, serif" }}>
              Name all {totalTeams} teams across the 5 biggest leagues in world football.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            {/* Timer */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff33", marginBottom: 2 }}>Time</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: finished ? "#22c55e" : "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {formatTime(finished ? finishTime : elapsed)}
              </div>
            </div>
            {/* Progress */}
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff33", marginBottom: 2 }}>Found</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {totalSolved}<span style={{ fontSize: 16, color: "#ffffff33" }}>/{totalTeams}</span>
              </div>
            </div>
            {/* Reset */}
            <button onClick={handleReset} style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase",
              padding: "9px 18px", borderRadius: 8, cursor: "pointer",
              border: "1px solid #ffffff15", background: "transparent", color: "#ffffff33",
              fontFamily: "'Barlow Condensed', sans-serif", transition: "all 0.18s",
            }}
              onMouseEnter={e => { e.target.style.color = "#ffffff88"; e.target.style.borderColor = "#ffffff33"; }}
              onMouseLeave={e => { e.target.style.color = "#ffffff33"; e.target.style.borderColor = "#ffffff15"; }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 16, height: 4, background: "#ffffff08", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(totalSolved / totalTeams) * 100}%`,
            background: "linear-gradient(90deg, #a855f7, #f59e0b, #ef4444, #38bdf8, #22c55e)",
            borderRadius: 2,
            transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Finished banner */}
      {finished && (
        <div style={{
          maxWidth: 1200, margin: "0 auto 24px",
          background: "linear-gradient(135deg, #0a1a0a, #0f2a0f)",
          border: "1px solid #22c55e44",
          borderRadius: 14,
          padding: "20px 24px",
          textAlign: "center",
          animation: "confetti 0.5s ease both",
          boxShadow: "0 0 40px #22c55e15",
        }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🏆</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#22c55e", letterSpacing: 1, textTransform: "uppercase" }}>
            All {totalTeams} Teams Found!
          </div>
          <div style={{ fontSize: 14, color: "#ffffff66", marginTop: 4, fontFamily: "Georgia, serif" }}>
            Completed in {formatTime(finishTime)} — proper ball knowledge.
          </div>
        </div>
      )}

      {/* League columns */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        flexWrap: "wrap",
        animation: "fadeUp 0.45s ease both",
        animationDelay: "0.1s",
      }}>
        {LEAGUES.map(league => (
          <LeagueColumn
            key={league.id}
            league={league}
            solvedSet={solved[league.id]}
            onSolve={handleSolve}
            activeLeagueId={activeLeague}
            setActiveLeague={setActiveLeague}
          />
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "20px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#ffffff15", letterSpacing: 2, textTransform: "uppercase" }}>
          2025–26 Season · Abbreviated names accepted
        </div>
      </div>
    </div>
  );
}
