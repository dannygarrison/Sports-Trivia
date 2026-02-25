import { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";
import { PLAYERS } from "./nflChainPlayers.js";

// ── DATA ─────────────────────────────────────────────────────────────────────

const NFL_TEAMS = [
  "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills",
  "Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns",
  "Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers",
  "Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs",
  "Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins",
  "Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants",
  "New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers",
  "Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"
];

const TEAM_ALIASES = {
  "Arizona Cardinals": ["arizona","cardinals","ari"],
  "Atlanta Falcons": ["atlanta","falcons","atl"],
  "Baltimore Ravens": ["baltimore","ravens","bal"],
  "Buffalo Bills": ["buffalo","bills","buf"],
  "Carolina Panthers": ["carolina","panthers","car"],
  "Chicago Bears": ["chicago","bears","chi"],
  "Cincinnati Bengals": ["cincinnati","bengals","cin"],
  "Cleveland Browns": ["cleveland","browns","cle"],
  "Dallas Cowboys": ["dallas","cowboys","dal"],
  "Denver Broncos": ["denver","broncos","den"],
  "Detroit Lions": ["detroit","lions","det"],
  "Green Bay Packers": ["green bay","packers","gb","gbp"],
  "Houston Texans": ["houston","texans","hou"],
  "Indianapolis Colts": ["indianapolis","colts","ind"],
  "Jacksonville Jaguars": ["jacksonville","jaguars","jax"],
  "Kansas City Chiefs": ["kansas city","chiefs","kc"],
  "Las Vegas Raiders": ["las vegas","raiders","lv","lvr","oakland raiders","oakland"],
  "Los Angeles Chargers": ["los angeles chargers","la chargers","chargers","lac","san diego chargers","san diego"],
  "Los Angeles Rams": ["los angeles rams","la rams","rams","lar","st. louis rams","st louis rams","st. louis","st louis"],
  "Miami Dolphins": ["Miami (FL)","dolphins","mia"],
  "Minnesota Vikings": ["minnesota","vikings","min"],
  "New England Patriots": ["new england","patriots","ne","nep"],
  "New Orleans Saints": ["new orleans","saints","no"],
  "New York Giants": ["new york giants","giants","nyg"],
  "New York Jets": ["new york jets","jets","nyj"],
  "Philadelphia Eagles": ["philadelphia","eagles","phi"],
  "Pittsburgh Steelers": ["pittsburgh","steelers","pit"],
  "San Francisco 49ers": ["san francisco","49ers","sf","niners"],
  "Seattle Seahawks": ["seattle","seahawks","sea"],
  "Tampa Bay Buccaneers": ["tampa bay","buccaneers","tb","bucs"],
  "Tennessee Titans": ["tennessee","titans","ten"],
  "Washington Commanders": ["washington","commanders","was","wsh","washington football team","washington redskins","washington nationals","football team"],
};

// Normalize college input the same way as the alma maters game
function normalizeCollege(s) {
  return s.toLowerCase()
    .replace(/university of /g, "").replace(/\buniversity\b/g, "")
    .replace(/\bcollege\b/g, "").replace(/\bstate\b/g, "st")
    .replace(/[^a-z0-9]/g, "").trim();
}

const COLLEGE_ALIASES = {
  // Power conferences / well-known
  "usc":["southern california","southern cal"],"lsu":["louisiana state"],
  "smu":["southern methodist"],"TCU":["TCU"],"byu":["brigham young"],
  "ole miss":["Ole Miss","miss"],"mississippi st":["miss state","miss st"],"miami fl":["miami florida","Miami (FL)","miami"],
  "miami oh":["miami ohio"],"unc":["north carolina"],"nc state":["north carolina state"],
  "pitt":["pittsburgh"],"penn st":["penn state"],"ohio st":["ohio state"],
  "michigan st":["michigan state"],"florida st":["florida state"],"utep":["texas el paso"],
  "bama":["alabama"],"roll tide":["alabama"],"cal":["california"],"cuse":["syracuse"],
  "chattanooga":["tennessee-chattanooga"],"utc":["tennessee-chattanooga"],
  "wvu":["west virginia"],"vt":["virginia tech"],"hokies":["virginia tech"],
  "wsu":["washington state"],"asu":["arizona state"],"csu":["colorado state"],
  "ksu":["kansas state"],"isu":["iowa state"],"bsu":["boise state"],
  "usu":["utah state"],"ndsu":["north dakota state"],
  "gt":["georgia tech"],"bc":["boston college"],
  "uconn":["connecticut"],"umass":["massachusetts"],
  "ecu":["east carolina"],
  "fau":["florida atlantic"],
  "fiu":["florida international"],
  "usf":["south florida"],
  "ucf":["central florida"],
  "mtsu":["middle tennessee state","middle tennessee"],
  "niu":["northern illinois"],
  "wku":["western kentucky"],
  "ewu":["eastern washington"],
  "eiu":["eastern illinois"],
  "emu":["eastern michigan"],
  "cmu":["central michigan"],
  "wmu":["western michigan"],
  "sdsu":["south dakota state"],
  "mvsu":["mississippi valley state"],
  "uapb":["arkansas-pine bluff","arkansas pine bluff"],
  "utsa":["texas san antonio","ut san antonio"],"fsu":["florida state"],
  "minnesota state":["minnesota state-mankato"],"minnesota st":["minnesota state-mankato"],
  "mankato":["minnesota state-mankato"],
  // Extra common shorthands
  "nd":["notre dame"],"ou":["oklahoma"],"uga":["georgia"],
  "osu":["ohio state"],"psu":["penn state"],"uf":["florida"],
  "ut":["tennessee"],"uw":["washington"],"ku":["kansas"],
};


// ── HELPERS ──────────────────────────────────────────────────────────────────

function normalize(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

// Phonetic normalization — collapse common spelling variants before comparing
function phoneticNorm(s) {
  return s.toLowerCase()
    .replace(/ph/g, "f")
    .replace(/ou/g, "u")
    .replace(/ck/g, "k")
    .replace(/ough/g, "o")
    .replace(/ae/g, "e")
    .replace(/oo/g, "u")
    .replace(/[aeiou]+/g, "a")
    .replace(/(.)\1+/g, "$1")
    .trim();
}

// Levenshtein distance
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1]
        ? dp[i-1][j-1]
        : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

// Normalized player name map — populated after PLAYERS array
const PLAYER_NORMALIZED = new Map();

// Find closest matching player name using phonetic + levenshtein scoring
function findPlayerSuggestion(raw) {
  const norm = normalize(raw);
  const words = norm.split(" ");
  if (words.length < 2) return null;

  const inpFirst = words[0];
  const inpLast = words.slice(1).join(" ");
  const lastInitial = inpLast[0];
  const firstInitial = inpFirst.charCodeAt(0);
  const inpFirstPh = phoneticNorm(inpFirst);
  const inpLastPh = phoneticNorm(inpLast);

  let best = null;
  let bestScore = [999, 999, 999];

  for (const [key, canonical] of PLAYER_NORMALIZED) {
    const kwords = key.split(" ");
    if (kwords.length < 2) continue;
    const kFirst = kwords[0];
    const kLast = kwords.slice(1).join(" ");

    if (!kLast.startsWith(lastInitial)) continue;
    if (Math.abs(kFirst.charCodeAt(0) - firstInitial) > 1) continue;

    const firstPd = levenshtein(inpFirstPh, phoneticNorm(kFirst));
    const lastPd = levenshtein(inpLastPh, phoneticNorm(kLast));
    if (firstPd > 2 || lastPd > 2) continue;

    const fd = levenshtein(norm, key);
    if (fd === 0 || fd > 7) continue;

    const score = [firstPd + lastPd, fd, firstPd];
    if (score[0] < bestScore[0] || (score[0] === bestScore[0] && score[1] < bestScore[1])) {
      bestScore = score;
      best = canonical;
    }
  }

  return best;
}

function resolveTeam(input) {
  const n = normalize(input);
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if (normalize(canonical) === n) return canonical;
    if (aliases.some(a => a === n)) return canonical;
  }
  return null;
}

