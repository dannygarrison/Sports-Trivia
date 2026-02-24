import { useState, useEffect, useRef } from "react";

// ── 2026 NFL Draft Order (1st round, estimated) ─────────────────────────────────────────
const INITIAL_PICKS = [
  { pick: 1,  team: "Las Vegas Raiders",        abbr: "LV",  color: "#A5ACAF" },
  { pick: 2,  team: "New York Jets",             abbr: "NYJ", color: "#125740" },
  { pick: 3,  team: "Arizona Cardinals",         abbr: "ARI", color: "#97233F" },
  { pick: 4,  team: "Tennessee Titans",          abbr: "TEN", color: "#4B92DB" },
  { pick: 5,  team: "New York Giants",           abbr: "NYG", color: "#0B2265" },
  { pick: 6,  team: "Cleveland Browns",          abbr: "CLE", color: "#FF3C00" },
  { pick: 7,  team: "Washington Commanders",     abbr: "WSH", color: "#5A1414" },
  { pick: 8,  team: "New Orleans Saints",        abbr: "NO",  color: "#D3BC8D" },
  { pick: 9,  team: "Kansas City Chiefs",        abbr: "KC",  color: "#E31837" },
  { pick: 10, team: "Cincinnati Bengals",        abbr: "CIN", color: "#FB4F14" },
  { pick: 11, team: "Miami Dolphins",            abbr: "MIA", color: "#008E97" },
  { pick: 12, team: "Dallas Cowboys",            abbr: "DAL", color: "#003594" },
  { pick: 13, team: "Los Angeles Rams",          abbr: "LAR", color: "#003594" },
  { pick: 14, team: "Baltimore Ravens",          abbr: "BAL", color: "#241773" },
  { pick: 15, team: "Tampa Bay Buccaneers",      abbr: "TB",  color: "#D50A0A" },
  { pick: 16, team: "New York Jets",             abbr: "NYJ", color: "#125740" },
  { pick: 17, team: "Detroit Lions",             abbr: "DET", color: "#0076B6" },
  { pick: 18, team: "Minnesota Vikings",         abbr: "MIN", color: "#4F2683" },
  { pick: 19, team: "Carolina Panthers",         abbr: "CAR", color: "#0085CA" },
  { pick: 20, team: "Dallas Cowboys",            abbr: "DAL", color: "#003594" },
  { pick: 21, team: "Pittsburgh Steelers",       abbr: "PIT", color: "#FFB612" },
  { pick: 22, team: "Los Angeles Chargers",      abbr: "LAC", color: "#0080C6" },
  { pick: 23, team: "Philadelphia Eagles",       abbr: "PHI", color: "#004C54" },
  { pick: 24, team: "Cleveland Browns",          abbr: "CLE", color: "#FF3C00" },
  { pick: 25, team: "Chicago Bears",             abbr: "CHI", color: "#0B162A" },
  { pick: 26, team: "Buffalo Bills",             abbr: "BUF", color: "#00338D" },
  { pick: 27, team: "San Francisco 49ers",       abbr: "SF",  color: "#AA0000" },
  { pick: 28, team: "Houston Texans",            abbr: "HOU", color: "#03202F" },
  { pick: 29, team: "Los Angeles Rams",          abbr: "LAR", color: "#003594" },
  { pick: 30, team: "Denver Broncos",            abbr: "DEN", color: "#FB4F14" },
  { pick: 31, team: "New England Patriots",      abbr: "NE",  color: "#002244" },
  { pick: 32, team: "Seattle Seahawks",          abbr: "SEA", color: "#002244" },
];

// ── 2026 NFL Draft Prospects (last updated February 23, 2026) ─────────────────────
// Run refresh-prospects.cjs to update these


