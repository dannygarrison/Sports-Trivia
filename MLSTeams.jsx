import { useState, useRef, useEffect } from "react";
import { usePlayCount } from "./usePlayCount.jsx";

const EASTERN = [
  { name: "Atlanta United", aliases: ["Atlanta United FC", "Atlanta"] },
  { name: "CF Montréal", aliases: ["CF Montreal", "Montreal", "Montréal", "Club de Foot Montreal"] },
  { name: "Charlotte FC", aliases: ["Charlotte"] },
  { name: "Chicago Fire", aliases: ["Chicago Fire FC", "Fire"] },
  { name: "Columbus Crew", aliases: ["Crew"] },
  { name: "D.C. United", aliases: ["DC United", "D.C. United", "DCU"] },
  { name: "FC Cincinnati", aliases: ["Cincinnati", "FCC"] },
  { name: "Inter Miami", aliases: ["Inter Miami CF", "Miami"] },
  { name: "Nashville SC", aliases: ["Nashville"] },
  { name: "New England Revolution", aliases: ["New England", "Revs", "Revolution"] },
  { name: "New York City FC", aliases: ["NYCFC", "NYC FC", "New York City"] },
  { name: "New York Red Bulls", aliases: ["Red Bulls", "NYRB", "NY Red Bulls"] },
  { name: "Orlando City", aliases: ["Orlando City SC", "Orlando"] },
  { name: "Philadelphia Union", aliases: ["Philadelphia", "Union"] },
  { name: "Toronto FC", aliases: ["Toronto"] },
];

const WESTERN = [
  { name: "Austin FC", aliases: ["Austin"] },
  { name: "Colorado Rapids", aliases: ["Colorado", "Rapids"] },
  { name: "FC Dallas", aliases: ["Dallas"] },
  { name: "Houston Dynamo", aliases: ["Houston Dynamo FC", "Houston", "Dynamo"] },
  { name: "LA Galaxy", aliases: ["Los Angeles Galaxy", "Galaxy"] },
  { name: "LAFC", aliases: ["Los Angeles FC", "LA FC"] },
  { name: "Minnesota United", aliases: ["Minnesota United FC", "Minnesota", "Loons"] },
  { name: "Portland Timbers", aliases: ["Portland", "Timbers"] },
  { name: "Real Salt Lake", aliases: ["RSL", "Salt Lake"] },
  { name: "San Diego FC", aliases: ["San Diego"] },
  { name: "San Jose Earthquakes", aliases: ["San Jose", "Earthquakes", "Quakes"] },
  { name: "Seattle Sounders", aliases: ["Seattle Sounders FC", "Seattle", "Sounders"] },
  { name: "Sporting Kansas City", aliases: ["Sporting KC", "Kansas City", "SKC"] },
  { name: "St. Louis City", aliases: ["St. Louis City SC", "St Louis City", "STL City", "St. Louis"] },
  { name: "Vancouver Whitecaps", aliases: ["Vancouver Whitecaps FC", "Vancouver", "Whitecaps"] },
];

const ALL_TEAMS = [...EASTERN, ...WESTERN];
const TOTAL = ALL_TEAMS.length;

function normalize(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

function checkGuess(guess, team) {
  const g = normalize(guess);
  if (normalize(team.name) === g) return true;
  return team.aliases.some(a => normalize(a) === g);
}

function TeamSlot({ team, solved, revealed, flashing }) {
  const shown = solved || revealed;
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "6px 10px",
      borderRadius: 7,
      marginBottom: 3,
      background: flashing ? "#22c55e18" : revealed ? "#e74c3c08" : solved ? "#ffffff06" : "transparent",
      border: `1px solid ${flashing ? "#22c55e55" : revealed ? "#e74c3c22" : solved ? "#ffffff10" : "#ffffff07"}`,
      transition: "all 0.3s",
    }}>
      <div style={{
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: revealed ? "#e74c3c" : solved ? "#22c55e" : "#ffffff15",
        flexShrink: 0,
        transition: "background 0.3s",
        boxShadow: revealed ? "0 0 6px #e74c3c88" : solved ? "0 0 6px #22c55e88" : "none",
      }} />
      <span style={{
        fontSize: 12,
        fontFamily: "'Oswald', sans-serif",
        fontWeight: shown ? 600 : 400,
        color: revealed ? "#e8806080" : solved ? "#e8e8f0" : "#ffffff22",
        letterSpacing: 0.3,
        transition: "color 0.3s",
      }}>
        {shown ? team.name : "???"}
      </span>
    </div>
  );
}

