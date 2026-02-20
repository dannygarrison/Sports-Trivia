import { useState, useRef, useCallback, useEffect } from "react";

// MVP award started in 1955. Pre-1955 entries have mvp: null.
const WORLD_SERIES = [
  { year: 2025, winner: "Los Angeles Dodgers",      loser: "Toronto Blue Jays",          mvp: "Yoshinobu Yamamoto",  mvpPos: "P"  },
  { year: 2024, winner: "Los Angeles Dodgers",      loser: "New York Yankees",           mvp: "Freddie Freeman",     mvpPos: "1B" },
  { year: 2023, winner: "Texas Rangers",            loser: "Arizona Diamondbacks",       mvp: "Corey Seager",        mvpPos: "SS" },
  { year: 2022, winner: "Houston Astros",           loser: "Philadelphia Phillies",      mvp: "Jeremy Peña",         mvpPos: "SS" },
  { year: 2021, winner: "Atlanta Braves",           loser: "Houston Astros",             mvp: "Jorge Soler",         mvpPos: "OF" },
  { year: 2020, winner: "Los Angeles Dodgers",      loser: "Tampa Bay Rays",             mvp: "Corey Seager",        mvpPos: "SS" },
  { year: 2019, winner: "Washington Nationals",     loser: "Houston Astros",             mvp: "Stephen Strasburg",   mvpPos: "P"  },
  { year: 2018, winner: "Boston Red Sox",           loser: "Los Angeles Dodgers",        mvp: "Steve Pearce",        mvpPos: "1B" },
  { year: 2017, winner: "Houston Astros",           loser: "Los Angeles Dodgers",        mvp: "George Springer",     mvpPos: "OF" },
  { year: 2016, winner: "Chicago Cubs",             loser: "Cleveland Indians",          mvp: "Ben Zobrist",         mvpPos: "2B" },
  { year: 2015, winner: "Kansas City Royals",       loser: "New York Mets",              mvp: "Salvador Perez",      mvpPos: "C"  },
  { year: 2014, winner: "San Francisco Giants",     loser: "Kansas City Royals",         mvp: "Madison Bumgarner",   mvpPos: "P"  },
  { year: 2013, winner: "Boston Red Sox",           loser: "St. Louis Cardinals",        mvp: "David Ortiz",         mvpPos: "DH" },
  { year: 2012, winner: "San Francisco Giants",     loser: "Detroit Tigers",             mvp: "Marco Scutaro",       mvpPos: "2B" },
  { year: 2011, winner: "St. Louis Cardinals",      loser: "Texas Rangers",              mvp: "David Freese",        mvpPos: "3B" },
  { year: 2010, winner: "San Francisco Giants",     loser: "Texas Rangers",              mvp: "Edgar Rentería",      mvpPos: "SS" },
  { year: 2009, winner: "New York Yankees",         loser: "Philadelphia Phillies",      mvp: "Hideki Matsui",       mvpPos: "DH" },
  { year: 2008, winner: "Philadelphia Phillies",    loser: "Tampa Bay Rays",             mvp: "Cole Hamels",         mvpPos: "P"  },
  { year: 2007, winner: "Boston Red Sox",           loser: "Colorado Rockies",           mvp: "Mike Lowell",         mvpPos: "3B" },
  { year: 2006, winner: "St. Louis Cardinals",      loser: "Detroit Tigers",             mvp: "David Eckstein",      mvpPos: "SS" },
  { year: 2005, winner: "Chicago White Sox",        loser: "Houston Astros",             mvp: "Jermaine Dye",        mvpPos: "OF" },
  { year: 2004, winner: "Boston Red Sox",           loser: "St. Louis Cardinals",        mvp: "Manny Ramirez",       mvpPos: "OF" },
  { year: 2003, winner: "Florida Marlins",          loser: "New York Yankees",           mvp: "Josh Beckett",        mvpPos: "P"  },
  { year: 2002, winner: "Anaheim Angels",           loser: "San Francisco Giants",       mvp: "Scott Spiezio",       mvpPos: "1B" },
  { year: 2001, winner: "Arizona Diamondbacks",     loser: "New York Yankees",           mvp: "Randy Johnson",       mvpPos: "P"  },
  { year: 2000, winner: "New York Yankees",         loser: "New York Mets",              mvp: "Derek Jeter",         mvpPos: "SS" },
  { year: 1999, winner: "New York Yankees",         loser: "Atlanta Braves",             mvp: "Mariano Rivera",      mvpPos: "P"  },
  { year: 1998, winner: "New York Yankees",         loser: "San Diego Padres",           mvp: "Scott Brosius",       mvpPos: "3B" },
  { year: 1997, winner: "Florida Marlins",          loser: "Cleveland Indians",          mvp: "Liván Hernández",     mvpPos: "P"  },
  { year: 1996, winner: "New York Yankees",         loser: "Atlanta Braves",             mvp: "John Wetteland",      mvpPos: "P"  },
  { year: 1995, winner: "Atlanta Braves",           loser: "Cleveland Indians",          mvp: "Tom Glavine",         mvpPos: "P"  },
  { year: 1993, winner: "Toronto Blue Jays",        loser: "Philadelphia Phillies",      mvp: "Paul Molitor",        mvpPos: "DH" },
  { year: 1992, winner: "Toronto Blue Jays",        loser: "Atlanta Braves",             mvp: "Pat Borders",         mvpPos: "C"  },
  { year: 1991, winner: "Minnesota Twins",          loser: "Atlanta Braves",             mvp: "Jack Morris",         mvpPos: "P"  },
  { year: 1990, winner: "Cincinnati Reds",          loser: "Oakland Athletics",          mvp: "José Rijo",           mvpPos: "P"  },
  { year: 1989, winner: "Oakland Athletics",        loser: "San Francisco Giants",       mvp: "Dave Stewart",        mvpPos: "P"  },
  { year: 1988, winner: "Los Angeles Dodgers",      loser: "Oakland Athletics",          mvp: "Orel Hershiser",      mvpPos: "P"  },
  { year: 1987, winner: "Minnesota Twins",          loser: "St. Louis Cardinals",        mvp: "Frank Viola",         mvpPos: "P"  },
  { year: 1986, winner: "New York Mets",            loser: "Boston Red Sox",             mvp: "Ray Knight",          mvpPos: "3B" },
  { year: 1985, winner: "Kansas City Royals",       loser: "St. Louis Cardinals",        mvp: "Bret Saberhagen",     mvpPos: "P"  },
  { year: 1984, winner: "Detroit Tigers",           loser: "San Diego Padres",           mvp: "Alan Trammell",       mvpPos: "SS" },
  { year: 1983, winner: "Baltimore Orioles",        loser: "Philadelphia Phillies",      mvp: "Rick Dempsey",        mvpPos: "C"  },
  { year: 1982, winner: "St. Louis Cardinals",      loser: "Milwaukee Brewers",          mvp: "Darrell Porter",      mvpPos: "C"  },
  { year: 1981, winner: "Los Angeles Dodgers",      loser: "New York Yankees",           mvp: "Ron Cey",             mvpPos: "3B" },
  { year: 1980, winner: "Philadelphia Phillies",    loser: "Kansas City Royals",         mvp: "Mike Schmidt",        mvpPos: "3B" },
  { year: 1979, winner: "Pittsburgh Pirates",       loser: "Baltimore Orioles",          mvp: "Willie Stargell",     mvpPos: "1B" },
  { year: 1978, winner: "New York Yankees",         loser: "Los Angeles Dodgers",        mvp: "Bucky Dent",          mvpPos: "SS" },
  { year: 1977, winner: "New York Yankees",         loser: "Los Angeles Dodgers",        mvp: "Reggie Jackson",      mvpPos: "OF" },
  { year: 1976, winner: "Cincinnati Reds",          loser: "New York Yankees",           mvp: "Johnny Bench",        mvpPos: "C"  },
  { year: 1975, winner: "Cincinnati Reds",          loser: "Boston Red Sox",             mvp: "Pete Rose",           mvpPos: "3B" },
  { year: 1974, winner: "Oakland Athletics",        loser: "Los Angeles Dodgers",        mvp: "Rollie Fingers",      mvpPos: "P"  },
  { year: 1973, winner: "Oakland Athletics",        loser: "New York Mets",              mvp: "Reggie Jackson",      mvpPos: "OF" },
  { year: 1972, winner: "Oakland Athletics",        loser: "Cincinnati Reds",            mvp: "Gene Tenace",         mvpPos: "C"  },
  { year: 1971, winner: "Pittsburgh Pirates",       loser: "Baltimore Orioles",          mvp: "Roberto Clemente",    mvpPos: "OF" },
  { year: 1970, winner: "Baltimore Orioles",        loser: "Cincinnati Reds",            mvp: "Brooks Robinson",     mvpPos: "3B" },
  { year: 1969, winner: "New York Mets",            loser: "Baltimore Orioles",          mvp: "Donn Clendenon",      mvpPos: "1B" },
  { year: 1968, winner: "Detroit Tigers",           loser: "St. Louis Cardinals",        mvp: "Mickey Lolich",       mvpPos: "P"  },
  { year: 1967, winner: "St. Louis Cardinals",      loser: "Boston Red Sox",             mvp: "Bob Gibson",          mvpPos: "P"  },
  { year: 1966, winner: "Baltimore Orioles",        loser: "Los Angeles Dodgers",        mvp: "Frank Robinson",      mvpPos: "OF" },
  { year: 1965, winner: "Los Angeles Dodgers",      loser: "Minnesota Twins",            mvp: "Sandy Koufax",        mvpPos: "P"  },
  { year: 1964, winner: "St. Louis Cardinals",      loser: "New York Yankees",           mvp: "Bob Gibson",          mvpPos: "P"  },
  { year: 1963, winner: "Los Angeles Dodgers",      loser: "New York Yankees",           mvp: "Sandy Koufax",        mvpPos: "P"  },
  { year: 1962, winner: "New York Yankees",         loser: "San Francisco Giants",       mvp: "Ralph Terry",         mvpPos: "P"  },
  { year: 1961, winner: "New York Yankees",         loser: "Cincinnati Reds",            mvp: "Whitey Ford",         mvpPos: "P"  },
  { year: 1960, winner: "Pittsburgh Pirates",       loser: "New York Yankees",           mvp: "Bobby Richardson",    mvpPos: "2B" },
  { year: 1959, winner: "Los Angeles Dodgers",      loser: "Chicago White Sox",          mvp: "Larry Sherry",        mvpPos: "P"  },
  { year: 1958, winner: "New York Yankees",         loser: "Milwaukee Braves",           mvp: "Bob Turley",          mvpPos: "P"  },
  { year: 1957, winner: "Milwaukee Braves",         loser: "New York Yankees",           mvp: "Lew Burdette",        mvpPos: "P"  },
  { year: 1956, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: "Don Larsen",          mvpPos: "P"  },
  { year: 1955, winner: "Brooklyn Dodgers",         loser: "New York Yankees",           mvp: "Johnny Podres",       mvpPos: "P"  },
  { year: 1954, winner: "New York Giants",          loser: "Cleveland Indians",          mvp: null, mvpPos: null },
  { year: 1953, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: null, mvpPos: null },
  { year: 1952, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: null, mvpPos: null },
  { year: 1951, winner: "New York Yankees",         loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1950, winner: "New York Yankees",         loser: "Philadelphia Phillies",      mvp: null, mvpPos: null },
  { year: 1949, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: null, mvpPos: null },
  { year: 1948, winner: "Cleveland Indians",        loser: "Boston Braves",              mvp: null, mvpPos: null },
  { year: 1947, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: null, mvpPos: null },
  { year: 1946, winner: "St. Louis Cardinals",      loser: "Boston Red Sox",             mvp: null, mvpPos: null },
  { year: 1945, winner: "Detroit Tigers",           loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1944, winner: "St. Louis Cardinals",      loser: "St. Louis Browns",           mvp: null, mvpPos: null },
  { year: 1943, winner: "New York Yankees",         loser: "St. Louis Cardinals",        mvp: null, mvpPos: null },
  { year: 1942, winner: "St. Louis Cardinals",      loser: "New York Yankees",           mvp: null, mvpPos: null },
  { year: 1941, winner: "New York Yankees",         loser: "Brooklyn Dodgers",           mvp: null, mvpPos: null },
  { year: 1940, winner: "Cincinnati Reds",          loser: "Detroit Tigers",             mvp: null, mvpPos: null },
  { year: 1939, winner: "New York Yankees",         loser: "Cincinnati Reds",            mvp: null, mvpPos: null },
  { year: 1938, winner: "New York Yankees",         loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1937, winner: "New York Yankees",         loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1936, winner: "New York Yankees",         loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1935, winner: "Detroit Tigers",           loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1934, winner: "St. Louis Cardinals",      loser: "Detroit Tigers",             mvp: null, mvpPos: null },
  { year: 1933, winner: "New York Giants",          loser: "Washington Senators",        mvp: null, mvpPos: null },
  { year: 1932, winner: "New York Yankees",         loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1931, winner: "St. Louis Cardinals",      loser: "Philadelphia Athletics",     mvp: null, mvpPos: null },
  { year: 1930, winner: "Philadelphia Athletics",   loser: "St. Louis Cardinals",        mvp: null, mvpPos: null },
  { year: 1929, winner: "Philadelphia Athletics",   loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1928, winner: "New York Yankees",         loser: "St. Louis Cardinals",        mvp: null, mvpPos: null },
  { year: 1927, winner: "New York Yankees",         loser: "Pittsburgh Pirates",         mvp: null, mvpPos: null },
  { year: 1926, winner: "St. Louis Cardinals",      loser: "New York Yankees",           mvp: null, mvpPos: null },
  { year: 1925, winner: "Pittsburgh Pirates",       loser: "Washington Senators",        mvp: null, mvpPos: null },
  { year: 1924, winner: "Washington Senators",      loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1923, winner: "New York Yankees",         loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1922, winner: "New York Giants",          loser: "New York Yankees",           mvp: null, mvpPos: null },
  { year: 1921, winner: "New York Giants",          loser: "New York Yankees",           mvp: null, mvpPos: null },
  { year: 1920, winner: "Cleveland Indians",        loser: "Brooklyn Robins",            mvp: null, mvpPos: null },
  { year: 1919, winner: "Cincinnati Reds",          loser: "Chicago White Sox",          mvp: null, mvpPos: null },
  { year: 1918, winner: "Boston Red Sox",           loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1917, winner: "Chicago White Sox",        loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1916, winner: "Boston Red Sox",           loser: "Brooklyn Robins",            mvp: null, mvpPos: null },
  { year: 1915, winner: "Boston Red Sox",           loser: "Philadelphia Phillies",      mvp: null, mvpPos: null },
  { year: 1914, winner: "Boston Braves",            loser: "Philadelphia Athletics",     mvp: null, mvpPos: null },
  { year: 1913, winner: "Philadelphia Athletics",   loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1912, winner: "Boston Red Sox",           loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1911, winner: "Philadelphia Athletics",   loser: "New York Giants",            mvp: null, mvpPos: null },
  { year: 1910, winner: "Philadelphia Athletics",   loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1909, winner: "Pittsburgh Pirates",       loser: "Detroit Tigers",             mvp: null, mvpPos: null },
  { year: 1908, winner: "Chicago Cubs",             loser: "Detroit Tigers",             mvp: null, mvpPos: null },
  { year: 1907, winner: "Chicago Cubs",             loser: "Detroit Tigers",             mvp: null, mvpPos: null },
  { year: 1906, winner: "Chicago White Sox",        loser: "Chicago Cubs",               mvp: null, mvpPos: null },
  { year: 1905, winner: "New York Giants",          loser: "Philadelphia Athletics",     mvp: null, mvpPos: null },
  { year: 1903, winner: "Boston Americans",         loser: "Pittsburgh Pirates",         mvp: null, mvpPos: null },
];