const ALL_PROSPECTS = [
  {
    "name": "Fernando Mendoza",
    "position": "QB",
    "school": "Indiana"
  },
  {
    "name": "Caleb Downs",
    "position": "S",
    "school": "Ohio State"
  },
  {
    "name": "Rueben Bain Jr",
    "position": "EDGE",
    "school": "Miami"
  },
  {
    "name": "Arvell Reese",
    "position": "LB",
    "school": "Ohio State"
  },
  {
    "name": "Francis Mauigoa",
    "position": "OT",
    "school": "Miami"
  },
  {
    "name": "Spencer Fano",
    "position": "OT",
    "school": "Utah"
  },
  {
    "name": "Jeremiyah Love",
    "position": "RB",
    "school": "Notre Dame"
  },
  {
    "name": "Jermod McCoy",
    "position": "CB",
    "school": "Tennessee"
  },
  {
    "name": "Carnell Tate",
    "position": "WR",
    "school": "Ohio State"
  },
  {
    "name": "Kenyon Sadiq",
    "position": "TE",
    "school": "Oregon"
  },
  {
    "name": "Sonny Styles",
    "position": "LB",
    "school": "Ohio State"
  },
  {
    "name": "David Bailey",
    "position": "EDGE",
    "school": "Texas Tech"
  },
  {
    "name": "Keldric Faulk",
    "position": "EDGE",
    "school": "Auburn"
  },
  {
    "name": "Kadyn Proctor",
    "position": "OT",
    "school": "Alabama"
  },
  {
    "name": "Mansoor Delane",
    "position": "CB",
    "school": "LSU"
  },
  {
    "name": "Peter Woods",
    "position": "DT",
    "school": "Clemson"
  },
  {
    "name": "Avieon Terrell",
    "position": "CB",
    "school": "Clemson"
  },
  {
    "name": "Jordyn Tyson",
    "position": "WR",
    "school": "Arizona State"
  },
  {
    "name": "Kayden McDonald",
    "position": "DT",
    "school": "Ohio State"
  },
  {
    "name": "T.J. Parker",
    "position": "EDGE",
    "school": "Clemson"
  },
  {
    "name": "Ty Simpson",
    "position": "QB",
    "school": "Alabama"
  },
  {
    "name": "Makai Lemon",
    "position": "WR",
    "school": "USC"
  },
  {
    "name": "Monroe Freeling",
    "position": "OT",
    "school": "Georgia"
  },
  {
    "name": "Caleb Lomu",
    "position": "OT",
    "school": "Utah"
  },
  {
    "name": "Blake Miller",
    "position": "OT",
    "school": "Clemson"
  },
  {
    "name": "Akheem Mesidor",
    "position": "EDGE",
    "school": "Miami"
  },
  {
    "name": "Dante Moore",
    "position": "QB",
    "school": "Oregon"
  },
  {
    "name": "Zion Young",
    "position": "EDGE",
    "school": "Missouri"
  },
  {
    "name": "Lee Hunter",
    "position": "DT",
    "school": "Texas Tech"
  },
  {
    "name": "Caleb Banks",
    "position": "DT",
    "school": "Florida"
  },
  {
    "name": "Dillon Thieneman",
    "position": "S",
    "school": "Oregon"
  },
  {
    "name": "Max Iheanachor",
    "position": "OT",
    "school": "Arizona State"
  },
  {
    "name": "Christen Miller",
    "position": "DT",
    "school": "Georgia"
  },
  {
    "name": "Germie Bernard",
    "position": "WR",
    "school": "Alabama"
  },
  {
    "name": "Antonio Williams",
    "position": "WR",
    "school": "Clemson"
  },
  {
    "name": "Isaiah World",
    "position": "OT",
    "school": "Oregon"
  },
  {
    "name": "Emmanuel Pregnon",
    "position": "IOL",
    "school": "Oregon"
  },
  {
    "name": "Eli Stowers",
    "position": "TE",
    "school": "Vanderbilt"
  },
  {
    "name": "Joe Royer",
    "position": "TE",
    "school": "Cincinnati"
  },
  {
    "name": "Max Klare",
    "position": "TE",
    "school": "Ohio State"
  },
  {
    "name": "Michael Trigg",
    "position": "TE",
    "school": "Baylor"
  },
  {
    "name": "Logan Jones",
    "position": "IOL",
    "school": "Iowa"
  },
  {
    "name": "Connor Lew",
    "position": "IOL",
    "school": "Auburn"
  },
  {
    "name": "Sam Hecht",
    "position": "IOL",
    "school": "Kansas State"
  },
  {
    "name": "Jake Slaughter",
    "position": "IOL",
    "school": "Florida"
  },
  {
    "name": "Kenyatta Jackson Jr",
    "position": "EDGE",
    "school": "Ohio State"
  },
  {
    "name": "Drew Allar",
    "position": "QB",
    "school": "Penn State"
  },
  {
    "name": "Carson Beck",
    "position": "QB",
    "school": "Miami"
  },
  {
    "name": "Garrett Nussmeier",
    "position": "QB",
    "school": "LSU"
  },
  {
    "name": "Olaivavega Ioane",
    "position": "IOL",
    "school": "Penn State"
  },
  {
    "name": "Cashius Howell",
    "position": "EDGE",
    "school": "Texas A&M"
  },
  {
    "name": "Justice Haynes",
    "position": "RB",
    "school": "Michigan"
  },
  {
    "name": "L.T. Overton",
    "position": "DT",
    "school": "Alabama"
  },
  {
    "name": "Bear Alexander",
    "position": "DT",
    "school": "Oregon"
  },
  {
    "name": "Dontay Corleone",
    "position": "DT",
    "school": "Cincinnati"
  },
  {
    "name": "Chris Bell",
    "position": "WR",
    "school": "Louisville"
  },
  {
    "name": "Eric Rivers",
    "position": "WR",
    "school": "Georgia Tech"
  },
  {
    "name": "Kevin Coleman",
    "position": "WR",
    "school": "Missouri"
  },
  {
    "name": "Elijah Sarratt",
    "position": "WR",
    "school": "Indiana"
  },
  {
    "name": "Amare Thomas",
    "position": "WR",
    "school": "Houston"
  },
  {
    "name": "Bray Hubbard",
    "position": "S",
    "school": "Alabama"
  },
  {
    "name": "A.J. Haulcy",
    "position": "S",
    "school": "LSU"
  }
];

