import { useState, useRef, useCallback } from "react";
import { usePlayCount } from "./usePlayCount.jsx";

const SUPER_BOWLS = [
  { roman: "LX",    year: 2026, winner: "Seattle Seahawks",         loser: "New England Patriots",    mvp: "Kenneth Walker III",   mvpPos: "RB" },
  { roman: "LIX",   year: 2025, winner: "Philadelphia Eagles",      loser: "Kansas City Chiefs",       mvp: "Jalen Hurts",          mvpPos: "QB" },
  { roman: "LVIII", year: 2024, winner: "Kansas City Chiefs",       loser: "San Francisco 49ers",      mvp: "Patrick Mahomes",      mvpPos: "QB" },
  { roman: "LVII",  year: 2023, winner: "Kansas City Chiefs",       loser: "Philadelphia Eagles",      mvp: "Patrick Mahomes",      mvpPos: "QB" },
  { roman: "LVI",   year: 2022, winner: "Los Angeles Rams",         loser: "Cincinnati Bengals",       mvp: "Cooper Kupp",          mvpPos: "WR" },
  { roman: "LV",    year: 2021, winner: "Tampa Bay Buccaneers",     loser: "Kansas City Chiefs",       mvp: "Tom Brady",            mvpPos: "QB" },
  { roman: "LIV",   year: 2020, winner: "Kansas City Chiefs",       loser: "San Francisco 49ers",      mvp: "Patrick Mahomes",      mvpPos: "QB" },
  { roman: "LIII",  year: 2019, winner: "New England Patriots",     loser: "Los Angeles Rams",         mvp: "Julian Edelman",       mvpPos: "WR" },
  { roman: "LII",   year: 2018, winner: "Philadelphia Eagles",      loser: "New England Patriots",    mvp: "Nick Foles",           mvpPos: "QB" },
  { roman: "LI",    year: 2017, winner: "New England Patriots",     loser: "Atlanta Falcons",          mvp: "Tom Brady",            mvpPos: "QB" },
  { roman: "50",    year: 2016, winner: "Denver Broncos",           loser: "Carolina Panthers",        mvp: "Von Miller",           mvpPos: "LB" },
  { roman: "XLIX",  year: 2015, winner: "New England Patriots",     loser: "Seattle Seahawks",         mvp: "Tom Brady",            mvpPos: "QB" },
  { roman: "XLVIII",year: 2014, winner: "Seattle Seahawks",         loser: "Denver Broncos",           mvp: "Malcolm Smith",        mvpPos: "LB" },
  { roman: "XLVII", year: 2013, winner: "Baltimore Ravens",         loser: "San Francisco 49ers",      mvp: "Joe Flacco",           mvpPos: "QB" },
  { roman: "XLVI",  year: 2012, winner: "New York Giants",          loser: "New England Patriots",    mvp: "Eli Manning",          mvpPos: "QB" },
  { roman: "XLV",   year: 2011, winner: "Green Bay Packers",        loser: "Pittsburgh Steelers",      mvp: "Aaron Rodgers",        mvpPos: "QB" },
  { roman: "XLIV",  year: 2010, winner: "New Orleans Saints",       loser: "Indianapolis Colts",       mvp: "Drew Brees",           mvpPos: "QB" },
  { roman: "XLIII", year: 2009, winner: "Pittsburgh Steelers",      loser: "Arizona Cardinals",        mvp: "Santonio Holmes",      mvpPos: "WR" },
  { roman: "XLII",  year: 2008, winner: "New York Giants",          loser: "New England Patriots",    mvp: "Eli Manning",          mvpPos: "QB" },
  { roman: "XLI",   year: 2007, winner: "Indianapolis Colts",       loser: "Chicago Bears",            mvp: "Peyton Manning",       mvpPos: "QB" },
  { roman: "XL",    year: 2006, winner: "Pittsburgh Steelers",      loser: "Seattle Seahawks",         mvp: "Hines Ward",           mvpPos: "WR" },
  { roman: "XXXIX", year: 2005, winner: "New England Patriots",     loser: "Philadelphia Eagles",      mvp: "Deion Branch",         mvpPos: "WR" },
  { roman: "XXXVIII",year:2004, winner: "New England Patriots",     loser: "Carolina Panthers",        mvp: "Tom Brady",            mvpPos: "QB" },
  { roman: "XXXVII",year: 2003, winner: "Tampa Bay Buccaneers",     loser: "Oakland Raiders",          mvp: "Dexter Jackson",       mvpPos: "S"  },
  { roman: "XXXVI", year: 2002, winner: "New England Patriots",     loser: "St. Louis Rams",           mvp: "Tom Brady",            mvpPos: "QB" },
  { roman: "XXXV",  year: 2001, winner: "Baltimore Ravens",         loser: "New York Giants",          mvp: "Ray Lewis",            mvpPos: "LB" },
  { roman: "XXXIV", year: 2000, winner: "St. Louis Rams",           loser: "Tennessee Titans",         mvp: "Kurt Warner",          mvpPos: "QB" },
  { roman: "XXXIII",year: 1999, winner: "Denver Broncos",           loser: "Atlanta Falcons",          mvp: "John Elway",           mvpPos: "QB" },
  { roman: "XXXII", year: 1998, winner: "Denver Broncos",           loser: "Green Bay Packers",        mvp: "Terrell Davis",        mvpPos: "RB" },
  { roman: "XXXI",  year: 1997, winner: "Green Bay Packers",        loser: "New England Patriots",    mvp: "Desmond Howard",       mvpPos: "KR" },
  { roman: "XXX",   year: 1996, winner: "Dallas Cowboys",           loser: "Pittsburgh Steelers",      mvp: "Larry Brown",          mvpPos: "CB" },
  { roman: "XXIX",  year: 1995, winner: "San Francisco 49ers",      loser: "San Diego Chargers",       mvp: "Steve Young",          mvpPos: "QB" },
  { roman: "XXVIII",year: 1994, winner: "Dallas Cowboys",           loser: "Buffalo Bills",            mvp: "Emmitt Smith",         mvpPos: "RB" },
  { roman: "XXVII", year: 1993, winner: "Dallas Cowboys",           loser: "Buffalo Bills",            mvp: "Troy Aikman",          mvpPos: "QB" },
  { roman: "XXVI",  year: 1992, winner: "Washington Redskins",      loser: "Buffalo Bills",            mvp: "Mark Rypien",          mvpPos: "QB" },
  { roman: "XXV",   year: 1991, winner: "New York Giants",          loser: "Buffalo Bills",            mvp: "Ottis Anderson",       mvpPos: "RB" },
  { roman: "XXIV",  year: 1990, winner: "San Francisco 49ers",      loser: "Denver Broncos",           mvp: "Joe Montana",          mvpPos: "QB" },
  { roman: "XXIII", year: 1989, winner: "San Francisco 49ers",      loser: "Cincinnati Bengals",       mvp: "Jerry Rice",           mvpPos: "WR" },
  { roman: "XXII",  year: 1988, winner: "Washington Redskins",      loser: "Denver Broncos",           mvp: "Doug Williams",        mvpPos: "QB" },
  { roman: "XXI",   year: 1987, winner: "New York Giants",          loser: "Denver Broncos",           mvp: "Phil Simms",           mvpPos: "QB" },
  { roman: "XX",    year: 1986, winner: "Chicago Bears",            loser: "New England Patriots",    mvp: "Richard Dent",         mvpPos: "DE" },
  { roman: "XIX",   year: 1985, winner: "San Francisco 49ers",      loser: "Miami Dolphins",           mvp: "Joe Montana",          mvpPos: "QB" },
  { roman: "XVIII", year: 1984, winner: "Los Angeles Raiders",      loser: "Washington Redskins",      mvp: "Marcus Allen",         mvpPos: "RB" },
  { roman: "XVII",  year: 1983, winner: "Washington Redskins",      loser: "Miami Dolphins",           mvp: "John Riggins",         mvpPos: "RB" },
  { roman: "XVI",   year: 1982, winner: "San Francisco 49ers",      loser: "Cincinnati Bengals",       mvp: "Joe Montana",          mvpPos: "QB" },
  { roman: "XV",    year: 1981, winner: "Oakland Raiders",          loser: "Philadelphia Eagles",      mvp: "Jim Plunkett",         mvpPos: "QB" },
  { roman: "XIV",   year: 1980, winner: "Pittsburgh Steelers",      loser: "Los Angeles Rams",         mvp: "Terry Bradshaw",       mvpPos: "QB" },
  { roman: "XIII",  year: 1979, winner: "Pittsburgh Steelers",      loser: "Dallas Cowboys",           mvp: "Terry Bradshaw",       mvpPos: "QB" },
  { roman: "XII",   year: 1978, winner: "Dallas Cowboys",           loser: "Denver Broncos",           mvp: "Harvey Martin",        mvpPos: "DE" },
  { roman: "XI",    year: 1977, winner: "Oakland Raiders",          loser: "Minnesota Vikings",        mvp: "Fred Biletnikoff",     mvpPos: "WR" },
  { roman: "X",     year: 1976, winner: "Pittsburgh Steelers",      loser: "Dallas Cowboys",           mvp: "Lynn Swann",           mvpPos: "WR" },
  { roman: "IX",    year: 1975, winner: "Pittsburgh Steelers",      loser: "Minnesota Vikings",        mvp: "Franco Harris",        mvpPos: "RB" },
  { roman: "VIII",  year: 1974, winner: "Miami Dolphins",           loser: "Minnesota Vikings",        mvp: "Larry Csonka",         mvpPos: "RB" },
  { roman: "VII",   year: 1973, winner: "Miami Dolphins",           loser: "Washington Redskins",      mvp: "Jake Scott",           mvpPos: "S"  },
  { roman: "VI",    year: 1972, winner: "Dallas Cowboys",           loser: "Miami Dolphins",           mvp: "Roger Staubach",       mvpPos: "QB" },
  { roman: "V",     year: 1971, winner: "Baltimore Colts",          loser: "Dallas Cowboys",           mvp: "Chuck Howley",         mvpPos: "LB" },
  { roman: "IV",    year: 1970, winner: "Kansas City Chiefs",       loser: "Minnesota Vikings",        mvp: "Len Dawson",           mvpPos: "QB" },
  { roman: "III",   year: 1969, winner: "New York Jets",            loser: "Baltimore Colts",          mvp: "Joe Namath",           mvpPos: "QB" },
  { roman: "II",    year: 1968, winner: "Green Bay Packers",        loser: "Oakland Raiders",          mvp: "Bart Starr",           mvpPos: "QB" },
  { roman: "I",     year: 1967, winner: "Green Bay Packers",        loser: "Kansas City Chiefs",       mvp: "Bart Starr",           mvpPos: "QB" },
];

