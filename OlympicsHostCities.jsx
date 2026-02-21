import { useState, useRef } from "react";
import { usePlayCount } from "./usePlayCount.jsx";

const SUMMER = [
  { year: 1896, city: "Athens",        aliases: ["athens", "athina"] },
  { year: 1900, city: "Paris",         aliases: ["paris"] },
  { year: 1904, city: "St. Louis",     aliases: ["st louis", "saint louis"] },
  { year: 1908, city: "London",        aliases: ["london"] },
  { year: 1912, city: "Stockholm",     aliases: ["stockholm"] },
  { year: 1920, city: "Antwerp",       aliases: ["antwerp", "antwerpen"] },
  { year: 1924, city: "Paris",         aliases: ["paris"] },
  { year: 1928, city: "Amsterdam",     aliases: ["amsterdam"] },
  { year: 1932, city: "Los Angeles",   aliases: ["los angeles", "la", "l.a."] },
  { year: 1936, city: "Berlin",        aliases: ["berlin"] },
  { year: 1948, city: "London",        aliases: ["london"] },
  { year: 1952, city: "Helsinki",      aliases: ["helsinki"] },
  { year: 1956, city: "Melbourne",     aliases: ["melbourne"] },
  { year: 1960, city: "Rome",          aliases: ["rome", "roma"] },
  { year: 1964, city: "Tokyo",         aliases: ["tokyo"] },
  { year: 1968, city: "Mexico City",   aliases: ["mexico city", "mexico", "ciudad de mexico"] },
  { year: 1972, city: "Munich",        aliases: ["munich", "munchen"] },
  { year: 1976, city: "Montreal",      aliases: ["montreal", "montréal"] },
  { year: 1980, city: "Moscow",        aliases: ["moscow", "moskva"] },
  { year: 1984, city: "Los Angeles",   aliases: ["los angeles", "la", "l.a."] },
  { year: 1988, city: "Seoul",         aliases: ["seoul"] },
  { year: 1992, city: "Barcelona",     aliases: ["barcelona"] },
  { year: 1996, city: "Atlanta",       aliases: ["atlanta"] },
  { year: 2000, city: "Sydney",        aliases: ["sydney"] },
  { year: 2004, city: "Athens",        aliases: ["athens", "athina"] },
  { year: 2008, city: "Beijing",       aliases: ["beijing", "peking"] },
  { year: 2012, city: "London",        aliases: ["london"] },
  { year: 2016, city: "Rio de Janeiro",aliases: ["rio de janeiro", "rio"] },
  { year: 2020, city: "Tokyo",         aliases: ["tokyo"] },
  { year: 2024, city: "Paris",         aliases: ["paris"] },
];

const WINTER = [
  { year: 1924, city: "Chamonix",          aliases: ["chamonix"] },
  { year: 1928, city: "St. Moritz",        aliases: ["st moritz", "saint moritz"] },
  { year: 1932, city: "Lake Placid",       aliases: ["lake placid"] },
  { year: 1936, city: "Garmisch-Partenkirchen", aliases: ["garmisch", "garmisch partenkirchen"] },
  { year: 1948, city: "St. Moritz",        aliases: ["st moritz", "saint moritz"] },
  { year: 1952, city: "Oslo",              aliases: ["oslo"] },
  { year: 1956, city: "Cortina d'Ampezzo",aliases: ["cortina", "cortina dampezzo", "cortina d'ampezzo"] },
  { year: 1960, city: "Squaw Valley",      aliases: ["squaw valley", "palisades tahoe"] },
  { year: 1964, city: "Innsbruck",         aliases: ["innsbruck"] },
  { year: 1968, city: "Grenoble",          aliases: ["grenoble"] },
  { year: 1972, city: "Sapporo",           aliases: ["sapporo"] },
  { year: 1976, city: "Innsbruck",         aliases: ["innsbruck"] },
  { year: 1980, city: "Lake Placid",       aliases: ["lake placid"] },
  { year: 1984, city: "Sarajevo",          aliases: ["sarajevo"] },
  { year: 1988, city: "Calgary",           aliases: ["calgary"] },
  { year: 1992, city: "Albertville",       aliases: ["albertville"] },
  { year: 1994, city: "Lillehammer",       aliases: ["lillehammer"] },
  { year: 1998, city: "Nagano",            aliases: ["nagano"] },
  { year: 2002, city: "Salt Lake City",    aliases: ["salt lake city", "salt lake", "slc"] },
  { year: 2006, city: "Turin",             aliases: ["turin", "torino"] },
  { year: 2010, city: "Vancouver",         aliases: ["vancouver"] },
  { year: 2014, city: "Sochi",             aliases: ["sochi"] },
  { year: 2018, city: "Pyeongchang",       aliases: ["pyeongchang", "pyongchang"] },
  { year: 2022, city: "Beijing",           aliases: ["beijing", "peking"] },
  { year: 2026, city: "Milan-Cortina",     aliases: ["milan", "milan cortina", "milano cortina", "cortina"] },
];

