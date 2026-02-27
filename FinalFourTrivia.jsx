import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

// year: tournament year, champion, runnerUp, ff1/ff2: other two semifinalists
// 2020 excluded (cancelled due to COVID-19)
const FINAL_FOURS = [
  { year: 2025, champion: "Florida", runnerUp: "Houston", ff1: "Auburn", ff2: "Duke" },
  { year: 2024, champion: "UConn", runnerUp: "Purdue", ff1: "NC State", ff2: "Alabama" },
  { year: 2023, champion: "UConn", runnerUp: "San Diego State", ff1: "FAU", ff2: "Miami" },
  { year: 2022, champion: "Kansas", runnerUp: "North Carolina", ff1: "Duke", ff2: "Villanova" },
  { year: 2021, champion: "Baylor", runnerUp: "Gonzaga", ff1: "Houston", ff2: "UCLA" },
  { year: 2019, champion: "Virginia", runnerUp: "Texas Tech", ff1: "Michigan State", ff2: "Auburn" },
  { year: 2018, champion: "Villanova", runnerUp: "Michigan", ff1: "Kansas", ff2: "Loyola Chicago" },
  { year: 2017, champion: "North Carolina", runnerUp: "Gonzaga", ff1: "Oregon", ff2: "South Carolina" },
  { year: 2016, champion: "Villanova", runnerUp: "North Carolina", ff1: "Oklahoma", ff2: "Syracuse" },
  { year: 2015, champion: "Duke", runnerUp: "Wisconsin", ff1: "Kentucky", ff2: "Michigan State" },
  { year: 2014, champion: "UConn", runnerUp: "Kentucky", ff1: "Florida", ff2: "Wisconsin" },
  { year: 2013, champion: "Louisville", runnerUp: "Michigan", ff1: "Syracuse", ff2: "Wichita State" },
  { year: 2012, champion: "Kentucky", runnerUp: "Kansas", ff1: "Ohio State", ff2: "Louisville" },
  { year: 2011, champion: "UConn", runnerUp: "Butler", ff1: "Kentucky", ff2: "VCU" },
  { year: 2010, champion: "Duke", runnerUp: "Butler", ff1: "West Virginia", ff2: "Michigan State" },
  { year: 2009, champion: "North Carolina", runnerUp: "Michigan State", ff1: "UConn", ff2: "Villanova" },
  { year: 2008, champion: "Kansas", runnerUp: "Memphis", ff1: "North Carolina", ff2: "UCLA" },
  { year: 2007, champion: "Florida", runnerUp: "Ohio State", ff1: "Georgetown", ff2: "UCLA" },
  { year: 2006, champion: "Florida", runnerUp: "UCLA", ff1: "LSU", ff2: "George Mason" },
  { year: 2005, champion: "North Carolina", runnerUp: "Illinois", ff1: "Louisville", ff2: "Michigan State" },
  { year: 2004, champion: "UConn", runnerUp: "Georgia Tech", ff1: "Duke", ff2: "Oklahoma State" },
  { year: 2003, champion: "Syracuse", runnerUp: "Kansas", ff1: "Texas", ff2: "Marquette" },
  { year: 2002, champion: "Maryland", runnerUp: "Indiana", ff1: "Kansas", ff2: "Oklahoma" },
  { year: 2001, champion: "Duke", runnerUp: "Arizona", ff1: "Michigan State", ff2: "Maryland" },
  { year: 2000, champion: "Michigan State", runnerUp: "Florida", ff1: "North Carolina", ff2: "Wisconsin" },
  { year: 1999, champion: "UConn", runnerUp: "Duke", ff1: "Michigan State", ff2: "Ohio State" },
  { year: 1998, champion: "Kentucky", runnerUp: "Utah", ff1: "North Carolina", ff2: "Stanford" },
  { year: 1997, champion: "Arizona", runnerUp: "Kentucky", ff1: "North Carolina", ff2: "Minnesota" },
  { year: 1996, champion: "Kentucky", runnerUp: "Syracuse", ff1: "UMass", ff2: "Mississippi State" },
  { year: 1995, champion: "UCLA", runnerUp: "Arkansas", ff1: "North Carolina", ff2: "Oklahoma State" },
  { year: 1994, champion: "Arkansas", runnerUp: "Duke", ff1: "Arizona", ff2: "Florida" },
  { year: 1993, champion: "North Carolina", runnerUp: "Michigan", ff1: "Kansas", ff2: "Kentucky" },
  { year: 1992, champion: "Duke", runnerUp: "Michigan", ff1: "Indiana", ff2: "Cincinnati" },
  { year: 1991, champion: "Duke", runnerUp: "Kansas", ff1: "UNLV", ff2: "North Carolina" },
  { year: 1990, champion: "UNLV", runnerUp: "Duke", ff1: "Georgia Tech", ff2: "Arkansas" },
  { year: 1989, champion: "Michigan", runnerUp: "Seton Hall", ff1: "Duke", ff2: "Illinois" },
  { year: 1988, champion: "Kansas", runnerUp: "Oklahoma", ff1: "Arizona", ff2: "Duke" },
  { year: 1987, champion: "Indiana", runnerUp: "Syracuse", ff1: "UNLV", ff2: "Providence" },
  { year: 1986, champion: "Louisville", runnerUp: "Duke", ff1: "Kansas", ff2: "LSU" },
  { year: 1985, champion: "Villanova", runnerUp: "Georgetown", ff1: "St. John's", ff2: "Memphis State" },
  { year: 1984, champion: "Georgetown", runnerUp: "Houston", ff1: "Kentucky", ff2: "Virginia" },
  { year: 1983, champion: "NC State", runnerUp: "Houston", ff1: "Georgia", ff2: "Louisville" },
  { year: 1982, champion: "North Carolina", runnerUp: "Georgetown", ff1: "Houston", ff2: "Louisville" },
  { year: 1981, champion: "Indiana", runnerUp: "North Carolina", ff1: "Virginia", ff2: "LSU" },
  { year: 1980, champion: "Louisville", runnerUp: "UCLA", ff1: "Purdue", ff2: "Iowa" },
  { year: 1979, champion: "Michigan State", runnerUp: "Indiana State", ff1: "DePaul", ff2: "Penn" },
  { year: 1978, champion: "Kentucky", runnerUp: "Duke", ff1: "Arkansas", ff2: "Notre Dame" },
  { year: 1977, champion: "Marquette", runnerUp: "North Carolina", ff1: "UNLV", ff2: "UNC Charlotte" },
  { year: 1976, champion: "Indiana", runnerUp: "Michigan", ff1: "UCLA", ff2: "Rutgers" },
  { year: 1975, champion: "UCLA", runnerUp: "Kentucky", ff1: "Louisville", ff2: "Syracuse" },
  { year: 1974, champion: "NC State", runnerUp: "Marquette", ff1: "UCLA", ff2: "Kansas" },
  { year: 1973, champion: "UCLA", runnerUp: "Memphis State", ff1: "Indiana", ff2: "Providence" },
  { year: 1972, champion: "UCLA", runnerUp: "Florida State", ff1: "North Carolina", ff2: "Louisville" },
  { year: 1971, champion: "UCLA", runnerUp: "Villanova", ff1: "Western Kentucky", ff2: "Kansas" },
  { year: 1970, champion: "UCLA", runnerUp: "Jacksonville", ff1: "New Mexico State", ff2: "St. Bonaventure" },
  { year: 1969, champion: "UCLA", runnerUp: "Purdue", ff1: "Drake", ff2: "North Carolina" },
  { year: 1968, champion: "UCLA", runnerUp: "North Carolina", ff1: "Ohio State", ff2: "Houston" },
  { year: 1967, champion: "UCLA", runnerUp: "Dayton", ff1: "Houston", ff2: "North Carolina" },
  { year: 1966, champion: "Texas Western", runnerUp: "Kentucky", ff1: "Duke", ff2: "Utah" },
  { year: 1965, champion: "UCLA", runnerUp: "Michigan", ff1: "Princeton", ff2: "Wichita State" },
  { year: 1964, champion: "UCLA", runnerUp: "Duke", ff1: "Michigan", ff2: "Kansas State" },
  { year: 1963, champion: "Loyola Chicago", runnerUp: "Cincinnati", ff1: "Duke", ff2: "Oregon State" },
  { year: 1962, champion: "Cincinnati", runnerUp: "Ohio State", ff1: "Wake Forest", ff2: "UCLA" },
  { year: 1961, champion: "Cincinnati", runnerUp: "Ohio State", ff1: "St. Joseph's", ff2: "Utah" },
  { year: 1960, champion: "Ohio State", runnerUp: "California", ff1: "Cincinnati", ff2: "NYU" },
  { year: 1959, champion: "California", runnerUp: "West Virginia", ff1: "Cincinnati", ff2: "Louisville" },
  { year: 1958, champion: "Kentucky", runnerUp: "Seattle", ff1: "Temple", ff2: "Kansas State" },
  { year: 1957, champion: "North Carolina", runnerUp: "Kansas", ff1: "San Francisco", ff2: "Michigan State" },
  { year: 1956, champion: "San Francisco", runnerUp: "Iowa", ff1: "Temple", ff2: "SMU" },
  { year: 1955, champion: "San Francisco", runnerUp: "La Salle", ff1: "Colorado", ff2: "Iowa" },
  { year: 1954, champion: "La Salle", runnerUp: "Bradley", ff1: "Penn State", ff2: "USC" },
  { year: 1953, champion: "Indiana", runnerUp: "Kansas", ff1: "Washington", ff2: "LSU" },
  { year: 1952, champion: "Kansas", runnerUp: "St. John's", ff1: "Illinois", ff2: "Santa Clara" },
  { year: 1951, champion: "Kentucky", runnerUp: "Kansas State", ff1: "Illinois", ff2: "Oklahoma State" },
  { year: 1950, champion: "CCNY", runnerUp: "Bradley", ff1: "NC State", ff2: "Baylor" },
  { year: 1949, champion: "Kentucky", runnerUp: "Oklahoma State", ff1: "Illinois", ff2: "Oregon State" },
  { year: 1948, champion: "Kentucky", runnerUp: "Baylor", ff1: "Holy Cross", ff2: "Kansas State" },
  { year: 1947, champion: "Holy Cross", runnerUp: "Oklahoma", ff1: "Texas", ff2: "CCNY" },
  { year: 1946, champion: "Oklahoma State", runnerUp: "North Carolina", ff1: "Ohio State", ff2: "California" },
  { year: 1945, champion: "Oklahoma State", runnerUp: "NYU", ff1: "Arkansas", ff2: "Ohio State" },
  { year: 1944, champion: "Utah", runnerUp: "Dartmouth", ff1: "Iowa State", ff2: "Ohio State" },
  { year: 1943, champion: "Wyoming", runnerUp: "Georgetown", ff1: "Texas", ff2: "DePaul" },
  { year: 1942, champion: "Stanford", runnerUp: "Dartmouth", ff1: "Colorado", ff2: "Kentucky" },
  { year: 1941, champion: "Wisconsin", runnerUp: "Washington State", ff1: "Pittsburgh", ff2: "Arkansas" },
  { year: 1940, champion: "Indiana", runnerUp: "Kansas", ff1: "Duquesne", ff2: "USC" },
  { year: 1939, champion: "Oregon", runnerUp: "Ohio State", ff1: "Oklahoma", ff2: "Villanova" },
];

