import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";
import { NBA_PLAYERS } from "./nbaChainPlayers.js";

// ── DATA ─────────────────────────────────────────────────────────────────────

const NBA_TEAMS = [
  "Atlanta Hawks","Boston Celtics","Brooklyn Nets","Charlotte Hornets",
  "Chicago Bulls","Cleveland Cavaliers","Dallas Mavericks","Denver Nuggets",
  "Detroit Pistons","Golden State Warriors","Houston Rockets","Indiana Pacers",
  "Los Angeles Clippers","Los Angeles Lakers","Memphis Grizzlies","Miami Heat",
  "Milwaukee Bucks","Minnesota Timberwolves","New Orleans Pelicans","New York Knicks",
  "Oklahoma City Thunder","Orlando Magic","Philadelphia 76ers","Phoenix Suns",
  "Portland Trail Blazers","Sacramento Kings","San Antonio Spurs","Toronto Raptors",
  "Utah Jazz","Washington Wizards"
];

const TEAM_ALIASES = {
  "Atlanta Hawks":["atlanta","hawks","atl"],
  "Boston Celtics":["boston","celtics","bos"],
  "Brooklyn Nets":["brooklyn","nets","bkn","bk"],
  "Charlotte Hornets":["charlotte","hornets","cha","charlotte bobcats","bobcats"],
  "Chicago Bulls":["chicago","bulls","chi"],
  "Cleveland Cavaliers":["cleveland","cavaliers","cavs","cle"],
  "Dallas Mavericks":["dallas","mavericks","mavs","dal"],
  "Denver Nuggets":["denver","nuggets","den"],
  "Detroit Pistons":["detroit","pistons","det"],
  "Golden State Warriors":["golden state","warriors","gsw","gs","golden st"],
  "Houston Rockets":["houston","rockets","hou"],
  "Indiana Pacers":["indiana","pacers","ind"],
  "Los Angeles Clippers":["los angeles clippers","la clippers","clippers","lac"],
  "Los Angeles Lakers":["los angeles lakers","la lakers","lakers","lal"],
  "Memphis Grizzlies":["memphis","grizzlies","mem","vancouver grizzlies"],
  "Miami Heat":["miami","heat","mia"],
  "Milwaukee Bucks":["milwaukee","bucks","mil"],
  "Minnesota Timberwolves":["minnesota","timberwolves","wolves","min"],
  "New Orleans Pelicans":["new orleans","pelicans","nop","new orleans hornets","hornets"],
  "New York Knicks":["new york","knicks","nyk","ny knicks"],
  "Oklahoma City Thunder":["oklahoma city","thunder","okc","seattle supersonics","sonics","seattle"],
  "Orlando Magic":["orlando","magic","orl"],
  "Philadelphia 76ers":["philadelphia","76ers","sixers","phi","philly"],
  "Phoenix Suns":["phoenix","suns","phx"],
  "Portland Trail Blazers":["portland","trail blazers","blazers","por"],
  "Sacramento Kings":["sacramento","kings","sac"],
  "San Antonio Spurs":["san antonio","spurs","sas","sa"],
  "Toronto Raptors":["toronto","raptors","tor"],
  "Utah Jazz":["utah","jazz","uta"],
  "Washington Wizards":["washington","wizards","was","wsh","washington bullets","bullets"],
};

const TEAM_LEGACY_MAP = {
  "Brooklyn Nets": ["New Jersey Nets","New York Nets"],
  "Oklahoma City Thunder": ["Seattle SuperSonics"],
  "Memphis Grizzlies": ["Vancouver Grizzlies"],
  "New Orleans Pelicans": ["New Orleans Hornets","Charlotte Hornets"],
  "Charlotte Hornets": ["Charlotte Bobcats"],
  "Washington Wizards": ["Washington Bullets"],
  "Los Angeles Clippers": ["San Diego Clippers","Buffalo Braves"],
  "Sacramento Kings": ["Kansas City Kings","Cincinnati Royals"],
};

