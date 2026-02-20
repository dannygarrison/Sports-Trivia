import { useState, useRef, useCallback } from "react";

// Top 5 all-time scorers by franchise (career points with that franchise)
const TEAMS = [
  {
    id: "hawks", name: "Atlanta Hawks", abbr: "ATL", color: "#C8102E",
    players: [
      { name: "Dominique Wilkins", pts: "23,292" },
      { name: "Bob Pettit", pts: "20,880" },
      { name: "Lou Hudson", pts: "16,049" },
      { name: "Cliff Hagan", pts: "13,447" },
      { name: "John Drew", pts: "12,621" },
    ]
  },
  {
    id: "celtics", name: "Boston Celtics", abbr: "BOS", color: "#007A33",
    players: [
      { name: "John Havlicek", pts: "26,395" },
      { name: "Paul Pierce", pts: "24,021" },
      { name: "Larry Bird", pts: "21,791" },
      { name: "Kevin McHale", pts: "17,335" },
      { name: "Robert Parish", pts: "15,182" },
    ]
  },
  {
    id: "nets", name: "Brooklyn Nets", abbr: "BKN", color: "#000000",
    players: [
      { name: "Buck Williams", pts: "10,440" },
      { name: "Vince Carter", pts: "9,509" },
      { name: "Kerry Kittles", pts: "8,052" },
      { name: "Brook Lopez", pts: "7,909" },
      { name: "Billy Paultz", pts: "7,314" },
    ]
  },
  {
    id: "hornets", name: "Charlotte Hornets", abbr: "CHA", color: "#1D1160",
    players: [
      { name: "Kemba Walker", pts: "12,009" },
      { name: "Dell Curry", pts: "9,839" },
      { name: "LaMelo Ball", pts: "6,399" },
      { name: "Gerald Wallace", pts: "6,348" },
      { name: "Baron Davis", pts: "5,893" },
    ]
  },
  {
    id: "bulls", name: "Chicago Bulls", abbr: "CHI", color: "#CE1141",
    players: [
      { name: "Michael Jordan", pts: "29,277" },
      { name: "Scottie Pippen", pts: "15,123" },
      { name: "Bob Love", pts: "12,623" },
      { name: "Chet Walker", pts: "9,788" },
      { name: "Norm Van Lier", pts: "7,547" },
    ]
  },
  {
    id: "cavs", name: "Cleveland Cavaliers", abbr: "CLE", color: "#860038",
    players: [
      { name: "LeBron James", pts: "21,578" },
      { name: "Zydrunas Ilgauskas", pts: "10,616" },
      { name: "Brad Daugherty", pts: "10,389" },
      { name: "Mark Price", pts: "9,279" },
      { name: "Larry Nance", pts: "7,858" },
    ]
  },
  {
    id: "mavs", name: "Dallas Mavericks", abbr: "DAL", color: "#00538C",
    players: [
      { name: "Dirk Nowitzki", pts: "31,560" },
      { name: "Rolando Blackman", pts: "16,643" },
      { name: "Mark Aguirre", pts: "13,930" },
      { name: "Derek Harper", pts: "12,597" },
      { name: "Luka Doncic", pts: "11,472" },
    ]
  },
  {
    id: "nuggets", name: "Denver Nuggets", abbr: "DEN", color: "#0E2240",
    players: [
      { name: "Alex English", pts: "21,645" },
      { name: "Dan Issel", pts: "16,589" },
      { name: "Carmelo Anthony", pts: "13,970" },
      { name: "David Thompson", pts: "11,992" },
      { name: "Nikola Jokic", pts: "14,283" },
    ]
  },
  {
    id: "pistons", name: "Detroit Pistons", abbr: "DET", color: "#C8102E",
    players: [
      { name: "Isiah Thomas", pts: "18,822" },
      { name: "Joe Dumars", pts: "16,401" },
      { name: "Bob Lanier", pts: "15,488" },
      { name: "Dave Bing", pts: "15,235" },
      { name: "Grant Hill", pts: "8,394" },
    ]
  },
  {
    id: "warriors", name: "Golden State Warriors", abbr: "GSW", color: "#1D428A",
    players: [
      { name: "Stephen Curry", pts: "23,654" },
      { name: "Wilt Chamberlain", pts: "17,783" },
      { name: "Klay Thompson", pts: "15,684" },
      { name: "Rick Barry", pts: "14,309" },
      { name: "Chris Mullin", pts: "12,850" },
    ]
  },
  {
    id: "rockets", name: "Houston Rockets", abbr: "HOU", color: "#CE1141",
    players: [
      { name: "Hakeem Olajuwon", pts: "26,511" },
      { name: "Calvin Murphy", pts: "17,949" },
      { name: "James Harden", pts: "21,173" },
      { name: "Elvin Hayes", pts: "15,598" },
      { name: "Rudy Tomjanovich", pts: "13,383" },
    ]
  },
  {
    id: "pacers", name: "Indiana Pacers", abbr: "IND", color: "#002D62",
    players: [
      { name: "Reggie Miller", pts: "25,279" },
      { name: "Rik Smits", pts: "12,871" },
      { name: "Jermaine O'Neal", pts: "10,839" },
      { name: "Mel Daniels", pts: "9,638" },
      { name: "Billy Knight", pts: "9,118" },
    ]
  },
  {
    id: "clippers", name: "Los Angeles Clippers", abbr: "LAC", color: "#C8102E",
    players: [
      { name: "Bob McAdoo", pts: "8,641" },
      { name: "Randy Smith", pts: "12,735" },
      { name: "Chris Paul", pts: "10,993" },
      { name: "Elton Brand", pts: "9,494" },
      { name: "Blake Griffin", pts: "9,821" },
    ]
  },
  {
    id: "lakers", name: "Los Angeles Lakers", abbr: "LAL", color: "#552583",
    players: [
      { name: "Kobe Bryant", pts: "33,643" },
      { name: "Jerry West", pts: "25,192" },
      { name: "LeBron James", pts: "12,528" },
      { name: "Elgin Baylor", pts: "23,149" },
      { name: "Kareem Abdul-Jabbar", pts: "24,176" },
    ]
  },
  {
    id: "grizzlies", name: "Memphis Grizzlies", abbr: "MEM", color: "#5D76A9",
    players: [
      { name: "Mike Conley", pts: "13,775" },
      { name: "Marc Gasol", pts: "13,498" },
      { name: "Zach Randolph", pts: "12,604" },
      { name: "Pau Gasol", pts: "11,824" },
      { name: "Rudy Gay", pts: "7,855" },
    ]
  },
  {
    id: "heat", name: "Miami Heat", abbr: "MIA", color: "#98002E",
    players: [
      { name: "Dwyane Wade", pts: "21,556" },
      { name: "LeBron James", pts: "8,009" },
      { name: "Alonzo Mourning", pts: "9,123" },
      { name: "Glen Rice", pts: "9,248" },
      { name: "Tim Hardaway", pts: "7,597" },
    ]
  },
  {
    id: "bucks", name: "Milwaukee Bucks", abbr: "MIL", color: "#00471B",
    players: [
      { name: "Kareem Abdul-Jabbar", pts: "14,211" },
      { name: "Bob Dandridge", pts: "8,995" },
      { name: "Bob Boozer", pts: "5,826" },
      { name: "Jon McGlocklin", pts: "5,765" },
      { name: "Giannis Antetokounmpo", pts: "20,070" },
    ]
  },
  {
    id: "wolves", name: "Minnesota Timberwolves", abbr: "MIN", color: "#0C2340",
    players: [
      { name: "Kevin Garnett", pts: "19,201" },
      { name: "Karl-Anthony Towns", pts: "14,398" },
      { name: "Andrew Wiggins", pts: "9,391" },
      { name: "Wally Szczerbiak", pts: "7,049" },
      { name: "Sam Mitchell", pts: "5,624" },
    ]
  },
  {
    id: "pelicans", name: "New Orleans Pelicans", abbr: "NOP", color: "#0C2340",
    players: [
      { name: "Anthony Davis", pts: "11,820" },
      { name: "Jamaal Mashburn", pts: "8,641" },
      { name: "Baron Davis", pts: "7,426" },
      { name: "Peja Stojakovic", pts: "6,788" },
      { name: "Zion Williamson", pts: "6,003" },
    ]
  },
  {
    id: "knicks", name: "New York Knicks", abbr: "NYK", color: "#006BB6",
    players: [
      { name: "Patrick Ewing", pts: "23,665" },
      { name: "Walt Frazier", pts: "14,617" },
      { name: "Carmelo Anthony", pts: "14,683" },
      { name: "Bill Bradley", pts: "9,217" },
      { name: "Willis Reed", pts: "12,183" },
    ]
  },
  {
    id: "thunder", name: "Oklahoma City Thunder", abbr: "OKC", color: "#007AC1",
    players: [
      { name: "Russell Westbrook", pts: "19,564" },
      { name: "Kevin Durant", pts: "16,422" },
      { name: "James Harden", pts: "4,537" },
      { name: "Nick Collison", pts: "6,093" },
      { name: "Shai Gilgeous-Alexander", pts: "10,894" },
    ]
  },
  {
    id: "magic", name: "Orlando Magic", abbr: "ORL", color: "#0077C0",
    players: [
      { name: "Shaquille O'Neal", pts: "8,680" },
      { name: "Penny Hardaway", pts: "7,038" },
      { name: "Nick Anderson", pts: "10,650" },
      { name: "Dwight Howard", pts: "11,435" },
      { name: "Tracy McGrady", pts: "7,027" },
    ]
  },
  {
    id: "sixers", name: "Philadelphia 76ers", abbr: "PHI", color: "#006BB6",
    players: [
      { name: "Hal Greer", pts: "21,586" },
      { name: "Allen Iverson", pts: "20,708" },
      { name: "Dolph Schayes", pts: "18,438" },
      { name: "Billy Cunningham", pts: "13,626" },
      { name: "Charles Barkley", pts: "10,820" },
    ]
  },
  {
    id: "suns", name: "Phoenix Suns", abbr: "PHX", color: "#1D1160",
    players: [
      { name: "Walter Davis", pts: "15,666" },
      { name: "Kevin Johnson", pts: "12,747" },
      { name: "Shawn Marion", pts: "11,082" },
      { name: "Dick Van Arsdale", pts: "10,012" },
      { name: "Steve Nash", pts: "10,335" },
    ]
  },
  {
    id: "blazers", name: "Portland Trail Blazers", abbr: "POR", color: "#E03A3E",
    players: [
      { name: "Damian Lillard", pts: "20,068" },
      { name: "Clyde Drexler", pts: "18,040" },
      { name: "Terry Porter", pts: "11,475" },
      { name: "LaMarcus Aldridge", pts: "13,668" },
      { name: "Clifford Robinson", pts: "11,988" },
    ]
  },
  {
    id: "kings", name: "Sacramento Kings", abbr: "SAC", color: "#5A2D81",
    players: [
      { name: "Oscar Robertson", pts: "22,009" },
      { name: "Mitch Richmond", pts: "12,070" },
      { name: "Jack Twyman", pts: "15,840" },
      { name: "Sam Lacey", pts: "9,949" },
      { name: "Peja Stojakovic", pts: "9,649" },
    ]
  },
  {
    id: "spurs", name: "San Antonio Spurs", abbr: "SAS", color: "#C4CED4",
    players: [
      { name: "Tim Duncan", pts: "26,496" },
      { name: "George Gervin", pts: "23,602" },
      { name: "David Robinson", pts: "20,790" },
      { name: "Tony Parker", pts: "18,943" },
      { name: "Manu Ginobili", pts: "14,043" },
    ]
  },
  {
    id: "raptors", name: "Toronto Raptors", abbr: "TOR", color: "#CE1141",
    players: [
      { name: "DeMar DeRozan", pts: "13,296" },
      { name: "Kyle Lowry", pts: "10,540" },
      { name: "Vince Carter", pts: "9,420" },
      { name: "Chris Bosh", pts: "10,275" },
      { name: "Pascal Siakam", pts: "10,067" },
    ]
  },
  {
    id: "jazz", name: "Utah Jazz", abbr: "UTA", color: "#002B5C",
    players: [
      { name: "Karl Malone", pts: "36,374" },
      { name: "John Stockton", pts: "19,711" },
      { name: "Adrian Dantley", pts: "13,635" },
      { name: "Darrell Griffith", pts: "12,391" },
      { name: "Jeff Hornacek", pts: "8,048" },
    ]
  },
  {
    id: "wizards", name: "Washington Wizards", abbr: "WAS", color: "#002B5C",
    players: [
      { name: "Elvin Hayes", pts: "15,551" },
      { name: "Gus Johnson", pts: "11,816" },
      { name: "Walt Bellamy", pts: "9,927" },
      { name: "Phil Chenier", pts: "9,792" },
      { name: "Gilbert Arenas", pts: "9,687" },
    ]
  },
];

