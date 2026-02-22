import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

// All 51 clubs to have played in the Premier League (1992/93 - 2024/25)
const PL_TEAMS = [
  { name: "Arsenal",              aliases: ["the arsenal", "gunners", "afc"] },
  { name: "Aston Villa",          aliases: ["villa", "avfc", "the villans", "villans"] },
  { name: "Barnsley",             aliases: [] },
  { name: "Birmingham City",      aliases: ["birmingham", "blues", "bcfc"] },
  { name: "Blackburn Rovers",     aliases: ["blackburn", "rovers", "bbrfc"] },
  { name: "Blackpool",            aliases: ["the seasiders", "seasiders"] },
  { name: "Bolton Wanderers",     aliases: ["bolton", "wanderers", "trotters"] },
  { name: "Bournemouth",          aliases: ["afc bournemouth", "the cherries", "cherries"] },
  { name: "Bradford City",        aliases: ["bradford", "bantams"] },
  { name: "Brentford",            aliases: ["the bees", "bees", "bfc"] },
  { name: "Brighton",             aliases: ["brighton & hove albion", "brighton and hove albion", "albion", "seagulls", "bhafc"] },
  { name: "Burnley",              aliases: ["the clarets", "clarets"] },
  { name: "Cardiff City",         aliases: ["cardiff", "the bluebirds", "bluebirds"] },
  { name: "Charlton Athletic",    aliases: ["charlton", "the addicks", "addicks"] },
  { name: "Chelsea",              aliases: ["the blues", "cfc"] },
  { name: "Coventry City",        aliases: ["coventry", "sky blues"] },
  { name: "Crystal Palace",       aliases:["palace", "cpfc", "the eagles", "eagles"] },
  { name: "Derby County",         aliases: ["derby", "the rams", "rams", "dcfc"] },
  { name: "Everton",              aliases: ["the toffees", "toffees", "efc"] },
  { name: "Fulham",               aliases: ["the cottagers", "cottagers", "ffc"] },
  { name: "Huddersfield Town",    aliases: ["huddersfield", "the terriers", "terriers"] },
  { name: "Hull City",            aliases: ["hull", "the tigers", "tigers"] },
  { name: "Ipswich Town",         aliases: ["ipswich", "the tractor boys", "tractor boys", "blues"] },
  { name: "Leeds United",         aliases: ["leeds", "the whites", "whites", "lufc"] },
  { name: "Leicester City",       aliases: ["leicester", "the foxes", "foxes", "lcfc"] },
  { name: "Liverpool",            aliases: ["the reds", "lfc", "pool"] },
  { name: "Luton Town",           aliases: ["luton", "the hatters", "hatters"] },
  { name: "Manchester City",      aliases: ["man city", "mcfc", "the citizens", "citizens"] },
  { name: "Manchester United",    aliases: ["man united", "man utd", "man u", "united", "mufc", "the red devils", "red devils"] },
  { name: "Middlesbrough",        aliases: ["boro", "the boro", "mfc"] },
  { name: "Newcastle United",     aliases: ["newcastle", "nufc", "the magpies", "magpies", "toon"] },
  { name: "Norwich City",         aliases: ["norwich", "the canaries", "canaries", "ncfc"] },
  { name: "Nottingham Forest",    aliases: ["forest", "nffc", "the tricky trees", "tricky trees"] },
  { name: "Oldham Athletic",      aliases: ["oldham", "the latics", "latics"] },
  { name: "Portsmouth",           aliases: ["pompey"] },
  { name: "Queens Park Rangers",  aliases: ["qpr", "rangers", "the hoops", "hoops"] },
  { name: "Reading",              aliases: ["the royals", "royals", "rfc"] },
  { name: "Sheffield United",     aliases: ["sheffield utd", "the blades", "blades", "sufc"] },
  { name: "Sheffield Wednesday",  aliases: ["wednesday", "the owls", "owls", "swfc"] },
  { name: "Southampton",          aliases: ["saints", "the saints", "sfc"] },
  { name: "Stoke City",           aliases: ["stoke", "the potters", "potters"] },
  { name: "Sunderland",           aliases: ["the black cats", "black cats", "safc"] },
  { name: "Swansea City",         aliases: ["swansea", "the swans", "scfc"] },
  { name: "Swindon Town",         aliases: ["swindon", "the robins", "robins"] },
  { name: "Tottenham Hotspur",    aliases: ["tottenham", "spurs", "thfc", "the lilywhites"] },
  { name: "Watford",              aliases: ["the hornets", "hornets", "wfc"] },
  { name: "West Bromwich Albion", aliases: ["west brom", "wba", "the baggies", "baggies", "albion"] },
  { name: "West Ham United",      aliases: ["west ham", "the hammers", "hammers", "irons", "whufc"] },
  { name: "Wigan Athletic",       aliases: ["wigan", "the latics", "latics"] },
  { name: "Wimbledon",            aliases: ["the dons", "dons", "crazy gang"] },
  { name: "Wolverhampton Wanderers", aliases: ["wolves", "wolverhampton", "wwfc"] },
];

