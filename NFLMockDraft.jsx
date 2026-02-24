import { useState, useEffect, useRef } from "react";

// ── 2026 NFL Draft Order (1st round, estimated) ─────────────────────────────────────────
const INITIAL_PICKS = [
  { pick: 1,  team: "Las Vegas Raiders",        abbr: "LV",  color: "#A5ACAF" },
  { pick: 2,  team: "Cleveland Browns",          abbr: "CLE", color: "#FF3C00" },
  { pick: 3,  team: "New York Giants",           abbr: "NYG", color: "#0B2265" },
  { pick: 4,  team: "New England Patriots",      abbr: "NE",  color: "#002244" },
  { pick: 5,  team: "Jacksonville Jaguars",      abbr: "JAX", color: "#006778" },
  { pick: 6,  team: "Las Vegas Raiders",         abbr: "LV",  color: "#A5ACAF" },
  { pick: 7,  team: "New York Jets",             abbr: "NYJ", color: "#125740" },
  { pick: 8,  team: "Carolina Panthers",         abbr: "CAR", color: "#0085CA" },
  { pick: 9,  team: "New Orleans Saints",        abbr: "NO",  color: "#D3BC8D" },
  { pick: 10, team: "Chicago Bears",             abbr: "CHI", color: "#0B162A" },
  { pick: 11, team: "San Francisco 49ers",       abbr: "SF",  color: "#AA0000" },
  { pick: 12, team: "Dallas Cowboys",            abbr: "DAL", color: "#003594" },
  { pick: 13, team: "Miami Dolphins",            abbr: "MIA", color: "#008E97" },
  { pick: 14, team: "Indianapolis Colts",        abbr: "IND", color: "#002C5F" },
  { pick: 15, team: "Atlanta Falcons",           abbr: "ATL", color: "#A71930" },
  { pick: 16, team: "Arizona Cardinals",         abbr: "ARI", color: "#97233F" },
  { pick: 17, team: "Cincinnati Bengals",        abbr: "CIN", color: "#FB4F14" },
  { pick: 18, team: "Seattle Seahawks",          abbr: "SEA", color: "#002244" },
  { pick: 19, team: "Tampa Bay Buccaneers",      abbr: "TB",  color: "#D50A0A" },
  { pick: 20, team: "Denver Broncos",            abbr: "DEN", color: "#FB4F14" },
  { pick: 21, team: "Pittsburgh Steelers",       abbr: "PIT", color: "#FFB612" },
  { pick: 22, team: "Los Angeles Chargers",      abbr: "LAC", color: "#0080C6" },
  { pick: 23, team: "Green Bay Packers",         abbr: "GB",  color: "#203731" },
  { pick: 24, team: "Minnesota Vikings",         abbr: "MIN", color: "#4F2683" },
  { pick: 25, team: "Houston Texans",            abbr: "HOU", color: "#03202F" },
  { pick: 26, team: "Los Angeles Rams",          abbr: "LAR", color: "#003594" },
  { pick: 27, team: "Baltimore Ravens",          abbr: "BAL", color: "#241773" },
  { pick: 28, team: "Detroit Lions",             abbr: "DET", color: "#0076B6" },
  { pick: 29, team: "Washington Commanders",     abbr: "WSH", color: "#5A1414" },
  { pick: 30, team: "Buffalo Bills",             abbr: "BUF", color: "#00338D" },
  { pick: 31, team: "Kansas City Chiefs",        abbr: "KC",  color: "#E31837" },
  { pick: 32, team: "Philadelphia Eagles",       abbr: "PHI", color: "#004C54" },
];

// ── 2026 NFL Draft Prospects (last updated February 23, 2026) ─────────────────────
// Run refresh-prospects.cjs to update these