const PICK_SUGGESTIONS = {
  "1": [
    {
      "name": "Fernando Mendoza",
      "position": "QB",
      "school": "Indiana"
    },
    {
      "name": "Dante Moore",
      "position": "QB",
      "school": "Oregon"
    },
    {
      "name": "Ty Simpson",
      "position": "QB",
      "school": "Alabama"
    }
  ],
  "2": [
    {
      "name": "Caleb Downs",
      "position": "S",
      "school": "Ohio State"
    },
    {
      "name": "Rueben Bain Jr",
      "position": "EDGE",
      "school": "Miami"
    },
    {
      "name": "David Bailey",
      "position": "EDGE",
      "school": "Texas Tech"
    }
  ],
  "3": [
    {
      "name": "Arvell Reese",
      "position": "LB",
      "school": "Ohio State"
    },
    {
      "name": "Sonny Styles",
      "position": "LB",
      "school": "Ohio State"
    },
    {
      "name": "Francis Mauigoa",
      "position": "OT",
      "school": "Miami"
    }
  ],
  "4": [
    {
      "name": "Spencer Fano",
      "position": "OT",
      "school": "Utah"
    },
    {
      "name": "Jeremiyah Love",
      "position": "RB",
      "school": "Notre Dame"
    },
    {
      "name": "Keldric Faulk",
      "position": "EDGE",
      "school": "Auburn"
    }
  ],
  "5": [
    {
      "name": "Jermod McCoy",
      "position": "CB",
      "school": "Tennessee"
    },
    {
      "name": "Kenyon Sadiq",
      "position": "TE",
      "school": "Oregon"
    },
    {
      "name": "Carnell Tate",
      "position": "WR",
      "school": "Ohio State"
    }
  ],
  "6": [
    {
      "name": "Kayden McDonald",
      "position": "DT",
      "school": "Ohio State"
    },
    {
      "name": "Peter Woods",
      "position": "DT",
      "school": "Clemson"
    },
    {
      "name": "Kadyn Proctor",
      "position": "OT",
      "school": "Alabama"
    }
  ],
  "7": [
    {
      "name": "Mansoor Delane",
      "position": "CB",
      "school": "LSU"
    },
    {
      "name": "Avieon Terrell",
      "position": "CB",
      "school": "Clemson"
    },
    {
      "name": "Monroe Freeling",
      "position": "OT",
      "school": "Georgia"
    }
  ],
  "8": [
    {
      "name": "Jordyn Tyson",
      "position": "WR",
      "school": "Arizona State"
    },
    {
      "name": "T.J. Parker",
      "position": "EDGE",
      "school": "Clemson"
    },
    {
      "name": "Akheem Mesidor",
      "position": "EDGE",
      "school": "Miami"
    }
  ],
  "9": [
    {
      "name": "Makai Lemon",
      "position": "WR",
      "school": "USC"
    },
    {
      "name": "Zion Young",
      "position": "EDGE",
      "school": "Missouri"
    },
    {
      "name": "Caleb Lomu",
      "position": "OT",
      "school": "Utah"
    }
  ],
  "10": [
    {
      "name": "Blake Miller",
      "position": "OT",
      "school": "Clemson"
    },
    {
      "name": "Lee Hunter",
      "position": "DT",
      "school": "Texas Tech"
    },
    {
      "name": "Dillon Thieneman",
      "position": "S",
      "school": "Oregon"
    }
  ],
  "11": [
    {
      "name": "Caleb Banks",
      "position": "DT",
      "school": "Florida"
    },
    {
      "name": "Max Iheanachor",
      "position": "OT",
      "school": "Arizona State"
    },
    {
      "name": "Christen Miller",
      "position": "DT",
      "school": "Georgia"
    }
  ],
  "12": [
    {
      "name": "Germie Bernard",
      "position": "WR",
      "school": "Alabama"
    },
    {
      "name": "Antonio Williams",
      "position": "WR",
      "school": "Clemson"
    },
    {
      "name": "Isaiah World",
      "position": "OT",
      "school": "Oregon"
    }
  ],
  "13": [
    {
      "name": "Emmanuel Pregnon",
      "position": "IOL",
      "school": "Oregon"
    },
    {
      "name": "Eli Stowers",
      "position": "TE",
      "school": "Vanderbilt"
    },
    {
      "name": "Joe Royer",
      "position": "TE",
      "school": "Cincinnati"
    }
  ],
  "14": [
    {
      "name": "Max Klare",
      "position": "TE",
      "school": "Ohio State"
    },
    {
      "name": "Michael Trigg",
      "position": "TE",
      "school": "Baylor"
    },
    {
      "name": "Logan Jones",
      "position": "IOL",
      "school": "Iowa"
    }
  ],
  "15": [
    {
      "name": "Connor Lew",
      "position": "IOL",
      "school": "Auburn"
    },
    {
      "name": "Sam Hecht",
      "position": "IOL",
      "school": "Kansas State"
    },
    {
      "name": "Jake Slaughter",
      "position": "IOL",
      "school": "Florida"
    }
  ],
  "16": [
    {
      "name": "Kenyatta Jackson Jr",
      "position": "EDGE",
      "school": "Ohio State"
    },
    {
      "name": "Drew Allar",
      "position": "QB",
      "school": "Penn State"
    },
    {
      "name": "Carson Beck",
      "position": "QB",
      "school": "Miami"
    }
  ],
  "17": [
    {
      "name": "Garrett Nussmeier",
      "position": "QB",
      "school": "LSU"
    },
    {
      "name": "Olaivavega Ioane",
      "position": "IOL",
      "school": "Penn State"
    },
    {
      "name": "Cashius Howell",
      "position": "EDGE",
      "school": "Texas A&M"
    }
  ],
  "18": [
    {
      "name": "Justice Haynes",
      "position": "RB",
      "school": "Michigan"
    },
    {
      "name": "L.T. Overton",
      "position": "DT",
      "school": "Alabama"
    },
    {
      "name": "Bear Alexander",
      "position": "DT",
      "school": "Oregon"
    }
  ],
  "19": [
    {
      "name": "Dontay Corleone",
      "position": "DT",
      "school": "Cincinnati"
    },
    {
      "name": "Chris Bell",
      "position": "WR",
      "school": "Louisville"
    },
    {
      "name": "Eric Rivers",
      "position": "WR",
      "school": "Georgia Tech"
    }
  ],
  "20": [
    {
      "name": "Kevin Coleman",
      "position": "WR",
      "school": "Missouri"
    },
    {
      "name": "Elijah Sarratt",
      "position": "WR",
      "school": "Indiana"
    },
    {
      "name": "Amare Thomas",
      "position": "WR",
      "school": "Houston"
    }
  ],
  "21": [
    {
      "name": "Bray Hubbard",
      "position": "S",
      "school": "Alabama"
    },
    {
      "name": "A.J. Haulcy",
      "position": "S",
      "school": "LSU"
    },
    {
      "name": "Kenyon Sadiq",
      "position": "TE",
      "school": "Oregon"
    }
  ],
  "22": [
    {
      "name": "Francis Mauigoa",
      "position": "OT",
      "school": "Miami"
    },
    {
      "name": "Spencer Fano",
      "position": "OT",
      "school": "Utah"
    },
    {
      "name": "Kadyn Proctor",
      "position": "OT",
      "school": "Alabama"
    }
  ],
  "23": [
    {
      "name": "Rueben Bain Jr",
      "position": "EDGE",
      "school": "Miami"
    },
    {
      "name": "David Bailey",
      "position": "EDGE",
      "school": "Texas Tech"
    },
    {
      "name": "Keldric Faulk",
      "position": "EDGE",
      "school": "Auburn"
    }
  ],
  "24": [
    {
      "name": "Arvell Reese",
      "position": "LB",
      "school": "Ohio State"
    },
    {
      "name": "Carnell Tate",
      "position": "WR",
      "school": "Ohio State"
    },
    {
      "name": "Jordyn Tyson",
      "position": "WR",
      "school": "Arizona State"
    }
  ],
  "25": [
    {
      "name": "Jermod McCoy",
      "position": "CB",
      "school": "Tennessee"
    },
    {
      "name": "Mansoor Delane",
      "position": "CB",
      "school": "LSU"
    },
    {
      "name": "Avieon Terrell",
      "position": "CB",
      "school": "Clemson"
    }
  ],
  "26": [
    {
      "name": "Jeremiyah Love",
      "position": "RB",
      "school": "Notre Dame"
    },
    {
      "name": "Justice Haynes",
      "position": "RB",
      "school": "Michigan"
    },
    {
      "name": "Sonny Styles",
      "position": "LB",
      "school": "Ohio State"
    }
  ],
  "27": [
    {
      "name": "Peter Woods",
      "position": "DT",
      "school": "Clemson"
    },
    {
      "name": "Kayden McDonald",
      "position": "DT",
      "school": "Ohio State"
    },
    {
      "name": "Lee Hunter",
      "position": "DT",
      "school": "Texas Tech"
    }
  ],
  "28": [
    {
      "name": "T.J. Parker",
      "position": "EDGE",
      "school": "Clemson"
    },
    {
      "name": "Akheem Mesidor",
      "position": "EDGE",
      "school": "Miami"
    },
    {
      "name": "Zion Young",
      "position": "EDGE",
      "school": "Missouri"
    }
  ],
  "29": [
    {
      "name": "Makai Lemon",
      "position": "WR",
      "school": "USC"
    },
    {
      "name": "Germie Bernard",
      "position": "WR",
      "school": "Alabama"
    },
    {
      "name": "Chris Bell",
      "position": "WR",
      "school": "Louisville"
    }
  ],
  "30": [
    {
      "name": "Monroe Freeling",
      "position": "OT",
      "school": "Georgia"
    },
    {
      "name": "Blake Miller",
      "position": "OT",
      "school": "Clemson"
    },
    {
      "name": "Caleb Lomu",
      "position": "OT",
      "school": "Utah"
    }
  ],
  "31": [
    {
      "name": "Dillon Thieneman",
      "position": "S",
      "school": "Oregon"
    },
    {
      "name": "Bray Hubbard",
      "position": "S",
      "school": "Alabama"
    },
    {
      "name": "Eli Stowers",
      "position": "TE",
      "school": "Vanderbilt"
    }
  ],
  "32": [
    {
      "name": "Logan Jones",
      "position": "IOL",
      "school": "Iowa"
    },
    {
      "name": "Emmanuel Pregnon",
      "position": "IOL",
      "school": "Oregon"
    },
    {
      "name": "Connor Lew",
      "position": "IOL",
      "school": "Auburn"
    }
  ]
};