const TOTAL = PL_TEAMS.length;

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ");
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
      padding: "7px 12px",
      borderRadius: 7,
      background: flashing ? "#22c55e18" : revealed ? "#e74c3c08" : solved ? "#ffffff06" : "transparent",
      border: `1px solid ${flashing ? "#22c55e55" : revealed ? "#e74c3c22" : solved ? "#ffffff12" : "#ffffff07"}`,
      transition: "all 0.3s",
    }}>
      <Helmet>
  <title>Premier League Teams – TrivialSports</title>
  <meta name="description" content="Name every club to have played in the Premier League since 1992. Think you know them all?" />
  <meta property="og:title" content="Premier League Teams – TrivialSports" />
  <meta property="og:description" content="Name every club to have played in the Premier League since 1992. Think you know them all?" />
  <meta property="og:url" content="https://trivialsports.com/games/pl-teams" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
</Helmet>
      <div style={{
        width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
        background: revealed ? "#e74c3c" : solved ? "#22c55e" : "#ffffff15",
        boxShadow: revealed ? "0 0 6px #e74c3c88" : solved ? "0 0 6px #22c55e88" : "none",
        transition: "all 0.3s",
      }} />
      <span style={{
        fontSize: 12,
        fontFamily: "'Oswald', sans-serif",
        fontWeight: shown ? 600 : 400,
        color: revealed ? "#e8806080" : solved ? "#e8e8f0" : "#ffffff20",
        letterSpacing: 0.5,
        transition: "color 0.3s",
      }}>
        {shown ? team.name : "———————————"}
      </span>
    </div>
  );
}

