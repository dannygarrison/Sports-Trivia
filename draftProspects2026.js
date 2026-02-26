// ── 2026 NFL Draft Prospects ────────────────────────────────────────────────────
// Last updated: February 26, 2026
// Sources: Tankathon, Drafttek, ESPN Kiper Top 25, WalterFootball, CBS Sports, NFL Combine invites
// Cross-referenced for transfer portal accuracy. Combine is underway.
//
// To update: ask Claude "update draft prospects" — it will search current big boards
// and output a new version of this file. No script needed.

export const ALL_PROSPECTS = [
  { "name": "Fernando Mendoza", "position": "QB", "school": "Indiana" },
  { "name": "Arvell Reese", "position": "LB", "school": "Ohio State" },
  { "name": "Caleb Downs", "position": "S", "school": "Ohio State" },
  { "name": "Rueben Bain Jr.", "position": "EDGE", "school": "Miami" },
  { "name": "David Bailey", "position": "EDGE", "school": "Texas Tech" },
  { "name": "Francis Mauigoa", "position": "OT", "school": "Miami" },
  { "name": "Spencer Fano", "position": "OT", "school": "Utah" },
  { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" },
  { "name": "Jeremiyah Love", "position": "RB", "school": "Notre Dame" },
  { "name": "Mansoor Delane", "position": "CB", "school": "LSU" },
  { "name": "Sonny Styles", "position": "LB", "school": "Ohio State" },
  { "name": "Makai Lemon", "position": "WR", "school": "USC" },
  { "name": "Jermod McCoy", "position": "CB", "school": "Tennessee" },
  { "name": "Keldric Faulk", "position": "EDGE", "school": "Auburn" },
  { "name": "Jordyn Tyson", "position": "WR", "school": "Arizona State" },
  { "name": "Avieon Terrell", "position": "CB", "school": "Clemson" },
  { "name": "Peter Woods", "position": "DT", "school": "Clemson" },
  { "name": "Cashius Howell", "position": "EDGE", "school": "Texas A&M" },
  { "name": "T.J. Parker", "position": "EDGE", "school": "Clemson" },
  { "name": "Denzel Boston", "position": "WR", "school": "Washington" },
  { "name": "Kadyn Proctor", "position": "OT", "school": "Alabama" },
  { "name": "Olaivavega Ioane", "position": "IOL", "school": "Penn State" },
  { "name": "Lee Hunter", "position": "DT", "school": "Texas Tech" },
  { "name": "Caleb Lomu", "position": "OT", "school": "Utah" },
  { "name": "CJ Allen", "position": "LB", "school": "Georgia" },
  { "name": "Kenyon Sadiq", "position": "TE", "school": "Oregon" },
  { "name": "Caleb Banks", "position": "DT", "school": "Florida" },
  { "name": "Ty Simpson", "position": "QB", "school": "Alabama" },
  { "name": "Christen Miller", "position": "DT", "school": "Georgia" },
  { "name": "Monroe Freeling", "position": "OT", "school": "Georgia" },
  { "name": "K.C. Concepcion", "position": "WR", "school": "Texas A&M" },
  { "name": "Akheem Mesidor", "position": "EDGE", "school": "Miami" },
  { "name": "Emmanuel McNeil-Warren", "position": "S", "school": "Toledo" },
  { "name": "Anthony Hill Jr.", "position": "LB", "school": "Texas" },
  { "name": "Brandon Cisse", "position": "CB", "school": "South Carolina" },
  { "name": "Kayden McDonald", "position": "DT", "school": "Ohio State" },
  { "name": "Dillon Thieneman", "position": "S", "school": "Oregon" },
  { "name": "Colton Hood", "position": "CB", "school": "Tennessee" },
  { "name": "Zion Young", "position": "EDGE", "school": "Missouri" },
  { "name": "LT Overton", "position": "EDGE", "school": "Alabama" },
  { "name": "Blake Miller", "position": "OT", "school": "Clemson" },
  { "name": "Max Iheanachor", "position": "OT", "school": "Arizona State" },
  { "name": "Romello Height", "position": "EDGE", "school": "Texas Tech" },
  { "name": "Gabe Jacas", "position": "EDGE", "school": "Illinois" },
  { "name": "Kamari Ramsey", "position": "S", "school": "USC" },
  { "name": "Deontae Lawson", "position": "LB", "school": "Alabama" },
  { "name": "R Mason Thomas", "position": "EDGE", "school": "Oklahoma" },
  { "name": "Dani Dennis-Sutton", "position": "EDGE", "school": "Penn State" },
  { "name": "Emmanuel Pregnon", "position": "IOL", "school": "Oregon" },
  { "name": "Davison Igbinosun", "position": "CB", "school": "Ohio State" },
  { "name": "Keith Abney II", "position": "CB", "school": "Arizona State" },
  { "name": "Domonique Orange", "position": "DT", "school": "Iowa State" },
  { "name": "Malik Muhammad", "position": "CB", "school": "Texas" },
  { "name": "D'Angelo Ponds", "position": "CB", "school": "Indiana" },
  { "name": "Eli Stowers", "position": "TE", "school": "Vanderbilt" },
  { "name": "Elijah Sarratt", "position": "WR", "school": "Indiana" },
  { "name": "Omar Cooper Jr.", "position": "WR", "school": "Indiana" },
  { "name": "Chris Bell", "position": "WR", "school": "Louisville" },
  { "name": "Zachariah Branch", "position": "WR", "school": "Georgia" },
  { "name": "Derrick Moore", "position": "EDGE", "school": "Michigan" },
  { "name": "Gennings Dunker", "position": "OT", "school": "Iowa" },
  { "name": "Chris Brazzell II", "position": "WR", "school": "Tennessee" },
  { "name": "Domani Jackson", "position": "CB", "school": "Alabama" },
  { "name": "Germie Bernard", "position": "WR", "school": "Alabama" },
  { "name": "Chase Bisontis", "position": "IOL", "school": "Texas A&M" },
  { "name": "Chris Johnson", "position": "CB", "school": "San Diego State" },
  { "name": "Jake Golday", "position": "LB", "school": "Cincinnati" },
  { "name": "Malachi Fields", "position": "WR", "school": "Notre Dame" },
  { "name": "Keionte Scott", "position": "CB", "school": "Miami" },
  { "name": "A.J. Haulcy", "position": "S", "school": "LSU" },
  { "name": "Joshua Josephs", "position": "EDGE", "school": "Tennessee" },
  { "name": "Jacob Rodriguez", "position": "LB", "school": "Texas Tech" },
  { "name": "Max Klare", "position": "TE", "school": "Ohio State" },
  { "name": "Caleb Tiernan", "position": "OT", "school": "Northwestern" },
  { "name": "Jadarian Price", "position": "RB", "school": "Notre Dame" },
  { "name": "Connor Lew", "position": "IOL", "school": "Auburn" },
  { "name": "Daylen Everette", "position": "CB", "school": "Georgia" },
  { "name": "Ja'Kobi Lane", "position": "WR", "school": "USC" },
  { "name": "Garrett Nussmeier", "position": "QB", "school": "LSU" },
  { "name": "Michael Taaffe", "position": "S", "school": "Texas" },
  { "name": "Bud Clark", "position": "S", "school": "TCU" },
  { "name": "Jonah Coleman", "position": "RB", "school": "Washington" },
  { "name": "Julian Neal", "position": "CB", "school": "Arkansas" },
  { "name": "Ted Hurst", "position": "WR", "school": "Georgia State" },
  { "name": "Kyle Louis", "position": "LB", "school": "Pittsburgh" },
  { "name": "Austin Barber", "position": "OT", "school": "Florida" },
  { "name": "Antonio Williams", "position": "WR", "school": "Clemson" },
  { "name": "Red Murdock", "position": "LB", "school": "Buffalo" },
  { "name": "Drew Allar", "position": "QB", "school": "Penn State" },
  { "name": "Carson Beck", "position": "QB", "school": "Miami" },
  { "name": "Cade Klubnik", "position": "QB", "school": "Clemson" },
  { "name": "Cole Payton", "position": "QB", "school": "North Dakota State" },
  { "name": "Taylen Green", "position": "QB", "school": "Arkansas" },
  { "name": "Nicholas Singleton", "position": "RB", "school": "Penn State" },
  { "name": "Emmett Johnson", "position": "RB", "school": "Nebraska" },
  { "name": "Demond Claiborne", "position": "RB", "school": "Wake Forest" },
  { "name": "Kaytron Allen", "position": "RB", "school": "Penn State" },
  { "name": "Le'Veon Moss", "position": "RB", "school": "Texas A&M" },
  { "name": "Seth McGowan", "position": "RB", "school": "Kentucky" },
  { "name": "Kaelon Black", "position": "RB", "school": "Indiana" },
  { "name": "Desmond Reid", "position": "RB", "school": "Pittsburgh" },
  { "name": "Isaiah World", "position": "OT", "school": "Oregon" },
  { "name": "Trey Zuhn III", "position": "OT", "school": "Texas A&M" },
  { "name": "Jake Slaughter", "position": "IOL", "school": "Florida" },
  { "name": "Keylan Rutledge", "position": "IOL", "school": "Georgia Tech" },
  { "name": "Febechi Nwaiwu", "position": "IOL", "school": "Oklahoma" },
  { "name": "James Brockermeyer", "position": "IOL", "school": "Miami" },
  { "name": "Caden Curry", "position": "EDGE", "school": "Ohio State" },
  { "name": "Jack Pyburn", "position": "EDGE", "school": "LSU" },
  { "name": "Chris McClellan", "position": "DT", "school": "Missouri" },
  { "name": "Jaishawn Barham", "position": "LB", "school": "Michigan" },
  { "name": "Dallen Bentley", "position": "TE", "school": "Utah" },
  { "name": "Keyron Crawford", "position": "EDGE", "school": "Auburn" },
  { "name": "Pat Coogan", "position": "IOL", "school": "Indiana" },
  { "name": "Joe Royer", "position": "TE", "school": "Cincinnati" },
  { "name": "Michael Trigg", "position": "TE", "school": "Baylor" },
  { "name": "Nadame Tucker", "position": "EDGE", "school": "Western Michigan" },
  { "name": "Skyler Bell", "position": "WR", "school": "UConn" },
  { "name": "Bryce Boettcher", "position": "LB", "school": "Oregon" },
  { "name": "Adam Randall", "position": "RB", "school": "Clemson" },
  { "name": "Mike Washington Jr.", "position": "RB", "school": "Arkansas" },
  { "name": "Brenen Thompson", "position": "WR", "school": "Northern Illinois" },
  { "name": "A'Mauri Washington", "position": "DT", "school": "Oregon" },
  { "name": "Justin Joly", "position": "TE", "school": "NC State" },
  { "name": "Jack Endries", "position": "TE", "school": "Texas" },
  { "name": "Carter Smith", "position": "OT", "school": "Indiana" }
];

export const PICK_SUGGESTIONS = {
  "1": [
    { "name": "Fernando Mendoza", "position": "QB", "school": "Indiana" },
    { "name": "Arvell Reese", "position": "LB", "school": "Ohio State" },
    { "name": "Rueben Bain Jr.", "position": "EDGE", "school": "Miami" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" }
  ],
  "2": [
    { "name": "Arvell Reese", "position": "LB", "school": "Ohio State" },
    { "name": "Rueben Bain Jr.", "position": "EDGE", "school": "Miami" },
    { "name": "David Bailey", "position": "EDGE", "school": "Texas Tech" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" }
  ],
  "3": [
    { "name": "Francis Mauigoa", "position": "OT", "school": "Miami" },
    { "name": "Rueben Bain Jr.", "position": "EDGE", "school": "Miami" },
    { "name": "Arvell Reese", "position": "LB", "school": "Ohio State" },
    { "name": "Spencer Fano", "position": "OT", "school": "Utah" }
  ],
  "4": [
    { "name": "Rueben Bain Jr.", "position": "EDGE", "school": "Miami" },
    { "name": "David Bailey", "position": "EDGE", "school": "Texas Tech" },
    { "name": "Jordyn Tyson", "position": "WR", "school": "Arizona State" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" }
  ],
  "5": [
    { "name": "Spencer Fano", "position": "OT", "school": "Utah" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" },
    { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" },
    { "name": "Francis Mauigoa", "position": "OT", "school": "Miami" }
  ],
  "6": [
    { "name": "Jermod McCoy", "position": "CB", "school": "Tennessee" },
    { "name": "David Bailey", "position": "EDGE", "school": "Texas Tech" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" },
    { "name": "Spencer Fano", "position": "OT", "school": "Utah" }
  ],
  "7": [
    { "name": "David Bailey", "position": "EDGE", "school": "Texas Tech" },
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" },
    { "name": "Jeremiyah Love", "position": "RB", "school": "Notre Dame" },
    { "name": "Keldric Faulk", "position": "EDGE", "school": "Auburn" }
  ],
  "8": [
    { "name": "Jeremiyah Love", "position": "RB", "school": "Notre Dame" },
    { "name": "Keldric Faulk", "position": "EDGE", "school": "Auburn" },
    { "name": "Makai Lemon", "position": "WR", "school": "USC" },
    { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" }
  ],
  "9": [
    { "name": "Keldric Faulk", "position": "EDGE", "school": "Auburn" },
    { "name": "Peter Woods", "position": "DT", "school": "Clemson" },
    { "name": "Cashius Howell", "position": "EDGE", "school": "Texas A&M" },
    { "name": "Mansoor Delane", "position": "CB", "school": "LSU" }
  ],
  "10": [
    { "name": "Caleb Downs", "position": "S", "school": "Ohio State" },
    { "name": "Peter Woods", "position": "DT", "school": "Clemson" },
    { "name": "Mansoor Delane", "position": "CB", "school": "LSU" },
    { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" }
  ],
  "11": [
    { "name": "Mansoor Delane", "position": "CB", "school": "LSU" },
    { "name": "Makai Lemon", "position": "WR", "school": "USC" },
    { "name": "Jordyn Tyson", "position": "WR", "school": "Arizona State" },
    { "name": "Cashius Howell", "position": "EDGE", "school": "Texas A&M" }
  ],
  "12": [
    { "name": "Cashius Howell", "position": "EDGE", "school": "Texas A&M" },
    { "name": "Sonny Styles", "position": "LB", "school": "Ohio State" },
    { "name": "Makai Lemon", "position": "WR", "school": "USC" },
    { "name": "Denzel Boston", "position": "WR", "school": "Washington" }
  ],
  "13": [
    { "name": "Makai Lemon", "position": "WR", "school": "USC" },
    { "name": "T.J. Parker", "position": "EDGE", "school": "Clemson" },
    { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" },
    { "name": "Kenyon Sadiq", "position": "TE", "school": "Oregon" }
  ],
  "14": [
    { "name": "Peter Woods", "position": "DT", "school": "Clemson" },
    { "name": "Avieon Terrell", "position": "CB", "school": "Clemson" },
    { "name": "T.J. Parker", "position": "EDGE", "school": "Clemson" },
    { "name": "Olaivavega Ioane", "position": "IOL", "school": "Penn State" }
  ],
  "15": [
    { "name": "T.J. Parker", "position": "EDGE", "school": "Clemson" },
    { "name": "Jordyn Tyson", "position": "WR", "school": "Arizona State" },
    { "name": "Avieon Terrell", "position": "CB", "school": "Clemson" },
    { "name": "Denzel Boston", "position": "WR", "school": "Washington" }
  ],
  "16": [
    { "name": "Carnell Tate", "position": "WR", "school": "Ohio State" },
    { "name": "Ty Simpson", "position": "QB", "school": "Alabama" },
    { "name": "Kenyon Sadiq", "position": "TE", "school": "Oregon" },
    { "name": "Jermod McCoy", "position": "CB", "school": "Tennessee" }
  ],
  "17": [
    { "name": "Kadyn Proctor", "position": "OT", "school": "Alabama" },
    { "name": "Akheem Mesidor", "position": "EDGE", "school": "Miami" },
    { "name": "Caleb Lomu", "position": "OT", "school": "Utah" },
    { "name": "Monroe Freeling", "position": "OT", "school": "Georgia" }
  ],
  "18": [
    { "name": "Sonny Styles", "position": "LB", "school": "Ohio State" },
    { "name": "CJ Allen", "position": "LB", "school": "Georgia" },
    { "name": "Olaivavega Ioane", "position": "IOL", "school": "Penn State" },
    { "name": "Anthony Hill Jr.", "position": "LB", "school": "Texas" }
  ],
  "19": [
    { "name": "Jordyn Tyson", "position": "WR", "school": "Arizona State" },
    { "name": "Denzel Boston", "position": "WR", "school": "Washington" },
    { "name": "K.C. Concepcion", "position": "WR", "school": "Texas A&M" },
    { "name": "Kenyon Sadiq", "position": "TE", "school": "Oregon" }
  ],
  "20": [
    { "name": "Avieon Terrell", "position": "CB", "school": "Clemson" },
    { "name": "Colton Hood", "position": "CB", "school": "Tennessee" },
    { "name": "Blake Miller", "position": "OT", "school": "Clemson" },
    { "name": "Christen Miller", "position": "DT", "school": "Georgia" }
  ],
  "21": [
    { "name": "Denzel Boston", "position": "WR", "school": "Washington" },
    { "name": "K.C. Concepcion", "position": "WR", "school": "Texas A&M" },
    { "name": "Dillon Thieneman", "position": "S", "school": "Oregon" },
    { "name": "Emmanuel McNeil-Warren", "position": "S", "school": "Toledo" }
  ],
  "22": [
    { "name": "Kenyon Sadiq", "position": "TE", "school": "Oregon" },
    { "name": "Olaivavega Ioane", "position": "IOL", "school": "Penn State" },
    { "name": "Max Iheanachor", "position": "OT", "school": "Arizona State" },
    { "name": "Lee Hunter", "position": "DT", "school": "Texas Tech" }
  ],
  "23": [
    { "name": "Olaivavega Ioane", "position": "IOL", "school": "Penn State" },
    { "name": "Emmanuel Pregnon", "position": "IOL", "school": "Oregon" },
    { "name": "Zion Young", "position": "EDGE", "school": "Missouri" },
    { "name": "Deontae Lawson", "position": "LB", "school": "Alabama" }
  ],
  "24": [
    { "name": "Kayden McDonald", "position": "DT", "school": "Ohio State" },
    { "name": "Lee Hunter", "position": "DT", "school": "Texas Tech" },
    { "name": "Christen Miller", "position": "DT", "school": "Georgia" },
    { "name": "Brandon Cisse", "position": "CB", "school": "South Carolina" }
  ],
  "25": [
    { "name": "Lee Hunter", "position": "DT", "school": "Texas Tech" },
    { "name": "Caleb Banks", "position": "DT", "school": "Florida" },
    { "name": "Romello Height", "position": "EDGE", "school": "Texas Tech" },
    { "name": "Anthony Hill Jr.", "position": "LB", "school": "Texas" }
  ],
  "26": [
    { "name": "K.C. Concepcion", "position": "WR", "school": "Texas A&M" },
    { "name": "Omar Cooper Jr.", "position": "WR", "school": "Indiana" },
    { "name": "Chris Bell", "position": "WR", "school": "Louisville" },
    { "name": "Germie Bernard", "position": "WR", "school": "Alabama" }
  ],
  "27": [
    { "name": "Caleb Lomu", "position": "OT", "school": "Utah" },
    { "name": "Monroe Freeling", "position": "OT", "school": "Georgia" },
    { "name": "Blake Miller", "position": "OT", "school": "Clemson" },
    { "name": "Gennings Dunker", "position": "OT", "school": "Iowa" }
  ],
  "28": [
    { "name": "Caleb Banks", "position": "DT", "school": "Florida" },
    { "name": "Domonique Orange", "position": "DT", "school": "Iowa State" },
    { "name": "Gabe Jacas", "position": "EDGE", "school": "Illinois" },
    { "name": "Dani Dennis-Sutton", "position": "EDGE", "school": "Penn State" }
  ],
  "29": [
    { "name": "Ty Simpson", "position": "QB", "school": "Alabama" },
    { "name": "Garrett Nussmeier", "position": "QB", "school": "LSU" },
    { "name": "CJ Allen", "position": "LB", "school": "Georgia" },
    { "name": "Akheem Mesidor", "position": "EDGE", "school": "Miami" }
  ],
  "30": [
    { "name": "CJ Allen", "position": "LB", "school": "Georgia" },
    { "name": "Deontae Lawson", "position": "LB", "school": "Alabama" },
    { "name": "R Mason Thomas", "position": "EDGE", "school": "Oklahoma" },
    { "name": "Davison Igbinosun", "position": "CB", "school": "Ohio State" }
  ],
  "31": [
    { "name": "Isaiah World", "position": "OT", "school": "Oregon" },
    { "name": "Monroe Freeling", "position": "OT", "school": "Georgia" },
    { "name": "Chase Bisontis", "position": "IOL", "school": "Texas A&M" },
    { "name": "Malachi Fields", "position": "WR", "school": "Notre Dame" }
  ],
  "32": [
    { "name": "Colton Hood", "position": "CB", "school": "Tennessee" },
    { "name": "Brandon Cisse", "position": "CB", "school": "South Carolina" },
    { "name": "Malik Muhammad", "position": "CB", "school": "Texas" },
    { "name": "Kamari Ramsey", "position": "S", "school": "USC" }
  ]
};
