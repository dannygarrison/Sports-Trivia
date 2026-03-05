// ── 2026 NFL Draft Prospects ──────────────────────────────────────────────────
// Updated: March 2026 (post-combine)
// Source: Drafttek, ESPN (Kiper/Miller/Reid/Yates), Walter Football
// Positions: QB RB WR TE OT IOL EDGE DT LB CB S

export const ALL_PROSPECTS = [
  // ── QBs ──────────────────────────────────────────────────────────────────
  { name: "Fernando Mendoza",      position: "QB",   school: "Indiana" },
  { name: "Ty Simpson",            position: "QB",   school: "Alabama" },
  { name: "Jaxson Dart",           position: "QB",   school: "Ole Miss" },

  // ── RBs ──────────────────────────────────────────────────────────────────
  { name: "Jeremiyah Love",        position: "RB",   school: "Notre Dame" },
  { name: "Kaleb Johnson",         position: "RB",   school: "Iowa" },
  { name: "Damien Martinez",       position: "RB",   school: "Oregon" },
  { name: "Brashard Smith",        position: "RB",   school: "SMU" },

  // ── WRs ──────────────────────────────────────────────────────────────────
  { name: "Carnell Tate",          position: "WR",   school: "Ohio State" },
  { name: "Makai Lemon",           position: "WR",   school: "USC" },
  { name: "Jordyn Tyson",          position: "WR",   school: "Arizona State" },
  { name: "Denzel Boston",         position: "WR",   school: "Washington" },
  { name: "Kevin Concepcion",      position: "WR",   school: "Texas A&M" },
  { name: "Luther Burden III",     position: "WR",   school: "Missouri" },
  { name: "Elic Ayomanor",         position: "WR",   school: "Stanford" },
  { name: "Jack Bech",             position: "WR",   school: "TCU" },

  // ── TEs ──────────────────────────────────────────────────────────────────
  { name: "Kenyon Sadiq",          position: "TE",   school: "Oregon" },
  { name: "Eli Stowers",           position: "TE",   school: "Vanderbilt" },
  { name: "Harold Fannin Jr.",     position: "TE",   school: "Bowling Green" },

  // ── OTs ──────────────────────────────────────────────────────────────────
  { name: "Francis Mauigoa",       position: "OT",   school: "Miami" },
  { name: "Spencer Fano",          position: "OT",   school: "Utah" },
  { name: "Kadyn Proctor",         position: "OT",   school: "Alabama" },
  { name: "Caleb Lomu",            position: "OT",   school: "Utah" },
  { name: "Max Iheanachor",        position: "OT",   school: "Arizona State" },
  { name: "Monroe Freeling",       position: "OT",   school: "Georgia" },

  // ── IOL ──────────────────────────────────────────────────────────────────
  { name: "Olaivavega Ioane",      position: "IOL",  school: "Penn State" },

  // ── EDGE ─────────────────────────────────────────────────────────────────
  { name: "Arvell Reese",          position: "EDGE", school: "Ohio State" },
  { name: "David Bailey",          position: "EDGE", school: "Texas Tech" },
  { name: "Rueben Bain Jr.",       position: "EDGE", school: "Miami" },
  { name: "T.J. Parker",           position: "EDGE", school: "Clemson" },
  { name: "Keldric Faulk",         position: "EDGE", school: "Auburn" },
  { name: "Cashius Howell",        position: "EDGE", school: "Texas A&M" },
  { name: "Kyle Kennard",          position: "EDGE", school: "South Carolina" },

  // ── DTs ──────────────────────────────────────────────────────────────────
  { name: "Peter Woods",           position: "DT",   school: "Clemson" },
  { name: "Caleb Banks",           position: "DT",   school: "Florida" },
  { name: "Shemar Turner",         position: "DT",   school: "Texas A&M" },

  // ── LBs ──────────────────────────────────────────────────────────────────
  { name: "Sonny Styles",          position: "LB",   school: "Ohio State" },
  { name: "Anthony Hill Jr.",      position: "LB",   school: "Texas" },

  // ── CBs ──────────────────────────────────────────────────────────────────
  { name: "Mansoor Delane",        position: "CB",   school: "LSU" },
  { name: "Jermod McCoy",          position: "CB",   school: "Tennessee" },
  { name: "Colton Hood",           position: "CB",   school: "Tennessee" },
  { name: "Avieon Terrell",        position: "CB",   school: "Clemson" },
  { name: "Chris Johnson",         position: "CB",   school: "San Diego State" },
  { name: "Jabbar Muhammad",       position: "CB",   school: "Oregon" },
  { name: "Benjamin Morrison",     position: "CB",   school: "Notre Dame" },

  // ── Ss ───────────────────────────────────────────────────────────────────
  { name: "Caleb Downs",           position: "S",    school: "Ohio State" },
  { name: "Dillon Thieneman",      position: "S",    school: "Oregon" },
  { name: "Emmanuel McNeil-Warren",position: "S",    school: "Toledo" },
  { name: "Xavier Watts",          position: "S",    school: "Notre Dame" },
  { name: "Andrew Mukuba",         position: "S",    school: "Clemson" },
];