function normalize(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

function SlotRow({ game, solved, revealed, flashing }) {
  const shown = solved || revealed;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "6px 12px", borderRadius: 7,
      background: flashing ? "#c8a05018" : revealed ? "#e74c3c08" : solved ? "#ffffff06" : "transparent",
      border: `1px solid ${flashing ? "#c8a05055" : revealed ? "#e74c3c22" : solved ? "#ffffff12" : "#ffffff07"}`,
      transition: "all 0.3s",
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, fontFamily: "'Oswald', sans-serif",
        letterSpacing: 1, color: "#ffffff25", minWidth: 36, textAlign: "right",
      }}>{game.year}</span>
      <div style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: revealed ? "#e74c3c" : solved ? "#22c55e" : "#ffffff15",
        boxShadow: revealed ? "0 0 5px #e74c3c88" : solved ? "0 0 5px #22c55e88" : "none",
        transition: "all 0.3s",
      }} />
      <span style={{
        fontSize: 13, fontFamily: "'Oswald', sans-serif",
        fontWeight: shown ? 600 : 400, letterSpacing: 0.5,
        color: revealed ? "#e8806080" : solved ? "#e8e8f0" : "#ffffff18",
        transition: "color 0.3s",
      }}>
        {shown ? game.city : "———————————"}
      </span>
    </div>
  );
}