// Sort teams alphabetically by city
TEAMS.sort((a, b) => a.name.localeCompare(b.name));

// Sort each team's top 5 by points descending
TEAMS.forEach(team => {
  team.players.sort((a, b) => 
    parseInt(b.pts.replace(/,/g, "")) - parseInt(a.pts.replace(/,/g, ""))
  );
});

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[''`]/g, "")
    .replace(/\./g, "")
    .replace(/\s+/g, " ");
}

const ALIASES = {
  "kareem abdul-jabbar": ["kareem", "jabbar", "lew alcindor"],
  "lebron james": ["lebron", "king james", "the king"],
  "shaquille oneal": ["shaq", "shaquille oneal", "shaquille o'neal"],
  "giannis antetokounmpo": ["giannis", "greek freak"],
  "nikola jokic": ["joker", "jokic"],
  "luka doncic": ["luka", "doncic", "luka dončić"],
  "penny hardaway": ["anfernee hardaway", "anfernee", "penny"],
  "wally szczerbiak": ["wally", "szczerbiak"],
  "zydrunas ilgauskas": ["z", "ilgauskas", "big z"],
  "hakeem olajuwon": ["akeem olajuwon", "hakeem", "the dream", "akeem"],
  "dirk nowitzki": ["dirk", "nowitzki"],
  "stephen curry": ["steph curry", "steph", "curry"],
  "klay thompson": ["klay"],
  "damian lillard": ["dame", "lillard", "dame lillard"],
  "lamarcus aldridge": ["aldridge"],
  "dwyane wade": ["d-wade", "dwade", "wade"],
  "carmelo anthony": ["melo", "carmelo"],
  "kevin garnett": ["kg", "garnett"],
  "karl-anthony towns": ["kat", "towns"],
  "shai gilgeous-alexander": ["sga", "shai", "gilgeous-alexander"],
  "demar derozan": ["derozan"],
  "dominique wilkins": ["nique", "wilkins"],
  "isiah thomas": ["isiah"],
  "reggie miller": ["reggie", "miller"],
  "john havlicek": ["hondo", "havlicek"],
  "paul pierce": ["the truth", "pierce"],
  "alex english": ["english"],
  "tim duncan": ["td", "the big fundamental", "duncan"],
  "george gervin": ["the iceman", "gervin"],
  "manu ginobili": ["manu", "ginobili"],
  "tony parker": ["tp", "parker"],
  "oscar robertson": ["the big o", "robertson"],
  "walt frazier": ["clyde", "frazier"],
  "michael jordan": ["mj", "jordan", "air jordan", "his airness"],
  "scottie pippen": ["pippen"],
  "kobe bryant": ["kobe", "mamba", "black mamba", "bryant"],
  "jerry west": ["west", "the logo"],
  "elgin baylor": ["baylor"],
  "wilt chamberlain": ["wilt", "wilt the stilt", "chamberlain"],
  "rick barry": ["barry"],
  "patrick ewing": ["ewing"],
  "charles barkley": ["sir charles", "barkley", "the round mound"],
  "allen iverson": ["ai", "the answer", "iverson"],
  "magic johnson": ["magic", "earvin johnson"],
  "lamelo ball": ["lamelo"],
  "trae young": ["trae", "ice trae"],
};

function matchesPlayer(input, playerName) {
  const normInput = normalize(input);
  const normName = normalize(playerName);
  if (normName === normInput) return true;
  // Last name match (only if > 4 chars to avoid false positives)
  const lastName = normName.split(" ").pop();
  if (lastName.length > 3 && lastName === normInput) return true;
  // Check aliases
  const key = normName.replace(/'/g, "").replace(/'/g,"");
  for (const [aliasKey, aliasList] of Object.entries(ALIASES)) {
    if (normalize(aliasKey) === normName || normalize(aliasKey) === key) {
      if (aliasList.some(a => normalize(a) === normInput)) return true;
    }
  }
  return false;
}

function TeamCard({ team, solved, onSolve, gaveUp }) {
  const [input, setInput] = useState("");
  const [flash, setFlash] = useState(null);
  const [shake, setShake] = useState(false);
  const inputRef = useRef(null);
  const teamSolved = solved[team.id] || new Set();
  const allDone = teamSolved.size === 5;

  const handleInput = (e) => {
    const val = e.target.value;
    setInput(val);
    const match = team.players.find(
      p => !teamSolved.has(p.name) && matchesPlayer(val, p.name)
    );
    if (match) {
      onSolve(team.id, match.name);
      setInput("");
      setFlash(match.name);
      setTimeout(() => setFlash(null), 700);
    }
  };

  const progress = teamSolved.size / 5;

  return (
    <div style={{
      background: "#0a0a1a",
      border: `1px solid ${allDone ? team.color + "66" : "#ffffff08"}`,
      borderRadius: 12,
      overflow: "hidden",
      transition: "border-color 0.3s",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Team header */}
      <div style={{
        padding: "10px 14px 8px",
        background: `linear-gradient(135deg, ${team.color}22, ${team.color}08)`,
        borderBottom: `1px solid ${team.color}22`,
        position: "relative",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 3,
              textTransform: "uppercase", color: team.color,
              fontFamily: "'Barlow Condensed', sans-serif", opacity: 0.9,
            }}>{team.abbr}</div>
            <div style={{
              fontSize: 13, fontWeight: 900, letterSpacing: 0.3,
              color: "#ffffff", fontFamily: "'Barlow Condensed', sans-serif",
              textTransform: "uppercase", lineHeight: 1.1, marginTop: 1,
            }}>{team.name.replace(/^.+ /, "")}</div>
          </div>
          <div style={{
            fontSize: 18, fontWeight: 900,
            color: allDone ? team.color : "#ffffff22",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontVariantNumeric: "tabular-nums",
          }}>
            {teamSolved.size}<span style={{ fontSize: 11, opacity: 0.5 }}>/5</span>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 6, height: 2, background: "#ffffff08", borderRadius: 1, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress * 100}%`,
            background: team.color, borderRadius: 1,
            transition: "width 0.4s ease",
          }} />
        </div>
      </div>

      {/* Input */}
      {!allDone && !gaveUp && (
        <div style={{ padding: "8px 10px 4px" }}>
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Name a player..."
            style={{
              width: "100%", background: "#0d0d20",
              border: "1px solid #ffffff0a", borderRadius: 6,
              padding: "6px 8px", color: "#ffffff",
              fontSize: 12, fontFamily: "'Barlow Condensed', sans-serif",
              fontWeight: 600, letterSpacing: 0.3, outline: "none",
              boxSizing: "border-box", transition: "border-color 0.15s",
            }}
            onFocus={e => e.target.style.borderColor = team.color + "44"}
            onBlur={e => e.target.style.borderColor = "#ffffff0a"}
          />
        </div>
      )}

      {/* Player slots */}
      <div style={{ padding: "4px 10px 10px", flex: 1 }}>
        {team.players.map((player, i) => {
          const isSolved = teamSolved.has(player.name);
          const isFlashing = flash === player.name;
          const reveal = gaveUp && !isSolved;
          return (
            <div key={player.name} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "4px 6px", marginBottom: 2, borderRadius: 5,
              background: isFlashing ? team.color + "22" : isSolved ? "#ffffff06" : reveal ? "#1a0a0a" : "transparent",
              borderLeft: `2px solid ${isSolved ? team.color : reveal ? "#e74c3c33" : "transparent"}`,
              transition: "all 0.25s",
            }}>
              <div style={{
                fontSize: 12, fontWeight: isSolved ? 700 : 400,
                color: isSolved ? "#ffffff" : reveal ? "#e74c3c55" : "#ffffff18",
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.3,
              }}>
                {isSolved || reveal ? player.name : `— — —`}
              </div>
              <div style={{
                fontSize: 10, fontWeight: 700,
                color: isSolved ? team.color : reveal ? "#e74c3c33" : "#ffffff0a",
                fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
              }}>
                {(isSolved || reveal) && player.pts}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NBAScorersGrid() {
  const [solved, setSolved] = useState({});
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const totalSolved = Object.values(solved).reduce((s, v) => s + v.size, 0);
  const totalPossible = TEAMS.length * 5; // 150
  const teamsCompleted = Object.values(solved).filter(s => s.size === 5).length;

  // Timer
  useState(() => {
    const iv = setInterval(() => {
      if (timerActive) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  });

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSolve = useCallback((teamId, playerName) => {
    setSolved(prev => {
      const next = { ...prev, [teamId]: new Set(prev[teamId] || []) };
      next[teamId].add(playerName);
      const newTotal = Object.values(next).reduce((s, v) => s + v.size, 0);
      if (newTotal === totalPossible) {
        setTimerActive(false);
        setFinished(true);
      }
      return next;
    });
  }, [totalPossible]);

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
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: "84px 16px 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        input::placeholder { color: #ffffff18; }
        input:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 1400, margin: "0 auto 28px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>
              NBA Trivia
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              All-Time Scorers
            </h1>
            <p style={{ fontSize: 13, color: "#ffffff30", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Name the top 5 all-time scorers for all 30 NBA franchises.
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
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Players</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {totalSolved}<span style={{ fontSize: 14, color: "#ffffff30" }}>/{totalPossible}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Teams</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {teamsCompleted}<span style={{ fontSize: 14, color: "#ffffff30" }}>/30</span>
              </div>
            </div>
            {!finished && !gaveUp && (
              <button onClick={() => setShowGiveUpConfirm(true)} style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 16px", borderRadius: 8, cursor: "pointer",
                border: "1px solid #e74c3c33", background: "transparent", color: "#e74c3c88",
                fontFamily: "'Barlow Condensed', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color = "#e74c3c"; e.currentTarget.style.borderColor = "#e74c3c55"; e.currentTarget.style.background = "#e74c3c0f"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "#e74c3c88"; e.currentTarget.style.borderColor = "#e74c3c33"; e.currentTarget.style.background = "transparent"; }}
              >
                Give Up
              </button>
            )}
          </div>
        </div>

        {/* Overall progress bar */}
        <div style={{ marginTop: 16, height: 3, background: "#ffffff06", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(totalSolved / totalPossible) * 100}%`,
            background: "linear-gradient(90deg, #c8a050, #e8c070)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Finished banner */}
      {(finished || gaveUp) && (
        <div style={{
          maxWidth: 1400, margin: "0 auto 24px",
          background: gaveUp ? "linear-gradient(135deg, #1a0808, #2a1010)" : "linear-gradient(135deg, #0f0d00, #1a1500)",
          border: `1px solid ${gaveUp ? "#e74c3c33" : "#c8a05044"}`,
          borderRadius: 14, padding: "18px 24px", textAlign: "center",
          animation: "popIn 0.4s ease both",
        }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>{gaveUp ? "😔" : "🏆"}</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#c8a050", letterSpacing: 1, textTransform: "uppercase" }}>
            {gaveUp ? `Answers Revealed — ${totalSolved} of ${totalPossible} found` : `All ${totalPossible} Players Found!`}
          </div>
          <div style={{ fontSize: 13, color: "#ffffff44", marginTop: 4, fontFamily: "Georgia, serif" }}>
            {gaveUp ? "The unfound players are shown in red below." : `Completed ${teamsCompleted}/30 teams in ${formatTime(elapsed)}.`}
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{
        maxWidth: 1400, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 10,
        animation: "fadeUp 0.5s ease both",
        animationDelay: "0.1s",
      }}>
        {TEAMS.map(team => (
          <TeamCard
            key={team.id}
            team={team}
            solved={solved}
            onSolve={handleSolve}
            gaveUp={gaveUp}
          />
        ))}
      </div>

      <div style={{ maxWidth: 1400, margin: "20px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>
          Regular season points with franchise · Last names and nicknames accepted
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
              fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1, textTransform: "uppercase",
            }}>Give Up?</h3>
            <p style={{ margin: "0 0 22px", fontSize: 13, color: "#ffffff44", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>
              All {totalPossible} players will be revealed.<br />
              You found <span style={{ color: "#e74c3c", fontWeight: 900 }}>{totalSolved}</span> out of {totalPossible}.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGiveUpConfirm(false)} style={{
                flex: 1, background: "#141432", color: "#aaaacc",
                border: "1px solid #252548", borderRadius: 10,
                padding: "11px 0", fontSize: 13, fontWeight: 700,
                cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 1.5, textTransform: "uppercase",
              }}>Cancel</button>
              <button onClick={handleGiveUp} style={{
                flex: 1, background: "#e74c3c", color: "#fff", border: "none",
                borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 900,
                cursor: "pointer", fontFamily: "'Barlow Condensed', sans-serif",
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