export default function PLTeams() {
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null);
  const [giveUp, setGiveUp] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const trackPlay = usePlayCount("pl-teams");
  const inputRef = useRef(null);

  const solved = solvedSet.size;
  const done = giveUp || solved === TOTAL;

  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [done]);

  function handleInput(e) {
    trackPlay();
    const val = e.target.value;
    setInput(val);
    const match = PL_TEAMS.find(t =>
      !solvedSet.has(t.name) && !revealedSet.has(t.name) && checkGuess(val, t)
    );
    if (match) {
      setSolvedSet(prev => new Set([...prev, match.name]));
      setFlash(match.name);
      setTimeout(() => setFlash(null), 800);
      setInput("");
      if (solvedSet.size + 1 === TOTAL) setGiveUp(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && input.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  function handleGiveUp() {
    if (confirmGiveUp) {
      setRevealedSet(new Set(
        PL_TEAMS.filter(t => !solvedSet.has(t.name)).map(t => t.name)
      ));
      setGiveUp(true);
      setConfirmGiveUp(false);
    } else {
      setConfirmGiveUp(true);
      setTimeout(() => setConfirmGiveUp(false), 3000);
    }
  }

  function handleReset() {
    setSolvedSet(new Set());
    setRevealedSet(new Set());
    setInput("");
    setGiveUp(false);
    setConfirmGiveUp(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  const sorted = [...PL_TEAMS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      fontFamily: "'Oswald', sans-serif",
      paddingTop: 80,
      paddingBottom: 60,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input:focus { outline: none; }
        input::placeholder { color: #ffffff25; }
      `}</style>

      <div style={{
        maxWidth: 760, margin: "0 auto", padding: "0 24px",
        animation: "fadeUp 0.4s ease both",
      }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#27ae60", textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
            Soccer · Premier League
          </div>
          <h1 style={{
            fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, margin: "0 0 8px",
            letterSpacing: -0.5, color: "#e8e8f0", lineHeight: 1,
          }}>
            All-Time Premier League Teams
          </h1>
          <p style={{ color: "#c8a050", fontSize: 13, margin: "10px 0 0", letterSpacing: 0.5 }}>
            Name all {TOTAL} clubs that have played in the Premier League since 1992
          </p>
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "stretch", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 8,
            }}>
              <span style={{ fontSize: 11, color: "#ffffff40", letterSpacing: 2, textTransform: "uppercase" }}>
                Progress
              </span>
              <span style={{ fontSize: 13, fontWeight: 700, color: solved === TOTAL ? "#22c55e" : "#e8c060" }}>
                {solved} / {TOTAL}
              </span>
            </div>
            <div style={{ height: 4, background: "#ffffff0a", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${(solved / TOTAL) * 100}%`,
                background: solved === TOTAL ? "#22c55e" : "linear-gradient(90deg, #c8a050, #e8c060)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
          {!done && (
            <button onClick={handleGiveUp} style={{
              padding: "0 16px", borderRadius: 6, cursor: "pointer",
              fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase",
              background: "transparent",
              border: `1px solid ${confirmGiveUp ? "#e74c3c" : "#ffffff18"}`,
              color: confirmGiveUp ? "#e74c3c" : "#ffffff40",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}>
              {confirmGiveUp ? "Are you sure?" : "Give Up"}
            </button>
          )}
        </div>

        {/* Input */}
        {!done && (
          <div style={{
            position: "relative", marginBottom: 28,
            animation: shake ? "shake 0.5s ease" : "none",
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type a club name..."
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "14px 20px",
                background: "#0e0e22",
                border: "1px solid #5bb8f555",
                borderRadius: 10,
                color: "#e8e8f0",
                fontSize: 15,
                fontFamily: "'Oswald', sans-serif",
                letterSpacing: 0.5,
              }}
            />
          </div>
        )}

        {/* Win state */}
        {solved === TOTAL && (
          <div style={{
            textAlign: "center", padding: "20px 24px", marginBottom: 28,
            background: "#0d2a18", border: "1px solid #22c55e33", borderRadius: 12,
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>FULL HOUSE!</div>
            <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 6 }}>
              All {TOTAL} Premier League clubs named. Proper football knowledge.
            </div>
          </div>
        )}

        {/* Give up state */}
        {giveUp && solved < TOTAL && (
          <div style={{
            textAlign: "center", padding: "16px 24px", marginBottom: 28,
            background: "#1a0808", border: "1px solid #e74c3c33", borderRadius: 12,
          }}>
            <div style={{ fontSize: 15, color: "#e74c3c", fontWeight: 700 }}>
              You got {solved} of {TOTAL}
            </div>
          </div>
        )}

        {/* Teams grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 4,
          marginBottom: 28,
        }}>
          {sorted.map(team => (
            <TeamSlot
              key={team.name}
              team={team}
              solved={solvedSet.has(team.name)}
              revealed={revealedSet.has(team.name)}
              flashing={flash === team.name}
            />
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={handleReset} style={{
            padding: "9px 22px", borderRadius: 8, cursor: "pointer",
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase",
            background: "transparent",
            border: "1px solid #ffffff18",
            color: "#ffffff40",
            transition: "all 0.2s",
          }}>
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