const ALL_PROSPECTS = [
  { name: "Fernando Mendoza", position: "QB", school: "Indiana" },
  { name: "Jeremiyah Love", position: "RB", school: "Notre Dame" },
  { name: "Arvell Reese", position: "LB", school: "Ohio State" },
  { name: "Caleb Downs", position: "S", school: "Ohio State" },
  { name: "Rueben Bain Jr.", position: "EDGE", school: "Miami" },
  { name: "Carnell Tate", position: "WR", school: "Ohio State" },
  { name: "Peter Woods", position: "DT", school: "Clemson" },
  { name: "Francis Mauigoa", position: "OT", school: "Miami" },
  { name: "Mansoor Delane", position: "CB", school: "LSU" },
  { name: "Spencer Fano", position: "OT", school: "Utah" },
  { name: "Kenyon Sadiq", position: "TE", school: "Oregon" },
  { name: "Makai Lemon", position: "WR", school: "USC" },
  { name: "Jordyn Tyson", position: "WR", school: "Arizona State" },
  { name: "Sonny Styles", position: "LB", school: "Ohio State" },
  { name: "David Bailey", position: "EDGE", school: "Texas Tech" },
  { name: "Keldric Faulk", position: "EDGE", school: "Auburn" },
  { name: "Kadyn Proctor", position: "OT", school: "Alabama" },
  { name: "Ty Simpson", position: "QB", school: "Alabama" },
  { name: "TJ Parker", position: "EDGE", school: "Clemson" },
  { name: "Jermod McCoy", position: "CB", school: "Tennessee" },
  { name: "Kayden McDonald", position: "DT", school: "Ohio State" },
  { name: "Avieon Terrell", position: "CB", school: "Clemson" },
  { name: "Cashius Howell", position: "OLB", school: "Texas A&M" },
  { name: "Caleb Lomu", position: "OT", school: "Utah" },
  { name: "Joshua Cisse", position: "CB", school: "Auburn" },
  { name: "Jadarian Price", position: "RB", school: "Notre Dame" },
  { name: "Blake Miller", position: "OT", school: "Clemson" },
  { name: "Emmett Johnson", position: "RB", school: "Nebraska" },
  { name: "Jonah Coleman", position: "RB", school: "Washington" },
  { name: "Demond Claiborne", position: "RB", school: "Wake Forest" },
  { name: "Kaytron Allen", position: "RB", school: "Penn State" },
  { name: "Nicholas Singleton", position: "RB", school: "Penn State" },
  { name: "Drew Allar", position: "QB", school: "Penn State" },
  { name: "Garrett Nussmeier", position: "QB", school: "LSU" },
  { name: "Carson Beck", position: "QB", school: "Miami" },
  { name: "Cade Klubnik", position: "QB", school: "Clemson" },
  { name: "Tetairoa McMillan", position: "WR", school: "Arizona" },
  { name: "A.J. Harris", position: "CB", school: "Penn State" },
  { name: "Suntarine Perkins", position: "LB", school: "Ole Miss" },
  { name: "Kenyatta Jackson", position: "EDGE", school: "Ohio State" },
  { name: "Michael Taaffe", position: "S", school: "Texas" },
  { name: "Dante Moore", position: "QB", school: "Oregon" },
  { name: "Taylen Green", position: "QB", school: "Arkansas" },
  { name: "Jaydn Ott", position: "RB", school: "Oklahoma" },
  { name: "Kaelon Black", position: "RB", school: "Indiana" },
];