const ALL_TEAMS = [
  { team: "Arizona Cardinals",      abbr: "ARI", color: "#97233F" },
  { team: "Atlanta Falcons",        abbr: "ATL", color: "#A71930" },
  { team: "Baltimore Ravens",       abbr: "BAL", color: "#241773" },
  { team: "Buffalo Bills",          abbr: "BUF", color: "#00338D" },
  { team: "Carolina Panthers",      abbr: "CAR", color: "#0085CA" },
  { team: "Chicago Bears",          abbr: "CHI", color: "#0B162A" },
  { team: "Cincinnati Bengals",     abbr: "CIN", color: "#FB4F14" },
  { team: "Cleveland Browns",       abbr: "CLE", color: "#FF3C00" },
  { team: "Dallas Cowboys",         abbr: "DAL", color: "#003594" },
  { team: "Denver Broncos",         abbr: "DEN", color: "#FB4F14" },
  { team: "Detroit Lions",          abbr: "DET", color: "#0076B6" },
  { team: "Green Bay Packers",      abbr: "GB",  color: "#203731" },
  { team: "Houston Texans",         abbr: "HOU", color: "#03202F" },
  { team: "Indianapolis Colts",     abbr: "IND", color: "#002C5F" },
  { team: "Jacksonville Jaguars",   abbr: "JAX", color: "#006778" },
  { team: "Kansas City Chiefs",     abbr: "KC",  color: "#E31837" },
  { team: "Las Vegas Raiders",      abbr: "LV",  color: "#A5ACAF" },
  { team: "Los Angeles Chargers",   abbr: "LAC", color: "#0080C6" },
  { team: "Los Angeles Rams",       abbr: "LAR", color: "#003594" },
  { team: "Miami Dolphins",         abbr: "MIA", color: "#008E97" },
  { team: "Minnesota Vikings",      abbr: "MIN", color: "#4F2683" },
  { team: "New England Patriots",   abbr: "NE",  color: "#002244" },
  { team: "New Orleans Saints",     abbr: "NO",  color: "#D3BC8D" },
  { team: "New York Giants",        abbr: "NYG", color: "#0B2265" },
  { team: "New York Jets",          abbr: "NYJ", color: "#125740" },
  { team: "Philadelphia Eagles",    abbr: "PHI", color: "#004C54" },
  { team: "Pittsburgh Steelers",    abbr: "PIT", color: "#FFB612" },
  { team: "San Francisco 49ers",    abbr: "SF",  color: "#AA0000" },
  { team: "Seattle Seahawks",       abbr: "SEA", color: "#002244" },
  { team: "Tampa Bay Buccaneers",   abbr: "TB",  color: "#D50A0A" },
  { team: "Tennessee Titans",       abbr: "TEN", color: "#4B92DB" },
  { team: "Washington Commanders",  abbr: "WSH", color: "#5A1414" },
];

// ── Position group ordering and labels ────────────────────────────────────────
const POSITION_GROUPS = [
  { key: "QB",   label: "Quarterbacks" },
  { key: "RB",   label: "Running Backs" },
  { key: "WR",   label: "Wide Receivers" },
  { key: "TE",   label: "Tight Ends" },
  { key: "OT",   label: "Offensive Tackles" },
  { key: "IOL",  label: "Interior O-Line" },
  { key: "EDGE", label: "Edge Rushers" },
  { key: "DT",   label: "Defensive Tackles" },
  { key: "LB",   label: "Linebackers" },
  { key: "CB",   label: "Cornerbacks" },
  { key: "S",    label: "Safeties" },
];

// ── Styles ────────────────────────────────────────────────────────────────────
// ── Team color pairs: [darkBg, accent] ───────────────────────────────────────
// darkBg: deep tint of official primary. accent: most recognizable team color.
const TEAM_COLORS = {
  //        darkBg       accent (official hex)
  "ARI": ["#1a0008", "#97233F"],  // Cardinals Red
  "ATL": ["#1a0005", "#A71930"],  // Falcons Red
  "BAL": ["#0a0018", "#9E7C0C"],  // Ravens Gold
  "BUF": ["#060f22", "#C60C30"],  // Bills Red
  "CAR": ["#001220", "#0085CA"],  // Panthers Blue
  "CHI": ["#060b14", "#C83803"],  // Bears Orange
  "CIN": ["#0d0800", "#FB4F14"],  // Bengals Orange
  "CLE": ["#100800", "#FF3C00"],  // Browns Orange
  "DAL": ["#000d1a", "#002244"],  // Cowboys Navy (silver not visible on dark)
  "DEN": ["#0d0600", "#FB4F14"],  // Broncos Orange
  "DET": ["#001220", "#0076B6"],  // Lions Blue
  "GB":  ["#070e09", "#FFB612"],  // Packers Gold
  "HOU": ["#000810", "#A71930"],  // Texans Red
  "IND": ["#00081a", "#002C5F"],  // Colts Blue (brightened below)
  "JAX": ["#00100f", "#D7A22A"],  // Jaguars Gold
  "KC":  ["#120005", "#E31837"],  // Chiefs Red
  "LAC": ["#00091a", "#0080C6"],  // Chargers Powder Blue
  "LAR": ["#00091a", "#FFC72C"],  // Rams Gold
  "LV":  ["#0a0a0a", "#A5ACAF"],  // Raiders Silver
  "MIA": ["#001a1c", "#008E97"],  // Dolphins Aqua
  "MIN": ["#0f0620", "#4F2683"],  // Vikings Purple (brightened below)
  "NE":  ["#000a18", "#C60C30"],  // Patriots Red
  "NO":  ["#130f05", "#D3BC8D"],  // Saints Gold
  "NYG": ["#030a1e", "#A71930"],  // Giants Red
  "NYJ": ["#001209", "#003F2D"],  // Jets Green (brightened below)
  "PHI": ["#001214", "#A5ACAF"],  // Eagles Silver
  "PIT": ["#0a0800", "#FFB612"],  // Steelers Gold
  "SEA": ["#000a18", "#69BE28"],  // Seahawks Green
  "SF":  ["#150000", "#AA0000"],  // 49ers Red
  "TB":  ["#120000", "#D50A0A"],  // Bucs Red
  "TEN": ["#000e1e", "#4B92DB"],  // Titans Blue
  "WSH": ["#150000", "#FFB612"],  // Commanders Gold
};