const TEAM_ALIASES = {
  "florida":            ["gators", "uf"],
  "houston":            ["cougars", "uh"],
  "auburn":             ["tigers"],
  "duke":               ["blue devils"],
  "uconn":              ["connecticut", "huskies"],
  "purdue":             ["boilermakers"],
  "nc state":           ["north carolina state", "n.c. state", "ncsu", "wolfpack"],
  "alabama":            ["crimson tide", "bama", "tide"],
  "san diego state":    ["sdsu", "aztecs", "san diego st"],
  "fau":                ["florida atlantic", "owls"],
  "miami":              ["miami fl", "hurricanes", "the u"],
  "kansas":             ["jayhawks", "ku"],
  "north carolina":     ["unc", "tar heels", "tarheels", "carolina"],
  "villanova":          ["nova", "wildcats"],
  "baylor":             ["bears"],
  "gonzaga":            ["zags", "bulldogs"],
  "ucla":               ["bruins"],
  "virginia":           ["uva", "cavaliers", "cavs", "wahoos"],
  "texas tech":         ["red raiders", "ttu"],
  "michigan state":     ["msu", "spartans", "mich state", "mich st"],
  "michigan":           ["wolverines", "umich"],
  "loyola chicago":     ["loyola", "ramblers", "loyola-chicago", "loyola il"],
  "oregon":             ["ducks", "uo"],
  "south carolina":     ["gamecocks", "s carolina"],
  "oklahoma":           ["sooners", "ou"],
  "syracuse":           ["orange", "cuse"],
  "wisconsin":          ["badgers"],
  "kentucky":           ["wildcats", "uk"],
  "louisville":         ["cardinals", "cards", "u of l"],
  "wichita state":      ["shockers", "wichita st", "wichita"],
  "ohio state":         ["buckeyes"],
  "butler":             ["bulldogs"],
  "vcu":                ["virginia commonwealth", "rams"],
  "west virginia":      ["mountaineers", "wvu"],
  "memphis":            ["tigers", "memphis state", "memphis st"],
  "memphis state":      ["memphis", "tigers"],
  "georgetown":         ["hoyas"],
  "illinois":           ["illini", "fighting illini"],
  "lsu":                ["louisiana state", "tigers"],
  "george mason":       ["patriots", "gmu"],
  "georgia tech":       ["yellow jackets", "ga tech"],
  "oklahoma state":     ["cowboys", "okla state", "okla st", "ok state", "oklahoma a&m", "okla a&m", "osu"],
  "texas":              ["longhorns", "ut"],
  "marquette":          ["golden eagles"],
  "maryland":           ["terrapins", "terps", "umd"],
  "indiana":            ["hoosiers", "iu"],
  "arizona":            ["wildcats", "u of a", "zona"],
  "stanford":           ["cardinal"],
  "umass":              ["massachusetts", "minutemen"],
  "mississippi state":  ["miss state", "miss st", "bulldogs", "mississippi st"],
  "arkansas":           ["razorbacks", "hogs"],
  "cincinnati":         ["bearcats", "cincy"],
  "unlv":               ["rebels", "vegas", "nevada las vegas"],
  "seton hall":         ["pirates"],
  "providence":         ["friars"],
  "st. john's":         ["st johns", "saint johns", "red storm", "st john's"],
  "minnesota":          ["golden gophers", "gophers"],
  "utah":               ["utes"],
  "georgia":            ["bulldogs", "uga"],
  "indiana state":      ["sycamores", "indiana st"],
  "depaul":             ["blue demons", "de paul"],
  "penn":               ["quakers", "pennsylvania"],
  "unc charlotte":      ["charlotte", "49ers"],
  "rutgers":            ["scarlet knights"],
  "florida state":      ["seminoles", "fsu", "florida st"],
  "western kentucky":   ["hilltoppers", "wku", "w kentucky"],
  "jacksonville":       ["dolphins"],
  "new mexico state":   ["aggies", "nm state", "nmsu", "new mexico st"],
  "st. bonaventure":    ["bonnies", "st bonaventure", "saint bonaventure"],
  "drake":              ["bulldogs"],
  "dayton":             ["flyers"],
  "texas western":      ["utep", "miners"],
  "princeton":          ["tigers"],
  "kansas state":       ["wildcats", "k-state", "ksu", "k state", "kansas st"],
  "oregon state":       ["beavers"],
  "wake forest":        ["demon deacons"],
  "st. joseph's":       ["st josephs", "saint josephs", "hawks", "st joes", "saint joes"],
  "nyu":                ["new york university", "violets"],
  "california":         ["cal", "golden bears", "cal berkeley", "uc berkeley", "berkeley"],
  "seattle":            ["redhawks", "chieftains", "seattle u"],
  "temple":             ["owls"],
  "smu":                ["southern methodist", "mustangs"],
  "la salle":           ["explorers", "lasalle"],
  "san francisco":      ["dons", "usf"],
  "colorado":           ["buffaloes", "buffs", "cu"],
  "iowa":               ["hawkeyes"],
  "penn state":         ["nittany lions", "psu"],
  "usc":                ["trojans", "southern cal", "southern california"],
  "santa clara":        ["broncos"],
  "bradley":            ["braves"],
  "ccny":               ["city college", "city college of new york", "beavers"],
  "holy cross":         ["crusaders"],
  "iowa state":         ["cyclones", "isu", "iowa st"],
  "dartmouth":          ["big green"],
  "wyoming":            ["cowboys"],
  "pittsburgh":         ["panthers", "pitt"],
  "washington state":   ["cougars", "wazzu", "wsu", "wash state", "wash st"],
  "duquesne":           ["dukes"],
  "notre dame":         ["fighting irish", "irish"],
  "washington":         ["huskies", "udub", "uw"],
};

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[''`\.]/g, "")
    .replace(/\s+/g, " ");
}

function matchesTeam(input, teamName) {
  const ni = normalize(input);
  const nt = normalize(teamName);
  if (ni.length < 2) return false;
  if (nt === ni) return true;
  for (const [canonical, aliasList] of Object.entries(TEAM_ALIASES)) {
    if (normalize(canonical) === nt) {
      if (aliasList.some(a => normalize(a) === ni)) return true;
    }
  }
  return false;
}

const FIELDS = ["champion", "runnerUp", "ff1", "ff2"];
const COL_HEADERS = ["Year", "", "Champion", "Runner-Up", "Final Four", "Final Four"];

function FinalFourRow({ ff, rowSolved, onSolve, gaveUp, index }) {
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(null);
  const inputRef = useRef(null);
  const trackPlay = usePlayCount("final-four-trivia");

  const allDone = rowSolved.size === 4;

  const handleInput = (val) => {
    trackPlay();
    setInput(val);

    for (const field of FIELDS) {
      if (rowSolved.has(field)) continue;
      const teamName = ff[field];
      if (matchesTeam(val, teamName)) {
        onSolve(ff.year, field);
        setInput("");
        setFlash(field);
        setTimeout(() => setFlash(null), 700);
        const remaining = FIELDS.filter(f => f !== field && !rowSolved.has(f));
        if (remaining.length > 0 && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 50);
        }
        return;
      }
    }
  };

  const progress = rowSolved.size / 4;
  const isEven = index % 2 === 0;
  const showInput = !allDone && !gaveUp;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "56px minmax(90px,140px) 1fr 1fr 1fr 1fr",
      gap: 0,
      borderBottom: "1px solid #ffffff07",
      background: allDone ? "#0a1200" : isEven ? "#09090f" : "#07070d",
      transition: "background 0.3s",
    }}>
      {/* Year label */}
      <div style={{
        padding: "8px 6px",
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        borderRight: "1px solid #ffffff07",
      }}>
        <div style={{
          fontSize: 14, fontWeight: 900, color: allDone ? "#c8a050" : "#ffffffbb",
          fontFamily: "'Oswald', sans-serif", letterSpacing: 0.5,
        }}>{ff.year}</div>
        <div style={{ marginTop: 4, height: 2, background: "#ffffff0c", borderRadius: 1, overflow: "hidden", width: 32 }}>
          <div style={{
            height: "100%", width: `${progress * 100}%`,
            background: "#c8a050", borderRadius: 1,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Input field column */}
      <div style={{
        padding: "8px 8px",
        display: "flex", alignItems: "center",
        borderRight: "1px solid #ffffff07",
      }}>
        {showInput ? (
          <input
            ref={inputRef}
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder={`${4 - rowSolved.size} left…`}
            style={{
              background: "transparent", border: "none",
              borderBottom: "1px solid #ffffff12",
              color: "#ffffff", fontSize: 12,
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 600, letterSpacing: 0.3,
              padding: "4px 0", outline: "none", width: "100%",
              transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = "#c8a05088"}
            onBlur={e => e.target.style.borderColor = "#ffffff12"}
          />
        ) : allDone ? (
          <div style={{ fontSize: 10, color: "#c8a050", fontFamily: "'Oswald', sans-serif", letterSpacing: 1, fontWeight: 700 }}>✓ DONE</div>
        ) : null}
      </div>

      {/* Team slots */}
      {FIELDS.map((field, fi) => {
        const isSolved = rowSolved.has(field);
        const isFlashing = flash === field;
        const reveal = gaveUp && !isSolved;
        const value = ff[field];
        const isChamp = field === "champion";
        const isRunner = field === "runnerUp";

        return (
          <div key={field} style={{
            padding: "8px 8px",
            borderRight: fi < 3 ? "1px solid #ffffff07" : "none",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: isFlashing ? (isChamp ? "#c8a05018" : "#ffffff08") : reveal ? "#e74c3c08" : "transparent",
            transition: "background 0.3s",
            minHeight: 44,
          }}>
            {isSolved || reveal ? (
              <div style={{ animation: isSolved && isFlashing ? "popIn 0.35s ease both" : "none" }}>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: isSolved ? (isChamp ? "#c8a050" : isRunner ? "#e8e8f0" : "#ffffffbb") : "#e74c3c88",
                  fontFamily: "'Oswald', sans-serif", letterSpacing: 0.3,
                  lineHeight: 1.3,
                }}>
                  {isChamp && isSolved && "🏆 "}{value}
                </div>
              </div>
            ) : (
              <div style={{
                height: 16, borderBottom: "1px dashed #ffffff08",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function FinalFourTrivia() {
  const [solved, setSolved] = useState({});
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const totalFields = FINAL_FOURS.length * 4;
  const totalSolved = Object.values(solved).reduce((s, v) => s + v.size, 0);
  const rowsCompleted = Object.values(solved).filter(s => s.size === 4).length;

  useState(() => {
    const iv = setInterval(() => {
      if (timerActive) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  });

  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSolve = useCallback((year, field) => {
    setSolved(prev => {
      const next = { ...prev, [year]: new Set(prev[year] || []) };
      next[year].add(field);
      const newTotal = Object.values(next).reduce((s, v) => s + v.size, 0);
      if (newTotal === totalFields) {
        setTimerActive(false);
        setFinished(true);
      }
      return next;
    });
  }, [totalFields]);

  const handleGiveUp = () => {
    setGaveUp(true);
    setTimerActive(false);
    setShowGiveUpConfirm(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d1f 0%, #07070f 60%)",
      color: "#f0f0f0",
      fontFamily: "'Oswald', sans-serif",
      padding: "84px 16px 60px",
    }}>
      <Helmet>
        <title>Final Four Trivia – TrivialSports</title>
        <meta name="description" content="Name all four Final Four teams for every NCAA Tournament since 1939. Test your March Madness knowledge!" />
        <meta property="og:title" content="Final Four Trivia – TrivialSports" />
        <meta property="og:description" content="Name all four Final Four teams for every NCAA Tournament since 1939. Test your March Madness knowledge!" />
        <meta property="og:url" content="https://trivialsports.com/games/final-four-trivia" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        input::placeholder { color: #ffffff30; }
        input:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1020, margin: "0 auto 24px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#e67e22", marginBottom: 6 }}>
              NCAA Basketball
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              Final Four Trivia
            </h1>
            <p style={{ fontSize: 13, color: "#c8a050", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Name all 4 Final Four teams for each of the {FINAL_FOURS.length} NCAA Tournaments.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#c8a05066", marginBottom: 2 }}>Time</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: finished ? "#e67e22" : "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {formatTime(elapsed)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#c8a05066", marginBottom: 2 }}>Teams</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {totalSolved}<span style={{ fontSize: 14, color: "#c8a050" }}>/{totalFields}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#c8a05066", marginBottom: 2 }}>Years</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {rowsCompleted}<span style={{ fontSize: 14, color: "#c8a050" }}>/{FINAL_FOURS.length}</span>
              </div>
            </div>
            {!finished && !gaveUp && (
              <button onClick={() => setShowGiveUpConfirm(true)} style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 16px", borderRadius: 8, cursor: "pointer",
                border: "1px solid #e74c3c33", background: "transparent", color: "#e74c3c88",
                fontFamily: "'Oswald', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color="#e74c3c"; e.currentTarget.style.borderColor="#e74c3c55"; e.currentTarget.style.background="#e74c3c0f"; }}
                onMouseLeave={e => { e.currentTarget.style.color="#e74c3c88"; e.currentTarget.style.borderColor="#e74c3c33"; e.currentTarget.style.background="transparent"; }}
              >Give Up</button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 3, background: "#ffffff08", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(totalSolved / totalFields) * 100}%`,
            background: "linear-gradient(90deg, #e67e22, #f5a623)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Finished / gave up banner */}
      {(finished || gaveUp) && (
        <div style={{
          maxWidth: 1020, margin: "0 auto 20px",
          background: gaveUp ? "linear-gradient(135deg,#1a0808,#2a1010)" : "linear-gradient(135deg,#0f0d00,#1a1500)",
          border: `1px solid ${gaveUp ? "#e74c3c33" : "#c8a05044"}`,
          borderRadius: 14, padding: "16px 24px", textAlign: "center",
          animation: "popIn 0.4s ease both",
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#c8a050", letterSpacing: 1, textTransform: "uppercase" }}>
            {gaveUp ? `Answers Revealed — ${totalSolved} of ${totalFields} found` : `All ${totalFields} teams named!`}
          </div>
          <div style={{ fontSize: 13, color: "#c8a050", marginTop: 4, fontFamily: "Georgia, serif" }}>
            {!gaveUp && `${rowsCompleted} Final Fours completed in ${formatTime(elapsed)}.`}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        maxWidth: 1020, margin: "0 auto",
        border: "1px solid #ffffff0a", borderRadius: 12, overflow: "hidden",
        animation: "fadeUp 0.5s ease both", animationDelay: "0.1s",
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "56px minmax(90px,140px) 1fr 1fr 1fr 1fr",
          background: "#0d0d1e", borderBottom: "1px solid #ffffff12",
        }}>
          {COL_HEADERS.map((h, i) => (
            <div key={h + i} style={{
              padding: "10px 8px",
              fontSize: 9, fontWeight: 800, letterSpacing: 2.5,
              textTransform: "uppercase",
              color: i === 2 ? "#c8a050" : i === 3 ? "#a8a8c8" : "#ffffff40",
              fontFamily: "'Oswald', sans-serif",
              borderRight: i < 5 ? "1px solid #ffffff07" : "none",
              textAlign: i === 0 ? "center" : "left",
            }}>{h}</div>
          ))}
        </div>

        {FINAL_FOURS.map((ff, i) => (
          <FinalFourRow
            key={ff.year}
            ff={ff}
            index={i}
            rowSolved={solved[ff.year] || new Set()}
            onSolve={handleSolve}
            gaveUp={gaveUp}
          />
        ))}
      </div>

      <div style={{ maxWidth: 1020, margin: "16px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#c8a05044", letterSpacing: 2, textTransform: "uppercase" }}>
          School names, nicknames & abbreviations accepted · 2020 excluded (cancelled)
        </div>
      </div>

      {/* Give Up Modal */}
      {showGiveUpConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowGiveUpConfirm(false)}>
          <div style={{
            background: "#0e0e22", border: "2px solid #e74c3c44",
            borderRadius: 18, padding: "30px 26px", maxWidth: 320, width: "90%",
            textAlign: "center", boxShadow: "0 24px 80px #000000cc",
            animation: "popIn 0.25s ease both",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🏳️</div>
            <h3 style={{
              margin: "0 0 10px", fontSize: 20, fontWeight: 900, color: "#eeeeee",
              fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textTransform: "uppercase",
            }}>Give Up?</h3>
            <p style={{ margin: "0 0 22px", fontSize: 13, color: "#c8a050", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
              All {totalFields} answers will be revealed.<br />
              You found <span style={{ color: "#e74c3c", fontWeight: 900 }}>{totalSolved}</span> of {totalFields}.
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