const PICK_SUGGESTIONS = {
  "1": [{ name: "Fernando Mendoza", position: "QB", school: "Indiana" }, { name: "Dante Moore", position: "QB", school: "Oregon" }, { name: "Ty Simpson", position: "QB", school: "Alabama" }],
  "2": [{ name: "Arvell Reese", position: "LB", school: "Ohio State" }, { name: "Rueben Bain Jr.", position: "EDGE", school: "Miami" }, { name: "Caleb Downs", position: "S", school: "Ohio State" }],
  "3": [{ name: "Jeremiyah Love", position: "RB", school: "Notre Dame" }, { name: "Peter Woods", position: "DT", school: "Clemson" }, { name: "Francis Mauigoa", position: "OT", school: "Miami" }],
  "4": [{ name: "Peter Woods", position: "DT", school: "Clemson" }, { name: "Rueben Bain Jr.", position: "EDGE", school: "Miami" }, { name: "Mansoor Delane", position: "CB", school: "LSU" }],
  "5": [{ name: "Carnell Tate", position: "WR", school: "Ohio State" }, { name: "Jeremiyah Love", position: "RB", school: "Notre Dame" }, { name: "Caleb Downs", position: "S", school: "Ohio State" }],
  "6": [{ name: "Makai Lemon", position: "WR", school: "USC" }, { name: "Kenyon Sadiq", position: "TE", school: "Oregon" }, { name: "Jordyn Tyson", position: "WR", school: "Arizona State" }],
  "7": [{ name: "Spencer Fano", position: "OT", school: "Utah" }, { name: "David Bailey", position: "EDGE", school: "Texas Tech" }, { name: "Keldric Faulk", position: "EDGE", school: "Auburn" }],
  "8": [{ name: "Caleb Downs", position: "S", school: "Ohio State" }, { name: "Arvell Reese", position: "LB", school: "Ohio State" }, { name: "Peter Woods", position: "DT", school: "Clemson" }],
  "9": [{ name: "Jeremiyah Love", position: "RB", school: "Notre Dame" }, { name: "Sonny Styles", position: "LB", school: "Ohio State" }, { name: "TJ Parker", position: "EDGE", school: "Clemson" }],
  "10": [{ name: "Mansoor Delane", position: "CB", school: "LSU" }, { name: "Jermod McCoy", position: "CB", school: "Tennessee" }, { name: "Kayden McDonald", position: "DT", school: "Ohio State" }],
  "11": [{ name: "Kenyon Sadiq", position: "TE", school: "Oregon" }, { name: "Francis Mauigoa", position: "OT", school: "Miami" }, { name: "Carnell Tate", position: "WR", school: "Ohio State" }],
  "12": [{ name: "Jordyn Tyson", position: "WR", school: "Arizona State" }, { name: "Kadyn Proctor", position: "OT", school: "Alabama" }, { name: "Avieon Terrell", position: "CB", school: "Clemson" }],
  "13": [{ name: "Jermod McCoy", position: "CB", school: "Tennessee" }, { name: "Mansoor Delane", position: "CB", school: "LSU" }, { name: "Makai Lemon", position: "WR", school: "USC" }],
  "14": [{ name: "Kadyn Proctor", position: "OT", school: "Alabama" }, { name: "Francis Mauigoa", position: "OT", school: "Miami" }, { name: "Spencer Fano", position: "OT", school: "Utah" }],
  "15": [{ name: "Carnell Tate", position: "WR", school: "Ohio State" }, { name: "Sonny Styles", position: "LB", school: "Ohio State" }, { name: "David Bailey", position: "EDGE", school: "Texas Tech" }],
  "16": [{ name: "TJ Parker", position: "EDGE", school: "Clemson" }, { name: "Keldric Faulk", position: "EDGE", school: "Auburn" }, { name: "Cashius Howell", position: "OLB", school: "Texas A&M" }],
  "17": [{ name: "David Bailey", position: "EDGE", school: "Texas Tech" }, { name: "Ty Simpson", position: "QB", school: "Alabama" }, { name: "Caleb Lomu", position: "OT", school: "Utah" }],
  "18": [{ name: "Rueben Bain Jr.", position: "EDGE", school: "Miami" }, { name: "Joshua Cisse", position: "CB", school: "Auburn" }, { name: "Blake Miller", position: "OT", school: "Clemson" }],
  "19": [{ name: "Sonny Styles", position: "LB", school: "Ohio State" }, { name: "Jadarian Price", position: "RB", school: "Notre Dame" }, { name: "Emmett Johnson", position: "RB", school: "Nebraska" }],
  "20": [{ name: "Keldric Faulk", position: "EDGE", school: "Auburn" }, { name: "Cashius Howell", position: "OLB", school: "Texas A&M" }, { name: "Jonah Coleman", position: "RB", school: "Washington" }],
  "21": [{ name: "Kayden McDonald", position: "DT", school: "Ohio State" }, { name: "Avieon Terrell", position: "CB", school: "Clemson" }, { name: "Demond Claiborne", position: "RB", school: "Wake Forest" }],
  "22": [{ name: "Cashius Howell", position: "OLB", school: "Texas A&M" }, { name: "Caleb Lomu", position: "OT", school: "Utah" }, { name: "Kaytron Allen", position: "RB", school: "Penn State" }],
  "23": [{ name: "Blake Miller", position: "OT", school: "Clemson" }, { name: "Joshua Cisse", position: "CB", school: "Auburn" }, { name: "Nicholas Singleton", position: "RB", school: "Penn State" }],
  "24": [{ name: "Caleb Lomu", position: "OT", school: "Utah" }, { name: "Nicholas Singleton", position: "RB", school: "Penn State" }, { name: "Kaelon Black", position: "RB", school: "Indiana" }],
  "25": [{ name: "Joshua Cisse", position: "CB", school: "Auburn" }, { name: "Drew Allar", position: "QB", school: "Penn State" }, { name: "Jadarian Price", position: "RB", school: "Notre Dame" }],
  "26": [{ name: "Jadarian Price", position: "RB", school: "Notre Dame" }, { name: "Emmett Johnson", position: "RB", school: "Nebraska" }, { name: "Garrett Nussmeier", position: "QB", school: "LSU" }],
  "27": [{ name: "Emmett Johnson", position: "RB", school: "Nebraska" }, { name: "Jonah Coleman", position: "RB", school: "Washington" }, { name: "Carson Beck", position: "QB", school: "Miami" }],
  "28": [{ name: "Jonah Coleman", position: "RB", school: "Washington" }, { name: "Demond Claiborne", position: "RB", school: "Wake Forest" }, { name: "Cade Klubnik", position: "QB", school: "Clemson" }],
  "29": [{ name: "Demond Claiborne", position: "RB", school: "Wake Forest" }, { name: "Kaytron Allen", position: "RB", school: "Penn State" }, { name: "Tetairoa McMillan", position: "WR", school: "Arizona" }],
  "30": [{ name: "Kaytron Allen", position: "RB", school: "Penn State" }, { name: "A.J. Harris", position: "CB", school: "Penn State" }, { name: "Taylen Green", position: "QB", school: "Arkansas" }],
  "31": [{ name: "Nicholas Singleton", position: "RB", school: "Penn State" }, { name: "Suntarine Perkins", position: "LB", school: "Ole Miss" }, { name: "Kenyatta Jackson", position: "EDGE", school: "Ohio State" }],
  "32": [{ name: "Kaelon Black", position: "RB", school: "Indiana" }, { name: "Michael Taaffe", position: "S", school: "Texas" }, { name: "Jaydn Ott", position: "RB", school: "Oklahoma" }],
};

