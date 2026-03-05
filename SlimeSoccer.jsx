import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";

const G = {
  WIDTH: 800,
  HEIGHT: 450,
  GROUND_Y: 390,
  GRAVITY: 0.4,
  BALL_RADIUS: 14,
  SLIME_RADIUS: 45,
  JUMP_FORCE: -9.5,
  SLIME_SPEED: 4.8,
  BALL_BOUNCE: 0.7,
  BALL_SLIME_BOUNCE: 1.05,
  MAX_BALL_SPEED: 14,
  WINNING_SCORE: 7,
  GOAL_WIDTH: 50,
  GOAL_HEIGHT: 90,
  GOAL_POST_W: 6,
};

const COUNTRIES = [
  // Hosts first
  { name: "USA", flag: "🇺🇸", primary: "#ffffff", highlight: "#f0f0f0", pattern: "wavy_stripes", patternColor2: "#b80020", patternColor3: "transparent" },
  { name: "Canada", flag: "🇨🇦", primary: "#d80621", highlight: "#f05a6a", pattern: "diagonal_split", patternColor2: "#9e0418" },
  { name: "Mexico", flag: "🇲🇽", primary: "#006847", highlight: "#4db88a", pattern: "concentric_circles", patternColor2: "#004a30" },
  // Alphabetical
  { name: "Albania", flag: "🇦🇱", primary: "#cc0000", highlight: "#e06060" },
  { name: "Algeria", flag: "🇩🇿", primary: "#d4c9a8", highlight: "#f5f0e0" },
  { name: "Argentina", flag: "🇦🇷", primary: "#ffffff", highlight: "#f0f0f0", pattern: "vertical_stripes", patternColor2: "#6cace4" },
  { name: "Australia", flag: "🇦🇺", primary: "#d4a017", highlight: "#f0cc5a" },
  { name: "Austria", flag: "🇦🇹", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Belgium", flag: "🇧🇪", primary: "#b8102e", highlight: "#e04a5a" },
  { name: "Bolivia", flag: "🇧🇴", primary: "#007934", highlight: "#4db87a" },
  { name: "Bosnia and Herzegovina", flag: "🇧🇦", primary: "#002395", highlight: "#5a72c0" },
  { name: "Brazil", flag: "🇧🇷", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Cape Verde", flag: "🇨🇻", primary: "#003893", highlight: "#5a7fc0" },
  { name: "Colombia", flag: "🇨🇴", primary: "#fcd116", highlight: "#fde46a" },
  { name: "Croatia", flag: "🇭🇷", primary: "#ffffff", highlight: "#f0f0f0", pattern: "checkerboard", patternColor2: "#cc0000" },
  { name: "Curaçao", flag: "🇨🇼", primary: "#002b7f", highlight: "#5a6fbf" },
  { name: "Czechia", flag: "🇨🇿", primary: "#d7141a", highlight: "#e86a6a" },
  { name: "DR Congo", flag: "🇨🇩", primary: "#007fff", highlight: "#60a8ff" },
  { name: "Denmark", flag: "🇩🇰", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Ecuador", flag: "🇪🇨", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Egypt", flag: "🇪🇬", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "France", flag: "🇫🇷", primary: "#002395", highlight: "#5a72c0" },
  { name: "Germany", flag: "🇩🇪", primary: "#ffffff", highlight: "#f0f0f0", pattern: "diagonal_stripes", patternColors: ["#1a1a1a", "#dd0000", "#ffcc00"] },
  { name: "Ghana", flag: "🇬🇭", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "Haiti", flag: "🇭🇹", primary: "#00209f", highlight: "#5a6fd0" },
  { name: "Iran", flag: "🇮🇷", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "Iraq", flag: "🇮🇶", primary: "#007a3d", highlight: "#4dc47a" },
  { name: "Italy", flag: "🇮🇹", primary: "#0066cc", highlight: "#5a9ee0" },
  { name: "Ivory Coast", flag: "🇨🇮", primary: "#f77f00", highlight: "#f7a84a" },
  { name: "Jamaica", flag: "🇯🇲", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Japan", flag: "🇯🇵", primary: "#002776", highlight: "#5a6fbf" },
  { name: "Jordan", flag: "🇯🇴", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Kosovo", flag: "🇽🇰", primary: "#244aa5", highlight: "#6a8ad0" },
  { name: "Morocco", flag: "🇲🇦", primary: "#8b0000", highlight: "#c44040" },
  { name: "Netherlands", flag: "🇳🇱", primary: "#f36c21", highlight: "#f7a05a" },
  { name: "New Caledonia", flag: "🇳🇨", primary: "#2a2a2a", highlight: "#5a5a5a" },
  { name: "New Zealand", flag: "🇳🇿", primary: "#1a1a1a", highlight: "#555555" },
  { name: "North Macedonia", flag: "🇲🇰", primary: "#ce2028", highlight: "#e07a7a" },
  { name: "Northern Ireland", flag: "☘️", primary: "#006847", highlight: "#4db88a" },
  { name: "Norway", flag: "🇳🇴", primary: "#ba0c2f", highlight: "#e06070", pattern: "cross", patternColor2: "#002868", patternColor3: "#ffffff" },
  { name: "Panama", flag: "🇵🇦", primary: "#d21034", highlight: "#e86a7a" },
  { name: "Paraguay", flag: "🇵🇾", primary: "#ffffff", highlight: "#f0f0f0", pattern: "vertical_stripes", patternColor2: "#b80020" },
  { name: "Poland", flag: "🇵🇱", primary: "#dc143c", highlight: "#e86a7a" },
  { name: "Portugal", flag: "🇵🇹", primary: "#8b0000", highlight: "#c44040" },
  { name: "Qatar", flag: "🇶🇦", primary: "#8a1538", highlight: "#b85a6a" },
  { name: "Republic of Ireland", flag: "🇮🇪", primary: "#169b62", highlight: "#5ad090" },
  { name: "Romania", flag: "🇷🇴", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Saudi Arabia", flag: "🇸🇦", primary: "#004d25", highlight: "#2a7a4a" },
  { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", primary: "#1a2253", highlight: "#3a4a8a" },
  { name: "Senegal", flag: "🇸🇳", primary: "#00853f", highlight: "#4dc47a" },
  { name: "Slovakia", flag: "🇸🇰", primary: "#0b4ea2", highlight: "#5a8ad0" },
  { name: "South Africa", flag: "🇿🇦", primary: "#f5c518", highlight: "#fde46a" },
  { name: "South Korea", flag: "🇰🇷", primary: "#cd2e3a", highlight: "#e07a80" },
  { name: "Spain", flag: "🇪🇸", primary: "#c60b1e", highlight: "#e85a6a", pattern: "thin_stripes", patternColor2: "#f4c300" },
  { name: "Suriname", flag: "🇸🇷", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Sweden", flag: "🇸🇪", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Switzerland", flag: "🇨🇭", primary: "#aa0000", highlight: "#d44a4a" },
  { name: "Tunisia", flag: "🇹🇳", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Turkey", flag: "🇹🇷", primary: "#e30a17", highlight: "#f06a6a" },
  { name: "Ukraine", flag: "🇺🇦", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Uruguay", flag: "🇺🇾", primary: "#5bc0eb", highlight: "#a0ddf7" },
  { name: "Uzbekistan", flag: "🇺🇿", primary: "#0099b5", highlight: "#5ac4d0" },
  { name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", primary: "#c8102e", highlight: "#e06a7a" },
];

const PL_TEAMS = [
  { name: "Arsenal", flag: "\u{1F6E1}\uFE0F", primary: "#EF0107", highlight: "#ff6060" },
  { name: "Aston Villa", flag: "\u{1F981}", primary: "#670E36", highlight: "#9a4a6a" },
  { name: "Bournemouth", flag: "\u{1F352}", primary: "#DA291C", highlight: "#e86a6a", pattern: "vertical_stripes", patternColor2: "#0a0a0a", patternAlpha: 0.92 },
  { name: "Brentford", flag: "\u{1F41D}", primary: "#e30613", highlight: "#e86060", pattern: "vertical_stripes", patternColor2: "#FFFFFF", patternAlpha: 0.92 },
  { name: "Brighton", flag: "\u{1F54A}\uFE0F", primary: "#0057B8", highlight: "#4090d0", pattern: "vertical_stripes", patternColor2: "#FFFFFF", patternAlpha: 0.92 },
  { name: "Burnley", flag: "\u270B", primary: "#6C1D45", highlight: "#9a4a6a" },
  { name: "Chelsea", flag: "\u{1F535}", primary: "#034694", highlight: "#5a7fc0" },
  { name: "Crystal Palace", flag: "\u{1F985}", primary: "#0055A5", highlight: "#4090d0", pattern: "vertical_stripes", patternColor2: "#E8112D", patternAlpha: 0.92 },
  { name: "Everton", flag: "\u{1F36C}", primary: "#003399", highlight: "#5a72c0" },
  { name: "Fulham", flag: "\u{1F3E0}", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "Leeds United", flag: "\u{1F33C}", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "Liverpool", flag: "\u{1F426}\u200D\u{1F525}", primary: "#C8102E", highlight: "#e06a7a" },
  { name: "Man City", flag: "\u{1F30A}", primary: "#6CABDD", highlight: "#a0d0f0" },
  { name: "Man United", flag: "\u{1F479}", primary: "#DA291C", highlight: "#e86a6a" },
  { name: "Newcastle", flag: "\u{1F426}\u200D\u2B1B", primary: "#1a1a1a", highlight: "#444444", pattern: "vertical_stripes", patternColor2: "#FFFFFF", patternAlpha: 0.92 },
  { name: "Nott'm Forest", flag: "\u{1F333}", primary: "#DD0000", highlight: "#e86060" },
  { name: "Sunderland", flag: "\u{1F408}\u200D\u2B1B", primary: "#EB172B", highlight: "#e86060", pattern: "vertical_stripes", patternColor2: "#FFFFFF", patternAlpha: 0.92 },
  { name: "Tottenham", flag: "\u{1F413}", primary: "#c8c0b8", highlight: "#f5f2ef" },
  { name: "West Ham", flag: "\u2692\uFE0F", primary: "#7A263A", highlight: "#a05a6a" },
  { name: "Wolves", flag: "\u{1F43A}", primary: "#F5A623", highlight: "#f7c45a" },
];

const COLORS = {
  bg: "#0a0e17",
  ground: "#1a1f2e",
  groundLine: "#d4a843",
  ball: "#ffffff",
  score: "#d4a843",
  text: "#e0e0e0",
  dimText: "#6a7080",
  goalPost: "#c0c0c0",
  goalNet: "rgba(255,255,255,0.08)",
};

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export default function SlimeSoccer() {
  const canvasRef = useRef(null);
  const gameRef = useRef(null);
  const keysRef = useRef({});
  const animRef = useRef(null);
  const [scores, setScores] = useState({ p1: 0, p2: 0 });
  const [gameState, setGameState] = useState("menu");
  const [winner, setWinner] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const mobileRef = useRef({ left: false, right: false, jump: false });
  const mobileRef2 = useRef({ left: false, right: false, jump: false });
  const lastDirRef = useRef(null);
  const lastDirRef2 = useRef(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);
  const [gameMode, setGameMode] = useState("1p"); // "1p", "2p", "sim"
  const gameModeRef = useRef("1p");
  const [league, setLeague] = useState("worldcup"); // "worldcup" or "pl"
  const getTeams = (lg) => lg === "pl" ? PL_TEAMS : COUNTRIES;

  const WC_SAVE_KEY = "slime-soccer-wc-tournament";
  const [tournament, setTournament] = useState(() => {
    try {
      const saved = localStorage.getItem(WC_SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Rehydrate team objects from COUNTRIES
        const rehydrate = (name) => COUNTRIES.find(c => c.name === name);
        if (parsed && parsed.groups) {
          parsed.playerTeam = rehydrate(parsed.playerTeam?.name) || parsed.playerTeam;
          parsed.groups.forEach(g => {
            g.teams = g.teams.map(t => rehydrate(t?.name) || t);
            g.matches.forEach(m => {
              m.team1 = rehydrate(m.team1?.name) || m.team1;
              m.team2 = rehydrate(m.team2?.name) || m.team2;
            });
          });
          if (parsed.bracket) {
            const rounds = ["r32", "r16", "qf", "sf", "final"];
            rounds.forEach(r => {
              if (parsed.bracket[r]) {
                parsed.bracket[r] = parsed.bracket[r].map(m => {
                  if (!m) return m;
                  m.team1 = rehydrate(m.team1?.name) || m.team1;
                  m.team2 = rehydrate(m.team2?.name) || m.team2;
                  return m;
                });
              }
            });
          }
          if (parsed.screen === "playing") parsed.screen = parsed.bracket ? "bracket" : "groups";
          return parsed;
        }
      }
    } catch {}
    return null;
  });
  const [showTrophyMenu, setShowTrophyMenu] = useState(false);
  const [showCabinet, setShowCabinet] = useState(false);
  const CABINET_KEY = "slime-soccer-trophy-cabinet";
  const [trophyCabinet, setTrophyCabinet] = useState(() => {
    try { return JSON.parse(localStorage.getItem(CABINET_KEY)) || []; } catch { return []; }
  });
  const saveTrophy = (team) => {
    const entry = { name: team.name, flag: team.flag, date: new Date().toISOString().split("T")[0] };
    const updated = [...trophyCabinet, entry];
    setTrophyCabinet(updated);
    try { localStorage.setItem(CABINET_KEY, JSON.stringify(updated)); } catch {}
  };
  const [showTournamentUI, setShowTournamentUI] = useState(false);
  const showTournamentUIRef = useRef(false);
  const setShowTournamentUIWrapped = (v) => { showTournamentUIRef.current = v; setShowTournamentUI(v); };
  const [resetConfirm, setResetConfirm] = useState(false);
  const tournamentRef = useRef(tournament);
  const updateTournament = (t) => {
    tournamentRef.current = t;
    setTournament(t);
    try {
      if (t) localStorage.setItem(WC_SAVE_KEY, JSON.stringify(t));
      else localStorage.removeItem(WC_SAVE_KEY);
    } catch {}
  };

  // Sim a match: returns [winnerScore, loserScore]
  const simScore = () => {
    const loser = Math.random() < 0.15 ? 0 : Math.random() < 0.3 ? Math.floor(Math.random() * 3) + 1 : Math.floor(Math.random() * 4) + 3;
    return [7, Math.min(loser, 6)];
  };

  const calcStandings = (group) => {
    const s = group.teams.map(t => ({ team: t, p: 0, w: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }));
    const map = {};
    group.teams.forEach((t, i) => { map[t.name] = i; });
    group.matches.filter(m => m.played).forEach(m => {
      const i1 = map[m.team1.name], i2 = map[m.team2.name];
      s[i1].p++; s[i2].p++;
      s[i1].gf += m.score1; s[i1].ga += m.score2;
      s[i2].gf += m.score2; s[i2].ga += m.score1;
      if (m.score1 > m.score2) { s[i1].w++; s[i1].pts += 3; s[i2].l++; }
      else { s[i2].w++; s[i2].pts += 3; s[i1].l++; }
    });
    s.forEach(x => { x.gd = x.gf - x.ga; });
    s.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    return s;
  };

  const initTournament = (playerTeam) => {
    const find = (name) => COUNTRIES.find(c => c.name === name);
    const pickFrom = (names, forced) => {
      // If the player's team is in this playoff pool, force them in
      const match = names.find(n => find(n)?.name === forced?.name);
      if (match) return find(match);
      const opts = names.map(find).filter(Boolean);
      return opts[Math.floor(Math.random() * opts.length)];
    };

    const playoffPools = {
      A4: ["Czechia", "Republic of Ireland", "Denmark", "North Macedonia"],
      B2: ["Wales", "Bosnia and Herzegovina", "Italy", "Northern Ireland"],
      D4: ["Slovakia", "Kosovo", "Turkey", "Romania"],
      F3: ["Ukraine", "Sweden", "Poland", "Albania"],
      I3: ["Bolivia", "Suriname", "Iraq"],
      K2: ["New Caledonia", "Jamaica", "DR Congo"],
    };

    // Real 2026 World Cup groups with playoff spots resolved
    const groupDefs = [
      { name: "A", teams: [find("Mexico"), find("South Africa"), find("South Korea"), pickFrom(playoffPools.A4, playerTeam)] },
      { name: "B", teams: [find("Canada"), pickFrom(playoffPools.B2, playerTeam), find("Qatar"), find("Switzerland")] },
      { name: "C", teams: [find("Brazil"), find("Morocco"), find("Haiti"), find("Scotland")] },
      { name: "D", teams: [find("USA"), find("Paraguay"), find("Australia"), pickFrom(playoffPools.D4, playerTeam)] },
      { name: "E", teams: [find("Germany"), find("Curaçao"), find("Ivory Coast"), find("Ecuador")] },
      { name: "F", teams: [find("Netherlands"), find("Japan"), pickFrom(playoffPools.F3, playerTeam), find("Tunisia")] },
      { name: "G", teams: [find("Belgium"), find("Egypt"), find("Iran"), find("New Zealand")] },
      { name: "H", teams: [find("Spain"), find("Cape Verde"), find("Saudi Arabia"), find("Uruguay")] },
      { name: "I", teams: [find("France"), find("Senegal"), pickFrom(playoffPools.I3, playerTeam), find("Norway")] },
      { name: "J", teams: [find("Argentina"), find("Algeria"), find("Austria"), find("Jordan")] },
      { name: "K", teams: [find("Portugal"), pickFrom(playoffPools.K2, playerTeam), find("Uzbekistan"), find("Colombia")] },
      { name: "L", teams: [find("England"), find("Croatia"), find("Ghana"), find("Panama")] },
    ];

    const groups = groupDefs.map(gd => {
      const teams = gd.teams;
      const matches = [
        { team1: teams[0], team2: teams[1], score1: null, score2: null, played: false, matchday: 1 },
        { team1: teams[2], team2: teams[3], score1: null, score2: null, played: false, matchday: 1 },
        { team1: teams[0], team2: teams[2], score1: null, score2: null, played: false, matchday: 2 },
        { team1: teams[1], team2: teams[3], score1: null, score2: null, played: false, matchday: 2 },
        { team1: teams[0], team2: teams[3], score1: null, score2: null, played: false, matchday: 3 },
        { team1: teams[1], team2: teams[2], score1: null, score2: null, played: false, matchday: 3 },
      ];
      return { name: gd.name, teams, matches };
    });

    let playerGroup = -1;
    groups.forEach((g, i) => { if (g.teams.some(t => t.name === playerTeam.name)) playerGroup = i; });

    const t = {
      screen: "draw",
      playerTeam,
      groups,
      playerGroup,
      matchday: 1,
      bracket: null,
      playerBracketRound: null,
      playerBracketIndex: null,
      eliminated: false,
      champion: false,
    };
    updateTournament(t);
    setGameMode("1p");
    setGameState("menu");
    setShowTournamentUIWrapped(true);
  };

  // Get the 48 WC teams for team selection
  const getWCTeams = () => {
    const find = (name) => COUNTRIES.find(c => c.name === name);
    const fixed = ["Mexico", "South Africa", "South Korea", "Canada", "Qatar", "Switzerland",
      "Brazil", "Morocco", "Haiti", "Scotland", "USA", "Paraguay", "Australia",
      "Germany", "Curaçao", "Ivory Coast", "Ecuador", "Netherlands", "Japan", "Tunisia",
      "Belgium", "Egypt", "Iran", "New Zealand", "Spain", "Cape Verde", "Saudi Arabia", "Uruguay",
      "France", "Senegal", "Norway", "Argentina", "Algeria", "Austria", "Jordan",
      "Portugal", "Uzbekistan", "Colombia", "England", "Croatia", "Ghana", "Panama",
      "Czechia", "Republic of Ireland", "Denmark", "North Macedonia",
      "Wales", "Bosnia and Herzegovina", "Italy", "Northern Ireland",
      "Slovakia", "Kosovo", "Turkey", "Romania",
      "Ukraine", "Sweden", "Poland", "Albania",
      "Bolivia", "Suriname", "Iraq",
      "New Caledonia", "Jamaica", "DR Congo"];
    return fixed.map(find).filter(Boolean);
  };

  const getPlayerMatch = (t) => {
    if (!t) return null;
    const g = t.groups[t.playerGroup];
    return g.matches.find(m => m.matchday === t.matchday && !m.played &&
      (m.team1.name === t.playerTeam.name || m.team2.name === t.playerTeam.name));
  };

  const simTournamentMatchday = (t) => {
    const nt = JSON.parse(JSON.stringify(t));
    // Sim all unplayed matches in current matchday across all groups
    nt.groups.forEach(g => {
      g.matches.filter(m => m.matchday === nt.matchday && !m.played).forEach(m => {
        const [w, l] = simScore();
        if (Math.random() < 0.5) { m.score1 = w; m.score2 = l; }
        else { m.score1 = l; m.score2 = w; }
        m.played = true;
      });
    });
    return nt;
  };

  const getQualifiedTeams = (groups) => {
    const standings = groups.map(g => calcStandings(g));
    const winners = standings.map(s => ({ ...s[0], pos: 1 }));
    const runnersUp = standings.map(s => ({ ...s[1], pos: 2 }));
    const thirds = standings.map(s => ({ ...s[2], pos: 3 }));
    thirds.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    const bestThirds = thirds.slice(0, 8);
    return [...winners, ...runnersUp, ...bestThirds];
  };

  const buildBracket = (qualified, playerTeam) => {
    const shuffled = [...qualified].sort(() => Math.random() - 0.5);
    const r32 = [];
    let playerIdx = -1;
    for (let i = 0; i < 16; i++) {
      const m = { team1: shuffled[i * 2].team, team2: shuffled[i * 2 + 1].team, score1: null, score2: null, played: false };
      if (m.team1.name === playerTeam.name || m.team2.name === playerTeam.name) playerIdx = i;
      r32.push(m);
    }
    return { r32, r16: Array(8).fill(null), qf: Array(4).fill(null), sf: Array(2).fill(null), final: Array(1).fill(null), playerIdx, round: "r32" };
  };

  const advanceBracketRound = (bracket) => {
    const rounds = ["r32", "r16", "qf", "sf", "final"];
    const ri = rounds.indexOf(bracket.round);
    const cur = bracket[bracket.round];
    const nextRound = rounds[ri + 1];
    if (!nextRound) return bracket;
    const next = [];
    for (let i = 0; i < cur.length; i += 2) {
      const w1 = cur[i].score1 > cur[i].score2 ? cur[i].team1 : cur[i].team2;
      const w2 = cur[i + 1].score1 > cur[i + 1].score2 ? cur[i + 1].team1 : cur[i + 1].team2;
      next.push({ team1: w1, team2: w2, score1: null, score2: null, played: false });
    }
    bracket[nextRound] = next;
    // Find player in next round
    let pIdx = -1;
    next.forEach((m, i) => {
      if (m.team1.name === bracket._playerTeam || m.team2.name === bracket._playerTeam) pIdx = i;
    });
    bracket.playerIdx = pIdx;
    bracket.round = nextRound;
    return bracket;
  };

  const startTournamentMatch = (t, team1, team2) => {
    // Ensure player is always P1
    const isP1 = team1.name === t.playerTeam.name;
    setP1Country(isP1 ? team1 : team2);
    setP2Country(isP1 ? team2 : team1);
    initGame();
    countdownRef.current = 210;
    setGameState("countdown");
    pausedRef.current = false;
    setPaused(false);
    goalCelebRef.current = null;
  };

  const scoreColor = (country) => {
    const hex = country.primary.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.25 ? country.highlight : country.primary;
  };

  // Persistent stats
  const STATS_KEY = "slime-soccer-stats";
  const defaultStats = { wins: 0, losses: 0, cleanSheets: 0, currentStreak: 0, longestStreak: 0, goalsFor: 0, goalsAgainst: 0 };
  const [stats, setStats] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STATS_KEY));
      return saved ? { ...defaultStats, ...saved } : { ...defaultStats };
    } catch { return { ...defaultStats }; }
  });
  const saveStats = (newStats) => {
    setStats(newStats);
    try { localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch {}
  };
  const goalCelebRef = useRef(null); // { scorer, country, timer }
  const screenShakeRef = useRef(0);
  const countdownRef = useRef(0);
  const [canvasScale, setCanvasScale] = useState(1);
  const [isLandscape, setIsLandscape] = useState(false);
  const containerRef = useRef(null);
  const gameStateRef = useRef(gameState);
  const [initialCountries] = useState(() => {
    const i = Math.floor(Math.random() * COUNTRIES.length);
    let j;
    do { j = Math.floor(Math.random() * COUNTRIES.length); } while (j === i);
    return [COUNTRIES[i], COUNTRIES[j]];
  });
  const [p1Country, setP1Country] = useState(initialCountries[0]);
  const [p2Country, setP2Country] = useState(initialCountries[1]);
  const p1CountryRef = useRef(p1Country);
  const p2CountryRef = useRef(p2Country);

  useEffect(() => { p1CountryRef.current = p1Country; }, [p1Country]);
  useEffect(() => { p2CountryRef.current = p2Country; }, [p2Country]);

  const goalTop = G.GROUND_Y - G.GOAL_HEIGHT;

  const makeBall = useCallback(() => ({
    x: G.WIDTH / 2 + (Math.random() - 0.5) * 20,
    y: 140 + Math.random() * 30,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -1 - Math.random() * 0.5,
    r: G.BALL_RADIUS,
  }), []);

  const makeSlime = useCallback((x, isP1) => ({
    x, y: G.GROUND_Y, vx: 0, vy: 0, r: G.SLIME_RADIUS, grounded: true, isP1,
  }), []);

  const aiStyleRef = useRef({ p1: null, p2: null });

  const randomAIStyle = () => ({
    offsetX: (Math.random() - 0.5) * 40,      // positioning bias: -20 to +20
    aggression: 0.85 + Math.random() * 0.15,     // how far forward they push: 0.85-1.0
    speedMult: 0.86 + Math.random() * 0.07,    // speed variance: 0.86-0.93
    jumpEagerness: 60 + Math.random() * 35,     // jump trigger distance: 60-95
    guardDist: 30 + Math.random() * 25,         // how far from goal they guard: 30-55
  });

  const initGame = useCallback(() => {
    aiStyleRef.current = { p1: randomAIStyle(), p2: randomAIStyle() };
    gameRef.current = {
      p1: makeSlime(250, true),
      p2: makeSlime(550, false),
      ball: makeBall(),
      scores: { p1: 0, p2: 0 },
      freeze: 0,
    };
    setScores({ p1: 0, p2: 0 });
    setWinner(null);
  }, [makeSlime, makeBall]);

  const runAI = useCallback((slime, ball, isP1) => {
    const style = isP1 ? aiStyleRef.current.p1 : aiStyleRef.current.p2;
    if (!style) return;

    const ownGoalX = isP1 ? G.GOAL_WIDTH : G.WIDTH - G.GOAL_WIDTH;
    const ballOnMySide = isP1 ? (ball.x < G.WIDTH / 2) : (ball.x > G.WIDTH / 2);
    const minX = G.GOAL_WIDTH + slime.r;
    const maxX = G.WIDTH - G.GOAL_WIDTH - slime.r;

    // Attack side: P1 should be LEFT of ball to hit it RIGHT, P2 opposite
    const onCorrectSide = isP1 ? (slime.x < ball.x - 10) : (slime.x > ball.x + 10);
    const onWrongSide = isP1 ? (slime.x > ball.x - 5) : (slime.x < ball.x + 5);

    // Zones
    const inDefensiveZone = isP1 ? (ball.x < G.WIDTH * 0.35) : (ball.x > G.WIDTH * 0.65);
    const ballMovingToOwnGoal = isP1 ? (ball.vx < -1.5) : (ball.vx > 1.5);
    const ballAirborne = ball.y < G.GROUND_Y - 40;
    const distToBall = Math.abs(ball.x - slime.x);
    const distToBallY = slime.y - ball.y;

    let targetX;
    let suppressJump = false;
    const off = style.offsetX;

    // Predict where ball will land
    let predX = ball.x;
    let predTime = 999;
    if (ball.y < G.GROUND_Y - 10) {
      let simX = ball.x, simY = ball.y, simVx = ball.vx, simVy = ball.vy;
      for (let i = 0; i < 80; i++) {
        simVy += G.GRAVITY;
        simX += simVx;
        simY += simVy;
        if (simX < 0 || simX > G.WIDTH) simVx *= -1;
        if (simY >= G.GROUND_Y) { predX = simX; predTime = i; break; }
      }
    }
    predX = clamp(predX, minX, maxX);

    // Desperation save: ball is BEHIND us heading toward goal
    const ballBehind = isP1 ? (ball.x < slime.x - 15) : (ball.x > slime.x + 15);
    const ballInDanger = isP1 ? (ball.x < G.WIDTH * 0.25) : (ball.x > G.WIDTH * 0.75);
    const desperationSave = ballBehind && ballAirborne && ballInDanger && distToBall < 140;

    if (desperationSave) {
      // Chase ball - jump to deflect it ANY direction (better than letting it in)
      targetX = ball.x;
      if (distToBall < 55 && slime.grounded && ball.y < slime.y - 10) {
        slime.vy = G.JUMP_FORCE;
        slime.grounded = false;
      }
    }
    // WRONG SIDE: Always go around, never engage
    else if (onWrongSide && distToBall < 120) {
      // Go AROUND the ball to the correct side
      const clearance = 60 + (ballAirborne ? 20 : 0);
      targetX = isP1 ? ball.x - clearance : ball.x + clearance;
      targetX = clamp(targetX, minX, maxX);
      suppressJump = true;
    }
    // Ball on my side, I'm on correct side - ATTACK
    else if (ballOnMySide && onCorrectSide) {
      const approach = 25 * style.aggression;
      targetX = isP1 ? predX + approach + off : predX - approach + off;
    }
    // Ball on my side, wrong side but far enough - go around
    else if (ballOnMySide && onWrongSide) {
      const clearance = 55;
      targetX = isP1 ? ball.x - clearance : ball.x + clearance;
      targetX = clamp(targetX, minX, maxX);
      suppressJump = true;
    }
    // Ball on my side, roughly under it
    else if (ballOnMySide) {
      // Position to attack side
      targetX = isP1 ? predX + 20 + off : predX - 20 + off;
    }
    // Ball on opponent's side moving away - guard
    else if (!ballOnMySide && (isP1 ? ball.vx > 0 : ball.vx < 0)) {
      targetX = isP1 ? ownGoalX + slime.r + style.guardDist : ownGoalX - slime.r - style.guardDist;
    }
    // Ball on opponent's side but coming back - push up to midfield
    else {
      const chase = 15 * style.aggression;
      targetX = clamp(isP1 ? ball.x + chase + off : ball.x - chase + off, minX, maxX);
    }

    targetX = clamp(targetX, minX, maxX);

    const deadzone = 14;
    const speed = G.SLIME_SPEED * style.speedMult;
    const dist = targetX - slime.x;
    if (Math.abs(dist) > deadzone) {
      // Ease into target: full speed when far, reduced when close
      const rampDist = 40;
      const factor = Math.min(1, Math.abs(dist) / rampDist);
      slime.vx = Math.sign(dist) * speed * (0.4 + 0.6 * factor);
    } else {
      slime.vx = 0;
    }

    // Jump: ONLY when on correct side and well positioned to hit forward
    const absDx = Math.abs(ball.x - slime.x);
    const canJump = !suppressJump && slime.grounded && ball.y < slime.y - 30 && ball.y > 80;
    if (canJump && absDx < style.jumpEagerness && onCorrectSide) {
      // Make sure we're actually going to hit the ball forward
      const wouldHitForward = isP1 ? (slime.x < ball.x) : (slime.x > ball.x);
      if (wouldHitForward) {
        slime.vy = G.JUMP_FORCE;
        slime.grounded = false;
      }
    }
  }, []);

  const handleGoal = useCallback((scorer) => {
    const game = gameRef.current;
    const ballY = game.ball.y;

    game.scores[scorer]++;
    setScores({ ...game.scores });

    const country = scorer === "p1" ? p1CountryRef.current : p2CountryRef.current;
    goalCelebRef.current = { scorer, country, timer: 90 };
    screenShakeRef.current = 12;

    if (game.scores[scorer] >= G.WINNING_SCORE) {
      game.ball = makeBall();
      game.freeze = 90;

      // Record stats (1P mode only)
      if (gameModeRef.current === "1p") {
        const p1Score = game.scores.p1;
        const p2Score = game.scores.p2;
        const won = scorer === "p1";
        setStats(prev => {
          const s = { ...prev };
          s.goalsFor += p1Score;
          s.goalsAgainst += p2Score;
          if (won) {
            s.wins++;
            s.currentStreak++;
            if (s.currentStreak > s.longestStreak) s.longestStreak = s.currentStreak;
            if (p2Score === 0) s.cleanSheets++;
          } else {
            s.losses++;
            s.currentStreak = 0;
          }
          try { localStorage.setItem(STATS_KEY, JSON.stringify(s)); } catch {}
          return s;
        });
      }

      setTimeout(() => {
        goalCelebRef.current = null;
        setWinner(scorer);
        const t = tournamentRef.current;
        if (t && t.screen === "playing") {
          const finalScores = { p1: game.scores.p1, p2: game.scores.p2 };
          // Skip gameover screen - process tournament result directly
          const nt = JSON.parse(JSON.stringify(t));
            if (!nt.bracket) {
              // Group stage: record result
              const g = nt.groups[nt.playerGroup];
              const pm = g.matches.find(m => m.matchday === nt.matchday && !m.played &&
                (m.team1.name === nt.playerTeam.name || m.team2.name === nt.playerTeam.name));
              if (pm) {
                const playerIsT1 = pm.team1.name === nt.playerTeam.name;
                pm.score1 = playerIsT1 ? finalScores.p1 : finalScores.p2;
                pm.score2 = playerIsT1 ? finalScores.p2 : finalScores.p1;
                pm.played = true;
              }
              // Sim remaining matches this matchday
              nt.groups.forEach(gr => {
                gr.matches.filter(m => m.matchday === nt.matchday && !m.played).forEach(m => {
                  const [w, l] = simScore();
                  if (Math.random() < 0.5) { m.score1 = w; m.score2 = l; }
                  else { m.score1 = l; m.score2 = w; }
                  m.played = true;
                });
              });
              nt.screen = "groupResult";
              if (nt.matchday >= 3) {
                // Check if all group matches done
                const allDone = nt.groups.every(g => g.matches.every(m => m.played));
                if (allDone) nt.screen = "qualify";
              }
              updateTournament(nt);
            } else {
              // Knockout: record result
              const round = nt.bracket.round;
              const m = nt.bracket[round][nt.bracket.playerIdx];
              const playerIsT1 = m.team1.name === nt.playerTeam.name;
              m.score1 = playerIsT1 ? finalScores.p1 : finalScores.p2;
              m.score2 = playerIsT1 ? finalScores.p2 : finalScores.p1;
              m.played = true;
              const playerWon = (playerIsT1 && m.score1 > m.score2) || (!playerIsT1 && m.score2 > m.score1);
              // Sim other knockout matches
              nt.bracket[round].forEach((km, ki) => {
                if (!km.played) {
                  const [w, l] = simScore();
                  if (Math.random() < 0.5) { km.score1 = w; km.score2 = l; }
                  else { km.score1 = l; km.score2 = w; }
                  km.played = true;
                }
              });
              if (!playerWon) {
                nt.screen = "eliminated";
                nt.eliminated = true;
              } else if (round === "final") {
                nt.screen = "champion";
                nt.champion = true;
                saveTrophy(nt.playerTeam);
              } else {
                nt.bracket._playerTeam = nt.playerTeam.name;
                const newBracket = advanceBracketRound(nt.bracket);
                nt.bracket = newBracket;
                nt.screen = "bracket";
              }
              updateTournament(nt);
            }
            setGameState("menu");
            setShowTournamentUIWrapped(true);
        } else {
          setGameState("gameover");
        }
      }, 1500);
      setGameState("scored");
      return;
    }

    game.ball = makeBall();
    game.p1 = makeSlime(250, true);
    game.p2 = makeSlime(550, false);
    game.freeze = 90;
    keysRef.current = {};
    lastDirRef.current = null;
    lastDirRef2.current = null;
    setGameState("scored");
    setTimeout(() => setGameState("playing"), 1500);
  }, [makeBall, makeSlime]);

  const update = useCallback(() => {
    const game = gameRef.current;
    if (!game || pausedRef.current) return;
    if (game.freeze > 0) {
      game.freeze--;
      if (goalCelebRef.current) {
        goalCelebRef.current.timer--;
        if (goalCelebRef.current.timer <= 0) goalCelebRef.current = null;
      }
      return;
    }

    const { p1, p2, ball } = game;
    const keys = keysRef.current;
    const mc = mobileRef.current;

    // P1 controls: WASD + arrows (1P) or WASD only (2P) + mobile; AI in sim
    if (gameModeRef.current === "sim") {
      runAI(p1, ball, true);
    } else {
      const p1Left = keys["a"] || mc.left || (gameModeRef.current === "1p" && keys["arrowleft"]);
      const p1Right = keys["d"] || mc.right || (gameModeRef.current === "1p" && keys["arrowright"]);
      if (p1Left && p1Right) {
        p1.vx = lastDirRef.current === "right" ? G.SLIME_SPEED : -G.SLIME_SPEED;
      } else if (p1Left) {
        p1.vx = -G.SLIME_SPEED;
      } else if (p1Right) {
        p1.vx = G.SLIME_SPEED;
      } else {
        p1.vx = 0;
      }
      if ((keys["w"] || mc.jump || (gameModeRef.current === "1p" && keys["arrowup"])) && p1.grounded) {
        p1.vy = G.JUMP_FORCE;
        p1.grounded = false;
      }
    }

    // P2: AI or human controls
    if (gameModeRef.current === "2p") {
      const mc2 = mobileRef2.current;
      const p2Left = keys["arrowleft"] || mc2.left;
      const p2Right = keys["arrowright"] || mc2.right;
      if (p2Left && p2Right) {
        p2.vx = lastDirRef2.current === "right" ? G.SLIME_SPEED : -G.SLIME_SPEED;
      } else if (p2Left) {
        p2.vx = -G.SLIME_SPEED;
      } else if (p2Right) {
        p2.vx = G.SLIME_SPEED;
      } else {
        p2.vx = 0;
      }
      if ((keys["arrowup"] || mc2.jump) && p2.grounded) {
        p2.vy = G.JUMP_FORCE;
        p2.grounded = false;
      }
    } else {
      runAI(p2, ball, false);
    }

    [p1, p2].forEach(s => {
      s.vy += G.GRAVITY;
      s.x += s.vx;
      s.y += s.vy;
      if (s.y >= G.GROUND_Y) { s.y = G.GROUND_Y; s.vy = 0; s.grounded = true; }
      s.x = clamp(s.x, G.GOAL_WIDTH + s.r, G.WIDTH - G.GOAL_WIDTH - s.r);
    });

    ball.vy += G.GRAVITY;
    ball.x += ball.vx;
    ball.y += ball.vy;

    const spd = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    if (spd > G.MAX_BALL_SPEED) {
      ball.vx = (ball.vx / spd) * G.MAX_BALL_SPEED;
      ball.vy = (ball.vy / spd) * G.MAX_BALL_SPEED;
    }

    // Goal detection - ball CENTER must be inside goal area and below crossbar
    if (ball.x <= G.GOAL_WIDTH && ball.y > goalTop + G.GOAL_POST_W && ball.y < G.GROUND_Y) {
      handleGoal("p2"); return;
    }
    if (ball.x >= G.WIDTH - G.GOAL_WIDTH && ball.y > goalTop + G.GOAL_POST_W && ball.y < G.GROUND_Y) {
      handleGoal("p1"); return;
    }

    // Walls
    if (ball.x - ball.r < 0) { ball.x = ball.r; ball.vx = Math.abs(ball.vx) * G.BALL_BOUNCE; }
    if (ball.x + ball.r > G.WIDTH) { ball.x = G.WIDTH - ball.r; ball.vx = -Math.abs(ball.vx) * G.BALL_BOUNCE; }
    if (ball.y - ball.r < 0) { ball.y = ball.r; ball.vy = Math.abs(ball.vy) * G.BALL_BOUNCE; }
    if (ball.y + ball.r >= G.GROUND_Y) {
      ball.y = G.GROUND_Y - ball.r;
      ball.vy = -Math.abs(ball.vy) * G.BALL_BOUNCE;
      ball.vx *= 0.92;
      if (Math.abs(ball.vy) < 1.5) ball.vy = 0;
    }

    // Goal post collisions - only block ball above goal opening
    // Left goal crossbar
    if (ball.x - ball.r < G.GOAL_WIDTH + G.GOAL_POST_W &&
        ball.y + ball.r > goalTop - G.GOAL_POST_W && ball.y + ball.r < goalTop + G.GOAL_POST_W &&
        ball.x + ball.r > 0 && ball.vy > 0) {
      ball.y = goalTop - G.GOAL_POST_W - ball.r;
      ball.vy = -Math.abs(ball.vy) * G.BALL_BOUNCE;
    }
    // Left goal front post - only ABOVE goal opening
    if (ball.x + ball.r > G.GOAL_WIDTH - G.GOAL_POST_W && ball.x - ball.r < G.GOAL_WIDTH + G.GOAL_POST_W &&
        ball.y + ball.r > 0 && ball.y + ball.r < goalTop) {
      if (ball.vx < 0) { ball.x = G.GOAL_WIDTH + G.GOAL_POST_W + ball.r; ball.vx = Math.abs(ball.vx) * G.BALL_BOUNCE; }
    }

    // Right goal crossbar
    if (ball.x + ball.r > G.WIDTH - G.GOAL_WIDTH - G.GOAL_POST_W &&
        ball.y + ball.r > goalTop - G.GOAL_POST_W && ball.y + ball.r < goalTop + G.GOAL_POST_W &&
        ball.x - ball.r < G.WIDTH && ball.vy > 0) {
      ball.y = goalTop - G.GOAL_POST_W - ball.r;
      ball.vy = -Math.abs(ball.vy) * G.BALL_BOUNCE;
    }
    // Right goal front post - only ABOVE goal opening
    if (ball.x - ball.r < G.WIDTH - G.GOAL_WIDTH + G.GOAL_POST_W && ball.x + ball.r > G.WIDTH - G.GOAL_WIDTH - G.GOAL_POST_W &&
        ball.y + ball.r > 0 && ball.y + ball.r < goalTop) {
      if (ball.vx > 0) { ball.x = G.WIDTH - G.GOAL_WIDTH - G.GOAL_POST_W - ball.r; ball.vx = -Math.abs(ball.vx) * G.BALL_BOUNCE; }
    }

    // Ball-slime collision
    [p1, p2].forEach(s => {
      const sx = s.x, sy = s.y - 10;
      const dx = ball.x - sx, dy = ball.y - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = s.r + ball.r;

      if (dist < minDist && dy <= 10) {
        const nx = dx / dist, ny = dy / dist;
        const overlap = minDist - dist;
        ball.x += nx * overlap;
        ball.y += ny * overlap;

        const dvx = ball.vx - s.vx;
        const dvy = ball.vy - s.vy;
        const dot = dvx * nx + dvy * ny;

        ball.vx = (ball.vx - dot * nx) * G.BALL_SLIME_BOUNCE + s.vx * 0.35;
        ball.vy = (ball.vy - dot * ny) * G.BALL_SLIME_BOUNCE + s.vy * 0.35;
        if (ball.vy > -2) ball.vy = -3;
      }
    });
  }, [runAI, handleGoal, goalTop]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const game = gameRef.current;
    const c1 = p1CountryRef.current;
    const c2 = p2CountryRef.current;

    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(0, 0, G.WIDTH, G.HEIGHT);

    // Screen shake
    ctx.save();
    if (screenShakeRef.current > 0) {
      const intensity = screenShakeRef.current;
      ctx.translate((Math.random() - 0.5) * intensity, (Math.random() - 0.5) * intensity);
      screenShakeRef.current = Math.max(0, intensity - 0.8);
    }

    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, G.GROUND_Y, G.WIDTH, G.HEIGHT - G.GROUND_Y);

    ctx.strokeStyle = COLORS.groundLine;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(G.GOAL_WIDTH, G.GROUND_Y);
    ctx.lineTo(G.WIDTH - G.GOAL_WIDTH, G.GROUND_Y);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(G.WIDTH / 2, G.GROUND_Y);
    ctx.lineTo(G.WIDTH / 2, G.GROUND_Y - 200);
    ctx.stroke();
    ctx.setLineDash([]);

    if (!game) return;

    const drawGoal = (isLeft) => {
      const gx = isLeft ? 0 : G.WIDTH - G.GOAL_WIDTH;
      const postX = isLeft ? G.GOAL_WIDTH : G.WIDTH - G.GOAL_WIDTH;

      ctx.fillStyle = COLORS.goalNet;
      ctx.fillRect(gx, goalTop, G.GOAL_WIDTH, G.GOAL_HEIGHT);

      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let nx = gx + 10; nx < gx + G.GOAL_WIDTH; nx += 10) {
        ctx.beginPath(); ctx.moveTo(nx, goalTop); ctx.lineTo(nx, G.GROUND_Y); ctx.stroke();
      }
      for (let ny = goalTop + 10; ny < G.GROUND_Y; ny += 10) {
        ctx.beginPath(); ctx.moveTo(gx, ny); ctx.lineTo(gx + G.GOAL_WIDTH, ny); ctx.stroke();
      }

      ctx.fillStyle = COLORS.goalPost;
      ctx.shadowColor = "rgba(255,255,255,0.3)";
      ctx.shadowBlur = 4;
      ctx.fillRect(postX - G.GOAL_POST_W / 2, goalTop, G.GOAL_POST_W, G.GOAL_HEIGHT);
      if (isLeft) {
        ctx.fillRect(0, goalTop - G.GOAL_POST_W / 2, G.GOAL_WIDTH + G.GOAL_POST_W / 2, G.GOAL_POST_W);
      } else {
        ctx.fillRect(G.WIDTH - G.GOAL_WIDTH - G.GOAL_POST_W / 2, goalTop - G.GOAL_POST_W / 2, G.GOAL_WIDTH + G.GOAL_POST_W / 2, G.GOAL_POST_W);
      }
      ctx.shadowBlur = 0;
    };

    drawGoal(true);
    drawGoal(false);

    const drawSlime = (s, country) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, Math.PI, 0, false);
      ctx.closePath();
      ctx.clip();

      // Base gradient
      const grad = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
      grad.addColorStop(0, country.highlight);
      grad.addColorStop(1, country.primary);
      ctx.fillStyle = grad;
      ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);

      // Checkerboard pattern overlay (angled)
      if (country.pattern === "checkerboard") {
        const size = 18;
        const angle = -0.15;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        const startX = -s.r - size * 2;
        const startY = -s.r - size * 2;
        const cols = Math.ceil((s.r * 2 + size * 4) / size);
        const rows = Math.ceil((s.r * 2 + size * 4) / size);
        ctx.fillStyle = country.patternColor2 || "#cc0000";
        ctx.globalAlpha = 0.85;
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            if ((row + col) % 2 === 0) {
              ctx.fillRect(startX + col * size, startY + row * size, size, size);
            }
          }
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheen = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheen.addColorStop(0, country.highlight + "55");
        sheen.addColorStop(1, "transparent");
        ctx.fillStyle = sheen;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Wavy stripes pattern overlay
      if (country.pattern === "wavy_stripes") {
        const stripeH = 7;
        const colors = [country.patternColor2, country.patternColor3];
        const startY = s.y - s.r;
        const numStripes = Math.ceil(s.r / stripeH);
        for (let i = 0; i < numStripes; i++) {
          const y = startY + i * stripeH;
          ctx.fillStyle = colors[i % 2];
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.moveTo(s.x - s.r, y);
          for (let px = s.x - s.r; px <= s.x + s.r; px += 2) {
            const wave = Math.sin(-(px - s.x) * 0.08 + i * 0.6) * 3;
            ctx.lineTo(px, y + wave);
          }
          for (let px = s.x + s.r; px >= s.x - s.r; px -= 2) {
            const wave = Math.sin(-(px - s.x) * 0.08 + i * 0.6) * 3;
            ctx.lineTo(px, y + stripeH + wave);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1.0;
        const sheen2 = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheen2.addColorStop(0, country.highlight + "44");
        sheen2.addColorStop(1, "transparent");
        ctx.fillStyle = sheen2;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Vertical stripes pattern overlay (angled)
      if (country.pattern === "vertical_stripes") {
        const stripeW = 18;
        const angle = -0.15;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        const startX = -s.r - 20;
        const numStripes = Math.ceil((s.r * 2 + 40) / stripeW);
        for (let i = 0; i < numStripes; i++) {
          if (i % 2 === 0) {
            const sx = startX + i * stripeW;
            // Dark edges
            ctx.fillStyle = "rgba(0,0,0,0.25)";
            ctx.globalAlpha = 1;
            ctx.fillRect(sx - 1, -s.r, 2, s.r * 2);
            ctx.fillRect(sx + stripeW - 1, -s.r, 2, s.r * 2);
            ctx.fillStyle = country.patternColor2;
            ctx.globalAlpha = country.patternAlpha || 0.75;
            ctx.fillRect(sx, -s.r, stripeW, s.r * 2);
          }
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheen3 = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheen3.addColorStop(0, country.highlight + "44");
        sheen3.addColorStop(1, "transparent");
        ctx.fillStyle = sheen3;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Diagonal stripes pattern (e.g. Germany flag colors)
      if (country.pattern === "diagonal_stripes") {
        const colors = country.patternColors || ["#000", "#f00", "#ff0"];
        const stripeW = 8;
        const angle = 0.35;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        const totalW = stripeW * colors.length;
        const backOffset = s.isP1 ? -10 : 10;
        const startX = -totalW / 2 + backOffset;
        for (let c = 0; c < colors.length; c++) {
          ctx.fillStyle = colors[c];
          ctx.globalAlpha = 0.9;
          ctx.fillRect(startX + c * stripeW, -s.r, stripeW, s.r * 2);
        }
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheen4 = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheen4.addColorStop(0, country.highlight + "55");
        sheen4.addColorStop(1, "transparent");
        ctx.fillStyle = sheen4;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Concentric circles (Mexico)
      if (country.pattern === "concentric_circles") {
        const cx = s.x - 10, cy = s.y - s.r * 0.35;
        const radii = [38, 26, 14];
        ctx.globalAlpha = 0.6;
        radii.forEach(r => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = country.patternColor2;
          ctx.lineWidth = 5;
          ctx.stroke();
        });
        ctx.globalAlpha = 1.0;
        const sheenC = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenC.addColorStop(0, country.highlight + "55");
        sheenC.addColorStop(1, "transparent");
        ctx.fillStyle = sheenC;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Tiger stripes (South Korea)
      if (country.pattern === "tiger_stripes") {
        const angle = -0.2;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        ctx.fillStyle = country.patternColor2;
        ctx.globalAlpha = 0.7;
        const stripes = [-30, -14, 2, 18, 34];
        stripes.forEach(sx => {
          ctx.beginPath();
          ctx.moveTo(sx, -s.r);
          ctx.lineTo(sx + 6, -s.r);
          ctx.lineTo(sx + 10, -s.r * 0.3);
          ctx.lineTo(sx + 4, -s.r * 0.1);
          ctx.lineTo(sx + 9, s.r * 0.3);
          ctx.lineTo(sx + 5, s.r * 0.5);
          ctx.lineTo(sx + 8, s.r);
          ctx.lineTo(sx + 2, s.r);
          ctx.lineTo(sx - 1, s.r * 0.5);
          ctx.lineTo(sx + 3, s.r * 0.3);
          ctx.lineTo(sx - 2, -s.r * 0.1);
          ctx.lineTo(sx + 2, -s.r * 0.3);
          ctx.closePath();
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheenT = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenT.addColorStop(0, country.highlight + "44");
        sheenT.addColorStop(1, "transparent");
        ctx.fillStyle = sheenT;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Diagonal split (Canada)
      if (country.pattern === "diagonal_split") {
        const angle = -0.15;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        ctx.fillStyle = country.patternColor2;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -s.r * 1.5);
        ctx.lineTo(-s.r * 1.5, -s.r * 1.5);
        ctx.lineTo(-s.r * 1.5, s.r * 1.5);
        ctx.lineTo(0, s.r * 1.5);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheenD = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenD.addColorStop(0, country.highlight + "44");
        sheenD.addColorStop(1, "transparent");
        ctx.fillStyle = sheenD;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Zigzag (Qatar)
      if (country.pattern === "zigzag") {
        const angle = -0.15;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        ctx.fillStyle = country.patternColor2;
        ctx.globalAlpha = 0.65;
        const zigW = 12, zigH = 10;
        ctx.beginPath();
        ctx.moveTo(-zigW, -s.r * 1.5);
        for (let y = -s.r * 1.5; y < s.r * 1.5; y += zigH) {
          ctx.lineTo(zigW, y + zigH / 2);
          ctx.lineTo(-zigW, y + zigH);
        }
        ctx.lineTo(zigW + 8, s.r * 1.5);
        for (let y = s.r * 1.5; y > -s.r * 1.5; y -= zigH) {
          ctx.lineTo(-zigW + 8, y - zigH / 2);
          ctx.lineTo(zigW + 8, y - zigH);
        }
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheenZ = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenZ.addColorStop(0, country.highlight + "44");
        sheenZ.addColorStop(1, "transparent");
        ctx.fillStyle = sheenZ;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Leopard spots (Ivory Coast)
      if (country.pattern === "leopard_spots") {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = country.patternColor2;
        const spots = [
          { x: -20, y: -30, r: 8 }, { x: 15, y: -25, r: 7 }, { x: -8, y: -12, r: 9 },
          { x: 22, y: -8, r: 6 }, { x: -28, y: -10, r: 7 }, { x: 5, y: -35, r: 6 },
          { x: 30, y: -22, r: 5 }, { x: -15, y: -42, r: 7 }, { x: 10, y: -45, r: 5 },
          { x: -32, y: -28, r: 6 }, { x: 0, y: -22, r: 5 }, { x: -22, y: -45, r: 5 },
        ];
        spots.forEach(sp => {
          // Outer ring
          ctx.beginPath();
          ctx.arc(s.x + sp.x, s.y + sp.y, sp.r, 0, Math.PI * 2);
          ctx.fill();
          // Inner lighter cutout
          ctx.globalAlpha = 0.3;
          ctx.fillStyle = country.primary;
          ctx.beginPath();
          ctx.arc(s.x + sp.x, s.y + sp.y, sp.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = country.patternColor2;
          ctx.globalAlpha = 0.55;
        });
        ctx.globalAlpha = 1.0;
        const sheenL = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenL.addColorStop(0, country.highlight + "55");
        sheenL.addColorStop(1, "transparent");
        ctx.fillStyle = sheenL;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Thin stripes (Spain - 5 slim yellow lines)
      if (country.pattern === "thin_stripes") {
        const stripeW = 3;
        const angle = -0.12;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        ctx.fillStyle = country.patternColor2;
        ctx.globalAlpha = 0.7;
        const positions = [-30, -18, -6, 6, 18];
        positions.forEach(sx => {
          ctx.fillRect(sx - 1, -s.r, 2, s.r * 2);
        });
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheenS = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenS.addColorStop(0, country.highlight + "44");
        sheenS.addColorStop(1, "transparent");
        ctx.fillStyle = sheenS;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      // Cross pattern (Norway)
      if (country.pattern === "cross") {
        const angle = -0.2;
        ctx.save();
        ctx.translate(s.x, s.y - s.r / 2);
        ctx.rotate(angle);
        const hW = 10, vW = 10;
        const outlineW = 2;
        // White outline
        ctx.fillStyle = country.patternColor3 || "#ffffff";
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-s.r * 1.5, -(hW / 2 + outlineW), s.r * 3, hW + outlineW * 2);
        ctx.fillRect(-(vW / 2 + outlineW) - 8, -s.r * 1.5, vW + outlineW * 2, s.r * 3);
        // Blue cross
        ctx.fillStyle = country.patternColor2;
        ctx.globalAlpha = 0.85;
        ctx.fillRect(-s.r * 1.5, -hW / 2, s.r * 3, hW);
        ctx.fillRect(-vW / 2 - 8, -s.r * 1.5, vW, s.r * 3);
        ctx.globalAlpha = 1.0;
        ctx.restore();
        const sheenN = ctx.createRadialGradient(s.x - 8, s.y - 18, 4, s.x, s.y, s.r);
        sheenN.addColorStop(0, country.highlight + "44");
        sheenN.addColorStop(1, "transparent");
        ctx.fillStyle = sheenN;
        ctx.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r);
      }

      ctx.restore();

      // Flag badge on back of body
      ctx.save();
      const badgeDir = s.isP1 ? -1 : 1;
      const bx = s.x + badgeDir * 14;
      const by = s.y - 14;
      ctx.translate(bx, by);
      ctx.rotate(badgeDir * -0.3);
      ctx.font = "18px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillText(country.flag, 0, 0);
      ctx.shadowColor = "transparent";
      ctx.restore();

      const eyeDir = s.isP1 ? 1 : -1;
      const ex = s.x + eyeDir * 14, ey = s.y - 22;
      ctx.shadowColor = "rgba(0,0,0,0.7)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI * 2); ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      if (game.ball) {
        const dx = game.ball.x - ex, dy = game.ball.y - ey;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        ctx.fillStyle = "#111";
        ctx.beginPath(); ctx.arc(ex + (dx / d) * 3, ey + (dy / d) * 3, 3.5, 0, Math.PI * 2); ctx.fill();
      }
    };

    drawSlime(game.p1, c1);
    drawSlime(game.p2, c2);

    // Ball
    const b = game.ball;
    ctx.save();
    // Track ball rotation based on horizontal velocity
    if (!b._rot) b._rot = 0;
    b._rot += (b.vx || 0) * 0.06;
    const bg = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, b.r);
    bg.addColorStop(0, "#fff"); bg.addColorStop(1, "#ccc");
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    // Pentagon pattern
    ctx.save();
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.clip();
    ctx.translate(b.x, b.y);
    ctx.rotate(b._rot);
    ctx.fillStyle = "rgba(60,60,60,0.2)";
    const pentR = b.r * 0.42;
    for (let p = 0; p < 5; p++) {
      const pa = (p / 5) * Math.PI * 2 - Math.PI / 2;
      const pcx = Math.cos(pa) * b.r * 0.62;
      const pcy = Math.sin(pa) * b.r * 0.62;
      ctx.beginPath();
      for (let v = 0; v < 5; v++) {
        const va = (v / 5) * Math.PI * 2 - Math.PI / 2;
        const vx = pcx + Math.cos(va) * pentR;
        const vy = pcy + Math.sin(va) * pentR;
        v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
      }
      ctx.closePath(); ctx.fill();
    }
    // Center pentagon
    ctx.beginPath();
    for (let v = 0; v < 5; v++) {
      const va = (v / 5) * Math.PI * 2 - Math.PI / 2;
      const vx = Math.cos(va) * pentR;
      const vy = Math.sin(va) * pentR;
      v === 0 ? ctx.moveTo(vx, vy) : ctx.lineTo(vx, vy);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#999"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.stroke();
    const sf = 1 - (G.GROUND_Y - b.y) / G.GROUND_Y;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(b.x, G.GROUND_Y + 2, b.r * (0.4 + sf * 0.5), 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // HUD - flags + scores
    ctx.font = "bold 44px Oswald, sans-serif";
    ctx.textAlign = "center";

    // P1 side
    ctx.fillStyle = scoreColor(c1);
    ctx.fillText(game.scores.p1, G.WIDTH / 2 - 55, 48);
    ctx.fillStyle = COLORS.dimText;
    ctx.font = "bold 30px Oswald, sans-serif";
    ctx.fillText("–", G.WIDTH / 2, 46);
    // P2 side
    ctx.font = "bold 44px Oswald, sans-serif";
    ctx.fillStyle = scoreColor(c2);
    ctx.fillText(game.scores.p2, G.WIDTH / 2 + 55, 48);

    // Flag + country labels
    ctx.font = "24px sans-serif";
    ctx.fillText(c1.flag, G.WIDTH / 2 - 120, 46);
    ctx.fillText(c2.flag, G.WIDTH / 2 + 120, 46);

    ctx.font = "11px Oswald, sans-serif";
    ctx.fillStyle = COLORS.dimText;
    ctx.fillText(c1.name.toUpperCase(), G.WIDTH / 2 - 55, 64);
    ctx.fillText(c2.name.toUpperCase(), G.WIDTH / 2 + 55, 64);

    // Tournament round label
    const t = tournamentRef.current;
    if (t && t.screen === "playing") {
      ctx.font = "bold 10px Oswald, sans-serif";
      ctx.fillStyle = COLORS.score + "88";
      const roundText = t.bracket
        ? ({ r32: "ROUND OF 32", r16: "ROUND OF 16", qf: "QUARTERFINAL", sf: "SEMIFINAL", final: "FINAL" })[t.bracket.round] || ""
        : `GROUP ${t.groups[t.playerGroup].name} - MATCHDAY ${t.matchday}`;
      ctx.fillText(roundText, G.WIDTH / 2, 78);
    }

    // Goal celebration overlay
    const celeb = goalCelebRef.current;
    if (celeb && celeb.timer > 0) {
      const progress = celeb.timer / 90;
      // Fade in fast, fade out at end
      const alpha = celeb.timer < 15 ? celeb.timer / 15 : Math.min(1, (90 - celeb.timer) / 8 + 0.3);
      // Scale pop effect
      const scale = celeb.timer > 75 ? 0.8 + ((90 - celeb.timer) / 15) * 0.2 : 1;

      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, G.HEIGHT * 0.28, G.WIDTH, G.HEIGHT * 0.38);
      ctx.globalAlpha = alpha;

      ctx.translate(G.WIDTH / 2, G.HEIGHT / 2 - 15);
      ctx.scale(scale, scale);

      // "GOAL!" text
      ctx.font = "bold 56px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = "#ffffff";
      ctx.fillText("GOAL!", 0, -15);

      // Country name + flag
      ctx.font = "bold 22px Oswald, sans-serif";
      ctx.fillStyle = scoreColor(celeb.country);
      ctx.fillText(`${celeb.country.flag}  ${celeb.country.name.toUpperCase()}`, 0, 18);

      ctx.restore();
    }

    // Pause overlay
    if (pausedRef.current) {
      ctx.save();
      ctx.font = "bold 48px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 4;
      ctx.strokeText("PAUSED", G.WIDTH / 2, G.HEIGHT / 2 - 10);
      ctx.fillStyle = COLORS.score;
      ctx.fillText("PAUSED", G.WIDTH / 2, G.HEIGHT / 2 - 10);
      ctx.font = "16px Oswald, sans-serif";
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 3;
      ctx.strokeText("Press SPACE to resume", G.WIDTH / 2, G.HEIGHT / 2 + 25);
      ctx.fillStyle = COLORS.dimText;
      ctx.fillText("Press SPACE to resume", G.WIDTH / 2, G.HEIGHT / 2 + 25);
      ctx.restore();
    }

    // End screen shake
    ctx.restore();
  }, [goalTop]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" && gameState !== "scored" && gameState !== "countdown") return;
    const loop = () => {
      if (gameState === "countdown" || gameStateRef.current === "countdown") {
        countdownRef.current--;
        if (countdownRef.current <= 0) {
          setGameState("playing");
        }
        draw();
        // Draw countdown number overlay
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
          const t = countdownRef.current;
          let label, labelColor;
          if (t > 150) { label = "3"; labelColor = COLORS.text; }
          else if (t > 90) { label = "2"; labelColor = COLORS.text; }
          else if (t > 30) { label = "1"; labelColor = COLORS.text; }
          else { label = "GO!"; labelColor = COLORS.score; }

          // Pop-in animation within each phase
          const phase = t > 150 ? (t - 150) : t > 90 ? (t - 90) : t > 30 ? (t - 30) : t;
          const phaseLen = t > 30 ? 60 : 30;
          const prog = 1 - phase / phaseLen;
          const scale = 1 + (1 - prog) * 0.3;

          ctx.save();
          ctx.translate(G.WIDTH / 2, G.HEIGHT / 2 - 20);
          ctx.scale(scale, scale);
          ctx.font = "bold 80px Oswald, sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.strokeStyle = "rgba(0,0,0,0.6)";
          ctx.lineWidth = 5;
          ctx.strokeText(label, 0, 0);
          ctx.fillStyle = labelColor;
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      } else {
        update();
        draw();
      }
      animRef.current = requestAnimationFrame(loop);
    };
    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [gameState, update, draw]);

  // Movement keys
  useEffect(() => {
    const down = (e) => {
      const key = e.key.toLowerCase();
      keysRef.current[key] = true;
      if (key === "a") lastDirRef.current = "left";
      if (key === "d") lastDirRef.current = "right";
      if (key === "arrowleft") { lastDirRef2.current = "left"; if (gameModeRef.current === "1p") lastDirRef.current = "left"; }
      if (key === "arrowright") { lastDirRef2.current = "right"; if (gameModeRef.current === "1p") lastDirRef.current = "right"; }
      if (["arrowup","arrowdown","arrowleft","arrowright","w","a","s","d"," "].includes(key)) e.preventDefault();
      // Pause toggle on space (during gameplay, not countdown)
      if (key === " ") {
        if (gameStateRef.current === "playing" || gameStateRef.current === "scored") {
          pausedRef.current = !pausedRef.current;
          setPaused(pausedRef.current);
        }
      }
    };
    const up = (e) => { keysRef.current[e.key.toLowerCase()] = false; };
    const blur = () => { keysRef.current = {}; lastDirRef.current = null; lastDirRef2.current = null; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", blur); };
  }, []);

  // Game start key
  gameStateRef.current = gameState;
  gameModeRef.current = gameMode;
  useEffect(() => {
    const down = (e) => {
      if ((gameStateRef.current === "menu" || gameStateRef.current === "gameover") && (e.key === " " || e.key === "Enter")) {
        if (tournamentRef.current && showTournamentUIRef.current && tournamentRef.current.screen !== "playing") return;
        pausedRef.current = false; setPaused(false); goalCelebRef.current = null;
        initGame(); countdownRef.current = 210; setGameState("countdown");
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [initGame]);

  // Mobile detect
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Canvas scale - fit width AND height (important for landscape)
  useEffect(() => {
    const resize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
      if (containerRef.current) {
        const maxW = (containerRef.current.offsetWidth - 16) / G.WIDTH;
        const maxH = (window.innerHeight - 180) / G.HEIGHT;
        setCanvasScale(Math.min(1, maxW, maxH));
      }
    };
    resize(); window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Draw menu/gameover overlays
  useEffect(() => {
    const c1 = p1CountryRef.current;
    const c2 = p2CountryRef.current;
    if (gameState === "menu") {
      initGame(); draw();
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "rgba(10, 14, 23, 0.88)";
      ctx.fillRect(0, 0, G.WIDTH, G.HEIGHT);
      ctx.font = "bold 46px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = COLORS.score;
      ctx.fillText("SLIME ⚽ SOCCER", G.WIDTH / 2, 130);
      ctx.font = "18px Oswald, sans-serif";
      ctx.fillStyle = "#d4a84399";
      ctx.fillText(league === "pl" ? "PREMIER LEAGUE EDITION" : "SLIME CUP EDITION", G.WIDTH / 2, 158);
      ctx.font = "18px Oswald, sans-serif";
      ctx.fillStyle = COLORS.text;
      ctx.fillText("First to 7 wins!", G.WIDTH / 2, 195);
      // Matchup display
      ctx.font = "28px sans-serif";
      ctx.fillText(`${c1.flag}  vs  ${c2.flag}`, G.WIDTH / 2, 245);
      ctx.font = "16px Oswald, sans-serif";
      ctx.fillStyle = COLORS.dimText;
      ctx.fillText(`${c1.name}  vs  ${c2.name}`, G.WIDTH / 2, 272);
      ctx.font = "14px Oswald, sans-serif";
      ctx.fillStyle = COLORS.dimText;
      ctx.fillText(isMobile ? "Use on-screen controls to play" : gameModeRef.current === "2p"
        ? "P1: A/D + W  •  P2: ←/→ + ↑  •  SPACE pause"
        : gameModeRef.current === "sim" ? "SPACE to start  •  Sit back and watch!"
        : "A/D or ←/→  to move  •  W or ↑  to jump  •  SPACE  to pause", G.WIDTH / 2, 310);
      ctx.font = "14px Oswald, sans-serif";
      const modeColors = { "1p": "#5a9ee0", "2p": "#4dc47a", "sim": "#e0a05a" };
      const modeLabels = { "1p": "🤖 VS CPU", "2p": "👥 2 PLAYER", "sim": "📺 MATCH SIMULATOR" };
      ctx.fillStyle = modeColors[gameModeRef.current] || "#5a9ee0";
      ctx.fillText(modeLabels[gameModeRef.current] || "🤖 VS CPU", G.WIDTH / 2, 340);

      // Show record on menu
      if (gameModeRef.current === "1p" && (stats.wins > 0 || stats.losses > 0)) {
        ctx.font = "12px Oswald, sans-serif";
        ctx.fillStyle = COLORS.dimText;
        const gd = stats.goalsFor - stats.goalsAgainst;
        ctx.fillText(`Your record: ${stats.wins}W–${stats.losses}L  •  GD: ${gd >= 0 ? "+" : ""}${gd}  •  🔥 Streak: ${stats.currentStreak}`, G.WIDTH / 2, 360);
      }

      ctx.font = "bold 20px Oswald, sans-serif";
      ctx.fillStyle = COLORS.score;
      ctx.fillText("▶  PRESS SPACE TO START", G.WIDTH / 2, (stats.wins > 0 || stats.losses > 0) && gameModeRef.current === "1p" ? 395 : 370);
    }
    if (gameState === "gameover") {
      draw();
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "rgba(10, 14, 23, 0.88)";
      ctx.fillRect(0, 0, G.WIDTH, G.HEIGHT);
      const wc = winner === "p1" ? c1 : c2;
      ctx.font = "36px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(wc.flag, G.WIDTH / 2, 140);
      ctx.font = "bold 42px Oswald, sans-serif";
      ctx.fillStyle = wc.primary;
      ctx.fillText(`${wc.name.toUpperCase()} WINS!`, G.WIDTH / 2, 190);
      ctx.font = "bold 34px Oswald, sans-serif";
      ctx.fillStyle = COLORS.text;
      ctx.fillText(`${gameRef.current.scores.p1} – ${gameRef.current.scores.p2}`, G.WIDTH / 2, 235);

      // Show stats on gameover (1P only)
      if (gameModeRef.current === "1p") {
        ctx.font = "13px Oswald, sans-serif";
        ctx.fillStyle = COLORS.dimText;
        const gd = stats.goalsFor - stats.goalsAgainst;
        const gdStr = gd >= 0 ? `+${gd}` : `${gd}`;
        ctx.fillText(`${stats.wins}W – ${stats.losses}L  •  GD: ${gdStr}  •  🧤 ${stats.cleanSheets}  •  🔥 Best streak: ${stats.longestStreak}`, G.WIDTH / 2, 275);
      }

      ctx.font = "bold 18px Oswald, sans-serif";
      ctx.fillStyle = COLORS.score;
      if (!tournamentRef.current) ctx.fillText("PRESS SPACE TO PLAY AGAIN", G.WIDTH / 2, 310);
    }
  }, [gameState, draw, initGame, winner, isMobile, p1Country, p2Country, gameMode, stats, league]);

  const startGame = () => {
    if (tournament && showTournamentUI && tournament.screen !== "playing") return;
    if (gameState === "menu" || gameState === "gameover") {
      pausedRef.current = false;
      setPaused(false);
      goalCelebRef.current = null;
      initGame();
      countdownRef.current = 210; // 3.5 seconds: 3, 2, 1, GO!
      setGameState("countdown");
      // Track play in Supabase (not for sim mode)
      if (gameMode !== "sim") {
        import("./supabase.jsx").then(({ recordPlay }) => {
          recordPlay("slime-soccer");
        }).catch(() => {});
      }
    }
  };

  const teams = getTeams(league);

  const selectStyle = {
    background: COLORS.ground,
    color: COLORS.text,
    border: `1px solid ${COLORS.groundLine}55`,
    borderRadius: 6,
    padding: "6px 10px",
    fontFamily: "Oswald, sans-serif",
    fontSize: 14,
    cursor: "pointer",
    outline: "none",
    minWidth: 140,
  };

  const mbtn = {
    width: 80, height: 80, borderRadius: 14,
    border: `2px solid ${COLORS.groundLine}`, background: COLORS.ground,
    color: COLORS.text, fontSize: 24, fontFamily: "Oswald, sans-serif",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", touchAction: "none",
  };

  const controlsRef = useRef(null);
  const controlsRef2 = useRef(null);

  const getActionFromPoint = useCallback((x, y) => {
    const el = document.elementFromPoint(x, y);
    return el?.dataset?.action || el?.parentElement?.dataset?.action || null;
  }, []);

  const makeTouchHandler = useCallback((mRef, suffix) => {
    const recalc = (touches) => {
      let left = false, right = false, jump = false;
      for (const t of touches) {
        const action = getActionFromPoint(t.clientX, t.clientY);
        if (action === "left" + suffix) left = true;
        if (action === "right" + suffix) right = true;
        if (action === "jump" + suffix) jump = true;
      }
      mRef.current.left = left;
      mRef.current.right = right;
      mRef.current.jump = jump;
    };
    return recalc;
  }, [getActionFromPoint]);

  const recalcP1 = useCallback(makeTouchHandler(mobileRef, ""), [makeTouchHandler]);
  const recalcP2 = useCallback(makeTouchHandler(mobileRef2, "2"), [makeTouchHandler]);

  useEffect(() => {
    const setupTouch = (container, recalc) => {
      if (!container) return () => {};
      const onTouch = (e) => {
        const target = e.target;
        if (target?.dataset?.action === "pause" || target?.parentElement?.dataset?.action === "pause") return;
        e.preventDefault();
        recalc(e.touches);
      };
      const onTouchEnd = (e) => {
        const target = e.target;
        if (target?.dataset?.action === "pause" || target?.parentElement?.dataset?.action === "pause") return;
        e.preventDefault();
        recalc(e.touches);
      };
      container.addEventListener("touchstart", onTouch, { passive: false });
      container.addEventListener("touchmove", onTouch, { passive: false });
      container.addEventListener("touchend", onTouchEnd, { passive: false });
      container.addEventListener("touchcancel", onTouchEnd, { passive: false });
      return () => {
        container.removeEventListener("touchstart", onTouch);
        container.removeEventListener("touchmove", onTouch);
        container.removeEventListener("touchend", onTouchEnd);
        container.removeEventListener("touchcancel", onTouchEnd);
      };
    };
    const cleanup1 = setupTouch(controlsRef.current, recalcP1);
    const cleanup2 = setupTouch(controlsRef2.current, recalcP2);
    return () => { cleanup1(); cleanup2(); };
  }, [recalcP1, recalcP2, gameState, gameMode]);

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "Oswald, sans-serif", padding: isMobile && isLandscape ? "4px 8px" : "16px 8px", paddingTop: isMobile && isLandscape ? 4 : 60 }}>
      <Helmet>
        <title>Slime Soccer – Slime Cup Edition | Trivial Sports</title>
        <meta name="description" content="Play classic slime soccer with 65 nations. Pick your country, score goals, and compete in this retro arcade game." />
        <meta property="og:title" content="Slime Soccer – Slime Cup Edition | Trivial Sports" />
        <meta property="og:description" content="Play classic slime soccer with 65 nations. Pick your country, score goals, and compete in this retro arcade game." />
        <meta property="og:url" content="https://trivialsports.com/games/slime-soccer" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/slime-soccer-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://trivialsports.com/games/slime-soccer" />
      </Helmet>
      <style>{`@keyframes trophy-pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.25); opacity: 1; } }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet" />
      {!(isMobile && isLandscape) && (
      <div style={{ textAlign: "center", marginBottom: 8, position: "relative", width: "100%", maxWidth: G.WIDTH + 16 }}>
        {league === "worldcup" && gameMode === "1p" && (gameState === "menu" || gameState === "gameover") && !showTournamentUI && !showCabinet && (
          <div style={{ position: "absolute", left: 0, top: 0, zIndex: 10 }}>
            <button onClick={() => setShowTrophyMenu(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 28, animation: "trophy-pulse 2s ease-in-out infinite", padding: 4 }} title="World Cup Menu">
              {"🏆"}
            </button>
            {showTrophyMenu && (<>
              <div onClick={() => setShowTrophyMenu(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 8 }}></div>
              <div style={{ position: "absolute", top: 40, left: 0, background: COLORS.ground, border: `1px solid ${COLORS.score}44`, borderRadius: 8, padding: 6, display: "flex", flexDirection: "column", gap: 4, minWidth: 200, boxShadow: "0 4px 16px rgba(0,0,0,0.5)", zIndex: 9 }}>
                {tournament && tournament.screen !== "select" && tournament.screen !== "draw" ? (<>
                  <button onClick={() => { setShowTrophyMenu(false); setShowTournamentUIWrapped(true); }} style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: "none", border: "none", borderRadius: 6, color: COLORS.score, cursor: "pointer", textAlign: "left", letterSpacing: 1, whiteSpace: "nowrap" }}>
                    {"▶"} RESUME WORLD CUP
                  </button>
                  <div style={{ padding: "0 14px 6px", fontSize: 11, color: COLORS.dimText, textAlign: "left" }}>
                    {tournament.playerTeam?.flag} {tournament.playerTeam?.name} - {tournament.bracket ? ({ r32: "Round of 32", r16: "Round of 16", qf: "Quarterfinals", sf: "Semifinals", final: "Final" })[tournament.bracket.round] : `Group Stage, MD${tournament.matchday}`}
                  </div>
                </>) : (
                  <button onClick={() => { setShowTrophyMenu(false); setShowTournamentUIWrapped(true); updateTournament({ screen: "select", playerTeam: null }); }} style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: "none", border: "none", borderRadius: 6, color: COLORS.score, cursor: "pointer", textAlign: "left", letterSpacing: 1, whiteSpace: "nowrap" }}>
                    PLAY 2026 WORLD CUP
                  </button>
                )}
                <div style={{ height: 1, background: `${COLORS.groundLine}33`, margin: "2px 8px" }}></div>
                <button onClick={() => { setShowTrophyMenu(false); setShowCabinet(true); }} style={{ padding: "10px 14px", fontSize: 14, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: "none", border: "none", borderRadius: 6, color: COLORS.text, cursor: "pointer", textAlign: "left", letterSpacing: 1, whiteSpace: "nowrap" }}>
                  TROPHY CABINET {trophyCabinet.length > 0 ? `(${trophyCabinet.length})` : ""}
                </button>
              </div>
            </>)}
          </div>
        )}
        <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.dimText, textTransform: "uppercase", marginBottom: 2 }}>TrivialSports.com</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.score, margin: 0, lineHeight: 1 }}>SLIME ⚽ SOCCER</h1>
        <div style={{ fontSize: 12, color: "#d4a84377", letterSpacing: 3, marginTop: 2 }}>{league === "pl" ? "PREMIER LEAGUE EDITION" : "SLIME CUP EDITION"}</div>
      </div>
      )}

      {/* Trophy Cabinet */}
      {showCabinet && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: COLORS.bg, overflow: "auto", paddingTop: 20, paddingLeft: 10, paddingRight: 10, paddingBottom: 40, fontFamily: "Oswald, sans-serif" }}>
          <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
            <button onClick={() => setShowCabinet(false)} style={{ background: "none", border: "none", color: COLORS.dimText, fontFamily: "Oswald, sans-serif", fontSize: 14, cursor: "pointer", letterSpacing: 2, padding: "4px 8px", marginBottom: 8, display: "block", textAlign: "left" }}>
              {"← BACK TO MENU"}
            </button>
            <div style={{ padding: "30px 0 40px" }}>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: COLORS.score }}>TROPHY CABINET</div>
              <div style={{ height: 30 }}></div>
              <div style={{ fontSize: 14, color: COLORS.dimText }}>Your World Cup victories</div>
            </div>
            {trophyCabinet.length === 0 ? (
              <div style={{ padding: "40px 20px", color: COLORS.dimText, fontSize: 16 }}>
                No trophies yet. Win the 2026 World Cup to add your first!
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 3 : 4}, 1fr)`, gap: 12 }}>
                {[...trophyCabinet].reverse().map((t, i) => (
                  <div key={i} style={{ background: COLORS.ground, border: `1px solid ${COLORS.score}33`, borderRadius: 10, padding: "16px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{ fontSize: 32 }}>{"🏆"}</div>
                    <div style={{ fontSize: 28 }}>{t.flag}</div>
                    <div style={{ fontSize: 11, color: COLORS.text, fontWeight: 700, lineHeight: 1.2 }}>{t.name}</div>
                    <div style={{ fontSize: 10, color: COLORS.dimText }}>{t.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* League selector */}
      {!(isMobile && isLandscape) && (
      <div style={{ display: "flex", gap: 0, marginBottom: 8, borderRadius: 8, overflow: "hidden", border: "1px solid rgba(212,168,67,0.27)" }}>
        {[
          { key: "worldcup", label: "WORLD CUP", color: "#d4a843" },
          { key: "pl", label: "PREMIER LEAGUE", color: "#9b59b6" },
        ].map(lg => {
          const active = league === lg.key;
          return (
            <button key={lg.key} onClick={() => {
              if (league !== lg.key) {
                setLeague(lg.key);
                const t = lg.key === "pl" ? PL_TEAMS : COUNTRIES;
                const i = Math.floor(Math.random() * t.length);
                let j; do { j = Math.floor(Math.random() * t.length); } while (j === i);
                setP1Country(t[i]);
                setP2Country(t[j]);
                initGame();
                setGameState("menu");
              }
            }} style={{
              background: active ? lg.color + "22" : "transparent",
              border: "none", borderRight: "1px solid rgba(212,168,67,0.2)",
              padding: "7px 18px", cursor: "pointer",
              color: active ? lg.color : COLORS.dimText,
              fontFamily: "Oswald, sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: 2, transition: "all 0.15s ease", outline: "none",
            }}>{lg.label}</button>
          );
        })}
      </div>
      )}

      {/* Country selectors */}
      {!(isMobile && isLandscape) && !isMobile && (
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", gap: 24,
        marginBottom: 10, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: COLORS.dimText, fontSize: 12, letterSpacing: 1 }}>YOU</span>
          <select
            value={p1Country.name}
            onChange={(e) => {
              const c = teams.find(c => c.name === e.target.value);
              if (c) setP1Country(c);
            }}
            style={{ ...selectStyle, borderColor: p1Country.primary + "88" }}
          >
            {teams.map(c => (
              <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            const i = Math.floor(Math.random() * teams.length);
            let j; do { j = Math.floor(Math.random() * teams.length); } while (j === i);
            setP1Country(teams[i]);
            setP2Country(teams[j]);
            initGame();
            setGameState("menu");
          }}
          style={{
            background: "none", border: `1px solid ${COLORS.groundLine}55`, borderRadius: 6,
            color: COLORS.score, fontFamily: "Oswald, sans-serif", fontSize: 11,
            padding: "6px 10px", cursor: "pointer", letterSpacing: 1, lineHeight: 1.2,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}
          title="Random Match"
        >
          <span style={{ fontSize: 16 }}>🔀</span>
          <span>RANDOM</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select
            value={p2Country.name}
            onChange={(e) => {
              const c = teams.find(c => c.name === e.target.value);
              if (c) setP2Country(c);
            }}
            style={{ ...selectStyle, borderColor: p2Country.primary + "88" }}
          >
            {teams.map(c => (
              <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>
          <span style={{ color: COLORS.dimText, fontSize: 12, letterSpacing: 1 }}>{gameMode === "2p" ? "P2" : "CPU"}</span>
        </div>
      </div>
      )}

      {/* Mobile country selectors - stacked */}
      {isMobile && !isLandscape && (
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginBottom: 10, width: "100%", maxWidth: 340, padding: "0 8px",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: COLORS.dimText, fontSize: 11, letterSpacing: 1, width: 30, textAlign: "right" }}>YOU</span>
            <select
              value={p1Country.name}
              onChange={(e) => {
                const c = teams.find(c => c.name === e.target.value);
                if (c) setP1Country(c);
              }}
              style={{ ...selectStyle, borderColor: p1Country.primary + "88", flex: 1, minWidth: 0 }}
            >
              {teams.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: COLORS.dimText, fontSize: 11, letterSpacing: 1, width: 30, textAlign: "right" }}>CPU</span>
            <select
              value={p2Country.name}
              onChange={(e) => {
                const c = teams.find(c => c.name === e.target.value);
                if (c) setP2Country(c);
              }}
              style={{ ...selectStyle, borderColor: p2Country.primary + "88", flex: 1, minWidth: 0 }}
            >
              {teams.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            const i = Math.floor(Math.random() * teams.length);
            let j; do { j = Math.floor(Math.random() * teams.length); } while (j === i);
            setP1Country(teams[i]);
            setP2Country(teams[j]);
            initGame();
            setGameState("menu");
          }}
          style={{
            background: "none", border: `1px solid ${COLORS.groundLine}55`, borderRadius: 6,
            color: COLORS.score, fontFamily: "Oswald, sans-serif", fontSize: 11,
            padding: "10px 12px", cursor: "pointer", letterSpacing: 1, lineHeight: 1.2,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          }}
          title="Random Match"
        >
          <span style={{ fontSize: 16 }}>🔀</span>
          <span>RANDOM</span>
        </button>
      </div>
      )}

      {/* Mode selector */}
      <div style={{ display: "flex", gap: 0, marginBottom: 8, borderRadius: 8, overflow: "hidden", border: `1px solid ${COLORS.groundLine}44` }}>
        {[
          { key: "1p", label: "🤖 VS CPU", color: "#5a9ee0" },
          ...(!isMobile ? [{ key: "2p", label: "👥 2 PLAYER", color: "#4dc47a" }] : []),
          { key: "sim", label: "📺 SIMULATE", color: "#e0a05a" },
        ].map(m => {
          const active = gameMode === m.key;
          return (
            <button key={m.key} onClick={() => setGameMode(m.key)} style={{
              background: active ? m.color + "22" : "transparent",
              border: "none", borderRight: `1px solid ${COLORS.groundLine}33`,
              padding: "7px 16px", cursor: "pointer",
              color: active ? m.color : COLORS.dimText,
              fontFamily: "Oswald, sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: 2, transition: "all 0.15s ease", outline: "none",
            }}>{m.label}</button>
          );
        })}
      </div>

      <div ref={containerRef} style={{ width: "100%", maxWidth: G.WIDTH + 16, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ border: `2px solid ${COLORS.groundLine}33`, borderRadius: 8, overflow: "hidden", boxShadow: "0 0 40px rgba(212,168,67,0.1)", lineHeight: 0 }}>

      {/* Tournament UI overlay */}
      {tournament && showTournamentUI && tournament.screen !== "playing" && gameState !== "countdown" && gameState !== "playing" && gameState !== "scored" && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, background: COLORS.bg, overflow: "auto", paddingTop: 20, paddingLeft: 10, paddingRight: 10, paddingBottom: 40, fontFamily: "Oswald, sans-serif" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          {/* Exit/back button */}
          <button onClick={() => {
            if (tournament.screen === "select" || tournament.screen === "draw") {
              updateTournament(null);
            }
            setShowTournamentUIWrapped(false);
            setShowTrophyMenu(false);
          }} style={{ background: "none", border: "none", color: COLORS.dimText, fontFamily: "Oswald, sans-serif", fontSize: 14, cursor: "pointer", letterSpacing: 2, padding: "4px 8px", marginBottom: 8, display: "block", textAlign: "left" }}>
            {"← BACK TO MENU"}
          </button>

          {/* TEAM SELECTION */}
          {tournament.screen === "select" && (
            <div style={{ maxWidth: 700, width: "100%", textAlign: "center", margin: "0 auto" }}>
              <div style={{ padding: "30px 0 40px" }}>
                <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: COLORS.score }}>{"🏆"} 2026 WORLD CUP {"🏆"}</div>
                <div style={{ height: 30 }}></div>
                <div style={{ fontSize: 14, color: COLORS.dimText }}>Choose your team for the tournament</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 3 : 5}, 1fr)`, gap: 8 }}>
                {getWCTeams().sort((a, b) => a.name.localeCompare(b.name)).map(c => (
                  <button key={c.name} onClick={() => initTournament(c)} style={{
                    background: tournament.playerTeam?.name === c.name ? COLORS.score + "33" : COLORS.ground,
                    border: `1px solid ${tournament.playerTeam?.name === c.name ? COLORS.score : COLORS.groundLine}55`,
                    borderRadius: 6, padding: isMobile ? "8px 6px" : "8px 10px", cursor: "pointer",
                    color: tournament.playerTeam?.name === c.name ? COLORS.score : COLORS.text, fontFamily: "Oswald, sans-serif", fontSize: isMobile ? 12 : 14,
                    display: "flex", alignItems: "center", gap: 4, overflow: "hidden", whiteSpace: "nowrap",
                  }}><span style={{ fontSize: isMobile ? 14 : 18, flexShrink: 0 }}>{c.flag}</span><span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span></button>
                ))}
              </div>
            </div>
          )}

          {/* GROUP DRAW */}
          {tournament.screen === "draw" && (
            <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
              <div style={{ padding: "30px 0 40px" }}>
                <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 700, color: COLORS.score }}>{"🏆"} 2026 WORLD CUP GROUPS {"🏆"}</div>
                <div style={{ height: 30 }}></div>
                <div style={{ fontSize: 14, color: COLORS.dimText }}>48 teams in 12 groups</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 180}px, 1fr))`, gap: isMobile ? 8 : 12 }}>
                {tournament.groups.map((g, gi) => {
                  const isPlayerGroup = gi === tournament.playerGroup;
                  return (
                    <div key={gi} style={{ background: isPlayerGroup ? COLORS.score + "15" : COLORS.ground, border: `1px solid ${isPlayerGroup ? COLORS.score + "55" : COLORS.groundLine + "33"}`, borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: isPlayerGroup ? COLORS.score : COLORS.dimText, marginBottom: 8 }}>GROUP {g.name}</div>
                      {g.teams.map(t => (
                        <div key={t.name} style={{ fontSize: 14, color: t.name === tournament.playerTeam.name ? COLORS.score : COLORS.text, padding: "3px 0", fontWeight: t.name === tournament.playerTeam.name ? 700 : 400, lineHeight: 1.4 }}>
                          {t.flag} {t.name}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
              <button onClick={() => updateTournament({ ...tournament, screen: "groups" })} style={{ marginTop: 20, padding: "12px 40px", fontSize: 18, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer", letterSpacing: 2 }}>BEGIN GROUP STAGE</button>
            </div>
          )}

          {/* GROUP STAGE */}
          {(tournament.screen === "groups" || tournament.screen === "groupResult") && (
            <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
              <div style={{ padding: "30px 0 40px" }}>
                <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: COLORS.score }}>
                  {tournament.screen === "groupResult" ? `MATCHDAY ${tournament.matchday} RESULTS` : `MATCHDAY ${tournament.matchday} OF 3`}
                </div>
                <div style={{ height: 30 }}></div>
                <div style={{ fontSize: isMobile ? 12 : 14, color: COLORS.dimText }}>
                  {tournament.playerTeam.flag} {tournament.playerTeam.name} - Group {tournament.groups[tournament.playerGroup].name}
                </div>
              </div>

              {/* Player's group table */}
              {(() => {
                const g = tournament.groups[tournament.playerGroup];
                const st = calcStandings(g);
                const playerMatch = g.matches.find(m => m.matchday === tournament.matchday &&
                  (m.team1.name === tournament.playerTeam.name || m.team2.name === tournament.playerTeam.name));
                const cellPad = isMobile ? "8px 6px" : "12px 14px";
                const hdrPad = isMobile ? "6px 6px" : "10px 14px";
                const tblFont = isMobile ? 13 : 15;
                return (
                  <div style={{ marginBottom: 24 }}>
                    <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 4px", fontSize: tblFont, color: COLORS.text, marginBottom: 20 }}>
                      <thead><tr>
                        <th style={{ textAlign: "left", padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>Team</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>P</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>W</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>L</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>GF</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>GA</th>
                        <th style={{ padding: hdrPad, color: COLORS.dimText, borderBottom: `1px solid ${COLORS.groundLine}44` }}>GD</th>
                        <th style={{ padding: hdrPad, color: COLORS.score, borderBottom: `1px solid ${COLORS.groundLine}44` }}>PTS</th>
                      </tr></thead>
                      <tbody>{st.map((r, ri) => (
                        <tr key={r.team.name} style={{ background: ri < 2 ? COLORS.score + "0a" : "transparent" }}>
                          <td style={{ textAlign: "left", padding: cellPad, fontWeight: r.team.name === tournament.playerTeam.name ? 700 : 400, color: r.team.name === tournament.playerTeam.name ? COLORS.score : COLORS.text, whiteSpace: "nowrap" }}>{r.team.flag} {r.team.name}</td>
                          <td style={{ padding: cellPad, textAlign: "center" }}>{r.p}</td>
                          <td style={{ padding: cellPad, textAlign: "center" }}>{r.w}</td>
                          <td style={{ padding: cellPad, textAlign: "center" }}>{r.l}</td>
                          <td style={{ padding: cellPad, textAlign: "center" }}>{r.gf}</td>
                          <td style={{ padding: cellPad, textAlign: "center" }}>{r.ga}</td>
                          <td style={{ padding: cellPad, textAlign: "center", color: r.gd > 0 ? "#6aff6a" : r.gd < 0 ? "#ff6a6a" : COLORS.dimText }}>{r.gd > 0 ? "+" : ""}{r.gd}</td>
                          <td style={{ padding: cellPad, textAlign: "center", fontWeight: 700, color: COLORS.score }}>{r.pts}</td>
                        </tr>
                      ))}</tbody>
                    </table>

                    {/* Matchday results */}
                    <div style={{ fontSize: isMobile ? 14 : 16, color: COLORS.dimText, marginBottom: 14, marginTop: 24 }}>MATCHDAY {tournament.matchday} FIXTURES</div>
                    {g.matches.filter(m => m.matchday === tournament.matchday).map((m, mi) => (
                      <div key={mi} style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: isMobile ? 6 : 12, padding: isMobile ? "8px 0" : "10px 0", fontSize: isMobile ? 14 : 16, color: COLORS.text }}>
                        <span style={{ minWidth: isMobile ? 80 : 120, textAlign: "right", fontWeight: m.team1.name === tournament.playerTeam.name ? 700 : 400, color: m.team1.name === tournament.playerTeam.name ? COLORS.score : COLORS.text }}>{m.team1.flag} {m.team1.name}</span>
                        <span style={{ color: COLORS.dimText, minWidth: isMobile ? 40 : 56, textAlign: "center", fontWeight: 700, fontSize: isMobile ? 16 : 18 }}>{m.played ? `${m.score1} - ${m.score2}` : "vs"}</span>
                        <span style={{ minWidth: isMobile ? 80 : 120, textAlign: "left", fontWeight: m.team2.name === tournament.playerTeam.name ? 700 : 400, color: m.team2.name === tournament.playerTeam.name ? COLORS.score : COLORS.text }}>{m.team2.flag} {m.team2.name}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Action buttons */}
              {tournament.screen === "groups" && (() => {
                const pm = getPlayerMatch(tournament);
                if (!pm) return null;
                const opp = pm.team1.name === tournament.playerTeam.name ? pm.team2 : pm.team1;
                return (
                  <button onClick={() => {
                    updateTournament({ ...tournament, screen: "playing" });
                    startTournamentMatch(tournament, pm.team1, pm.team2);
                  }} style={{ marginTop: 12, padding: "14px 40px", fontSize: 20, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer", letterSpacing: 2 }}>
                    PLAY vs {opp.flag} {opp.name.toUpperCase()}
                  </button>
                );
              })()}

              {tournament.screen === "groupResult" && tournament.matchday < 3 && (
                <button onClick={() => updateTournament({ ...tournament, screen: "groups", matchday: tournament.matchday + 1 })} style={{ marginTop: 16, padding: "12px 36px", fontSize: 18, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer", letterSpacing: 2 }}>
                  NEXT MATCHDAY
                </button>
              )}

              {/* Other groups (collapsed) */}
              <div style={{ marginTop: 20, fontSize: 13, color: COLORS.dimText, marginBottom: 8 }}>OTHER GROUPS</div>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? 140 : 180}px, 1fr))`, gap: isMobile ? 8 : 10 }}>
                {tournament.groups.filter((_, i) => i !== tournament.playerGroup).map((g, gi) => {
                  const st = calcStandings(g);
                  return (
                    <div key={gi} style={{ background: COLORS.ground, borderRadius: 6, padding: "8px 10px", fontSize: 13 }}>
                      <div style={{ fontWeight: 700, color: COLORS.dimText, marginBottom: 6 }}>GROUP {g.name}</div>
                      {st.map(r => (
                        <div key={r.team.name} style={{ display: "flex", justifyContent: "space-between", padding: "2px 4px", color: COLORS.text, lineHeight: 1.4 }}>
                          <span>{r.team.flag} {r.team.name}</span>
                          <span style={{ color: COLORS.score, fontWeight: 700 }}>{r.pts}</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUALIFICATION RESULTS */}
          {tournament.screen === "qualify" && (() => {
            const qualified = getQualifiedTeams(tournament.groups);
            const playerIn = qualified.some(q => q.team.name === tournament.playerTeam.name);
            return (
              <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                <div style={{ padding: "30px 0 40px" }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: COLORS.score }}>GROUP STAGE COMPLETE</div>
                  <div style={{ height: 30 }}></div>
                  <div style={{ fontSize: 18, color: playerIn ? "#6aff6a" : "#ff6a6a", fontWeight: 700 }}>
                    {playerIn ? `${tournament.playerTeam.flag} ${tournament.playerTeam.name.toUpperCase()} QUALIFIED!` : `${tournament.playerTeam.flag} ${tournament.playerTeam.name.toUpperCase()} ELIMINATED`}
                  </div>
                </div>
                {playerIn ? (
                  <button onClick={() => {
                    const bracket = buildBracket(qualified, tournament.playerTeam);
                    bracket._playerTeam = tournament.playerTeam.name;
                    updateTournament({ ...tournament, bracket, screen: "bracket" });
                  }} style={{ padding: "14px 40px", fontSize: 20, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer", letterSpacing: 2 }}>
                    VIEW KNOCKOUT BRACKET
                  </button>
                ) : (
                  <button onClick={() => { updateTournament(null); setShowTournamentUIWrapped(false); }} style={{ padding: "12px 36px", fontSize: 16, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.ground, border: `1px solid ${COLORS.groundLine}55`, borderRadius: 8, color: COLORS.text, cursor: "pointer" }}>
                    BACK TO MENU
                  </button>
                )}
              </div>
            );
          })()}

          {/* KNOCKOUT BRACKET */}
          {tournament.screen === "bracket" && tournament.bracket && (() => {
            const b = tournament.bracket;
            const roundLabels = { r32: "ROUND OF 32", r16: "ROUND OF 16", qf: "QUARTER-FINALS", sf: "SEMI-FINALS", final: "FINAL" };
            const curMatches = b[b.round] || [];
            const pm = b.playerIdx >= 0 ? curMatches[b.playerIdx] : null;
            const opp = pm ? (pm.team1.name === tournament.playerTeam.name ? pm.team2 : pm.team1) : null;
            return (
              <div style={{ maxWidth: 800, width: "100%", textAlign: "center" }}>
                <div style={{ padding: "30px 0 40px" }}>
                  <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: COLORS.score }}>{roundLabels[b.round]}</div>
                  <div style={{ height: 30 }}></div>
                  <div style={{ fontSize: 13, color: COLORS.dimText }}>
                    {curMatches.length} matches this round
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", marginBottom: 16 }}>
                  {curMatches.map((m, mi) => {
                    if (!m) return null;
                    const isPlayerMatch = mi === b.playerIdx;
                    const w = m.played ? (m.score1 > m.score2 ? m.team1.name : m.team2.name) : null;
                    return (
                      <div key={mi} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 6, fontSize: 14, background: isPlayerMatch ? COLORS.score + "15" : COLORS.ground, border: `1px solid ${isPlayerMatch ? COLORS.score + "44" : COLORS.groundLine + "22"}`, minWidth: 280 }}>
                        <span style={{ flex: 1, textAlign: "right", fontWeight: w === m.team1.name ? 700 : 400, color: m.team1.name === tournament.playerTeam.name ? COLORS.score : w && w !== m.team1.name ? COLORS.dimText : COLORS.text }}>{m.team1.flag} {m.team1.name}</span>
                        <span style={{ color: COLORS.dimText, fontWeight: 700, minWidth: 44, textAlign: "center" }}>{m.played ? `${m.score1}-${m.score2}` : "vs"}</span>
                        <span style={{ flex: 1, textAlign: "left", fontWeight: w === m.team2.name ? 700 : 400, color: m.team2.name === tournament.playerTeam.name ? COLORS.score : w && w !== m.team2.name ? COLORS.dimText : COLORS.text }}>{m.team2.flag} {m.team2.name}</span>
                      </div>
                    );
                  })}
                </div>
                {pm && !pm.played && opp && (
                  <button onClick={() => {
                    updateTournament({ ...tournament, screen: "playing" });
                    startTournamentMatch(tournament, pm.team1, pm.team2);
                  }} style={{ padding: "14px 40px", fontSize: 20, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer", letterSpacing: 2 }}>
                    PLAY vs {opp.flag} {opp.name.toUpperCase()}
                  </button>
                )}
              </div>
            );
          })()}

          {/* ELIMINATED */}
          {tournament.screen === "eliminated" && (
            <div style={{ textAlign: "center" }}>
              <div style={{ padding: "30px 0 20px" }}>
                <div style={{ fontSize: 48 }}>{tournament.playerTeam.flag}</div>
              </div>
              <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: "#ff6a6a" }}>ELIMINATED</div>
              <div style={{ height: 20 }}></div>
              <div style={{ fontSize: 16, color: COLORS.dimText }}>{tournament.playerTeam.name} knocked out in the {({ r32: "Round of 32", r16: "Round of 16", qf: "Quarter-Finals", sf: "Semi-Finals", final: "Final" })[tournament.bracket?.round] || "Group Stage"}</div>
              <div style={{ height: 30 }}></div>
              <button onClick={() => { updateTournament(null); setShowTournamentUIWrapped(false); }} style={{ padding: "12px 36px", fontSize: 16, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.ground, border: `1px solid ${COLORS.groundLine}55`, borderRadius: 8, color: COLORS.text, cursor: "pointer" }}>
                BACK TO MENU
              </button>
            </div>
          )}

          {/* CHAMPION */}
          {tournament.screen === "champion" && (() => {
            const confettiColors = ["#d4a843", "#f5d77a", "#ffffff", "#e8c252", "#ffd700", tournament.playerTeam.primary, tournament.playerTeam.highlight || tournament.playerTeam.primary];
            return (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "85vh", justifyContent: "center", position: "relative", overflow: "hidden" }}>
              <style>{`
                @keyframes confetti-fall { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(95vh) rotate(720deg); opacity: 0.6; } }
                @keyframes trophy-entrance { 0% { transform: scale(0) rotate(-30deg); opacity: 0; } 50% { transform: scale(1.3) rotate(5deg); opacity: 1; } 70% { transform: scale(0.95) rotate(-2deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
                @keyframes glow-pulse { 0%, 100% { text-shadow: 0 0 20px #d4a84366, 0 0 40px #d4a84322; } 50% { text-shadow: 0 0 40px #d4a843aa, 0 0 80px #d4a84355, 0 0 120px #d4a84322; } }
                @keyframes flag-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.2); opacity: 1; } 100% { transform: scale(1); } }
                @keyframes text-rise { 0% { transform: translateY(30px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
                @keyframes star-burst { 0% { transform: scale(0) rotate(0deg); opacity: 0; } 50% { transform: scale(1.2) rotate(180deg); opacity: 1; } 100% { transform: scale(1) rotate(360deg); opacity: 0.7; } }
                @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
              `}</style>

              {/* Confetti */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} style={{
                  position: "absolute", top: -10, left: `${Math.random() * 100}%`,
                  width: Math.random() * 8 + 4, height: Math.random() * 12 + 6,
                  background: confettiColors[i % confettiColors.length],
                  borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                  animation: `confetti-fall ${3 + Math.random() * 4}s linear ${Math.random() * 2}s infinite`,
                  opacity: 0.8, zIndex: 0,
                }}></div>
              ))}

              {/* Sparkle stars */}
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`star-${i}`} style={{
                  position: "absolute",
                  top: `${15 + Math.random() * 60}%`, left: `${10 + Math.random() * 80}%`,
                  fontSize: Math.random() * 16 + 12, zIndex: 0,
                  animation: `star-burst 2s ease-out ${0.5 + i * 0.3}s both`,
                }}>{"✦"}</div>
              ))}

              {/* Flag */}
              <div style={{ fontSize: isMobile ? 56 : 80, animation: "flag-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both", zIndex: 1 }}>
                {tournament.playerTeam.flag}
              </div>

              <div style={{ height: 80 }}></div>

              {/* Trophy */}
              <div style={{ fontSize: isMobile ? 80 : 110, animation: "trophy-entrance 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s both, glow-pulse 3s ease-in-out 2.3s infinite", zIndex: 1, position: "relative" }}>
                {"🏆"}
              </div>

              <div style={{ height: 50 }}></div>

              {/* Title with shimmer */}
              <div style={{
                fontSize: isMobile ? 28 : 42, fontWeight: 700, zIndex: 1,
                background: "linear-gradient(90deg, #d4a843 0%, #f5d77a 25%, #ffffff 50%, #f5d77a 75%, #d4a843 100%)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "text-rise 0.8s ease-out 1.2s both, shimmer 3s linear 2s infinite",
              }}>WORLD CHAMPIONS!</div>

              <div style={{ height: 30 }}></div>

              {/* Subtitle */}
              <div style={{ fontSize: isMobile ? 16 : 20, color: COLORS.text, zIndex: 1, animation: "text-rise 0.8s ease-out 1.6s both" }}>
                {tournament.playerTeam.name} wins the Slime Cup!
              </div>

              <div style={{ height: 50 }}></div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, zIndex: 1, animation: "text-rise 0.8s ease-out 2s both" }}>
                <button onClick={() => { setShowCabinet(true); setShowTournamentUIWrapped(false); updateTournament(null); }} style={{ padding: "12px 36px", fontSize: 16, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score + "22", border: `1px solid ${COLORS.score}55`, borderRadius: 8, color: COLORS.score, cursor: "pointer" }}>
                  TROPHY CABINET
                </button>
                <button onClick={() => { updateTournament(null); setShowTournamentUIWrapped(false); }} style={{ padding: "10px 30px", fontSize: 14, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: "none", border: `1px solid ${COLORS.groundLine}55`, borderRadius: 8, color: COLORS.dimText, cursor: "pointer" }}>
                  BACK TO MENU
                </button>
              </div>
            </div>
            );
          })()}

          {/* Reset tournament */}
          {tournament.screen !== "select" && tournament.screen !== "draw" && tournament.screen !== "eliminated" && tournament.screen !== "champion" && (
            <div style={{ marginTop: 40, textAlign: "center" }}>
              {!resetConfirm ? (
                <button onClick={() => setResetConfirm(true)} style={{ padding: "8px 24px", fontSize: 12, fontFamily: "Oswald, sans-serif", background: "none", border: `1px solid ${COLORS.groundLine}33`, borderRadius: 6, color: COLORS.dimText, cursor: "pointer", letterSpacing: 1, opacity: 0.6 }}>
                  RESET TOURNAMENT
                </button>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                  <div style={{ fontSize: 13, color: "#ff6a6a", fontWeight: 700 }}>Reset all tournament progress?</div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => { updateTournament(null); setShowTournamentUIWrapped(false); setResetConfirm(false); }} style={{ padding: "8px 20px", fontSize: 13, fontFamily: "Oswald, sans-serif", background: "#ff6a6a22", border: "1px solid #ff6a6a55", borderRadius: 6, color: "#ff6a6a", cursor: "pointer", fontWeight: 700 }}>
                      YES, RESET
                    </button>
                    <button onClick={() => setResetConfirm(false)} style={{ padding: "8px 20px", fontSize: 13, fontFamily: "Oswald, sans-serif", background: "none", border: `1px solid ${COLORS.groundLine}55`, borderRadius: 6, color: COLORS.dimText, cursor: "pointer" }}>
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      )}

          <canvas ref={canvasRef} width={G.WIDTH} height={G.HEIGHT} style={{ width: G.WIDTH * canvasScale, height: G.HEIGHT * canvasScale, display: "block" }} onClick={startGame} />
        </div>
        {isMobile && (gameState === "playing" || gameState === "scored" || gameState === "countdown") && gameMode === "1p" && (
          <div ref={controlsRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isLandscape ? "4px 8px" : "12px 8px", maxWidth: G.WIDTH, width: "100%", userSelect: "none", WebkitUserSelect: "none", touchAction: "none" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <button data-action="left" style={mbtn}>◀</button>
              <button data-action="right" style={mbtn}>▶</button>
            </div>
            <button
              data-action="pause"
              onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }}
              style={{ ...mbtn, width: 60, height: 60, fontSize: 16, border: `2px solid ${paused ? COLORS.score : COLORS.groundLine}` }}
            >{paused ? "▶" : "⏸"}</button>
            <button data-action="jump" style={{...mbtn,width:100,fontSize:22}}>JUMP</button>
          </div>
        )}
        {isMobile && (gameState === "playing" || gameState === "scored" || gameState === "countdown") && gameMode === "2p" && (
          <div style={{ width: "100%", maxWidth: G.WIDTH, padding: isLandscape ? "4px 8px" : "8px 8px", userSelect: "none", WebkitUserSelect: "none" }}>
            {/* P1 controls */}
            <div ref={controlsRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, touchAction: "none" }}>
              <span style={{ color: p1Country.primary, fontSize: 10, fontFamily: "Oswald, sans-serif", fontWeight: 700, letterSpacing: 2, width: 24 }}>P1</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button data-action="left" style={{...mbtn, width: 70, height: 70, fontSize: 26}}>◀</button>
                <button data-action="right" style={{...mbtn, width: 70, height: 70, fontSize: 26}}>▶</button>
              </div>
              <button
                data-action="pause"
                onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }}
                style={{ ...mbtn, width: 54, height: 54, fontSize: 14, border: `2px solid ${paused ? COLORS.score : COLORS.groundLine}` }}
              >{paused ? "▶" : "⏸"}</button>
              <button data-action="jump" style={{...mbtn, width: 90, height: 70, fontSize: 20}}>JUMP</button>
            </div>
            {/* P2 controls */}
            <div ref={controlsRef2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "none" }}>
              <span style={{ color: p2Country.primary, fontSize: 10, fontFamily: "Oswald, sans-serif", fontWeight: 700, letterSpacing: 2, width: 24 }}>P2</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button data-action="left2" style={{...mbtn, width: 70, height: 70, fontSize: 26}}>◀</button>
                <button data-action="right2" style={{...mbtn, width: 70, height: 70, fontSize: 26}}>▶</button>
              </div>
              <div style={{ width: 44 }} />
              <button data-action="jump2" style={{...mbtn, width: 90, height: 70, fontSize: 20}}>JUMP</button>
            </div>
          </div>
        )}
        {isMobile && (gameState === "menu" || gameState === "gameover") && !(tournament && showTournamentUI) && (<>
          <button onClick={startGame} style={{ marginTop: 16, padding: "14px 40px", fontSize: 20, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score, color: COLORS.bg, border: "none", borderRadius: 8, cursor: "pointer", letterSpacing: 2 }}>
            {gameState === "menu" ? "START GAME" : "PLAY AGAIN"}
          </button>

        </>)}
      </div>
      <div style={{ marginTop: 14, color: COLORS.dimText, fontSize: 13, textAlign: "center", lineHeight: 1.6 }}>
        {!isMobile && (<>{gameMode === "2p" ? (
          <><span style={{ color: p1Country.primary }}>P1: A/D</span> + <span style={{ color: p1Country.primary }}>W</span> &nbsp;|&nbsp; <span style={{ color: p2Country.primary }}>P2: ←/→</span> + <span style={{ color: p2Country.primary }}>↑</span> &nbsp;|&nbsp; <span style={{ color: COLORS.dimText }}>SPACE</span> pause &nbsp;|&nbsp; First to {G.WINNING_SCORE}</>
        ) : gameMode === "sim" ? (
          <><span style={{ color: "#e0a05a" }}>📺 MATCH SIMULATOR</span> &nbsp;|&nbsp; <span style={{ color: COLORS.dimText }}>SPACE</span> pause &nbsp;|&nbsp; First to {G.WINNING_SCORE}</>
        ) : (
          <><span style={{ color: p1Country.primary }}>A/D or ←/→</span> move &nbsp;|&nbsp; <span style={{ color: p1Country.primary }}>W or ↑</span> jump &nbsp;|&nbsp; <span style={{ color: p1Country.primary }}>SPACE</span> pause &nbsp;|&nbsp; First to {G.WINNING_SCORE} wins</>
        )}</>)}
      </div>



      {/* Stats bar (1P only) */}
      {gameMode === "1p" && (stats.wins > 0 || stats.losses > 0) && (
        <div style={{
          marginTop: 10, padding: "10px 20px", borderRadius: 10,
          background: "#0a0a18", border: "1px solid #ffffff0a",
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 20, flexWrap: "wrap", maxWidth: G.WIDTH,
        }}>
          {[
            { label: "RECORD", value: `${stats.wins}W – ${stats.losses}L` },
            { label: "GOAL DIFF", value: `${stats.goalsFor - stats.goalsAgainst >= 0 ? "+" : ""}${stats.goalsFor - stats.goalsAgainst}` },
            { label: "CLEAN SHEETS", value: `🧤 ${stats.cleanSheets}` },
            { label: "WIN STREAK", value: `🔥 ${stats.currentStreak}` },
            { label: "BEST STREAK", value: `${stats.longestStreak}` },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, fontWeight: 700, fontFamily: "Oswald, sans-serif", letterSpacing: 2, color: "#ffffff28", marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "Oswald, sans-serif", color: COLORS.dimText }}>{s.value}</div>
            </div>
          ))}
          <button
            onClick={() => { if (window.confirm("Reset all stats?")) saveStats({ ...defaultStats }); }}
            style={{
              background: "none", border: "1px solid #ffffff10", borderRadius: 6,
              color: "#ffffff20", fontSize: 9, fontFamily: "Oswald, sans-serif",
              fontWeight: 700, letterSpacing: 1, padding: "4px 8px", cursor: "pointer",
            }}
          >RESET</button>
        </div>
      )}
    </div>
  );
}
