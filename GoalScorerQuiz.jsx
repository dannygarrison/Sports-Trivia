import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";

/* ───────────────────── DATA ───────────────────── */
const ENTRIES = [
  { player: "Lionel Messi", goals: 50, season: "2011-2012", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 48, season: "2014-2015", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Lionel Messi", goals: 46, season: "2012-2013", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 46, season: "2011-2012", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Aleksandar Mitrović", goals: 43, season: "2021-2022", nation: "SRB", team: "Fulham", comp: "Championship" },
  { player: "Lionel Messi", goals: 43, season: "2014-2015", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Robert Lewandowski", goals: 41, season: "2020-2021", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Luis Suárez", goals: 40, season: "2015-2016", nation: "URU", team: "Barcelona", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 40, season: "2010-2011", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Viktor Gyökeres", goals: 39, season: "2024-2025", nation: "SWE", team: "Sporting CP", comp: "Primeira Liga" },
  { player: "Zlatan Ibrahimović", goals: 38, season: "2015-2016", nation: "SWE", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Lionel Messi", goals: 37, season: "2016-2017", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Erling Haaland", goals: 36, season: "2022-2023", nation: "NOR", team: "Manchester City", comp: "Premier League" },
  { player: "Harry Kane", goals: 36, season: "2023-2024", nation: "ENG", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Ciro Immobile", goals: 36, season: "2019-2020", nation: "ITA", team: "Lazio", comp: "Serie A" },
  { player: "Gonzalo Higuaín", goals: 36, season: "2015-2016", nation: "ARG", team: "Napoli", comp: "Serie A" },
  { player: "Lionel Messi", goals: 36, season: "2018-2019", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Edinson Cavani", goals: 35, season: "2016-2017", nation: "URU", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Robert Lewandowski", goals: 35, season: "2021-2022", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Luis Suárez", goals: 35, season: "2009-2010", nation: "URU", team: "Ajax", comp: "Eredivisie" },
  { player: "Cristiano Ronaldo", goals: 35, season: "2015-2016", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 35, season: "2023-2024", nation: "POR", team: "Al-Nassr", comp: "Saudi Pro League" },
  { player: "Klaas-Jan Huntelaar", goals: 34, season: "2007-2008", nation: "NED", team: "Ajax", comp: "Eredivisie" },
  { player: "Robert Lewandowski", goals: 34, season: "2019-2020", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Lionel Messi", goals: 34, season: "2009-2010", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Lionel Messi", goals: 34, season: "2017-2018", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 34, season: "2012-2013", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Carlos Vela", goals: 34, season: "2019", nation: "MEX", team: "LAFC", comp: "Major League Soccer" },
  { player: "Kylian Mbappé", goals: 33, season: "2018-2019", nation: "FRA", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Diego Forlán", goals: 32, season: "2008-2009", nation: "URU", team: "Atlético Madrid", comp: "La Liga" },
  { player: "Mohamed Salah", goals: 32, season: "2017-2018", nation: "EGY", team: "Liverpool", comp: "Premier League" },
  { player: "Kylian Mbappé", goals: 31, season: "2024-2025", nation: "FRA", team: "Real Madrid", comp: "La Liga" },
  { player: "Luis Suárez", goals: 31, season: "2013-2014", nation: "URU", team: "Liverpool", comp: "Premier League" },
  { player: "Pierre-Emerick Aubameyang", goals: 31, season: "2016-2017", nation: "GAB", team: "Dortmund", comp: "Bundesliga" },
  { player: "Lionel Messi", goals: 31, season: "2010-2011", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Luca Toni", goals: 31, season: "2005-2006", nation: "ITA", team: "Fiorentina", comp: "Serie A" },
  { player: "Luca Toni", goals: 31, season: "2003-2004", nation: "ITA", team: "Palermo", comp: "Serie B" },
  { player: "Cristiano Ronaldo", goals: 31, season: "2007-2008", nation: "POR", team: "Manchester Utd", comp: "Premier League" },
  { player: "Cristiano Ronaldo", goals: 31, season: "2013-2014", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 31, season: "2019-2020", nation: "POR", team: "Juventus", comp: "Serie A" },
  { player: "Ivan Toney", goals: 31, season: "2020-2021", nation: "ENG", team: "Brentford", comp: "Championship" },
  { player: "Josef Martínez", goals: 31, season: "2018", nation: "VEN", team: "Atlanta Utd", comp: "Major League Soccer" },
  { player: "Henrik Larsson", goals: 30, season: "2003-2004", nation: "SWE", team: "Celtic", comp: "Scottish Premiership" },
  { player: "Samuel Eto'o", goals: 30, season: "2008-2009", nation: "CMR", team: "Barcelona", comp: "La Liga" },
  { player: "Harry Kane", goals: 30, season: "2022-2023", nation: "ENG", team: "Tottenham Hotspur", comp: "Premier League" },
  { player: "Harry Kane", goals: 30, season: "2017-2018", nation: "ENG", team: "Tottenham Hotspur", comp: "Premier League" },
  { player: "Robin van Persie", goals: 30, season: "2011-2012", nation: "NED", team: "Arsenal", comp: "Premier League" },
  { player: "Zlatan Ibrahimović", goals: 30, season: "2012-2013", nation: "SWE", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Zlatan Ibrahimović", goals: 30, season: "2019", nation: "SWE", team: "LA Galaxy", comp: "Major League Soccer" },
  { player: "Robert Lewandowski", goals: 30, season: "2016-2017", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Robert Lewandowski", goals: 30, season: "2015-2016", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Thierry Henry", goals: 30, season: "2003-2004", nation: "FRA", team: "Arsenal", comp: "Premier League" },
  { player: "Lionel Messi", goals: 30, season: "2020-2021", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Billy Sharp", goals: 30, season: "2016-2017", nation: "ENG", team: "Sheffield United", comp: "League One" },
  { player: "Glenn Murray", goals: 30, season: "2012-2013", nation: "ENG", team: "Crystal Palace", comp: "Championship" },
  { player: "Henrik Larsson", goals: 29, season: "2001-2002", nation: "SWE", team: "Celtic", comp: "Scottish Premiership" },
  { player: "Teemu Pukki", goals: 29, season: "2018-2019", nation: "FIN", team: "Norwich City", comp: "Championship" },
  { player: "Harry Kane", goals: 29, season: "2016-2017", nation: "ENG", team: "Tottenham Hotspur", comp: "Premier League" },
  { player: "Edin Džeko", goals: 29, season: "2016-2017", nation: "BIH", team: "Roma", comp: "Serie A" },
  { player: "Kylian Mbappé", goals: 29, season: "2022-2023", nation: "FRA", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Mauro Icardi", goals: 29, season: "2017-2018", nation: "ARG", team: "Inter", comp: "Serie A" },
  { player: "Ciro Immobile", goals: 29, season: "2017-2018", nation: "ITA", team: "Lazio", comp: "Serie A" },
  { player: "Viktor Gyökeres", goals: 29, season: "2023-2024", nation: "SWE", team: "Sporting CP", comp: "Primeira Liga" },
  { player: "Klaas-Jan Huntelaar", goals: 29, season: "2011-2012", nation: "NED", team: "Schalke 04", comp: "Bundesliga" },
  { player: "Edinson Cavani", goals: 29, season: "2012-2013", nation: "URU", team: "Napoli", comp: "Serie A" },
  { player: "Robert Lewandowski", goals: 29, season: "2017-2018", nation: "POL", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Didier Drogba", goals: 29, season: "2009-2010", nation: "CIV", team: "Chelsea", comp: "Premier League" },
  { player: "Luuk de Jong", goals: 29, season: "2023-2024", nation: "NED", team: "PSV", comp: "Eredivisie" },
  { player: "Lionel Messi", goals: 29, season: "2025", nation: "ARG", team: "Inter Miami", comp: "Major League Soccer" },
  { player: "Cristiano Ronaldo", goals: 29, season: "2020-2021", nation: "POR", team: "Juventus", comp: "Serie A" },
  { player: "Mohamed Salah", goals: 29, season: "2024-2025", nation: "EGY", team: "Liverpool", comp: "Premier League" },
  { player: "Dominic Solanke", goals: 29, season: "2021-2022", nation: "ENG", team: "Bournemouth", comp: "Championship" },
  { player: "Henrik Larsson", goals: 28, season: "2002-2003", nation: "SWE", team: "Celtic", comp: "Scottish Premiership" },
  { player: "Dušan Tadić", goals: 28, season: "2018-2019", nation: "SRB", team: "Ajax", comp: "Eredivisie" },
  { player: "André Silva", goals: 28, season: "2020-2021", nation: "POR", team: "Eintracht Frankfurt", comp: "Bundesliga" },
  { player: "Kylian Mbappé", goals: 28, season: "2021-2022", nation: "FRA", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Timo Werner", goals: 28, season: "2019-2020", nation: "GER", team: "RB Leipzig", comp: "Bundesliga" },
  { player: "Zlatan Ibrahimović", goals: 28, season: "2011-2012", nation: "SWE", team: "Milan", comp: "Serie A" },
  { player: "Edinson Cavani", goals: 28, season: "2017-2018", nation: "URU", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Radamel Falcao", goals: 28, season: "2012-2013", nation: "COL", team: "Atlético Madrid", comp: "La Liga" },
  { player: "Mario Gómez", goals: 28, season: "2010-2011", nation: "GER", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Dries Mertens", goals: 28, season: "2016-2017", nation: "BEL", team: "Napoli", comp: "Serie A" },
  { player: "Alexandre Lacazette", goals: 28, season: "2016-2017", nation: "FRA", team: "Lyon", comp: "Ligue 1" },
  { player: "Luis Suárez", goals: 28, season: "2016-2017", nation: "URU", team: "Barcelona", comp: "La Liga" },
  { player: "David Villa", goals: 28, season: "2008-2009", nation: "ESP", team: "Valencia", comp: "La Liga" },
  { player: "Lionel Messi", goals: 28, season: "2013-2014", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Erling Haaland", goals: 27, season: "2020-2021", nation: "NOR", team: "Dortmund", comp: "Bundesliga" },
  { player: "Erling Haaland", goals: 27, season: "2023-2024", nation: "NOR", team: "Manchester City", comp: "Premier League" },
  { player: "Kylian Mbappé", goals: 27, season: "2023-2024", nation: "FRA", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Kylian Mbappé", goals: 27, season: "2020-2021", nation: "FRA", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Ciro Immobile", goals: 27, season: "2021-2022", nation: "ITA", team: "Lazio", comp: "Serie A" },
  { player: "Karim Benzema", goals: 27, season: "2021-2022", nation: "FRA", team: "Real Madrid", comp: "La Liga" },
  { player: "Gonzalo Higuaín", goals: 27, season: "2009-2010", nation: "ARG", team: "Real Madrid", comp: "La Liga" },
  { player: "Robert Lewandowski", goals: 27, season: "2024-2025", nation: "POL", team: "Barcelona", comp: "La Liga" },
  { player: "Bradley Wright-Phillips", goals: 27, season: "2014", nation: "ENG", team: "NY Red Bulls", comp: "Major League Soccer" },
  { player: "Alexandre Lacazette", goals: 27, season: "2014-2015", nation: "FRA", team: "Lyon", comp: "Ligue 1" },
  { player: "Alexandre Lacazette", goals: 27, season: "2022-2023", nation: "FRA", team: "Lyon", comp: "Ligue 1" },
  { player: "Diego Costa", goals: 27, season: "2013-2014", nation: "ESP", team: "Atlético Madrid", comp: "La Liga" },
  { player: "Luuk de Jong", goals: 27, season: "2018-2019", nation: "NED", team: "PSV", comp: "Eredivisie" },
  { player: "Thierry Henry", goals: 27, season: "2005-2006", nation: "FRA", team: "Arsenal", comp: "Premier League" },
  { player: "Josef Martínez", goals: 27, season: "2019", nation: "VEN", team: "Atlanta Utd", comp: "Major League Soccer" },
  { player: "Wayne Rooney", goals: 27, season: "2011-2012", nation: "ENG", team: "Manchester Utd", comp: "Premier League" },
  { player: "Samuel Eto'o", goals: 26, season: "2005-2006", nation: "CMR", team: "Barcelona", comp: "La Liga" },
  { player: "Teemu Pukki", goals: 26, season: "2020-2021", nation: "FIN", team: "Norwich City", comp: "Championship" },
  { player: "Hernán Crespo", goals: 26, season: "2000-2001", nation: "ARG", team: "Lazio", comp: "Serie A" },
  { player: "Harry Kane", goals: 26, season: "2024-2025", nation: "ENG", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Aleksandar Mitrović", goals: 26, season: "2019-2020", nation: "SRB", team: "Fulham", comp: "Championship" },
  { player: "Edin Džeko", goals: 26, season: "2008-2009", nation: "BIH", team: "Wolfsburg", comp: "Bundesliga" },
  { player: "Robin van Persie", goals: 26, season: "2012-2013", nation: "NED", team: "Manchester Utd", comp: "Premier League" },
  { player: "Zlatan Ibrahimović", goals: 26, season: "2013-2014", nation: "SWE", team: "Paris Saint-Germain", comp: "Ligue 1" },
  { player: "Sergio Agüero", goals: 26, season: "2014-2015", nation: "ARG", team: "Manchester City", comp: "Premier League" },
  { player: "Darwin Núñez", goals: 26, season: "2021-2022", nation: "URU", team: "Benfica", comp: "Primeira Liga" },
  { player: "Edinson Cavani", goals: 26, season: "2010-2011", nation: "URU", team: "Napoli", comp: "Serie A" },
  { player: "Mario Gómez", goals: 26, season: "2011-2012", nation: "GER", team: "Bayern Munich", comp: "Bundesliga" },
  { player: "Victor Osimhen", goals: 26, season: "2022-2023", nation: "NGA", team: "Napoli", comp: "Serie A" },
  { player: "Victor Osimhen", goals: 26, season: "2024-2025", nation: "NGA", team: "Galatasaray", comp: "Süper Lig" },
  { player: "Luuk de Jong", goals: 26, season: "2015-2016", nation: "NED", team: "PSV", comp: "Eredivisie" },
  { player: "Lionel Messi", goals: 26, season: "2015-2016", nation: "ARG", team: "Barcelona", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 26, season: "2009-2010", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Cristiano Ronaldo", goals: 26, season: "2017-2018", nation: "POR", team: "Real Madrid", comp: "La Liga" },
  { player: "Paul Mullin", goals: 26, season: "2021-2022", nation: "ENG", team: "Wrexham", comp: "National League" },
  { player: "Fabio Quagliarella", goals: 26, season: "2018-2019", nation: "ITA", team: "Sampdoria", comp: "Serie A" },
  { player: "Wayne Rooney", goals: 26, season: "2009-2010", nation: "ENG", team: "Manchester Utd", comp: "Premier League" },
  { player: "Harry Kane", goals: 25, season: "2015-2016", nation: "ENG", team: "Tottenham Hotspur", comp: "Premier League" },
  { player: "Zlatan Ibrahimović", goals: 25, season: "2008-2009", nation: "SWE", team: "Inter", comp: "Serie A" },
];

/* ──── clue order: season → goals → nationality → team ──── */
const CLUE_KEYS = ["season", "goals", "nation", "team"];
const CLUE_LABELS = ["Season", "Goals", "Nationality", "Team"];
const MAX_CLUES = CLUE_KEYS.length;

/* ──── helpers ──── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* Levenshtein distance */
function lev(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/* Surname particles — when someone types "de jong" we want to match "Luuk de Jong" */
const PARTICLES = new Set(["de", "van", "von", "di", "el", "al", "dos", "da", "du", "le", "la", "del", "bin"]);

function getSurname(parts) {
  // Find where the surname starts (first particle or last word)
  for (let i = 1; i < parts.length; i++) {
    if (PARTICLES.has(parts[i])) return parts.slice(i).join(" ");
  }
  return parts[parts.length - 1];
}

function checkGuess(guess, answer) {
  const g = normalize(guess);
  const a = normalize(answer);
  if (!g) return false;

  // 1. Exact match
  if (g === a) return true;

  const aParts = a.split(" ");
  const gParts = g.split(" ");

  // 2. Surname match (handles "de jong", "van persie", "wright phillips")
  const surname = getSurname(aParts);
  if (g === surname) return true;
  // Also accept just the very last word ("jong", "persie", "aubameyang")
  if (gParts.length === 1 && g === aParts[aParts.length - 1]) return true;

  // 3. Tail match — guess matches the last N words of the answer
  //    e.g. "emerick aubameyang" matches "pierre emerick aubameyang"
  if (gParts.length >= 2 && gParts.length < aParts.length) {
    const tail = aParts.slice(aParts.length - gParts.length).join(" ");
    if (g === tail) return true;
  }

  // 4. First + last (skip middle names / particles)
  if (aParts.length > 2) {
    const firstLast = aParts[0] + " " + aParts[aParts.length - 1];
    if (g === firstLast) return true;
  }

  // 5. Fuzzy matching — allow small typos
  const threshold = a.length <= 6 ? 1 : 2;
  if (lev(g, a) <= threshold) return true;
  // Fuzzy on surname
  if (gParts.length <= 2 && lev(g, surname) <= threshold) return true;
  // Fuzzy on last word
  if (gParts.length === 1 && aParts[aParts.length - 1].length > 4 && lev(g, aParts[aParts.length - 1]) <= threshold) return true;

  return false;
}

/* ──── flag emoji from nation code ──── */
const FLAG_MAP = {
  ARG: "🇦🇷", POR: "🇵🇹", SRB: "🇷🇸", POL: "🇵🇱", URU: "🇺🇾", SWE: "🇸🇪",
  NOR: "🇳🇴", ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", ITA: "🇮🇹", FRA: "🇫🇷", EGY: "🇪🇬", GAB: "🇬🇦",
  VEN: "🇻🇪", CMR: "🇨🇲", NED: "🇳🇱", FIN: "🇫🇮", BIH: "🇧🇦", CIV: "🇨🇮",
  GER: "🇩🇪", COL: "🇨🇴", BEL: "🇧🇪", ESP: "🇪🇸", MEX: "🇲🇽", NGA: "🇳🇬",
};

/* ──── comp → short display ──── */
const COMP_SHORT = {
  "La Liga": "La Liga", "Premier League": "Prem", "Bundesliga": "Bundes.",
  "Serie A": "Serie A", "Serie B": "Serie B", "Ligue 1": "Ligue 1",
  "Eredivisie": "Erediv.", "Championship": "Champ.", "League One": "L1",
  "Scottish Premiership": "SPL", "Primeira Liga": "Liga Pt.",
  "Major League Soccer": "MLS", "Saudi Pro League": "SPL 🇸🇦",
  "Süper Lig": "Süper Lig", "National League": "Nat. Lg.",
};

/* ───────────────────── COMPONENT ───────────────────── */
export default function GoalScorerQuiz() {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const [cluesRevealed, setCluesRevealed] = useState(0);
  const [guess, setGuess] = useState("");
  const [phase, setPhase] = useState("idle"); // idle | playing | correct | wrong | skip
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [maxPossible, setMaxPossible] = useState(0);
  const [history, setHistory] = useState([]);
  const [shake, setShake] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const inputRef = useRef(null);

  const startGame = useCallback(() => {
    const shuffled = shuffle(ENTRIES);
    setQueue(shuffled.slice(1));
    setCurrent(shuffled[0]);
    setCluesRevealed(1);
    setGuess("");
    setPhase("playing");
    setScore(0);
    setTotal(0);
    setMaxPossible(0);
    setHistory([]);
    setWrongGuesses([]);
  }, []);

  const nextEntry = useCallback(() => {
    setWrongGuesses([]);
    if (queue.length === 0) {
      setPhase("idle");
      return;
    }
    const next = queue[0];
    setQueue((q) => q.slice(1));
    setCurrent(next);
    setCluesRevealed(1);
    setGuess("");
    setPhase("playing");
  }, [queue]);

  const handleGuess = useCallback(() => {
    if (!guess.trim() || phase !== "playing") return;
    if (checkGuess(guess, current.player)) {
      const pts = MAX_CLUES - cluesRevealed + 1;
      setScore((s) => s + pts);
      setTotal((t) => t + 1);
      setMaxPossible((m) => m + MAX_CLUES);
      setHistory((h) => [
        { ...current, pts, cluesUsed: cluesRevealed, got: true },
        ...h,
      ]);
      setPhase("correct");
      setGuess("");
    } else {
      setWrongGuesses((w) => [...w, guess.trim()]);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setGuess("");
      if (cluesRevealed < MAX_CLUES) {
        setCluesRevealed((c) => c + 1);
      } else {
        setTotal((t) => t + 1);
        setMaxPossible((m) => m + MAX_CLUES);
        setHistory((h) => [
          { ...current, pts: 0, cluesUsed: MAX_CLUES, got: false },
          ...h,
        ]);
        setPhase("wrong");
      }
    }
  }, [guess, phase, current, cluesRevealed]);

  const handleSkip = useCallback(() => {
    setTotal((t) => t + 1);
    setMaxPossible((m) => m + MAX_CLUES);
    setHistory((h) => [
      { ...current, pts: 0, cluesUsed: cluesRevealed, got: false },
      ...h,
    ]);
    setPhase("skip");
  }, [current, cluesRevealed]);

  useEffect(() => {
    if (phase === "playing" && inputRef.current) inputRef.current.focus();
  }, [phase, cluesRevealed]);

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleGuess();
  };

  /* ──── clue value formatting ──── */
  const formatClue = (key, val) => {
    if (key === "goals") return `${val} goals`;
    if (key === "nation") return `${FLAG_MAP[val] || ""} ${val}`;
    return val;
  };

  /* ──── render ──── */
  const remaining = queue.length + (phase === "playing" ? 1 : 0);
  const ptsAvailable = phase === "playing" ? MAX_CLUES - cluesRevealed + 1 : 0;

  return (
    <>
      <Helmet>
        <title>Goal Scorer Quiz – TrivialSports</title>
        <meta
          name="description"
          content="Guess the top goal scorer from progressive clues. Season, goals, nationality, team — how few clues do you need?"
        />
        <link rel="canonical" href="https://trivialsports.com/goal-scorer-quiz" />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap');
        .gsq-root { font-family: 'Oswald', sans-serif; min-height: 100vh; background: #0a0a12; color: #e8e8f0; display: flex; flex-direction: column; align-items: center; padding: 30px 16px 60px; }
        .gsq-root * { box-sizing: border-box; }
        .gsq-title { font-size: clamp(28px, 6vw, 44px); font-weight: 700; letter-spacing: 2px; text-transform: uppercase; text-align: center; margin: 0 0 6px; background: linear-gradient(135deg, #c8a96e, #e8d5a8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .gsq-sub { font-size: 13px; font-weight: 300; color: #555; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 28px; }
        .gsq-stats { display: flex; gap: 24px; margin-bottom: 24px; }
        .gsq-stat { text-align: center; }
        .gsq-stat-val { font-size: 26px; font-weight: 700; line-height: 1; }
        .gsq-stat-lbl { font-size: 9px; letter-spacing: 2px; color: #555; text-transform: uppercase; margin-top: 3px; }
        .gsq-card { width: 100%; max-width: 440px; background: #0e0e1c; border: 2px solid #1a1a2e; border-radius: 18px; padding: 28px 24px 24px; position: relative; overflow: hidden; }
        .gsq-card.correct { border-color: #22c55e; box-shadow: 0 0 40px #22c55e18; }
        .gsq-card.wrong { border-color: #ef4444; box-shadow: 0 0 40px #ef444418; }
        .gsq-clue-row { display: flex; align-items: center; gap: 12px; padding: 10px 14px; margin-bottom: 8px; border-radius: 10px; border: 1px solid #1a1a2e; transition: all 0.35s; }
        .gsq-clue-row.revealed { background: #ffffff06; border-color: #ffffff12; }
        .gsq-clue-row.locked { opacity: 0.25; }
        .gsq-clue-label { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #666; width: 90px; flex-shrink: 0; }
        .gsq-clue-val { font-size: 18px; font-weight: 600; color: #e8e8f0; }
        .gsq-clue-hidden { font-size: 16px; color: #333; letter-spacing: 3px; }
        .gsq-pts-badge { position: absolute; top: 14px; right: 16px; font-size: 11px; letter-spacing: 1px; color: #c8a96e; background: #c8a96e15; border: 1px solid #c8a96e33; border-radius: 100px; padding: 3px 10px; }
        .gsq-input-row { display: flex; gap: 8px; margin-top: 16px; }
        .gsq-input { flex: 1; background: #12121f; border: 1px solid #2a2a3e; border-radius: 10px; padding: 11px 14px; color: #e8e8f0; font-family: 'Oswald', sans-serif; font-size: 16px; outline: none; transition: border-color 0.2s; }
        .gsq-input:focus { border-color: #c8a96e55; }
        .gsq-input::placeholder { color: #333; }
        .gsq-btn { background: linear-gradient(135deg, #b8944e, #c8a96e); color: #080810; border: none; border-radius: 10px; padding: 11px 20px; font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; white-space: nowrap; }
        .gsq-btn:hover { filter: brightness(1.1); }
        .gsq-btn-skip { background: transparent; color: #555; border: 1px solid #2a2a3e; border-radius: 10px; padding: 8px 16px; font-family: 'Oswald', sans-serif; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; margin-top: 10px; width: 100%; }
        .gsq-btn-skip:hover { color: #888; border-color: #444; }
        .gsq-reveal { text-align: center; margin-top: 18px; }
        .gsq-reveal-name { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
        .gsq-reveal-detail { font-size: 13px; color: #666; }
        .gsq-next-btn { margin-top: 14px; }
        .gsq-history { width: 100%; max-width: 440px; margin-top: 28px; }
        .gsq-history-title { font-size: 11px; letter-spacing: 3px; color: #444; text-transform: uppercase; margin-bottom: 10px; }
        .gsq-history-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 8px; margin-bottom: 4px; }
        .gsq-history-row.got { background: #22c55e08; }
        .gsq-history-row.missed { background: #ef444408; }
        .gsq-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
        .gsq-dot.green { background: #22c55e; box-shadow: 0 0 6px #22c55e66; }
        .gsq-dot.red { background: #ef4444; box-shadow: 0 0 6px #ef444466; }
        .gsq-wrong-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
        .gsq-wrong-tag { font-size: 11px; color: #ef4444; background: #ef444415; border: 1px solid #ef444433; border-radius: 6px; padding: 2px 8px; text-decoration: line-through; opacity: 0.6; }
        .gsq-comp-tag { font-size: 11px; color: #888; background: #ffffff08; border-radius: 6px; padding: 2px 8px; display: inline-block; margin-bottom: 14px; letter-spacing: 1px; }
        @keyframes gsq-shake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-8px); } 40% { transform: translateX(8px); } 60% { transform: translateX(-5px); } 80% { transform: translateX(5px); } }
        .gsq-shake { animation: gsq-shake 0.45s ease; }
        @keyframes gsq-fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .gsq-fadein { animation: gsq-fadeIn 0.35s ease; }
        .gsq-start-wrap { text-align: center; padding: 40px 20px; }
        .gsq-start-icon { font-size: 52px; margin-bottom: 16px; }
        .gsq-start-desc { color: #555; font-size: 14px; line-height: 1.8; max-width: 300px; margin: 0 auto 24px; font-weight: 300; }
      `}</style>

      <div className="gsq-root">
        <h1 className="gsq-title">Goal Scorer Quiz</h1>
        <div className="gsq-sub">Guess the top scorer</div>

        {phase !== "idle" && (
          <div className="gsq-stats">
            <div className="gsq-stat">
              <div className="gsq-stat-val" style={{ color: "#c8a96e" }}>
                {score}
                <span style={{ fontSize: 14, color: "#555" }}>/{maxPossible || "—"}</span>
              </div>
              <div className="gsq-stat-lbl">Points</div>
            </div>
            <div className="gsq-stat">
              <div className="gsq-stat-val" style={{ color: "#22c55e" }}>{history.filter((h) => h.got).length}</div>
              <div className="gsq-stat-lbl">Correct</div>
            </div>
            <div className="gsq-stat">
              <div className="gsq-stat-val" style={{ color: "#ef4444" }}>{history.filter((h) => !h.got).length}</div>
              <div className="gsq-stat-lbl">Missed</div>
            </div>
            <div className="gsq-stat">
              <div className="gsq-stat-val" style={{ color: "#888" }}>{remaining}</div>
              <div className="gsq-stat-lbl">Left</div>
            </div>
          </div>
        )}

        <div
          className={`gsq-card ${phase === "correct" ? "correct" : ""} ${phase === "wrong" || phase === "skip" ? "wrong" : ""} ${shake ? "gsq-shake" : ""}`}
        >
          {phase === "idle" && !history.length && (
            <div className="gsq-start-wrap">
              <div className="gsq-start-icon">⚽</div>
              <p className="gsq-start-desc">
                Identify the goal scorer from progressive clues. Fewer clues = more points. Season → Goals → Nationality → Team.
              </p>
              <button className="gsq-btn" onClick={startGame}>
                Start Quiz
              </button>
            </div>
          )}

          {phase === "idle" && history.length > 0 && (
            <div className="gsq-start-wrap">
              <div className="gsq-start-icon">🏆</div>
              <div className="gsq-reveal-name" style={{ color: "#c8a96e" }}>
                {score} / {maxPossible}
              </div>
              <p className="gsq-reveal-detail" style={{ marginBottom: 6 }}>
                {history.filter((h) => h.got).length} of {history.length} correct
              </p>
              <button className="gsq-btn" onClick={startGame} style={{ marginTop: 16 }}>
                Play Again
              </button>
            </div>
          )}

          {phase === "playing" && current && (
            <div className="gsq-fadein" key={current.player + current.season}>
              <div className="gsq-comp-tag">{current.comp}</div>
              {ptsAvailable > 0 && (
                <div className="gsq-pts-badge">
                  {ptsAvailable} pt{ptsAvailable !== 1 ? "s" : ""}
                </div>
              )}
              {CLUE_KEYS.map((key, i) => (
                <div
                  key={key}
                  className={`gsq-clue-row ${i < cluesRevealed ? "revealed gsq-fadein" : "locked"}`}
                >
                  <div className="gsq-clue-label">{CLUE_LABELS[i]}</div>
                  {i < cluesRevealed ? (
                    <div className="gsq-clue-val">{formatClue(key, current[key])}</div>
                  ) : (
                    <div className="gsq-clue-hidden">• • •</div>
                  )}
                </div>
              ))}
              {wrongGuesses.length > 0 && (
                <div className="gsq-wrong-list">
                  {wrongGuesses.map((w, i) => (
                    <span key={i} className="gsq-wrong-tag">{w}</span>
                  ))}
                </div>
              )}
              <div className="gsq-input-row">
                <input
                  ref={inputRef}
                  className="gsq-input"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Player name..."
                  autoComplete="off"
                />
                <button className="gsq-btn" onClick={handleGuess}>
                  Guess
                </button>
              </div>
              <button className="gsq-btn-skip" onClick={handleSkip}>
                Skip →
              </button>
            </div>
          )}

          {(phase === "correct" || phase === "wrong" || phase === "skip") && current && (
            <div className="gsq-fadein" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>
                {phase === "correct" ? "✅" : "❌"}
              </div>
              <div
                className="gsq-reveal-name"
                style={{ color: phase === "correct" ? "#22c55e" : "#ef4444" }}
              >
                {current.player}
              </div>
              <div className="gsq-reveal-detail">
                {current.goals} goals · {current.team} · {current.season}
              </div>
              {phase === "correct" && (
                <div
                  style={{
                    color: "#c8a96e",
                    fontSize: 14,
                    marginTop: 8,
                    fontWeight: 600,
                  }}
                >
                  +{history[0]?.pts} point{history[0]?.pts !== 1 ? "s" : ""} ({history[0]?.cluesUsed} clue{history[0]?.cluesUsed !== 1 ? "s" : ""})
                </div>
              )}
              <button
                className="gsq-btn gsq-next-btn"
                onClick={queue.length > 0 ? nextEntry : () => setPhase("idle")}
              >
                {queue.length > 0 ? "Next →" : "See Results"}
              </button>
            </div>
          )}
        </div>

        {/* ──── history ──── */}
        {history.length > 0 && phase !== "idle" && (
          <div className="gsq-history">
            <div className="gsq-history-title">History</div>
            {history.map((h, i) => (
              <div key={i} className={`gsq-history-row ${h.got ? "got" : "missed"}`}>
                <div className={`gsq-dot ${h.got ? "green" : "red"}`} />
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: h.got ? "#e8e8f0" : "#888" }}>
                  {h.player}
                </span>
                <span style={{ fontSize: 12, color: "#555" }}>
                  {h.goals}g · {h.team}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: h.got ? "#c8a96e" : "#ef4444",
                    minWidth: 30,
                    textAlign: "right",
                  }}
                >
                  {h.got ? `+${h.pts}` : "✗"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
