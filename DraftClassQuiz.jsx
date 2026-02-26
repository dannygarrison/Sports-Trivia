import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { usePlayCount } from "./usePlayCount.jsx";

/*
  DRAFT CLASS QUIZ — 2020s Decade
  2025 data verified from NBC Sports.
  VERIFY: 2023 pick order before deploying - Jalen Carter was pick #9 (Eagles),
  not #21 as currently listed. Only 31 picks in 2023 (Miami forfeited).
  2022 picks 15-32 should also be spot-checked.
*/

const DRAFT_CLASSES = {
  2024: {
    label: "2024 NFL Draft",
    picks: [
      { pick: 1, name: "Caleb Williams", pos: "QB", team: "Chicago Bears", college: "USC" },
      { pick: 2, name: "Jayden Daniels", pos: "QB", team: "Washington Commanders", college: "LSU" },
      { pick: 3, name: "Drake Maye", pos: "QB", team: "New England Patriots", college: "North Carolina" },
      { pick: 4, name: "Marvin Harrison Jr.", pos: "WR", team: "Arizona Cardinals", college: "Ohio State" },
      { pick: 5, name: "Joe Alt", pos: "OT", team: "Los Angeles Chargers", college: "Notre Dame" },
      { pick: 6, name: "Ricky Pearsall", pos: "WR", team: "New York Giants", college: "Florida" },
      { pick: 7, name: "Malik Nabers", pos: "WR", team: "New York Giants", college: "LSU" },
      { pick: 8, name: "Laiatu Latu", pos: "DE", team: "Indianapolis Colts", college: "UCLA" },
      { pick: 9, name: "Brock Bowers", pos: "TE", team: "Las Vegas Raiders", college: "Georgia" },
      { pick: 10, name: "J.C. Latham", pos: "OT", team: "New York Jets", college: "Alabama" },
      { pick: 11, name: "Rome Odunze", pos: "WR", team: "Chicago Bears", college: "Washington" },
      { pick: 12, name: "Byron Murphy II", pos: "DT", team: "Seattle Seahawks", college: "Texas" },
      { pick: 13, name: "Quinyon Mitchell", pos: "CB", team: "Philadelphia Eagles", college: "Toledo" },
      { pick: 14, name: "Dallas Turner", pos: "LB", team: "Minnesota Vikings", college: "Alabama" },
      { pick: 15, name: "Terrion Arnold", pos: "CB", team: "Detroit Lions", college: "Alabama" },
      { pick: 16, name: "Taliese Fuaga", pos: "OT", team: "New Orleans Saints", college: "Oregon State" },
      { pick: 17, name: "Olu Fashanu", pos: "OT", team: "Pittsburgh Steelers", college: "Penn State" },
      { pick: 18, name: "Bo Nix", pos: "QB", team: "Denver Broncos", college: "Oregon" },
      { pick: 19, name: "Jared Verse", pos: "DE", team: "Los Angeles Rams", college: "Florida State" },
      { pick: 20, name: "Brian Thomas Jr.", pos: "WR", team: "Jacksonville Jaguars", college: "LSU" },
      { pick: 21, name: "Nate Wiggins", pos: "CB", team: "Baltimore Ravens", college: "Clemson" },
      { pick: 22, name: "Troy Fautanu", pos: "OT", team: "Pittsburgh Steelers", college: "Washington" },
      { pick: 23, name: "Graham Barton", pos: "OL", team: "Tampa Bay Buccaneers", college: "Duke" },
      { pick: 24, name: "Adonai Mitchell", pos: "WR", team: "Indianapolis Colts", college: "Texas" },
      { pick: 25, name: "Xavier Worthy", pos: "WR", team: "Kansas City Chiefs", college: "Texas" },
      { pick: 26, name: "Amarius Mims", pos: "OT", team: "Cincinnati Bengals", college: "Georgia" },
      { pick: 27, name: "Darius Robinson", pos: "DL", team: "Arizona Cardinals", college: "Missouri" },
      { pick: 28, name: "Tyler Guyton", pos: "OT", team: "Dallas Cowboys", college: "Oklahoma" },
      { pick: 29, name: "Ad Mitchell", pos: "WR", team: "Indianapolis Colts", college: "Texas" },
      { pick: 30, name: "Ennis Rakestraw Jr.", pos: "CB", team: "Dallas Cowboys", college: "Missouri" },
      { pick: 31, name: "Xavier Legette", pos: "WR", team: "Carolina Panthers", college: "South Carolina" },
      { pick: 32, name: "Michael Penix Jr.", pos: "QB", team: "Atlanta Falcons", college: "Washington" },
    ],
  },
  2023: {
    label: "2023 NFL Draft",
    picks: [
      { pick: 1, name: "Bryce Young", pos: "QB", team: "Carolina Panthers", college: "Alabama" },
      { pick: 2, name: "C.J. Stroud", pos: "QB", team: "Houston Texans", college: "Ohio State" },
      { pick: 3, name: "Will Anderson Jr.", pos: "EDGE", team: "Houston Texans", college: "Alabama" },
      { pick: 4, name: "Anthony Richardson", pos: "QB", team: "Indianapolis Colts", college: "Florida" },
      { pick: 5, name: "Devon Witherspoon", pos: "CB", team: "Seattle Seahawks", college: "Illinois" },
      { pick: 6, name: "Paris Johnson Jr.", pos: "OT", team: "Arizona Cardinals", college: "Ohio State" },
      { pick: 7, name: "Tyree Wilson", pos: "EDGE", team: "Las Vegas Raiders", college: "Texas Tech" },
      { pick: 8, name: "Bijan Robinson", pos: "RB", team: "Atlanta Falcons", college: "Texas" },
      { pick: 9, name: "Christian Gonzalez", pos: "CB", team: "New England Patriots", college: "Oregon" },
      { pick: 10, name: "Lukas Van Ness", pos: "EDGE", team: "Green Bay Packers", college: "Iowa" },
      { pick: 11, name: "Jaxon Smith-Njigba", pos: "WR", team: "Seattle Seahawks", college: "Ohio State" },
      { pick: 12, name: "Quentin Johnston", pos: "WR", team: "Los Angeles Chargers", college: "TCU" },
      { pick: 13, name: "Broderick Jones", pos: "OT", team: "Pittsburgh Steelers", college: "Georgia" },
      { pick: 14, name: "Calijah Kancey", pos: "DT", team: "Tampa Bay Buccaneers", college: "Pittsburgh" },
      { pick: 15, name: "Will Levis", pos: "QB", team: "Tennessee Titans", college: "Kentucky" },
      { pick: 16, name: "Emmanuel Forbes", pos: "CB", team: "Washington Commanders", college: "Mississippi State" },
      { pick: 17, name: "Nolan Smith", pos: "EDGE", team: "Philadelphia Eagles", college: "Georgia" },
      { pick: 18, name: "Mazi Smith", pos: "DT", team: "Dallas Cowboys", college: "Michigan" },
      { pick: 19, name: "Brian Branch", pos: "S", team: "Detroit Lions", college: "Alabama" },
      { pick: 20, name: "Dawand Jones", pos: "OT", team: "Cleveland Browns", college: "Ohio State" },
      { pick: 21, name: "Jalen Carter", pos: "DT", team: "Philadelphia Eagles", college: "Georgia" },
      { pick: 22, name: "Zay Flowers", pos: "WR", team: "Baltimore Ravens", college: "Boston College" },
      { pick: 23, name: "Anton Harrison", pos: "OT", team: "Jacksonville Jaguars", college: "Oklahoma" },
      { pick: 24, name: "Dalton Kincaid", pos: "TE", team: "Buffalo Bills", college: "Utah" },
      { pick: 25, name: "Bryan Bresee", pos: "DT", team: "New Orleans Saints", college: "Clemson" },
      { pick: 26, name: "Deonte Banks", pos: "CB", team: "New York Giants", college: "Maryland" },
      { pick: 27, name: "Darnell Wright", pos: "OT", team: "Chicago Bears", college: "Tennessee" },
      { pick: 28, name: "O'Cyrus Torrence", pos: "OG", team: "Houston Texans", college: "Florida" },
      { pick: 29, name: "Felix Anudike-Uzomah", pos: "EDGE", team: "Kansas City Chiefs", college: "Kansas State" },
      { pick: 30, name: "Jahmyr Gibbs", pos: "RB", team: "Detroit Lions", college: "Alabama" },
      { pick: 31, name: "Michael Mayer", pos: "TE", team: "Las Vegas Raiders", college: "Notre Dame" },
    ],
  },
  2022: {
    label: "2022 NFL Draft",
    picks: [
      { pick: 1, name: "Travon Walker", pos: "EDGE", team: "Jacksonville Jaguars", college: "Georgia" },
      { pick: 2, name: "Aidan Hutchinson", pos: "DE", team: "Detroit Lions", college: "Michigan" },
      { pick: 3, name: "Derek Stingley Jr.", pos: "CB", team: "Houston Texans", college: "LSU" },
      { pick: 4, name: "Sauce Gardner", pos: "CB", team: "New York Jets", college: "Cincinnati" },
      { pick: 5, name: "Kayvon Thibodeaux", pos: "EDGE", team: "New York Giants", college: "Oregon" },
      { pick: 6, name: "Ikem Ekwonu", pos: "OT", team: "Carolina Panthers", college: "NC State" },
      { pick: 7, name: "Evan Neal", pos: "OT", team: "New York Giants", college: "Alabama" },
      { pick: 8, name: "Drake London", pos: "WR", team: "Atlanta Falcons", college: "USC" },
      { pick: 9, name: "Charles Cross", pos: "OT", team: "Seattle Seahawks", college: "Mississippi State" },
      { pick: 10, name: "Garrett Wilson", pos: "WR", team: "New York Jets", college: "Ohio State" },
      { pick: 11, name: "Chris Olave", pos: "WR", team: "New Orleans Saints", college: "Ohio State" },
      { pick: 12, name: "Jameson Williams", pos: "WR", team: "Detroit Lions", college: "Alabama" },
      { pick: 13, name: "Jordan Davis", pos: "DT", team: "Philadelphia Eagles", college: "Georgia" },
      { pick: 14, name: "Kyle Hamilton", pos: "S", team: "Baltimore Ravens", college: "Notre Dame" },
      { pick: 15, name: "Kenyon Green", pos: "OG", team: "Houston Texans", college: "Texas A&M" },
      { pick: 16, name: "Jermaine Johnson II", pos: "DE", team: "New York Jets", college: "Florida State" },
      { pick: 17, name: "Trent McDuffie", pos: "CB", team: "Kansas City Chiefs", college: "Washington" },
      { pick: 18, name: "Trevor Penning", pos: "OT", team: "New Orleans Saints", college: "Northern Iowa" },
      { pick: 19, name: "Quay Walker", pos: "LB", team: "Green Bay Packers", college: "Georgia" },
      { pick: 20, name: "Kenny Pickett", pos: "QB", team: "Pittsburgh Steelers", college: "Pittsburgh" },
      { pick: 21, name: "Devonte Wyatt", pos: "DT", team: "Green Bay Packers", college: "Georgia" },
      { pick: 22, name: "George Karlaftis", pos: "DE", team: "Kansas City Chiefs", college: "Purdue" },
      { pick: 23, name: "Devin Lloyd", pos: "LB", team: "Jacksonville Jaguars", college: "Utah" },
      { pick: 24, name: "Tyler Linderbaum", pos: "C", team: "Baltimore Ravens", college: "Iowa" },
      { pick: 25, name: "Zion Johnson", pos: "OG", team: "Los Angeles Chargers", college: "Boston College" },
      { pick: 26, name: "Daxton Hill", pos: "S", team: "Cincinnati Bengals", college: "Michigan" },
      { pick: 27, name: "Tyler Smith", pos: "OT", team: "Dallas Cowboys", college: "Tulsa" },
      { pick: 28, name: "Lewis Cine", pos: "S", team: "Minnesota Vikings", college: "Georgia" },
      { pick: 29, name: "Andrew Booth Jr.", pos: "CB", team: "Minnesota Vikings", college: "Clemson" },
      { pick: 30, name: "Nakobe Dean", pos: "LB", team: "Green Bay Packers", college: "Georgia" },
      { pick: 31, name: "Christian Watson", pos: "WR", team: "Green Bay Packers", college: "North Dakota State" },
      { pick: 32, name: "Drake Jackson", pos: "DE", team: "San Francisco 49ers", college: "USC" },
    ],
  },
  2021: {
    label: "2021 NFL Draft",
    picks: [
      { pick: 1, name: "Trevor Lawrence", pos: "QB", team: "Jacksonville Jaguars", college: "Clemson" },
      { pick: 2, name: "Zach Wilson", pos: "QB", team: "New York Jets", college: "BYU" },
      { pick: 3, name: "Trey Lance", pos: "QB", team: "San Francisco 49ers", college: "North Dakota State" },
      { pick: 4, name: "Kyle Pitts", pos: "TE", team: "Atlanta Falcons", college: "Florida" },
      { pick: 5, name: "Ja'Marr Chase", pos: "WR", team: "Cincinnati Bengals", college: "LSU" },
      { pick: 6, name: "Jaylen Waddle", pos: "WR", team: "Miami Dolphins", college: "Alabama" },
      { pick: 7, name: "Penei Sewell", pos: "OT", team: "Detroit Lions", college: "Oregon" },
      { pick: 8, name: "Jaycee Horn", pos: "CB", team: "Carolina Panthers", college: "South Carolina" },
      { pick: 9, name: "Patrick Surtain II", pos: "CB", team: "Denver Broncos", college: "Alabama" },
      { pick: 10, name: "DeVonta Smith", pos: "WR", team: "Philadelphia Eagles", college: "Alabama" },
      { pick: 11, name: "Micah Parsons", pos: "LB", team: "Dallas Cowboys", college: "Penn State" },
      { pick: 12, name: "Rashawn Slater", pos: "OT", team: "Los Angeles Chargers", college: "Northwestern" },
      { pick: 13, name: "Kadarius Toney", pos: "WR", team: "New York Giants", college: "Florida" },
      { pick: 14, name: "Alijah Vera-Tucker", pos: "OG", team: "New York Jets", college: "USC" },
      { pick: 15, name: "Mac Jones", pos: "QB", team: "New England Patriots", college: "Alabama" },
      { pick: 16, name: "Zaven Collins", pos: "LB", team: "Arizona Cardinals", college: "Tulsa" },
      { pick: 17, name: "Alex Leatherwood", pos: "OT", team: "Las Vegas Raiders", college: "Alabama" },
      { pick: 18, name: "Jaelan Phillips", pos: "DE", team: "Miami Dolphins", college: "Miami (FL)" },
      { pick: 19, name: "Jamin Davis", pos: "LB", team: "Washington Football Team", college: "Kentucky" },
      { pick: 20, name: "Christian Darrisaw", pos: "OT", team: "Minnesota Vikings", college: "Virginia Tech" },
      { pick: 21, name: "Kwity Paye", pos: "DE", team: "Indianapolis Colts", college: "Michigan" },
      { pick: 22, name: "Najee Harris", pos: "RB", team: "Pittsburgh Steelers", college: "Alabama" },
      { pick: 23, name: "Gregory Rousseau", pos: "DE", team: "Buffalo Bills", college: "Miami (FL)" },
      { pick: 24, name: "Rashod Bateman", pos: "WR", team: "Baltimore Ravens", college: "Minnesota" },
      { pick: 25, name: "Travis Etienne", pos: "RB", team: "Jacksonville Jaguars", college: "Clemson" },
      { pick: 26, name: "Eric Stokes", pos: "CB", team: "Green Bay Packers", college: "Georgia" },
      { pick: 27, name: "Jayson Oweh", pos: "DE", team: "Baltimore Ravens", college: "Penn State" },
      { pick: 28, name: "Caleb Farley", pos: "CB", team: "Tennessee Titans", college: "Virginia Tech" },
      { pick: 29, name: "Christian Barmore", pos: "DT", team: "New England Patriots", college: "Alabama" },
      { pick: 30, name: "Jeremiah Owusu-Koramoah", pos: "LB", team: "Cleveland Browns", college: "Notre Dame" },
      { pick: 31, name: "Samuel Cosmi", pos: "OT", team: "Washington Football Team", college: "Texas" },
      { pick: 32, name: "Payton Turner", pos: "DE", team: "New Orleans Saints", college: "Houston" },
    ],
  },
  2020: {
    label: "2020 NFL Draft",
    picks: [
      { pick: 1, name: "Joe Burrow", pos: "QB", team: "Cincinnati Bengals", college: "LSU" },
      { pick: 2, name: "Chase Young", pos: "DE", team: "Washington Redskins", college: "Ohio State" },
      { pick: 3, name: "Jeff Okudah", pos: "CB", team: "Detroit Lions", college: "Ohio State" },
      { pick: 4, name: "Andrew Thomas", pos: "OT", team: "New York Giants", college: "Georgia" },
      { pick: 5, name: "Tua Tagovailoa", pos: "QB", team: "Miami Dolphins", college: "Alabama" },
      { pick: 6, name: "Justin Herbert", pos: "QB", team: "Los Angeles Chargers", college: "Oregon" },
      { pick: 7, name: "Derrick Brown", pos: "DT", team: "Carolina Panthers", college: "Auburn" },
      { pick: 8, name: "Isaiah Simmons", pos: "LB", team: "Arizona Cardinals", college: "Clemson" },
      { pick: 9, name: "C.J. Henderson", pos: "CB", team: "Jacksonville Jaguars", college: "Florida" },
      { pick: 10, name: "Jedrick Wills", pos: "OT", team: "Cleveland Browns", college: "Alabama" },
      { pick: 11, name: "Mekhi Becton", pos: "OT", team: "New York Jets", college: "Louisville" },
      { pick: 12, name: "Henry Ruggs III", pos: "WR", team: "Las Vegas Raiders", college: "Alabama" },
      { pick: 13, name: "Jerry Jeudy", pos: "WR", team: "Denver Broncos", college: "Alabama" },
      { pick: 14, name: "CeeDee Lamb", pos: "WR", team: "Dallas Cowboys", college: "Oklahoma" },
      { pick: 15, name: "Tristan Wirfs", pos: "OT", team: "Tampa Bay Buccaneers", college: "Iowa" },
      { pick: 16, name: "Justin Jefferson", pos: "WR", team: "Minnesota Vikings", college: "LSU" },
      { pick: 17, name: "K'Lavon Chaisson", pos: "DE", team: "Jacksonville Jaguars", college: "LSU" },
      { pick: 18, name: "Kenneth Murray", pos: "LB", team: "Los Angeles Chargers", college: "Oklahoma" },
      { pick: 19, name: "Jalen Reagor", pos: "WR", team: "Philadelphia Eagles", college: "TCU" },
      { pick: 20, name: "Javon Kinlaw", pos: "DT", team: "San Francisco 49ers", college: "South Carolina" },
      { pick: 21, name: "Brandon Aiyuk", pos: "WR", team: "San Francisco 49ers", college: "Arizona State" },
      { pick: 22, name: "Xavier McKinney", pos: "S", team: "New York Giants", college: "Alabama" },
      { pick: 23, name: "Patrick Queen", pos: "LB", team: "Baltimore Ravens", college: "LSU" },
      { pick: 24, name: "Cesar Ruiz", pos: "C", team: "New Orleans Saints", college: "Michigan" },
      { pick: 25, name: "Austin Jackson", pos: "OT", team: "Miami Dolphins", college: "USC" },
      { pick: 26, name: "Jordan Love", pos: "QB", team: "Green Bay Packers", college: "Utah State" },
      { pick: 27, name: "Yetur Gross-Matos", pos: "DE", team: "Carolina Panthers", college: "Penn State" },
      { pick: 28, name: "A.J. Terrell", pos: "CB", team: "Atlanta Falcons", college: "Clemson" },
      { pick: 29, name: "Tee Higgins", pos: "WR", team: "Cincinnati Bengals", college: "Clemson" },
      { pick: 30, name: "Jeff Gladney", pos: "CB", team: "Minnesota Vikings", college: "TCU" },
      { pick: 31, name: "Jonathan Taylor", pos: "RB", team: "Indianapolis Colts", college: "Wisconsin" },
      { pick: 32, name: "Clyde Edwards-Helaire", pos: "RB", team: "Kansas City Chiefs", college: "LSU" },
    ],
  },
  2025: {
    label: "2025 NFL Draft",
    picks: [
      { pick: 1, name: "Cam Ward", pos: "QB", team: "Tennessee Titans", college: "Miami" },
      { pick: 2, name: "Travis Hunter", pos: "CB/WR", team: "Jacksonville Jaguars", college: "Colorado" },
      { pick: 3, name: "Abdul Carter", pos: "EDGE", team: "New York Giants", college: "Penn State" },
      { pick: 4, name: "Will Campbell", pos: "OT", team: "New England Patriots", college: "LSU" },
      { pick: 5, name: "Mason Graham", pos: "DT", team: "Cleveland Browns", college: "Michigan" },
      { pick: 6, name: "Ashton Jeanty", pos: "RB", team: "Las Vegas Raiders", college: "Boise State" },
      { pick: 7, name: "Armand Membou", pos: "OT", team: "New York Jets", college: "Missouri" },
      { pick: 8, name: "Tetairoa McMillan", pos: "WR", team: "Carolina Panthers", college: "Arizona" },
      { pick: 9, name: "Kelvin Banks Jr.", pos: "OT", team: "New Orleans Saints", college: "Texas" },
      { pick: 10, name: "Colston Loveland", pos: "TE", team: "Chicago Bears", college: "Michigan" },
      { pick: 11, name: "Mykel Williams", pos: "EDGE", team: "San Francisco 49ers", college: "Georgia" },
      { pick: 12, name: "Tyler Booker", pos: "G", team: "Dallas Cowboys", college: "Alabama" },
      { pick: 13, name: "Kenneth Grant", pos: "DT", team: "Miami Dolphins", college: "Michigan" },
      { pick: 14, name: "Tyler Warren", pos: "TE", team: "Indianapolis Colts", college: "Penn State" },
      { pick: 15, name: "Jalon Walker", pos: "LB", team: "Atlanta Falcons", college: "Georgia" },
      { pick: 16, name: "Walter Nolen", pos: "DT", team: "Arizona Cardinals", college: "Ole Miss" },
      { pick: 17, name: "Shemar Stewart", pos: "EDGE", team: "Cincinnati Bengals", college: "Texas A&M" },
      { pick: 18, name: "Grey Zabel", pos: "G", team: "Seattle Seahawks", college: "North Dakota State" },
      { pick: 19, name: "Emeka Egbuka", pos: "WR", team: "Tampa Bay Buccaneers", college: "Ohio State" },
      { pick: 20, name: "Jahdae Barron", pos: "CB", team: "Denver Broncos", college: "Texas" },
      { pick: 21, name: "Derrick Harmon", pos: "DT", team: "Pittsburgh Steelers", college: "Oregon" },
      { pick: 22, name: "Omarion Hampton", pos: "RB", team: "Los Angeles Chargers", college: "North Carolina" },
      { pick: 23, name: "Matthew Golden", pos: "WR", team: "Green Bay Packers", college: "Texas" },
      { pick: 24, name: "Donovan Jackson", pos: "G", team: "Minnesota Vikings", college: "Ohio State" },
      { pick: 25, name: "Jaxson Dart", pos: "QB", team: "New York Giants", college: "Ole Miss" },
      { pick: 26, name: "James Pearce Jr.", pos: "EDGE", team: "Atlanta Falcons", college: "Tennessee" },
      { pick: 27, name: "Malaki Starks", pos: "S", team: "Baltimore Ravens", college: "Georgia" },
      { pick: 28, name: "Tyleik Williams", pos: "DT", team: "Detroit Lions", college: "Ohio State" },
      { pick: 29, name: "Josh Conerly Jr.", pos: "OT", team: "Washington Commanders", college: "Oregon" },
      { pick: 30, name: "Maxwell Hairston", pos: "CB", team: "Buffalo Bills", college: "Kentucky" },
      { pick: 31, name: "Jihaad Campbell", pos: "LB", team: "Philadelphia Eagles", college: "Alabama" },
      { pick: 32, name: "Josh Simmons", pos: "OT", team: "Kansas City Chiefs", college: "Ohio State" },
    ],
  },
};

