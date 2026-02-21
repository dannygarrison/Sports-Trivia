import { useState, useRef, useEffect, useCallback } from "react";

// ── DATA ─────────────────────────────────────────────────────────────────────

const NFL_TEAMS = [
  "Arizona Cardinals","Atlanta Falcons","Baltimore Ravens","Buffalo Bills",
  "Carolina Panthers","Chicago Bears","Cincinnati Bengals","Cleveland Browns",
  "Dallas Cowboys","Denver Broncos","Detroit Lions","Green Bay Packers",
  "Houston Texans","Indianapolis Colts","Jacksonville Jaguars","Kansas City Chiefs",
  "Las Vegas Raiders","Los Angeles Chargers","Los Angeles Rams","Miami Dolphins",
  "Minnesota Vikings","New England Patriots","New Orleans Saints","New York Giants",
  "New York Jets","Philadelphia Eagles","Pittsburgh Steelers","San Francisco 49ers",
  "Seattle Seahawks","Tampa Bay Buccaneers","Tennessee Titans","Washington Commanders"
];

const TEAM_ALIASES = {
  "Arizona Cardinals": ["arizona","cardinals","ari"],
  "Atlanta Falcons": ["atlanta","falcons","atl"],
  "Baltimore Ravens": ["baltimore","ravens","bal"],
  "Buffalo Bills": ["buffalo","bills","buf"],
  "Carolina Panthers": ["carolina","panthers","car"],
  "Chicago Bears": ["chicago","bears","chi"],
  "Cincinnati Bengals": ["cincinnati","bengals","cin"],
  "Cleveland Browns": ["cleveland","browns","cle"],
  "Dallas Cowboys": ["dallas","cowboys","dal"],
  "Denver Broncos": ["denver","broncos","den"],
  "Detroit Lions": ["detroit","lions","det"],
  "Green Bay Packers": ["green bay","packers","gb","gbp"],
  "Houston Texans": ["houston","texans","hou"],
  "Indianapolis Colts": ["indianapolis","colts","ind"],
  "Jacksonville Jaguars": ["jacksonville","jaguars","jax"],
  "Kansas City Chiefs": ["kansas city","chiefs","kc"],
  "Las Vegas Raiders": ["las vegas","raiders","lv","lvr","oakland raiders","oakland"],
  "Los Angeles Chargers": ["los angeles chargers","la chargers","chargers","lac","san diego chargers","san diego"],
  "Los Angeles Rams": ["los angeles rams","la rams","rams","lar","st. louis rams","st louis rams","st. louis","st louis"],
  "Miami Dolphins": ["miami","dolphins","mia"],
  "Minnesota Vikings": ["minnesota","vikings","min"],
  "New England Patriots": ["new england","patriots","ne","nep"],
  "New Orleans Saints": ["new orleans","saints","no"],
  "New York Giants": ["new york giants","giants","nyg"],
  "New York Jets": ["new york jets","jets","nyj"],
  "Philadelphia Eagles": ["philadelphia","eagles","phi"],
  "Pittsburgh Steelers": ["pittsburgh","steelers","pit"],
  "San Francisco 49ers": ["san francisco","49ers","sf","niners"],
  "Seattle Seahawks": ["seattle","seahawks","sea"],
  "Tampa Bay Buccaneers": ["tampa bay","buccaneers","tb","bucs"],
  "Tennessee Titans": ["tennessee","titans","ten"],
  "Washington Commanders": ["washington","commanders","was","wsh","washington football team","washington redskins","washington nationals","football team"],
};

const COLLEGE_ALIASES = {
  "USC": ["usc","southern california","southern cal","university of southern california"],
  "LSU": ["lsu","louisiana state"],
  "Ohio State": ["ohio state","osu","ohio st"],
  "Alabama": ["alabama","bama","university of alabama"],
  "Florida State": ["florida state","fsu","florida st"],
  "Miami (FL)": ["miami fl","miami florida","miami (fl)","university of miami","miami hurricanes"],
  "Ole Miss": ["ole miss","mississippi","university of mississippi"],
  "Notre Dame": ["notre dame","nd","fighting irish"],
  "Penn State": ["penn state","psu","penn st"],
  "Michigan": ["michigan","university of michigan","u of m","umich"],
  "Georgia": ["georgia","uga","university of georgia"],
  "Oklahoma": ["oklahoma","ou","university of oklahoma","sooners"],
  "Florida": ["florida","uf","university of florida","gators"],
  "Tennessee": ["tennessee","ut","university of tennessee","vols"],
  "Texas": ["texas","ut austin","university of texas","longhorns"],
  "Clemson": ["clemson","clemson university"],
  "Auburn": ["auburn","auburn university"],
  "Stanford": ["stanford","stanford university"],
  "North Carolina": ["north carolina","unc","north carolina tar heels"],
  "South Carolina": ["south carolina","usc south carolina","gamecock"],
  "Wisconsin": ["wisconsin","uw","university of wisconsin"],
  "Minnesota": ["minnesota","university of minnesota","u of m minnesota"],
  "Minnesota State-Mankato": ["minnesota state mankato","minnesota state","mankato"],
};