// Some official primaries are too dark to read on dark bg — override accent
const ACCENT_BOOST = {
  "DAL": "#6699CC",   // Cowboys: lighten navy
  "IND": "#4488CC",   // Colts: lighten navy
  "MIN": "#8B5FCF",   // Vikings: lighten purple
  "NYJ": "#00AA55",   // Jets: brighten green
  "SF":  "#CC2222",   // 49ers: brighten red
  "TB":  "#FF3333",   // Bucs: brighten red
  "HOU": "#CC2233",   // Texans: brighten red
  "ATL": "#CC2233",   // Falcons: brighten red
  "ARI": "#B02848",   // Cardinals: brighten red
};

function getTeamColors(abbr) {
  const pair = TEAM_COLORS[abbr] || ["#0e0e1e", "#e8e0d0"];
  const accent = ACCENT_BOOST[abbr] || pair[1];
  return [pair[0], accent];
}

const S = {
  app: {
    minHeight: "100vh",
    background: "#080810",
    fontFamily: "'Oswald', sans-serif",
    color: "#e8e0d0",
    padding: "56px 0 80px",
  },
  header: {
    background: "linear-gradient(180deg, #0d0d1a 0%, #080810 100%)",
    borderBottom: "1px solid #ffffff08",
    padding: "24px 28px 20px",
    textAlign: "center",
    position: "relative",
  },
  headerTitle: {
    fontSize: "clamp(22px, 4vw, 34px)",
    fontWeight: 900,
    letterSpacing: 3,
    textTransform: "uppercase",
    background: "linear-gradient(90deg, #f0d070, #e87040)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  headerSub: {
    fontSize: 12,
    letterSpacing: 2,
    color: "#ffffff33",
    marginTop: 4,
    textTransform: "uppercase",
  },
  grid: {
    maxWidth: 640,
    margin: "20px auto 0",
    padding: "0 16px",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  pickCard: (isDragging, darkBg, accent) => ({
    background: darkBg,
    border: `1px solid ${accent}22`,
    borderRadius: 10,
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all 0.18s ease",
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    gap: 16,
  }),
  pickNum: (accent) => ({
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: 2,
    color: accent + "88",
    textTransform: "uppercase",
    minWidth: 46,
    flexShrink: 0,
  }),
  teamTag: (accent) => ({
    display: "inline-block",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "2px 8px",
    borderRadius: 4,
    background: accent + "20",
    border: `1px solid ${accent}55`,
    color: accent,
    textTransform: "uppercase",
    minWidth: 44,
    textAlign: "center",
    flexShrink: 0,
  }),
  playerName: (accent) => ({
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: accent,
    lineHeight: 1.2,
  }),
  playerPos: (accent) => ({
    fontSize: 11,
    color: accent + "77",
    letterSpacing: 1,
    whiteSpace: "nowrap",
  }),
  emptySlot: (accent) => ({
    fontSize: 13,
    color: accent + "55",
    letterSpacing: 1,
    fontStyle: "italic",
  }),
  tradeBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    fontSize: 9,
    fontWeight: 800,
    letterSpacing: 1.5,
    padding: "2px 6px",
    borderRadius: 4,
    background: "#f0a03022",
    border: "1px solid #f0a03055",
    color: "#f0a030",
    textTransform: "uppercase",
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backdropFilter: "blur(4px)",
  },
  modalBox: {
    background: "#0e0e20",
    border: "1px solid #ffffff14",
    borderRadius: 16,
    padding: "28px 24px",
    maxWidth: 480,
    width: "100%",
    maxHeight: "85vh",
    overflowY: "auto",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 900,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: "#ffffff44",
    letterSpacing: 1,
    marginBottom: 20,
    textTransform: "uppercase",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2.5,
    textTransform: "uppercase",
    color: "#ffffff33",
    marginBottom: 8,
    marginTop: 16,
  },
  suggestionChip: (selected) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 12px",
    borderRadius: 8,
    border: `1px solid ${selected ? "#f0d07055" : "#ffffff10"}`,
    background: selected ? "#f0d07010" : "transparent",
    cursor: "pointer",
    transition: "all 0.15s",
    marginBottom: 6,
  }),
  btn: (variant) => ({
    padding: variant === "primary" ? "11px 24px" : "9px 18px",
    borderRadius: 8,
    border: variant === "primary" ? "none" : "1px solid #ffffff14",
    background: variant === "primary"
      ? "linear-gradient(135deg, #f0d070, #e87040)"
      : variant === "danger" ? "#e8403011" : "#ffffff08",
    color: variant === "primary" ? "#1a1008" : variant === "danger" ? "#e84030" : "#e8e0d0",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 2,
    textTransform: "uppercase",
    cursor: "pointer",
    fontFamily: "'Oswald', sans-serif",
    transition: "all 0.15s",
    ...(variant === "danger" ? { border: "1px solid #e8403033" } : {}),
  }),
};