// ── HELPERS ──────────────────────────────────────────────────────────────────

function normalize(s) {
  return s.toLowerCase().trim().replace(/-/g, " ").replace(/[^a-z0-9 ']/g, "").replace(/\s+/g, " ");
}

function phoneticNorm(s) {
  return s.toLowerCase().replace(/ph/g,"f").replace(/ou/g,"u").replace(/ck/g,"k")
    .replace(/ae/g,"e").replace(/oo/g,"u").replace(/[aeiou]+/g,"a").replace(/(.)\1+/g,"$1").trim();
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
    }
  }
  return dp[m][n];
}

const PLAYER_NORMALIZED = new Map();
NBA_PLAYERS.forEach(p => PLAYER_NORMALIZED.set(normalize(p.name), p.name));

function findPlayerSuggestion(raw) {
  const norm = normalize(raw);
  const words = norm.split(" ");
  if (words.length < 2) return null;
  const inpFirst = words[0], inpLast = words.slice(1).join(" ");
  const lastInitial = inpLast[0], firstCode = inpFirst.charCodeAt(0);
  const inpFirstPh = phoneticNorm(inpFirst), inpLastPh = phoneticNorm(inpLast);
  let best = null, bestScore = [999, 999];
  for (const [key, canonical] of PLAYER_NORMALIZED) {
    const kw = key.split(" "); if (kw.length < 2) continue;
    const kFirst = kw[0], kLast = kw.slice(1).join(" ");
    if (!kLast.startsWith(lastInitial)) continue;
    if (Math.abs(kFirst.charCodeAt(0) - firstCode) > 1) continue;
    const fpd = levenshtein(inpFirstPh, phoneticNorm(kFirst));
    const lpd = levenshtein(inpLastPh, phoneticNorm(kLast));
    if (fpd > 2 || lpd > 2) continue;
    const fd = levenshtein(norm, key);
    if (fd === 0 || fd > 7) continue;
    const score = [fpd + lpd, fd];
    if (score[0] < bestScore[0] || (score[0] === bestScore[0] && score[1] < bestScore[1])) {
      bestScore = score; best = canonical;
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

const FIRST_NAME_ALIASES = {
  "matthew":["matt"],"michael":["mike"],"robert":["rob","bob","bobby"],
  "william":["will","bill"],"james":["jim","jimmy"],"joseph":["joe","joey"],
  "thomas":["tom","tommy"],"christopher":["chris"],"nicholas":["nick"],
  "anthony":["tony"],"jonathan":["jon"],"nathaniel":["nate"],
  "benjamin":["ben"],"daniel":["dan","danny"],"timothy":["tim"],
  "jeffrey":["jeff"],"stephen":["steve"],"steven":["steve"],
  "patrick":["pat"],"kenneth":["ken","kenny"],"deandre":["de'andre"],
  "dangelo":["d'angelo"],"lamelo":["la melo"],
};
const FIRST_NAME_REVERSE = {};
for (const [full, shorts] of Object.entries(FIRST_NAME_ALIASES)) {
  for (const s of shorts) { if (!FIRST_NAME_REVERSE[s]) FIRST_NAME_REVERSE[s] = []; FIRST_NAME_REVERSE[s].push(full); }
}

function resolvePlayer(input) {
  const n = normalize(input);
  const stripSuffix = s => s.replace(/\b(jr|sr|ii|iii|iv)\b/g, "").replace(/\s+/g, " ").trim();
  const matches = [];
  const exact = NBA_PLAYERS.find(p => normalize(p.name) === n);
  if (exact) matches.push(exact);
  const nStripped = stripSuffix(n);
  NBA_PLAYERS.forEach(p => {
    if (p !== exact && stripSuffix(normalize(p.name)) === nStripped) matches.push(p);
  });
  const parts = nStripped.split(" ");
  if (parts.length >= 2) {
    const firstName = parts[0], lastName = parts.slice(1).join(" ");
    for (const fullFirst of (FIRST_NAME_REVERSE[firstName] || [])) {
      const expanded = fullFirst + " " + lastName;
      NBA_PLAYERS.forEach(p => { if (!matches.includes(p) && stripSuffix(normalize(p.name)) === expanded) matches.push(p); });
    }
    for (const nick of (FIRST_NAME_ALIASES[firstName] || [])) {
      const shortened = nick + " " + lastName;
      NBA_PLAYERS.forEach(p => { if (!matches.includes(p) && stripSuffix(normalize(p.name)) === shortened) matches.push(p); });
    }
    NBA_PLAYERS.forEach(p => {
      if (matches.includes(p)) return;
      const pp = stripSuffix(normalize(p.name)).split(" ");
      if (pp.length < 2) return;
      if (pp.slice(1).join(" ") !== lastName) return;
      if (levenshtein(firstName, pp[0]) <= 2) matches.push(p);
    });
  }
  return matches.length > 0 ? matches : null;
}

function playerOnTeam(player, team) {
  if (player.teams.includes(team)) return true;
  const legacyNames = TEAM_LEGACY_MAP[team] || [];
  return legacyNames.some(legacy => player.teams.includes(legacy));
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const STEP = { TEAM: "team", PLAYER_TO_TEAM: "player_to_team" };

const CHAIN_LABELS = ["","","Double","Triple","Quadruple","Quintuple","Sextuple","Legendary"];

function getChainLabel(chainNum) {
  if (chainNum <= 1) return "";
  return CHAIN_LABELS[Math.min(chainNum, CHAIN_LABELS.length - 1)] + " Chain";
}

// ── DISPLAY COMPONENTS ──────────────────────────────────────────────────────

function ChainNode({ item, type, isLatest }) {
  const isTeam = type === "team";
  const colors = isTeam
    ? { bg: "#0f1f2e", border: "#1a6b9e", text: "#5bb8f5", label: "#1a6b9e" }
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
        {isTeam ? "Team" : "Player"}
      </div>
      <div style={{
        background: colors.bg, border: `1px solid ${colors.border}`,
        borderRadius: 8, padding: "6px 12px",
        fontSize: 12, fontWeight: 700, fontFamily: "'Oswald', sans-serif",
        color: colors.text, letterSpacing: 0.5,
        maxWidth: 160, textAlign: "center", lineHeight: 1.3,
        boxShadow: isLatest ? `0 0 12px ${colors.border}55` : "none",
      }}>
        {item}
      </div>
    </div>
  );
}

function ChainConnector() {
  return <div style={{ display: "flex", alignItems: "center", fontSize: 14, padding: "0 4px" }}>🔗</div>;
}

const TEAM_ABBR = {
  "Atlanta Hawks":"ATL","Boston Celtics":"BOS","Brooklyn Nets":"BKN",
  "Charlotte Hornets":"CHA","Chicago Bulls":"CHI","Cleveland Cavaliers":"CLE",
  "Dallas Mavericks":"DAL","Denver Nuggets":"DEN","Detroit Pistons":"DET",
  "Golden State Warriors":"GSW","Houston Rockets":"HOU","Indiana Pacers":"IND",
  "Los Angeles Clippers":"LAC","Los Angeles Lakers":"LAL","Memphis Grizzlies":"MEM",
  "Miami Heat":"MIA","Milwaukee Bucks":"MIL","Minnesota Timberwolves":"MIN",
  "New Orleans Pelicans":"NOP","New York Knicks":"NYK","Oklahoma City Thunder":"OKC",
  "Orlando Magic":"ORL","Philadelphia 76ers":"PHI","Phoenix Suns":"PHX",
  "Portland Trail Blazers":"POR","Sacramento Kings":"SAC","San Antonio Spurs":"SAS",
  "Toronto Raptors":"TOR","Utah Jazz":"UTA","Washington Wizards":"WAS",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600);
  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", h); return () => window.removeEventListener("resize", h);
  }, []);
  return isMobile;
}