const PLAYERS = [
  {name:"Dalvin Cook",colleges:["Florida State"],teams:["Minnesota Vikings","New York Jets","New York Giants"]},
  {name:"Leonard Fournette",colleges:["LSU"],teams:["Jacksonville Jaguars","Tampa Bay Buccaneers"]},
  {name:"Tee Higgins",colleges:["Clemson"],teams:["Cincinnati Bengals"]},
  {name:"A.J. Brown",colleges:["Ole Miss"],teams:["Tennessee Titans","Philadelphia Eagles"]},
  {name:"DeVonta Smith",colleges:["Alabama"],teams:["Philadelphia Eagles"]},
  {name:"Dallas Goedert",colleges:["South Dakota State"],teams:["Philadelphia Eagles"]},
  {name:"Jake Ferguson",colleges:["Wisconsin"],teams:["Dallas Cowboys"]},
  {name:"Austin Ekeler",colleges:["Western Colorado"],teams:["Los Angeles Chargers","Washington Commanders"]},
  {name:"Raheem Mostert",colleges:["Purdue"],teams:["San Francisco 49ers","Miami Dolphins"]},
  {name:"Jordan Addison",colleges:["Pittsburgh","USC"],teams:["Minnesota Vikings"]},
  {name:"Marvin Harrison Jr.",colleges:["Ohio State"],teams:["Arizona Cardinals"]},
  {name:"Patrick Mahomes",colleges:["Texas Tech"],teams:["Kansas City Chiefs"]},
  {name:"Tom Brady",colleges:["Michigan"],teams:["New England Patriots","Tampa Bay Buccaneers"]},
  {name:"Jerry Rice",colleges:["Mississippi Valley State"],teams:["San Francisco 49ers","Seattle Seahawks"]},
  {name:"Peyton Manning",colleges:["Tennessee"],teams:["Indianapolis Colts","Denver Broncos"]},
  {name:"Barry Sanders",colleges:["Oklahoma State"],teams:["Detroit Lions"]},
  {name:"Lawrence Taylor",colleges:["North Carolina"],teams:["New York Giants"]},
  {name:"Emmitt Smith",colleges:["Florida"],teams:["Dallas Cowboys","Arizona Cardinals"]},
  {name:"Randy Moss",colleges:["Marshall"],teams:["Minnesota Vikings","New England Patriots","San Francisco 49ers","Tennessee Titans"]},
  {name:"Joe Montana",colleges:["Notre Dame"],teams:["San Francisco 49ers","Kansas City Chiefs"]},
  {name:"Walter Payton",colleges:["Jackson State"],teams:["Chicago Bears"]},
  {name:"Reggie White",colleges:["Tennessee"],teams:["Philadelphia Eagles","Green Bay Packers","Carolina Panthers"]},
  {name:"John Elway",colleges:["Stanford"],teams:["Denver Broncos"]},
  {name:"Jim Brown",colleges:["Syracuse"],teams:["Cleveland Browns"]},
  {name:"Dan Marino",colleges:["Pittsburgh"],teams:["Miami Dolphins"]},
  {name:"Brett Favre",colleges:["Southern Miss"],teams:["Atlanta Falcons","Green Bay Packers","New York Jets","Minnesota Vikings"]},
  {name:"Deion Sanders",colleges:["Florida State"],teams:["Atlanta Falcons","San Francisco 49ers","Dallas Cowboys","Baltimore Ravens"]},
  {name:"Aaron Rodgers",colleges:["California"],teams:["Green Bay Packers","New York Jets","Pittsburgh Steelers"]},
  {name:"Calvin Johnson",colleges:["Georgia Tech"],teams:["Detroit Lions"]},
  {name:"Adrian Peterson",colleges:["Oklahoma"],teams:["Minnesota Vikings","New Orleans Saints","Arizona Cardinals","Seattle Seahawks","Detroit Lions","Tennessee Titans"]},
  {name:"Ray Lewis",colleges:["Miami (FL)"],teams:["Baltimore Ravens"]},
  {name:"Troy Polamalu",colleges:["USC"],teams:["Pittsburgh Steelers"]},
  {name:"Marshawn Lynch",colleges:["California"],teams:["Buffalo Bills","Seattle Seahawks"]},
  {name:"Steve Young",colleges:["BYU"],teams:["Tampa Bay Buccaneers","San Francisco 49ers"]},
  {name:"Junior Seau",colleges:["USC"],teams:["Miami Dolphins","New England Patriots"]},
  {name:"Tony Gonzalez",colleges:["California"],teams:["Kansas City Chiefs","Atlanta Falcons"]},
  {name:"Larry Fitzgerald",colleges:["Pittsburgh"],teams:["Arizona Cardinals"]},
  {name:"Terrell Owens",colleges:["Tennessee-Chattanooga"],teams:["San Francisco 49ers","Philadelphia Eagles","Dallas Cowboys","Buffalo Bills","Cincinnati Bengals"]},
  {name:"LaDainian Tomlinson",colleges:["TCU"],teams:["New York Jets"]},
  {name:"Brian Urlacher",colleges:["New Mexico"],teams:["Chicago Bears"]},
  {name:"Rob Gronkowski",colleges:["Arizona"],teams:["New England Patriots","Tampa Bay Buccaneers"]},
  {name:"Drew Brees",colleges:["Purdue"],teams:["New Orleans Saints"]},
  {name:"Cam Newton",colleges:["Auburn"],teams:["Carolina Panthers","New England Patriots"]},
  {name:"Russell Wilson",colleges:["Wisconsin","NC State"],teams:["Seattle Seahawks","Denver Broncos","Pittsburgh Steelers","New York Giants"]},
  {name:"Odell Beckham Jr.",colleges:["LSU"],teams:["New York Giants","Cleveland Browns","Los Angeles Rams","Baltimore Ravens","Miami Dolphins"]},
  {name:"Antonio Brown",colleges:["Central Michigan"],teams:["Pittsburgh Steelers","New England Patriots","Tampa Bay Buccaneers"]},
  {name:"Frank Gore",colleges:["Miami (FL)"],teams:["San Francisco 49ers","Indianapolis Colts","Miami Dolphins","Buffalo Bills","New York Jets"]},
  {name:"Charles Woodson",colleges:["Michigan"],teams:["Green Bay Packers"]},
  {name:"Richard Sherman",colleges:["Stanford"],teams:["Seattle Seahawks","San Francisco 49ers","Tampa Bay Buccaneers"]},
  {name:"Von Miller",colleges:["Texas A&M"],teams:["Denver Broncos","Los Angeles Rams","Buffalo Bills","Washington Commanders"]},
  {name:"J.J. Watt",colleges:["Wisconsin"],teams:["Houston Texans","Arizona Cardinals"]},
  {name:"Khalil Mack",colleges:["Buffalo"],teams:["Chicago Bears","Los Angeles Chargers"]},
  {name:"Aaron Donald",colleges:["Pittsburgh"],teams:["Los Angeles Rams"]},
  {name:"Myles Garrett",colleges:["Texas A&M"],teams:["Cleveland Browns"]},
  {name:"Bradley Chubb",colleges:["NC State"],teams:["Denver Broncos","Miami Dolphins"]},
  {name:"Micah Parsons",colleges:["Penn State"],teams:["Dallas Cowboys","Green Bay Packers"]},
  {name:"Justin Jefferson",colleges:["LSU"],teams:["Minnesota Vikings"]},
  {name:"Tyreek Hill",colleges:["West Alabama","Oklahoma State","Garden City CC"],teams:["Kansas City Chiefs","Miami Dolphins"]},
  {name:"Stefon Diggs",colleges:["Maryland"],teams:["Minnesota Vikings","Buffalo Bills","Houston Texans","New England Patriots"]},
  {name:"Davante Adams",colleges:["Fresno State"],teams:["Green Bay Packers","Las Vegas Raiders","New York Jets","Los Angeles Rams"]},
  {name:"Travis Kelce",colleges:["Cincinnati"],teams:["Kansas City Chiefs"]},
  {name:"George Kittle",colleges:["Iowa"],teams:["San Francisco 49ers"]},
  {name:"Mark Andrews",colleges:["Oklahoma"],teams:["Baltimore Ravens"]},
  {name:"Lamar Jackson",colleges:["Louisville"],teams:["Baltimore Ravens"]},
  {name:"Josh Allen",colleges:["Wyoming"],teams:["Buffalo Bills"]},
  {name:"Joe Burrow",colleges:["LSU","Ohio State"],teams:["Cincinnati Bengals"]},
  {name:"Justin Herbert",colleges:["Oregon"],teams:["Los Angeles Chargers"]},
  {name:"Kyler Murray",colleges:["Oklahoma","Texas A&M"],teams:["Arizona Cardinals"]},
  {name:"Dak Prescott",colleges:["Mississippi State"],teams:["Dallas Cowboys"]},
  {name:"Jalen Hurts",colleges:["Oklahoma","Alabama"],teams:["Philadelphia Eagles"]},
  {name:"Tua Tagovailoa",colleges:["Alabama"],teams:["Miami Dolphins"]},
  {name:"Saquon Barkley",colleges:["Penn State"],teams:["New York Giants","Philadelphia Eagles"]},
  {name:"Christian McCaffrey",colleges:["Stanford"],teams:["Carolina Panthers","San Francisco 49ers"]},
  {name:"Nick Chubb",colleges:["Georgia"],teams:["Cleveland Browns","Houston Texans"]},
  {name:"Derrick Henry",colleges:["Alabama"],teams:["Tennessee Titans","Baltimore Ravens"]},
  {name:"Alvin Kamara",colleges:["Tennessee","Hutchinson CC"],teams:["New Orleans Saints"]},
  {name:"Ezekiel Elliott",colleges:["Ohio State"],teams:["Dallas Cowboys","New England Patriots"]},
  {name:"Devonta Freeman",colleges:["Florida State"],teams:["Atlanta Falcons","New York Giants","Baltimore Ravens"]},
  {name:"DeAngelo Williams",colleges:["Memphis"],teams:["Carolina Panthers","Pittsburgh Steelers"]},
  {name:"Alfred Morris",colleges:["Florida Atlantic"],teams:["Dallas Cowboys","San Francisco 49ers"]},
  {name:"De'Von Achane",colleges:["Texas A&M"],teams:["Miami Dolphins"]},
  {name:"DeAndre Hopkins",colleges:["Clemson"],teams:["Houston Texans","Arizona Cardinals","Tennessee Titans","Kansas City Chiefs","Baltimore Ravens"]},
  {name:"Mike Evans",colleges:["Texas A&M"],teams:["Tampa Bay Buccaneers"]},
  {name:"Cooper Kupp",colleges:["Eastern Washington"],teams:["Los Angeles Rams","Seattle Seahawks"]},
  {name:"Ja'Marr Chase",colleges:["LSU"],teams:["Cincinnati Bengals"]},
  {name:"CeeDee Lamb",colleges:["Oklahoma"],teams:["Dallas Cowboys"]},
  {name:"DK Metcalf",colleges:["Ole Miss"],teams:["Seattle Seahawks","Pittsburgh Steelers"]},
  {name:"Deebo Samuel",colleges:["South Carolina"],teams:["San Francisco 49ers","Washington Commanders"]},
  {name:"Brandon Aiyuk",colleges:["Arizona State"],teams:["San Francisco 49ers"]},
  {name:"Jauan Jennings",colleges:["Tennessee"],teams:["San Francisco 49ers"]},
  {name:"T.J. Watt",colleges:["Wisconsin"],teams:["Pittsburgh Steelers"]},
  {name:"Sauce Gardner",colleges:["Cincinnati"],teams:["New York Jets","Indianapolis Colts"]},
  {name:"Jalen Ramsey",colleges:["Florida State"],teams:["Jacksonville Jaguars","Los Angeles Rams","Miami Dolphins","Pittsburgh Steelers"]},
  {name:"Trevon Diggs",colleges:["Alabama"],teams:["Dallas Cowboys"]},
  {name:"Patrick Peterson",colleges:["LSU"],teams:["Arizona Cardinals","Minnesota Vikings","Pittsburgh Steelers"]},
  {name:"Eli Manning",colleges:["Ole Miss"],teams:["New York Giants"]},
  {name:"Philip Rivers",colleges:["NC State"],teams:["Los Angeles Chargers","Indianapolis Colts"]},
  {name:"Ben Roethlisberger",colleges:["Miami (OH)"],teams:["Pittsburgh Steelers"]},
  {name:"Andrew Luck",colleges:["Stanford"],teams:["Indianapolis Colts"]},
  {name:"Michael Vick",colleges:["Virginia Tech"],teams:["Atlanta Falcons","Philadelphia Eagles","New York Jets","Pittsburgh Steelers"]},
  {name:"Matthew Stafford",colleges:["Georgia"],teams:["Detroit Lions","Los Angeles Rams"]},
  {name:"Baker Mayfield",colleges:["Oklahoma","Texas Tech"],teams:["Cleveland Browns","Carolina Panthers","Los Angeles Rams","Tampa Bay Buccaneers"]},
  {name:"Brock Purdy",colleges:["Iowa State"],teams:["San Francisco 49ers"]},
  {name:"C.J. Stroud",colleges:["Ohio State"],teams:["Houston Texans"]},
  {name:"Jayden Daniels",colleges:["Arizona State","LSU"],teams:["Washington Commanders"]},
  {name:"Bo Nix",colleges:["Auburn","Oregon"],teams:["Denver Broncos"]},
  {name:"Caleb Williams",colleges:["Oklahoma","USC"],teams:["Chicago Bears"]},
  {name:"Drake Maye",colleges:["North Carolina"],teams:["New England Patriots"]},
  {name:"Ryan Fitzpatrick",colleges:["Harvard"],teams:["New England Patriots","Cincinnati Bengals","Buffalo Bills","Tennessee Titans","Houston Texans","New York Jets","Tampa Bay Buccaneers","Miami Dolphins"]},
  {name:"Jason Witten",colleges:["Tennessee"],teams:["Dallas Cowboys","Las Vegas Raiders"]},
  {name:"Jimmy Graham",colleges:["Miami (FL)"],teams:["New Orleans Saints","Seattle Seahawks","Green Bay Packers","Chicago Bears"]},
  {name:"Kyle Pitts",colleges:["Florida"],teams:["Atlanta Falcons"]},
  {name:"Eric Dickerson",colleges:["SMU"],teams:["Los Angeles Rams","Indianapolis Colts"]},
  {name:"Marcus Allen",colleges:["USC"],teams:["Kansas City Chiefs"]},
  {name:"Todd Gurley",colleges:["Georgia"],teams:["Los Angeles Rams","Atlanta Falcons"]},
  {name:"Melvin Gordon",colleges:["Wisconsin"],teams:["Los Angeles Chargers","Denver Broncos"]},
  {name:"Le'Veon Bell",colleges:["Michigan State"],teams:["Pittsburgh Steelers","New York Jets","Kansas City Chiefs","Baltimore Ravens"]},
  {name:"Joe Mixon",colleges:["Oklahoma"],teams:["Cincinnati Bengals","Houston Texans"]},
  {name:"Jonathan Taylor",colleges:["Wisconsin"],teams:["Indianapolis Colts"]},
  {name:"Breece Hall",colleges:["Iowa State"],teams:["New York Jets"]},
  {name:"Fred Warner",colleges:["BYU"],teams:["San Francisco 49ers"]},
  {name:"Keenan Allen",colleges:["California"],teams:["Los Angeles Chargers","Chicago Bears"]},
  {name:"Amari Cooper",colleges:["Alabama"],teams:["Dallas Cowboys","Cleveland Browns","Buffalo Bills"]},
  {name:"Terry McLaurin",colleges:["Ohio State"],teams:["Washington Commanders"]},
  {name:"DJ Moore",colleges:["Maryland"],teams:["Carolina Panthers","Chicago Bears"]},
  {name:"Puka Nacua",colleges:["BYU","Washington"],teams:["Los Angeles Rams"]},
  {name:"Garrett Wilson",colleges:["Ohio State"],teams:["New York Jets"]},
  {name:"Tony Dorsett",colleges:["Pittsburgh"],teams:["Dallas Cowboys","Denver Broncos"]},
  {name:"Steve Smith Sr.",colleges:["Utah"],teams:["Carolina Panthers","Baltimore Ravens"]},
  {name:"Tony Romo",colleges:["Eastern Illinois"],teams:["Dallas Cowboys"]},
  {name:"Carson Wentz",colleges:["North Dakota State"],teams:["Philadelphia Eagles","Indianapolis Colts","Washington Commanders","Los Angeles Rams","Kansas City Chiefs","Minnesota Vikings"]},
  {name:"Sam Darnold",colleges:["USC"],teams:["New York Jets","Carolina Panthers","San Francisco 49ers","Minnesota Vikings","Seattle Seahawks"]},
  {name:"Daniel Jones",colleges:["Duke"],teams:["New York Giants","Indianapolis Colts"]},
  {name:"Josh Rosen",colleges:["UCLA"],teams:["Arizona Cardinals","Miami Dolphins"]},
  {name:"Trey Lance",colleges:["North Dakota State"],teams:["San Francisco 49ers","Dallas Cowboys"]},
  {name:"Mac Jones",colleges:["Alabama"],teams:["New England Patriots","Jacksonville Jaguars"]},
  {name:"Zach Wilson",colleges:["BYU"],teams:["New York Jets","Denver Broncos"]},
  {name:"Trevor Lawrence",colleges:["Clemson"],teams:["Jacksonville Jaguars"]},
  {name:"Justin Fields",colleges:["Georgia","Ohio State"],teams:["Chicago Bears","Pittsburgh Steelers","New York Jets"]},
  {name:"Kirk Cousins",colleges:["Michigan State"],teams:["Minnesota Vikings","Atlanta Falcons"]},
  {name:"Jameis Winston",colleges:["Florida State"],teams:["Tampa Bay Buccaneers","New Orleans Saints","Cleveland Browns"]},
  {name:"Marcus Mariota",colleges:["Oregon"],teams:["Tennessee Titans","Las Vegas Raiders","Atlanta Falcons"]},
  {name:"Derek Carr",colleges:["Fresno State"],teams:["Las Vegas Raiders","New Orleans Saints"]},
  {name:"Ryan Tannehill",colleges:["Texas A&M"],teams:["Miami Dolphins","Tennessee Titans"]},
  {name:"Teddy Bridgewater",colleges:["Louisville"],teams:["Minnesota Vikings","New Orleans Saints","Carolina Panthers","Denver Broncos","Miami Dolphins"]},
  {name:"Andy Dalton",colleges:["TCU"],teams:["Cincinnati Bengals","Dallas Cowboys","Chicago Bears","New Orleans Saints","Carolina Panthers"]},
  {name:"Joe Flacco",colleges:["Delaware"],teams:["Baltimore Ravens","Denver Broncos","New York Jets","Philadelphia Eagles","Cleveland Browns","Indianapolis Colts"]},
  {name:"Carson Palmer",colleges:["USC"],teams:["Cincinnati Bengals","Arizona Cardinals"]},
  {name:"Chad Pennington",colleges:["Marshall"],teams:["New York Jets","Miami Dolphins"]},
  {name:"David Garrard",colleges:["East Carolina"],teams:["Jacksonville Jaguars"]},
  {name:"Jason Campbell",colleges:["Auburn"],teams:["Chicago Bears","Cleveland Browns"]},
  {name:"Matt Ryan",colleges:["Boston College"],teams:["Atlanta Falcons","Indianapolis Colts"]},
  {name:"Sam Bradford",colleges:["Oklahoma"],teams:["Philadelphia Eagles","Minnesota Vikings","Arizona Cardinals"]},
  {name:"Mark Sanchez",colleges:["USC"],teams:["New York Jets","Philadelphia Eagles","Denver Broncos"]},
  {name:"Tim Tebow",colleges:["Florida"],teams:["Denver Broncos","New York Jets"]},
  {name:"Colin Kaepernick",colleges:["Nevada"],teams:["San Francisco 49ers"]},
  {name:"Nick Foles",colleges:["Arizona"],teams:["Philadelphia Eagles","Los Angeles Rams","Kansas City Chiefs","Jacksonville Jaguars","Chicago Bears"]},
  {name:"Alex Smith",colleges:["Utah"],teams:["San Francisco 49ers","Kansas City Chiefs"]},
  {name:"Geno Smith",colleges:["West Virginia"],teams:["New York Jets","New York Giants","Los Angeles Chargers","Seattle Seahawks","Las Vegas Raiders"]},
  {name:"Blaine Gabbert",colleges:["Missouri"],teams:["Jacksonville Jaguars","San Francisco 49ers","Arizona Cardinals","Tennessee Titans"]},
  {name:"Blake Bortles",colleges:["UCF"],teams:["Jacksonville Jaguars","Los Angeles Rams","Green Bay Packers"]},
  {name:"Mitch Trubisky",colleges:["North Carolina"],teams:["Chicago Bears","Buffalo Bills","Pittsburgh Steelers"]},
  {name:"Deshaun Watson",colleges:["Clemson"],teams:["Houston Texans","Cleveland Browns"]},
  {name:"Gardner Minshew",colleges:["Washington State","East Carolina","Northwest Mississippi CC"],teams:["Jacksonville Jaguars","Philadelphia Eagles","Indianapolis Colts","Las Vegas Raiders"]},
  {name:"Jared Goff",colleges:["California"],teams:["Los Angeles Rams","Detroit Lions"]},
  {name:"Jimmy Garoppolo",colleges:["Eastern Illinois"],teams:["New England Patriots","San Francisco 49ers","Las Vegas Raiders"]},
  {name:"Jacoby Brissett",colleges:["Florida","NC State"],teams:["New England Patriots","Indianapolis Colts","Miami Dolphins","Cleveland Browns","Washington Commanders"]},
  {name:"Ray Rice",colleges:["Rutgers"],teams:["Baltimore Ravens"]},
  {name:"Matt Forte",colleges:["Tulane"],teams:["Chicago Bears","New York Jets"]},
  {name:"Aaron Jones",colleges:["UTEP"],teams:["Green Bay Packers","Minnesota Vikings"]},
  {name:"Jamal Lewis",colleges:["Tennessee"],teams:["Baltimore Ravens","Cleveland Browns"]},
  {name:"Shaun Alexander",colleges:["Alabama"],teams:["Seattle Seahawks"]},
  {name:"Clinton Portis",colleges:["Miami (FL)"],teams:["Denver Broncos"]},
  {name:"Jamal Charles",colleges:["Texas"],teams:["Kansas City Chiefs","Denver Broncos"]},
  {name:"Arian Foster",colleges:["Tennessee"],teams:["Houston Texans","Miami Dolphins"]},
  {name:"Chris Johnson",colleges:["East Carolina"],teams:["Tennessee Titans","New York Jets","Arizona Cardinals"]},
  {name:"DeMarco Murray",colleges:["Oklahoma"],teams:["Dallas Cowboys","Philadelphia Eagles","Tennessee Titans"]},
  {name:"Reggie Bush",colleges:["USC"],teams:["New Orleans Saints","Miami Dolphins","Detroit Lions","San Francisco 49ers","Buffalo Bills"]},
  {name:"Darren McFadden",colleges:["Arkansas"],teams:["Dallas Cowboys"]},
  {name:"Thomas Jones",colleges:["Virginia"],teams:["Arizona Cardinals","Tampa Bay Buccaneers","Chicago Bears","New York Jets","Kansas City Chiefs"]},
  {name:"Steven Jackson",colleges:["Oregon State"],teams:["Atlanta Falcons"]},
  {name:"Maurice Jones-Drew",colleges:["UCLA"],teams:["Jacksonville Jaguars"]},
  {name:"Joseph Addai",colleges:["LSU"],teams:["Indianapolis Colts"]},
  {name:"Willis McGahee",colleges:["Miami (FL)"],teams:["Buffalo Bills","Baltimore Ravens","Denver Broncos","Cleveland Browns"]},
  {name:"Ronnie Brown",colleges:["Auburn"],teams:["Miami Dolphins","Philadelphia Eagles","Houston Texans"]},
  {name:"Cedric Benson",colleges:["Texas"],teams:["Chicago Bears","Cincinnati Bengals","Green Bay Packers"]},
  {name:"Larry Johnson",colleges:["Penn State"],teams:["Kansas City Chiefs","Cincinnati Bengals","Miami Dolphins"]},
  {name:"Kevin Jones",colleges:["Virginia Tech"],teams:["Detroit Lions","Chicago Bears"]},
  {name:"Deuce McAllister",colleges:["Ole Miss"],teams:["New Orleans Saints"]},
  {name:"Kareem Hunt",colleges:["Toledo"],teams:["Kansas City Chiefs","Cleveland Browns"]},
  {name:"Josh Jacobs",colleges:["Alabama"],teams:["Las Vegas Raiders","Green Bay Packers"]},
  {name:"Dameon Pierce",colleges:["Florida"],teams:["Houston Texans"]},
  {name:"Rachaad White",colleges:["Arizona State","Portland State"],teams:["Tampa Bay Buccaneers"]},
  {name:"Tony Pollard",colleges:["Memphis"],teams:["Dallas Cowboys","Tennessee Titans"]},
  {name:"Rico Dowdle",colleges:["South Carolina"],teams:["Dallas Cowboys"]},
  {name:"James Conner",colleges:["Pittsburgh"],teams:["Pittsburgh Steelers","Arizona Cardinals"]},
  {name:"Zack Moss",colleges:["Utah"],teams:["Buffalo Bills","Indianapolis Colts","Cincinnati Bengals"]},
  {name:"David Montgomery",colleges:["Iowa State"],teams:["Chicago Bears","Detroit Lions"]},
  {name:"Cam Akers",colleges:["Florida State"],teams:["Los Angeles Rams","Minnesota Vikings"]},
  {name:"D'Andre Swift",colleges:["Georgia"],teams:["Detroit Lions","Philadelphia Eagles","Chicago Bears"]},
  {name:"Miles Sanders",colleges:["Penn State"],teams:["Philadelphia Eagles","Carolina Panthers"]},
  {name:"Clyde Edwards-Helaire",colleges:["LSU"],teams:["Kansas City Chiefs"]},
  {name:"J.K. Dobbins",colleges:["Ohio State"],teams:["Baltimore Ravens","Los Angeles Chargers","Denver Broncos"]},
  {name:"Najee Harris",colleges:["Alabama"],teams:["Pittsburgh Steelers","Los Angeles Chargers"]},
  {name:"Travis Etienne",colleges:["Clemson"],teams:["Jacksonville Jaguars"]},
  {name:"Javonte Williams",colleges:["North Carolina"],teams:["Denver Broncos","Dallas Cowboys"]},
  {name:"Kenneth Walker III",colleges:["Michigan State","Wake Forest"],teams:["Seattle Seahawks"]},
  {name:"Marvin Harrison",colleges:["Syracuse"],teams:["Indianapolis Colts"]},
  {name:"Hines Ward",colleges:["Georgia"],teams:["Pittsburgh Steelers","Dallas Cowboys"]},
  {name:"Isaac Bruce",colleges:["Memphis"],teams:["Los Angeles Rams","San Francisco 49ers"]},
  {name:"Chad Johnson",colleges:["Santa Monica CC","Oregon State"],teams:["Cincinnati Bengals","New England Patriots"]},
  {name:"Andre Johnson",colleges:["Miami (FL)"],teams:["Houston Texans","Indianapolis Colts","Tennessee Titans"]},
  {name:"Reggie Wayne",colleges:["Miami (FL)"],teams:["Indianapolis Colts"]},
  {name:"Plaxico Burress",colleges:["Michigan State"],teams:["Pittsburgh Steelers","New York Giants","New York Jets"]},
  {name:"Dez Bryant",colleges:["Oklahoma State"],teams:["Dallas Cowboys","New Orleans Saints"]},
  {name:"Mike Wallace",colleges:["Ole Miss"],teams:["Pittsburgh Steelers","Miami Dolphins","Minnesota Vikings","Baltimore Ravens","Philadelphia Eagles"]},
  {name:"Victor Cruz",colleges:["Massachusetts"],teams:["New York Giants"]},
  {name:"Wes Welker",colleges:["Texas Tech"],teams:["Miami Dolphins","New England Patriots","Denver Broncos"]},
  {name:"Percy Harvin",colleges:["Florida"],teams:["Minnesota Vikings","Seattle Seahawks","New York Jets","Buffalo Bills"]},
  {name:"Vincent Jackson",colleges:["Northern Colorado"],teams:["Tampa Bay Buccaneers"]},
  {name:"Julio Jones",colleges:["Alabama"],teams:["Atlanta Falcons","Tennessee Titans","Tampa Bay Buccaneers"]},
  {name:"Calvin Ridley",colleges:["Alabama"],teams:["Atlanta Falcons","Jacksonville Jaguars","Tennessee Titans"]},
  {name:"Jerry Jeudy",colleges:["Alabama"],teams:["Denver Broncos","Cleveland Browns"]},
  {name:"JuJu Smith-Schuster",colleges:["USC"],teams:["Pittsburgh Steelers","Kansas City Chiefs","New England Patriots"]},
  {name:"A.J. Green",colleges:["Georgia"],teams:["Cincinnati Bengals","Arizona Cardinals"]},
  {name:"Brandon Marshall",colleges:["UCF"],teams:["Denver Broncos","Miami Dolphins","Chicago Bears","New York Jets","New York Giants"]},
  {name:"Hakeem Nicks",colleges:["North Carolina"],teams:["New York Giants","Indianapolis Colts","Tennessee Titans"]},
  {name:"Golden Tate",colleges:["Notre Dame"],teams:["Seattle Seahawks","Detroit Lions","Philadelphia Eagles","New York Giants"]},
  {name:"Tyler Lockett",colleges:["Kansas State"],teams:["Seattle Seahawks"]},
  {name:"Doug Baldwin",colleges:["Stanford"],teams:["Seattle Seahawks"]},
  {name:"Greg Jennings",colleges:["Western Michigan"],teams:["Green Bay Packers","Minnesota Vikings","Miami Dolphins"]},
  {name:"Jordy Nelson",colleges:["Kansas State"],teams:["Green Bay Packers"]},
  {name:"Randall Cobb",colleges:["Kentucky"],teams:["Green Bay Packers","Dallas Cowboys","Houston Texans","New York Giants"]},
  {name:"Emmanuel Sanders",colleges:["SMU"],teams:["Pittsburgh Steelers","Denver Broncos","San Francisco 49ers","New Orleans Saints","Buffalo Bills"]},
  {name:"Demaryius Thomas",colleges:["Georgia Tech"],teams:["Denver Broncos","Houston Texans","New York Jets","New England Patriots"]},
  {name:"Michael Crabtree",colleges:["Texas Tech"],teams:["San Francisco 49ers","Baltimore Ravens","Arizona Cardinals"]},
  {name:"Robert Woods",colleges:["USC"],teams:["Buffalo Bills","Los Angeles Rams","Tennessee Titans"]},
  {name:"Brandin Cooks",colleges:["Oregon State"],teams:["New Orleans Saints","New England Patriots","Los Angeles Rams","Houston Texans","Dallas Cowboys"]},
  {name:"Tyler Boyd",colleges:["Pittsburgh"],teams:["Cincinnati Bengals","Tennessee Titans"]},
  {name:"Diontae Johnson",colleges:["Toledo"],teams:["Pittsburgh Steelers","Carolina Panthers","Baltimore Ravens"]},
  {name:"Chris Godwin",colleges:["Penn State"],teams:["Tampa Bay Buccaneers"]},
  {name:"Allen Robinson",colleges:["Penn State"],teams:["Jacksonville Jaguars","Chicago Bears","Los Angeles Rams"]},
  {name:"Alshon Jeffery",colleges:["South Carolina"],teams:["Chicago Bears","Philadelphia Eagles"]},
  {name:"Michael Thomas",colleges:["Ohio State"],teams:["New Orleans Saints"]},
  {name:"Adam Thielen",colleges:["Minnesota State-Mankato"],teams:["Minnesota Vikings","Carolina Panthers"]},
  {name:"Jarvis Landry",colleges:["LSU"],teams:["Miami Dolphins","Cleveland Browns","New Orleans Saints"]},
  {name:"Marques Colston",colleges:["Hofstra"],teams:["New Orleans Saints"]},
  {name:"T.Y. Hilton",colleges:["FIU"],teams:["Indianapolis Colts","Dallas Cowboys"]},
  {name:"Marqise Lee",colleges:["USC"],teams:["Jacksonville Jaguars","New England Patriots"]},
  {name:"Sammy Watkins",colleges:["Clemson"],teams:["Buffalo Bills","Los Angeles Rams","Kansas City Chiefs","Baltimore Ravens"]},
  {name:"Nelson Agholor",colleges:["USC"],teams:["Philadelphia Eagles","Las Vegas Raiders","New England Patriots","Baltimore Ravens"]},
  {name:"Will Fuller",colleges:["Notre Dame"],teams:["Houston Texans","Miami Dolphins"]},
  {name:"Mecole Hardman",colleges:["Georgia"],teams:["Kansas City Chiefs","New York Jets"]},
  {name:"Rashod Bateman",colleges:["Minnesota"],teams:["Baltimore Ravens"]},
  {name:"Elijah Moore",colleges:["Ole Miss"],teams:["New York Jets","Cleveland Browns"]},
  {name:"Jaylen Waddle",colleges:["Alabama"],teams:["Miami Dolphins"]},
  {name:"Treylon Burks",colleges:["Arkansas"],teams:["Tennessee Titans"]},
  {name:"Christian Watson",colleges:["North Dakota State"],teams:["Green Bay Packers"]},
  {name:"Jaxon Smith-Njigba",colleges:["Ohio State"],teams:["Seattle Seahawks"]},
  {name:"Zay Flowers",colleges:["Boston College"],teams:["Baltimore Ravens"]},
  {name:"Tank Dell",colleges:["Houston"],teams:["Houston Texans"]},
  {name:"Quentin Johnston",colleges:["TCU"],teams:["Los Angeles Chargers"]},
  {name:"Josh Downs",colleges:["North Carolina"],teams:["Indianapolis Colts"]},
  {name:"Dallas Clark",colleges:["Iowa"],teams:["Indianapolis Colts","Tampa Bay Buccaneers","Baltimore Ravens"]},
  {name:"Shannon Sharpe",colleges:["Savannah State"],teams:["Denver Broncos","Baltimore Ravens"]},
  {name:"Heath Miller",colleges:["Virginia"],teams:["Pittsburgh Steelers"]},
  {name:"Jeremy Shockey",colleges:["Miami (FL)"],teams:["New York Giants","New Orleans Saints","Carolina Panthers"]},
  {name:"Kellen Winslow Jr.",colleges:["Miami (FL)"],teams:["Cleveland Browns","Tampa Bay Buccaneers","Seattle Seahawks","New York Jets"]},
  {name:"Martellus Bennett",colleges:["Texas A&M"],teams:["Dallas Cowboys","New York Giants","Chicago Bears","New England Patriots","Green Bay Packers"]},
  {name:"Greg Olsen",colleges:["Miami (FL)"],teams:["Chicago Bears","Carolina Panthers","Seattle Seahawks"]},
  {name:"Vernon Davis",colleges:["Maryland"],teams:["San Francisco 49ers","Denver Broncos","Philadelphia Eagles"]},
  {name:"Owen Daniels",colleges:["Wisconsin"],teams:["Houston Texans","Baltimore Ravens","Denver Broncos"]},
  {name:"Julius Thomas",colleges:["Portland State"],teams:["Denver Broncos","Jacksonville Jaguars","Miami Dolphins"]},
  {name:"Jordan Reed",colleges:["Florida"],teams:["San Francisco 49ers"]},
  {name:"Eric Ebron",colleges:["North Carolina"],teams:["Detroit Lions","Indianapolis Colts","Pittsburgh Steelers"]},
  {name:"Zach Ertz",colleges:["Stanford"],teams:["Philadelphia Eagles","Arizona Cardinals"]},
  {name:"Evan Engram",colleges:["Ole Miss"],teams:["New York Giants","Jacksonville Jaguars","Denver Broncos"]},
  {name:"Hunter Henry",colleges:["Arkansas"],teams:["Los Angeles Chargers","New England Patriots"]},
  {name:"T.J. Hockenson",colleges:["Iowa"],teams:["Detroit Lions","Minnesota Vikings"]},
  {name:"Pat Freiermuth",colleges:["Penn State"],teams:["Pittsburgh Steelers"]},
  {name:"Cole Kmet",colleges:["Notre Dame"],teams:["Chicago Bears"]},
  {name:"Sam LaPorta",colleges:["Iowa"],teams:["Detroit Lions"]},
  {name:"Dalton Kincaid",colleges:["Utah"],teams:["Buffalo Bills"]},
  {name:"Cade Otton",colleges:["Washington"],teams:["Tampa Bay Buccaneers"]},
  {name:"Trent Williams",colleges:["Oklahoma"],teams:["San Francisco 49ers"]},
  {name:"Terron Armstead",colleges:["Arkansas-Pine Bluff"],teams:["New Orleans Saints","Miami Dolphins"]},
  {name:"Lane Johnson",colleges:["Oklahoma"],teams:["Philadelphia Eagles"]},
  {name:"Tyron Smith",colleges:["USC"],teams:["Dallas Cowboys","New York Jets"]},
  {name:"Andrew Whitworth",colleges:["LSU"],teams:["Cincinnati Bengals","Los Angeles Rams"]},
  {name:"Joe Thomas",colleges:["Wisconsin"],teams:["Cleveland Browns"]},
  {name:"Quenton Nelson",colleges:["Notre Dame"],teams:["Indianapolis Colts"]},
  {name:"Zack Martin",colleges:["Notre Dame"],teams:["Dallas Cowboys"]},
  {name:"Jason Peters",colleges:["Arkansas"],teams:["Buffalo Bills","Philadelphia Eagles"]},
  {name:"Luke Kuechly",colleges:["Boston College"],teams:["Carolina Panthers"]},
  {name:"Patrick Willis",colleges:["Ole Miss"],teams:["San Francisco 49ers"]},
  {name:"NaVorro Bowman",colleges:["Penn State"],teams:["San Francisco 49ers"]},
  {name:"Bobby Wagner",colleges:["Utah State"],teams:["Seattle Seahawks","Los Angeles Rams","Las Vegas Raiders"]},
  {name:"Lavonte David",colleges:["Nebraska"],teams:["Tampa Bay Buccaneers"]},
  {name:"Deion Jones",colleges:["LSU"],teams:["Atlanta Falcons","Cleveland Browns","Carolina Panthers"]},
  {name:"Shaquil Barrett",colleges:["Colorado State"],teams:["Denver Broncos","Tampa Bay Buccaneers"]},
  {name:"Derrick Brooks",colleges:["Florida State"],teams:["Tampa Bay Buccaneers"]},
  {name:"Tedy Bruschi",colleges:["Arizona"],teams:["New England Patriots"]},
  {name:"Zach Thomas",colleges:["Texas Tech"],teams:["Miami Dolphins","Dallas Cowboys","Kansas City Chiefs"]},
  {name:"James Harrison",colleges:["Kent State"],teams:["Pittsburgh Steelers","Cincinnati Bengals"]},
  {name:"LaMarr Woodley",colleges:["Michigan"],teams:["Pittsburgh Steelers"]},
  {name:"DeMarcus Ware",colleges:["Troy"],teams:["Dallas Cowboys","Denver Broncos"]},
  {name:"Landon Collins",colleges:["Alabama"],teams:["New York Giants","Atlanta Falcons"]},
  {name:"Jeremiah Owusu-Koramoah",colleges:["Notre Dame"],teams:["Cleveland Browns"]},
  {name:"Roquan Smith",colleges:["Georgia"],teams:["Chicago Bears","Baltimore Ravens"]},
  {name:"Foye Oluokun",colleges:["Yale"],teams:["Atlanta Falcons","Jacksonville Jaguars"]},
  {name:"Eric Kendricks",colleges:["UCLA"],teams:["Minnesota Vikings","Los Angeles Chargers"]},
  {name:"Michael Strahan",colleges:["Texas Southern"],teams:["New York Giants"]},
  {name:"Dwight Freeney",colleges:["Syracuse"],teams:["Indianapolis Colts","Arizona Cardinals","Atlanta Falcons","Seattle Seahawks","Detroit Lions"]},
  {name:"Julius Peppers",colleges:["North Carolina"],teams:["Carolina Panthers","Chicago Bears","Green Bay Packers"]},
  {name:"Osi Umenyiora",colleges:["Troy"],teams:["New York Giants","Atlanta Falcons"]},
  {name:"Robert Mathis",colleges:["Alabama A&M"],teams:["Indianapolis Colts"]},
  {name:"John Abraham",colleges:["South Carolina"],teams:["New York Jets","Atlanta Falcons","Arizona Cardinals"]},
  {name:"Mario Williams",colleges:["NC State"],teams:["Houston Texans","Buffalo Bills","Miami Dolphins"]},
  {name:"Joey Bosa",colleges:["Ohio State"],teams:["Los Angeles Chargers","Buffalo Bills"]},
  {name:"Nick Bosa",colleges:["Ohio State"],teams:["San Francisco 49ers"]},
  {name:"Maxx Crosby",colleges:["Eastern Michigan"],teams:["Las Vegas Raiders"]},
  {name:"Aidan Hutchinson",colleges:["Michigan"],teams:["Detroit Lions"]},
  {name:"Will Anderson Jr.",colleges:["Alabama"],teams:["Houston Texans"]},
  {name:"Rashan Gary",colleges:["Michigan"],teams:["Green Bay Packers"]},
  {name:"Brian Burns",colleges:["Florida State"],teams:["Carolina Panthers","New York Giants"]},
  {name:"Haason Reddick",colleges:["Temple"],teams:["Arizona Cardinals","Carolina Panthers","Philadelphia Eagles","New York Jets"]},
  {name:"Leonard Williams",colleges:["USC"],teams:["New York Jets","New York Giants","Seattle Seahawks"]},
  {name:"Fletcher Cox",colleges:["Mississippi State"],teams:["Philadelphia Eagles"]},
  {name:"Grady Jarrett",colleges:["Clemson"],teams:["Atlanta Falcons"]},
  {name:"Cameron Jordan",colleges:["California"],teams:["New Orleans Saints"]},
  {name:"Daron Payne",colleges:["Alabama"],teams:["Washington Commanders"]},
  {name:"Dexter Lawrence",colleges:["Clemson"],teams:["New York Giants"]},
  {name:"Chris Jones",colleges:["Mississippi State"],teams:["Kansas City Chiefs"]},
  {name:"Quinnen Williams",colleges:["Alabama"],teams:["New York Jets","Dallas Cowboys"]},
  {name:"Warren Sapp",colleges:["Miami (FL)"],teams:["Tampa Bay Buccaneers"]},
  {name:"Vince Wilfork",colleges:["Miami (FL)"],teams:["New England Patriots","Houston Texans"]},
  {name:"Ndamukong Suh",colleges:["Nebraska"],teams:["Detroit Lions","Miami Dolphins","Los Angeles Rams","Tampa Bay Buccaneers"]},
  {name:"Haloti Ngata",colleges:["Oregon"],teams:["Baltimore Ravens","Detroit Lions","Philadelphia Eagles"]},
  {name:"Gerald McCoy",colleges:["Oklahoma"],teams:["Tampa Bay Buccaneers","Carolina Panthers"]},
  {name:"Darrelle Revis",colleges:["Pittsburgh"],teams:["New York Jets","Tampa Bay Buccaneers","New England Patriots","Pittsburgh Steelers","Kansas City Chiefs"]},
  {name:"Nnamdi Asomugha",colleges:["California"],teams:["Philadelphia Eagles","San Francisco 49ers","New York Jets"]},
  {name:"Champ Bailey",colleges:["Georgia"],teams:["Denver Broncos"]},
  {name:"Asante Samuel",colleges:["Central Florida"],teams:["New England Patriots","Philadelphia Eagles","Atlanta Falcons"]},
  {name:"Ty Law",colleges:["Michigan"],teams:["New England Patriots","New York Jets","Denver Broncos","Kansas City Chiefs"]},
  {name:"Aqib Talib",colleges:["Kansas"],teams:["Tampa Bay Buccaneers","New England Patriots","Denver Broncos","Los Angeles Rams"]},
  {name:"Joe Haden",colleges:["Florida"],teams:["Cleveland Browns","Pittsburgh Steelers"]},
  {name:"Stephon Gilmore",colleges:["South Carolina"],teams:["Buffalo Bills","New England Patriots","Carolina Panthers","Indianapolis Colts","Dallas Cowboys"]},
  {name:"Marshon Lattimore",colleges:["Ohio State"],teams:["New Orleans Saints"]},
  {name:"Xavien Howard",colleges:["Baylor"],teams:["Miami Dolphins"]},
  {name:"Jaire Alexander",colleges:["Louisville"],teams:["Green Bay Packers"]},
  {name:"Denzel Ward",colleges:["Ohio State"],teams:["Cleveland Browns"]},
  {name:"Patrick Surtain II",colleges:["Alabama"],teams:["Denver Broncos"]},
  {name:"Derek Stingley Jr.",colleges:["LSU"],teams:["Houston Texans"]},
  {name:"Marlon Humphrey",colleges:["Alabama"],teams:["Baltimore Ravens"]},
  {name:"Darius Slay",colleges:["Mississippi State"],teams:["Detroit Lions","Philadelphia Eagles"]},
  {name:"Byron Jones",colleges:["Connecticut"],teams:["Dallas Cowboys","Miami Dolphins"]},
  {name:"Bryce Young",colleges:["Alabama"],teams:["Carolina Panthers"]},
  {name:"Devon Witherspoon",colleges:["Illinois"],teams:["Seattle Seahawks"]},
  {name:"Christian Gonzalez",colleges:["Oregon"],teams:["New England Patriots"]},
  {name:"Ed Reed",colleges:["Miami (FL)"],teams:["Baltimore Ravens","Houston Texans","New York Jets"]},
  {name:"Brian Dawkins",colleges:["Clemson"],teams:["Philadelphia Eagles","Denver Broncos"]},
  {name:"Ronnie Lott",colleges:["USC"],teams:["San Francisco 49ers","New York Jets","Kansas City Chiefs"]},
  {name:"Bob Sanders",colleges:["Iowa"],teams:["Indianapolis Colts"]},
  {name:"John Lynch",colleges:["Stanford"],teams:["Tampa Bay Buccaneers","Denver Broncos"]},
  {name:"Adrian Wilson",colleges:["NC State"],teams:["Arizona Cardinals"]},
  {name:"Harrison Smith",colleges:["Notre Dame"],teams:["Minnesota Vikings"]},
  {name:"Justin Simmons",colleges:["Boston College"],teams:["Denver Broncos","Atlanta Falcons"]},
  {name:"Kevin Byard",colleges:["Middle Tennessee State"],teams:["Tennessee Titans","Philadelphia Eagles","Chicago Bears"]},
  {name:"Jordan Poyer",colleges:["Oregon State"],teams:["Buffalo Bills","Miami Dolphins"]},
  {name:"Micah Hyde",colleges:["Iowa"],teams:["Green Bay Packers","Buffalo Bills"]},
  {name:"Tyrann Mathieu",colleges:["LSU"],teams:["Arizona Cardinals","Houston Texans","Kansas City Chiefs","New Orleans Saints","New England Patriots"]},
  {name:"Derwin James",colleges:["Florida State"],teams:["Los Angeles Chargers"]},
  {name:"Kyle Hamilton",colleges:["Notre Dame"],teams:["Baltimore Ravens"]},
  {name:"Jordan Love",colleges:["Utah State"],teams:["Green Bay Packers"]},
  {name:"Sam Howell",colleges:["North Carolina"],teams:["Washington Commanders"]},
  {name:"Hendon Hooker",colleges:["Virginia Tech","Tennessee"],teams:["Detroit Lions"]},
  {name:"Anthony Richardson",colleges:["Florida"],teams:["Indianapolis Colts"]},
  {name:"Will Levis",colleges:["Kentucky","Penn State"],teams:["Tennessee Titans"]},
  {name:"Aidan O'Connell",colleges:["Purdue"],teams:["Las Vegas Raiders"]},
  {name:"Tommy DeVito",colleges:["Illinois","Syracuse"],teams:["New York Giants"]},
  {name:"Tyler Huntley",colleges:["Utah"],teams:["Baltimore Ravens","Miami Dolphins"]},
  {name:"Josh Dobbs",colleges:["Tennessee"],teams:["Pittsburgh Steelers","Cleveland Browns","Arizona Cardinals","Minnesota Vikings"]},
  {name:"Ryan Mallett",colleges:["Arkansas","Michigan"],teams:["New England Patriots","Houston Texans","Baltimore Ravens"]},
  {name:"Christian Ponder",colleges:["Florida State"],teams:["Minnesota Vikings"]},
  {name:"EJ Manuel",colleges:["Florida State"],teams:["Buffalo Bills"]},
  {name:"Chad Henne",colleges:["Michigan"],teams:["Miami Dolphins","Jacksonville Jaguars","Kansas City Chiefs"]},
  {name:"Colt McCoy",colleges:["Texas"],teams:["Cleveland Browns","San Francisco 49ers","New York Giants","Arizona Cardinals"]},
  {name:"Cordarrelle Patterson",colleges:["Tennessee"],teams:["Minnesota Vikings","New England Patriots","Chicago Bears","Atlanta Falcons"]},
  {name:"Chris Carson",colleges:["Oklahoma State"],teams:["Seattle Seahawks"]},
  {name:"Sony Michel",colleges:["Georgia"],teams:["New England Patriots","Los Angeles Rams","Miami Dolphins"]},
  {name:"Rex Burkhead",colleges:["Nebraska"],teams:["Cincinnati Bengals","New England Patriots","Houston Texans"]},
  {name:"Damien Harris",colleges:["Alabama"],teams:["New England Patriots","Buffalo Bills"]},
  {name:"Khalil Herbert",colleges:["Virginia Tech"],teams:["Chicago Bears"]},
  {name:"Elijah Mitchell",colleges:["Louisiana"],teams:["San Francisco 49ers"]},
  {name:"Damien Williams",colleges:["Oklahoma"],teams:["Miami Dolphins","Kansas City Chiefs","Chicago Bears","Atlanta Falcons"]},
  {name:"Latavius Murray",colleges:["UCF"],teams:["Minnesota Vikings","New Orleans Saints","Baltimore Ravens","Denver Broncos"]},
  {name:"Giovani Bernard",colleges:["North Carolina"],teams:["Cincinnati Bengals","Tampa Bay Buccaneers"]},
  {name:"Mark Ingram",colleges:["Alabama"],teams:["New Orleans Saints","Baltimore Ravens","Houston Texans"]},
  {name:"Lamar Miller",colleges:["Miami (FL)"],teams:["Miami Dolphins","Houston Texans"]},
  {name:"C.J. Anderson",colleges:["California"],teams:["Denver Broncos","Carolina Panthers","Los Angeles Rams"]},
  {name:"Andre Ellington",colleges:["Clemson"],teams:["Arizona Cardinals","Houston Texans"]},
  {name:"Doug Martin",colleges:["Boise State"],teams:["Tampa Bay Buccaneers"]},
  {name:"BenJarvus Green-Ellis",colleges:["Ole Miss"],teams:["New England Patriots","Cincinnati Bengals"]},
  {name:"Ryan Grant",colleges:["Notre Dame","Tulane"],teams:["New York Giants","Green Bay Packers","Indianapolis Colts"]},
  {name:"Darren Sproles",colleges:["Kansas State"],teams:["New Orleans Saints","Philadelphia Eagles"]},
  {name:"Danny Woodhead",colleges:["Chadron State"],teams:["New England Patriots","Baltimore Ravens"]},
  {name:"Michael Turner",colleges:["Northern Illinois"],teams:["Atlanta Falcons"]},
  {name:"Rashard Mendenhall",colleges:["Illinois"],teams:["Pittsburgh Steelers","Arizona Cardinals"]},
  {name:"Ryan Mathews",colleges:["Fresno State"],teams:["Philadelphia Eagles"]},
  {name:"Beanie Wells",colleges:["Ohio State"],teams:["Arizona Cardinals"]},
  {name:"Pierre Thomas",colleges:["Illinois"],teams:["New Orleans Saints","San Francisco 49ers"]},
  {name:"Sterling Shepard",colleges:["Oklahoma"],teams:["New York Giants","Tampa Bay Buccaneers"]},
  {name:"Corey Davis",colleges:["Western Michigan"],teams:["Tennessee Titans","New York Jets"]},
  {name:"Josh Reynolds",colleges:["Texas A&M"],teams:["Los Angeles Rams","Tennessee Titans","Detroit Lions"]},
  {name:"Darius Slayton",colleges:["Auburn"],teams:["New York Giants"]},
  {name:"Kendall Wright",colleges:["Baylor"],teams:["Tennessee Titans","Chicago Bears","Minnesota Vikings"]},
  {name:"Harry Douglas",colleges:["Louisville"],teams:["Atlanta Falcons","Tennessee Titans"]},
  {name:"Kevin White",colleges:["West Virginia"],teams:["Chicago Bears"]},
  {name:"Breshad Perriman",colleges:["UCF"],teams:["Baltimore Ravens","Cleveland Browns","Tampa Bay Buccaneers","New York Jets"]},
  {name:"Mike Williams",colleges:["Clemson"],teams:["Los Angeles Chargers","New York Jets"]},
  {name:"N'Keal Harry",colleges:["Arizona State"],teams:["New England Patriots","Chicago Bears"]},
  {name:"Van Jefferson",colleges:["Florida"],teams:["Los Angeles Rams"]},
  {name:"Kadarius Toney",colleges:["Florida"],teams:["New York Giants","Kansas City Chiefs"]},
  {name:"Rondale Moore",colleges:["Purdue"],teams:["Arizona Cardinals","Atlanta Falcons"]},
  {name:"Amon-Ra St. Brown",colleges:["USC"],teams:["Detroit Lions"]},
  {name:"Romeo Doubs",colleges:["Nevada"],teams:["Green Bay Packers"]},
  {name:"Jayden Reed",colleges:["Michigan State"],teams:["Green Bay Packers"]},
  {name:"George Pickens",colleges:["Georgia"],teams:["Pittsburgh Steelers","Dallas Cowboys"]},
  {name:"Drake London",colleges:["USC"],teams:["Atlanta Falcons"]},
  {name:"Wan'Dale Robinson",colleges:["Nebraska","Kentucky"],teams:["New York Giants"]},
  {name:"Tyler Higbee",colleges:["Western Kentucky"],teams:["Los Angeles Rams"]},
  {name:"Gerald Everett",colleges:["South Alabama"],teams:["Los Angeles Rams","Seattle Seahawks","Los Angeles Chargers"]},
  {name:"Noah Fant",colleges:["Iowa"],teams:["Denver Broncos","Seattle Seahawks"]},
  {name:"Jonnu Smith",colleges:["Florida International"],teams:["Tennessee Titans","New England Patriots","Atlanta Falcons","Pittsburgh Steelers","Miami Dolphins"]},
  {name:"Taysom Hill",colleges:["BYU"],teams:["New Orleans Saints"]},
  {name:"Mo Alie-Cox",colleges:["VCU"],teams:["Indianapolis Colts"]},
  {name:"Blake Jarwin",colleges:["Oklahoma State"],teams:["Dallas Cowboys"]},
  {name:"Dawson Knox",colleges:["Ole Miss"],teams:["Buffalo Bills"]},
  {name:"Tyler Conklin",colleges:["Central Michigan"],teams:["Minnesota Vikings","New York Jets"]},
  {name:"David Njoku",colleges:["Miami (FL)"],teams:["Cleveland Browns"]},
  {name:"Irv Smith Jr.",colleges:["Alabama"],teams:["Minnesota Vikings","Cincinnati Bengals"]},
  {name:"Will Dissly",colleges:["Washington"],teams:["Seattle Seahawks"]},
  {name:"Demarcus Lawrence",colleges:["Boise State"],teams:["Dallas Cowboys"]},
  {name:"Randy Gregory",colleges:["Nebraska"],teams:["Dallas Cowboys","Denver Broncos"]},
  {name:"Za'Darius Smith",colleges:["Kentucky"],teams:["Baltimore Ravens","Green Bay Packers","Minnesota Vikings","Philadelphia Eagles"]},
  {name:"Preston Smith",colleges:["Mississippi State"],teams:["Green Bay Packers","Pittsburgh Steelers"]},
  {name:"Alex Highsmith",colleges:["Charlotte"],teams:["Pittsburgh Steelers"]},
  {name:"Carl Lawson",colleges:["Auburn"],teams:["Cincinnati Bengals","New York Jets"]},
  {name:"Yannick Ngakoue",colleges:["Maryland"],teams:["Jacksonville Jaguars","Minnesota Vikings","Baltimore Ravens","Las Vegas Raiders","Indianapolis Colts","Chicago Bears"]},
  {name:"Marcus Davenport",colleges:["UTSA"],teams:["New Orleans Saints","Minnesota Vikings"]},
  {name:"Montez Sweat",colleges:["Mississippi State"],teams:["Washington Commanders","Chicago Bears"]},
  {name:"Travon Walker",colleges:["Georgia"],teams:["Jacksonville Jaguars"]},
  {name:"Kayvon Thibodeaux",colleges:["Oregon"],teams:["New York Giants"]},
  {name:"Jadeveon Clowney",colleges:["South Carolina"],teams:["Houston Texans","Seattle Seahawks","Tennessee Titans","Cleveland Browns","Baltimore Ravens","Carolina Panthers","Dallas Cowboys"]},
  {name:"Marshawn Lloyd",colleges:["South Carolina","USC"],teams:["Green Bay Packers"]},
  {name:"Chandler Jones",colleges:["Syracuse"],teams:["New England Patriots","Arizona Cardinals","Las Vegas Raiders"]},
  {name:"Robert Quinn",colleges:["North Carolina"],teams:["Los Angeles Rams","Miami Dolphins","Dallas Cowboys","Chicago Bears","Philadelphia Eagles"]},
  {name:"Danielle Hunter",colleges:["LSU"],teams:["Minnesota Vikings","Houston Texans"]},
  {name:"Trey Hendrickson",colleges:["Florida Atlantic"],teams:["New Orleans Saints","Cincinnati Bengals"]},
  {name:"Justin Houston",colleges:["Georgia"],teams:["Kansas City Chiefs","Indianapolis Colts","Baltimore Ravens"]},
  {name:"George Karlaftis",colleges:["Purdue"],teams:["Kansas City Chiefs"]},
  {name:"Malcolm Butler",colleges:["West Alabama"],teams:["New England Patriots","Tennessee Titans"]},
  {name:"Chris Harris Jr.",colleges:["Kansas"],teams:["Denver Broncos","Los Angeles Chargers"]},
  {name:"Marcus Peters",colleges:["Washington"],teams:["Kansas City Chiefs","Los Angeles Rams","Baltimore Ravens"]},
  {name:"Josh Norman",colleges:["Coastal Carolina"],teams:["Carolina Panthers","Buffalo Bills","San Francisco 49ers","Jacksonville Jaguars"]},
  {name:"Brandon Browner",colleges:["Oregon State"],teams:["Seattle Seahawks","New England Patriots","New Orleans Saints"]},
  {name:"Deangelo Hall",colleges:["Virginia Tech"],teams:["Atlanta Falcons"]},
  {name:"Kendall Fuller",colleges:["Virginia Tech"],teams:["Kansas City Chiefs"]},
  {name:"Eli Apple",colleges:["Ohio State"],teams:["New York Giants","New Orleans Saints","Carolina Panthers"]},
  {name:"Adoree' Jackson",colleges:["USC"],teams:["Tennessee Titans","New York Giants"]},
  {name:"Tre'Davious White",colleges:["LSU"],teams:["Buffalo Bills"]},
  {name:"Terence Newman",colleges:["Kansas State"],teams:["Dallas Cowboys","Cincinnati Bengals","Minnesota Vikings"]},
  {name:"Quandre Diggs",colleges:["Texas"],teams:["Detroit Lions","Seattle Seahawks"]},
  {name:"Jessie Bates III",colleges:["Wake Forest"],teams:["Cincinnati Bengals","Atlanta Falcons"]},
  {name:"Marcus Williams",colleges:["Utah"],teams:["New Orleans Saints","Baltimore Ravens"]},
  {name:"Minkah Fitzpatrick",colleges:["Alabama"],teams:["Miami Dolphins","Pittsburgh Steelers"]},
  {name:"Jamal Adams",colleges:["LSU"],teams:["New York Jets","Seattle Seahawks","Tennessee Titans","Las Vegas Raiders"]},
  {name:"Bernard Pollard",colleges:["Purdue"],teams:["Kansas City Chiefs","Houston Texans","Baltimore Ravens","Tennessee Titans"]},
  {name:"Eric Berry",colleges:["Tennessee"],teams:["Kansas City Chiefs"]},
  {name:"Kam Chancellor",colleges:["Virginia Tech"],teams:["Seattle Seahawks"]},
  {name:"Reshad Jones",colleges:["Georgia"],teams:["Miami Dolphins"]},
  {name:"Earl Thomas",colleges:["Texas"],teams:["Seattle Seahawks","Baltimore Ravens"]},
  {name:"Randall Cunningham",colleges:["UNLV"],teams:["Philadelphia Eagles","Minnesota Vikings","Dallas Cowboys","Baltimore Ravens"]},
  {name:"Warren Moon",colleges:["Washington"],teams:["Minnesota Vikings","Seattle Seahawks","Kansas City Chiefs"]},
  {name:"Drew Bledsoe",colleges:["Washington State"],teams:["New England Patriots","Buffalo Bills","Dallas Cowboys"]},
  {name:"Donovan McNabb",colleges:["Syracuse"],teams:["Philadelphia Eagles","Minnesota Vikings"]},
  {name:"Daunte Culpepper",colleges:["UCF"],teams:["Minnesota Vikings","Miami Dolphins","Detroit Lions"]},
  {name:"Tarvaris Jackson",colleges:["Alabama State","Iowa State"],teams:["Minnesota Vikings","Seattle Seahawks","Buffalo Bills"]},
  {name:"Terrell Davis",colleges:["Georgia"],teams:["Denver Broncos"]},
  {name:"Jerome Bettis",colleges:["Notre Dame"],teams:["Los Angeles Rams","Pittsburgh Steelers"]},
  {name:"Ricky Williams",colleges:["Texas"],teams:["New Orleans Saints","Miami Dolphins","Baltimore Ravens"]},
  {name:"Corey Dillon",colleges:["Washington"],teams:["Cincinnati Bengals","New England Patriots"]},
  {name:"Priest Holmes",colleges:["Texas"],teams:["Baltimore Ravens","Kansas City Chiefs"]},
  {name:"Tiki Barber",colleges:["Virginia"],teams:["New York Giants"]},
  {name:"Earl Campbell",colleges:["Texas"],teams:["New Orleans Saints"]},
  {name:"John Riggins",colleges:["Kansas"],teams:["New York Jets"]},
  {name:"Franco Harris",colleges:["Penn State"],teams:["Pittsburgh Steelers","Seattle Seahawks"]},
  {name:"Marion Barber",colleges:["Minnesota"],teams:["Dallas Cowboys","Chicago Bears"]},
  {name:"Kevin Smith",colleges:["UCF"],teams:["Detroit Lions"]},
  {name:"Cadillac Williams",colleges:["Auburn"],teams:["Tampa Bay Buccaneers"]},
  {name:"Carnell Williams",colleges:["Auburn"],teams:["Tampa Bay Buccaneers"]},
  {name:"Michael Bush",colleges:["Louisville"],teams:["Chicago Bears"]},
  {name:"Jonathan Stewart",colleges:["Oregon"],teams:["Carolina Panthers","New York Giants"]},
  {name:"Anquan Boldin",colleges:["Florida State"],teams:["Arizona Cardinals","Baltimore Ravens","San Francisco 49ers","Detroit Lions","Buffalo Bills"]},
  {name:"Tim Brown",colleges:["Notre Dame"],teams:["Tampa Bay Buccaneers"]},
  {name:"Michael Irvin",colleges:["Miami (FL)"],teams:["Dallas Cowboys"]},
  {name:"Cris Carter",colleges:["Ohio State"],teams:["Philadelphia Eagles","Minnesota Vikings","Miami Dolphins"]},
  {name:"Ben Watson",colleges:["Georgia"],teams:["New England Patriots","Cleveland Browns","New Orleans Saints","Baltimore Ravens"]},
  {name:"Alge Crumpler",colleges:["North Carolina"],teams:["Atlanta Falcons","Tennessee Titans","New England Patriots"]},
  {name:"L.J. Smith",colleges:["Rutgers"],teams:["Philadelphia Eagles","Baltimore Ravens"]},
  {name:"Richard Seymour",colleges:["Georgia"],teams:["New England Patriots"]},
  {name:"Ronde Barber",colleges:["Virginia"],teams:["Tampa Bay Buccaneers"]},
  {name:"Antrel Rolle",colleges:["Miami (FL)"],teams:["Arizona Cardinals","New York Giants","Chicago Bears"]},
  {name:"Rashean Mathis",colleges:["Bethune-Cookman"],teams:["Jacksonville Jaguars","Detroit Lions"]},
  {name:"Lito Sheppard",colleges:["Florida"],teams:["Philadelphia Eagles","New York Jets"]},
  {name:"Bijan Robinson",colleges:["Texas"],teams:["Atlanta Falcons"]},
  {name:"Jahmyr Gibbs",colleges:["Georgia Tech","Alabama"],teams:["Detroit Lions"]},
  {name:"Jaylen Wright",colleges:["Tennessee"],teams:["Miami Dolphins"]},
  {name:"Rome Odunze",colleges:["Washington"],teams:["Chicago Bears"]},
  {name:"Malik Nabers",colleges:["LSU"],teams:["New York Giants"]},
  {name:"Brian Thomas Jr.",colleges:["LSU"],teams:["Jacksonville Jaguars"]},
  {name:"Ladd McConkey",colleges:["Georgia"],teams:["Los Angeles Chargers"]},
  {name:"Xavier Worthy",colleges:["Texas"],teams:["Kansas City Chiefs"]},
  {name:"Keon Coleman",colleges:["Michigan State","Florida State"],teams:["Buffalo Bills"]},
  {name:"Ja'Lynn Polk",colleges:["Washington"],teams:["New England Patriots"]},
  {name:"Trey McBride",colleges:["Colorado State"],teams:["Arizona Cardinals"]},
  {name:"Brock Bowers",colleges:["Georgia"],teams:["Las Vegas Raiders"]},
  {name:"Laiatu Latu",colleges:["UCLA","Idaho"],teams:["Indianapolis Colts"]},
  {name:"Jared Verse",colleges:["Florida State","Albany"],teams:["Los Angeles Rams"]},
  {name:"Dallas Turner",colleges:["Alabama"],teams:["Minnesota Vikings"]},
  {name:"Byron Murphy II",colleges:["Texas"],teams:["Minnesota Vikings"]},
  {name:"Nate Wiggins",colleges:["Clemson"],teams:["Baltimore Ravens"]},
  {name:"Quinyon Mitchell",colleges:["Toledo"],teams:["Philadelphia Eagles"]},
  {name:"Terrion Arnold",colleges:["Alabama"],teams:["Detroit Lions"]},
  {name:"Kamren Kinchens",colleges:["Miami (FL)"],teams:["Miami Dolphins"]},
  {name:"Steve McNair",colleges:["Alcorn State"],teams:["Tennessee Titans","Baltimore Ravens"]},
  {name:"Spencer Rattler",colleges:["Oklahoma","South Carolina"],teams:["New Orleans Saints"]},
  {name:"James Cook",colleges:["Georgia"],teams:["Buffalo Bills"]},
  {name:"Kyren Williams",colleges:["Notre Dame"],teams:["Los Angeles Rams"]},
  {name:"Chase Brown",colleges:["Illinois"],teams:["Cincinnati Bengals"]},
  {name:"Chuba Hubbard",colleges:["Oklahoma State"],teams:["Carolina Panthers"]},
  {name:"Isiah Pacheco",colleges:["Rutgers"],teams:["Kansas City Chiefs"]},
  {name:"Rhamondre Stevenson",colleges:["Oklahoma"],teams:["New England Patriots"]},
  {name:"Brian Robinson Jr.",colleges:["Alabama"],teams:["Washington Commanders"]},
  {name:"Tyler Allgeier",colleges:["BYU"],teams:["Atlanta Falcons"]},
  {name:"Tyjae Spears",colleges:["Tulane"],teams:["Tennessee Titans"]},
  {name:"Tank Bigsby",colleges:["Auburn"],teams:["Jacksonville Jaguars"]},
  {name:"Bucky Irving",colleges:["Oregon"],teams:["Tampa Bay Buccaneers"]},
  {name:"Jordan Mason",colleges:["Georgia Tech"],teams:["San Francisco 49ers","Minnesota Vikings"]},
  {name:"Alec Pierce",colleges:["Cincinnati"],teams:["Indianapolis Colts"]},
  {name:"Chris Olave",colleges:["Ohio State"],teams:["New Orleans Saints"]},
  {name:"Michael Pittman Jr.",colleges:["USC"],teams:["Indianapolis Colts"]},
  {name:"Rashee Rice",colleges:["SMU"],teams:["Kansas City Chiefs"]},
  {name:"Marquez Valdes-Scantling",colleges:["South Florida"],teams:["Green Bay Packers","Kansas City Chiefs","New Orleans Saints"]},
  {name:"Dyami Brown",colleges:["North Carolina"],teams:["Washington Commanders"]},
  {name:"Josh Palmer",colleges:["Tennessee"],teams:["Los Angeles Chargers","Buffalo Bills"]},
  {name:"Jameson Williams",colleges:["Ohio State","Alabama"],teams:["Detroit Lions"]},
  {name:"Jakobi Meyers",colleges:["NC State"],teams:["New England Patriots","Las Vegas Raiders"]},
  {name:"Donovan Peoples-Jones",colleges:["Michigan"],teams:["Cleveland Browns","Detroit Lions"]},
  {name:"Nico Collins",colleges:["Michigan"],teams:["Houston Texans"]},
  {name:"Courtland Sutton",colleges:["SMU"],teams:["Denver Broncos"]},
  {name:"Christian Kirk",colleges:["Texas A&M"],teams:["Arizona Cardinals","Jacksonville Jaguars"]},
  {name:"Darnell Mooney",colleges:["Tulane"],teams:["Chicago Bears","Atlanta Falcons"]},
  {name:"Tucker Kraft",colleges:["South Dakota State"],teams:["Green Bay Packers"]},
  {name:"Isaiah Likely",colleges:["Coastal Carolina"],teams:["Baltimore Ravens"]},
  {name:"Chigoziem Okonkwo",colleges:["Maryland"],teams:["Tennessee Titans"]},
  {name:"Cole Turner",colleges:["Nevada"],teams:["Washington Commanders"]}
];