const TEAM_ALIASES = {
  "los angeles dodgers":      ["la dodgers", "l.a. dodgers", "dodgers", "la", "lad"],
  "toronto blue jays":        ["toronto", "blue jays", "jays", "tbj"],
  "new york yankees":         ["new york", "yankees", "ny yankees", "nyy", "bronx bombers"],
  "texas rangers":            ["texas", "rangers"],
  "arizona diamondbacks":     ["arizona", "diamondbacks", "dbacks", "d-backs"],
  "houston astros":           ["houston", "astros"],
  "philadelphia phillies":    ["philadelphia", "phillies", "philly"],
  "atlanta braves":           ["atlanta", "braves"],
  "tampa bay rays":           ["tampa bay", "rays", "tb rays"],
  "washington nationals":     ["washington", "nationals", "nats"],
  "boston red sox":           ["boston", "red sox", "sox", "bos"],
  "chicago cubs":             ["chicago cubs", "cubs"],
  "cleveland indians":        ["cleveland", "indians", "tribe"],
  "kansas city royals":       ["kansas city", "royals", "kc"],
  "new york mets":            ["ny mets", "mets", "nyy mets"],
  "san francisco giants":     ["san francisco", "sf giants", "giants", "sfg"],
  "new york giants":          ["ny giants", "new york giants"],
  "detroit tigers":           ["detroit", "tigers"],
  "st. louis cardinals":      ["st louis cardinals", "st. louis", "st louis", "cardinals", "cards", "stl"],
  "minnesota twins":          ["minnesota", "twins"],
  "oakland athletics":        ["oakland", "athletics", "a's", "as", "oak"],
  "anaheim angels":           ["anaheim", "angels", "la angels", "l.a. angels"],
  "florida marlins":          ["florida", "marlins"],
  "miami marlins":            ["miami", "marlins"],
  "cincinnati reds":          ["cincinnati", "reds"],
  "pittsburgh pirates":       ["pittsburgh", "pirates", "bucs"],
  "baltimore orioles":        ["baltimore", "orioles", "o's"],
  "chicago white sox":        ["chicago white sox", "white sox", "chisox"],
  "san diego padres":         ["san diego", "padres"],
  "milwaukee brewers":        ["milwaukee", "brewers"],
  "colorado rockies":         ["colorado", "rockies"],
  "brooklyn dodgers":         ["brooklyn", "bums"],
  "brooklyn robins":          ["brooklyn robins", "robins"],
  "boston americans":         ["boston americans", "americans"],
  "boston braves":            ["boston braves"],
  "milwaukee braves":         ["milwaukee braves"],
  "philadelphia athletics":   ["philadelphia athletics", "philly athletics"],
  "washington senators":      ["washington senators", "senators"],
  "st. louis browns":         ["st louis browns", "browns"],
  "new york giants":          ["ny giants baseball"],
  "cleveland guardians":      ["cleveland guardians", "guardians"],
};