function ConferencePanel({ label, teams, solvedSet, revealedSet, flash }) {
  const solved = teams.filter(t => solvedSet.has(t.name));
  const pct = (solved.length + (revealedSet ? teams.filter(t => revealedSet.has(t.name)).length : 0)) / teams.length;
  const allDone = solved.length === teams.length && (!revealedSet || teams.every(t => solvedSet.has(t.name)));

  return (
    <div style={{
      flex: "1 1 280px",
      minWidth: 0,
      background: "linear-gradient(165deg,#0b0b1f,#080816)",
      border: `1px solid ${allDone ? "#22c55e33" : "#ffffff0a"}`,
      borderRadius: 18,
      overflow: "hidden",
      transition: "border-color 0.4s",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 18px 14px",
        background: "linear-gradient(135deg,#0d0d24,#0a0a1c)",
        borderBottom: "1px solid #ffffff08",
      }}>
        <div style={{
          fontSize: 9,
          letterSpacing: 5,
          color: "#c8a05066",
          textTransform: "uppercase",
          fontFamily: "'Oswald', sans-serif",
          marginBottom: 4,
        }}>MLS</div>
        <div style={{
          fontSize: 20,
          fontWeight: 900,
          fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1,
          textTransform: "uppercase",
          color: allDone ? "#22c55e" : "#ffffff",
          transition: "color 0.3s",
        }}>{label}</div>
        <div style={{
          marginTop: 10,
          fontSize: 11,
          fontFamily: "'Oswald', sans-serif",
          color: allDone ? "#22c55e" : "#c8a050",
          fontWeight: 700,
          letterSpacing: 1,
        }}>
          {allDone ? "✓ Complete!" : `${solved.length} / ${teams.length}`}
        </div>
        <div style={{ marginTop: 6, height: 3, background: "#ffffff0a", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${pct * 100}%`,
            background: allDone ? "#22c55e" : "linear-gradient(90deg,#8a6020,#e8c85a)",
            borderRadius: 2,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Team list */}
      <div style={{ padding: "12px 10px 14px" }}>
        {teams.map(t => (
          <TeamSlot
            key={t.name}
            team={t}
            solved={solvedSet.has(t.name)}
            revealed={revealedSet && revealedSet.has(t.name)}
            flashing={flash === t.name}
          />
        ))}
      </div>
    </div>
  );
}

export default function MLSTeams() {
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(null);
  const [shake, setShake] = useState(false);
  const [lastWrong, setLastWrong] = useState("");
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const trackPlay = usePlayCount("mls-teams");
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const solved = solvedSet.size;
  const allDone = solvedSet.size === TOTAL;
  const gaveUp = revealedSet.size > 0;

  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => setTimeElapsed(t => t + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished]);

  useEffect(() => {
    if (allDone && started) {
      setFinished(true);
      clearInterval(timerRef.current);
    }
  }, [allDone, started]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleInput = (e) => {
    trackPlay();
    if (!started) setStarted(true);
    const val = e.target.value;
    setInput(val);
    const remaining = ALL_TEAMS.filter(t => !solvedSet.has(t.name));
    const match = remaining.find(t => checkGuess(val, t));
    if (match) {
      setSolvedSet(prev => new Set([...prev, match.name]));
      setInput("");
      setFlash(match.name);
      setLastWrong("");
      setTimeout(() => setFlash(null), 900);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() && !ALL_TEAMS.some(t => checkGuess(input, t))) {
      setShake(true);
      setLastWrong(input.trim());
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleReset = () => {
    setSolvedSet(new Set());
    setRevealedSet(new Set());
    setInput("");
    setFlash(null);
    setStarted(false);
    setTimeElapsed(0);
    setFinished(false);
    setLastWrong("");
    clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 80);
  };

  const handleGiveUp = () => {
    const unrevealed = ALL_TEAMS.filter(t => !solvedSet.has(t.name)).map(t => t.name);
    setRevealedSet(new Set(unrevealed));
    setFinished(true);
    setShowGiveUp(false);
    clearInterval(timerRef.current);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%,#0d1a10 0%,#07070f 60%)",
      color: "#f0f0f0",
      fontFamily: "'Oswald', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "84px 16px 56px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.8)}to{opacity:1;transform:scale(1)}}
        .fadein{animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff22", textTransform: "uppercase", marginBottom: 8 }}>
          MLS
        </div>
        <h1 style={{
          fontSize: "clamp(28px,6vw,50px)", fontWeight: 900, margin: 0, lineHeight: 1,
          background: "linear-gradient(135deg,#1a6b2e,#4ade80,#22c55e,#4ade80,#1a6b2e)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1,
        }}>Name All 30 Teams</h1>
        <p style={{ color: "#ffffff33", fontSize: 10, margin: "8px 0 0", letterSpacing: 3, textTransform: "uppercase" }}>
          Eastern &amp; Western Conference &middot; Type to reveal
        </p>
      </div>

      {/* Stats bar + give up */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{
          display: "flex", background: "#0b0b1e",
          border: "1px solid #161632", borderRadius: 12, overflow: "hidden",
        }}>
          <div style={{ padding: "13px 28px", textAlign: "center", borderRight: "1px solid #161632" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: allDone ? "#22c55e" : "#c8a050", lineHeight: 1 }}>
              {solvedSet.size}
            </div>
            <div style={{ fontSize: 8, color: "#ffffff33", letterSpacing: 4, textTransform: "uppercase", marginTop: 3 }}>
              Found
            </div>
          </div>
          <div style={{ padding: "13px 28px", textAlign: "center", borderRight: "1px solid #161632" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#c8a050", lineHeight: 1 }}>
              {TOTAL - solvedSet.size - revealedSet.size}
            </div>
            <div style={{ fontSize: 8, color: "#ffffff33", letterSpacing: 4, textTransform: "uppercase", marginTop: 3 }}>
              Left
            </div>
          </div>
          <div style={{ padding: "13px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#c8a050", lineHeight: 1 }}>
              {formatTime(timeElapsed)}
            </div>
            <div style={{ fontSize: 8, color: "#ffffff33", letterSpacing: 4, textTransform: "uppercase", marginTop: 3 }}>
              Time
            </div>
          </div>
        </div>
        {started && !allDone && !gaveUp && (
          <button onClick={() => setShowGiveUp(true)} style={{
            background: "transparent", color: "#e74c3c88",
            border: "1px solid #e74c3c33", borderRadius: 10,
            padding: "10px 18px", fontSize: 11, fontWeight: 700,
            cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
            transition: "color .2s, border-color .2s, background .2s",
            fontFamily: "'Oswald', sans-serif", whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#e74c3c"; e.currentTarget.style.borderColor = "#e74c3c66"; e.currentTarget.style.background = "#e74c3c0a"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#e74c3c88"; e.currentTarget.style.borderColor = "#e74c3c33"; e.currentTarget.style.background = "transparent"; }}
          >Give Up</button>
        )}
      </div>

      {/* Input */}
      {!allDone && !gaveUp && (
        <div style={{ width: "100%", maxWidth: 500, marginBottom: 28 }}>
          <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type an MLS team..."
              autoComplete="off"
              style={{
                width: "100%",
                background: "#07071a",
                border: `2px solid ${shake ? "#e74c3c" : "#141432"}`,
                borderRadius: 12,
                padding: "14px 18px",
                fontSize: 17,
                color: "#f0f0f0",
                outline: "none",
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 600,
                letterSpacing: 0.5,
                boxSizing: "border-box",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = "#22c55e55"}
              onBlur={e => e.target.style.borderColor = "#141432"}
            />
          </div>
          {lastWrong && (
            <div style={{
              marginTop: 8, fontSize: 11, color: "#e74c3c99",
              fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textAlign: "center",
            }}>
              "{lastWrong}" — not a current MLS team
            </div>
          )}
        </div>
      )}

      {/* Completion banner */}
      {allDone && (
        <div className="fadein" style={{
          width: "100%", maxWidth: 500, marginBottom: 28,
          background: "linear-gradient(135deg,#0d2b14,#0f3318)",
          border: "1px solid #22c55e44",
          borderRadius: 16, padding: "22px 26px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚽</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#22c55e", letterSpacing: 1, textTransform: "uppercase" }}>
            All 30 Teams!
          </div>
          <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 6 }}>
            Finished in {formatTime(timeElapsed)}
          </div>
          <button onClick={handleReset} style={{
            marginTop: 16, background: "#22c55e", color: "#07070f",
            border: "none", borderRadius: 10, padding: "10px 28px",
            fontSize: 13, fontWeight: 900, cursor: "pointer",
            letterSpacing: 1.5, textTransform: "uppercase",
          }}>Play Again</button>
        </div>
      )}

      {/* Conference columns */}
      <div style={{
        display: "flex",
        gap: 16,
        width: "100%",
        maxWidth: 780,
        flexWrap: "wrap",
        justifyContent: "center",
      }}>
        <ConferencePanel
          label="Eastern Conference"
          teams={EASTERN}
          solvedSet={solvedSet}
          revealedSet={revealedSet}
          flash={flash}
        />
        <ConferencePanel
          label="Western Conference"
          teams={WESTERN}
          solvedSet={solvedSet}
          revealedSet={revealedSet}
          flash={flash}
        />
      </div>

      {(started || gaveUp) && !allDone && (
        <button onClick={handleReset} style={{
          marginTop: 28, background: "transparent",
          color: "#ffffff33", border: "1px solid #ffffff11",
          borderRadius: 10, padding: "8px 24px",
          fontSize: 11, fontWeight: 700, cursor: "pointer",
          letterSpacing: 1.5, textTransform: "uppercase",
          transition: "color .2s, border-color .2s",
          fontFamily: "'Oswald', sans-serif",
        }}
          onMouseEnter={e => { e.target.style.color = "#ffffff66"; e.target.style.borderColor = "#ffffff33"; }}
          onMouseLeave={e => { e.target.style.color = "#ffffff33"; e.target.style.borderColor = "#ffffff11"; }}
        >Reset</button>
      )}

      {/* Give up confirmation modal */}
      {showGiveUp && (
        <div style={{
          position: "fixed", inset: 0, background: "#00000088",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 999,
        }} onClick={() => setShowGiveUp(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "linear-gradient(165deg,#0e0e22,#080816)",
            border: "1px solid #252548", borderRadius: 18,
            padding: "30px 32px", maxWidth: 340, width: "90%", textAlign: "center",
          }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 18, fontWeight: 900, color: "#eeeeee", fontFamily: "'Oswald', sans-serif" }}>
              Give Up?
            </h3>
            <p style={{ margin: "0 0 24px", fontSize: 13, color: "#a0a0c0", lineHeight: 1.7, fontFamily: "'Oswald', sans-serif" }}>
              The remaining {TOTAL - solvedSet.size} teams will be revealed.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGiveUp(false)} style={{
                flex: 1, background: "#141432", color: "#c8a050",
                border: "1px solid #c8a05044", borderRadius: 10,
                padding: "11px 0", fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif",
              }}>Keep Going</button>
              <button onClick={handleGiveUp} style={{
                flex: 1, background: "#e74c3c", color: "#fff",
                border: "none", borderRadius: 10,
                padding: "11px 0", fontSize: 12, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif",
              }}>Reveal All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