// ── HELPERS ──────────────────────────────────────────────────────────────────

function normalize(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ");
}

function resolveTeam(input) {
  const n = normalize(input);
  for (const [canonical, aliases] of Object.entries(TEAM_ALIASES)) {
    if (normalize(canonical) === n) return canonical;
    if (aliases.some(a => a === n)) return canonical;
  }
  return null;
}

function resolveCollege(input, players) {
  const n = normalize(input);
  // Check known aliases first
  for (const [canonical, aliases] of Object.entries(COLLEGE_ALIASES)) {
    if (normalize(canonical) === n || aliases.some(a => a === n)) {
      // Confirm this college exists in our player data
      const exists = players.some(p => p.colleges.some(c => normalize(c) === normalize(canonical)));
      if (exists) return canonical;
    }
  }
  // Direct match against all colleges in player data
  const allColleges = [...new Set(players.flatMap(p => p.colleges))];
  const direct = allColleges.find(c => normalize(c) === n);
  return direct || null;
}

function resolvePlayer(input, players) {
  const n = normalize(input);
  return players.find(p => normalize(p.name) === n) || null;
}

function playerOnTeam(player, team) {
  return player.teams.includes(team);
}

function playerAtCollege(player, college) {
  return player.colleges.some(c => normalize(c) === normalize(college));
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────

// Step types
const STEP = {
  TEAM: "team",       // need to name a player who played for currentTeam
  PLAYER_TO_COLLEGE: "player_to_college", // just named a player, need their college
  COLLEGE: "college", // need to name a player who went to currentCollege
  PLAYER_TO_TEAM: "player_to_team",       // just named a player, need a team they played for
};

const STEP_LABELS = {
  [STEP.TEAM]: (ctx) => `Name a player who played for the ${ctx.currentTarget}`,
  [STEP.PLAYER_TO_COLLEGE]: (ctx) => `Where did ${ctx.currentTarget} go to college?`,
  [STEP.COLLEGE]: (ctx) => `Name an NFL player who went to ${ctx.currentTarget}`,
  [STEP.PLAYER_TO_TEAM]: (ctx) => `Name an NFL team ${ctx.currentTarget} played for`,
};

const STEP_HINT = {
  [STEP.TEAM]: "Type any NFL player's name",
  [STEP.PLAYER_TO_COLLEGE]: "Type the college name",
  [STEP.COLLEGE]: "Type any NFL player's name",
  [STEP.PLAYER_TO_TEAM]: "Type any NFL team name",
};

// ── CHAIN NODE DISPLAY ───────────────────────────────────────────────────────
function ChainNode({ item, type, isLatest }) {
  const isTeam = type === "team";
  const isCollege = type === "college";
  const isPlayer = type === "player";

  const colors = isTeam
    ? { bg: "#0f1f2e", border: "#1a6b9e", text: "#5bb8f5", label: "#1a6b9e" }
    : isCollege
    ? { bg: "#1e1a0e", border: "#7a5f1a", text: "#e8c060", label: "#7a5f1a" }
    : { bg: "#0e1e10", border: "#2a7a40", text: "#5fd88a", label: "#2a7a40" };

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      animation: isLatest ? "popIn .3s cubic-bezier(.34,1.56,.64,1)" : "none",
    }}>
      <div style={{
        fontSize: 8, fontFamily: "'Oswald', sans-serif", letterSpacing: 3,
        color: colors.label, textTransform: "uppercase", marginBottom: 3,
      }}>
        {isTeam ? "NFL Team" : isCollege ? "College" : "Player"}
      </div>
      <div style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: 8, padding: "6px 12px",
        fontSize: 12, fontWeight: 700,
        fontFamily: "'Oswald', sans-serif",
        color: colors.text,
        letterSpacing: 0.5,
        maxWidth: 160, textAlign: "center",
        lineHeight: 1.3,
        boxShadow: isLatest ? `0 0 12px ${colors.border}55` : "none",
      }}>
        {item}
      </div>
    </div>
  );
}