function TeamTracker({ usedTeams }) {
  const isMobile = useIsMobile();
  const cols = isMobile ? 6 : 10;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 3 : 4, maxWidth: 760, width: "100%" }}>
      {NBA_TEAMS.map(team => {
        const used = usedTeams.has(team);
        return (
          <div key={team} title={team} style={{
            fontSize: isMobile ? 8 : 9, fontFamily: "'Oswald', sans-serif",
            fontWeight: 700, letterSpacing: 0.5,
            padding: isMobile ? "3px 2px" : "3px 7px", borderRadius: 4,
            background: used ? "#0d2a18" : "#1a1408",
            border: `1px solid ${used ? "#22c55e55" : "#7a5f1a55"}`,
            color: used ? "#22c55e" : "#e8c060",
            transition: "all 0.3s", textTransform: "uppercase", textAlign: "center",
          }}>{TEAM_ABBR[team]}</div>
        );
      })}
    </div>
  );
}

// ── MAIN GAME ────────────────────────────────────────────────────────────────
export default function NBAChain() {
  const [step, setStep] = useState(STEP.TEAM);
  const [currentTarget, setCurrentTarget] = useState(null);
  const [chain, setChain] = useState([]);
  const [usedTeams, setUsedTeams] = useState(new Set());
  const [usedPlayers, setUsedPlayers] = useState(new Set());
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const justSetSuggestion = useRef(false);
  const [won, setWon] = useState(false);
  const [chainNum, setChainNum] = useState(1); // which chain attempt (1 = first, 2 = double, etc.)
  const [showMultiChainPrompt, setShowMultiChainPrompt] = useState(false);
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const chainContainerRef = useRef(null);
  const trackPlay = usePlayCount("nba-chain");

  // ── LocalStorage persistence ──
  const SAVE_KEY = "nbaChain_save";

  function saveGame(state) {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        step: state.step, currentTarget: state.currentTarget,
        chain: state.chain, usedTeams: [...state.usedTeams],
        usedPlayers: [...state.usedPlayers], chainNum: state.chainNum,
        won: state.won, showMultiChainPrompt: state.showMultiChainPrompt,
        history: state.history.map(h => ({ ...h, usedTeams: [...h.usedTeams], usedPlayers: [...h.usedPlayers] })),
      }));
    } catch (e) {}
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.chain && s.chain.length > 1) {
          setStep(s.step); setCurrentTarget(s.currentTarget);
          setChain(s.chain); setUsedTeams(new Set(s.usedTeams));
          setUsedPlayers(new Set(s.usedPlayers)); setChainNum(s.chainNum || 1);
          setWon(s.won || false); setShowMultiChainPrompt(s.showMultiChainPrompt || false);
          setHistory((s.history || []).map(h => ({ ...h, usedTeams: new Set(h.usedTeams), usedPlayers: new Set(h.usedPlayers) })));
          return;
        }
      }
    } catch (e) {}
    const team = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)];
    setCurrentTarget(team); setUsedTeams(new Set([team])); setChain([{ item: team, type: "team" }]);
  }, []);

  useEffect(() => {
    if (chain.length > 0 && currentTarget) {
      saveGame({ step, currentTarget, chain, usedTeams, usedPlayers, chainNum, won, showMultiChainPrompt, history });
    }
  }, [step, currentTarget, chain, usedTeams, usedPlayers, chainNum, won, showMultiChainPrompt, history]);

  useEffect(() => {
    if (chainContainerRef.current) chainContainerRef.current.scrollLeft = chainContainerRef.current.scrollWidth;
  }, [chain]);

  const reject = useCallback((msg) => {
    setShake(true); setRejectMsg(msg);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setRejectMsg(""), 2000);
  }, []);

  const pushHistory = useCallback(() => {
    setHistory(h => [...h, { step, currentTarget, chain: [...chain], usedTeams: new Set(usedTeams), usedPlayers: new Set(usedPlayers) }]);
  }, [step, currentTarget, chain, usedTeams, usedPlayers]);

  const handleGoBack = useCallback(() => {
    setHistory(h => {
      if (h.length === 0) return h;
      const snap = h[h.length - 1];
      setStep(snap.step); setCurrentTarget(snap.currentTarget);
      setChain(snap.chain); setUsedTeams(snap.usedTeams); setUsedPlayers(snap.usedPlayers);
      setInput(""); setRejectMsg(""); setTimeout(() => inputRef.current?.focus(), 50);
      return h.slice(0, -1);
    });
  }, []);

  const acceptSuggestion = useCallback((canonical) => {
    setSuggestion(null); setInput(canonical);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  // ── Multi-chain: start a new chain keeping used players ──
  const startNextChain = useCallback(() => {
    const team = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)];
    setCurrentTarget(team);
    setUsedTeams(new Set([team]));
    // Keep usedPlayers — that's the challenge!
    setChain([{ item: team, type: "team" }]);
    setStep(STEP.TEAM);
    setInput(""); setRejectMsg(""); setSuggestion(null);
    setWon(false); setShowMultiChainPrompt(false);
    setChainNum(c => c + 1);
    setHistory([]);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const handleSubmit = useCallback(() => {
    // If there's a pending suggestion, Enter confirms it
    if (suggestion) {
      const canonical = suggestion;
      setSuggestion(null); setInput("");
      const candidates = resolvePlayer(canonical);
      if (candidates) {
        if (step === STEP.TEAM) {
          const player = candidates.find(p => playerOnTeam(p, currentTarget) && !usedPlayers.has(p.name));
          if (player) {
            pushHistory();
            const newUsed = new Set(usedPlayers); newUsed.add(player.name);
            setUsedPlayers(newUsed);
            setChain(c => [...c, { item: player.name, type: "player" }]);
            setCurrentTarget(player.name);
            setStep(STEP.PLAYER_TO_TEAM);
          } else { reject("That doesn't work here"); }
        } else { reject("That doesn't work here"); }
      }
      return;
    }

    const val = input.trim();
    if (!val) return;

    if (step === STEP.TEAM) {
      // Need a player who played for currentTarget team
      const candidates = resolvePlayer(val);
      if (!candidates) {
        const fuzzy = findPlayerSuggestion(val);
        if (fuzzy) {
          justSetSuggestion.current = true;
          setTimeout(() => { justSetSuggestion.current = false; }, 50);
          setSuggestion(fuzzy); setRejectMsg(""); setInput("");
        } else { reject("Player not found in our database"); }
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
      setCurrentTarget(player.name);
      setStep(STEP.PLAYER_TO_TEAM);
      setInput("");

    } else if (step === STEP.PLAYER_TO_TEAM) {
      const team = resolveTeam(val);
      if (!team) return reject("NBA team not recognized");
      const player = NBA_PLAYERS.find(p => p.name === currentTarget);
      if (!playerOnTeam(player, team)) return reject(`${player.name} didn't play for the ${team}`);
      if (usedTeams.has(team)) return reject(`${team} already used`);

      pushHistory();
      const newUsedTeams = new Set(usedTeams); newUsedTeams.add(team);
      setUsedTeams(newUsedTeams);
      setChain(c => [...c, { item: team, type: "team" }]);
      setCurrentTarget(team);
      setInput("");

      if (newUsedTeams.size === 30) {
        setWon(true);
        setShowMultiChainPrompt(true);
      } else {
        setStep(STEP.TEAM);
      }
    }
  }, [step, currentTarget, input, usedTeams, usedPlayers, reject, pushHistory, suggestion]);

  const handleKeyDown = (e) => {
    trackPlay();
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape" && suggestion) { setSuggestion(null); setRejectMsg(""); }
  };

  const handleReset = () => {
    clearSave();
    const team = NBA_TEAMS[Math.floor(Math.random() * NBA_TEAMS.length)];
    setCurrentTarget(team); setUsedTeams(new Set([team])); setUsedPlayers(new Set());
    setChain([{ item: team, type: "team" }]); setStep(STEP.TEAM);
    setInput(""); setWon(false); setRejectMsg(""); setHistory([]);
    setChainNum(1); setShowMultiChainPrompt(false);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const prompt = currentTarget
    ? step === STEP.TEAM
      ? `Name a player who played for the ${currentTarget}`
      : `Name an NBA team ${currentTarget} has played for`
    : "";
  const hint = step === STEP.TEAM ? "Type any NBA player's name" : "Type any NBA team name";
  const teamsLeft = 30 - usedTeams.size;

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 30% 10%, #1a0f0a 0%, #07070f 55%), radial-gradient(ellipse at 70% 90%, #0a120a 0%, transparent 50%)",
      color: "#f0f0f0", fontFamily: "'Oswald', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "84px 16px 60px",
    }}>
      <Helmet>
        <title>NBA Chain – TrivialSports</title>
        <meta name="description" content="Link all 30 NBA teams through players. No repeats allowed. Can you go for the double chain?" />
        <meta property="og:title" content="NBA Chain – TrivialSports" />
        <meta property="og:description" content="Link all 30 NBA teams through players. No repeats. Can you go for the double chain?" />
        <meta property="og:url" content="https://trivialsports.com/games/nba-chain" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff18", textTransform: "uppercase", marginBottom: 6 }}>NBA</div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: 0, lineHeight: 1,
          background: "linear-gradient(135deg,#e67e22,#f39c12,#5bb8f5,#5fd88a)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1,
        }}>Complete The Chain</h1>
        <p style={{
          fontSize: 12, margin: "8px 0 0", letterSpacing: 1, textTransform: "uppercase",
          background: "linear-gradient(135deg,#5fd88a,#e8c060,#5bb8f5)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>by linking all 30 NBA teams without repeating</p>
        <p style={{ color: "#e67e22", fontSize: 13, margin: "8px 0 0", letterSpacing: 0.5 }}>
          NBA Team 🔗 Player 🔗 NBA Team 🔗 Player 🔗 NBA Team
        </p>

        {chainNum > 1 && (
          <div style={{
            marginTop: 10, fontSize: 13, fontWeight: 900, letterSpacing: 2,
            color: "#f39c12", textTransform: "uppercase",
            animation: "pulse 2s ease infinite",
          }}>
            🔥 Going for the {getChainLabel(chainNum)}! — {usedPlayers.size} players locked out
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center" }}>
          <button onClick={handleReset} style={{
            padding: "6px 16px", borderRadius: 20,
            border: "1px solid #ffffff20", background: "transparent",
            color: "#ffffff50", fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
            fontFamily: "'Oswald', sans-serif",
          }}
            onMouseEnter={e => { e.currentTarget.style.color = "#e74c3c"; e.currentTarget.style.borderColor = "#e74c3c55"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#ffffff50"; e.currentTarget.style.borderColor = "#ffffff20"; }}
          >↺ New Game</button>
        </div>
      </div>

      {/* Progress */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 24,
        background: "#0b0b1e", border: "1px solid #161632",
        borderRadius: 12, padding: "12px 28px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#e67e22", lineHeight: 1 }}>{usedTeams.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Teams</div>
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
        {chainNum > 1 && <>
          <div style={{ width: 1, height: 36, background: "#161632" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#f39c12", lineHeight: 1 }}>{chainNum}</div>
            <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Chain</div>
          </div>
        </>}
      </div>

      {/* Team tracker */}
      <div style={{ marginBottom: 12, width: "100%", maxWidth: 760 }}>
        <TeamTracker usedTeams={usedTeams} />
      </div>

      {/* Used players tracker — shown during multi-chain attempts */}
      {chainNum > 1 && usedPlayers.size > 0 && (
        <div style={{ marginBottom: 24, width: "100%", maxWidth: 760 }}>
          <div style={{ fontSize: 8, color: "#ffffff15", letterSpacing: 4, textTransform: "uppercase", marginBottom: 6 }}>
            Locked Out Players — {usedPlayers.size} used
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {[...usedPlayers].sort().map(player => {
              // Check if player is in current chain
              const inCurrentChain = chain.some(n => n.type === "player" && n.item === player);
              return (
                <div key={player} title={player} style={{
                  fontSize: 9, fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700, letterSpacing: 0.5,
                  padding: "3px 7px", borderRadius: 4,
                  background: inCurrentChain ? "#0e1e10" : "#1a0e0e",
                  border: `1px solid ${inCurrentChain ? "#2a7a4055" : "#e74c3c33"}`,
                  color: inCurrentChain ? "#5fd88a" : "#e74c3c99",
                  textTransform: "uppercase",
                }}>
                  {player}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Win state */}
      {won && showMultiChainPrompt && (
        <div style={{
          width: "100%", maxWidth: 520, marginBottom: 24,
          background: "linear-gradient(135deg,#0d2b14,#0f3318)",
          border: "1px solid #22c55e44", borderRadius: 16,
          padding: "28px 32px", textAlign: "center", animation: "fadeUp .4s ease",
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>
            {chainNum === 1 ? "YOU DID IT!" : `${getChainLabel(chainNum).toUpperCase()} COMPLETE!`}
          </div>
          <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 8 }}>
            All 30 NBA teams chained in {chain.length} links using {usedPlayers.size} players
          </div>

          {/* Share section */}
          <div style={{ marginTop: 20, borderTop: "1px solid #22c55e22", paddingTop: 16 }}>
            <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff30", marginBottom: 10 }}>Share your result</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => {
                const chainLabel = chainNum > 1 ? ` (${getChainLabel(chainNum)})` : "";
                const text = `🏀 I completed the NBA Chain${chainLabel} on TrivialSports!\n⛓️ Linked all 30 NBA teams using ${usedPlayers.size} players\n🔥 Can you do it? trivialsports.com/games/nba-chain`;
                navigator.clipboard.writeText(text).then(() => {
                  const btn = document.getElementById('nba-copy-btn');
                  btn.innerText = '✓ Copied!'; setTimeout(() => btn.innerText = 'Copy', 2000);
                });
              }} id="nba-copy-btn" style={{
                background: "#ffffff12", color: "#ffffff88", border: "1px solid #ffffff22",
                borderRadius: 8, padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif",
              }}>Copy</button>
              <button onClick={() => {
                const chainLabel = chainNum > 1 ? ` (${getChainLabel(chainNum)})` : "";
                const text = encodeURIComponent(`🏀 I completed the NBA Chain${chainLabel} on TrivialSports!\n⛓️ Linked all 30 NBA teams using ${usedPlayers.size} players\n🔥 Can you do it? trivialsports.com/games/nba-chain`);
                window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
              }} style={{
                background: "#000000", color: "#ffffff", border: "1px solid #333333",
                borderRadius: 8, padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif",
              }}>𝕏 Post</button>
              <button onClick={() => {
                const chainLabel = chainNum > 1 ? ` (${getChainLabel(chainNum)})` : "";
                const text = encodeURIComponent(`🏀 I completed the NBA Chain${chainLabel} on TrivialSports!\n⛓️ Linked all 30 NBA teams using ${usedPlayers.size} players\n🔥 Can you do it? trivialsports.com/games/nba-chain`);
                window.open(`https://bsky.app/intent/compose?text=${text}`, '_blank');
              }} style={{
                background: "#0085ff", color: "#ffffff", border: "none",
                borderRadius: 8, padding: "9px 16px", fontSize: 11, fontWeight: 700,
                cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
                fontFamily: "'Oswald', sans-serif",
              }}>Bluesky</button>
            </div>
          </div>

          {/* Multi-chain prompt */}
          <div style={{ marginTop: 20, borderTop: "1px solid #22c55e22", paddingTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#f39c12", letterSpacing: 1, marginBottom: 8 }}>
              🔥 Go for the {getChainLabel(chainNum + 1)}?
            </div>
            <div style={{ fontSize: 11, color: "#a0a0c0", marginBottom: 16 }}>
              Start a new chain through all 30 teams — but you can't reuse any of your {usedPlayers.size} players!
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={startNextChain} style={{
                background: "linear-gradient(135deg,#f39c12,#e67e22)", color: "#07070f",
                border: "none", borderRadius: 10, padding: "11px 28px",
                fontSize: 13, fontWeight: 900, cursor: "pointer",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>Let's Go 🔥</button>
              <button onClick={handleReset} style={{
                background: "transparent", border: "1px solid #ffffff20",
                borderRadius: 10, padding: "11px 28px", color: "#ffffff50",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>Fresh Start</button>
            </div>
          </div>
        </div>
      )}

      {/* Active prompt + input */}
      {!won && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          <div style={{
            background: "#0b0b1e", border: "1px solid #161640",
            borderRadius: 14, padding: "18px 20px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 9, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              Step {chain.length}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 6 }}>
              {prompt}
            </div>
            <div style={{ fontSize: 10, color: "#ffffff28", letterSpacing: 1 }}>{hint}</div>
          </div>

          <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setRejectMsg(""); setSuggestion(null); }}
              onKeyDown={handleKeyDown}
              placeholder={step === STEP.TEAM ? "Player name..." : "Team name..."}
              autoComplete="off" autoFocus
              style={{
                width: "100%", background: "#07071a",
                border: `2px solid ${shake ? "#e74c3c" : "#141432"}`,
                borderRadius: 12, padding: "14px 18px",
                fontSize: 16, color: "#f0f0f0", outline: "none",
                fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                letterSpacing: 0.5, boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#e67e2255"}
              onBlur={e => e.target.style.borderColor = "#141432"}
            />
          </div>

          {suggestion && (
            <div style={{ marginTop: 8, fontFamily: "Georgia, serif" }}>
              <div style={{ fontSize: 13, color: "#c8a050cc", marginBottom: 6, textAlign: "center" }}>
                Did you mean <strong style={{ color: "#c8a050", fontStyle: "italic" }}>{suggestion}</strong>?
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button onClick={() => acceptSuggestion(suggestion)} style={{
                  background: "#c8a05022", border: "1px solid #c8a05055", color: "#c8a050",
                  borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: 700,
                  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'Oswald', sans-serif",
                }}>Yes — Enter</button>
                <button onClick={() => { setSuggestion(null); setRejectMsg(""); inputRef.current?.focus(); }} style={{
                  background: "transparent", border: "1px solid #ffffff15", color: "#ffffff30",
                  borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: 700,
                  letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'Oswald', sans-serif",
                }}>No — Esc</button>
              </div>
            </div>
          )}
          {!suggestion && rejectMsg && (
            <div style={{
              marginTop: 8, fontSize: 11, color: "#e74c3c99",
              letterSpacing: 1, textAlign: "center", animation: "fadeUp .2s ease",
            }}>{rejectMsg}</div>
          )}

          <button onClick={handleSubmit} style={{
            marginTop: 10, width: "100%",
            background: "linear-gradient(135deg,#4a3000,#5a3a10)",
            border: "1px solid #e67e2244", borderRadius: 10, padding: "12px 0",
            fontSize: 12, fontWeight: 900, color: "#e67e22",
            cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
          }}>Confirm →</button>

          {history.length > 0 && (
            <button onClick={handleGoBack} style={{
              marginTop: 8, width: "100%", background: "transparent",
              border: "1px solid #ffffff18", borderRadius: 10, padding: "10px 0",
              fontSize: 11, fontWeight: 700, color: "#ffffff55",
              cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            }}>← Go Back</button>
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
          Chain — {chain.length} links {chainNum > 1 ? `(${getChainLabel(chainNum)} attempt)` : ""}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", rowGap: 10 }}>
          {chain.map((node, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <ChainNode item={node.item} type={node.type} isLatest={i === chain.length - 1} />
              {i < chain.length - 1 && <ChainConnector />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
