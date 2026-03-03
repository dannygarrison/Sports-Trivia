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
  { name: "Canada", flag: "🇨🇦", primary: "#d80621", highlight: "#f05a6a" },
  { name: "Mexico", flag: "🇲🇽", primary: "#006847", highlight: "#4db88a" },
  // Alphabetical
  { name: "Albania", flag: "🇦🇱", primary: "#cc0000", highlight: "#e06060" },
  { name: "Algeria", flag: "🇩🇿", primary: "#006233", highlight: "#4db87a" },
  { name: "Argentina", flag: "🇦🇷", primary: "#ffffff", highlight: "#f0f0f0", pattern: "vertical_stripes", patternColor2: "#6cace4" },
  { name: "Australia", flag: "🇦🇺", primary: "#d4a017", highlight: "#f0cc5a" },
  { name: "Austria", flag: "🇦🇹", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Belgium", flag: "🇧🇪", primary: "#ed2939", highlight: "#f27a7a" },
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
  { name: "Iran", flag: "🇮🇷", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Iraq", flag: "🇮🇶", primary: "#007a3d", highlight: "#4dc47a" },
  { name: "Italy", flag: "🇮🇹", primary: "#0066cc", highlight: "#5a9ee0" },
  { name: "Ivory Coast", flag: "🇨🇮", primary: "#f77f00", highlight: "#f7a84a" },
  { name: "Jamaica", flag: "🇯🇲", primary: "#f5c518", highlight: "#fde46a" },
  { name: "Japan", flag: "🇯🇵", primary: "#002776", highlight: "#5a6fbf" },
  { name: "Jordan", flag: "🇯🇴", primary: "#007a3d", highlight: "#4dc47a" },
  { name: "Kosovo", flag: "🇽🇰", primary: "#244aa5", highlight: "#6a8ad0" },
  { name: "Morocco", flag: "🇲🇦", primary: "#c1272d", highlight: "#e07a7a" },
  { name: "Netherlands", flag: "🇳🇱", primary: "#f36c21", highlight: "#f7a05a" },
  { name: "New Caledonia", flag: "🇳🇨", primary: "#009543", highlight: "#4dc47a" },
  { name: "New Zealand", flag: "🇳🇿", primary: "#1a1a1a", highlight: "#555555" },
  { name: "North Macedonia", flag: "🇲🇰", primary: "#ce2028", highlight: "#e07a7a" },
  { name: "Northern Ireland", flag: "☘️", primary: "#006847", highlight: "#4db88a" },
  { name: "Norway", flag: "🇳🇴", primary: "#ba0c2f", highlight: "#e06070" },
  { name: "Panama", flag: "🇵🇦", primary: "#d21034", highlight: "#e86a7a" },
  { name: "Paraguay", flag: "🇵🇾", primary: "#ffffff", highlight: "#f0f0f0", pattern: "vertical_stripes", patternColor2: "#b80020" },
  { name: "Poland", flag: "🇵🇱", primary: "#dc143c", highlight: "#e86a7a" },
  { name: "Portugal", flag: "🇵🇹", primary: "#8b0000", highlight: "#c44040" },
  { name: "Qatar", flag: "🇶🇦", primary: "#8a1538", highlight: "#b85a6a" },
  { name: "Republic of Ireland", flag: "🇮🇪", primary: "#169b62", highlight: "#5ad090" },
  { name: "Romania", flag: "🇷🇴", primary: "#002b7f", highlight: "#5a6fbf" },
  { name: "Saudi Arabia", flag: "🇸🇦", primary: "#006c35", highlight: "#4db87a" },
  { name: "Scotland", flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", primary: "#1a2253", highlight: "#3a4a8a" },
  { name: "Senegal", flag: "🇸🇳", primary: "#00853f", highlight: "#4dc47a" },
  { name: "Slovakia", flag: "🇸🇰", primary: "#0b4ea2", highlight: "#5a8ad0" },
  { name: "South Africa", flag: "🇿🇦", primary: "#007749", highlight: "#4dc48a" },
  { name: "South Korea", flag: "🇰🇷", primary: "#cd2e3a", highlight: "#e07a80" },
  { name: "Spain", flag: "🇪🇸", primary: "#c60b1e", highlight: "#e85a6a" },
  { name: "Suriname", flag: "🇸🇷", primary: "#007a3d", highlight: "#4dc47a" },
  { name: "Sweden", flag: "🇸🇪", primary: "#006aa7", highlight: "#5a9ed0" },
  { name: "Switzerland", flag: "🇨🇭", primary: "#aa0000", highlight: "#d44a4a" },
  { name: "Tunisia", flag: "🇹🇳", primary: "#c8102e", highlight: "#e06a7a" },
  { name: "Turkey", flag: "🇹🇷", primary: "#e30a17", highlight: "#f06a6a" },
  { name: "Ukraine", flag: "🇺🇦", primary: "#ffd700", highlight: "#ffe55a" },
  { name: "Uruguay", flag: "🇺🇾", primary: "#5bc0eb", highlight: "#a0ddf7" },
  { name: "Uzbekistan", flag: "🇺🇿", primary: "#0099b5", highlight: "#5ac4d0" },
  { name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", primary: "#c8102e", highlight: "#e06a7a" },
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
  const goalCelebRef = useRef(null); // { scorer, country, comment, timer }
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
    aggression: 0.7 + Math.random() * 0.3,     // how far forward they push: 0.7-1.0
    speedMult: 0.78 + Math.random() * 0.14,    // speed variance: 0.78-0.92
    jumpEagerness: 60 + Math.random() * 40,     // jump trigger distance: 60-100
    guardDist: 25 + Math.random() * 30,         // how far from goal they guard: 25-55
  });

  const initGame = useCallback(() => {
    aiStyleRef.current = { p1: randomAIStyle(), p2: randomAIStyle() };
    gameRef.current = {
      p1: makeSlime(250, true),
      p2: makeSlime(550, false),
      ball: makeBall(),
      scores: { p1: 0, p2: 0 },
      freeze: 0,
      lastKickX: G.WIDTH / 2,
    };
    setScores({ p1: 0, p2: 0 });
    setWinner(null);
  }, [makeSlime, makeBall]);

  const runAI = useCallback((slime, ball, isP1) => {
    const style = isP1 ? aiStyleRef.current.p1 : aiStyleRef.current.p2;
    if (!style) return;

    const ownGoalX = isP1 ? G.GOAL_WIDTH : G.WIDTH - G.GOAL_WIDTH;
    const ballOnMySide = isP1 ? (ball.x < G.WIDTH / 2) : (ball.x > G.WIDTH / 2);
    const ballBehind = isP1 ? (ball.x < slime.x - 10) : (ball.x > slime.x + 10);
    const ballNearOwnGoal = isP1 ? (ball.x < G.GOAL_WIDTH + 80) : (ball.x > G.WIDTH - G.GOAL_WIDTH - 80);
    const minX = G.GOAL_WIDTH + slime.r;
    const maxX = G.WIDTH - G.GOAL_WIDTH - slime.r;

    let targetX;
    const off = style.offsetX;

    if (ballBehind && ballNearOwnGoal) {
      targetX = isP1 ? ownGoalX + slime.r + 5 : ownGoalX - slime.r - 5;
    } else if (ballBehind) {
      if (isP1) {
        targetX = Math.min(ball.x - 30 + off, ownGoalX + slime.r + style.guardDist);
      } else {
        targetX = Math.max(ball.x + 30 + off, ownGoalX - slime.r - style.guardDist);
      }
      targetX = clamp(targetX, minX, maxX);
    } else if (ballOnMySide && ball.y < 300) {
      let predX = ball.x;
      let simX = ball.x, simY = ball.y, simVx = ball.vx, simVy = ball.vy;
      for (let i = 0; i < 60; i++) {
        simVy += G.GRAVITY;
        simX += simVx;
        simY += simVy;
        if (simY >= G.GROUND_Y) { predX = simX; break; }
        if (simX < 0 || simX > G.WIDTH) simVx *= -1;
      }
      predX = clamp(predX, minX, maxX);
      const approach = 20 * style.aggression;
      targetX = isP1 ? predX + approach + off : predX - approach + off;
    } else if (!ballOnMySide && (isP1 ? ball.vx > 0 : ball.vx < 0)) {
      targetX = isP1 ? ownGoalX + slime.r + style.guardDist : ownGoalX - slime.r - style.guardDist;
    } else {
      const chase = 10 * style.aggression;
      targetX = clamp(isP1 ? ball.x + chase + off : ball.x - chase + off, minX, maxX);
    }

    targetX = clamp(targetX, minX, maxX);

    const deadzone = 12;
    const speed = G.SLIME_SPEED * style.speedMult;
    if (slime.x < targetX - deadzone) slime.vx = speed;
    else if (slime.x > targetX + deadzone) slime.vx = -speed;
    else slime.vx = 0;

    const dx = ball.x - slime.x;
    const absDx = Math.abs(dx);
    if (absDx < style.jumpEagerness && ball.y < slime.y - 30 && ball.y > 80 && slime.grounded && !ballBehind) {
      slime.vy = G.JUMP_FORCE;
      slime.grounded = false;
    }
  }, []);

  const getGoalComment = useCallback((scorer, ballY, ballSpeed, lastKickX) => {
    const goalTop_ = G.GROUND_Y - G.GOAL_HEIGHT;
    const topZone = goalTop_ + G.GOAL_HEIGHT * 0.25;
    const isTopBins = ballY < topZone;

    // Distance from goal the shot was taken
    const goalX = scorer === "p1" ? G.WIDTH - G.GOAL_WIDTH : G.GOAL_WIDTH;
    const shotDist = Math.abs(lastKickX - goalX);
    const isScreener = shotDist > G.WIDTH * 0.5;
    const isPoacher = shotDist < 120;

    const isRocket = ballSpeed > 11;
    const isTapIn = ballSpeed < 4;

    // Priority order
    if (isScreener) return "💥 SCREAMER!";
    if (isTopBins) return "🎯 TOP BINS!";
    if (isPoacher && !isTapIn) return "🦊 POACHER!";
    if (isRocket) return "🚀 ROCKET!";
    if (isTapIn) return "👆 TAP IN!";

    const generic = ["🗣️ GET IN!", "🔥 CLINICAL!", "👏 THAT'S CLASS!", "💫 BEAUTY!"];
    return generic[Math.floor(Math.random() * generic.length)];
  }, []);

  const handleGoal = useCallback((scorer) => {
    const game = gameRef.current;
    const ballY = game.ball.y;
    const ballSpeed = Math.sqrt(game.ball.vx ** 2 + game.ball.vy ** 2);
    const lastKickX = game.lastKickX;

    game.scores[scorer]++;
    setScores({ ...game.scores });

    const country = scorer === "p1" ? p1CountryRef.current : p2CountryRef.current;
    const comment = getGoalComment(scorer, ballY, ballSpeed, lastKickX);
    goalCelebRef.current = { scorer, country, comment, timer: 90 };

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
        setGameState("gameover");
        setWinner(scorer);
      }, 1500);
      setGameState("scored");
      return;
    }

    game.ball = makeBall();
    game.p1 = makeSlime(250, true);
    game.p2 = makeSlime(550, false);
    game.freeze = 90;
    game.lastKickX = G.WIDTH / 2;
    keysRef.current = {};
    lastDirRef.current = null;
    lastDirRef2.current = null;
    setGameState("scored");
    setTimeout(() => setGameState("playing"), 1500);
  }, [makeBall, makeSlime, getGoalComment]);

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
        game.lastKickX = s.x;
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

      // Checkerboard pattern overlay
      if (country.pattern === "checkerboard") {
        const size = 12;
        const startX = s.x - s.r;
        const startY = s.y - s.r;
        for (let row = 0; row < Math.ceil(s.r / size); row++) {
          for (let col = 0; col < Math.ceil(s.r * 2 / size); col++) {
            if ((row + col) % 2 === 0) {
              ctx.fillStyle = country.patternColor2 || "#ffffff";
              ctx.globalAlpha = 0.8;
              ctx.fillRect(startX + col * size, startY + row * size, size, size);
            }
          }
        }
        ctx.globalAlpha = 1.0;
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
            // Blue stripe
            ctx.fillStyle = country.patternColor2;
            ctx.globalAlpha = 0.75;
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
          ctx.globalAlpha = 0.7;
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
    const bg = ctx.createRadialGradient(b.x - 3, b.y - 3, 1, b.x, b.y, b.r);
    bg.addColorStop(0, "#fff"); bg.addColorStop(1, "#bbb");
    ctx.fillStyle = bg;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#888"; ctx.lineWidth = 1; ctx.stroke();
    const sf = 1 - (G.GROUND_Y - b.y) / G.GROUND_Y;
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.beginPath(); ctx.ellipse(b.x, G.GROUND_Y + 2, b.r * (0.4 + sf * 0.5), 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // HUD - flags + scores
    ctx.font = "bold 44px Oswald, sans-serif";
    ctx.textAlign = "center";

    // P1 side
    ctx.fillStyle = c1.primary;
    ctx.fillText(game.scores.p1, G.WIDTH / 2 - 55, 48);
    ctx.fillStyle = COLORS.dimText;
    ctx.font = "bold 30px Oswald, sans-serif";
    ctx.fillText("–", G.WIDTH / 2, 46);
    // P2 side
    ctx.font = "bold 44px Oswald, sans-serif";
    ctx.fillStyle = c2.primary;
    ctx.fillText(game.scores.p2, G.WIDTH / 2 + 55, 48);

    // Flag + country labels
    ctx.font = "24px sans-serif";
    ctx.fillText(c1.flag, G.WIDTH / 2 - 120, 46);
    ctx.fillText(c2.flag, G.WIDTH / 2 + 120, 46);

    ctx.font = "11px Oswald, sans-serif";
    ctx.fillStyle = COLORS.dimText;
    ctx.fillText(c1.name.toUpperCase(), G.WIDTH / 2 - 55, 64);
    ctx.fillText(c2.name.toUpperCase(), G.WIDTH / 2 + 55, 64);

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
      ctx.fillStyle = celeb.country.primary;
      ctx.fillText(`${celeb.country.flag}  ${celeb.country.name.toUpperCase()}`, 0, 18);

      // Comment
      ctx.font = "bold 18px Oswald, sans-serif";
      ctx.fillStyle = COLORS.score;
      ctx.fillText(celeb.comment, 0, 50);

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
      ctx.fillText("SLIME CUP EDITION", G.WIDTH / 2, 158);
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
      ctx.fillText("PRESS SPACE TO PLAY AGAIN", G.WIDTH / 2, 310);
    }
  }, [gameState, draw, initGame, winner, isMobile, p1Country, p2Country, gameMode, stats]);

  const startGame = () => {
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
    width: 60, height: 60, borderRadius: 12,
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
        <link rel="canonical" href="https://trivialsports.com/games/slime-soccer" />
      </Helmet>      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;700&display=swap" rel="stylesheet" />
      {!(isMobile && isLandscape) && (
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: COLORS.dimText, textTransform: "uppercase", marginBottom: 2 }}>TrivialSports.com</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: COLORS.score, margin: 0, lineHeight: 1 }}>SLIME ⚽ SOCCER</h1>
        <div style={{ fontSize: 12, color: "#d4a84377", letterSpacing: 3, marginTop: 2 }}>SLIME CUP EDITION</div>
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
              const c = COUNTRIES.find(c => c.name === e.target.value);
              if (c) setP1Country(c);
            }}
            style={{ ...selectStyle, borderColor: p1Country.primary + "88" }}
          >
            {COUNTRIES.map(c => (
              <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => {
            const i = Math.floor(Math.random() * COUNTRIES.length);
            let j; do { j = Math.floor(Math.random() * COUNTRIES.length); } while (j === i);
            setP1Country(COUNTRIES[i]);
            setP2Country(COUNTRIES[j]);
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
              const c = COUNTRIES.find(c => c.name === e.target.value);
              if (c) setP2Country(c);
            }}
            style={{ ...selectStyle, borderColor: p2Country.primary + "88" }}
          >
            {COUNTRIES.map(c => (
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
                const c = COUNTRIES.find(c => c.name === e.target.value);
                if (c) setP1Country(c);
              }}
              style={{ ...selectStyle, borderColor: p1Country.primary + "88", flex: 1, minWidth: 0 }}
            >
              {COUNTRIES.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: COLORS.dimText, fontSize: 11, letterSpacing: 1, width: 30, textAlign: "right" }}>CPU</span>
            <select
              value={p2Country.name}
              onChange={(e) => {
                const c = COUNTRIES.find(c => c.name === e.target.value);
                if (c) setP2Country(c);
              }}
              style={{ ...selectStyle, borderColor: p2Country.primary + "88", flex: 1, minWidth: 0 }}
            >
              {COUNTRIES.map(c => (
                <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => {
            const i = Math.floor(Math.random() * COUNTRIES.length);
            let j; do { j = Math.floor(Math.random() * COUNTRIES.length); } while (j === i);
            setP1Country(COUNTRIES[i]);
            setP2Country(COUNTRIES[j]);
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
              style={{ ...mbtn, width: 50, height: 50, fontSize: 14, border: `2px solid ${paused ? COLORS.score : COLORS.groundLine}` }}
            >{paused ? "▶" : "⏸"}</button>
            <button data-action="jump" style={{...mbtn,width:80,fontSize:18}}>JUMP</button>
          </div>
        )}
        {isMobile && (gameState === "playing" || gameState === "scored" || gameState === "countdown") && gameMode === "2p" && (
          <div style={{ width: "100%", maxWidth: G.WIDTH, padding: isLandscape ? "4px 8px" : "8px 8px", userSelect: "none", WebkitUserSelect: "none" }}>
            {/* P1 controls */}
            <div ref={controlsRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, touchAction: "none" }}>
              <span style={{ color: p1Country.primary, fontSize: 10, fontFamily: "Oswald, sans-serif", fontWeight: 700, letterSpacing: 2, width: 24 }}>P1</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button data-action="left" style={{...mbtn, width: 50, height: 50, fontSize: 20}}>◀</button>
                <button data-action="right" style={{...mbtn, width: 50, height: 50, fontSize: 20}}>▶</button>
              </div>
              <button
                data-action="pause"
                onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }}
                style={{ ...mbtn, width: 44, height: 44, fontSize: 12, border: `2px solid ${paused ? COLORS.score : COLORS.groundLine}` }}
              >{paused ? "▶" : "⏸"}</button>
              <button data-action="jump" style={{...mbtn, width: 70, height: 50, fontSize: 16}}>JUMP</button>
            </div>
            {/* P2 controls */}
            <div ref={controlsRef2} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", touchAction: "none" }}>
              <span style={{ color: p2Country.primary, fontSize: 10, fontFamily: "Oswald, sans-serif", fontWeight: 700, letterSpacing: 2, width: 24 }}>P2</span>
              <div style={{ display: "flex", gap: 8 }}>
                <button data-action="left2" style={{...mbtn, width: 50, height: 50, fontSize: 20}}>◀</button>
                <button data-action="right2" style={{...mbtn, width: 50, height: 50, fontSize: 20}}>▶</button>
              </div>
              <div style={{ width: 44 }} />
              <button data-action="jump2" style={{...mbtn, width: 70, height: 50, fontSize: 16}}>JUMP</button>
            </div>
          </div>
        )}
        {isMobile && (gameState === "menu" || gameState === "gameover") && (
          <button onClick={startGame} style={{ marginTop: 16, padding: "14px 40px", fontSize: 20, fontWeight: 700, fontFamily: "Oswald, sans-serif", background: COLORS.score, color: COLORS.bg, border: "none", borderRadius: 8, cursor: "pointer", letterSpacing: 2 }}>
            {gameState === "menu" ? "START GAME" : "PLAY AGAIN"}
          </button>
        )}
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