const MVP_ALIASES = {
  "yoshinobu yamamoto":   ["yamamoto"],
  "freddie freeman":      ["freeman", "freddie"],
  "corey seager":         ["seager"],
  "jeremy peña":          ["pena", "peña", "jeremy pena"],
  "jorge soler":          ["soler"],
  "stephen strasburg":    ["strasburg"],
  "steve pearce":         ["pearce"],
  "george springer":      ["springer"],
  "ben zobrist":          ["zobrist"],
  "salvador perez":       ["perez", "salvy"],
  "madison bumgarner":    ["bumgarner", "maddybum", "mab"],
  "david ortiz":          ["ortiz", "big papi", "papi"],
  "marco scutaro":        ["scutaro"],
  "david freese":         ["freese"],
  "edgar rentería":       ["renteria", "rentería"],
  "hideki matsui":        ["matsui", "godzilla"],
  "cole hamels":          ["hamels"],
  "mike lowell":          ["lowell"],
  "david eckstein":       ["eckstein"],
  "jermaine dye":         ["dye"],
  "manny ramirez":        ["manny", "ramirez"],
  "josh beckett":         ["beckett"],
  "scott spiezio":        ["spiezio"],
  "randy johnson":        ["johnson", "big unit"],
  "derek jeter":          ["jeter"],
  "mariano rivera":       ["rivera", "mo", "the sandman"],
  "scott brosius":        ["brosius"],
  "liván hernández":      ["hernandez", "livan hernandez", "liván hernandez"],
  "john wetteland":       ["wetteland"],
  "tom glavine":          ["glavine"],
  "paul molitor":         ["molitor"],
  "pat borders":          ["borders"],
  "jack morris":          ["morris"],
  "josé rijo":            ["rijo", "jose rijo"],
  "dave stewart":         ["stewart"],
  "orel hershiser":       ["hershiser", "bulldog"],
  "frank viola":          ["viola"],
  "ray knight":           ["knight"],
  "bret saberhagen":      ["saberhagen"],
  "alan trammell":        ["trammell"],
  "rick dempsey":         ["dempsey"],
  "darrell porter":       ["porter"],
  "ron cey":              ["cey", "the penguin"],
  "mike schmidt":         ["schmidt"],
  "willie stargell":      ["stargell", "pops"],
  "bucky dent":           ["dent"],
  "reggie jackson":       ["jackson", "mr october", "reggie"],
  "johnny bench":         ["bench"],
  "pete rose":            ["rose", "charlie hustle"],
  "rollie fingers":       ["fingers"],
  "gene tenace":          ["tenace"],
  "roberto clemente":     ["clemente"],
  "brooks robinson":      ["robinson", "brooks"],
  "donn clendenon":       ["clendenon"],
  "mickey lolich":        ["lolich"],
  "bob gibson":           ["gibson"],
  "frank robinson":       ["robinson", "frank"],
  "sandy koufax":         ["koufax"],
  "ralph terry":          ["terry"],
  "whitey ford":          ["ford", "chairman of the board"],
  "bobby richardson":     ["richardson"],
  "larry sherry":         ["sherry"],
  "bob turley":           ["turley"],
  "lew burdette":         ["burdette"],
  "don larsen":           ["larsen"],
  "johnny podres":        ["podres"],
};

