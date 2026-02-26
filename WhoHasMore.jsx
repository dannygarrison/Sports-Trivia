import { useState, useCallback, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

/*
  WHO HAS MORE?
  Pick the player with the higher career stat.
  Data: exclusively retired players for evergreen stability.
  Each pair: [playerA, statA, playerB, statB, category, sport]
*/

const PAIRS = [
  // NFL - Career Passing Yards
  { a: "Tom Brady", aVal: 89214, b: "Drew Brees", bVal: 80358, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Peyton Manning", aVal: 71940, b: "Brett Favre", bVal: 71838, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Drew Brees", aVal: 80358, b: "Peyton Manning", bVal: 71940, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Dan Marino", aVal: 61361, b: "Philip Rivers", bVal: 63440, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Ben Roethlisberger", aVal: 64088, b: "Eli Manning", bVal: 57023, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Matt Ryan", aVal: 62792, b: "Philip Rivers", bVal: 63440, cat: "Career Passing Yards", sport: "NFL" },
  { a: "John Elway", aVal: 51475, b: "Dan Marino", bVal: 61361, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Brett Favre", aVal: 71838, b: "Philip Rivers", bVal: 63440, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Vinny Testaverde", aVal: 46233, b: "Warren Moon", bVal: 49325, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Drew Bledsoe", aVal: 44611, b: "Kerry Collins", bVal: 40922, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Joe Montana", aVal: 40551, b: "Troy Aikman", bVal: 32942, cat: "Career Passing Yards", sport: "NFL" },
  { a: "Carson Palmer", aVal: 46247, b: "Matt Ryan", bVal: 62792, cat: "Career Passing Yards", sport: "NFL" },
  // NFL - Career Rushing Yards
  { a: "Emmitt Smith", aVal: 18355, b: "Walter Payton", bVal: 16726, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Barry Sanders", aVal: 15269, b: "Frank Gore", bVal: 16000, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Adrian Peterson", aVal: 14918, b: "LaDainian Tomlinson", bVal: 13684, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Curtis Martin", aVal: 14101, b: "Jerome Bettis", bVal: 13662, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Eric Dickerson", aVal: 13259, b: "Tony Dorsett", bVal: 12739, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Barry Sanders", aVal: 15269, b: "Adrian Peterson", bVal: 14918, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Marshawn Lynch", aVal: 10413, b: "Edgerrin James", bVal: 12246, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "LeSean McCoy", aVal: 11102, b: "Marshawn Lynch", bVal: 10413, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Thurman Thomas", aVal: 12074, b: "Fred Taylor", bVal: 11695, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Corey Dillon", aVal: 11241, b: "Warrick Dunn", bVal: 10967, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Jim Brown", aVal: 12312, b: "Marcus Allen", bVal: 12243, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "O.J. Simpson", aVal: 11236, b: "Earl Campbell", bVal: 9407, cat: "Career Rushing Yards", sport: "NFL" },
  { a: "Walter Payton", aVal: 16726, b: "Frank Gore", bVal: 16000, cat: "Career Rushing Yards", sport: "NFL" },
  // NFL - Career Receiving Yards
  { a: "Jerry Rice", aVal: 22895, b: "Larry Fitzgerald", bVal: 17492, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Terrell Owens", aVal: 15934, b: "Randy Moss", bVal: 15292, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Larry Fitzgerald", aVal: 17492, b: "Tony Gonzalez", bVal: 15127, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Marvin Harrison", aVal: 14580, b: "Reggie Wayne", bVal: 14345, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Steve Smith Sr.", aVal: 14731, b: "Andre Johnson", bVal: 14185, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Tim Brown", aVal: 14934, b: "Isaac Bruce", bVal: 15208, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Calvin Johnson", aVal: 11619, b: "Antonio Brown", bVal: 12291, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Randy Moss", aVal: 15292, b: "Marvin Harrison", bVal: 14580, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Torry Holt", aVal: 13382, b: "Hines Ward", bVal: 12083, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Henry Ellard", aVal: 13777, b: "Irving Fryar", bVal: 12785, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Anquan Boldin", aVal: 13779, b: "Torry Holt", bVal: 13382, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Shannon Sharpe", aVal: 10060, b: "Jason Witten", bVal: 13046, cat: "Career Receiving Yards", sport: "NFL" },
  { a: "Cris Carter", aVal: 13899, b: "Henry Ellard", bVal: 13777, cat: "Career Receiving Yards", sport: "NFL" },
  // NFL - Career Touchdowns
  { a: "Jerry Rice", aVal: 208, b: "Emmitt Smith", bVal: 175, cat: "Career Touchdowns", sport: "NFL" },
  { a: "LaDainian Tomlinson", aVal: 162, b: "Randy Moss", bVal: 157, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Terrell Owens", aVal: 156, b: "Marcus Allen", bVal: 145, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Marshall Faulk", aVal: 136, b: "Shaun Alexander", bVal: 112, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Jim Brown", aVal: 126, b: "Walter Payton", bVal: 125, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Marvin Harrison", aVal: 128, b: "Cris Carter", bVal: 131, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Barry Sanders", aVal: 109, b: "Curtis Martin", bVal: 100, cat: "Career Touchdowns", sport: "NFL" },
  { a: "Tony Gonzalez", aVal: 111, b: "Antonio Gates", bVal: 116, cat: "Career Touchdowns", sport: "NFL" },
  // NFL - Career Pass TDs
  { a: "Tom Brady", aVal: 649, b: "Drew Brees", bVal: 571, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Peyton Manning", aVal: 539, b: "Brett Favre", bVal: 508, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Dan Marino", aVal: 420, b: "Philip Rivers", bVal: 421, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Ben Roethlisberger", aVal: 418, b: "Eli Manning", bVal: 366, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Matt Ryan", aVal: 381, b: "Carson Palmer", bVal: 294, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Fran Tarkenton", aVal: 342, b: "John Elway", bVal: 300, cat: "Career Pass TDs", sport: "NFL" },
  { a: "Warren Moon", aVal: 291, b: "Joe Montana", bVal: 273, cat: "Career Pass TDs", sport: "NFL" },
  // NFL - Career INTs Thrown
  { a: "Brett Favre", aVal: 336, b: "George Blanda", bVal: 277, cat: "Career INTs Thrown", sport: "NFL" },
  { a: "Eli Manning", aVal: 244, b: "Ben Roethlisberger", bVal: 210, cat: "Career INTs Thrown", sport: "NFL" },
  { a: "Dan Marino", aVal: 252, b: "Peyton Manning", bVal: 251, cat: "Career INTs Thrown", sport: "NFL" },
  { a: "Vinny Testaverde", aVal: 267, b: "Eli Manning", bVal: 244, cat: "Career INTs Thrown", sport: "NFL" },
  { a: "John Elway", aVal: 226, b: "Jim Kelly", bVal: 175, cat: "Career INTs Thrown", sport: "NFL" },
  // NFL - Career Sacks
  { a: "Bruce Smith", aVal: 200, b: "Reggie White", bVal: 198, cat: "Career Sacks", sport: "NFL" },
  { a: "Kevin Greene", aVal: 160, b: "Julius Peppers", bVal: 159.5, cat: "Career Sacks", sport: "NFL" },
  { a: "Michael Strahan", aVal: 141.5, b: "John Abraham", bVal: 133.5, cat: "Career Sacks", sport: "NFL" },
  { a: "DeMarcus Ware", aVal: 138.5, b: "Terrell Suggs", bVal: 139, cat: "Career Sacks", sport: "NFL" },
  { a: "John Randle", aVal: 137.5, b: "Richard Dent", bVal: 137.5, cat: "Career Sacks", sport: "NFL" },
  { a: "Chris Doleman", aVal: 150.5, b: "DeMarcus Ware", bVal: 138.5, cat: "Career Sacks", sport: "NFL" },
  { a: "Jared Allen", aVal: 136, b: "Michael Strahan", bVal: 141.5, cat: "Career Sacks", sport: "NFL" },
  { a: "Dwight Freeney", aVal: 125.5, b: "Robert Mathis", bVal: 123, cat: "Career Sacks", sport: "NFL" },
  // NBA - Career Points (all retired)
  { a: "Kareem Abdul-Jabbar", aVal: 38387, b: "Karl Malone", bVal: 36928, cat: "Career Points", sport: "NBA" },
  { a: "Karl Malone", aVal: 36928, b: "Kobe Bryant", bVal: 33643, cat: "Career Points", sport: "NBA" },
  { a: "Michael Jordan", aVal: 32292, b: "Dirk Nowitzki", bVal: 31560, cat: "Career Points", sport: "NBA" },
  { a: "Wilt Chamberlain", aVal: 31419, b: "Shaquille O'Neal", bVal: 28596, cat: "Career Points", sport: "NBA" },
  { a: "Hakeem Olajuwon", aVal: 26946, b: "Oscar Robertson", bVal: 26710, cat: "Career Points", sport: "NBA" },
  { a: "Carmelo Anthony", aVal: 28289, b: "Moses Malone", bVal: 27409, cat: "Career Points", sport: "NBA" },
  { a: "Allen Iverson", aVal: 24368, b: "Kevin Garnett", bVal: 26071, cat: "Career Points", sport: "NBA" },
  { a: "Tim Duncan", aVal: 26496, b: "Paul Pierce", bVal: 26397, cat: "Career Points", sport: "NBA" },
  { a: "Vince Carter", aVal: 25728, b: "Dwyane Wade", bVal: 23165, cat: "Career Points", sport: "NBA" },
  { a: "Elvin Hayes", aVal: 27313, b: "Hakeem Olajuwon", bVal: 26946, cat: "Career Points", sport: "NBA" },
  { a: "Ray Allen", aVal: 24505, b: "Reggie Miller", bVal: 25279, cat: "Career Points", sport: "NBA" },
  { a: "Patrick Ewing", aVal: 24815, b: "Allen Iverson", bVal: 24368, cat: "Career Points", sport: "NBA" },
  { a: "Dominique Wilkins", aVal: 26668, b: "Alex English", bVal: 25613, cat: "Career Points", sport: "NBA" },
  { a: "Charles Barkley", aVal: 23757, b: "Robert Parish", bVal: 23334, cat: "Career Points", sport: "NBA" },
  { a: "Kobe Bryant", aVal: 33643, b: "Michael Jordan", bVal: 32292, cat: "Career Points", sport: "NBA" },
  { a: "Shaquille O'Neal", aVal: 28596, b: "Carmelo Anthony", bVal: 28289, cat: "Career Points", sport: "NBA" },
  // NBA - Career Rebounds (all retired)
  { a: "Wilt Chamberlain", aVal: 23924, b: "Bill Russell", bVal: 21620, cat: "Career Rebounds", sport: "NBA" },
  { a: "Tim Duncan", aVal: 15091, b: "Kevin Garnett", bVal: 14662, cat: "Career Rebounds", sport: "NBA" },
  { a: "Karl Malone", aVal: 14968, b: "Robert Parish", bVal: 14715, cat: "Career Rebounds", sport: "NBA" },
  { a: "Charles Barkley", aVal: 12546, b: "Dennis Rodman", bVal: 11954, cat: "Career Rebounds", sport: "NBA" },
  { a: "Shaquille O'Neal", aVal: 13099, b: "Hakeem Olajuwon", bVal: 13748, cat: "Career Rebounds", sport: "NBA" },
  { a: "Moses Malone", aVal: 16212, b: "Karl Malone", bVal: 14968, cat: "Career Rebounds", sport: "NBA" },
  { a: "Nate Thurmond", aVal: 14464, b: "Walt Bellamy", bVal: 14241, cat: "Career Rebounds", sport: "NBA" },
  { a: "Bob Pettit", aVal: 12849, b: "Elgin Baylor", bVal: 11463, cat: "Career Rebounds", sport: "NBA" },
  { a: "Dwight Howard", aVal: 14565, b: "Patrick Ewing", bVal: 11607, cat: "Career Rebounds", sport: "NBA" },
  // NBA - Career Assists (all retired)
  { a: "John Stockton", aVal: 15806, b: "Jason Kidd", bVal: 12091, cat: "Career Assists", sport: "NBA" },
  { a: "Steve Nash", aVal: 10335, b: "Magic Johnson", bVal: 10141, cat: "Career Assists", sport: "NBA" },
  { a: "Mark Jackson", aVal: 10334, b: "Isiah Thomas", bVal: 9061, cat: "Career Assists", sport: "NBA" },
  { a: "Gary Payton", aVal: 8966, b: "Rod Strickland", bVal: 7987, cat: "Career Assists", sport: "NBA" },
  { a: "Oscar Robertson", aVal: 9887, b: "Magic Johnson", bVal: 10141, cat: "Career Assists", sport: "NBA" },
  { a: "Jason Kidd", aVal: 12091, b: "Steve Nash", bVal: 10335, cat: "Career Assists", sport: "NBA" },
  { a: "Andre Miller", aVal: 8524, b: "Tim Hardaway", bVal: 7095, cat: "Career Assists", sport: "NBA" },
  { a: "Tony Parker", aVal: 7036, b: "Deron Williams", bVal: 5765, cat: "Career Assists", sport: "NBA" },
  // NBA - Career Steals (all retired)
  { a: "John Stockton", aVal: 3265, b: "Jason Kidd", bVal: 2684, cat: "Career Steals", sport: "NBA" },
  { a: "Michael Jordan", aVal: 2514, b: "Gary Payton", bVal: 2445, cat: "Career Steals", sport: "NBA" },
  { a: "Scottie Pippen", aVal: 2307, b: "Mookie Blaylock", bVal: 2075, cat: "Career Steals", sport: "NBA" },
  { a: "Hakeem Olajuwon", aVal: 2162, b: "Clyde Drexler", bVal: 2207, cat: "Career Steals", sport: "NBA" },
  { a: "Allen Iverson", aVal: 1983, b: "Isiah Thomas", bVal: 1861, cat: "Career Steals", sport: "NBA" },
  { a: "Karl Malone", aVal: 2085, b: "Scottie Pippen", bVal: 2307, cat: "Career Steals", sport: "NBA" },
  // NBA - Career Blocks (all retired)
  { a: "Hakeem Olajuwon", aVal: 3830, b: "Dikembe Mutombo", bVal: 3289, cat: "Career Blocks", sport: "NBA" },
  { a: "Tim Duncan", aVal: 3020, b: "Shaquille O'Neal", bVal: 2732, cat: "Career Blocks", sport: "NBA" },
  { a: "Kareem Abdul-Jabbar", aVal: 3189, b: "Tim Duncan", bVal: 3020, cat: "Career Blocks", sport: "NBA" },
  { a: "David Robinson", aVal: 2954, b: "Patrick Ewing", bVal: 2894, cat: "Career Blocks", sport: "NBA" },
  { a: "Alonzo Mourning", aVal: 2356, b: "Marcus Camby", bVal: 2331, cat: "Career Blocks", sport: "NBA" },
  { a: "Ben Wallace", aVal: 2137, b: "Dikembe Mutombo", bVal: 3289, cat: "Career Blocks", sport: "NBA" },
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