// ── Per-pick suggestions (3-4 players per pick) ───────────────────────────────
// Based on team needs + post-combine consensus rankings
export const PICK_SUGGESTIONS = {
  1:  [
    { name: "Fernando Mendoza",  position: "QB",   school: "Indiana" },
    { name: "Ty Simpson",        position: "QB",   school: "Alabama" },
    { name: "Jaxson Dart",       position: "QB",   school: "Ole Miss" },
  ],
  2:  [
    { name: "Arvell Reese",      position: "EDGE", school: "Ohio State" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Francis Mauigoa",   position: "OT",   school: "Miami" },
    { name: "Carnell Tate",      position: "WR",   school: "Ohio State" },
  ],
  3:  [
    { name: "Jeremiyah Love",    position: "RB",   school: "Notre Dame" },
    { name: "David Bailey",      position: "EDGE", school: "Texas Tech" },
    { name: "T.J. Parker",       position: "EDGE", school: "Clemson" },
    { name: "Spencer Fano",      position: "OT",   school: "Utah" },
  ],
  4:  [
    { name: "Caleb Downs",       position: "S",    school: "Ohio State" },
    { name: "Kenyon Sadiq",      position: "TE",   school: "Oregon" },
    { name: "Spencer Fano",      position: "OT",   school: "Utah" },
    { name: "Jeremiyah Love",    position: "RB",   school: "Notre Dame" },
  ],
  5:  [
    { name: "Francis Mauigoa",   position: "OT",   school: "Miami" },
    { name: "Spencer Fano",      position: "OT",   school: "Utah" },
    { name: "Jordyn Tyson",      position: "WR",   school: "Arizona State" },
    { name: "Kadyn Proctor",     position: "OT",   school: "Alabama" },
  ],
  6:  [
    { name: "Rueben Bain Jr.",   position: "EDGE", school: "Miami" },
    { name: "David Bailey",      position: "EDGE", school: "Texas Tech" },
    { name: "Carnell Tate",      position: "WR",   school: "Ohio State" },
    { name: "Caleb Lomu",        position: "OT",   school: "Utah" },
  ],
  7:  [
    { name: "Arvell Reese",      position: "EDGE", school: "Ohio State" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Mansoor Delane",    position: "CB",   school: "LSU" },
    { name: "David Bailey",      position: "EDGE", school: "Texas Tech" },
  ],
  8:  [
    { name: "Carnell Tate",      position: "WR",   school: "Ohio State" },
    { name: "Makai Lemon",       position: "WR",   school: "USC" },
    { name: "Jordyn Tyson",      position: "WR",   school: "Arizona State" },
    { name: "Olaivavega Ioane",  position: "IOL",  school: "Penn State" },
  ],
  9:  [
    { name: "Jermod McCoy",      position: "CB",   school: "Tennessee" },
    { name: "Mansoor Delane",    position: "CB",   school: "LSU" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
  ],
  10: [
    { name: "Caleb Lomu",        position: "OT",   school: "Utah" },
    { name: "Kadyn Proctor",     position: "OT",   school: "Alabama" },
    { name: "T.J. Parker",       position: "EDGE", school: "Clemson" },
    { name: "Mansoor Delane",    position: "CB",   school: "LSU" },
  ],
  11: [
    { name: "Kadyn Proctor",     position: "OT",   school: "Alabama" },
    { name: "Monroe Freeling",   position: "OT",   school: "Georgia" },
    { name: "Jordyn Tyson",      position: "WR",   school: "Arizona State" },
    { name: "Denzel Boston",     position: "WR",   school: "Washington" },
  ],
  12: [
    { name: "David Bailey",      position: "EDGE", school: "Texas Tech" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Peter Woods",       position: "DT",   school: "Clemson" },
    { name: "Kevin Concepcion",  position: "WR",   school: "Texas A&M" },
  ],
  13: [
    { name: "Kenyon Sadiq",      position: "TE",   school: "Oregon" },
    { name: "Spencer Fano",      position: "OT",   school: "Utah" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Dillon Thieneman",  position: "S",    school: "Oregon" },
  ],
  14: [
    { name: "Olaivavega Ioane",  position: "IOL",  school: "Penn State" },
    { name: "Carnell Tate",      position: "WR",   school: "Ohio State" },
    { name: "Makai Lemon",       position: "WR",   school: "USC" },
    { name: "Kenyon Sadiq",      position: "TE",   school: "Oregon" },
  ],
  15: [
    { name: "Anthony Hill Jr.",  position: "LB",   school: "Texas" },
    { name: "Sonny Styles",      position: "LB",   school: "Ohio State" },
    { name: "Colton Hood",       position: "CB",   school: "Tennessee" },
    { name: "T.J. Parker",       position: "EDGE", school: "Clemson" },
  ],
  16: [
    { name: "Carnell Tate",      position: "WR",   school: "Ohio State" },
    { name: "Makai Lemon",       position: "WR",   school: "USC" },
    { name: "Jordyn Tyson",      position: "WR",   school: "Arizona State" },
    { name: "Caleb Lomu",        position: "OT",   school: "Utah" },
  ],
  17: [
    { name: "Monroe Freeling",   position: "OT",   school: "Georgia" },
    { name: "Caleb Lomu",        position: "OT",   school: "Utah" },
    { name: "Kadyn Proctor",     position: "OT",   school: "Alabama" },
    { name: "Jermod McCoy",      position: "CB",   school: "Tennessee" },
  ],
  18: [
    { name: "Keldric Faulk",     position: "EDGE", school: "Auburn" },
    { name: "T.J. Parker",       position: "EDGE", school: "Clemson" },
    { name: "Cashius Howell",    position: "EDGE", school: "Texas A&M" },
    { name: "Denzel Boston",     position: "WR",   school: "Washington" },
  ],
  19: [
    { name: "Ty Simpson",        position: "QB",   school: "Alabama" },
    { name: "Jaxson Dart",       position: "QB",   school: "Ole Miss" },
    { name: "Rueben Bain Jr.",   position: "EDGE", school: "Miami" },
    { name: "Keldric Faulk",     position: "EDGE", school: "Auburn" },
  ],
  20: [
    { name: "Keldric Faulk",     position: "EDGE", school: "Auburn" },
    { name: "Cashius Howell",    position: "EDGE", school: "Texas A&M" },
    { name: "Kyle Kennard",      position: "EDGE", school: "South Carolina" },
    { name: "Colton Hood",       position: "CB",   school: "Tennessee" },
  ],
  21: [
    { name: "Monroe Freeling",   position: "OT",   school: "Georgia" },
    { name: "Max Iheanachor",    position: "OT",   school: "Arizona State" },
    { name: "Kadyn Proctor",     position: "OT",   school: "Alabama" },
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
  ],
  22: [
    { name: "Rueben Bain Jr.",   position: "EDGE", school: "Miami" },
    { name: "Keldric Faulk",     position: "EDGE", school: "Auburn" },
    { name: "Denzel Boston",     position: "WR",   school: "Washington" },
    { name: "Kevin Concepcion",  position: "WR",   school: "Texas A&M" },
  ],
  23: [
    { name: "Colton Hood",       position: "CB",   school: "Tennessee" },
    { name: "Mansoor Delane",    position: "CB",   school: "LSU" },
    { name: "Avieon Terrell",    position: "CB",   school: "Clemson" },
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
  ],
  24: [
    { name: "Mansoor Delane",    position: "CB",   school: "LSU" },
    { name: "Colton Hood",       position: "CB",   school: "Tennessee" },
    { name: "Dillon Thieneman",  position: "S",    school: "Oregon" },
    { name: "Peter Woods",       position: "DT",   school: "Clemson" },
  ],
  25: [
    { name: "Kenyon Sadiq",      position: "TE",   school: "Oregon" },
    { name: "Eli Stowers",       position: "TE",   school: "Vanderbilt" },
    { name: "Luther Burden III", position: "WR",   school: "Missouri" },
    { name: "Elic Ayomanor",     position: "WR",   school: "Stanford" },
  ],
  26: [
    { name: "Dillon Thieneman",  position: "S",    school: "Oregon" },
    { name: "Emmanuel McNeil-Warren", position: "S", school: "Toledo" },
    { name: "Xavier Watts",      position: "S",    school: "Notre Dame" },
    { name: "Anthony Hill Jr.",  position: "LB",   school: "Texas" },
  ],
  27: [
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
    { name: "Kyle Kennard",      position: "EDGE", school: "South Carolina" },
    { name: "Cashius Howell",    position: "EDGE", school: "Texas A&M" },
    { name: "Shemar Turner",     position: "DT",   school: "Texas A&M" },
  ],
  28: [
    { name: "Jabbar Muhammad",   position: "CB",   school: "Oregon" },
    { name: "Chris Johnson",     position: "CB",   school: "San Diego State" },
    { name: "Avieon Terrell",    position: "CB",   school: "Clemson" },
    { name: "Dillon Thieneman",  position: "S",    school: "Oregon" },
  ],
  29: [
    { name: "Kevin Concepcion",  position: "WR",   school: "Texas A&M" },
    { name: "Kyle Kennard",      position: "EDGE", school: "South Carolina" },
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
    { name: "Anthony Hill Jr.",  position: "LB",   school: "Texas" },
  ],
  30: [
    { name: "Luther Burden III", position: "WR",   school: "Missouri" },
    { name: "Elic Ayomanor",     position: "WR",   school: "Stanford" },
    { name: "Jack Bech",         position: "WR",   school: "TCU" },
    { name: "Kevin Concepcion",  position: "WR",   school: "Texas A&M" },
  ],
  31: [
    { name: "Max Iheanachor",    position: "OT",   school: "Arizona State" },
    { name: "Monroe Freeling",   position: "OT",   school: "Georgia" },
    { name: "Kyle Kennard",      position: "EDGE", school: "South Carolina" },
    { name: "Anthony Hill Jr.",  position: "LB",   school: "Texas" },
  ],
  32: [
    { name: "Caleb Banks",       position: "DT",   school: "Florida" },
    { name: "Kyle Kennard",      position: "EDGE", school: "South Carolina" },
    { name: "Monroe Freeling",   position: "OT",   school: "Georgia" },
    { name: "Dillon Thieneman",  position: "S",    school: "Oregon" },
  ],
};