const ALL_TEAMS = [
  { team: "Arizona Cardinals",      abbr: "ARI", color: "#97233F" },
  { team: "Atlanta Falcons",        abbr: "ATL", color: "#A71930" },
  { team: "Baltimore Ravens",       abbr: "BAL", color: "#241773" },
  { team: "Buffalo Bills",          abbr: "BUF", color: "#00338D" },
  { team: "Carolina Panthers",      abbr: "CAR", color: "#0085CA" },
  { team: "Chicago Bears",          abbr: "CHI", color: "#0B162A" },
  { team: "Cincinnati Bengals",     abbr: "CIN", color: "#FB4F14" },
  { team: "Cleveland Browns",       abbr: "CLE", color: "#FF3C00" },
  { team: "Dallas Cowboys",         abbr: "DAL", color: "#003594" },
  { team: "Denver Broncos",         abbr: "DEN", color: "#FB4F14" },
  { team: "Detroit Lions",          abbr: "DET", color: "#0076B6" },
  { team: "Green Bay Packers",      abbr: "GB",  color: "#203731" },
  { team: "Houston Texans",         abbr: "HOU", color: "#03202F" },
  { team: "Indianapolis Colts",     abbr: "IND", color: "#002C5F" },
  { team: "Jacksonville Jaguars",   abbr: "JAX", color: "#006778" },
  { team: "Kansas City Chiefs",     abbr: "KC",  color: "#E31837" },
  { team: "Las Vegas Raiders",      abbr: "LV",  color: "#A5ACAF" },
  { team: "Los Angeles Chargers",   abbr: "LAC", color: "#0080C6" },
  { team: "Los Angeles Rams",       abbr: "LAR", color: "#003594" },
  { team: "Miami Dolphins",         abbr: "MIA", color: "#008E97" },
  { team: "Minnesota Vikings",      abbr: "MIN", color: "#4F2683" },
  { team: "New England Patriots",   abbr: "NE",  color: "#002244" },
  { team: "New Orleans Saints",     abbr: "NO",  color: "#D3BC8D" },
  { team: "New York Giants",        abbr: "NYG", color: "#0B2265" },
  { team: "New York Jets",          abbr: "NYJ", color: "#125740" },
  { team: "Philadelphia Eagles",    abbr: "PHI", color: "#004C54" },
  { team: "Pittsburgh Steelers",    abbr: "PIT", color: "#FFB612" },
  { team: "San Francisco 49ers",    abbr: "SF",  color: "#AA0000" },
  { team: "Seattle Seahawks",       abbr: "SEA", color: "#002244" },
  { team: "Tampa Bay Buccaneers",   abbr: "TB",  color: "#D50A0A" },
  { team: "Tennessee Titans",       abbr: "TEN", color: "#4B92DB" },
  { team: "Washington Commanders",  abbr: "WSH", color: "#5A1414" },
];

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: "100vh",
    background: "#080810",
    fontFamily: "'Oswald', sans-serif",
    color: "#e8e0d0",
    padding: "56px 0 80px",
  },
  header: {
    background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)",
    borderBottom: "1px solid #ffffff08",
    padding: "24px 28px 20px",
    textAlign: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: "clamp(22px, 4vw, 34px)",
    fontWeight: 900,
    letterSpacing: 3,
    textTransform: "uppercase",
    background: "linear-gradient(90deg, #f0d070, #e87040)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  headerSub: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#ffffff33",
    marginTop: 4,
    textTransform: "uppercase",
  },
  loadingBar: {
    margin: "10px auto 0",
    maxWidth: 300,
    height: 3,
    background: "#ffffff10",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    background: "linear-gradient(90deg, #f0d070, #e87040)",
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  loadingText: {
    fontSize: 11,
    color: "#f0d07066",
    letterSpacing: 1.5,
    marginTop: 6,
    textTransform: "uppercase",
  },
  grid: {
    maxWidth: 900,
    margin: "20px auto 0",
    padding: "0 16px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 10,
  },
  pickCard: (filled, isDragging) => ({
    background: filled ? "#0e0e1e" : "#0a0a16",
    border: `1px solid ${filled ? "#ffffff14" : "#ffffff08"}`,
    borderRadius: 10,
    padding: "10px 12px",
    cursor: "pointer",
    transition: "all 0.18s ease",
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    overflow: "hidden",
  }),
  pickNum: (color) => ({
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    color: color + "cc",
    textTransform: "uppercase",
  }),
  teamTag: (color) => ({
    display: "inline-block",
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "2px 7px",
    borderRadius: 4,
    background: color + "22",
    border: `1px solid ${color}44`,
    color: color === "#A5ACAF" ? "#c8c8c8" : color,
    textTransform: "uppercase",
  }),
  playerName: {
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: "#f0e8d8",
    marginTop: 4,
    lineHeight: 1.2,
  },
  playerPos: {
    fontSize: 11,
    color: "#ffffff44",
    letterSpacing: 1,
    marginTop: 2,
  },
  emptySlot: {
    fontSize: 13,
    color: "#ffffff20",
    letterSpacing: 1,
    marginTop: 6,
    fontStyle: "italic",
  },
  tradeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "2px 6px",
    borderRadius: 4,
    background: "#f0a03022",
    border: "1px solid #f0a03055",
    color: "#f0a030",
    textTransform: "uppercase",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: "#0e0e20",
    border: "1px solid #ffffff14",
    borderRadius: 16,
    padding: "28px 24px",
    maxWidth: 480,
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: "#ffffff44",
    letterSpacing: 1,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "#ffffff33",
    marginBottom: 8,
    marginTop: 16,
  },
  suggestionChip: (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${selected ? "#f0d07055" : "#ffffff10"}`,
    background: selected ? "#f0d07010" : "transparent",
    cursor: "pointer",
    transition: "all 0.15s",
    marginBottom: 6,
  }),
  searchInput: {
    width: "100%",
    background: "#080814",
    border: "1px solid #ffffff14",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e8e0d0",
    fontSize: 14,
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: 1,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 10,
  },
  btn: (variant) => ({
    padding: variant === "primary" ? "11px 24px" : "9px 18px",
    borderRadius: 8,
    border: variant === "primary" ? "none" : "1px solid #ffffff14",
    background: variant === "primary"
      ? "linear-gradient(135deg, #f0d070, #e87040)"
      : variant === "danger" ? "#e8403011" : "#ffffff08",
    color: variant === "primary" ? "#1a1008" : variant === "danger" ? "#e84030" : "#e8e0d0",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Oswald', sans-serif",
    transition: "all 0.15s",
    ...(variant === "danger" ? { border: "1px solid #e8403033" } : {}),
  }),
};

// ── Player search modal ───────────────────────────────────────────────────────
function PickModal({ pick, suggestions, allProspects, onSelect, onTrade, onClear, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(pick.player || null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.length > 1
    ? allProspects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.position.toLowerCase().includes(query.toLowerCase()) ||
        p.school.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : [];

  const pickSuggestions = suggestions[pick.pick] || [];

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={S.teamTag(pick.color)}>{pick.abbr}</span>
              {pick.traded && <span style={{ ...S.tradeBadge, position: "static" }}>TRADED</span>}
            </div>
            <div style={S.modalTitle}>Pick #{pick.pick}</div>
            <div style={S.modalSub}>{pick.team}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
        </div>

        {/* Suggestions */}
        {pickSuggestions.length > 0 && (
          <>
            <div style={S.sectionLabel}>AI Suggestions for this pick</div>
            {pickSuggestions.map(p => (
              <div
                key={p.name}
                style={S.suggestionChip(selected?.name === p.name)}
                onClick={() => setSelected(p)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1 }}>{p.position} · {p.school}</div>
                </div>
                {selected?.name === p.name && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
              </div>
            ))}
          </>
        )}

        {/* Search all prospects */}
        <div style={S.sectionLabel}>Search all prospects</div>
        <input
          ref={inputRef}
          style={S.searchInput}
          placeholder="Name, position, school..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {filtered.map(p => (
          <div
            key={p.name}
            style={S.suggestionChip(selected?.name === p.name)}
            onClick={() => { setSelected(p); setQuery(""); }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1 }}>{p.position} · {p.school}</div>
            </div>
            {selected?.name === p.name && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
          </div>
        ))}
        {query.length > 1 && filtered.length === 0 && (
          <div style={{ fontSize: 13, color: "#ffffff30", textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>
            No prospects found
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
          <button
            style={S.btn("primary")}
            onClick={() => selected && onSelect(pick.pick, selected)}
            disabled={!selected}
          >
            Confirm Pick
          </button>
          <button style={{ ...S.btn("secondary"), color: "#f0a030", borderColor: "#f0a03033", background: "#f0a03011" }} onClick={() => onTrade(pick.pick)}>
            🔀 Trade
          </button>
          {pick.player && (
            <button style={S.btn("danger")} onClick={() => onClear(pick.pick)}>
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Trade modal ───────────────────────────────────────────────────────────────
function TradeModal({ pick, picks, onConfirm, onClose }) {
  const [swapWith, setSwapWith] = useState(null);
  const [newTeam, setNewTeam] = useState(null);
  const [isSwap, setIsSwap] = useState(true);
  const [step, setStep] = useState("type"); // "type" | "team" | "swap_pick"

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={S.modalTitle}>Trade Pick #{pick.pick}</div>
            <div style={S.modalSub}>{pick.team}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0 }}>✕</button>
        </div>

        {step === "type" && (
          <>
            <div style={S.sectionLabel}>What kind of trade?</div>
            {[
              { id: true,  label: "Pick swap", desc: "Two teams exchange picks" },
              { id: false, label: "One-way acquisition", desc: "A team gets this pick without giving one back" },
            ].map(opt => (
              <div
                key={String(opt.id)}
                style={{ ...S.suggestionChip(isSwap === opt.id), marginBottom: 8 }}
                onClick={() => setIsSwap(opt.id)}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "#ffffff44" }}>{opt.desc}</div>
                </div>
                {isSwap === opt.id && <span style={{ color: "#f0d070" }}>✓</span>}
              </div>
            ))}
            <button style={{ ...S.btn("primary"), marginTop: 12 }} onClick={() => setStep("team")}>
              Next →
            </button>
          </>
        )}

        {step === "team" && (
          <>
            <div style={S.sectionLabel}>Which team is getting Pick #{pick.pick}?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 260, overflowY: "auto" }}>
              {ALL_TEAMS.filter(t => t.team !== pick.team).map(t => (
                <div
                  key={t.abbr}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${newTeam?.abbr === t.abbr ? t.color + "88" : "#ffffff10"}`,
                    background: newTeam?.abbr === t.abbr ? t.color + "18" : "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    color: newTeam?.abbr === t.abbr ? (t.color === "#A5ACAF" ? "#c8c8c8" : t.color) : "#ffffff66",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setNewTeam(t)}
                >
                  {t.abbr}
                </div>
              ))}
            </div>
            {isSwap && newTeam && (
              <>
                <div style={{ ...S.sectionLabel, marginTop: 16 }}>Which pick does {newTeam.abbr} send back?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 160, overflowY: "auto" }}>
                  {picks.filter(p => p.team === newTeam.team && p.pick !== pick.pick).map(p => (
                    <div
                      key={p.pick}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: `1px solid ${swapWith?.pick === p.pick ? "#f0d07066" : "#ffffff10"}`,
                        background: swapWith?.pick === p.pick ? "#f0d07011" : "transparent",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        color: swapWith?.pick === p.pick ? "#f0d070" : "#ffffff55",
                        transition: "all 0.15s",
                      }}
                      onClick={() => setSwapWith(p)}
                    >
                      #{p.pick}
                    </div>
                  ))}
                  {picks.filter(p => p.team === newTeam.team && p.pick !== pick.pick).length === 0 && (
                    <div style={{ fontSize: 12, color: "#ffffff33", fontStyle: "italic" }}>
                      {newTeam.abbr} has no other 1st round picks
                    </div>
                  )}
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={S.btn("secondary")} onClick={() => setStep("type")}>← Back</button>
              <button
                style={S.btn("primary")}
                disabled={!newTeam || (isSwap && !swapWith && picks.filter(p => p.team === newTeam?.team).length > 0)}
                onClick={() => onConfirm({ pickNum: pick.pick, newTeam, swapWith: isSwap ? swapWith : null })}
              >
                Confirm Trade
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Share / image export ──────────────────────────────────────────────────────
function ShareModal({ picks, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 800, ROW = 36, PAD = 20, HEADER = 80;
    canvas.width = W;
    canvas.height = HEADER + picks.length * ROW + PAD * 2;

    // Background
    ctx.fillStyle = "#080810";
    ctx.fillRect(0, 0, W, canvas.height);

    // Header
    ctx.fillStyle = "#f0d070";
    ctx.font = "bold 28px 'Oswald', Impact, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.textAlign = "center";
    ctx.fillText("MY 2026 NFL MOCK DRAFT", W / 2, 44);
    ctx.fillStyle = "#ffffff22";
    ctx.font = "13px 'Oswald', sans-serif";
    ctx.fillText("trivialsports.com", W / 2, 66);

    // Divider
    ctx.strokeStyle = "#ffffff10";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, HEADER - 4);
    ctx.lineTo(W - PAD, HEADER - 4);
    ctx.stroke();

    // Picks
    picks.forEach((pick, i) => {
      const y = HEADER + i * ROW + PAD;
      const isEven = i % 2 === 0;
      if (isEven) {
        ctx.fillStyle = "#0d0d1c";
        ctx.fillRect(PAD, y - 4, W - PAD * 2, ROW);
      }

      // Pick number
      ctx.fillStyle = "#ffffff33";
      ctx.font = "bold 12px 'Oswald', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`#${String(pick.pick).padStart(2, "0")}`, PAD + 8, y + 16);

      // Team tag
      const tagColor = pick.color || "#888";
      ctx.fillStyle = tagColor + "33";
      ctx.roundRect?.(PAD + 48, y + 1, 46, 22, 4) || ctx.fillRect(PAD + 48, y + 1, 46, 22);
      ctx.fill();
      ctx.strokeStyle = tagColor + "66";
      ctx.lineWidth = 1;
      ctx.roundRect?.(PAD + 48, y + 1, 46, 22, 4) || ctx.strokeRect(PAD + 48, y + 1, 46, 22);
      ctx.stroke();
      ctx.fillStyle = tagColor === "#A5ACAF" ? "#c8c8c8" : tagColor;
      ctx.font = "bold 11px 'Oswald', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pick.abbr, PAD + 48 + 23, y + 16);

      // Trade badge
      if (pick.traded) {
        ctx.fillStyle = "#f0a030";
        ctx.font = "bold 9px 'Oswald', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("TRADED", PAD + 102, y + 16);
      }

      // Player name
      ctx.fillStyle = pick.player ? "#f0e8d8" : "#ffffff22";
      ctx.font = pick.player ? "bold 15px 'Oswald', sans-serif" : "13px 'Oswald', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        pick.player ? pick.player.name : "— not selected —",
        PAD + (pick.traded ? 165 : 110),
        y + 16
      );

      // Position + school
      if (pick.player) {
        ctx.fillStyle = "#ffffff33";
        ctx.font = "12px 'Oswald', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${pick.player.position} · ${pick.player.school}`, W - PAD - 8, y + 16);
      }
    });
  }, [picks]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "my-2026-nfl-mock-draft.png";
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 560 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={S.modalTitle}>Share Your Mock Draft</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0 }}>✕</button>
        </div>
        <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 8, border: "1px solid #ffffff10", display: "block", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={S.btn("primary")} onClick={download}>⬇ Save Image</button>
          <button style={S.btn("secondary")} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NFLMockDraft() {
  const [picks, setPicks] = useState(INITIAL_PICKS.map(p => ({ ...p, player: null, traded: false })));
  const [activePick, setActivePick] = useState(null);
  const [tradePick, setTradePick] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [dragSrc, setDragSrc] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelect = (pickNum, player) => {
    setPicks(prev => prev.map(p => p.pick === pickNum ? { ...p, player } : p));
    setActivePick(null);
  };

  const handleClear = (pickNum) => {
    setPicks(prev => prev.map(p => p.pick === pickNum ? { ...p, player: null } : p));
    setActivePick(null);
  };

  const handleTrade = (pickNum) => {
    setActivePick(null);
    setTradePick(pickNum);
  };

  const handleTradeConfirm = ({ pickNum, newTeam, swapWith }) => {
    setPicks(prev => {
      const next = prev.map(p => {
        if (p.pick === pickNum) {
          return { ...p, team: newTeam.team, abbr: newTeam.abbr, color: newTeam.color, traded: true, player: p.player };
        }
        if (swapWith && p.pick === swapWith.pick) {
          const original = INITIAL_PICKS.find(ip => ip.pick === pickNum);
          return { ...p, team: original.team, abbr: original.abbr, color: original.color, traded: true };
        }
        return p;
      });
      return next;
    });
    setTradePick(null);
  };

  // ── Drag-and-drop to reorder filled picks ───────────────────────────────────
  const handleDragStart = (pickNum) => setDragSrc(pickNum);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetPickNum) => {
    if (dragSrc === null || dragSrc === targetPickNum) return;
    setPicks(prev => {
      const src = prev.find(p => p.pick === dragSrc);
      const tgt = prev.find(p => p.pick === targetPickNum);
      if (!src?.player || !tgt) return prev;
      return prev.map(p => {
        if (p.pick === dragSrc) return { ...p, player: tgt.player };
        if (p.pick === targetPickNum) return { ...p, player: src.player };
        return p;
      });
    });
    setDragSrc(null);
  };

  const filledCount = picks.filter(p => p.player).length;
  const activePkObj = activePick ? picks.find(p => p.pick === activePick) : null;
  const tradePkObj = tradePick ? picks.find(p => p.pick === tradePick) : null;

  return (
    <div style={S.app}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>2026 NFL Mock Draft</h1>
        <div style={S.headerSub}>1st Round · Build Your Predictions</div>

        <div style={{ marginTop: 6, fontSize: 11, color: "#ffffff33", letterSpacing: 1 }}>
          {ALL_PROSPECTS.length} prospects · updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </div>

        {/* Progress + share */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#ffffff44", letterSpacing: 1 }}>
            <span style={{ color: "#f0d070", fontWeight: 700 }}>{filledCount}</span> / 32 picks made
          </div>
          {filledCount > 0 && (
            <button style={S.btn("primary")} onClick={() => setShowShare(true)}>
              Share Draft
            </button>
          )}
        </div>
      </div>

      {/* Pick grid */}
      <div style={S.grid}>
        {picks.map(pick => (
          <div
            key={pick.pick}
            style={S.pickCard(!!pick.player, dragSrc === pick.pick)}
            onClick={() => setActivePick(pick.pick)}
            draggable={!!pick.player}
            onDragStart={() => handleDragStart(pick.pick)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(pick.pick)}
          >
            {/* Color accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: pick.color, borderRadius: "10px 0 0 10px", opacity: 0.7 }} />
            <div style={{ paddingLeft: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={S.pickNum(pick.color)}>Pick {pick.pick}</span>
                <span style={S.teamTag(pick.color)}>{pick.abbr}</span>
              </div>
              {pick.player ? (
                <>
                  <div style={S.playerName}>{pick.player.name}</div>
                  <div style={S.playerPos}>{pick.player.position} · {pick.player.school}</div>
                </>
              ) : (
                <div style={S.emptySlot}>
                  {PICK_SUGGESTIONS[pick.pick]?.length > 0 ? `${PICK_SUGGESTIONS[pick.pick][0].name}?` : "Select a player…"}
                </div>
              )}
            </div>
            {pick.traded && <span style={S.tradeBadge}>Traded</span>}
          </div>
        ))}
      </div>

      {/* Modals */}
      {activePkObj && (
        <PickModal
          pick={activePkObj}
          suggestions={PICK_SUGGESTIONS}
          allProspects={ALL_PROSPECTS}
          onSelect={handleSelect}
          onTrade={handleTrade}
          onClear={handleClear}
          onClose={() => setActivePick(null)}
        />
      )}
      {tradePkObj && (
        <TradeModal
          pick={tradePkObj}
          picks={picks}
          onConfirm={handleTradeConfirm}
          onClose={() => setTradePick(null)}
        />
      )}
      {showShare && (
        <ShareModal
          picks={picks}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