function normalize(s) {
  return s.toLowerCase().trim()
    .replace(/[''`\.]/g, "")
    .replace(/\s+/g, " ");
}

function matchesTeam(input, teamName) {
  const ni = normalize(input);
  const nt = normalize(teamName);
  if (nt === ni) return true;
  const aliasEntry = Object.entries(TEAM_ALIASES).find(([k]) => normalize(k) === nt);
  const aliases = aliasEntry ? aliasEntry[1] : [];
  return aliases.some(a => normalize(a) === ni);
}

function matchesMVP(input, mvpName) {
  if (!mvpName) return false;
  const ni = normalize(input);
  const nm = normalize(mvpName);
  if (nm === ni) return true;
  const last = nm.split(" ").pop();
  if (last.length > 3 && last === ni) return true;
  const aliasEntry = Object.entries(MVP_ALIASES).find(([k]) => normalize(k) === nm);
  const aliases = aliasEntry ? aliasEntry[1] : [];
  return aliases.some(a => normalize(a) === ni);
}

const FIELDS = ["winner", "loser", "mvp"];
const FIELD_LABELS = { winner: "Winner", loser: "Loser", mvp: "MVP" };

function WorldSeriesRow({ ws, rowSolved, onSolve, gaveUp, index }) {
  const [inputs, setInputs] = useState({ winner: "", loser: "", mvp: "" });
  const [flash, setFlash] = useState(null);
  const refs = { winner: useRef(null), loser: useRef(null), mvp: useRef(null) };

  const hasMvp = !!ws.mvp;
  const requiredFields = hasMvp ? 3 : 2;
  const allDone = hasMvp ? rowSolved.size === 3 : (rowSolved.has("winner") && rowSolved.has("loser"));
  const isEven = index % 2 === 0;

  const handleInput = (field, val) => {
    setInputs(prev => ({ ...prev, [field]: val }));
    let matched = false;
    if (field === "winner" && !rowSolved.has("winner") && matchesTeam(val, ws.winner)) matched = true;
    if (field === "loser"  && !rowSolved.has("loser")  && matchesTeam(val, ws.loser))  matched = true;
    if (field === "mvp"    && !rowSolved.has("mvp")    && matchesMVP(val, ws.mvp))     matched = true;
    if (matched) {
      onSolve(ws.year, field);
      setInputs(prev => ({ ...prev, [field]: "" }));
      setFlash(field);
      setTimeout(() => setFlash(null), 600);
      const nextField = FIELDS.find(f => f !== field && !rowSolved.has(f) && (f !== "mvp" || hasMvp));
      if (nextField && refs[nextField].current) {
        setTimeout(() => refs[nextField].current?.focus(), 50);
      }
    }
  };

  const progress = allDone ? 1 : rowSolved.size / requiredFields;

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "70px 1fr 1fr 1fr",
      gap: 0,
      borderBottom: "1px solid #ffffff07",
      background: allDone ? "#000d0a" : isEven ? "#09090f" : "#07070d",
      transition: "background 0.3s",
    }}>
      {/* Year label */}
      <div style={{
        padding: "10px 12px",
        display: "flex", flexDirection: "column", justifyContent: "center",
        borderRight: "1px solid #ffffff07",
      }}>
        <div style={{
          fontSize: 13, fontWeight: 900,
          color: allDone ? "#4db87a" : "#ffffff88",
          fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.5,
        }}>{ws.year}</div>
        <div style={{ marginTop: 5, height: 2, background: "#ffffff08", borderRadius: 1, overflow: "hidden", width: 36 }}>
          <div style={{
            height: "100%", width: `${progress * 100}%`,
            background: "#4db87a", borderRadius: 1,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Fields */}
      {FIELDS.map(field => {
        const isSolved = rowSolved.has(field);
        const isFlashing = flash === field;
        const reveal = gaveUp && !isSolved;
        const isMvpField = field === "mvp";
        const noMvpData = isMvpField && !hasMvp;
        const value = field === "winner" ? ws.winner : field === "loser" ? ws.loser : ws.mvp;

        return (
          <div key={field} style={{
            padding: "8px 10px",
            borderRight: field !== "mvp" ? "1px solid #ffffff07" : "none",
            display: "flex", flexDirection: "column", justifyContent: "center",
            background: isFlashing ? "#4db87a15" : reveal ? "#1a06061a" : "transparent",
            transition: "background 0.2s",
          }}>
            {noMvpData ? (
              <div style={{
                fontSize: 10, color: "#ffffff12",
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: 1, textTransform: "uppercase",
              }}>Pre-award era</div>
            ) : isSolved || reveal ? (
              <div>
                <div style={{
                  fontSize: 12, fontWeight: 700,
                  color: isSolved ? "#ffffff" : "#e74c3c55",
                  fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 0.3,
                  lineHeight: 1.2,
                }}>{value}</div>
                {isMvpField && ws.mvpPos && (
                  <div style={{
                    fontSize: 9, color: isSolved ? "#4db87a88" : "#e74c3c33",
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: 1, marginTop: 2,
                  }}>{ws.mvpPos}</div>
                )}
              </div>
            ) : (
              <input
                ref={refs[field]}
                value={inputs[field]}
                onChange={e => handleInput(field, e.target.value)}
                placeholder={FIELD_LABELS[field]}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: "1px solid #ffffff0f",
                  color: "#ffffff", fontSize: 12,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 600, letterSpacing: 0.3,
                  padding: "2px 0", outline: "none", width: "100%",
                }}
                onFocus={e => e.target.style.borderColor = "#4db87a66"}
                onBlur={e => e.target.style.borderColor = "#ffffff0f"}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function WorldSeriesTrivia() {
  const [solved, setSolved] = useState({});
  const [showGiveUpConfirm, setShowGiveUpConfirm] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  // Total answerable fields (pre-1955 have no MVP)
  const totalFields = WORLD_SERIES.reduce((s, ws) => s + (ws.mvp ? 3 : 2), 0);
  const totalSolved = Object.values(solved).reduce((s, v) => s + v.size, 0);
  const rowsCompleted = WORLD_SERIES.filter(ws => {
    const s = solved[ws.year];
    if (!s) return false;
    return ws.mvp ? s.size === 3 : (s.has("winner") && s.has("loser"));
  }).length;

  useEffect(() => {
    const iv = setInterval(() => {
      if (timerActive) setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(iv);
  }, [timerActive, startTime]);

  const formatTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSolve = useCallback((year, field) => {
    setSolved(prev => {
      const next = { ...prev, [year]: new Set(prev[year] || []) };
      next[year].add(field);
      // Check completion
      const ws = WORLD_SERIES.find(w => w.year === year);
      const rowDone = ws.mvp ? next[year].size === 3 : (next[year].has("winner") && next[year].has("loser"));
      const newTotal = Object.values(next).reduce((s, v) => s + v.size, 0);
      if (newTotal === totalFields) {
        setTimerActive(false);
        setFinished(true);
      }
      return next;
    });
  }, [totalFields]);

  const handleGiveUp = () => {
    setGaveUp(true);
    setTimerActive(false);
    setShowGiveUpConfirm(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 50% 0%, #050d0a 0%, #07070f 60%)",
      color: "#f0f0f0",
      fontFamily: "'Barlow Condensed', sans-serif",
      padding: "84px 16px 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn  { 0% { transform:scale(0.85); opacity:0; } 60% { transform:scale(1.04); } 100% { transform:scale(1); opacity:1; } }
        input::placeholder { color: #ffffff15; }
        input:focus { outline: none !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #ffffff15; border-radius: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ maxWidth: 900, margin: "0 auto 24px", animation: "fadeUp 0.4s ease both" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 4, textTransform: "uppercase", color: "#4db87a", marginBottom: 6 }}>
              MLB Trivia
            </div>
            <h1 style={{
              fontSize: "clamp(26px, 4vw, 44px)", fontWeight: 900, textTransform: "uppercase",
              lineHeight: 1, margin: 0, color: "#ffffff", letterSpacing: -0.5,
            }}>
              World Series History
            </h1>
            <p style={{ fontSize: 13, color: "#ffffff30", margin: "7px 0 0", fontFamily: "Georgia, serif" }}>
              Name the winner, loser, and MVP for every World Series since 1903.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Time</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: finished ? "#4db87a" : "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {formatTime(elapsed)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Answers</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {totalSolved}<span style={{ fontSize: 14, color: "#ffffff30" }}>/{totalFields}</span>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#ffffff25", marginBottom: 2 }}>Series</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#ffffff", fontVariantNumeric: "tabular-nums" }}>
                {rowsCompleted}<span style={{ fontSize: 14, color: "#ffffff30" }}>/{WORLD_SERIES.length}</span>
              </div>
            </div>
            {!finished && !gaveUp && (
              <button onClick={() => setShowGiveUpConfirm(true)} style={{
                fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 16px", borderRadius: 8, cursor: "pointer",
                border: "1px solid #e74c3c33", background: "transparent", color: "#e74c3c88",
                fontFamily: "'Barlow Condensed', sans-serif", transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.color="#e74c3c"; e.currentTarget.style.borderColor="#e74c3c55"; e.currentTarget.style.background="#e74c3c0f"; }}
                onMouseLeave={e => { e.currentTarget.style.color="#e74c3c88"; e.currentTarget.style.borderColor="#e74c3c33"; e.currentTarget.style.background="transparent"; }}
              >Give Up</button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 3, background: "#ffffff06", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${(totalSolved / totalFields) * 100}%`,
            background: "linear-gradient(90deg, #4db87a, #6dd89a)",
            borderRadius: 2, transition: "width 0.3s ease",
          }} />
        </div>
      </div>

      {/* Finished / gave up banner */}
      {(finished || gaveUp) && (
        <div style={{
          maxWidth: 900, margin: "0 auto 20px",
          background: gaveUp ? "linear-gradient(135deg,#1a0808,#2a1010)" : "linear-gradient(135deg,#001208,#001f10)",
          border: `1px solid ${gaveUp ? "#e74c3c33" : "#4db87a44"}`,
          borderRadius: 14, padding: "16px 24px", textAlign: "center",
          animation: "popIn 0.4s ease both",
        }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: gaveUp ? "#e74c3c" : "#4db87a", letterSpacing: 1, textTransform: "uppercase" }}>
            {gaveUp ? `Answers Revealed — ${totalSolved} of ${totalFields} found` : `All ${totalFields} answers correct!`}
          </div>
          <div style={{ fontSize: 13, color: "#ffffff44", marginTop: 4, fontFamily: "Georgia, serif" }}>
            {gaveUp ? "Unfound answers shown in red below." : `${rowsCompleted} World Series completed in ${formatTime(elapsed)}.`}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        maxWidth: 900, margin: "0 auto",
        border: "1px solid #ffffff0a", borderRadius: 12, overflow: "hidden",
        animation: "fadeUp 0.5s ease both", animationDelay: "0.1s",
      }}>
        {/* Column headers */}
        <div style={{
          display: "grid", gridTemplateColumns: "70px 1fr 1fr 1fr",
          background: "#080d0b", borderBottom: "1px solid #ffffff12",
        }}>
          {["Year", "Winner", "Loser", "MVP"].map((h, i) => (
            <div key={h} style={{
              padding: "10px 12px",
              fontSize: 9, fontWeight: 800, letterSpacing: 3,
              textTransform: "uppercase", color: "#ffffff30",
              fontFamily: "'Barlow Condensed', sans-serif",
              borderRight: i < 3 ? "1px solid #ffffff07" : "none",
            }}>{h}</div>
          ))}
        </div>

        {WORLD_SERIES.map((ws, i) => (
          <WorldSeriesRow
            key={ws.year}
            ws={ws}
            index={i}
            rowSolved={solved[ws.year] || new Set()}
            onSolve={handleSolve}
            gaveUp={gaveUp}
          />
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: "16px auto 0", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "#ffffff12", letterSpacing: 2, textTransform: "uppercase" }}>
          City names, nicknames & last names accepted · MVP award began in 1955 · No series in 1904 or 1994
        </div>
      </div>

      {/* Give Up Modal */}
      {showGiveUpConfirm && (
        <div style={{
          position: "fixed", inset: 0, background: "#000000bb", zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
        }} onClick={() => setShowGiveUpConfirm(false)}>
          <div style={{
            background: "#080d0b", border: "2px solid #e74c3c44",
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
              All answers will be revealed.<br />
              You found <span style={{ color: "#e74c3c", fontWeight: 900 }}>{totalSolved}</span> of {totalFields}.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowGiveUpConfirm(false)} style={{
                flex: 1, background: "#0d1510", color: "#aaccaa",
                border: "1px solid #253525", borderRadius: 10,
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
