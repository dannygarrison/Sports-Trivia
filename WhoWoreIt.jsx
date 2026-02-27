import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

/*
  WHO WORE IT?
  Show a jersey number + team - name famous players who wore it.
  Focused on retired/iconic numbers for evergreen SEO.
  Each entry can have multiple correct players.
*/

const JERSEY_DATA = [
  // NFL Retired & Iconic Numbers
  { number: 12, team: "New England Patriots", sport: "NFL", players: ["Tom Brady"], hints: ["6x Super Bowl champion with this team"] },
  { number: 12, team: "Green Bay Packers", sport: "NFL", players: ["Aaron Rodgers"], hints: ["4x MVP"] },

  { number: 80, team: "San Francisco 49ers", sport: "NFL", players: ["Jerry Rice"], hints: ["Greatest wide receiver of all time"] },
  { number: 16, team: "San Francisco 49ers", sport: "NFL", players: ["Joe Montana"], hints: ["Joe Cool, 4x Super Bowl champion"] },
  { number: 18, team: "Indianapolis Colts", sport: "NFL", players: ["Peyton Manning"], hints: ["The Sheriff"] },
  { number: 18, team: "Denver Broncos", sport: "NFL", players: ["Peyton Manning"], hints: ["Won Super Bowl 50 with this team"] },
  { number: 7, team: "Denver Broncos", sport: "NFL", players: ["John Elway"], hints: ["Back-to-back Super Bowls to end career"] },
  { number: 34, team: "Chicago Bears", sport: "NFL", players: ["Walter Payton"], hints: ["Sweetness"] },
  { number: 20, team: "Detroit Lions", sport: "NFL", players: ["Barry Sanders"], hints: ["Retired at his peak, 15,269 rushing yards"] },
  { number: 32, team: "Cleveland Browns", sport: "NFL", players: ["Jim Brown"], hints: ["Many consider him the GOAT running back"] },
  { number: 22, team: "Dallas Cowboys", sport: "NFL", players: ["Emmitt Smith"], hints: ["NFL's all-time leading rusher"] },
  { number: 8, team: "Dallas Cowboys", sport: "NFL", players: ["Troy Aikman"], hints: ["3x Super Bowl champion, Hall of Fame QB"] },
  { number: 88, team: "Dallas Cowboys", sport: "NFL", players: ["Michael Irvin", "Dez Bryant", "CeeDee Lamb"], hints: ["The Playmaker wore it first"] },
  { number: 21, team: "Dallas Cowboys", sport: "NFL", players: ["Deion Sanders"], hints: ["Prime Time, also played baseball"] },
  { number: 9, team: "New Orleans Saints", sport: "NFL", players: ["Drew Brees"], hints: ["Held passing yards record until 2021"] },
  { number: 85, team: "Cincinnati Bengals", sport: "NFL", players: ["Chad Johnson"], hints: ["Ochocinco"] },
  { number: 81, team: "San Francisco 49ers", sport: "NFL", players: ["Terrell Owens"], hints: ["Celebrated on the Dallas star"] },
  { number: 84, team: "Minnesota Vikings", sport: "NFL", players: ["Randy Moss"], hints: ["Straight cash, homie"] },
  { number: 81, team: "New England Patriots", sport: "NFL", players: ["Randy Moss"], hints: ["23 TDs in 2007, single-season record"] },
  { number: 20, team: "Philadelphia Eagles", sport: "NFL", players: ["Brian Dawkins"], hints: ["Weapon X"] },
  { number: 92, team: "New York Giants", sport: "NFL", players: ["Michael Strahan"], hints: ["Single-season sack record holder"] },
  { number: 56, team: "New York Giants", sport: "NFL", players: ["Lawrence Taylor"], hints: ["LT, greatest defensive player ever"] },
  { number: 52, team: "Baltimore Ravens", sport: "NFL", players: ["Ray Lewis"], hints: ["13x Pro Bowl linebacker"] },
  { number: 75, team: "Pittsburgh Steelers", sport: "NFL", players: ["Joe Greene"], hints: ["Mean Joe"] },
  { number: 43, team: "Pittsburgh Steelers", sport: "NFL", players: ["Troy Polamalu"], hints: ["Famous for his hair and ball-hawking"] },
  { number: 26, team: "Pittsburgh Steelers", sport: "NFL", players: ["Rod Woodson", "Le'Veon Bell"], hints: ["Hall of Fame cornerback wore it first"] },
  { number: 58, team: "Denver Broncos", sport: "NFL", players: ["Von Miller"], hints: ["Super Bowl 50 MVP"] },
  { number: 19, team: "Baltimore Colts", sport: "NFL", players: ["Johnny Unitas"], hints: ["The Golden Arm, pioneered the modern QB"] },
  { number: 32, team: "Buffalo Bills", sport: "NFL", players: ["O.J. Simpson"], hints: ["2,003 rushing yards in 14 games (1973)"] },
  { number: 34, team: "Houston Oilers", sport: "NFL", players: ["Earl Campbell"], hints: ["The Tyler Rose"] },

  { number: 28, team: "St. Louis Rams", sport: "NFL", players: ["Marshall Faulk"], hints: ["Greatest Show on Turf, 2000 MVP"] },
  { number: 21, team: "Washington Redskins", sport: "NFL", players: ["Sean Taylor"], hints: ["Tragic loss, one of the hardest-hitting safeties ever"] },
  { number: 15, team: "Kansas City Chiefs", sport: "NFL", players: ["Patrick Mahomes"], hints: ["2x Super Bowl MVP"] },
  { number: 87, team: "Kansas City Chiefs", sport: "NFL", players: ["Travis Kelce"], hints: ["All-time great tight end"] },
  { number: 13, team: "Miami Dolphins", sport: "NFL", players: ["Dan Marino"], hints: ["First QB to throw 5,000 yards in a season"] },
  { number: 12, team: "Miami Dolphins", sport: "NFL", players: ["Bob Griese"], hints: ["Led the 1972 perfect season"] },
  { number: 12, team: "Pittsburgh Steelers", sport: "NFL", players: ["Terry Bradshaw"], hints: ["4x Super Bowl champion"] },
  { number: 16, team: "Kansas City Chiefs", sport: "NFL", players: ["Len Dawson"], hints: ["Super Bowl IV MVP"] },
  { number: 12, team: "New York Jets", sport: "NFL", players: ["Joe Namath"], hints: ["Guaranteed a Super Bowl III win"] },
  // New NFL entries
  { number: 10, team: "New York Giants", sport: "NFL", players: ["Eli Manning"], hints: ["Beat the undefeated Patriots, twice"] },
  { number: 7, team: "Pittsburgh Steelers", sport: "NFL", players: ["Ben Roethlisberger"], hints: ["Big Ben, 2x Super Bowl champion"] },
  { number: 28, team: "Minnesota Vikings", sport: "NFL", players: ["Adrian Peterson"], hints: ["2,097 rushing yards in 2012, 2012 MVP"] },
  { number: 5, team: "Baltimore Ravens", sport: "NFL", players: ["Joe Flacco"], hints: ["Super Bowl XLVII MVP, 11 straight postseason wins"] },
  { number: 55, team: "San Diego Chargers", sport: "NFL", players: ["Junior Seau"], hints: ["12x Pro Bowl, tragic ending"] },
  { number: 94, team: "Dallas Cowboys", sport: "NFL", players: ["DeMarcus Ware"], hints: ["2nd all-time in Cowboys sack history"] },
  { number: 54, team: "Chicago Bears", sport: "NFL", players: ["Brian Urlacher"], hints: ["8x Pro Bowl, anchor of the 2006 Bears"] },
  { number: 24, team: "Green Bay Packers", sport: "NFL", players: ["Charles Woodson"], hints: ["Heisman winner, 2009 DPOY, Super Bowl XLV champion"] },
  { number: 5, team: "Green Bay Packers", sport: "NFL", players: ["Paul Hornung"], hints: ["The Golden Boy, 1956 Heisman winner"] },
  { number: 99, team: "Houston Texans", sport: "NFL", players: ["J.J. Watt"], hints: ["3x DPOY, dominated the 2010s"] },
  { number: 29, team: "Los Angeles Rams", sport: "NFL", players: ["Eric Dickerson"], hints: ["Single-season rushing record, 2,105 yards in 1984"] },
  { number: 2, team: "Atlanta Falcons", sport: "NFL", players: ["Matt Ryan"], hints: ["Matty Ice, 2016 MVP"] },
  { number: 11, team: "New York Giants", sport: "NFL", players: ["Phil Simms"], hints: ["Super Bowl XXI MVP, 22 of 25 passing"] },
  { number: 14, team: "San Diego Chargers", sport: "NFL", players: ["Dan Fouts"], hints: ["Air Coryell QB, Hall of Famer"] },
  { number: 78, team: "Buffalo Bills", sport: "NFL", players: ["Bruce Smith"], hints: ["All-time sack leader with 200 career sacks"] },
  { number: 92, team: "Green Bay Packers", sport: "NFL", players: ["Reggie White"], hints: ["Minister of Defense, 198 career sacks"] },
  { number: 33, team: "Dallas Cowboys", sport: "NFL", players: ["Tony Dorsett"], hints: ["1977 Rookie of the Year, 99-yard TD run"] },
  { number: 44, team: "Chicago Bears", sport: "NFL", players: ["Gale Sayers"], hints: ["The Kansas Comet, 6 TDs in one game"] },
  { number: 81, team: "Detroit Lions", sport: "NFL", players: ["Calvin Johnson"], hints: ["Megatron, retired at 30"] },
  { number: 17, team: "Los Angeles Chargers", sport: "NFL", players: ["Philip Rivers"], hints: ["63,440 career passing yards, 8 kids"] },
  { number: 8, team: "Baltimore Ravens", sport: "NFL", players: ["Lamar Jackson"], hints: ["2x MVP, revolutionized QB running"] },
  { number: 86, team: "Pittsburgh Steelers", sport: "NFL", players: ["Hines Ward"], hints: ["Super Bowl XL MVP, always smiling"] },
  { number: 80, team: "Denver Broncos", sport: "NFL", players: ["Rod Smith"], hints: ["Undrafted, all-time Broncos receiving leader"] },
  { number: 24, team: "Oakland Raiders", sport: "NFL", players: ["Charles Woodson", "Willie Brown"], hints: ["Two Hall of Fame DBs in silver and black"] },
  { number: 89, team: "Chicago Bears", sport: "NFL", players: ["Mike Ditka"], hints: ["Iron Mike, won a title as player and coach here"] },
  { number: 25, team: "Seattle Seahawks", sport: "NFL", players: ["Richard Sherman"], hints: ["Best corner you've seen, tip in the NFC Championship"] },
  { number: 31, team: "Dallas Cowboys", sport: "NFL", players: ["Roy Williams"], hints: ["5x Pro Bowl safety in the early 2000s"] },
  // NBA Retired & Iconic Numbers
  { number: 23, team: "Chicago Bulls", sport: "NBA", players: ["Michael Jordan"], hints: ["His Airness, 6x NBA champion"] },
  { number: 23, team: "Cleveland Cavaliers", sport: "NBA", players: ["LeBron James"], hints: ["The King, first stint and return"] },
  { number: 6, team: "Miami Heat", sport: "NBA", players: ["LeBron James"], hints: ["Won 2 titles here"] },
  { number: 33, team: "Chicago Bulls", sport: "NBA", players: ["Scottie Pippen"], hints: ["MJ's right-hand man"] },
  { number: 24, team: "Los Angeles Lakers", sport: "NBA", players: ["Kobe Bryant"], hints: ["Black Mamba, later number"] },
  { number: 8, team: "Los Angeles Lakers", sport: "NBA", players: ["Kobe Bryant"], hints: ["Kobe's first number, 3 titles wearing it"] },
  { number: 34, team: "Los Angeles Lakers", sport: "NBA", players: ["Shaquille O'Neal"], hints: ["Most dominant center of his era"] },
  { number: 32, team: "Los Angeles Lakers", sport: "NBA", players: ["Magic Johnson"], hints: ["Showtime, 5x NBA champion"] },
  { number: 33, team: "Los Angeles Lakers", sport: "NBA", players: ["Kareem Abdul-Jabbar"], hints: ["All-time scoring leader until 2023"] },
  { number: 33, team: "Boston Celtics", sport: "NBA", players: ["Larry Bird"], hints: ["The Hick from French Lick"] },
  { number: 6, team: "Boston Celtics", sport: "NBA", players: ["Bill Russell"], hints: ["11 championships, league retired #6"] },
  { number: 21, team: "San Antonio Spurs", sport: "NBA", players: ["Tim Duncan"], hints: ["The Big Fundamental, 5x champion"] },
  { number: 3, team: "Philadelphia 76ers", sport: "NBA", players: ["Allen Iverson"], hints: ["The Answer, pound for pound toughest"] },
  { number: 15, team: "Toronto Raptors", sport: "NBA", players: ["Vince Carter"], hints: ["Greatest dunker ever, 2000 Dunk Contest"] },
  { number: 21, team: "Minnesota Timberwolves", sport: "NBA", players: ["Kevin Garnett"], hints: ["The Big Ticket, 2004 MVP"] },
  { number: 1, team: "Orlando Magic", sport: "NBA", players: ["Penny Hardaway", "Tracy McGrady"], hints: ["Two superstars in succession"] },
  { number: 34, team: "Houston Rockets", sport: "NBA", players: ["Hakeem Olajuwon"], hints: ["The Dream, back-to-back titles"] },
  { number: 12, team: "Utah Jazz", sport: "NBA", players: ["John Stockton"], hints: ["All-time assists and steals leader"] },
  { number: 32, team: "Utah Jazz", sport: "NBA", players: ["Karl Malone"], hints: ["The Mailman, 2x MVP"] },
  { number: 3, team: "Miami Heat", sport: "NBA", players: ["Dwyane Wade"], hints: ["Flash, 3x NBA champion"] },
  { number: 30, team: "Golden State Warriors", sport: "NBA", players: ["Stephen Curry"], hints: ["Greatest shooter of all time"] },
  { number: 35, team: "Golden State Warriors", sport: "NBA", players: ["Kevin Durant"], hints: ["2x Finals MVP with this team"] },
  { number: 13, team: "Houston Rockets", sport: "NBA", players: ["James Harden"], hints: ["The Beard, 2018 MVP"] },
  { number: 41, team: "Dallas Mavericks", sport: "NBA", players: ["Dirk Nowitzki"], hints: ["Only player to play 21 seasons with one team"] },
  // New NBA entries
  { number: 20, team: "San Antonio Spurs", sport: "NBA", players: ["Manu Ginobili"], hints: ["Argentinian legend, EuroStep pioneer, 4x champion"] },
  { number: 9, team: "San Antonio Spurs", sport: "NBA", players: ["Tony Parker"], hints: ["French point guard, 2007 Finals MVP"] },
  { number: 34, team: "Phoenix Suns", sport: "NBA", players: ["Charles Barkley"], hints: ["Round Mound of Rebound, 1993 MVP"] },
  { number: 91, team: "Chicago Bulls", sport: "NBA", players: ["Dennis Rodman"], hints: ["The Worm, greatest rebounder ever"] },
  { number: 10, team: "Sacramento Kings", sport: "NBA", players: ["Mike Bibby"], hints: ["Led the 2002 Kings to Game 7 of the WCF"] },
  { number: 25, team: "Cleveland Cavaliers", sport: "NBA", players: ["Mark Price"], hints: ["90% free throw shooter, 4x All-Star"] },
  { number: 1, team: "Chicago Bulls", sport: "NBA", players: ["Derrick Rose"], hints: ["Youngest MVP ever at age 22"] },
  { number: 50, team: "San Antonio Spurs", sport: "NBA", players: ["David Robinson"], hints: ["The Admiral, 1995 MVP"] },
  { number: 55, team: "Denver Nuggets", sport: "NBA", players: ["Dikembe Mutombo"], hints: ["Finger-wagging shot blocker"] },
  { number: 4, team: "Detroit Pistons", sport: "NBA", players: ["Joe Dumars"], hints: ["Bad Boys guard, 1989 Finals MVP"] },
  { number: 11, team: "Detroit Pistons", sport: "NBA", players: ["Isiah Thomas"], hints: ["Zeke, led the Bad Boys to back-to-back titles"] },
  { number: 10, team: "Detroit Pistons", sport: "NBA", players: ["Dennis Rodman"], hints: ["Wore this before switching to 91 in Chicago"] },

  { number: 22, team: "Portland Trail Blazers", sport: "NBA", players: ["Clyde Drexler"], hints: ["Clyde the Glide, 1992 Dream Team"] },
  { number: 33, team: "New York Knicks", sport: "NBA", players: ["Patrick Ewing"], hints: ["Georgetown legend, 11x All-Star"] },
  { number: 10, team: "New York Knicks", sport: "NBA", players: ["Walt Frazier"], hints: ["Clyde, 1970 Finals Game 7 legend"] },
  { number: 15, team: "Denver Nuggets", sport: "NBA", players: ["Carmelo Anthony"], hints: ["Scoring machine, 2003 draft class"] },
  { number: 21, team: "Philadelphia 76ers", sport: "NBA", players: ["Joel Embiid"], hints: ["The Process, 2023 MVP"] },
  { number: 7, team: "New York Knicks", sport: "NBA", players: ["Carmelo Anthony"], hints: ["Melo, led Knicks to 54 wins in 2013"] },
  { number: 0, team: "Portland Trail Blazers", sport: "NBA", players: ["Damian Lillard"], hints: ["Dame Time, 0.9 second buzzer beater vs Houston"] },
  { number: 2, team: "Cleveland Cavaliers", sport: "NBA", players: ["Kyrie Irving"], hints: ["Uncle Drew, hit the shot in Game 7 of 2016 Finals"] },
  { number: 5, team: "Boston Celtics", sport: "NBA", players: ["Kevin Garnett"], hints: ["ANYTHING IS POSSIBLE after 2008 title"] },
  { number: 34, team: "Boston Celtics", sport: "NBA", players: ["Paul Pierce"], hints: ["The Truth, 2008 Finals MVP"] },
  { number: 20, team: "Seattle SuperSonics", sport: "NBA", players: ["Gary Payton"], hints: ["The Glove, 1996 DPOY"] },
  { number: 40, team: "Seattle SuperSonics", sport: "NBA", players: ["Shawn Kemp"], hints: ["Reign Man, iconic dunker of the 90s"] },
  { number: 13, team: "Phoenix Suns", sport: "NBA", players: ["Steve Nash"], hints: ["Canadian point god, back-to-back MVPs 2005-06"] },
];