// ── Position group dropdown styles ────────────────────────────────────────────
const posGroupStyles = {
  header: (isOpen) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: 8,
    border: `1px solid ${isOpen ? "#ffffff18" : "#ffffff0a"}`,
    background: isOpen ? "#ffffff08" : "#ffffff04",
    cursor: "pointer",
    transition: "all 0.15s",
    marginBottom: isOpen ? 4 : 6,
  }),
  label: {
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#e8e0d0",
  },
  count: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 1,
    color: "#ffffff44",
  },
  arrow: (isOpen) => ({
    fontSize: 10,
    color: "#ffffff44",
    transition: "transform 0.2s",
    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
  }),
  list: {
    padding: "0 0 6px 0",
    marginBottom: 6,
  },
  playerRow: (selected, taken) => ({
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 8,
    border: `1px solid ${selected ? "#f0d07055" : "#ffffff08"}`,
    background: selected ? "#f0d07010" : "transparent",
    cursor: taken ? "default" : "pointer",
    opacity: taken ? 0.35 : 1,
    transition: "all 0.15s",
    marginBottom: 4,
  }),
  rank: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1,
    color: "#ffffff28",
    minWidth: 22,
    textAlign: "center",
    flexShrink: 0,
  },
  takenLabel: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 1.5,
    color: "#e8403088",
    textTransform: "uppercase",
    flexShrink: 0,
  },
};