export default function OlympicsHostCities() {
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [revealedSet, setRevealedSet] = useState(new Set());
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(null);
  const [giveUp, setGiveUp] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const inputRef = useRef(null);
  const trackPlay = usePlayCount("olympics-host-cities");

  const ALL = [
    ...SUMMER.map((g, i) => ({ ...g, key: `s${i}`, type: "summer" })),
    ...WINTER.map((g, i) => ({ ...g, key: `w${i}`, type: "winter" })),
  ];

  const totalSummer = SUMMER.length;
  const totalWinter = WINTER.length;
  const solvedSummer = SUMMER.filter((_, i) => solvedSet.has(`s${i}`)).length;
  const solvedWinter = WINTER.filter((_, i) => solvedSet.has(`w${i}`)).length;
  const total = ALL.length;
  const solved = solvedSet.size;
  const done = giveUp || solved === total;

  function handleInput(e) {
    const val = e.target.value;
    setInput(val);
    trackPlay();

    const norm = normalize(val);
    const matches = ALL.filter(g =>
      !solvedSet.has(g.key) && !revealedSet.has(g.key) &&
      (normalize(g.city) === norm || g.aliases.some(a => normalize(a) === norm))
    );

    if (matches.length > 0) {
      const newSolved = new Set([...solvedSet, ...matches.map(m => m.key)]);
      setSolvedSet(newSolved);
      setFlash(matches[0].key);
      setTimeout(() => setFlash(null), 800);
      setInput("");
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
      setRevealedSet(new Set(ALL.filter(g => !solvedSet.has(g.key)).map(g => g.key)));
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

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      fontFamily: "'Oswald', sans-serif",
      paddingTop: 80, paddingBottom: 60,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-6px)} 40%{transform:translateX(6px)} 60%{transform:translateX(-4px)} 80%{transform:translateX(4px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        input:focus { outline: none; }
        input::placeholder { color: #ffffff25; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", animation: "fadeUp 0.4s ease both" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 9, letterSpacing: 4, color: "#5bb8f5", textTransform: "uppercase", marginBottom: 10, opacity: 0.8 }}>
            Olympics
          </div>
          <h1 style={{
            fontSize: "clamp(28px,6vw,52px)", fontWeight: 900, margin: "0 0 8px",
            letterSpacing: -0.5, color: "#e8e8f0", lineHeight: 1,
          }}>
            Olympic Host Cities
          </h1>
          <p style={{ color: "#c8a050", fontSize: 13, margin: "10px 0 0", letterSpacing: 0.5 }}>
            Name all {total} host cities across the Summer and Winter Games
          </p>
        </div>

        {/* Progress + Give Up */}
        <div style={{ marginBottom: 24, display: "flex", alignItems: "stretch", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: "#ffffff40", letterSpacing: 2, textTransform: "uppercase" }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: solved === total ? "#22c55e" : "#e8c060" }}>
                {solved} / {total}
              </span>
            </div>
            <div style={{ height: 4, background: "#ffffff0a", borderRadius: 2, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                width: `${(solved / total) * 100}%`,
                background: solved === total ? "#22c55e" : "linear-gradient(90deg, #c8a050, #e8c060)",
                transition: "width 0.4s ease",
              }} />
            </div>
          </div>
          {!done && (
            <button onClick={handleGiveUp} style={{
              padding: "0 16px", borderRadius: 6, cursor: "pointer",
              fontFamily: "'Oswald', sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase", background: "transparent",
              border: `1px solid ${confirmGiveUp ? "#e74c3c" : "#ffffff18"}`,
              color: confirmGiveUp ? "#e74c3c" : "#ffffff40",
              transition: "all 0.2s", whiteSpace: "nowrap",
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
              placeholder="Type a host city..."
              autoFocus
              style={{
                width: "100%", boxSizing: "border-box",
                padding: "14px 20px", background: "#0e0e22",
                border: "1px solid #5bb8f555", borderRadius: 10,
                color: "#e8e8f0", fontSize: 15,
                fontFamily: "'Oswald', sans-serif", letterSpacing: 0.5,
              }}
            />
          </div>
        )}

        {/* Win state */}
        {solved === total && (
          <div style={{
            textAlign: "center", padding: "20px 24px", marginBottom: 28,
            background: "#0d2a18", border: "1px solid #22c55e33", borderRadius: 12,
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>GOLD MEDAL!</div>
            <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 6 }}>All {total} host cities named.</div>
          </div>
        )}

        {/* Give up state */}
        {giveUp && solved < total && (
          <div style={{
            textAlign: "center", padding: "16px 24px", marginBottom: 28,
            background: "#1a0808", border: "1px solid #e74c3c33", borderRadius: 12,
          }}>
            <div style={{ fontSize: 15, color: "#e74c3c", fontWeight: 700 }}>
              You got {solved} of {total}
            </div>
          </div>
        )}

        {/* Two columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Summer */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
                color: "#e8c060", background: "#e8c06014",
                border: "1px solid #e8c06028", padding: "4px 12px", borderRadius: 5,
              }}>
                ☀ Summer
              </div>
              <span style={{ fontSize: 11, color: "#ffffff30", letterSpacing: 1 }}>
                {solvedSummer}/{totalSummer}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {SUMMER.map((game, i) => (
                <SlotRow
                  key={`s${i}`}
                  game={game}
                  solved={solvedSet.has(`s${i}`)}
                  revealed={revealedSet.has(`s${i}`)}
                  flashing={flash === `s${i}`}
                />
              ))}
            </div>
          </div>

          {/* Winter */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
                color: "#5bb8f5", background: "#5bb8f514",
                border: "1px solid #5bb8f528", padding: "4px 12px", borderRadius: 5,
              }}>
                ❄ Winter
              </div>
              <span style={{ fontSize: 11, color: "#ffffff30", letterSpacing: 1 }}>
                {solvedWinter}/{totalWinter}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {WINTER.map((game, i) => (
                <SlotRow
                  key={`w${i}`}
                  game={game}
                  solved={solvedSet.has(`w${i}`)}
                  revealed={revealedSet.has(`w${i}`)}
                  flashing={flash === `w${i}`}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Reset */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 28 }}>
          <button onClick={handleReset} style={{
            padding: "9px 22px", borderRadius: 8, cursor: "pointer",
            fontFamily: "'Oswald', sans-serif", fontSize: 11, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase",
            background: "transparent", border: "1px solid #ffffff18",
            color: "#ffffff40", transition: "all 0.2s",
          }}>
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}