function resolveCollege(input, players) {
  const g = normalizeCollege(input);
  const allColleges = [...new Set(players.flatMap(p => p.colleges))];

  for (const college of allColleges) {
    const c = normalizeCollege(college);

    // Exact match
    if (g === c) return college;

    // Prefix match (e.g. "michigan" matches "michigan state" only at word boundary)
    if (c.startsWith(g) && g.length >= 4) {
      const nextChar = c[g.length];
      const isWordBoundary = nextChar === undefined || !/[a-z0-9]/.test(nextChar);
      if (isWordBoundary && !c.endsWith("st")) return college;
      if (isWordBoundary && c.endsWith("st") && g.endsWith("st")) return college;
    }

    // Alias match: if guess and college both normalize to the same alias group
    for (const [key, variants] of Object.entries(COLLEGE_ALIASES)) {
      const allForms = [normalizeCollege(key), ...variants.map(normalizeCollege)];
      if (allForms.includes(g) && allForms.includes(c)) return college;
    }
  }
  return null;
}

// Common first-name nicknames — allows "Matt Stafford" to find "Matthew Stafford" etc.
const FIRST_NAME_ALIASES = {
  "matthew": ["matt"],
  "michael": ["mike"],
  "robert": ["rob", "bob", "bobby"],
  "william": ["will", "bill", "billy"],
  "james": ["jim", "jimmy"],
  "joseph": ["joe", "joey"],
  "thomas": ["tom", "tommy"],
  "christopher": ["chris"],
  "nicholas": ["nick"],
  "anthony": ["tony"],
  "jonathan": ["jon", "jonny"],
  "nathaniel": ["nate"],
  "nathanael": ["nate"],
  "benjamin": ["ben"],
  "daniel": ["dan", "danny"],
  "timothy": ["tim", "timmy"],
  "jeffrey": ["jeff"],
  "geoffrey": ["jeff"],
  "stephen": ["steve"],
  "steven": ["steve"],
  "richard": ["rick", "rich", "richie", "dick"],
  "charles": ["charlie", "chuck"],
  "patrick": ["pat"],
  "kenneth": ["ken", "kenny"],
  "donald": ["don"],
  "ronald": ["ron"],
  "lawrence": ["larry"],
  "raymond": ["ray"],
  "gregory": ["greg"],
  "gerald": ["jerry"],
  "jerome": ["jerry"],
  "terrence": ["terry"],
  "terrell": ["terry"],
  "frederick": ["fred"],
  "douglas": ["doug"],
  "edward": ["ed", "eddie"],
  "theodore": ["ted", "theo"],
  "leonard": ["len", "lenny"],
  "reginald": ["reggie"],
  "roderick": ["rod"],
  "cornelius": ["neil"],
  "ezekiel": ["zeke"],
  "isaiah": ["zay"],
  "alejandro": ["alex"],
  "alexander": ["alex"],
  "emmanuel": ["manny"],
};

// Build reverse lookup: short form -> [full form, ...]
const FIRST_NAME_REVERSE = {};
for (const [full, shorts] of Object.entries(FIRST_NAME_ALIASES)) {
  for (const short of shorts) {
    if (!FIRST_NAME_REVERSE[short]) FIRST_NAME_REVERSE[short] = [];
    FIRST_NAME_REVERSE[short].push(full);
  }
}