// ── Position Group Dropdown component ─────────────────────────────────────────
function PositionGroupDropdown({ group, prospects, selected, onSelect, draftedNames }) {
  const [isOpen, setIsOpen] = useState(false);

  const available = prospects.filter(p => !draftedNames.has(p.name));
  const taken = prospects.filter(p => draftedNames.has(p.name));

  return (
    <div>
      <div
        style={posGroupStyles.header(isOpen)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={posGroupStyles.label}>{group.label}</span>
          <span style={posGroupStyles.count}>
            {available.length} available
          </span>
        </div>
        <span style={posGroupStyles.arrow(isOpen)}>▼</span>
      </div>

      {isOpen && (
        <div style={posGroupStyles.list}>
          {prospects.map((p, idx) => {
            const isTaken = draftedNames.has(p.name);
            const isSelected = selected?.name === p.name;
            return (
              <div
                key={p.name}
                style={posGroupStyles.playerRow(isSelected, isTaken)}
                onClick={() => !isTaken && onSelect(p)}
              >
                <span style={posGroupStyles.rank}>{idx + 1}</span>
                <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>
                    {p.name}
                  </div>
                  <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1, whiteSpace: "nowrap" }}>
                    {p.school}
                  </div>
                </div>
                {isTaken && <span style={posGroupStyles.takenLabel}>Drafted</span>}
                {isSelected && !isTaken && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
              </div>
            );
          })}
          {prospects.length === 0 && (
            <div style={{ fontSize: 12, color: "#ffffff22", textAlign: "center", padding: "8px 0", fontStyle: "italic" }}>
              No prospects at this position
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Player selection modal ────────────────────────────────────────────────────
function PickModal({ pick, suggestions, allProspects, draftedNames, onSelect, onTrade, onClear, onClose }) {
  const [selected, setSelected] = useState(pick.player || null);

  // Build position groups from ALL_PROSPECTS (preserving rank order)
  const prospectsByPosition = {};
  for (const group of POSITION_GROUPS) {
    prospectsByPosition[group.key] = allProspects.filter(p => p.position === group.key);
  }

  const pickSuggestions = suggestions[pick.pick] || [];

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={S.teamTag(pick.color)}>{pick.abbr}</span>
              {pick.traded && <span style={{ ...S.tradeBadge, position: "static" }}>TRADED</span>}
            </div>
            <div style={S.modalTitle}>Pick #{pick.pick}</div>
            <div style={S.modalSub}>{pick.team}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0, lineHeight: 1 }}>✕</button>
        </div>

        {/* Actions — pinned to top */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button
            style={S.btn("primary")}
            onClick={() => selected && onSelect(pick.pick, selected)}
            disabled={!selected}
          >
            Confirm Pick
          </button>
          <button style={{ ...S.btn("secondary"), color: "#f0a030", borderColor: "#f0a03033", background: "#f0a03011" }} onClick={() => onTrade(pick.pick)}>
            🔀 Trade
          </button>
          {pick.player && (
            <button style={S.btn("danger")} onClick={() => onClear(pick.pick)}>
              Clear
            </button>
          )}
        </div>

        {/* Suggestions */}
        {pickSuggestions.length > 0 && (
          <>
            <div style={S.sectionLabel}>Suggestions for this pick</div>
            {pickSuggestions.map(p => {
              const isTaken = draftedNames.has(p.name);
              return (
                <div
                  key={p.name}
                  style={{
                    ...S.suggestionChip(selected?.name === p.name),
                    opacity: isTaken ? 0.35 : 1,
                    cursor: isTaken ? "default" : "pointer",
                  }}
                  onClick={() => !isTaken && setSelected(p)}
                >
                  <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 0.5 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1, whiteSpace: "nowrap" }}>{p.position} · {p.school}</div>
                  </div>
                  {isTaken && <span style={posGroupStyles.takenLabel}>Drafted</span>}
                  {selected?.name === p.name && !isTaken && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
                </div>
              );
            })}
          </>
        )}

        {/* Big Board — Position Group Dropdowns */}
        <div style={S.sectionLabel}>Big Board</div>
        {POSITION_GROUPS.map(group => (
          <PositionGroupDropdown
            key={group.key}
            group={group}
            prospects={prospectsByPosition[group.key]}
            selected={selected}
            onSelect={setSelected}
            draftedNames={draftedNames}
          />
        ))}

      </div>
    </div>
  );
}

// ── Trade modal ───────────────────────────────────────────────────────────────
function TradeModal({ pick, picks, onConfirm, onClose }) {
  const [swapWith, setSwapWith] = useState(null);
  const [newTeam, setNewTeam] = useState(null);
  const [isSwap, setIsSwap] = useState(true);
  const [step, setStep] = useState("type"); // "type" | "team" | "swap_pick"

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={S.modalBox}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={S.modalTitle}>Trade Pick #{pick.pick}</div>
            <div style={S.modalSub}>{pick.team}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0 }}>✕</button>
        </div>

        {step === "type" && (
          <>
            <div style={S.sectionLabel}>What kind of trade?</div>
            {[
              { id: true,  label: "Pick swap", desc: "Two teams exchange picks" },
              { id: false, label: "One-way acquisition", desc: "A team gets this pick without giving one back" },
            ].map(opt => (
              <div
                key={String(opt.id)}
                style={{ ...S.suggestionChip(isSwap === opt.id), marginBottom: 8 }}
                onClick={() => setIsSwap(opt.id)}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: "#ffffff44" }}>{opt.desc}</div>
                </div>
                {isSwap === opt.id && <span style={{ color: "#f0d070" }}>✓</span>}
              </div>
            ))}
            <button style={{ ...S.btn("primary"), marginTop: 12 }} onClick={() => setStep("team")}>
              Next →
            </button>
          </>
        )}

        {step === "team" && (
          <>
            <div style={S.sectionLabel}>Which team is getting Pick #{pick.pick}?</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 260, overflowY: "auto" }}>
              {ALL_TEAMS.filter(t => t.team !== pick.team).map(t => (
                <div
                  key={t.abbr}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 6,
                    border: `1px solid ${newTeam?.abbr === t.abbr ? t.color + "88" : "#ffffff10"}`,
                    background: newTeam?.abbr === t.abbr ? t.color + "18" : "transparent",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    color: newTeam?.abbr === t.abbr ? (t.color === "#A5ACAF" ? "#c8c8c8" : t.color) : "#ffffff66",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setNewTeam(t)}
                >
                  {t.abbr}
                </div>
              ))}
            </div>
            {isSwap && newTeam && (
              <>
                <div style={{ ...S.sectionLabel, marginTop: 16 }}>Which pick does {newTeam.abbr} send back?</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 160, overflowY: "auto" }}>
                  {picks.filter(p => p.team === newTeam.team && p.pick !== pick.pick).map(p => (
                    <div
                      key={p.pick}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: `1px solid ${swapWith?.pick === p.pick ? "#f0d07066" : "#ffffff10"}`,
                        background: swapWith?.pick === p.pick ? "#f0d07011" : "transparent",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 700,
                        color: swapWith?.pick === p.pick ? "#f0d070" : "#ffffff55",
                        transition: "all 0.15s",
                      }}
                      onClick={() => setSwapWith(p)}
                    >
                      #{p.pick}
                    </div>
                  ))}
                  {picks.filter(p => p.team === newTeam.team && p.pick !== pick.pick).length === 0 && (
                    <div style={{ fontSize: 12, color: "#ffffff33", fontStyle: "italic" }}>
                      {newTeam.abbr} has no other 1st round picks
                    </div>
                  )}
                </div>
              </>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button style={S.btn("secondary")} onClick={() => setStep("type")}>← Back</button>
              <button
                style={S.btn("primary")}
                disabled={!newTeam || (isSwap && !swapWith && picks.filter(p => p.team === newTeam?.team).length > 0)}
                onClick={() => onConfirm({ pickNum: pick.pick, newTeam, swapWith: isSwap ? swapWith : null })}
              >
                Confirm Trade
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Share / image export ──────────────────────────────────────────────────────
function ShareModal({ picks, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const logo = new Image();
    logo.src = "/ts_logo_blueoutline_420.webp";
    logo.onload = () => document.fonts.ready.then(() => drawCanvas(canvas, ctx, logo));
    logo.onerror = () => document.fonts.ready.then(() => drawCanvas(canvas, ctx, null));

    function drawCanvas(canvas, ctx, logo) {
      const W = 640;
      const CARD_H = 56;
      const CARD_GAP = 6;
      const PAD = 20;
      const HEADER_H = 100;
      const FOOTER_H = 36;
      const totalH = HEADER_H + picks.length * (CARD_H + CARD_GAP) - CARD_GAP + PAD + FOOTER_H;

      canvas.width = W;
      canvas.height = totalH;

      // Page background
      ctx.fillStyle = "#080810";
      ctx.fillRect(0, 0, W, totalH);

      // Logo top-left
      const LOGO_H = 34;
      if (logo) {
        const logoW = LOGO_H * (logo.naturalWidth / logo.naturalHeight);
        ctx.drawImage(logo, PAD, 16, logoW, LOGO_H);
      }

      // Title centered
      ctx.fillStyle = "#f0d070";
      ctx.font = "bold 26px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("2026 NFL MOCK DRAFT", W / 2, 42);

      // Site URL
      ctx.fillStyle = "#ffffff44";
      ctx.font = "13px Oswald, sans-serif";
      ctx.fillText("trivialsports.com", W / 2, 64);

      // Divider
      ctx.strokeStyle = "#ffffff10";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PAD, HEADER_H - 8);
      ctx.lineTo(W - PAD, HEADER_H - 8);
      ctx.stroke();

      // Cards
      picks.forEach((pick, i) => {
        const [darkBg, accent] = getTeamColors(pick.abbr);
        const cardX = PAD;
        const cardY = HEADER_H + i * (CARD_H + CARD_GAP);
        const cardW = W - PAD * 2;

        // Card background
        ctx.fillStyle = darkBg;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, CARD_H, 8);
        ctx.fill();

        // Card border
        ctx.strokeStyle = accent + "22";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, CARD_H, 8);
        ctx.stroke();

        // Left accent bar
        ctx.fillStyle = accent + "cc";
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, 3, CARD_H, [8, 0, 0, 8]);
        ctx.fill();

        const midY = cardY + CARD_H / 2 + 5;

        // Pick number
        ctx.fillStyle = accent + "88";
        ctx.font = "bold 11px Oswald, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(`#${pick.pick}`, cardX + 12, midY);

        // Team tag pill
        const tagX = cardX + 52;
        const tagW = 52;
        const tagH = 22;
        const tagY = cardY + (CARD_H - tagH) / 2;
        ctx.fillStyle = accent + "20";
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 4);
        ctx.fill();
        ctx.strokeStyle = accent + "55";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tagX, tagY, tagW, tagH, 4);
        ctx.stroke();
        ctx.fillStyle = accent;
        ctx.font = "bold 11px Oswald, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(pick.abbr, tagX + tagW / 2, midY);

        // Trade badge
        if (pick.traded) {
          ctx.fillStyle = "#FFB612";
          ctx.font = "bold 9px Oswald, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("TRADED", cardX + 116, midY - 6);
        }

        // Player name
        const nameX = cardX + (pick.traded ? 174 : 116);
        if (pick.player) {
          ctx.fillStyle = accent;
          ctx.font = "bold 15px Oswald, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText(pick.player.name, nameX, midY);

          ctx.fillStyle = accent + "77";
          ctx.font = "11px Oswald, sans-serif";
          ctx.textAlign = "right";
          ctx.fillText(`${pick.player.position} · ${pick.player.school}`, cardX + cardW - 10, midY);
        } else {
          ctx.fillStyle = accent + "44";
          ctx.font = "italic 13px Oswald, sans-serif";
          ctx.textAlign = "left";
          ctx.fillText("—", nameX, midY);
        }
      });

      // Footer watermark
      ctx.fillStyle = "#ffffff22";
      ctx.font = "12px Oswald, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("trivialsports.com · Build your mock draft", W / 2, totalH - 12);
    }
  }, [picks]);

  const saveImage = async () => {
    const dataUrl = canvasRef.current.toDataURL("image/png");

    if (navigator.share && navigator.canShare) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "2026-nfl-mock-draft.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: "2026 NFL Mock Draft",
            text: "Check out my 2026 NFL Mock Draft! trivialsports.com",
          });
          return;
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        return;
      }
    }

    const a = document.createElement("a");
    a.download = "2026-nfl-mock-draft.png";
    a.href = dataUrl;
    a.click();
  };

  return (
    <div style={S.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.modalBox, maxWidth: 560 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={S.modalTitle}>Share Your Mock Draft</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#ffffff33", fontSize: 20, cursor: "pointer", padding: 0 }}>✕</button>
        </div>
        <canvas ref={canvasRef} style={{ width: "100%", borderRadius: 8, border: "1px solid #ffffff10", display: "block", marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={S.btn("primary")} onClick={saveImage}>⬇ Save Image</button>
          <button style={S.btn("secondary")} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function NFLMockDraft() {
  const [picks, setPicks] = useState(INITIAL_PICKS.map(p => ({ ...p, player: null, traded: false })));
  const [activePick, setActivePick] = useState(null);
  const [tradePick, setTradePick] = useState(null);
  const [showShare, setShowShare] = useState(false);
  const [dragSrc, setDragSrc] = useState(null);

  // Build a set of already-drafted player names (excluding current pick's player)
  const getDraftedNames = (excludePickNum) => {
    const names = new Set();
    for (const p of picks) {
      if (p.player && p.pick !== excludePickNum) {
        names.add(p.player.name);
      }
    }
    return names;
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSelect = (pickNum, player) => {
    setPicks(prev => prev.map(p => p.pick === pickNum ? { ...p, player } : p));
    setActivePick(null);
  };

  const handleClear = (pickNum) => {
    setPicks(prev => prev.map(p => p.pick === pickNum ? { ...p, player: null } : p));
    setActivePick(null);
  };

  const handleTrade = (pickNum) => {
    setActivePick(null);
    setTradePick(pickNum);
  };

  const handleTradeConfirm = ({ pickNum, newTeam, swapWith }) => {
    setPicks(prev => {
      const next = prev.map(p => {
        if (p.pick === pickNum) {
          return { ...p, team: newTeam.team, abbr: newTeam.abbr, color: newTeam.color, traded: true, player: p.player };
        }
        if (swapWith && p.pick === swapWith.pick) {
          const original = INITIAL_PICKS.find(ip => ip.pick === pickNum);
          return { ...p, team: original.team, abbr: original.abbr, color: original.color, traded: true };
        }
        return p;
      });
      return next;
    });
    setTradePick(null);
  };

  // ── Drag-and-drop to reorder filled picks ───────────────────────────────────
  const handleDragStart = (pickNum) => setDragSrc(pickNum);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetPickNum) => {
    if (dragSrc === null || dragSrc === targetPickNum) return;
    setPicks(prev => {
      const src = prev.find(p => p.pick === dragSrc);
      const tgt = prev.find(p => p.pick === targetPickNum);
      if (!src?.player || !tgt) return prev;
      return prev.map(p => {
        if (p.pick === dragSrc) return { ...p, player: tgt.player };
        if (p.pick === targetPickNum) return { ...p, player: src.player };
        return p;
      });
    });
    setDragSrc(null);
  };

  const filledCount = picks.filter(p => p.player).length;
  const activePkObj = activePick ? picks.find(p => p.pick === activePick) : null;
  const tradePkObj = tradePick ? picks.find(p => p.pick === tradePick) : null;

  return (
    <div style={S.app}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.headerTitle}>2026 NFL Mock Draft</h1>
        <div style={S.headerSub}>1st Round · Build Your Predictions</div>

        <div style={{ marginTop: 6, fontSize: 11, color: "#ffffff33", letterSpacing: 1 }}>
          {ALL_PROSPECTS.length} prospects · updated {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </div>

        {/* Progress + share */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 14 }}>
          <div style={{ fontSize: 12, color: "#ffffff44", letterSpacing: 1 }}>
            <span style={{ color: "#f0d070", fontWeight: 700 }}>{filledCount}</span> / 32 picks made
          </div>
          {filledCount > 0 && (
            <button style={S.btn("primary")} onClick={() => setShowShare(true)}>
              Share Draft
            </button>
          )}
        </div>
      </div>

      {/* Pick grid */}
      <div style={S.grid}>
        {picks.map(pick => {
          const [darkBg, accent] = getTeamColors(pick.abbr);
          return (
            <div
              key={pick.pick}
              style={S.pickCard(dragSrc === pick.pick, darkBg, accent)}
              onClick={() => setActivePick(pick.pick)}
              draggable={!!pick.player}
              onDragStart={() => handleDragStart(pick.pick)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(pick.pick)}
            >
              <span style={S.pickNum(accent)}>#{pick.pick}</span>
              <span style={S.teamTag(accent)}>{pick.abbr}</span>
              <div style={{ flex: 1 }}>
                {pick.player ? (
                  <>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <div style={S.playerName(accent)}>{pick.player.name}</div>
                      <div style={S.playerPos(accent)}>{pick.player.position} · {pick.player.school}</div>
                    </div>
                  </>
                ) : (
                  <div style={S.emptySlot(accent)}>Select a player…</div>
                )}
              </div>
              {pick.traded && <span style={S.tradeBadge}>Traded</span>}
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {activePkObj && (
        <PickModal
          pick={activePkObj}
          suggestions={PICK_SUGGESTIONS}
          allProspects={ALL_PROSPECTS}
          draftedNames={getDraftedNames(activePkObj.pick)}
          onSelect={handleSelect}
          onTrade={handleTrade}
          onClear={handleClear}
          onClose={() => setActivePick(null)}
        />
      )}
      {tradePkObj && (
        <TradeModal
          pick={tradePkObj}
          picks={picks}
          onConfirm={handleTradeConfirm}
          onClose={() => setTradePick(null)}
        />
      )}
      {showShare && (
        <ShareModal
          picks={picks}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  );
}