const YEARS = Object.keys(DRAFT_CLASSES).sort((a, b) => b - a);


function normalize(s) {
  return s.toLowerCase().trim().replace(/[''`\.]/g, "").replace(/\s+/g, " ").replace(/\bjr\b/, "").replace(/\biii\b/, "").replace(/\bii\b/, "").replace(/\bsr\b/, "").trim();
}

function matchesPlayer(input, playerName) {
  const ni = normalize(input); const np = normalize(playerName);
  if (!ni) return false; if (np === ni) return true;
  const parts = np.split(" "); const last = parts[parts.length - 1];
  if (last.length > 3 && last === ni) return true;
  if (parts.length >= 2 && `${parts[0]} ${parts[parts.length - 1]}` === ni) return true;
  return false;
}

export default function DraftClassQuiz() {
  const trackPlay = usePlayCount("draft-class-quiz");
  const [selectedYear, setSelectedYear] = useState(null);
  const [found, setFound] = useState(new Set());
  const [input, setInput] = useState("");
  const [gameActive, setGameActive] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [flash, setFlash] = useState(null);
  const inputRef = useRef(null);

  const draft = selectedYear ? DRAFT_CLASSES[selectedYear] : null;
  const picks = draft ? draft.picks : [];
  const total = picks.length;
  const finished = found.size === total && total > 0;

  const startGame = (year) => { setSelectedYear(year); setFound(new Set()); setInput(""); setGameActive(true); setGaveUp(false); trackPlay(); setTimeout(() => inputRef.current?.focus(), 100); };

  const handleInput = useCallback((val) => {
    setInput(val); if (!draft) return;
    for (const p of draft.picks) {
      if (!found.has(p.pick) && matchesPlayer(val, p.name)) {
        setFound(prev => { const next = new Set(prev); next.add(p.pick); if (next.size === total) setGameActive(false); return next; });
        setInput(""); setFlash(p.pick); setTimeout(() => setFlash(null), 700); return;
      }
    }
  }, [draft, found, total]);

  const handleGiveUp = () => { setGaveUp(true); setGameActive(false); setShowGiveUpConfirm(false); };

  if (!selectedYear) {
    return (
      <div style={{ minHeight: "100vh", background: "#07070f", backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d1f 0%, #07070f 60%)", color: "#f0f0f0", fontFamily: "'Oswald', sans-serif", padding: "84px 16px 60px" }}>
        <Helmet>
          <title>Draft Class Quiz – Name Every First-Round Pick – TrivialSports</title>
          <meta name="description" content="Can you name every first-round NFL Draft pick? Pick a year from the 2020s and test your draft knowledge at TrivialSports." />
          <meta property="og:title" content="Draft Class Quiz – Name Every First-Round Pick – TrivialSports" />
          <meta property="og:description" content="Can you name every first-round NFL Draft pick? Pick a year and test your knowledge." />
          <meta property="og:url" content="https://trivialsports.com/games/draft-class-quiz" />
          <meta property="og:type" content="website" />
          <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
        </Helmet>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>{`@keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div style={{ maxWidth: 600, margin: "0 auto", animation: "fadeUp 0.4s ease both" }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>NFL Trivia</div>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: "0 0 8px", color: "#ffffff", letterSpacing: -0.5 }}>Draft Class Quiz</h1>
          <p style={{ fontSize: 13, color: "#c8a050", margin: "0 0 28px", fontFamily: "Georgia, serif" }}>Pick a draft year. Name the player selected with each pick before time runs out.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {YEARS.map((year, i) => (
              <button key={year} onClick={() => startGame(year)} style={{ background: "linear-gradient(135deg,#0a0a18,#0d0d1f)", border: "1px solid #ffffff0a", borderRadius: 14, padding: "22px 16px", cursor: "pointer", textAlign: "center", transition: "all 0.2s ease", animation: "fadeUp 0.4s ease both", animationDelay: `${i * 0.06}s` }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#e74c3c44"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ffffff0a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5 }}>{year}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#e74c3c88", marginTop: 4 }}>{DRAFT_CLASSES[year].picks.length} Picks</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#07070f", backgroundImage: "radial-gradient(ellipse at 50% 0%, #0d0d1f 0%, #07070f 60%)", color: "#f0f0f0", fontFamily: "'Oswald', sans-serif", padding: "84px 16px 60px" }}>
      <Helmet>
        <title>{selectedYear} NFL Draft First Round – Draft Class Quiz – TrivialSports</title>
        <meta name="description" content={`Can you name all ${total} first-round picks from the ${selectedYear} NFL Draft? Test your knowledge at TrivialSports.`} />
        <meta property="og:title" content={`${selectedYear} NFL Draft First Round – Draft Class Quiz – TrivialSports`} />
        <meta property="og:description" content={`Can you name all ${total} first-round picks from the ${selectedYear} NFL Draft?`} />
        <meta property="og:url" content="https://trivialsports.com/games/draft-class-quiz" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
      </Helmet>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        input::placeholder { color: #ffffff15; } input:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      <div style={{ maxWidth: 700, margin: "0 auto 24px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#c8a050", marginBottom: 6 }}>NFL Trivia</div>
            <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, textTransform: "uppercase", lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5 }}>{selectedYear} Draft – First Round</h1>
            <p style={{ fontSize: 13, color: "#c8a050", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>Name the player selected with each pick.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Found</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>{found.size}<span style={{ fontSize: 14, color: "#c8a05099" }}>/{total}</span></div>
            </div>
            {gameActive && !finished && (
              <button onClick={() => setShowGiveUpConfirm(true)} style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "9px 16px", borderRadius: 8, cursor: "pointer", border: "1px solid #e74c3c33", background: "transparent", color: "#e74c3c88", fontFamily: "'Oswald', sans-serif", transition: "all 0.18s" }}
                onMouseEnter={e => { e.currentTarget.style.color="#e74c3c"; e.currentTarget.style.borderColor="#e74c3c55"; }}
                onMouseLeave={e => { e.currentTarget.style.color="#e74c3c88"; e.currentTarget.style.borderColor="#e74c3c33"; }}>Give Up</button>
            )}
            <button onClick={() => { setSelectedYear(null); setGameActive(false); }} style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", padding: "9px 16px", borderRadius: 8, cursor: "pointer", border: "1px solid #ffffff15", background: "transparent", color: "#ffffff44", fontFamily: "'Oswald', sans-serif" }}>← Back</button>
          </div>
        </div>
        <div style={{ marginTop: 16, height: 3, background: "#ffffff06", borderRadius: 2, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(found.size / total) * 100}%`, background: "linear-gradient(90deg, #c8a050, #e8c070)", borderRadius: 2, transition: "width 0.3s ease" }} />
        </div>
      </div>

      {gameActive && !finished && (
        <div style={{ maxWidth: 700, margin: "0 auto 20px" }}>
          <input ref={inputRef} value={input} onChange={e => handleInput(e.target.value)} placeholder="Type a player name..." autoFocus
            style={{ width: "100%", background: "#0c0c1e", border: "1px solid #ffffff18", borderRadius: 12, padding: "14px 18px", color: "#ffffff", fontSize: 16, fontFamily: "'Oswald', sans-serif", fontWeight: 600, letterSpacing: 1, outline: "none", boxSizing: "border-box" }}
            onFocus={e => e.target.style.borderColor = "#c8a05066"} onBlur={e => e.target.style.borderColor = "#ffffff18"} />
        </div>
      )}

      {(finished || gaveUp) && (
        <div style={{ maxWidth: 700, margin: "0 auto 20px", background: gaveUp ? "linear-gradient(135deg,#1a0808,#2a1010)" : "linear-gradient(135deg,#0f0d00,#1a1500)", border: `1px solid ${gaveUp ? "#e74c3c33" : "#c8a05044"}`, borderRadius: 14, padding: "16px 24px", textAlign: "center", animation: "popIn 0.4s ease both" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#c8a050", letterSpacing: 1, textTransform: "uppercase" }}>
            {finished ? `All ${total} picks named!` : `Gave up – ${found.size} of ${total} found`}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 700, margin: "0 auto", border: "1px solid #ffffff0a", borderRadius: 12, overflow: "hidden", animation: "fadeUp 0.5s ease both", animationDelay: "0.1s" }}>
        {picks.map((p, i) => {
          const isFound = found.has(p.pick); const reveal = gaveUp && !isFound; const isFlashing = flash === p.pick;
          return (
            <div key={p.pick} style={{ display: "grid", gridTemplateColumns: "52px 1fr 1fr", gap: 0, borderBottom: i < picks.length - 1 ? "1px solid #ffffff07" : "none", background: isFlashing ? "#c8a05015" : isFound ? "#0a120008" : i % 2 === 0 ? "#09090f" : "#07070d", transition: "background 0.3s" }}>
              <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #ffffff07" }}>
                <span style={{ fontSize: 14, fontWeight: 900, color: isFound ? "#c8a050" : "#ffffff22", fontVariantNumeric: "tabular-nums" }}>#{p.pick}</span>
              </div>
              <div style={{ padding: "10px 12px", display: "flex", alignItems: "center", borderRight: "1px solid #ffffff07" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#ffffff44", fontFamily: "'Oswald', sans-serif", letterSpacing: 0.5 }}>{p.team}</span>
              </div>
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                {isFound || reveal ? (
                  <><div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.3, color: isFound ? "#ffffff" : "#e8806070", fontFamily: "'Oswald', sans-serif", lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: isFound ? "#c8a05088" : "#e74c3c44", fontFamily: "'Oswald', sans-serif", letterSpacing: 1, marginTop: 2 }}>{p.pos} {"\u00B7"} {p.college}</div></>
                ) : (<div style={{ fontSize: 12, color: "#ffffff12", fontFamily: "'Oswald', sans-serif", letterSpacing: 1 }}>???</div>)}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ maxWidth: 700, margin: "16px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>Last names accepted · Suffixes (Jr., III) optional</div>
      </div>

      {showGiveUpConfirm && (
        <div style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setShowGiveUpConfirm(false)}>
          <div style={{ background: "#0e0e22", border: "2px solid #e74c3c44", borderRadius: 18, padding: "30px 26px", maxWidth: 320, width: "90%", textAlign: "center", boxShadow: "0 24px 80px #000000cc", animation: "popIn 0.25s ease both" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>🏳️</div>
            <h3 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 900, color: "#eeeeee", fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>Give Up?</h3>
            <p style={{ margin: "0 0 22px", fontSize: 13, color: "#c8a050", lineHeight: 1.7, fontFamily: "Georgia, serif" }}>All answers will be revealed.<br />You found <span style={{ color: "#e74c3c", fontWeight: 900 }}>{found.size}</span> of {total}.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGiveUpConfirm(false)} style={{ flex: 1, background: "#141432", color: "#aaaacc", border: "1px solid #252548", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Oswald', sans-serif", letterSpacing: 1.5, textTransform: "uppercase" }}>Cancel</button>
              <button onClick={handleGiveUp} style={{ flex: 1, background: "#e74c3c", color: "#fff", border: "none", borderRadius: 10, padding: "11px 0", fontSize: 13, fontWeight: 900, cursor: "pointer", fontFamily: "'Oswald', sans-serif", letterSpacing: 1.5, textTransform: "uppercase", boxShadow: "0 4px 14px #e74c3c44" }}>Reveal All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