const SPORT_COLORS = { NFL: "#e74c3c", NBA: "#e67e22" };
const ROUND_SIZE = 12;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[''`\.]/g, "")
    .replace(/\s+/g, " ");
}

function matchesAnyPlayer(input, players) {
  const ni = normalize(input);
  if (!ni || ni.length < 3) return null;
  for (const player of players) {
    const np = normalize(player);
    if (np === ni) return player;
    // Last name
    const parts = np.split(" ");
    const last = parts[parts.length - 1];
    if (last.length > 3 && last === ni) return player;
  }
  return null;
}

export default function WhoWoreIt() {
  const trackPlay = usePlayCount("who-wore-it");

  const roundItems = useMemo(() => shuffle(JERSEY_DATA).slice(0, ROUND_SIZE), []);

  const [qIdx, setQIdx] = useState(0);
  const [foundPlayers, setFoundPlayers] = useState(new Set()); // found player names for current question
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flash, setFlash] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [results, setResults] = useState([]); // [{found, total}]
  const [gameOver, setGameOver] = useState(false);
  const inputRef = useRef(null);

  const item = roundItems[qIdx] || null;
  const allFound = item && foundPlayers.size === item.players.length;

  useEffect(() => {
    if (item && !showAnswer && !gameOver) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [qIdx, item, showAnswer, gameOver]);

  const handleInput = useCallback((val) => {
    setInput(val);
    if (!item || showAnswer) return;
    const match = matchesAnyPlayer(val, item.players);
    if (match && !foundPlayers.has(match)) {
      trackPlay();
      setFoundPlayers(prev => {
        const next = new Set(prev);
        next.add(match);
        return next;
      });
      setInput("");
      setFlash(match);
      setTimeout(() => setFlash(null), 600);
      setScore(s => s + 1);
    }
  }, [item, showAnswer, foundPlayers, trackPlay]);

  const handleRevealAndNext = () => {
    if (!showAnswer) {
      // Reveal answer
      setShowAnswer(true);
      setResults(prev => [...prev, { found: foundPlayers.size, total: item.players.length }]);
      setTotalPossible(tp => tp + item.players.length);
    } else {
      // Next question
      if (qIdx + 1 >= roundItems.length) {
        setGameOver(true);
      } else {
        setQIdx(i => i + 1);
        setFoundPlayers(new Set());
        setInput("");
        setShowAnswer(false);
        setShowHint(false);
        setHintUsed(false);
      }
    }
  };

  // Auto-advance to next question when all players found
  useEffect(() => {
    if (allFound && !showAnswer) {
      setResults(prev => [...prev, { found: foundPlayers.size, total: item.players.length }]);
      setTotalPossible(tp => tp + item.players.length);
      setTimeout(() => {
        if (qIdx + 1 >= roundItems.length) {
          setGameOver(true);
        } else {
          setQIdx(i => i + 1);
          setFoundPlayers(new Set());
          setInput("");
          setShowAnswer(false);
          setShowHint(false);
          setHintUsed(false);
        }
      }, 800);
    }
  }, [allFound, showAnswer, foundPlayers.size, item, qIdx, roundItems.length]);

  const handleShare = () => {
    const text = `Who Wore It? – ${score}/${totalPossible} players named\n🏅 ${ROUND_SIZE} jersey numbers\ntrivialsports.com/games/who-wore-it`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  const handlePlayAgain = () => window.location.reload();

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d1f 0%, #07070f 60%)",
      color: "#f0f0f0", fontFamily: "'Oswald', sans-serif", padding: "84px 16px 60px",
    }}>
      <Helmet>
        <title>Who Wore It? Jersey Number Trivia – TrivialSports</title>
        <meta name="description" content="Can you name the famous players who wore iconic jersey numbers? NFL and NBA jersey number trivia at TrivialSports." />
        <meta property="og:title" content="Who Wore It? Jersey Number Trivia – TrivialSports" />
        <meta property="og:description" content="Can you name the famous players who wore iconic jersey numbers? NFL and NBA trivia." />
        <meta property="og:url" content="https://trivialsports.com/games/who-wore-it" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        @keyframes jerseyPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.03); } }
        input::placeholder { color: #ffffff15; }
        input:focus { outline: none !important; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 600, margin: "0 auto 28px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>
              NFL &amp; NBA Trivia
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              Who Wore It?
            </h1>
            <p style={{ fontSize: 13, color: "#c8a050", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Name who iconically wore the jersey number. {ROUND_SIZE} questions per round.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Score</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {score}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Question</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {Math.min(qIdx + 1, ROUND_SIZE)}<span style={{ fontSize: 14, color: "#c8a05099" }}>/{ROUND_SIZE}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 3, background: "#ffffff06", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${((qIdx + (showAnswer ? 1 : 0)) / ROUND_SIZE) * 100}%`,
            background: "linear-gradient(90deg, #c8a050, #e8c070)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Game Area */}
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        {gameOver ? (
          /* Results */
          <div style={{
            background: "linear-gradient(135deg,#0f0d00,#1a1500)",
            border: "1px solid #c8a05044", borderRadius: 18,
            padding: "36px 28px", textAlign: "center",
            animation: "popIn 0.4s ease both",
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a05088", marginBottom: 8 }}>
              Final Score
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#c8a050", lineHeight: 1 }}>
              {score}<span style={{ fontSize: 24, color: "#c8a05088" }}>/{totalPossible}</span>
            </div>
            <div style={{ fontSize: 14, color: "#c8a050", marginTop: 8, fontFamily: "Georgia, serif" }}>
              players named across {ROUND_SIZE} jersey numbers
            </div>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 5,
                  background: r.found === r.total ? "#22c55e22" : r.found > 0 ? "#c8a05022" : "#e74c3c22",
                  border: `1px solid ${r.found === r.total ? "#22c55e44" : r.found > 0 ? "#c8a05044" : "#e74c3c44"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: r.found === r.total ? "#22c55e" : r.found > 0 ? "#c8a050" : "#e74c3c44",
                }}>{r.found}/{r.total}</div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <button onClick={handlePlayAgain} style={{
                fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "12px 28px", borderRadius: 10, cursor: "pointer",
                border: "1px solid #c8a05055", background: "#c8a050", color: "#07070f",
                fontFamily: "'Oswald', sans-serif",
              }}>Play Again</button>
              <button onClick={handleShare} style={{
                fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "12px 28px", borderRadius: 10, cursor: "pointer",
                border: "1px solid #c8a05044", background: "transparent", color: "#c8a050",
                fontFamily: "'Oswald', sans-serif",
              }}>Share</button>
            </div>
          </div>
        ) : item ? (
          /* Question */
          <div key={qIdx} style={{ animation: "fadeUp 0.35s ease both" }}>
            {/* Jersey display */}
            <div style={{
              textAlign: "center", marginBottom: 24,
              animation: "jerseyPulse 2s ease infinite",
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
                color: SPORT_COLORS[item.sport] || "#c8a050",
                background: (SPORT_COLORS[item.sport] || "#c8a050") + "18",
                padding: "4px 12px", borderRadius: 5,
              }}>{item.sport}</span>

              <div style={{
                marginTop: 16, display: "inline-flex", flexDirection: "column",
                alignItems: "center", padding: "28px 48px",
                background: "linear-gradient(135deg, #0e0e22, #141432)",
                border: "2px solid #ffffff15", borderRadius: 20,
                boxShadow: "0 8px 30px #00000066",
              }}>
                <div style={{
                  fontSize: 72, fontWeight: 900, color: "#ffffff",
                  lineHeight: 1, letterSpacing: -2,
                  textShadow: `0 0 40px ${SPORT_COLORS[item.sport] || "#c8a050"}22`,
                }}>#{item.number}</div>
                <div style={{
                  fontSize: 14, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase", color: "#c8a05099", marginTop: 8,
                }}>{item.team}</div>
                {item.players.length > 1 && !showAnswer && (
                  <div style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: 2,
                    textTransform: "uppercase", color: "#ffffff22", marginTop: 8,
                  }}>{foundPlayers.size}/{item.players.length} players</div>
                )}
              </div>
            </div>

            {/* Found players */}
            {foundPlayers.size > 0 && (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {[...foundPlayers].map(p => (
                  <span key={p} style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: 1,
                    color: "#22c55e", background: "#22c55e18",
                    padding: "4px 12px", borderRadius: 6,
                    border: "1px solid #22c55e33",
                    fontFamily: "'Oswald', sans-serif", textTransform: "uppercase",
                  }}>✓ {p}</span>
                ))}
              </div>
            )}

            {/* Revealed (missed) players */}
            {showAnswer && item.players.filter(p => !foundPlayers.has(p)).length > 0 && (
              <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
                {item.players.filter(p => !foundPlayers.has(p)).map(p => (
                  <span key={p} style={{
                    fontSize: 12, fontWeight: 700, letterSpacing: 1,
                    color: "#e74c3c88", background: "#e74c3c0f",
                    padding: "4px 12px", borderRadius: 6,
                    border: "1px solid #e74c3c33",
                    fontFamily: "'Oswald', sans-serif", textTransform: "uppercase",
                  }}>{p}</span>
                ))}
              </div>
            )}

            {/* Hint */}
            {showHint && !showAnswer && item.hints[0] && (
              <div style={{
                textAlign: "center", marginBottom: 16,
                animation: "fadeUp 0.3s ease both",
              }}>
                <span style={{
                  fontSize: 12, color: "#c8a050", fontFamily: "Georgia, serif",
                  fontStyle: "italic",
                }}>Hint: {item.hints[0]}</span>
              </div>
            )}

            {/* Input */}
            {!showAnswer && !allFound && (
              <div style={{ maxWidth: 400, margin: "0 auto 16px" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => handleInput(e.target.value)}
                  placeholder="Type player name..."
                  style={{
                    width: "100%", background: "#0c0c1e", border: "1px solid #ffffff18",
                    borderRadius: 12, padding: "14px 18px", color: "#ffffff",
                    fontSize: 16, fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                    letterSpacing: 1, outline: "none", boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = "#c8a05066"}
                  onBlur={e => e.target.style.borderColor = "#ffffff18"}
                />
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
              {!showAnswer && !allFound && !showHint && (
                <button onClick={() => setShowHint(true)} style={{
                  fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                  padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                  border: "1px solid #c8a05033", background: "transparent", color: "#c8a05088",
                  fontFamily: "'Oswald', sans-serif",
                }}>Hint</button>
              )}
              <button onClick={handleRevealAndNext} style={{
                fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "10px 24px", borderRadius: 8, cursor: "pointer",
                border: showAnswer ? "1px solid #c8a05055" : "1px solid #ffffff22",
                background: showAnswer ? "#c8a050" : "transparent",
                color: showAnswer ? "#07070f" : "#ffffff66",
                fontFamily: "'Oswald', sans-serif",
              }}>{showAnswer ? (qIdx + 1 >= ROUND_SIZE ? "See Results" : "Next →") : "Skip / Reveal"}</button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 600, margin: "24px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>
          Last names accepted · Iconic &amp; retired numbers across NFL &amp; NBA
        </div>
      </div>
    </div>
  );
}
