import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

/*
  WHO HAS MORE?
  Pick the player with the higher career stat.
  Data: retired + long-career players for evergreen stability.
  Each pair: [playerA, statA, playerB, statB, category, unit]
*/

const PAIRS = [
  // NFL – Career Passing Yards
  { a: "Tom Brady", aVal: 89214, b: "Drew Brees", bVal: 80358, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Peyton Manning", aVal: 71940, b: "Brett Favre", bVal: 71838, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Drew Brees", aVal: 80358, b: "Peyton Manning", bVal: 71940, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Dan Marino", aVal: 61361, b: "Philip Rivers", bVal: 63440, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Ben Roethlisberger", aVal: 64088, b: "Eli Manning", bVal: 57023, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Matt Ryan", aVal: 62792, b: "Matthew Stafford", bVal: 56837, cat: "Career Passing Yards", sport: "NFL" },
  { a: "John Elway", aVal: 51475, b: "Dan Marino", bVal: 61361, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Brett Favre", aVal: 71838, b: "Philip Rivers", bVal: 63440, cat: "Career Passing Yards", sport: "NFL" },

  // NFL – Career Rushing Yards
  { a: "Emmitt Smith", aVal: 18355, b: "Walter Payton", bVal: 16726, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Barry Sanders", aVal: 15269, b: "Frank Gore", bVal: 16000, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Adrian Peterson", aVal: 14918, b: "LaDainian Tomlinson", bVal: 13684, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Curtis Martin", aVal: 14101, b: "Jerome Bettis", bVal: 13662, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Eric Dickerson", aVal: 13259, b: "Tony Dorsett", bVal: 12739, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Barry Sanders", aVal: 15269, b: "Adrian Peterson", bVal: 14918, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Marshawn Lynch", aVal: 10413, b: "Edgerrin James", bVal: 12246, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "LeSean McCoy", aVal: 11102, b: "Marshawn Lynch", bVal: 10413, cat: "Career Rushing Yards", sport: "NFL" },

  // NFL – Career Receiving Yards
  { a: "Jerry Rice", aVal: 22895, b: "Larry Fitzgerald", bVal: 17492, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Terrell Owens", aVal: 15934, b: "Randy Moss", bVal: 15292, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Larry Fitzgerald", aVal: 17492, b: "Tony Gonzalez", bVal: 15127, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Marvin Harrison", aVal: 14580, b: "Reggie Wayne", bVal: 14345, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Steve Smith Sr.", aVal: 14731, b: "Andre Johnson", bVal: 14185, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Tim Brown", aVal: 14934, b: "Isaac Bruce", bVal: 15208, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Calvin Johnson", aVal: 11619, b: "Antonio Brown", bVal: 12291, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Randy Moss", aVal: 15292, b: "Marvin Harrison", bVal: 14580, cat: "Career Receiving Yards", sport: "NFL" },

  // NFL – Career Touchdowns (total)
  { a: "Jerry Rice", aVal: 208, b: "Emmitt Smith", bVal: 175, cat: "Career Touchdowns", sport: "NFL" },
  { a: "LaDainian Tomlinson", aVal: 162, b: "Randy Moss", bVal: 157, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Terrell Owens", aVal: 156, b: "Marcus Allen", bVal: 145, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Marshall Faulk", aVal: 136, b: "Shaun Alexander", bVal: 112, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Tom Brady", aVal: 649, b: "Drew Brees", bVal: 571, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Peyton Manning", aVal: 539, b: "Brett Favre", bVal: 508, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Dan Marino", aVal: 420, b: "Philip Rivers", bVal: 421, cat: "Career Pass TDs", sport: "NFL" },

  // NFL – Career Interceptions Thrown
  { a: "Brett Favre", aVal: 336, b: "George Blanda", bVal: 277, cat: "Career INTs Thrown", sport: "NFL" },
  { a: "Eli Manning", aVal: 244, b: "Ben Roethlisberger", bVal: 210, cat: "Career INTs Thrown", sport: "NFL" },

  // NFL – Career Sacks
  { a: "Bruce Smith", aVal: 200, b: "Reggie White", bVal: 198, cat: "Career Sacks", sport: "NFL" },
  { a: "Kevin Greene", aVal: 160, b: "Julius Peppers", bVal: 159.5, cat: "Career Sacks", sport: "NFL" },
  { a: "Michael Strahan", aVal: 141.5, b: "Jason Pierre-Paul", bVal: 91.5, cat: "Career Sacks", sport: "NFL" },
  { a: "DeMarcus Ware", aVal: 138.5, b: "Terrell Suggs", bVal: 139, cat: "Career Sacks", sport: "NFL" },

  // NBA – Career Points
  { a: "LeBron James", aVal: 42007, b: "Kareem Abdul-Jabbar", bVal: 38387, cat: "Career Points", sport: "NBA" },
  { a: "Karl Malone", aVal: 36928, b: "Kobe Bryant", bVal: 33643, cat: "Career Points", sport: "NBA" },
  { a: "Michael Jordan", aVal: 32292, b: "Dirk Nowitzki", bVal: 31560, cat: "Career Points", sport: "NBA" },
  { a: "Wilt Chamberlain", aVal: 31419, b: "Shaquille O'Neal", bVal: 28596, cat: "Career Points", sport: "NBA" },
  { a: "Hakeem Olajuwon", aVal: 26946, b: "Oscar Robertson", bVal: 26710, cat: "Career Points", sport: "NBA" },
  { a: "Carmelo Anthony", aVal: 28289, b: "Kevin Durant", bVal: 28924, cat: "Career Points", sport: "NBA" },
  { a: "Allen Iverson", aVal: 24368, b: "Kevin Garnett", bVal: 26071, cat: "Career Points", sport: "NBA" },
  { a: "Tim Duncan", aVal: 26496, b: "Paul Pierce", bVal: 26397, cat: "Career Points", sport: "NBA" },
  { a: "Vince Carter", aVal: 25728, b: "Dwyane Wade", bVal: 23165, cat: "Career Points", sport: "NBA" },

  // NBA – Career Rebounds
  { a: "Wilt Chamberlain", aVal: 23924, b: "Bill Russell", bVal: 21620, cat: "Career Rebounds", sport: "NBA" },
  { a: "Tim Duncan", aVal: 15091, b: "Kevin Garnett", bVal: 14662, cat: "Career Rebounds", sport: "NBA" },
  { a: "Karl Malone", aVal: 14968, b: "Dwight Howard", bVal: 14565, cat: "Career Rebounds", sport: "NBA" },
  { a: "Charles Barkley", aVal: 12546, b: "Dennis Rodman", bVal: 11954, cat: "Career Rebounds", sport: "NBA" },
  { a: "Shaquille O'Neal", aVal: 13099, b: "Hakeem Olajuwon", bVal: 13748, cat: "Career Rebounds", sport: "NBA" },

  // NBA – Career Assists
  { a: "John Stockton", aVal: 15806, b: "Jason Kidd", bVal: 12091, cat: "Career Assists", sport: "NBA" },
  { a: "Steve Nash", aVal: 10335, b: "Magic Johnson", bVal: 10141, cat: "Career Assists", sport: "NBA" },
  { a: "Chris Paul", aVal: 11894, b: "LeBron James", bVal: 11009, cat: "Career Assists", sport: "NBA" },
  { a: "Mark Jackson", aVal: 10334, b: "Isiah Thomas", bVal: 9061, cat: "Career Assists", sport: "NBA" },
  { a: "Gary Payton", aVal: 8966, b: "Russell Westbrook", bVal: 9654, cat: "Career Assists", sport: "NBA" },

  // NBA – Career Steals
  { a: "John Stockton", aVal: 3265, b: "Jason Kidd", bVal: 2684, cat: "Career Steals", sport: "NBA" },
  { a: "Chris Paul", aVal: 2544, b: "Allen Iverson", bVal: 1983, cat: "Career Steals", sport: "NBA" },
  { a: "Michael Jordan", aVal: 2514, b: "Gary Payton", bVal: 2445, cat: "Career Steals", sport: "NBA" },

  // NBA – Career Blocks
  { a: "Hakeem Olajuwon", aVal: 3830, b: "Dikembe Mutombo", bVal: 3289, cat: "Career Blocks", sport: "NBA" },
  { a: "Tim Duncan", aVal: 3020, b: "Shaquille O'Neal", bVal: 2732, cat: "Career Blocks", sport: "NBA" },
];

const SPORT_COLORS = { NFL: "#e74c3c", NBA: "#e67e22" };
const ROUND_SIZE = 15;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatStat(n) {
  return typeof n === "number" ? n.toLocaleString() : n;
}

export default function WhoHasMore() {
  const trackPlay = usePlayCount("who-has-more");

  const roundPairs = useMemo(() => shuffle(PAIRS).slice(0, ROUND_SIZE), []);

  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [picked, setPicked] = useState(null); // "a" | "b" | null
  const [results, setResults] = useState([]); // array of booleans
  const [gameOver, setGameOver] = useState(false);

  const pair = roundPairs[qIdx] || null;

  const handlePick = useCallback((choice) => {
    if (picked || !pair) return;
    trackPlay();
    setPicked(choice);

    const correct =
      (choice === "a" && pair.aVal >= pair.bVal) ||
      (choice === "b" && pair.bVal >= pair.aVal);

    setResults(prev => [...prev, correct]);

    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const ns = s + 1;
        setBestStreak(b => Math.max(b, ns));
        return ns;
      });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (qIdx + 1 >= roundPairs.length) {
        setGameOver(true);
      } else {
        setQIdx(i => i + 1);
        setPicked(null);
      }
    }, 1800);
  }, [picked, pair, qIdx, roundPairs.length, trackPlay]);

  const handlePlayAgain = () => {
    window.location.reload();
  };

  const handleShare = () => {
    const pct = Math.round((score / ROUND_SIZE) * 100);
    const blocks = results.map(r => r ? "🟩" : "🟥").join("");
    const text = `Who Has More? – ${score}/${ROUND_SIZE} (${pct}%)\n🔥 Best Streak: ${bestStreak}\n${blocks}\ntrivialsports.com/games/who-has-more`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d1f 0%, #07070f 60%)",
      color: "#f0f0f0", fontFamily: "'Oswald', sans-serif", padding: "84px 16px 60px",
    }}>
      <Helmet>
        <title>Who Has More? Career Stat Comparisons – TrivialSports</title>
        <meta name="description" content="Pick the player with the higher career stat. Compare NFL and NBA legends in passing yards, points, rebounds, touchdowns, and more." />
        <meta property="og:title" content="Who Has More? Career Stat Comparisons – TrivialSports" />
        <meta property="og:description" content="Pick the player with the higher career stat. Compare NFL and NBA legends." />
        <meta property="og:url" content="https://trivialsports.com/games/who-has-more" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        @keyframes slideReveal { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 700, margin: "0 auto 28px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>
              NFL &amp; NBA Trivia
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              Who Has More?
            </h1>
            <p style={{ fontSize: 13, color: "#c8a050", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Pick the player with the higher career stat. {ROUND_SIZE} questions per round.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Score</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {score}<span style={{ fontSize: 14, color: "#c8a05099" }}>/{ROUND_SIZE}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Streak</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: streak > 0 ? "#22c55e" : "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {streak}🔥
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
            height: "100%", width: `${((qIdx + (picked ? 1 : 0)) / ROUND_SIZE) * 100}%`,
            background: "linear-gradient(90deg, #c8a050, #e8c070)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Game Area */}
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {gameOver ? (
          /* Results screen */
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
              {score}<span style={{ fontSize: 24, color: "#c8a05088" }}>/{ROUND_SIZE}</span>
            </div>
            <div style={{ fontSize: 14, color: "#c8a050", marginTop: 8, fontFamily: "Georgia, serif" }}>
              Best streak: {bestStreak} 🔥
            </div>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", margin: "20px 0", flexWrap: "wrap" }}>
              {results.map((r, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: 5,
                  background: r ? "#22c55e22" : "#e74c3c22",
                  border: `1px solid ${r ? "#22c55e44" : "#e74c3c44"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13,
                }}>{r ? "✓" : "✗"}</div>
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
        ) : pair ? (
          /* Question card */
          <div style={{ animation: "fadeUp 0.35s ease both" }} key={qIdx}>
            {/* Category label */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <span style={{
                fontSize: 10, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
                color: SPORT_COLORS[pair.sport] || "#c8a050",
                background: (SPORT_COLORS[pair.sport] || "#c8a050") + "18",
                padding: "4px 12px", borderRadius: 5,
              }}>{pair.sport}</span>
              <div style={{
                fontSize: 20, fontWeight: 900, letterSpacing: 1.5, textTransform: "uppercase",
                color: "#c8a050", marginTop: 12,
              }}>{pair.cat}</div>
            </div>

            {/* Two player cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {["a", "b"].map(side => {
                const name = side === "a" ? pair.a : pair.b;
                const val = side === "a" ? pair.aVal : pair.bVal;
                const otherVal = side === "a" ? pair.bVal : pair.aVal;
                const isWinner = val >= otherVal;
                const isPicked = picked === side;
                const isRevealed = picked !== null;
                const correct = isPicked && isWinner;
                const wrong = isPicked && !isWinner;

                let borderColor = "#ffffff0a";
                let bg = "linear-gradient(135deg,#0a0a18,#0d0d1f)";
                if (isRevealed && isWinner) { borderColor = "#22c55e55"; bg = "linear-gradient(135deg,#0a1200,#0d1a05)"; }
                if (wrong) { borderColor = "#e74c3c55"; bg = "linear-gradient(135deg,#1a0808,#200a0a)"; }

                return (
                  <button
                    key={side}
                    onClick={() => handlePick(side)}
                    disabled={picked !== null}
                    style={{
                      background: bg, border: `2px solid ${borderColor}`,
                      borderRadius: 16, padding: "32px 20px", cursor: picked ? "default" : "pointer",
                      textAlign: "center", transition: "all 0.25s ease",
                      transform: isPicked && isRevealed ? "scale(1.02)" : "scale(1)",
                      boxShadow: isPicked && isRevealed && isWinner ? "0 8px 30px #22c55e18" : "none",
                      outline: "none",
                    }}
                  >
                    <div style={{
                      fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 900,
                      fontFamily: "'Oswald', sans-serif", textTransform: "uppercase",
                      letterSpacing: 0.5, color: "#ffffff", lineHeight: 1.2,
                    }}>{name}</div>

                    {isRevealed && (
                      <div style={{ animation: "slideReveal 0.3s ease both", marginTop: 14 }}>
                        <div style={{
                          fontSize: 32, fontWeight: 900, fontFamily: "'Oswald', sans-serif",
                          color: isWinner ? "#22c55e" : "#e74c3c88",
                          fontVariantNumeric: "tabular-nums",
                        }}>{formatStat(val)}</div>
                        {isWinner && (
                          <div style={{
                            fontSize: 10, fontWeight: 800, letterSpacing: 3,
                            textTransform: "uppercase", color: "#22c55e",
                            marginTop: 6,
                          }}>✓ More</div>
                        )}
                      </div>
                    )}

                    {!isRevealed && (
                      <div style={{
                        marginTop: 14, fontSize: 11, fontWeight: 700, letterSpacing: 2,
                        textTransform: "uppercase", color: "#c8a05066",
                        fontFamily: "'Oswald', sans-serif",
                      }}>Tap to pick</div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Result indicator */}
            {picked && (
              <div style={{
                textAlign: "center", marginTop: 20,
                animation: "popIn 0.3s ease both",
              }}>
                <span style={{
                  fontSize: 13, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase",
                  color: results[results.length - 1] ? "#22c55e" : "#e74c3c",
                  fontFamily: "'Oswald', sans-serif",
                }}>
                  {results[results.length - 1] ? "Correct!" : "Wrong!"}
                </span>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Footer hint */}
      <div style={{ maxWidth: 700, margin: "20px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>
          Career stats for NFL &amp; NBA players · Mostly retired players for accuracy
        </div>
      </div>
    </div>
  );
}