// Aliases for team names
const TEAM_ALIASES = {
  "green bay packers":       ["green bay", "packers", "gb"],
  "kansas city chiefs":      ["kansas city", "chiefs", "kc"],
  "new york jets":           ["ny jets", "jets", "nyj"],
  "baltimore colts":         ["colts", "baltimore"],
  "minnesota vikings":       ["minnesota", "vikings", "vikes"],
  "dallas cowboys":          ["dallas", "cowboys", "boys"],
  "miami dolphins":          ["miami", "dolphins"],
  "washington redskins":     ["washington", "redskins"],
  "pittsburgh steelers":     ["pittsburgh", "steelers"],
  "oakland raiders":         ["oakland", "raiders"],
  "los angeles raiders":     ["la raiders", "l.a. raiders", "raiders"],
  "los angeles rams":        ["la rams", "l.a. rams", "rams"],
  "st. louis rams":          ["st louis rams", "stl rams", "rams"],
  "san francisco 49ers":     ["san francisco", "49ers", "niners", "sf", "sf 49ers"],
  "cincinnati bengals":      ["cincinnati", "bengals"],
  "new england patriots":    ["new england", "patriots", "pats", "ne"],
  "chicago bears":           ["chicago", "bears"],
  "new york giants":         ["ny giants", "giants", "nyg"],
  "denver broncos":          ["denver", "broncos"],
  "philadelphia eagles":     ["philadelphia", "eagles", "philly", "philly eagles"],
  "san diego chargers":      ["san diego", "chargers"],
  "tennessee titans":        ["tennessee", "titans"],
  "atlanta falcons":         ["atlanta", "falcons"],
  "baltimore ravens":        ["baltimore", "ravens"],
  "tampa bay buccaneers":    ["tampa bay", "buccaneers", "bucs", "tampa"],
  "seattle seahawks":        ["seattle", "seahawks", "hawks"],
  "arizona cardinals":       ["arizona", "cardinals", "cards"],
  "new orleans saints":      ["new orleans", "saints"],
  "indianapolis colts":      ["indianapolis", "colts", "indy"],
  "carolina panthers":       ["carolina", "panthers"],
  "buffalo bills":           ["buffalo", "bills"],
};

