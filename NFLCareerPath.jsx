import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";
import { NFL_CAREER_PATHS } from "./nflCareerPathData.js";

// ── TEAM COLORS ─────────────────────────────────────────────────────────────
const TEAM_COLORS = {
  "Arizona Cardinals":"#97233F","Atlanta Falcons":"#A71930","Baltimore Ravens":"#241773",
  "Buffalo Bills":"#00338D","Carolina Panthers":"#0085CA","Chicago Bears":"#0B162A",
  "Cincinnati Bengals":"#FB4F14","Cleveland Browns":"#311D00","Dallas Cowboys":"#003594",
  "Denver Broncos":"#FB4F14","Detroit Lions":"#0076B6","Green Bay Packers":"#203731",
  "Houston Texans":"#03202F","Indianapolis Colts":"#002C5F","Jacksonville Jaguars":"#006778",
  "Kansas City Chiefs":"#E31837","Las Vegas Raiders":"#000000","Los Angeles Chargers":"#0080C6",
  "Los Angeles Rams":"#003594","Miami Dolphins":"#008E97","Minnesota Vikings":"#4F2683",
  "New England Patriots":"#002244","New Orleans Saints":"#D3BC8D","New York Giants":"#0B2265",
  "New York Jets":"#125740","Philadelphia Eagles":"#004C54","Pittsburgh Steelers":"#FFB612",
  "San Francisco 49ers":"#AA0000","Seattle Seahawks":"#002244","Tampa Bay Buccaneers":"#D50A0A",
  "Tennessee Titans":"#0C2340","Washington Commanders":"#5A1414",
  // Legacy names
  "Washington Redskins":"#773141","Washington Football Team":"#5A1414",
  "Oakland Raiders":"#000000","San Diego Chargers":"#002A5E","St. Louis Rams":"#003594",
  "St. Louis Cardinals":"#97233F","Houston Oilers":"#4F8FC0","New Jersey Nets":"#002A60",
  "New Orleans Hornets":"#00778B","Charlotte Bobcats":"#F26532","Vancouver Grizzlies":"#6B9DAA",
  "Seattle SuperSonics":"#FFC200",
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
function normalize(s) {
  return s.toLowerCase().trim().replace(/-/g, " ").replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

const FIRST_NAME_ALIASES = {
  "matthew":["matt"],"michael":["mike"],"robert":["rob","bob","bobby"],
  "william":["will","bill","billy"],"james":["jim","jimmy"],"joseph":["joe","joey"],
  "thomas":["tom","tommy"],"christopher":["chris"],"nicholas":["nick"],
  "anthony":["tony"],"jonathan":["jon","jonny"],"nathaniel":["nate"],
  "benjamin":["ben"],"daniel":["dan","danny"],"timothy":["tim"],
  "jeffrey":["jeff"],"stephen":["steve"],"steven":["steve"],
  "richard":["rick","rich","dick"],"charles":["charlie","chuck"],
  "patrick":["pat"],"kenneth":["ken","kenny"],"terrell":["terry"],
  "terrence":["terry"],"theodore":["ted","theo"],"reginald":["reggie"],
  "ezekiel":["zeke"],"alexander":["alex"],"alejandro":["alex"],
  "le'veon":["leveon"],"deandre":["de'andre"],
};
const FIRST_NAME_REVERSE = {};
for (const [full, shorts] of Object.entries(FIRST_NAME_ALIASES)) {
  for (const s of shorts) { if (!FIRST_NAME_REVERSE[s]) FIRST_NAME_REVERSE[s] = []; FIRST_NAME_REVERSE[s].push(full); }
}

function matchesPlayer(guess, playerName) {
  const g = normalize(guess);
  const p = normalize(playerName);
  const stripSuffix = s => s.replace(/\b(jr|sr|ii|iii|iv)\b/g, "").replace(/\s+/g, " ").trim();
  if (g === p || stripSuffix(g) === stripSuffix(p)) return true;
  // Last name only matching
  const pParts = stripSuffix(p).split(" ");
  if (pParts.length >= 2) {
    const pLast = pParts.slice(1).join(" ");
    if (stripSuffix(g) === pLast) return true;
  }
  // Nickname matching
  const gParts = stripSuffix(g).split(" ");
  if (gParts.length >= 2) {
    const first = gParts[0], last = gParts.slice(1).join(" ");
    const pStripped = stripSuffix(p);
    for (const fullName of (FIRST_NAME_REVERSE[first] || [])) {
      if (fullName + " " + last === pStripped) return true;
    }
    for (const nick of (FIRST_NAME_ALIASES[first] || [])) {
      if (nick + " " + last === pStripped) return true;
    }
  }
  return false;
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── TEAM BADGE ──────────────────────────────────────────────────────────────
function TeamBadge({ team, revealed, index }) {
  const color = TEAM_COLORS[team] || "#444";
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      animation: revealed ? "popIn .35s cubic-bezier(.34,1.56,.64,1)" : "none",
    }}>
      <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3 }}>
        {index + 1}{index === 0 ? "st" : index === 1 ? "nd" : index === 2 ? "rd" : "th"}
      </div>
      <div style={{
        background: revealed ? color + "25" : "#0a0a1a",
        border: `2px solid ${revealed ? color : "#ffffff0a"}`,
        borderRadius: 10, padding: "10px 18px", minWidth: 100,
        textAlign: "center", transition: "all 0.3s",
      }}>
        {revealed ? (
          <span style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f0", letterSpacing: 0.5 }}>{team}</span>
        ) : (
          <span style={{ fontSize: 18, color: "#ffffff15" }}>?</span>
        )}
      </div>
    </div>
  );
}