function ChainConnector() {
  return (
    <div style={{
      display: "flex", alignItems: "center",
      color: "#ffffff15", fontSize: 14, padding: "0 4px",
    }}>→</div>
  );
}

// ── TEAM PROGRESS TRACKER ────────────────────────────────────────────────────
function TeamTracker({ usedTeams, total }) {
  return (
    <div style={{
      display: "flex", flexWrap: "wrap", gap: 4,
      justifyContent: "center", maxWidth: 640,
    }}>
      {NFL_TEAMS.map(team => {
        const used = usedTeams.has(team);
        const shortName = team.split(" ").slice(-1)[0]; // last word
        return (
          <div key={team} title={team} style={{
            fontSize: 9, fontFamily: "'Oswald', sans-serif",
            fontWeight: 700, letterSpacing: 0.5,
            padding: "3px 7px", borderRadius: 4,
            background: used ? "#0d2a18" : "#0d0d1e",
            border: `1px solid ${used ? "#22c55e55" : "#ffffff08"}`,
            color: used ? "#22c55e" : "#ffffff18",
            transition: "all 0.3s",
            textTransform: "uppercase",
          }}>
            {shortName === "Commanders" ? "WSH" :
             shortName === "Patriots" ? "NE" :
             shortName === "Buccaneers" ? "TB" :
             shortName === "Chargers" ? team.includes("Los") ? "LAC" : "LAC" :
             shortName === "Rams" ? "LAR" :
             shortName === "Raiders" ? "LV" :
             shortName.slice(0,3).toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}

// ── MAIN GAME ────────────────────────────────────────────────────────────────
export default function NFLChain() {
  const [step, setStep] = useState(STEP.TEAM);
  const [currentTarget, setCurrentTarget] = useState(null); // current team/college/player to answer about
  const [chain, setChain] = useState([]); // [{item, type}]
  const [usedTeams, setUsedTeams] = useState(new Set());
  const [usedColleges, setUsedColleges] = useState(new Set());
  const [usedPlayers, setUsedPlayers] = useState(new Set());
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [rejectMsg, setRejectMsg] = useState("");
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const inputRef = useRef(null);
  const chainEndRef = useRef(null);

  // Initialize with random team
  useEffect(() => {
    const team = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    setCurrentTarget(team);
    setUsedTeams(new Set([team]));
    setChain([{ item: team, type: "team" }]);
  }, []);

  // Scroll chain into view
  useEffect(() => {
    chainEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
  }, [chain]);

  const reject = useCallback((msg) => {
    setShake(true);
    setRejectMsg(msg);
    setTimeout(() => setShake(false), 500);
    setTimeout(() => setRejectMsg(""), 2000);
  }, []);

  const handleSubmit = useCallback(() => {
    const val = input.trim();
    if (!val) return;

    if (step === STEP.TEAM) {
      // Need a player who played for currentTarget team
      const player = resolvePlayer(val, PLAYERS);
      if (!player) return reject("Player not found in our database");
      if (!playerOnTeam(player, currentTarget)) return reject(`${player.name} didn't play for the ${currentTarget}`);
      if (usedPlayers.has(player.name)) return reject(`${player.name} already used`);

      const newUsed = new Set(usedPlayers); newUsed.add(player.name);
      setUsedPlayers(newUsed);
      setChain(c => [...c, { item: player.name, type: "player" }]);
      setCurrentTarget(player.name);
      setStep(STEP.PLAYER_TO_COLLEGE);
      setInput("");

    } else if (step === STEP.PLAYER_TO_COLLEGE) {
      // Need college for currentTarget player
      const college = resolveCollege(val, PLAYERS);
      if (!college) return reject("College not found — try the full name");
      const player = PLAYERS.find(p => p.name === currentTarget);
      if (!playerAtCollege(player, college)) return reject(`${player.name} didn't attend ${college}`);
      if (usedColleges.has(college)) return reject(`${college} already used`);

      const newUsed = new Set(usedColleges); newUsed.add(college);
      setUsedColleges(newUsed);
      setChain(c => [...c, { item: college, type: "college" }]);
      setCurrentTarget(college);
      setStep(STEP.COLLEGE);
      setInput("");

    } else if (step === STEP.COLLEGE) {
      // Need a player who went to currentTarget college
      const player = resolvePlayer(val, PLAYERS);
      if (!player) return reject("Player not found in our database");
      if (!playerAtCollege(player, currentTarget)) return reject(`${player.name} didn't go to ${currentTarget}`);
      if (usedPlayers.has(player.name)) return reject(`${player.name} already used`);

      const newUsed = new Set(usedPlayers); newUsed.add(player.name);
      setUsedPlayers(newUsed);
      setChain(c => [...c, { item: player.name, type: "player" }]);
      setCurrentTarget(player.name);
      setStep(STEP.PLAYER_TO_TEAM);
      setInput("");

    } else if (step === STEP.PLAYER_TO_TEAM) {
      // Need a team that currentTarget player played for
      const team = resolveTeam(val);
      if (!team) return reject("NFL team not recognized");
      const player = PLAYERS.find(p => p.name === currentTarget);
      if (!playerOnTeam(player, team)) return reject(`${player.name} didn't play for the ${team}`);
      if (usedTeams.has(team)) return reject(`${team} already used`);

      const newUsedTeams = new Set(usedTeams); newUsedTeams.add(team);
      setUsedTeams(newUsedTeams);
      setChain(c => [...c, { item: team, type: "team" }]);
      setCurrentTarget(team);
      setInput("");

      if (newUsedTeams.size === 32) {
        setWon(true);
      } else {
        setStep(STEP.TEAM);
      }
    }
  }, [step, currentTarget, input, usedTeams, usedColleges, usedPlayers, reject]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleReset = () => {
    const team = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
    setCurrentTarget(team);
    setUsedTeams(new Set([team]));
    setUsedColleges(new Set());
    setUsedPlayers(new Set());
    setChain([{ item: team, type: "team" }]);
    setStep(STEP.TEAM);
    setInput("");
    setWon(false);
    setRejectMsg("");
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const prompt = currentTarget ? STEP_LABELS[step]({ currentTarget }) : "";
  const hint = STEP_HINT[step];
  const teamsLeft = 32 - usedTeams.size;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#07070f",
      backgroundImage: "radial-gradient(ellipse at 30% 10%, #0a0f1a 0%, #07070f 55%), radial-gradient(ellipse at 70% 90%, #0a1205 0%, transparent 50%)",
      color: "#f0f0f0",
      fontFamily: "'Oswald', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "84px 16px 60px",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff18", textTransform: "uppercase", marginBottom: 6 }}>NFL</div>
        <h1 style={{
          fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: 0, lineHeight: 1,
          background: "linear-gradient(135deg,#1a6b9e,#5bb8f5,#e8c060,#5fd88a)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1,
        }}>The Chain</h1>
        <p style={{ color: "#ffffff28", fontSize: 10, margin: "6px 0 0", letterSpacing: 3, textTransform: "uppercase" }}>
          Link all 32 NFL teams · No repeats
        </p>
      </div>

      {/* Progress */}
      <div style={{
        display: "flex", alignItems: "center", gap: 20, marginBottom: 24,
        background: "#0b0b1e", border: "1px solid #161632",
        borderRadius: 12, padding: "12px 28px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#5bb8f5", lineHeight: 1 }}>{usedTeams.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Teams</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#e8c060", lineHeight: 1 }}>{usedColleges.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Colleges</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#5fd88a", lineHeight: 1 }}>{usedPlayers.size}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Players</div>
        </div>
        <div style={{ width: 1, height: 36, background: "#161632" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: teamsLeft <= 5 ? "#e74c3c" : "#c8a050", lineHeight: 1 }}>{teamsLeft}</div>
          <div style={{ fontSize: 8, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>Left</div>
        </div>
      </div>

      {/* Team tracker */}
      <div style={{ marginBottom: 24, width: "100%", maxWidth: 640 }}>
        <TeamTracker usedTeams={usedTeams} total={32} />
      </div>

      {/* Win state */}
      {won && (
        <div style={{
          width: "100%", maxWidth: 520, marginBottom: 24,
          background: "linear-gradient(135deg,#0d2b14,#0f3318)",
          border: "1px solid #22c55e44", borderRadius: 16,
          padding: "28px 32px", textAlign: "center",
          animation: "fadeUp .4s ease",
        }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🏆</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#22c55e", letterSpacing: 1 }}>YOU DID IT!</div>
          <div style={{ fontSize: 13, color: "#a0a0c0", marginTop: 8 }}>
            All 32 NFL teams chained in {chain.length} links
          </div>
          <button onClick={handleReset} style={{
            marginTop: 20, background: "#22c55e", color: "#07070f",
            border: "none", borderRadius: 10, padding: "11px 32px",
            fontSize: 13, fontWeight: 900, cursor: "pointer",
            letterSpacing: 1.5, textTransform: "uppercase",
          }}>Play Again</button>
        </div>
      )}

      {/* Active prompt + input */}
      {!won && (
        <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>
          {/* Current prompt */}
          <div style={{
            background: "#0b0b1e", border: "1px solid #161640",
            borderRadius: 14, padding: "18px 20px", marginBottom: 12,
          }}>
            <div style={{ fontSize: 9, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
              Step {chain.length} of {chain.length + (32 - usedTeams.size) * 4 - 2}+
            </div>
            <div style={{
              fontSize: 18, fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3,
              marginBottom: 6,
            }}>
              {prompt}
            </div>
            <div style={{ fontSize: 10, color: "#ffffff28", letterSpacing: 1 }}>{hint}</div>
          </div>

          {/* Input */}
          <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => { setInput(e.target.value); setRejectMsg(""); }}
              onKeyDown={handleKeyDown}
              placeholder={
                step === STEP.TEAM || step === STEP.COLLEGE ? "Player name..." :
                step === STEP.PLAYER_TO_COLLEGE ? "College name..." :
                "Team name..."
              }
              autoComplete="off"
              autoFocus
              style={{
                width: "100%", background: "#07071a",
                border: `2px solid ${shake ? "#e74c3c" : "#141432"}`,
                borderRadius: 12, padding: "14px 18px",
                fontSize: 16, color: "#f0f0f0", outline: "none",
                fontFamily: "'Oswald', sans-serif", fontWeight: 600,
                letterSpacing: 0.5, boxSizing: "border-box",
                transition: "border-color .2s",
              }}
              onFocus={e => e.target.style.borderColor = "#5bb8f555"}
              onBlur={e => e.target.style.borderColor = "#141432"}
            />
          </div>

          {/* Reject message */}
          {rejectMsg && (
            <div style={{
              marginTop: 8, fontSize: 11, color: "#e74c3c99",
              fontFamily: "'Oswald', sans-serif", letterSpacing: 1, textAlign: "center",
              animation: "fadeUp .2s ease",
            }}>
              {rejectMsg}
            </div>
          )}

          <button onClick={handleSubmit} style={{
            marginTop: 10, width: "100%",
            background: "linear-gradient(135deg,#1a4a6e,#1e5580)",
            border: "1px solid #2a6a9e44",
            borderRadius: 10, padding: "12px 0",
            fontSize: 12, fontWeight: 900, color: "#5bb8f5",
            cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
            transition: "all .2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(135deg,#1e5580,#225f90)"}
            onMouseLeave={e => e.currentTarget.style.background = "linear-gradient(135deg,#1a4a6e,#1e5580)"}
          >
            Confirm →
          </button>
        </div>
      )}

      {/* Chain visualization */}
      <div style={{
        width: "100%", maxWidth: 780,
        background: "#08081a", border: "1px solid #111128",
        borderRadius: 16, padding: "16px 20px", marginBottom: 24,
        overflowX: "auto",
      }}>
        <div style={{ fontSize: 8, color: "#ffffff15", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
          Chain — {chain.length} links
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          gap: 0, flexWrap: "wrap", rowGap: 10,
        }}>
          {chain.map((node, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <ChainNode item={node.item} type={node.type} isLatest={i === chain.length - 1} />
              {i < chain.length - 1 && <ChainConnector />}
            </div>
          ))}
          <div ref={chainEndRef} />
        </div>
      </div>

      {/* Reset */}
      <button onClick={handleReset} style={{
        background: "transparent", color: "#ffffff22",
        border: "1px solid #ffffff0a", borderRadius: 10,
        padding: "8px 24px", fontSize: 11, fontWeight: 700,
        cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
        transition: "color .2s, border-color .2s",
        fontFamily: "'Oswald', sans-serif",
      }}
        onMouseEnter={e => { e.target.style.color = "#e74c3c99"; e.target.style.borderColor = "#e74c3c33"; }}
        onMouseLeave={e => { e.target.style.color = "#ffffff22"; e.target.style.borderColor = "#ffffff0a"; }}
      >
        New Game
      </button>
    </div>
  );
}
