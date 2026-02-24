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
  loadingBar: {
    margin: "10px auto 0",
    maxWidth: 300,
    height: 3,
    background: "#ffffff10",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingFill: {
    height: "100%",
    background: "linear-gradient(90deg, #f0d070, #e87040)",
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  loadingText: {
    fontSize: 11,
    color: "#f0d07066",
    letterSpacing: 1.5,
    marginTop: 6,
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
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: 0.5,
    color: accent,
    lineHeight: 1.2,
  }),
  playerPos: (accent) => ({
    fontSize: 11,
    color: accent + "77",
    letterSpacing: 1,
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
  searchInput: {
    width: "100%",
    background: "#080814",
    border: "1px solid #ffffff14",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#e8e0d0",
    fontSize: 14,
    fontFamily: "'Oswald', sans-serif",
    letterSpacing: 1,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 10,
  },
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

// ── Player search modal ───────────────────────────────────────────────────────
function PickModal({ pick, suggestions, allProspects, onSelect, onTrade, onClear, onClose }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(pick.player || null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const filtered = query.length > 1
    ? allProspects.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.position.toLowerCase().includes(query.toLowerCase()) ||
        p.school.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 12)
    : [];

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

        {/* Suggestions */}
        {pickSuggestions.length > 0 && (
          <>
            <div style={S.sectionLabel}>AI Suggestions for this pick</div>
            {pickSuggestions.map(p => (
              <div
                key={p.name}
                style={S.suggestionChip(selected?.name === p.name)}
                onClick={() => setSelected(p)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1 }}>{p.position} · {p.school}</div>
                </div>
                {selected?.name === p.name && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
              </div>
            ))}
          </>
        )}

        {/* Search all prospects */}
        <div style={S.sectionLabel}>Search all prospects</div>
        <input
          ref={inputRef}
          style={S.searchInput}
          placeholder="Name, position, school..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {filtered.map(p => (
          <div
            key={p.name}
            style={S.suggestionChip(selected?.name === p.name)}
            onClick={() => { setSelected(p); setQuery(""); }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "#ffffff44", letterSpacing: 1 }}>{p.position} · {p.school}</div>
            </div>
            {selected?.name === p.name && <span style={{ color: "#f0d070", fontSize: 14 }}>✓</span>}
          </div>
        ))}
        {query.length > 1 && filtered.length === 0 && (
          <div style={{ fontSize: 13, color: "#ffffff30", textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>
            No prospects found
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, marginTop: 20, flexWrap: "wrap" }}>
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

    // Ensure all fonts are ready before drawing
    document.fonts.ready.then(() => drawCanvas(canvas, ctx));
    return;

    function drawCanvas(canvas, ctx) {
    const W = 800, ROW = 36, PAD = 20, HEADER = 80;
    canvas.width = W;
    canvas.height = HEADER + picks.length * ROW + PAD * 2;

    // Background
    ctx.fillStyle = "#080810";
    ctx.fillRect(0, 0, W, canvas.height);

    // Header
    ctx.fillStyle = "#f0d070";
    ctx.font = "bold 28px 'Oswald', Impact, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.textAlign = "center";
    ctx.fillText("MY 2026 NFL MOCK DRAFT", W / 2, 44);
    ctx.fillStyle = "#ffffff22";
    ctx.font = "13px 'Oswald', sans-serif";
    ctx.fillText("trivialsports.com", W / 2, 66);

    // Divider
    ctx.strokeStyle = "#ffffff10";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD, HEADER - 4);
    ctx.lineTo(W - PAD, HEADER - 4);
    ctx.stroke();

    // Picks
    picks.forEach((pick, i) => {
      const y = HEADER + i * ROW + PAD;
      const isEven = i % 2 === 0;
      if (isEven) {
        ctx.fillStyle = "#0d0d1c";
        ctx.fillRect(PAD, y - 4, W - PAD * 2, ROW);
      }

      // Pick number
      ctx.fillStyle = "#ffffff33";
      ctx.font = "bold 12px 'Oswald', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`#${String(pick.pick).padStart(2, "0")}`, PAD + 8, y + 16);

      // Team tag
      const tagColor = pick.color || "#888";
      ctx.fillStyle = tagColor + "33";
      ctx.roundRect?.(PAD + 48, y + 1, 46, 22, 4) || ctx.fillRect(PAD + 48, y + 1, 46, 22);
      ctx.fill();
      ctx.strokeStyle = tagColor + "66";
      ctx.lineWidth = 1;
      ctx.roundRect?.(PAD + 48, y + 1, 46, 22, 4) || ctx.strokeRect(PAD + 48, y + 1, 46, 22);
      ctx.stroke();
      ctx.fillStyle = tagColor === "#A5ACAF" ? "#c8c8c8" : tagColor;
      ctx.font = "bold 11px 'Oswald', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(pick.abbr, PAD + 48 + 23, y + 16);

      // Trade badge
      if (pick.traded) {
        ctx.fillStyle = "#f0a030";
        ctx.font = "bold 9px 'Oswald', sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("TRADED", PAD + 102, y + 16);
      }

      // Player name
      ctx.fillStyle = pick.player ? "#f0e8d8" : "#ffffff22";
      ctx.font = pick.player ? "bold 15px 'Oswald', sans-serif" : "13px 'Oswald', sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(
        pick.player ? pick.player.name : "— not selected —",
        PAD + (pick.traded ? 165 : 110),
        y + 16
      );

      // Position + school
      if (pick.player) {
        ctx.fillStyle = "#ffffff33";
        ctx.font = "12px 'Oswald', sans-serif";
        ctx.textAlign = "right";
        ctx.fillText(`${pick.player.position} · ${pick.player.school}`, W - PAD - 8, y + 16);
      }
    });
    } // end drawCanvas
  }, [picks]);

  const download = () => {
    const a = document.createElement("a");
    a.download = "my-2026-nfl-mock-draft.png";
    a.href = canvasRef.current.toDataURL("image/png");
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
          <button style={S.btn("primary")} onClick={download}>⬇ Save Image</button>
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
                    <div style={S.playerName(accent)}>{pick.player.name}</div>
                    <div style={S.playerPos(accent)}>{pick.player.position} · {pick.player.school}</div>
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