function resolvePlayer(input, players) {
  const n = normalize(input);
  const stripSuffix = s => s.replace(/\b(jr|sr|ii|iii|iv)\b/g, "").replace(/\s+/g, " ").trim();
  const matches = [];

  // 1. Exact match
  const exact = players.find(p => normalize(p.name) === n);
  if (exact) matches.push(exact);

  // 2. Suffix-stripped matches ("Kenneth Walker" -> "Kenneth Walker III")
  const nStripped = stripSuffix(n);
  players.forEach(p => {
    if (p !== exact && stripSuffix(normalize(p.name)) === nStripped) matches.push(p);
  });

  // 3. First-name nickname matches ("Matt Stafford" -> "Matthew Stafford")
  const parts = nStripped.split(" ");
  if (parts.length >= 2) {
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");

    const fullNames = FIRST_NAME_REVERSE[firstName] || [];
    for (const fullFirst of fullNames) {
      const expanded = fullFirst + " " + lastName;
      players.forEach(p => {
        if (!matches.includes(p) && stripSuffix(normalize(p.name)) === expanded) matches.push(p);
      });
    }

    const nicknames = FIRST_NAME_ALIASES[firstName] || [];
    for (const nick of nicknames) {
      const shortened = nick + " " + lastName;
      players.forEach(p => {
        if (!matches.includes(p) && stripSuffix(normalize(p.name)) === shortened) matches.push(p);
      });
    }
  }

  return matches.length > 0 ? matches : null;
}

// Populate PLAYER_NORMALIZED map from PLAYERS array
PLAYERS.forEach(p => PLAYER_NORMALIZED.set(normalize(p.name), p.name));

const TEAM_LEGACY_MAP = {
  "Los Angeles Rams": ["St. Louis Rams"],
  "Las Vegas Raiders": ["Oakland Raiders"],
  "Los Angeles Chargers": ["San Diego Chargers"],
  "Washington Commanders": ["Washington Redskins","Washington Football Team"],
  "Tennessee Titans": ["Houston Oilers","Tennessee Oilers"],
  "Indianapolis Colts": ["Baltimore Colts"],
  "Arizona Cardinals": ["St. Louis Cardinals","Chicago Cardinals"],
};

function playerOnTeam(player, team) {
  if (player.teams.includes(team)) return true;
  const legacyNames = TEAM_LEGACY_MAP[team] || [];
  return legacyNames.some(legacy => player.teams.includes(legacy));
}

function playerAtCollege(player, college) {
  const normCollege = normalizeCollege(college);
  return player.colleges.some(c => {
    const normC = normalizeCollege(c);
    if (normC === normCollege) return true;
    // Check if both map to the same alias group
    for (const [key, variants] of Object.entries(COLLEGE_ALIASES)) {
      const allForms = [normalizeCollege(key), ...variants.map(normalizeCollege)];
      if (allForms.includes(normC) && allForms.includes(normCollege)) return true;
    }
    return false;
  });
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────

// Step types
const STEP = {
  TEAM: "team",       // need to name a player who played for currentTeam
  PLAYER_TO_COLLEGE: "player_to_college", // just named a player, need their college
  COLLEGE: "college", // need to name a player who went to currentCollege
  PLAYER_TO_TEAM: "player_to_team",       // just named a player, need a team they played for
};

const TEAM_DEMONYM = {
  "Arizona Cardinals": "Arizona Cardinal",
  "Atlanta Falcons": "Atlanta Falcon",
  "Baltimore Ravens": "Baltimore Raven",
  "Buffalo Bills": "Buffalo Bill",
  "Carolina Panthers": "Carolina Panther",
  "Chicago Bears": "Chicago Bear",
  "Cincinnati Bengals": "Cincinnati Bengal",
  "Cleveland Browns": "Cleveland Brown",
  "Dallas Cowboys": "Dallas Cowboy",
  "Denver Broncos": "Denver Bronco",
  "Detroit Lions": "Detroit Lion",
  "Green Bay Packers": "Green Bay Packer",
  "Houston Texans": "Houston Texan",
  "Indianapolis Colts": "Indianapolis Colt",
  "Jacksonville Jaguars": "Jacksonville Jaguar",
  "Kansas City Chiefs": "Kansas City Chief",
  "Las Vegas Raiders": "Las Vegas Raider",
  "Los Angeles Chargers": "Los Angeles Charger",
  "Los Angeles Rams": "Los Angeles Ram",
  "Miami Dolphins": "Miami Dolphin",
  "Minnesota Vikings": "Minnesota Viking",
  "New England Patriots": "New England Patriot",
  "New Orleans Saints": "New Orleans Saint",
  "New York Giants": "New York Giant",
  "New York Jets": "New York Jet",
  "Philadelphia Eagles": "Philadelphia Eagle",
  "Pittsburgh Steelers": "Pittsburgh Steeler",
  "San Francisco 49ers": "San Francisco 49er",
  "Seattle Seahawks": "Seattle Seahawk",
  "Tampa Bay Buccaneers": "Tampa Bay Buccaneer",
  "Tennessee Titans": "Tennessee Titan",
  "Washington Commanders": "Washington Commander",
};

const STEP_LABELS = {
  [STEP.TEAM]: (ctx) => { const d = TEAM_DEMONYM[ctx.currentTarget] || ctx.currentTarget; const article = /^[aeiou]/i.test(d) ? 'an' : 'a'; return `Name ${article} ${d}`; },
  [STEP.PLAYER_TO_COLLEGE]: (ctx) => `Where did ${ctx.currentTarget} go to college?`,
  [STEP.COLLEGE]: (ctx) => `Name an NFL player who went to ${ctx.currentTarget}`,
  [STEP.PLAYER_TO_TEAM]: (ctx) => `Name an NFL team ${ctx.currentTarget} has played for`,
};

const STEP_HINT = {
  [STEP.TEAM]: "Type any NFL player's name",
  [STEP.PLAYER_TO_COLLEGE]: "Type the college name",
  [STEP.COLLEGE]: "Type any NFL player's name",
  [STEP.PLAYER_TO_TEAM]: "Type any NFL team name",
};

// ── CHAIN NODE DISPLAY ───────────────────────────────────────────────────────
function ChainNode({ item, type, isLatest }) {
  const isTeam = type === "team";
  const isCollege = type === "college";
  const isPlayer = type === "player";

  const colors = isTeam
    ? { bg: "#0f1f2e", border: "#1a6b9e", text: "#5bb8f5", label: "#1a6b9e" }
    : isCollege
    ? { bg: "#1e1a0e", border: "#7a5f1a", text: "#e8c060", label: "#7a5f1a" }
    : { bg: "#0e1e10", border: "#2a7a40", text: "#5fd88a", label: "#2a7a40" };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      animation: isLatest ? "popIn .3s cubic-bezier(.34,1.56,.64,1)" : "none",
    }}>
      <div style={{
        fontSize: 8, fontFamily: "'Oswald', sans-serif", letterSpacing: 3,
        color: colors.label, textTransform: "uppercase", marginBottom: 3,
      }}>
        {isTeam ? "NFL Team" : isCollege ? "College" : "Player"}
      </div>
      <div style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 8, padding: "6px 12px",
        fontSize: 12, fontWeight: 700,
        fontFamily: "'Oswald', sans-serif",
        color: colors.text,
        letterSpacing: 0.5,
        maxWidth: 160, textAlign: "center",
        lineHeight: 1.3,
        boxShadow: isLatest ? `0 0 12px ${colors.border}55` : "none",
      }}>
        <Helmet>
  <title>NFL Chain – TrivialSports</title>
  <meta name="description" content="Link NFL teams through shared players and colleges. How long can you make your chain?" />
  <meta property="og:title" content="NFL Chain – TrivialSports" />
  <meta property="og:description" content="Link NFL teams through shared players and colleges. How long can you make your chain?" />
  <meta property="og:url" content="https://trivialsports.com/games/nfl-chain" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