function ConnectorArrow() {
  return <div style={{ fontSize: 16, color: "#ffffff15", padding: "0 6px" }}>→</div>;
}

// ── MAIN GAME ────────────────────────────────────────────────────────────────
export default function NFLCareerPath() {
  const [queue, setQueue] = useState(() => shuffleArray(NFL_CAREER_PATHS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(1); // how many teams shown
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [solved, setSolved] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(0);
  const [guessesUsed, setGuessesUsed] = useState(0);
  const inputRef = useRef(null);
  const trackPlay = usePlayCount("nfl-career-path");

  const current = queue[currentIndex % queue.length];
  const totalTeams = current?.teams.length || 0;
  const maxPoints = Math.max(1, totalTeams);

  const reject = useCallback((msg) => {
    setShake(true); setRejectMsg(msg);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setRejectMsg(""), 2000);
  }, []);

  const handleSubmit = useCallback(() => {
    if (solved || skipped) return;
    const val = input.trim();
    if (!val) return;
    trackPlay();
    setGuessesUsed(g => g + 1);

    if (matchesPlayer(val, current.name)) {
      setSolved(true);
      const points = Math.max(1, maxPoints - revealed + 1);
      setScore(s => s + points);
      setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; });
      setTotalRounds(t => t + 1);
      setInput("");
    } else {
      // Wrong guess — reveal another team
      if (revealed < totalTeams) {
        setRevealed(r => r + 1);
        reject("Not quite — here's another team...");
      } else {
        reject("Nope! Try again or skip");
      }
      setInput("");
    }
  }, [input, current, solved, skipped, revealed, totalTeams, maxPoints, reject, trackPlay]);

  const handleSkip = useCallback(() => {
    setSkipped(true);
    setRevealed(totalTeams);
    setStreak(0);
    setTotalRounds(t => t + 1);
  }, [totalTeams]);

  const handleNext = useCallback(() => {
    setCurrentIndex(i => i + 1);
    setRevealed(1);
    setInput("");
    setSolved(false);
    setSkipped(false);
    setRejectMsg("");
    setGuessesUsed(0);
    setRound(r => r + 1);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (solved || skipped) handleNext();
      else handleSubmit();
    }
  };

  useEffect(() => { inputRef.current?.focus(); }, [currentIndex]);

  if (!current) return null;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 30% 10%, #0f0a1a 0%, #07070f 55%), radial-gradient(ellipse at 70% 90%, #0a120f 0%, transparent 50%)",
      color: "#f0f0f0", fontFamily: "'Oswald', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "84px 16px 60px",
    }}>
      <Helmet>
        <title>NFL Career Path – TrivialSports</title>
        <meta name="description" content="Guess the NFL player from their career journey. Teams are revealed one at a time — can you name them with fewer clues?" />
        <meta property="og:title" content="NFL Career Path – TrivialSports" />
        <meta property="og:description" content="Guess the NFL player from their career journey." />
        <meta property="og:url" content="https://trivialsports.com/games/nfl-career-path" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff18", textTransform: "uppercase", marginBottom: 6 }}>NFL</div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,42px)", fontWeight: 900, margin: 0, lineHeight: 1,
          background: "linear-gradient(135deg,#e74c3c,#f39c12,#e8c060)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1,
        }}>Career Path</h1>
        <p style={{ fontSize: 12, margin: "8px 0 0", letterSpacing: 1, textTransform: "uppercase", color: "#ffffff40" }}>
          Guess the player from their team history
        </p>
      </div>

      {/* Score bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 24,
        background: "#0b0b1e", border: "1px solid #161632",
        borderRadius: 12, padding: "12px 28px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#f39c12", lineHeight: 1 }}>{score}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Score</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: streak > 0 ? "#22c55e" : "#ffffff28", lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Streak</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#5bb8f5", lineHeight: 1 }}>{bestStreak}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Best</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#c8a050", lineHeight: 1 }}>{totalRounds}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Played</div>
        </div>
      </div>

      {/* Round indicator */}
      <div style={{ fontSize: 9, color: "#ffffff20", letterSpacing: 4, textTransform: "uppercase", marginBottom: 16 }}>
        Round {round} — {totalTeams} career stops — {revealed}/{totalTeams} revealed
      </div>

      {/* Career path display */}
      <div style={{
        width: "100%", maxWidth: 700,
        background: "#08081a", border: "1px solid #111128",
        borderRadius: 16, padding: "24px 20px", marginBottom: 24,
        overflowX: "auto",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          flexWrap: "wrap", gap: 6, rowGap: 14,
        }}>
          {current.teams.map((team, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <TeamBadge team={team} revealed={i < revealed} index={i} />
              {i < current.teams.length - 1 && <ConnectorArrow />}
            </div>
          ))}
        </div>
      </div>

      {/* Solved / Skipped state */}
      {(solved || skipped) && (
        <div style={{
          width: "100%", maxWidth: 520, marginBottom: 20,
          background: solved ? "linear-gradient(135deg,#0d2b14,#0f3318)" : "linear-gradient(135deg,#2b1a0d,#33200f)",
          border: `1px solid ${solved ? "#22c55e44" : "#e8c06044"}`,
          borderRadius: 14, padding: "20px 24px", textAlign: "center",
          animation: "fadeUp .3s ease",
        }}>
          <div style={{ fontSize: 36, marginBottom: 6 }}>{solved ? "✅" : "💡"}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: solved ? "#22c55e" : "#e8c060", letterSpacing: 1 }}>
            {current.name}
          </div>
          {solved && (
            <div style={{ fontSize: 12, color: "#a0a0c0", marginTop: 6 }}>
              +{Math.max(1, maxPoints - revealed + 1)} points — guessed with {revealed} of {totalTeams} teams revealed
            </div>
          )}
          {skipped && (
            <div style={{ fontSize: 12, color: "#a0a0c0", marginTop: 6 }}>
              Streak reset — the answer was {current.name}
            </div>
          )}
          <button onClick={handleNext} style={{
            marginTop: 16, background: "linear-gradient(135deg,#1a4a6e,#1e5580)",
            border: "1px solid #2a6a9e44", borderRadius: 10, padding: "11px 32px",
            fontSize: 12, fontWeight: 900, color: "#5bb8f5",
            cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
          }}>Next Player →</button>
        </div>
      )}

      {/* Input area */}
      {!solved && !skipped && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setRejectMsg(""); }}
              onKeyDown={handleKeyDown}
              placeholder="Guess the player..."
              autoComplete="off"
              autoFocus
              style={{
                width: "100%", background: "#07071a",
                border: `2px solid ${shake ? "#e74c3c" : "#141432"}`,
                borderRadius: 12, padding: "14px 18px",
                fontSize: 16, color: "#f0f0f0", outline: "none",
                fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                letterSpacing: 0.5, boxSizing: "border-box",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = "#f39c1255"}
              onBlur={e => e.target.style.borderColor = "#141432"}
            />
          </div>

          {rejectMsg && (
            <div style={{
              marginTop: 8, fontSize: 11, color: "#e8c060cc",
              letterSpacing: 1, textAlign: "center", animation: "fadeUp .2s ease",
            }}>{rejectMsg}</div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button onClick={handleSubmit} style={{
              flex: 1, background: "linear-gradient(135deg,#1a4a6e,#1e5580)",
              border: "1px solid #2a6a9e44", borderRadius: 10, padding: "12px 0",
              fontSize: 12, fontWeight: 900, color: "#5bb8f5",
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            }}>Guess →</button>
            <button onClick={handleSkip} style={{
              padding: "12px 20px", background: "transparent",
              border: "1px solid #ffffff18", borderRadius: 10,
              fontSize: 11, fontWeight: 700, color: "#ffffff44",
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            }}>Give Up</button>
          </div>
        </div>
      )}
    </div>
  );
}
