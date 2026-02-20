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

function LeagueColumn({ league, solvedSet, onSolve, activeLeagueId, setActiveLeague, gaveUp }) {
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
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 3,
          textTransform: "uppercase",
          color: league.textAccent,
          marginBottom: 2,
        }}>{league.country}</div>
        <div style={{
          fontSize: 17,
          fontWeight: 900,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: "#ffffff",
          lineHeight: 1.1,
        }}>{league.name}</div>
        <div style={{
          marginTop: 8,
          fontSize: 11,
          fontFamily: "'Oswald', sans-serif",
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
              fontFamily: "'Oswald', sans-serif",
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
          const isRevealed = gaveUp && !isSolved;
          const isFlashing = flash === team.name;
          const shown = isSolved || isRevealed;
          return (
            <div key={team.name} style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "5px 8px",
              marginBottom: 3,
              borderRadius: 6,
              background: isFlashing ? league.textAccent + "25" : isRevealed ? "#e74c3c08" : isSolved ? "#ffffff08" : "transparent",
              transition: "all 0.25s",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: isRevealed ? "#e74c3c" : isSolved ? league.textAccent : "#ffffff15",
                boxShadow: isRevealed ? "0 0 5px #e74c3c88" : isSolved ? `0 0 5px ${league.textAccent}88` : "none",
                transition: "background 0.25s",
              }} />
              <span style={{
                fontSize: 12,
                fontFamily: "'Oswald', sans-serif",
                fontWeight: shown ? 700 : 400,
                letterSpacing: 0.5,
                color: isRevealed ? "#e8806070" : isSolved ? "#ffffff" : "#ffffff18",
                transition: "color 0.25s",
              }}>
                {shown ? team.name : "—"}
              </span>
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
  const [gaveUp, setGaveUp] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);

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

  const handleGiveUp = () => {
    // Reveal all teams
    const allSolved = {};
    LEAGUES.forEach(l => {
      allSolved[l.id] = new Set(l.teams.map(t => t.name));
    });
    setSolved(allSolved);
    setGaveUp(true);
    setFinished(true);
    setFinishTime(elapsed);
    setShowGiveUpConfirm(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d22 0%, #07070f 60%)",
      color: "#f0f0f0",
      fontFamily: "'Oswald', sans-serif",
      padding: "84px 16px 56px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
            <p style={{ fontSize: 13, color: "#c8a050", margin: "8px 0 0", fontFamily: "Georgia, serif" }}>
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
                {totalSolved}<span style={{ fontSize: 16, color: "#c8a05099" }}>/{totalTeams}</span>
              </div>
            </div>
            {/* Give Up */}
            {!finished && (
              <button onClick={() => setShowGiveUpConfirm(true)} style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase",
                padding: "9px 18px", borderRadius: 8, cursor: "pointer",
                border: "1px solid #e74c3c33", background: "transparent", color: "#e74c3c88",
                fontFamily: "'Oswald', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e74c3c"; e.currentTarget.style.borderColor = "#e74c3c66"; e.currentTarget.style.background = "#e74c3c11"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#e74c3c88"; e.currentTarget.style.borderColor = "#e74c3c33"; e.currentTarget.style.background = "transparent"; }}
              >
                Give Up
              </button>
            )}
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

      {/* Finished / gave up banner */}
      {finished && (
        <div style={{
          maxWidth: 1200, margin: "0 auto 24px",
          background: gaveUp ? "linear-gradient(135deg, #1a0a0a, #2a0f0f)" : "linear-gradient(135deg, #0a1a0a, #0f2a0f)",
          border: `1px solid ${gaveUp ? "#e74c3c44" : "#22c55e44"}`,
          borderRadius: 14,
          padding: "20px 24px",
          textAlign: "center",
          animation: "confetti 0.5s ease both",
          boxShadow: `0 0 40px ${gaveUp ? "#e74c3c15" : "#22c55e15"}`,
        }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>{gaveUp ? "" : "🏆"}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#22c55e", letterSpacing: 1, textTransform: "uppercase" }}>
            {gaveUp ? "Answers Revealed" : `All ${totalTeams} Teams Found!`}
          </div>
          <div style={{ fontSize: 14, color: "#c8a050", marginTop: 4, fontFamily: "Georgia, serif" }}>
            {gaveUp
              ? `You found ${totalSolved} out of ${totalTeams} teams before giving up. Better luck next time.`
              : `Completed in ${formatTime(finishTime)} — proper ball knowledge.`
            }
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
            gaveUp={gaveUp}
          />
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "20px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "#ffffff15", letterSpacing: 2, textTransform: "uppercase" }}>
          2025–26 Season · Abbreviated names accepted
        </div>
      </div>

      {/* Give Up Confirmation Modal */}
      {showGiveUpConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000bb",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
        }} onClick={() => setShowGiveUpConfirm(false)}>
          <div style={{
            background: "#0e0e22", border: "2px solid #e74c3c55",
            borderRadius: 18, padding: "32px 28px", maxWidth: 320, width: "90%",
            textAlign: "center", boxShadow: "0 24px 80px #000000cc",
            animation: "confetti 0.25s ease both",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏳️</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 900, color: "#eeeeee", fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>
              Give Up?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#c8a050", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
              All {totalTeams} teams will be revealed. You found <span style={{ color: "#e74c3c", fontWeight: 900 }}>{totalSolved}</span> out of {totalTeams}.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGiveUpConfirm(false)} style={{
                flex: 1, background: "#141432", color: "#aaaacc",
                border: "1px solid #252548", borderRadius: 10,
                padding: "11px 0", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Oswald', sans-serif",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>Cancel</button>
              <button onClick={handleGiveUp} style={{
                flex: 1, background: "#e74c3c", color: "#fff", border: "none",
                borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 900,
                cursor: "pointer", fontFamily: "'Oswald', sans-serif",
                letterSpacing: 1.5, textTransform: "uppercase",
                boxShadow: "0 4px 14px #e74c3c44",
              }}>Reveal All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