</Helmet>
        {item}
      </div>
    </div>
  );
}

function ChainConnector() {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      fontSize: 14, padding: "0 4px",
    }}>🔗</div>
  );
}

// ── TEAM PROGRESS TRACKER ────────────────────────────────────────────────────
const TEAM_ABBR = {
  "Arizona Cardinals": "ARI", "Atlanta Falcons": "ATL",
  "Baltimore Ravens": "BAL", "Buffalo Bills": "BUF",
  "Carolina Panthers": "CAR", "Chicago Bears": "CHI",
  "Cincinnati Bengals": "CIN", "Cleveland Browns": "CLE",
  "Dallas Cowboys": "DAL", "Denver Broncos": "DEN",
  "Detroit Lions": "DET", "Green Bay Packers": "GB",
  "Houston Texans": "HOU", "Indianapolis Colts": "IND",
  "Jacksonville Jaguars": "JAX", "Kansas City Chiefs": "KC",
  "Las Vegas Raiders": "LV", "Los Angeles Chargers": "LAC",
  "Los Angeles Rams": "LAR", "Miami Dolphins": "MIA",
  "Minnesota Vikings": "MIN", "New England Patriots": "NE",
  "New Orleans Saints": "NO", "New York Giants": "NYG",
  "New York Jets": "NYJ", "Philadelphia Eagles": "PHI",
  "Pittsburgh Steelers": "PIT", "San Francisco 49ers": "SF",
  "Seattle Seahawks": "SEA", "Tampa Bay Buccaneers": "TB",
  "Tennessee Titans": "TEN", "Washington Commanders": "WSH",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function TeamTracker({ usedTeams, total }) {
  const isMobile = useIsMobile();
  const cols = isMobile ? 8 : 16;
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${cols}, 1fr)`,
      gap: isMobile ? 3 : 4,
      maxWidth: 760,
      width: "100%",
    }}>
      {NFL_TEAMS.map(team => {
        const used = usedTeams.has(team);
        return (
          <div key={team} title={team} style={{
            fontSize: isMobile ? 8 : 9,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700, letterSpacing: 0.5,
            padding: isMobile ? "3px 2px" : "3px 7px",
            borderRadius: 4,
            background: used ? "#0d2a18" : "#1a1408",
            border: `1px solid ${used ? "#22c55e55" : "#7a5f1a55"}`,
            color: used ? "#22c55e" : "#e8c060",
            transition: "all 0.3s",
            textTransform: "uppercase",
            textAlign: "center",
          }}>
            {TEAM_ABBR[team]}
          </div>
        );
      })}
    </div>
  );
}

// ── COLLEGE TRACKER ──────────────────────────────────────────────────────────
// Common name overrides for schools that have a well-known shorter name
const COLLEGE_DISPLAY_NAME = {
  "florida state":          "Florida State",
  "michigan state":         "Michigan State",
  "ohio state":             "Ohio State",
  "penn state":             "Penn State",
  "iowa state":             "Iowa State",
  "kansas state":           "Kansas State",
  "arizona state":          "Arizona State",
  "colorado state":         "Colorado State",
  "washington state":       "Washington State",
  "oregon state":           "Oregon State",
  "utah state":             "Utah State",
  "boise state":            "Boise State",
  "north dakota state":     "North Dakota State",
  "south dakota state":     "South Dakota State",
  "mississippi state":      "Mississippi State",
  "georgia state":          "Georgia State",
  "appalachian state":      "App State",
  "brigham young":          "BYU",
  "byu":                    "BYU",
  "lsu":                    "LSU",
  "smu":                    "SMU",
  "TCU":                    "TCU",
  "usc":                    "USC",
  "ucla":                   "UCLA",
  "ucf":                    "UCF",
  "uconn":                  "UConn",
  "utep":                   "UTEP",
  "utsa":                   "UTSA",
  "ole miss":               "Ole Miss",
  "miami (fl)":             "Miami (FL)",
  "miami fl":               "Miami (FL)",
  "miami (oh)":             "Miami (OH)",
  "miami oh":               "Miami (OH)",
  "north carolina":         "UNC",
  "nc state":               "NC State",
  "north carolina state":   "NC State",
  "west virginia":          "West Virginia",
  "virginia tech":          "Virginia Tech",
  "southern miss":          "Southern Miss",
  "southern mississippi":   "Southern Miss",
  "tennessee-chattanooga":  "UTC",
  "grambling state":        "Grambling",
  "grambling":              "Grambling",
  "mississippi valley state":"Miss Valley St",
  "central florida":        "UCF",
  "south florida":          "USF",
  "florida atlantic":       "FAU",
  "florida international":  "FIU",
  "east carolina":          "ECU",
  "western kentucky":       "WKU",
  "eastern washington":     "Eastern Wash",
  "northern illinois":      "NIU",
  "middle tennessee state": "Middle Tenn",
  "middle tennessee":       "Middle Tenn",
  "georgia tech":           "Georgia Tech",
  "boston college":         "Boston College",
  "notre dame":             "Notre Dame",
  "TCU":        "TCU",
  "texas a&m":              "Texas A&M",
  "texas el paso":          "UTEP",
  "arkansas-pine bluff":    "UAPB",
  "minnesota state-mankato":"Minn State",
  "alabama-birmingham":     "UAB",
};

function getDisplayLabel(college) {
  const lower = college.toLowerCase().trim();
  if (COLLEGE_DISPLAY_NAME[lower]) return COLLEGE_DISPLAY_NAME[lower];
  // Truncate very long names gracefully at a word boundary
  if (college.length > 16) {
    const trimmed = college.substring(0, 15).trim();
    const lastSpace = trimmed.lastIndexOf(" ");
    return (lastSpace > 6 ? trimmed.substring(0, lastSpace) : trimmed) + "…";
  }
  return college;
}

function CollegeTracker({ usedColleges }) {
  const colleges = [...usedColleges].sort();
  if (colleges.length === 0) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 760 }}>
      {colleges.map(college => (
        <div key={college} title={college} style={{
          fontSize: 9, fontFamily: "'Oswald', sans-serif",
          fontWeight: 700, letterSpacing: 0.5,
          padding: "3px 7px", borderRadius: 4,
          background: "#0a1a2a",
          border: "1px solid #5bb8f533",
          color: "#5bb8f5",
          textTransform: "uppercase",
        }}>
          {getDisplayLabel(college)}
        </div>
      ))}
    </div>
  );
}

// ── MAIN GAME ────────────────────────────────────────────────────────────────
export default function NFLChain() {
  const [step, setStep] = useState(STEP.TEAM);
  const [currentTarget, seTCUrrentTarget] = useState(null); // current team/college/player to answer about
  const [chain, setChain] = useState([]); // [{item, type}]
  const [usedTeams, setUsedTeams] = useState(new Set());
  const [usedColleges, setUsedColleges] = useState(new Set());
  const [usedPlayers, setUsedPlayers] = useState(new Set());
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const justSetSuggestion = useRef(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [history, setHistory] = useState([]); // stack of snapshots for undo
  const inputRef = useRef(null);
  const chainContainerRef = useRef(null);
  const trackPlay = usePlayCount("nfl-chain");

  // Initialize with random team
  useEffect(() => {
    const team = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    seTCUrrentTarget(team);
    setUsedTeams(new Set([team]));
    setChain([{ item: team, type: "team" }]);
  }, []);

  // Scroll chain container horizontally to show latest link, without moving the page
  useEffect(() => {
    if (chainContainerRef.current) {
      chainContainerRef.current.scrollLeft = chainContainerRef.current.scrollWidth;
    }
  }, [chain]);

  const reject = useCallback((msg) => {
    setShake(true);
    setRejectMsg(msg);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setRejectMsg(""), 2000);
  }, []);

  const pushHistory = useCallback(() => {
    setHistory(h => [...h, { step, currentTarget, chain: [...chain], usedTeams: new Set(usedTeams), usedColleges: new Set(usedColleges), usedPlayers: new Set(usedPlayers) }]);
  }, [step, currentTarget, chain, usedTeams, usedColleges, usedPlayers]);

  const handleGoBack = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const snap = h[h.length - 1];
      setStep(snap.step);
      seTCUrrentTarget(snap.currentTarget);
      setChain(snap.chain);
      setUsedTeams(snap.usedTeams);
      setUsedColleges(snap.usedColleges);
      setUsedPlayers(snap.usedPlayers);
      setInput("");
      setRejectMsg("");
      setTimeout(() => inputRef.current?.focus(), 50);
      return h.slice(0, -1);
    });
  }, []);

  const acceptSuggestion = useCallback((canonical) => {
    setSuggestion(null);
    setInput(canonical);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    // If there's a pending suggestion, Enter confirms it
    if (suggestion) {
      const canonical = suggestion;
      setSuggestion(null);
      setInput("");
      // Re-run submit logic with the canonical name
      const candidates = resolvePlayer(canonical, PLAYERS);
      if (candidates) {
        if (step === STEP.TEAM) {
          const player = candidates.find(p => playerOnTeam(p, currentTarget) && !usedPlayers.has(p.name));
          if (player) {
            pushHistory();
            const newUsed = new Set(usedPlayers); newUsed.add(player.name);
            setUsedPlayers(newUsed);
            setChain(c => [...c, { item: player.name, type: "player" }]);
            seTCUrrentTarget(player.name);
            setStep(STEP.PLAYER_TO_COLLEGE);
          } else { reject("That doesn't work here"); }
        } else if (step === STEP.COLLEGE) {
          const player = candidates.find(p => playerAtCollege(p, currentTarget) && !usedPlayers.has(p.name));
          if (player) {
            pushHistory();
            const newUsed = new Set(usedPlayers); newUsed.add(player.name);
            setUsedPlayers(newUsed);
            setChain(c => [...c, { item: player.name, type: "player" }]);
            seTCUrrentTarget(player.name);
            setStep(STEP.PLAYER_TO_TEAM);
          } else { reject("That doesn't work here"); }
        } else {
          reject("That doesn't work here");
        }
      }
      return;
    }

    const val = input.trim();
    if (!val) return;

    if (step === STEP.TEAM) {
      // Need a player who played for currentTarget team
      const candidates = resolvePlayer(val, PLAYERS);
      if (!candidates) {
        const fuzzy = findPlayerSuggestion(val);
        if (fuzzy) {
          justSetSuggestion.current = true;
          setTimeout(() => { justSetSuggestion.current = false; }, 50);
          setSuggestion(fuzzy);
          setRejectMsg("");
          setInput("");
        } else {
          reject("Player not found in our database");
        }
        return;
      }
      const player = candidates.find(p => playerOnTeam(p, currentTarget) && !usedPlayers.has(p.name));
      if (!player) {
        const anyOnTeam = candidates.find(p => playerOnTeam(p, currentTarget));
        if (anyOnTeam) return reject(`${anyOnTeam.name} already used`);
        return reject(`${candidates[0].name} didn't play for the ${currentTarget}`);
      }

      pushHistory();
      const newUsed = new Set(usedPlayers); newUsed.add(player.name);
      setUsedPlayers(newUsed);
      setChain(c => [...c, { item: player.name, type: "player" }]);
      seTCUrrentTarget(player.name);
      setStep(STEP.PLAYER_TO_COLLEGE);
      setInput("");

    } else if (step === STEP.PLAYER_TO_COLLEGE) {
      // Need college for currentTarget player
      const college = resolveCollege(val, PLAYERS);
      if (!college) return reject("College not found — try the full name");
      const player = PLAYERS.find(p => p.name === currentTarget);
      if (!playerAtCollege(player, college)) return reject(`${player.name} didn't attend ${college}`);
      if (usedColleges.has(college)) return reject(`${college} already used`);

      pushHistory();
      const newUsed = new Set(usedColleges); newUsed.add(college);
      setUsedColleges(newUsed);
      setChain(c => [...c, { item: college, type: "college" }]);
      seTCUrrentTarget(college);
      setStep(STEP.COLLEGE);
      setInput("");

    } else if (step === STEP.COLLEGE) {
      // Need a player who went to currentTarget college
      const candidates = resolvePlayer(val, PLAYERS);
      if (!candidates) {
        const fuzzy = findPlayerSuggestion(val);
        if (fuzzy) {
          justSetSuggestion.current = true;
          setTimeout(() => { justSetSuggestion.current = false; }, 50);
          setSuggestion(fuzzy);
          setRejectMsg("");
          setInput("");
        } else {
          reject("Player not found in our database");
        }
        return;
      }
      const player = candidates.find(p => playerAtCollege(p, currentTarget) && !usedPlayers.has(p.name));
      if (!player) {
        const anyAtCollege = candidates.find(p => playerAtCollege(p, currentTarget));
        if (anyAtCollege) return reject(`${anyAtCollege.name} already used`);
        return reject(`${candidates[0].name} didn't go to ${currentTarget}`);
      }
      if (usedPlayers.has(player.name)) return reject(`${player.name} already used`);

      pushHistory();
      const newUsed = new Set(usedPlayers); newUsed.add(player.name);
      setUsedPlayers(newUsed);
      setChain(c => [...c, { item: player.name, type: "player" }]);
      seTCUrrentTarget(player.name);
      setStep(STEP.PLAYER_TO_TEAM);
      setInput("");

    } else if (step === STEP.PLAYER_TO_TEAM) {
      // Need a team that currentTarget player played for
      const team = resolveTeam(val);
      if (!team) return reject("NFL team not recognized");
      const player = PLAYERS.find(p => p.name === currentTarget);
      if (!playerOnTeam(player, team)) return reject(`${player.name} didn't play for the ${team}`);
      if (usedTeams.has(team)) return reject(`${team} already used`);

      pushHistory();
      const newUsedTeams = new Set(usedTeams); newUsedTeams.add(team);
      setUsedTeams(newUsedTeams);
      setChain(c => [...c, { item: team, type: "team" }]);
      seTCUrrentTarget(team);
      setInput("");

      if (newUsedTeams.size === 32) {
        setWon(true);
      } else {
        setStep(STEP.TEAM);
      }
    }
  }, [step, currentTarget, input, usedTeams, usedColleges, usedPlayers, reject, pushHistory]);

  const handleKeyDown = (e) => {
    trackPlay();
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape" && suggestion) { setSuggestion(null); setRejectMsg(""); }
  };

  const handleReset = () => {
    const team = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    seTCUrrentTarget(team);
    setUsedTeams(new Set([team]));
    setUsedColleges(new Set());
    setUsedPlayers(new Set());
    setChain([{ item: team, type: "team" }]);
    setStep(STEP.TEAM);
    setInput("");
    setWon(false);
    setRejectMsg("");
    setHistory([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const prompt = currentTarget ? STEP_LABELS[step]({ currentTarget }) : "";
  const hint = STEP_HINT[step];
  const teamsLeft = 32 - usedTeams.size;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 30% 10%, #0a0f1a 0%, #07070f 55%), radial-gradient(ellipse at 70% 90%, #0a1205 0%, transparent 50%)",
      color: "#f0f0f0",
      fontFamily: "'Oswald', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "84px 16px 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff18", textTransform: "uppercase", marginBottom: 6 }}>NFL</div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: 0, lineHeight: 1,
          background: "linear-gradient(135deg,#1a6b9e,#5bb8f5,#e8c060,#5fd88a)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1,
        }}>Complete The Chain</h1>
        <p style={{
          fontSize: 12, margin: "8px 0 0", letterSpacing: 1, textTransform: "uppercase",
          background: "linear-gradient(135deg,#5fd88a,#e8c060,#5bb8f5,#4a9fd4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          by linking all 32 NFL teams without repeating
        </p>
        <p style={{ color: "#e8c060", fontSize: 13, margin: "8px 0 0", letterSpacing: 0.5 }}>
          NFL Team 🔗 NFL Player 🔗 College 🔗 NFL Player 🔗 NFL Team
        </p>
      </div>

      {/* Progress */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 24,
        background: "#0b0b1e", border: "1px solid #161632",
        borderRadius: 12, padding: "12px 28px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#5bb8f5", lineHeight: 1 }}>{usedTeams.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Teams</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#e8c060", lineHeight: 1 }}>{usedColleges.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Colleges</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#5fd88a", lineHeight: 1 }}>{usedPlayers.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Players</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: teamsLeft <= 5 ? "#e74c3c" : "#c8a050", lineHeight: 1 }}>{teamsLeft}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Left</div>
        </div>
      </div>

      {/* Team tracker */}
      <div style={{ marginBottom: 12, width: "100%", maxWidth: 760 }}>
        <TeamTracker usedTeams={usedTeams} total={32} />
      </div>

      {/* College tracker */}
      {usedColleges.size > 0 && (
        <div style={{ marginBottom: 24, width: "100%", maxWidth: 760 }}>
          <div style={{ fontSize: 8, color: "#ffffff15", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>
            Colleges Used
          </div>
          <CollegeTracker usedColleges={usedColleges} />
        </div>
      )}

   {/* Win state */}
      {won && (
        <div style={{
          width: "100%", maxWidth: 520, marginBottom: 24,
          background: "linear-gradient(135deg,#0d2b14,#0f3318)",
          border: "1px solid #22c55e44", borderRadius: 16,
          padding: "28px 32px", textAlign: "center",
          animation: "fadeUp .4s ease",
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>YOU DID IT!</div>
          <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 8 }}>
            All 32 NFL teams chained in {chain.length} links
          </div>

          {/* Share section */}
          <div style={{ marginTop: 24, borderTop: "1px solid #22c55e22", paddingTop: 20 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff30", marginBottom: 12, fontFamily: "'Oswald', sans-serif" }}>
              Share your result
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>

              {/* Copy to clipboard */}
              <button onClick={() => {
                const text = `💪 I completed the NFL Chain on TrivialSports!\n⛓️ Linked all 32 NFL teams using players and colleges\n🏈 Can you do it? trivialsports.com/games/nfl-chain`;
                navigator.clipboard.writeText(text).then(() => {
                  const btn = document.getElementById('copy-btn');
                  btn.innerText = '✓ Copied!';
                  setTimeout(() => btn.innerText = 'Copy', 2000);
                });
              }} id="copy-btn" style={{
                background: "#ffffff12", color: "#ffffff88",
                border: "1px solid #ffffff22", borderRadius: 8,
                padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif", transition: "all .2s",
              }}>Copy</button>

              {/* Twitter/X */}
              <button onClick={() => {
                const text = encodeURIComponent(`💪 I completed the NFL Chain on TrivialSports!\n⛓️ Linked all 32 NFL teams using players and colleges\n🏈 Can you do it? trivialsports.com/games/nfl-chain`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
              }} style={{
                background: "#000000", color: "#ffffff",
                border: "1px solid #333333", borderRadius: 8,
                padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif", transition: "all .2s",
              }}>𝕏 Post</button>

              {/* Bluesky */}
              <button onClick={() => {
                const text = encodeURIComponent(`💪 I completed the NFL Chain on TrivialSports!\n⛓️ Linked all 32 NFL teams using players and colleges\n🏈 Can you do it? trivialsports.com/games/nfl-chain`);
                window.open(`https://bsky.app/intent/compose?text=${text}`, '_blank');
              }} style={{
                background: "#0085ff", color: "#ffffff",
                border: "none", borderRadius: 8,
                padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif", transition: "all .2s",
              }}>Bluesky</button>

              {/* Instagram */}
              <button onClick={() => {
                const text = `💪 I completed the NFL Chain on TrivialSports!\n⛓️ Linked all 32 NFL teams using players and colleges\n🏈 Can you do it? trivialsports.com/games/nfl-chain`;
                navigator.clipboard.writeText(text).then(() => {
                  const btn = document.getElementById('ig-btn');
                  btn.innerText = '✓ Copied — paste in story!';
                  setTimeout(() => btn.innerText = '📸 Instagram', 3000);
                });
              }} id="ig-btn" style={{
                background: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
                color: "#ffffff", border: "none", borderRadius: 8,
                padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif", transition: "all .2s",
              }}>📸 Instagram</button>

            </div>
          </div>

          <button onClick={handleReset} style={{
            marginTop: 20, background: "#22c55e", color: "#07070f",
            border: "none", borderRadius: 10, padding: "11px 32px",
            fontSize: 13, fontWeight: 900, cursor: "pointer",
            letterSpacing: 1.5, textTransform: "uppercase",
          }}>Play Again</button>
        </div>
      )}

      {/* Active prompt + input */}
      {!won && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          {/* Current prompt */}
          <div style={{
            background: "#0b0b1e", border: "1px solid #161640",
            borderRadius: 14, padding: "18px 20px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 9, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              Step {chain.length} of {chain.length + (32 - usedTeams.size) * 4 - 2}+
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {prompt}
            </div>
            <div style={{ fontSize: 10, color: "#ffffff28", letterSpacing: 1 }}>{hint}</div>
          </div>

          {/* Input */}
          <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setRejectMsg(""); setSuggestion(null); }}
              onKeyDown={handleKeyDown}
              placeholder={
                step === STEP.TEAM || step === STEP.COLLEGE ? "Player name..." :
                step === STEP.PLAYER_TO_COLLEGE ? "College name..." :
                "Team name..."
              }
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
              onFocus={e => e.target.style.borderColor = "#5bb8f555"}
              onBlur={e => e.target.style.borderColor = "#141432"}
            />
          </div>

          {/* Reject message */}
          {suggestion && (
            <div style={{ marginTop: 8, fontFamily: "Georgia, serif" }}>
              <div style={{ fontSize: 13, color: "#c8a050cc", marginBottom: 6, textAlign: "center" }}>
                Did you mean <strong style={{ color: "#c8a050", fontStyle: "italic" }}>{suggestion}</strong>?
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  onClick={() => { acceptSuggestion(suggestion); }}
                  style={{
                    background: "#c8a05022", border: "1px solid #c8a05055",
                    color: "#c8a050", borderRadius: 6, padding: "4px 14px",
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    textTransform: "uppercase", cursor: "pointer",
                    fontFamily: "'Oswald', sans-serif",
                  }}>
                  Yes — Enter
                </button>
                <button
                  onClick={() => { setSuggestion(null); setRejectMsg(""); inputRef.current?.focus(); }}
                  style={{
                    background: "transparent", border: "1px solid #ffffff15",
                    color: "#ffffff30", borderRadius: 6, padding: "4px 14px",
                    fontSize: 11, fontWeight: 700, letterSpacing: 1,
                    textTransform: "uppercase", cursor: "pointer",
                    fontFamily: "'Oswald', sans-serif",
                  }}>
                  No — Esc
                </button>
              </div>
            </div>
          )}
          {!suggestion && rejectMsg && (
            <div style={{
              marginTop: 8, fontSize: 11, color: "#e74c3c99",
              fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textAlign: "center",
              animation: "fadeUp .2s ease",
            }}>
              {rejectMsg}
            </div>
          )}

          <button onClick={handleSubmit} style={{
            marginTop: 10, width: "100%",
            background: "linear-gradient(135deg,#1a4a6e,#1e5580)",
            border: "1px solid #2a6a9e44",
            borderRadius: 10, padding: "12px 0",
            fontSize: 12, fontWeight: 900, color: "#5bb8f5",
            cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            transition: "all .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#1e5580,#225f90)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,#1a4a6e,#1e5580)"}
          >
            Confirm →
          </button>

          {history.length > 0 && (
            <button onClick={handleGoBack} style={{
              marginTop: 8, width: "100%",
              background: "transparent",
              border: "1px solid #ffffff18",
              borderRadius: 10, padding: "10px 0",
              fontSize: 11, fontWeight: 700, color: "#ffffff55",
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
              transition: "all .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#ffffff35"; e.currentTarget.style.color = "#ffffff99"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff18"; e.currentTarget.style.color = "#ffffff55"; }}
            >
              ← Go Back
            </button>
          )}
        </div>
      )}

      {/* Chain visualization */}
      <div style={{
        width: "100%", maxWidth: 780,
        background: "#08081a", border: "1px solid #111128",
        borderRadius: 16, padding: "16px 20px", marginBottom: 24,
        overflowX: "auto",
      }} ref={chainContainerRef}>
        <div style={{ fontSize: 8, color: "#ffffff15", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
          Chain — {chain.length} links
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 0, flexWrap: "wrap", rowGap: 10,
        }}>
          {chain.map((node, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <ChainNode item={node.item} type={node.type} isLatest={i === chain.length - 1} />
              {i < chain.length - 1 && <ChainConnector />}
            </div>
          ))}

        </div>
      </div>

      {/* Reset */}
      <button onClick={handleReset} style={{
        background: "transparent", color: "#ffffff22",
        border: "1px solid #ffffff0a", borderRadius: 10,
        padding: "8px 24px", fontSize: 11, fontWeight: 700,
        cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
        transition: "color .2s, border-color .2s",
        fontFamily: "'Oswald', sans-serif",
      }}
        onMouseEnter={e => { e.target.style.color = "#e74c3c99"; e.target.style.borderColor = "#e74c3c33"; }}
        onMouseLeave={e => { e.target.style.color = "#ffffff22"; e.target.style.borderColor = "#ffffff0a"; }}
      >
        New Game
      </button>
    </div>
  );
}