// Aliases for player names
const MVP_ALIASES = {
  "bart starr":          ["starr"],
  "joe namath":          ["namath", "broadway joe"],
  "len dawson":          ["dawson"],
  "chuck howley":        ["howley"],
  "roger staubach":      ["staubach", "captain america"],
  "jake scott":          ["scott"],
  "larry csonka":        ["csonka"],
  "franco harris":       ["harris", "franco"],
  "lynn swann":          ["swann"],
  "fred biletnikoff":    ["biletnikoff"],
  "harvey martin":       ["martin"],
  "terry bradshaw":      ["bradshaw"],
  "jim plunkett":        ["plunkett"],
  "joe montana":         ["montana", "joe cool"],
  "john riggins":        ["riggins"],
  "marcus allen":        ["allen", "marcus"],
  "richard dent":        ["dent"],
  "phil simms":          ["simms"],
  "doug williams":       ["williams", "doug"],
  "jerry rice":          ["rice"],
  "ottis anderson":      ["anderson", "ottis", "o.j. anderson", "oj anderson"],
  "mark rypien":         ["rypien"],
  "troy aikman":         ["aikman"],
  "emmitt smith":        ["emmitt", "smith"],
  "steve young":         ["young", "steve"],
  "larry brown":         ["brown", "larry"],
  "desmond howard":      ["howard", "desmond"],
  "terrell davis":       ["davis", "td", "terrell"],
  "john elway":          ["elway"],
  "kurt warner":         ["warner"],
  "ray lewis":           ["lewis", "ray"],
  "tom brady":           ["brady", "goat", "tb12"],
  "dexter jackson":      ["jackson", "dexter"],
  "deion branch":        ["branch", "deion"],
  "hines ward":          ["ward", "hines"],
  "peyton manning":      ["peyton", "manning"],
  "eli manning":         ["eli", "manning"],
  "santonio holmes":     ["holmes", "santonio"],
  "drew brees":          ["brees"],
  "aaron rodgers":       ["rodgers", "a-rod", "ar12"],
  "joe flacco":          ["flacco"],
  "malcolm smith":       ["smith", "malcolm"],
  "von miller":          ["miller", "von"],
  "nick foles":          ["foles", "foles"],
  "julian edelman":      ["edelman"],
  "patrick mahomes":     ["mahomes", "pat", "patty mahomes"],
  "cooper kupp":         ["kupp"],
  "jalen hurts":         ["hurts", "jalen"],
  "kenneth walker iii":  ["kenneth walker", "walker", "kw3", "k9"],
};

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[''`\.]/g, "")
    .replace(/\s+/g, " ");
}

function matchesTeam(input, teamName) {
  const ni = normalize(input);
  const nt = normalize(teamName);
  if (nt === ni) return true;
  // Find aliases by normalizing all keys
  const aliasEntry = Object.entries(TEAM_ALIASES).find(([k]) => normalize(k) === nt);
  const aliases = aliasEntry ? aliasEntry[1] : [];
  return aliases.some(a => normalize(a) === ni);
}

function matchesMVP(input, mvpName) {
  const ni = normalize(input);
  const nm = normalize(mvpName);
  if (nm === ni) return true;
  // Last name
  const last = nm.split(" ").pop();
  if (last.length > 3 && last === ni) return true;
  const aliases = MVP_ALIASES[nm] || [];
  return aliases.some(a => normalize(a) === ni);
}

const FIELD_LABELS = { winner: "Winner", loser: "Loser", mvp: "MVP" };
const FIELDS = ["winner", "loser", "mvp"];

function SuperBowlRow({ sb, rowSolved, onSolve, gaveUp, index }) {
  const [inputs, setInputs] = useState({ winner: "", loser: "", mvp: "" });
  const [flash, setFlash] = useState(null);
const trackPlay = usePlayCount("super-bowl-history");
    const winnerRef = useRef(null);
  const loserRef = useRef(null);
  const mvpRef = useRef(null);
  const refs = { winner: winnerRef, loser: loserRef, mvp: mvpRef };

  const allDone = rowSolved.size === 3;

  const handleInput = (field, val) => {
    trackPlay();
    setInputs(prev => ({ ...prev, [field]: val }));
    let matched = false;
    if (field === "winner" && !rowSolved.has("winner") && matchesTeam(val, sb.winner)) matched = true;
    if (field === "loser"  && !rowSolved.has("loser")  && matchesTeam(val, sb.loser))  matched = true;
    if (field === "mvp"    && !rowSolved.has("mvp")    && matchesMVP(val, sb.mvp))     matched = true;
    if (matched) {
      onSolve(sb.roman, field);
      setInputs(prev => ({ ...prev, [field]: "" }));
      setFlash(field);
      setTimeout(() => setFlash(null), 600);
      // Auto-advance to next unsolved field
      const nextField = FIELDS.find(f => f !== field && !rowSolved.has(f));
      if (nextField && refs[nextField].current) {
        setTimeout(() => refs[nextField].current?.focus(), 50);
      }
    }
  };

  const progress = rowSolved.size / 3;
  const isEven = index % 2 === 0;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "90px 1fr 1fr 1fr",
      gap: 0,
      borderBottom: "1px solid #ffffff07",
      background: allDone ? "#0a1200" : isEven ? "#09090f" : "#07070d",
      transition: "background 0.3s",
    }}>
      {/* SB label */}
      <div style={{
        padding: "10px 12px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderRight: "1px solid #ffffff07",
      }}>
        <div style={{
          fontSize: 13, fontWeight: 900, color: allDone ? "#c8a050" : "#ffffff88",
          fontFamily: "'Oswald', sans-serif", letterSpacing: 0.5,
          textTransform: "uppercase",
        }}>SB {sb.roman}</div>
        <div style={{
          fontSize: 10, color: "#ffffff22", fontFamily: "'Oswald', sans-serif",
          letterSpacing: 1, marginTop: 1,
        }}>{sb.year}</div>
        {/* mini progress */}
        <div style={{ marginTop: 5, height: 2, background: "#ffffff08", borderRadius: 1, overflow: "hidden", width: 40 }}>
          <div style={{
            height: "100%", width: `${progress * 100}%`,
            background: "#c8a050", borderRadius: 1,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Fields */}
      {FIELDS.map(field => {
        const isSolved = rowSolved.has(field);
        const isFlashing = flash === field;
        const reveal = gaveUp && !isSolved;
        const value = field === "winner" ? sb.winner : field === "loser" ? sb.loser : sb.mvp;
        const subLabel = field === "mvp" ? `(${sb.mvpPos})` : null;

        return (
          <div key={field} style={{
            padding: "8px 10px",
            borderRight: field !== "mvp" ? "1px solid #ffffff07" : "none",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: isFlashing ? "#c8a05015" : reveal ? "#e74c3c08" : "transparent",
            borderBottom: isSolved ? "1px solid #22c55e33" : reveal ? "1px solid #e74c3c33" : "1px solid transparent",
            transition: "background 0.2s",
          }}>
            {isSolved || reveal ? (
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: isSolved ? "#ffffff" : "#e8806070",
                  fontFamily: "'Oswald', sans-serif", letterSpacing: 0.3,
                  lineHeight: 1.2,
                }}>
                  {value}
                </div>
                {subLabel && (
                  <div style={{
                    fontSize: 9, color: isSolved ? "#c8a05088" : "#e74c3c44",
                    fontFamily: "'Oswald', sans-serif",
                    letterSpacing: 1, marginTop: 2,
                  }}>{subLabel}</div>
                )}
              </div>
            ) : (
              <input
                ref={refs[field]}
                value={inputs[field]}
                onChange={e => handleInput(field, e.target.value)}
                placeholder={FIELD_LABELS[field]}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: "1px solid #ffffff0f",
                  color: "#ffffff", fontSize: 12,
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600, letterSpacing: 0.3,
                  padding: "2px 0", outline: "none", width: "100%",
                  transition: "border-color 0.15s",
                }}
                onFocus={e => e.target.style.borderColor = "#c8a05066"}
                onBlur={e => e.target.style.borderColor = "#ffffff0f"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function SuperBowlTrivia() {
  const [solved, setSolved] = useState({});
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const totalFields = SUPER_BOWLS.length * 3;
  const totalSolved = Object.values(solved).reduce((s, v) => s + v.size, 0);
  const rowsCompleted = Object.values(solved).filter(s => s.size === 3).length;

  useState(() => {
    const iv = setInterval(() => {
      if (timerActive) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  });

  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSolve = useCallback((roman, field) => {
    setSolved(prev => {
      const next = { ...prev, [roman]: new Set(prev[roman] || []) };
      next[roman].add(field);
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
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        input::placeholder { color: #ffffff15; }
        input:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto 24px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>
              NFL Trivia
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              Super Bowl History
            </h1>
            <p style={{ fontSize: 13, color: "#c8a050", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Name the winner, loser, and MVP for all {SUPER_BOWLS.length} Super Bowls.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Time</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: finished ? "#c8a050" : "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {formatTime(elapsed)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Answers</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {totalSolved}<span style={{ fontSize: 14, color: "#c8a05099" }}>/{totalFields}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Games</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {rowsCompleted}<span style={{ fontSize: 14, color: "#c8a05099" }}>/{SUPER_BOWLS.length}</span>
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
        <div style={{ marginTop: 16, height: 3, background: "#ffffff06", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(totalSolved / totalFields) * 100}%`,
            background: "linear-gradient(90deg, #c8a050, #e8c070)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Finished / gave up banner */}
      {(finished || gaveUp) && (
        <div style={{
          maxWidth: 900, margin: "0 auto 20px",
          background: gaveUp ? "linear-gradient(135deg,#1a0808,#2a1010)" : "linear-gradient(135deg,#0f0d00,#1a1500)",
          border: `1px solid ${gaveUp ? "#e74c3c33" : "#c8a05044"}`,
          borderRadius: 14, padding: "16px 24px", textAlign: "center",
          animation: "popIn 0.4s ease both",
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#c8a050", letterSpacing: 1, textTransform: "uppercase" }}>
            {gaveUp ? `Answers Revealed — ${totalSolved} of ${totalFields} found` : `All ${totalFields} answers correct!`}
          </div>
          <div style={{ fontSize: 13, color: "#c8a050", marginTop: 4, fontFamily: "Georgia, serif" }}>
            {!gaveUp && `${rowsCompleted} Super Bowls completed in ${formatTime(elapsed)}.`}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        maxWidth: 900, margin: "0 auto",
        border: "1px solid #ffffff0a", borderRadius: 12, overflow: "hidden",
        animation: "fadeUp 0.5s ease both", animationDelay: "0.1s",
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "90px 1fr 1fr 1fr",
          background: "#0d0d1e", borderBottom: "1px solid #ffffff12",
          padding: "0",
        }}>
          {["Super Bowl", "Winner", "Loser", "MVP"].map((h, i) => (
            <div key={h} style={{
              padding: "10px 12px",
              fontSize: 9, fontWeight: 800, letterSpacing: 3,
              textTransform: "uppercase", color: "#ffffff30",
              fontFamily: "'Oswald', sans-serif",
              borderRight: i < 3 ? "1px solid #ffffff07" : "none",
            }}>{h}</div>
          ))}
        </div>

        {SUPER_BOWLS.map((sb, i) => (
          <SuperBowlRow
            key={sb.roman}
            sb={sb}
            index={i}
            rowSolved={solved[sb.roman] || new Set()}
            onSolve={handleSolve}
            gaveUp={gaveUp}
          />
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "16px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>
          City names, nicknames & last names accepted · Super Bowl 50 listed as "50"
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
