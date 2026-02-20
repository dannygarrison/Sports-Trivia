import { useState, useRef, useEffect } from "react";

const POS_COLORS = {
  QB:"#e74c3c", RB:"#e67e22", WR:"#d4ac0d", TE:"#27ae60",
  LB:"#8e44ad", S:"#0097a7", CB:"#bf360c", DE:"#1565c0", DT:"#6a1b9a",
};




const PLAYERS = [
  { name: "Dalvin Cook", colleges: ["Florida State"], position: "RB", teams: ["Minnesota Vikings", "New York Jets", "New York Giants"] },
  { name: "Leonard Fournette", colleges: ["LSU"], position: "RB", teams: ["Jacksonville Jaguars", "Tampa Bay Buccaneers"] },
  { name: "Tee Higgins", colleges: ["Clemson"], position: "WR", teams: ["Cincinnati Bengals"] },
  { name: "A.J. Brown", colleges: ["Ole Miss"], position: "WR", teams: ["Tennessee Titans", "Philadelphia Eagles"] },
  { name: "DeVonta Smith", colleges: ["Alabama"], position: "WR", teams: ["Philadelphia Eagles"] },
  { name: "D.J. Moore", colleges: ["Maryland"], position: "WR", teams: ["Carolina Panthers", "Chicago Bears", "New York Giants"] },
  { name: "Dallas Goedert", colleges: ["South Dakota State"], position: "TE", teams: ["Philadelphia Eagles"] },
  { name: "Jake Ferguson", colleges: ["Wisconsin"], position: "TE", teams: ["Dallas Cowboys"] },
  { name: "Austin Ekeler", colleges: ["Western Colorado"], position: "RB", teams: ["Los Angeles Chargers", "New York Jets", "Washington Commanders"] },
  { name: "Raheem Mostert", colleges: ["Purdue"], position: "RB", teams: ["San Francisco 49ers", "Miami Dolphins"] },
  { name: "Jordan Addison", colleges: ["Pittsburgh", "USC"], position: "WR", teams: ["Minnesota Vikings"] },
  { name: "Marvin Harrison Jr.", colleges: ["Ohio State"], position: "WR", teams: ["Arizona Cardinals"] },
  { name: "Patrick Mahomes", colleges: ["Texas Tech"], position: "QB", teams: ["Kansas City Chiefs"] },
  { name: "Tom Brady", colleges: ["Michigan"], position: "QB", teams: ["New England Patriots", "Tampa Bay Buccaneers"] },
  { name: "Jerry Rice", colleges: ["Mississippi Valley State"], position: "WR", teams: ["San Francisco 49ers", "Oakland Raiders", "Seattle Seahawks"] },
  { name: "Peyton Manning", colleges: ["Tennessee"], position: "QB", teams: ["Indianapolis Colts", "Denver Broncos"] },
  { name: "Barry Sanders", colleges: ["Oklahoma State"], position: "RB", teams: ["Detroit Lions"] },
  { name: "Lawrence Taylor", colleges: ["North Carolina"], position: "LB", teams: ["New York Giants"] },
  { name: "Emmitt Smith", colleges: ["Florida"], position: "RB", teams: ["Dallas Cowboys", "Arizona Cardinals"] },
  { name: "Randy Moss", colleges: ["Marshall"], position: "WR", teams: ["Minnesota Vikings", "Oakland Raiders", "New England Patriots", "San Francisco 49ers", "Tennessee Titans"] },
  { name: "Joe Montana", colleges: ["Notre Dame"], position: "QB", teams: ["San Francisco 49ers", "Kansas City Chiefs"] },
  { name: "Walter Payton", colleges: ["Jackson State"], position: "RB", teams: ["Chicago Bears"] },
  { name: "Reggie White", colleges: ["Tennessee"], position: "DE", teams: ["Philadelphia Eagles", "Green Bay Packers", "Carolina Panthers"] },
  { name: "John Elway", colleges: ["Stanford"], position: "QB", teams: ["Denver Broncos"] },
  { name: "Jim Brown", colleges: ["Syracuse"], position: "RB", teams: ["Cleveland Browns"] },
  { name: "Dan Marino", colleges: ["Pittsburgh"], position: "QB", teams: ["Miami Dolphins"] },
  { name: "Brett Favre", colleges: ["Southern Miss"], position: "QB", teams: ["Atlanta Falcons", "Green Bay Packers", "New York Jets", "Minnesota Vikings"] },
  { name: "Deion Sanders", colleges: ["Florida State"], position: "CB", teams: ["Atlanta Falcons", "San Francisco 49ers", "Dallas Cowboys", "Washington Redskins", "Baltimore Ravens"] },
  { name: "Aaron Rodgers", colleges: ["California"], position: "QB", teams: ["Green Bay Packers", "New York Jets", "Pittsburgh Steelers"] },
  { name: "Calvin Johnson", colleges: ["Georgia Tech"], position: "WR", teams: ["Detroit Lions"] },
  { name: "Adrian Peterson", colleges: ["Oklahoma"], position: "RB", teams: ["Minnesota Vikings", "New Orleans Saints", "Arizona Cardinals", "Washington Redskins", "Seattle Seahawks", "Detroit Lions", "Tennessee Titans"] },
  { name: "Ray Lewis", colleges: ["Miami (FL)"], position: "LB", teams: ["Baltimore Ravens"] },
  { name: "Troy Polamalu", colleges: ["USC"], position: "S", teams: ["Pittsburgh Steelers"] },
  { name: "Marshawn Lynch", colleges: ["California"], position: "RB", teams: ["Buffalo Bills", "Seattle Seahawks", "Oakland Raiders"] },
  { name: "Steve Young", colleges: ["BYU"], position: "QB", teams: ["Tampa Bay Buccaneers", "San Francisco 49ers"] },
  { name: "Junior Seau", colleges: ["USC"], position: "LB", teams: ["San Diego Chargers", "Miami Dolphins", "New England Patriots"] },
  { name: "Tony Gonzalez", colleges: ["California"], position: "TE", teams: ["Kansas City Chiefs", "Atlanta Falcons"] },
  { name: "Larry Fitzgerald", colleges: ["Pittsburgh"], position: "WR", teams: ["Arizona Cardinals"] },
  { name: "Terrell Owens", colleges: ["Tennessee-Chattanooga"], position: "WR", teams: ["San Francisco 49ers", "Philadelphia Eagles", "Dallas Cowboys", "Buffalo Bills", "Cincinnati Bengals"] },
  { name: "LaDainian Tomlinson", colleges: ["TCU"], position: "RB", teams: ["San Diego Chargers", "New York Jets"] },
  { name: "Brian Urlacher", colleges: ["New Mexico"], position: "LB", teams: ["Chicago Bears"] },
  { name: "Rob Gronkowski", colleges: ["Arizona"], position: "TE", teams: ["New England Patriots", "Tampa Bay Buccaneers"] },
  { name: "Drew Brees", colleges: ["Purdue"], position: "QB", teams: ["San Diego Chargers", "New Orleans Saints"] },
  { name: "Cam Newton", colleges: ["Auburn"], position: "QB", teams: ["Carolina Panthers", "New England Patriots"] },
  { name: "Russell Wilson", colleges: ["Wisconsin", "NC State"], position: "QB", teams: ["Seattle Seahawks", "Denver Broncos", "Pittsburgh Steelers", "New York Giants"] },
  { name: "Odell Beckham Jr.", colleges: ["LSU"], position: "WR", teams: ["New York Giants", "Cleveland Browns", "Los Angeles Rams", "Baltimore Ravens", "Miami Dolphins"] },
  { name: "Antonio Brown", colleges: ["Central Michigan"], position: "WR", teams: ["Pittsburgh Steelers", "Oakland Raiders", "New England Patriots", "Tampa Bay Buccaneers"] },
  { name: "Frank Gore", colleges: ["Miami (FL)"], position: "RB", teams: ["San Francisco 49ers", "Indianapolis Colts", "Miami Dolphins", "Buffalo Bills", "New York Jets"] },
  { name: "Charles Woodson", colleges: ["Michigan"], position: "CB", teams: ["Oakland Raiders", "Green Bay Packers"] },
  { name: "Richard Sherman", colleges: ["Stanford"], position: "CB", teams: ["Seattle Seahawks", "San Francisco 49ers", "Tampa Bay Buccaneers"] },
  { name: "Von Miller", colleges: ["Texas A&M"], position: "LB", teams: ["Denver Broncos", "Los Angeles Rams", "Buffalo Bills", "Washington Commanders"] },
  { name: "J.J. Watt", colleges: ["Wisconsin"], position: "DE", teams: ["Houston Texans", "Arizona Cardinals"] },
  { name: "Khalil Mack", colleges: ["Buffalo"], position: "LB", teams: ["Oakland Raiders", "Chicago Bears", "Los Angeles Chargers"] },
  { name: "Aaron Donald", colleges: ["Pittsburgh"], position: "DT", teams: ["Los Angeles Rams"] },
  { name: "Myles Garrett", colleges: ["Texas A&M"], position: "DE", teams: ["Cleveland Browns"] },
  { name: "Bradley Chubb", colleges: ["NC State"], position: "DE", teams: ["Denver Broncos", "Miami Dolphins", "San Francisco 49ers"] },
  { name: "Micah Parsons", colleges: ["Penn State"], position: "LB", teams: ["Dallas Cowboys", "Green Bay Packers"] },
  { name: "Justin Jefferson", colleges: ["LSU"], position: "WR", teams: ["Minnesota Vikings"] },
  { name: "Tyreek Hill", colleges: ["West Alabama", "Oklahoma State", "Garden City CC"], position: "WR", teams: ["Kansas City Chiefs", "Miami Dolphins"] },
  { name: "Stefon Diggs", colleges: ["Maryland"], position: "WR", teams: ["Minnesota Vikings", "Buffalo Bills", "Houston Texans", "New England Patriots"] },
  { name: "Davante Adams", colleges: ["Fresno State"], position: "WR", teams: ["Green Bay Packers", "Las Vegas Raiders", "New York Jets", "Los Angeles Rams"] },
  { name: "Travis Kelce", colleges: ["Cincinnati"], position: "TE", teams: ["Kansas City Chiefs"] },
  { name: "George Kittle", colleges: ["Iowa"], position: "TE", teams: ["San Francisco 49ers"] },
  { name: "Mark Andrews", colleges: ["Oklahoma"], position: "TE", teams: ["Baltimore Ravens"] },
  { name: "Lamar Jackson", colleges: ["Louisville"], position: "QB", teams: ["Baltimore Ravens"] },
  { name: "Josh Allen", colleges: ["Wyoming"], position: "QB", teams: ["Buffalo Bills"] },
  { name: "Joe Burrow", colleges: ["LSU", "Ohio State"], position: "QB", teams: ["Cincinnati Bengals"] },
  { name: "Justin Herbert", colleges: ["Oregon"], position: "QB", teams: ["Los Angeles Chargers"] },
  { name: "Kyler Murray", colleges: ["Oklahoma", "Texas A&M"], position: "QB", teams: ["Arizona Cardinals"] },
  { name: "Dak Prescott", colleges: ["Mississippi State"], position: "QB", teams: ["Dallas Cowboys"] },
  { name: "Jalen Hurts", colleges: ["Oklahoma", "Alabama"], position: "QB", teams: ["Philadelphia Eagles"] },
  { name: "Tua Tagovailoa", colleges: ["Alabama"], position: "QB", teams: ["Miami Dolphins"] },
  { name: "Saquon Barkley", colleges: ["Penn State"], position: "RB", teams: ["New York Giants", "Philadelphia Eagles"] },
  { name: "Christian McCaffrey", colleges: ["Stanford"], position: "RB", teams: ["Carolina Panthers", "San Francisco 49ers"] },
  { name: "Nick Chubb", colleges: ["Georgia"], position: "RB", teams: ["Cleveland Browns", "Houston Texans"] },
  { name: "Derrick Henry", colleges: ["Alabama"], position: "RB", teams: ["Tennessee Titans", "Baltimore Ravens"] },
  { name: "Alvin Kamara", colleges: ["Tennessee", "Hutchinson CC"], position: "RB", teams: ["New Orleans Saints"] },
  { name: "Ezekiel Elliott", colleges: ["Ohio State"], position: "RB", teams: ["Dallas Cowboys", "New England Patriots"] },
  { name: "Devonta Freeman", colleges: ["Florida State"], position: "RB", teams: ["Atlanta Falcons", "New York Giants", "Baltimore Ravens"] },
  { name: "DeAngelo Williams", colleges: ["Memphis"], position: "RB", teams: ["Carolina Panthers", "Pittsburgh Steelers"] },
  { name: "Alfred Morris", colleges: ["Florida Atlantic"], position: "RB", teams: ["Washington Redskins", "Dallas Cowboys", "San Francisco 49ers"] },
  { name: "De'Von Achane", colleges: ["Texas A&M"], position: "RB", teams: ["Miami Dolphins"] },
  { name: "DeAndre Hopkins", colleges: ["Clemson"], position: "WR", teams: ["Houston Texans", "Arizona Cardinals", "Tennessee Titans", "Kansas City Chiefs", "Baltimore Ravens"] },
  { name: "Mike Evans", colleges: ["Texas A&M"], position: "WR", teams: ["Tampa Bay Buccaneers"] },
  { name: "Cooper Kupp", colleges: ["Eastern Washington"], position: "WR", teams: ["Los Angeles Rams", "Seattle Seahawks"] },
  { name: "Ja'Marr Chase", colleges: ["LSU"], position: "WR", teams: ["Cincinnati Bengals"] },
  { name: "CeeDee Lamb", colleges: ["Oklahoma"], position: "WR", teams: ["Dallas Cowboys"] },
  { name: "DK Metcalf", colleges: ["Ole Miss"], position: "WR", teams: ["Seattle Seahawks", "Pittsburgh Steelers"] },
  { name: "Deebo Samuel", colleges: ["South Carolina"], position: "WR", teams: ["San Francisco 49ers", "Washington Commanders"] },
  { name: "Brandon Aiyuk", colleges: ["Arizona State"], position: "WR", teams: ["San Francisco 49ers"] },
  { name: "Jauan Jennings", colleges: ["Tennessee"], position: "WR", teams: ["San Francisco 49ers"] },
  { name: "T.J. Watt", colleges: ["Wisconsin"], position: "LB", teams: ["Pittsburgh Steelers"] },
  { name: "Sauce Gardner", colleges: ["Cincinnati"], position: "CB", teams: ["New York Jets", "Indianapolis Colts"] },
  { name: "Jalen Ramsey", colleges: ["Florida State"], position: "CB", teams: ["Jacksonville Jaguars", "Los Angeles Rams", "Miami Dolphins", "Pittsburgh Steelers"] },
  { name: "Trevon Diggs", colleges: ["Alabama"], position: "CB", teams: ["Dallas Cowboys"] },
  { name: "Patrick Peterson", colleges: ["LSU"], position: "CB", teams: ["Arizona Cardinals", "Minnesota Vikings", "Pittsburgh Steelers"] },
  { name: "Eli Manning", colleges: ["Ole Miss"], position: "QB", teams: ["New York Giants"] },
  { name: "Philip Rivers", colleges: ["NC State"], position: "QB", teams: ["San Diego Chargers", "Los Angeles Chargers", "Indianapolis Colts"] },
  { name: "Ben Roethlisberger", colleges: ["Miami (OH)"], position: "QB", teams: ["Pittsburgh Steelers"] },
  { name: "Andrew Luck", colleges: ["Stanford"], position: "QB", teams: ["Indianapolis Colts"] },
  { name: "Michael Vick", colleges: ["Virginia Tech"], position: "QB", teams: ["Atlanta Falcons", "Philadelphia Eagles", "New York Jets", "Pittsburgh Steelers"] },
  { name: "Matthew Stafford", colleges: ["Georgia"], position: "QB", teams: ["Detroit Lions", "Los Angeles Rams"] },
  { name: "Baker Mayfield", colleges: ["Oklahoma", "Texas Tech"], position: "QB", teams: ["Cleveland Browns", "Carolina Panthers", "Los Angeles Rams", "Tampa Bay Buccaneers"] },
  { name: "Brock Purdy", colleges: ["Iowa State"], position: "QB", teams: ["San Francisco 49ers"] },
  { name: "C.J. Stroud", colleges: ["Ohio State"], position: "QB", teams: ["Houston Texans"] },
  { name: "Jayden Daniels", colleges: ["Arizona State", "LSU"], position: "QB", teams: ["Washington Commanders"] },
  { name: "Bo Nix", colleges: ["Auburn", "Oregon"], position: "QB", teams: ["Denver Broncos"] },
  { name: "Caleb Williams", colleges: ["Oklahoma", "USC"], position: "QB", teams: ["Chicago Bears"] },
  { name: "Drake Maye", colleges: ["North Carolina"], position: "QB", teams: ["New England Patriots"] },
  { name: "Ryan Fitzpatrick", colleges: ["Harvard"], position: "QB", teams: ["New England Patriots", "Cincinnati Bengals", "Buffalo Bills", "Tennessee Titans", "Houston Texans", "New York Jets", "Tampa Bay Buccaneers", "Miami Dolphins", "Washington Football Team"] },
  { name: "Jason Witten", colleges: ["Tennessee"], position: "TE", teams: ["Dallas Cowboys", "Las Vegas Raiders"] },
  { name: "Antonio Gates", colleges: ["Kent State"], position: "TE", teams: ["San Diego Chargers"] },
  { name: "Jimmy Graham", colleges: ["Miami (FL)"], position: "TE", teams: ["New Orleans Saints", "Seattle Seahawks", "Green Bay Packers", "Chicago Bears"] },
  { name: "Kyle Pitts", colleges: ["Florida"], position: "TE", teams: ["Atlanta Falcons"] },
  { name: "Bo Jackson", colleges: ["Auburn"], position: "RB", teams: ["Los Angeles Raiders"] },
  { name: "Eric Dickerson", colleges: ["SMU"], position: "RB", teams: ["Los Angeles Rams", "Indianapolis Colts", "Los Angeles Raiders"] },
  { name: "Marcus Allen", colleges: ["USC"], position: "RB", teams: ["Los Angeles Raiders", "Kansas City Chiefs"] },
  { name: "Todd Gurley", colleges: ["Georgia"], position: "RB", teams: ["Los Angeles Rams", "Atlanta Falcons"] },
  { name: "Melvin Gordon", colleges: ["Wisconsin"], position: "RB", teams: ["Los Angeles Chargers", "Denver Broncos"] },
  { name: "Le'Veon Bell", colleges: ["Michigan State"], position: "RB", teams: ["Pittsburgh Steelers", "New York Jets", "Kansas City Chiefs", "Baltimore Ravens"] },
  { name: "Joe Mixon", colleges: ["Oklahoma"], position: "RB", teams: ["Cincinnati Bengals", "Houston Texans"] },
  { name: "Jonathan Taylor", colleges: ["Wisconsin"], position: "RB", teams: ["Indianapolis Colts"] },
  { name: "Breece Hall", colleges: ["Iowa State"], position: "RB", teams: ["New York Jets"] },
  { name: "Fred Warner", colleges: ["BYU"], position: "LB", teams: ["San Francisco 49ers"] },
  { name: "Keenan Allen", colleges: ["California"], position: "WR", teams: ["San Diego Chargers", "Los Angeles Chargers", "Chicago Bears"] },
  { name: "Amari Cooper", colleges: ["Alabama"], position: "WR", teams: ["Oakland Raiders", "Dallas Cowboys", "Cleveland Browns", "Buffalo Bills"] },
  { name: "Terry McLaurin", colleges: ["Ohio State"], position: "WR", teams: ["Washington Commanders"] },
  { name: "DJ Moore", colleges: ["Maryland"], position: "WR", teams: ["Carolina Panthers", "Chicago Bears"] },
  { name: "Puka Nacua", colleges: ["BYU", "Washington"], position: "WR", teams: ["Los Angeles Rams"] },
  { name: "Garrett Wilson", colleges: ["Ohio State"], position: "WR", teams: ["New York Jets"] },
  { name: "Tony Dorsett", colleges: ["Pittsburgh"], position: "RB", teams: ["Dallas Cowboys", "Denver Broncos"] },
  { name: "Steve Smith Sr.", colleges: ["Utah"], position: "WR", teams: ["Carolina Panthers", "Baltimore Ravens"] },
  { name: "Tony Romo", colleges: ["Eastern Illinois"], position: "QB", teams: ["Dallas Cowboys"] },
  { name: "Carson Wentz", colleges: ["North Dakota State"], position: "QB", teams: ["Philadelphia Eagles", "Indianapolis Colts", "Washington Commanders", "Los Angeles Rams", "Kansas City Chiefs", "Minnesota Vikings"] },
  { name: "Sam Darnold", colleges: ["USC"], position: "QB", teams: ["New York Jets", "Carolina Panthers", "San Francisco 49ers", "Minnesota Vikings", "Seattle Seahawks"] },
  { name: "Daniel Jones", colleges: ["Duke"], position: "QB", teams: ["New York Giants", "Indianapolis Colts"] },
  { name: "Josh Rosen", colleges: ["UCLA"], position: "QB", teams: ["Arizona Cardinals", "Miami Dolphins"] },
  { name: "Trey Lance", colleges: ["North Dakota State"], position: "QB", teams: ["San Francisco 49ers", "Dallas Cowboys"] },
  { name: "Mac Jones", colleges: ["Alabama"], position: "QB", teams: ["New England Patriots", "Jacksonville Jaguars"] },
  { name: "Zach Wilson", colleges: ["BYU"], position: "QB", teams: ["New York Jets", "Denver Broncos"] },
  { name: "Trevor Lawrence", colleges: ["Clemson"], position: "QB", teams: ["Jacksonville Jaguars"] },
  { name: "Justin Fields", colleges: ["Georgia", "Ohio State"], position: "QB", teams: ["Chicago Bears", "Pittsburgh Steelers", "New York Jets"] },
  { name: "Kirk Cousins", colleges: ["Michigan State"], position: "QB", teams: ["Washington Redskins", "Minnesota Vikings", "Atlanta Falcons"] },
  { name: "Jameis Winston", colleges: ["Florida State"], position: "QB", teams: ["Tampa Bay Buccaneers", "New Orleans Saints", "Cleveland Browns"] },
  { name: "Marcus Mariota", colleges: ["Oregon"], position: "QB", teams: ["Tennessee Titans", "Las Vegas Raiders", "Atlanta Falcons"] },
  { name: "Derek Carr", colleges: ["Fresno State"], position: "QB", teams: ["Oakland Raiders", "Las Vegas Raiders", "New Orleans Saints"] },
  { name: "Ryan Tannehill", colleges: ["Texas A&M"], position: "QB", teams: ["Miami Dolphins", "Tennessee Titans"] },
  { name: "Teddy Bridgewater", colleges: ["Louisville"], position: "QB", teams: ["Minnesota Vikings", "New Orleans Saints", "Carolina Panthers", "Denver Broncos", "Miami Dolphins"] },
  { name: "Andy Dalton", colleges: ["TCU"], position: "QB", teams: ["Cincinnati Bengals", "Dallas Cowboys", "Chicago Bears", "New Orleans Saints", "Carolina Panthers"] },
  { name: "Joe Flacco", colleges: ["Delaware"], position: "QB", teams: ["Baltimore Ravens", "Denver Broncos", "New York Jets", "Philadelphia Eagles", "Cleveland Browns", "Indianapolis Colts"] },
  { name: "Carson Palmer", colleges: ["USC"], position: "QB", teams: ["Cincinnati Bengals", "Oakland Raiders", "Arizona Cardinals"] },
  { name: "Chad Pennington", colleges: ["Marshall"], position: "QB", teams: ["New York Jets", "Miami Dolphins"] },
  { name: "David Garrard", colleges: ["East Carolina"], position: "QB", teams: ["Jacksonville Jaguars"] },
  { name: "Jason Campbell", colleges: ["Auburn"], position: "QB", teams: ["Washington Redskins", "Oakland Raiders", "Chicago Bears", "Cleveland Browns"] },
  { name: "Matt Ryan", colleges: ["Boston College"], position: "QB", teams: ["Atlanta Falcons", "Indianapolis Colts"] },
  { name: "Sam Bradford", colleges: ["Oklahoma"], position: "QB", teams: ["St. Louis Rams", "Philadelphia Eagles", "Minnesota Vikings", "Arizona Cardinals"] },
  { name: "Mark Sanchez", colleges: ["USC"], position: "QB", teams: ["New York Jets", "Philadelphia Eagles", "Denver Broncos"] },
  { name: "Tim Tebow", colleges: ["Florida"], position: "QB", teams: ["Denver Broncos", "New York Jets"] },
  { name: "Colin Kaepernick", colleges: ["Nevada"], position: "QB", teams: ["San Francisco 49ers"] },
  { name: "Nick Foles", colleges: ["Arizona"], position: "QB", teams: ["Philadelphia Eagles", "Los Angeles Rams", "Kansas City Chiefs", "Jacksonville Jaguars", "Chicago Bears"] },
  { name: "Alex Smith", colleges: ["Utah"], position: "QB", teams: ["San Francisco 49ers", "Kansas City Chiefs", "Washington Redskins"] },
  { name: "Geno Smith", colleges: ["West Virginia"], position: "QB", teams: ["New York Jets", "New York Giants", "Los Angeles Chargers", "Seattle Seahawks", "Las Vegas Raiders"] },
  { name: "Blaine Gabbert", colleges: ["Missouri"], position: "QB", teams: ["Jacksonville Jaguars", "San Francisco 49ers", "Arizona Cardinals", "Tennessee Titans"] },
  { name: "Blake Bortles", colleges: ["UCF"], position: "QB", teams: ["Jacksonville Jaguars", "Los Angeles Rams", "Green Bay Packers"] },
  { name: "Mitch Trubisky", colleges: ["North Carolina"], position: "QB", teams: ["Chicago Bears", "Buffalo Bills", "Pittsburgh Steelers"] },
  { name: "Deshaun Watson", colleges: ["Clemson"], position: "QB", teams: ["Houston Texans", "Cleveland Browns"] },
  { name: "Gardner Minshew", colleges: ["Washington State", "East Carolina", "Northwest Mississippi CC"], position: "QB", teams: ["Jacksonville Jaguars", "Philadelphia Eagles", "Indianapolis Colts", "Las Vegas Raiders"] },
  { name: "Jared Goff", colleges: ["California"], position: "QB", teams: ["Los Angeles Rams", "Detroit Lions"] },
  { name: "Jimmy Garoppolo", colleges: ["Eastern Illinois"], position: "QB", teams: ["New England Patriots", "San Francisco 49ers", "Las Vegas Raiders"] },
  { name: "Jacoby Brissett", colleges: ["Florida", "NC State"], position: "QB", teams: ["New England Patriots", "Indianapolis Colts", "Miami Dolphins", "Cleveland Browns", "Washington Commanders"] },
  { name: "Ray Rice", colleges: ["Rutgers"], position: "RB", teams: ["Baltimore Ravens"] },
  { name: "Matt Forte", colleges: ["Tulane"], position: "RB", teams: ["Chicago Bears", "New York Jets"] },
  { name: "Aaron Jones", colleges: ["UTEP"], position: "RB", teams: ["Green Bay Packers", "Minnesota Vikings"] },
  { name: "Jamal Lewis", colleges: ["Tennessee"], position: "RB", teams: ["Baltimore Ravens", "Cleveland Browns"] },
  { name: "Shaun Alexander", colleges: ["Alabama"], position: "RB", teams: ["Seattle Seahawks"] },
  { name: "Clinton Portis", colleges: ["Miami (FL)"], position: "RB", teams: ["Denver Broncos", "Washington Redskins"] },
  { name: "Jamal Charles", colleges: ["Texas"], position: "RB", teams: ["Kansas City Chiefs", "Denver Broncos"] },
  { name: "Arian Foster", colleges: ["Tennessee"], position: "RB", teams: ["Houston Texans", "Miami Dolphins"] },
  { name: "Chris Johnson", colleges: ["East Carolina"], position: "RB", teams: ["Tennessee Titans", "New York Jets", "Arizona Cardinals"] },
  { name: "DeMarco Murray", colleges: ["Oklahoma"], position: "RB", teams: ["Dallas Cowboys", "Philadelphia Eagles", "Tennessee Titans"] },
  { name: "Reggie Bush", colleges: ["USC"], position: "RB", teams: ["New Orleans Saints", "Miami Dolphins", "Detroit Lions", "San Francisco 49ers", "Buffalo Bills"] },
  { name: "Darren McFadden", colleges: ["Arkansas"], position: "RB", teams: ["Oakland Raiders", "Dallas Cowboys"] },
  { name: "Thomas Jones", colleges: ["Virginia"], position: "RB", teams: ["Arizona Cardinals", "Tampa Bay Buccaneers", "Chicago Bears", "New York Jets", "Kansas City Chiefs"] },
  { name: "Steven Jackson", colleges: ["Oregon State"], position: "RB", teams: ["St. Louis Rams", "Atlanta Falcons"] },
  { name: "Maurice Jones-Drew", colleges: ["UCLA"], position: "RB", teams: ["Jacksonville Jaguars", "Oakland Raiders"] },
  { name: "Joseph Addai", colleges: ["LSU"], position: "RB", teams: ["Indianapolis Colts"] },
  { name: "Willis McGahee", colleges: ["Miami (FL)"], position: "RB", teams: ["Buffalo Bills", "Baltimore Ravens", "Denver Broncos", "Cleveland Browns"] },
  { name: "Ronnie Brown", colleges: ["Auburn"], position: "RB", teams: ["Miami Dolphins", "Philadelphia Eagles", "San Diego Chargers", "Houston Texans"] },
  { name: "Cedric Benson", colleges: ["Texas"], position: "RB", teams: ["Chicago Bears", "Cincinnati Bengals", "Green Bay Packers"] },
  { name: "Larry Johnson", colleges: ["Penn State"], position: "RB", teams: ["Kansas City Chiefs", "Cincinnati Bengals", "Miami Dolphins"] },
  { name: "Kevin Jones", colleges: ["Virginia Tech"], position: "RB", teams: ["Detroit Lions", "Chicago Bears"] },
  { name: "Deuce McAllister", colleges: ["Ole Miss"], position: "RB", teams: ["New Orleans Saints"] },
  { name: "Kareem Hunt", colleges: ["Toledo"], position: "RB", teams: ["Kansas City Chiefs", "Cleveland Browns"] },
  { name: "Josh Jacobs", colleges: ["Alabama"], position: "RB", teams: ["Las Vegas Raiders", "Green Bay Packers"] },
  { name: "Dameon Pierce", colleges: ["Florida"], position: "RB", teams: ["Houston Texans"] },
  { name: "Rachaad White", colleges: ["Arizona State", "Portland State"], position: "RB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Tony Pollard", colleges: ["Memphis"], position: "RB", teams: ["Dallas Cowboys", "Tennessee Titans"] },
  { name: "Rico Dowdle", colleges: ["South Carolina"], position: "RB", teams: ["Dallas Cowboys"] },
  { name: "James Conner", colleges: ["Pittsburgh"], position: "RB", teams: ["Pittsburgh Steelers", "Arizona Cardinals"] },
  { name: "Zack Moss", colleges: ["Utah"], position: "RB", teams: ["Buffalo Bills", "Indianapolis Colts", "Cincinnati Bengals"] },
  { name: "David Montgomery", colleges: ["Iowa State"], position: "RB", teams: ["Chicago Bears", "Detroit Lions"] },
  { name: "Cam Akers", colleges: ["Florida State"], position: "RB", teams: ["Los Angeles Rams", "Minnesota Vikings"] },
  { name: "D'Andre Swift", colleges: ["Georgia"], position: "RB", teams: ["Detroit Lions", "Philadelphia Eagles", "Chicago Bears"] },
  { name: "Miles Sanders", colleges: ["Penn State"], position: "RB", teams: ["Philadelphia Eagles", "Carolina Panthers"] },
  { name: "Clyde Edwards-Helaire", colleges: ["LSU"], position: "RB", teams: ["Kansas City Chiefs"] },
  { name: "J.K. Dobbins", colleges: ["Ohio State"], position: "RB", teams: ["Baltimore Ravens", "Los Angeles Chargers", "Denver Broncos"] },
  { name: "Najee Harris", colleges: ["Alabama"], position: "RB", teams: ["Pittsburgh Steelers", "Los Angeles Chargers"] },
  { name: "Travis Etienne", colleges: ["Clemson"], position: "RB", teams: ["Jacksonville Jaguars"] },
  { name: "Javonte Williams", colleges: ["North Carolina"], position: "RB", teams: ["Denver Broncos", "Dallas Cowboys"] },
  { name: "Kenneth Walker III", colleges: ["Michigan State", "Wake Forest"], position: "RB", teams: ["Seattle Seahawks"] },
  { name: "Marvin Harrison", colleges: ["Syracuse"], position: "WR", teams: ["Indianapolis Colts"] },
  { name: "Hines Ward", colleges: ["Georgia"], position: "WR", teams: ["Pittsburgh Steelers", "Dallas Cowboys"] },
  { name: "Isaac Bruce", colleges: ["Memphis"], position: "WR", teams: ["Los Angeles Rams", "San Francisco 49ers"] },
  { name: "Chad Johnson", colleges: ["Santa Monica CC", "Oregon State"], position: "WR", teams: ["Cincinnati Bengals", "New England Patriots"] },
  { name: "Andre Johnson", colleges: ["Miami (FL)"], position: "WR", teams: ["Houston Texans", "Indianapolis Colts", "Tennessee Titans"] },
  { name: "Reggie Wayne", colleges: ["Miami (FL)"], position: "WR", teams: ["Indianapolis Colts"] },
  { name: "Plaxico Burress", colleges: ["Michigan State"], position: "WR", teams: ["Pittsburgh Steelers", "New York Giants", "New York Jets"] },
  { name: "Dez Bryant", colleges: ["Oklahoma State"], position: "WR", teams: ["Dallas Cowboys", "New Orleans Saints"] },
  { name: "Mike Wallace", colleges: ["Ole Miss"], position: "WR", teams: ["Pittsburgh Steelers", "Miami Dolphins", "Minnesota Vikings", "Baltimore Ravens", "Philadelphia Eagles"] },
  { name: "Victor Cruz", colleges: ["Massachusetts"], position: "WR", teams: ["New York Giants"] },
  { name: "Wes Welker", colleges: ["Texas Tech"], position: "WR", teams: ["Miami Dolphins", "New England Patriots", "Denver Broncos"] },
  { name: "Percy Harvin", colleges: ["Florida"], position: "WR", teams: ["Minnesota Vikings", "Seattle Seahawks", "New York Jets", "Buffalo Bills"] },
  { name: "Vincent Jackson", colleges: ["Northern Colorado"], position: "WR", teams: ["San Diego Chargers", "Tampa Bay Buccaneers"] },
  { name: "Julio Jones", colleges: ["Alabama"], position: "WR", teams: ["Atlanta Falcons", "Tennessee Titans", "Tampa Bay Buccaneers"] },
  { name: "Calvin Ridley", colleges: ["Alabama"], position: "WR", teams: ["Atlanta Falcons", "Jacksonville Jaguars", "Tennessee Titans"] },
  { name: "Jerry Jeudy", colleges: ["Alabama"], position: "WR", teams: ["Denver Broncos", "Cleveland Browns"] },
  { name: "JuJu Smith-Schuster", colleges: ["USC"], position: "WR", teams: ["Pittsburgh Steelers", "Kansas City Chiefs", "New England Patriots"] },
  { name: "A.J. Green", colleges: ["Georgia"], position: "WR", teams: ["Cincinnati Bengals", "Arizona Cardinals"] },
  { name: "Brandon Marshall", colleges: ["UCF"], position: "WR", teams: ["Denver Broncos", "Miami Dolphins", "Chicago Bears", "New York Jets", "New York Giants"] },
  { name: "Hakeem Nicks", colleges: ["North Carolina"], position: "WR", teams: ["New York Giants", "Indianapolis Colts", "Tennessee Titans"] },
  { name: "Golden Tate", colleges: ["Notre Dame"], position: "WR", teams: ["Seattle Seahawks", "Detroit Lions", "Philadelphia Eagles", "New York Giants"] },
  { name: "Tyler Lockett", colleges: ["Kansas State"], position: "WR", teams: ["Seattle Seahawks"] },
  { name: "Doug Baldwin", colleges: ["Stanford"], position: "WR", teams: ["Seattle Seahawks"] },
  { name: "Greg Jennings", colleges: ["Western Michigan"], position: "WR", teams: ["Green Bay Packers", "Minnesota Vikings", "Miami Dolphins"] },
  { name: "Jordy Nelson", colleges: ["Kansas State"], position: "WR", teams: ["Green Bay Packers", "Oakland Raiders"] },
  { name: "Randall Cobb", colleges: ["Kentucky"], position: "WR", teams: ["Green Bay Packers", "Dallas Cowboys", "Houston Texans", "New York Giants"] },
  { name: "Emmanuel Sanders", colleges: ["SMU"], position: "WR", teams: ["Pittsburgh Steelers", "Denver Broncos", "San Francisco 49ers", "New Orleans Saints", "Buffalo Bills"] },
  { name: "Demaryius Thomas", colleges: ["Georgia Tech"], position: "WR", teams: ["Denver Broncos", "Houston Texans", "New York Jets", "New England Patriots"] },
  { name: "Michael Crabtree", colleges: ["Texas Tech"], position: "WR", teams: ["San Francisco 49ers", "Oakland Raiders", "Baltimore Ravens", "Arizona Cardinals"] },
  { name: "Robert Woods", colleges: ["USC"], position: "WR", teams: ["Buffalo Bills", "Los Angeles Rams", "Tennessee Titans"] },
  { name: "Brandin Cooks", colleges: ["Oregon State"], position: "WR", teams: ["New Orleans Saints", "New England Patriots", "Los Angeles Rams", "Houston Texans", "Dallas Cowboys"] },
  { name: "Tyler Boyd", colleges: ["Pittsburgh"], position: "WR", teams: ["Cincinnati Bengals", "Tennessee Titans"] },
  { name: "Diontae Johnson", colleges: ["Toledo"], position: "WR", teams: ["Pittsburgh Steelers", "Carolina Panthers", "Baltimore Ravens"] },
  { name: "Chris Godwin", colleges: ["Penn State"], position: "WR", teams: ["Tampa Bay Buccaneers"] },
  { name: "Allen Robinson", colleges: ["Penn State"], position: "WR", teams: ["Jacksonville Jaguars", "Chicago Bears", "Los Angeles Rams"] },
  { name: "Alshon Jeffery", colleges: ["South Carolina"], position: "WR", teams: ["Chicago Bears", "Philadelphia Eagles"] },
  { name: "Michael Thomas", colleges: ["Ohio State"], position: "WR", teams: ["New Orleans Saints", "Las Vegas Raiders"] },
  { name: "Adam Thielen", colleges: ["Minnesota State-Mankato"], position: "WR", teams: ["Minnesota Vikings", "Carolina Panthers"] },
  { name: "Jarvis Landry", colleges: ["LSU"], position: "WR", teams: ["Miami Dolphins", "Cleveland Browns", "New Orleans Saints"] },
  { name: "Marques Colston", colleges: ["Hofstra"], position: "WR", teams: ["New Orleans Saints"] },
  { name: "T.Y. Hilton", colleges: ["FIU"], position: "WR", teams: ["Indianapolis Colts", "Dallas Cowboys"] },
  { name: "Marqise Lee", colleges: ["USC"], position: "WR", teams: ["Jacksonville Jaguars", "New England Patriots"] },
  { name: "Sammy Watkins", colleges: ["Clemson"], position: "WR", teams: ["Buffalo Bills", "Los Angeles Rams", "Kansas City Chiefs", "Baltimore Ravens"] },
  { name: "Nelson Agholor", colleges: ["USC"], position: "WR", teams: ["Philadelphia Eagles", "Las Vegas Raiders", "New England Patriots", "Baltimore Ravens"] },
  { name: "Will Fuller", colleges: ["Notre Dame"], position: "WR", teams: ["Houston Texans", "Miami Dolphins"] },
  { name: "Mecole Hardman", colleges: ["Georgia"], position: "WR", teams: ["Kansas City Chiefs", "New York Jets"] },
  { name: "Rashod Bateman", colleges: ["Minnesota"], position: "WR", teams: ["Baltimore Ravens"] },
  { name: "Elijah Moore", colleges: ["Ole Miss"], position: "WR", teams: ["New York Jets", "Cleveland Browns"] },
  { name: "Jaylen Waddle", colleges: ["Alabama"], position: "WR", teams: ["Miami Dolphins"] },
  { name: "Treylon Burks", colleges: ["Arkansas"], position: "WR", teams: ["Tennessee Titans"] },
  { name: "Christian Watson", colleges: ["North Dakota State"], position: "WR", teams: ["Green Bay Packers"] },
  { name: "Jaxon Smith-Njigba", colleges: ["Ohio State"], position: "WR", teams: ["Seattle Seahawks"] },
  { name: "Zay Flowers", colleges: ["Boston College"], position: "WR", teams: ["Baltimore Ravens"] },
  { name: "Tank Dell", colleges: ["Houston"], position: "WR", teams: ["Houston Texans"] },
  { name: "Quentin Johnston", colleges: ["TCU"], position: "WR", teams: ["Los Angeles Chargers"] },
  { name: "Josh Downs", colleges: ["North Carolina"], position: "WR", teams: ["Indianapolis Colts"] },
  { name: "Dallas Clark", colleges: ["Iowa"], position: "TE", teams: ["Indianapolis Colts", "Tampa Bay Buccaneers", "Baltimore Ravens"] },
  { name: "Shannon Sharpe", colleges: ["Savannah State"], position: "TE", teams: ["Denver Broncos", "Baltimore Ravens"] },
  { name: "Heath Miller", colleges: ["Virginia"], position: "TE", teams: ["Pittsburgh Steelers"] },
  { name: "Jeremy Shockey", colleges: ["Miami (FL)"], position: "TE", teams: ["New York Giants", "New Orleans Saints", "Carolina Panthers"] },
  { name: "Kellen Winslow Jr.", colleges: ["Miami (FL)"], position: "TE", teams: ["Cleveland Browns", "Tampa Bay Buccaneers", "Seattle Seahawks", "New York Jets"] },
  { name: "Martellus Bennett", colleges: ["Texas A&M"], position: "TE", teams: ["Dallas Cowboys", "New York Giants", "Chicago Bears", "New England Patriots", "Green Bay Packers"] },
  { name: "Greg Olsen", colleges: ["Miami (FL)"], position: "TE", teams: ["Chicago Bears", "Carolina Panthers", "Seattle Seahawks"] },

  { name: "Vernon Davis", colleges: ["Maryland"], position: "TE", teams: ["San Francisco 49ers", "Denver Broncos", "Washington Redskins", "Philadelphia Eagles"] },
  { name: "Owen Daniels", colleges: ["Wisconsin"], position: "TE", teams: ["Houston Texans", "Baltimore Ravens", "Denver Broncos"] },
  { name: "Julius Thomas", colleges: ["Portland State"], position: "TE", teams: ["Denver Broncos", "Jacksonville Jaguars", "Miami Dolphins"] },
  { name: "Jordan Reed", colleges: ["Florida"], position: "TE", teams: ["Washington Redskins", "San Francisco 49ers"] },
  { name: "Eric Ebron", colleges: ["North Carolina"], position: "TE", teams: ["Detroit Lions", "Indianapolis Colts", "Pittsburgh Steelers"] },
  { name: "Zach Ertz", colleges: ["Stanford"], position: "TE", teams: ["Philadelphia Eagles", "Arizona Cardinals"] },
  { name: "Evan Engram", colleges: ["Ole Miss"], position: "TE", teams: ["New York Giants", "Jacksonville Jaguars", "Denver Broncos"] },
  { name: "Hunter Henry", colleges: ["Arkansas"], position: "TE", teams: ["San Diego Chargers", "Los Angeles Chargers", "New England Patriots"] },
  { name: "T.J. Hockenson", colleges: ["Iowa"], position: "TE", teams: ["Detroit Lions", "Minnesota Vikings"] },
  { name: "Pat Freiermuth", colleges: ["Penn State"], position: "TE", teams: ["Pittsburgh Steelers"] },
  { name: "Cole Kmet", colleges: ["Notre Dame"], position: "TE", teams: ["Chicago Bears"] },
  { name: "Sam LaPorta", colleges: ["Iowa"], position: "TE", teams: ["Detroit Lions"] },
  { name: "Dalton Kincaid", colleges: ["Utah"], position: "TE", teams: ["Buffalo Bills"] },
  { name: "Cade Otton", colleges: ["Washington"], position: "TE", teams: ["Tampa Bay Buccaneers"] },
  { name: "Trent Williams", colleges: ["Oklahoma"], position: "OT", teams: ["Washington Redskins", "San Francisco 49ers"] },
  { name: "Terron Armstead", colleges: ["Arkansas-Pine Bluff"], position: "OT", teams: ["New Orleans Saints", "Miami Dolphins"] },
  { name: "Lane Johnson", colleges: ["Oklahoma"], position: "OT", teams: ["Philadelphia Eagles"] },
  { name: "Tyron Smith", colleges: ["USC"], position: "OT", teams: ["Dallas Cowboys", "New York Jets"] },
  { name: "Andrew Whitworth", colleges: ["LSU"], position: "OT", teams: ["Cincinnati Bengals", "Los Angeles Rams"] },
  { name: "Joe Thomas", colleges: ["Wisconsin"], position: "OT", teams: ["Cleveland Browns"] },
  { name: "Quenton Nelson", colleges: ["Notre Dame"], position: "OG", teams: ["Indianapolis Colts"] },
  { name: "Zack Martin", colleges: ["Notre Dame"], position: "OG", teams: ["Dallas Cowboys"] },
  { name: "Jason Peters", colleges: ["Arkansas"], position: "OT", teams: ["Buffalo Bills", "Philadelphia Eagles"] },
  { name: "Luke Kuechly", colleges: ["Boston College"], position: "LB", teams: ["Carolina Panthers"] },
  { name: "Patrick Willis", colleges: ["Ole Miss"], position: "LB", teams: ["San Francisco 49ers"] },
  { name: "NaVorro Bowman", colleges: ["Penn State"], position: "LB", teams: ["San Francisco 49ers", "Oakland Raiders"] },
  { name: "Bobby Wagner", colleges: ["Utah State"], position: "LB", teams: ["Seattle Seahawks", "Los Angeles Rams", "Las Vegas Raiders"] },
  { name: "Lavonte David", colleges: ["Nebraska"], position: "LB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Deion Jones", colleges: ["LSU"], position: "LB", teams: ["Atlanta Falcons", "Cleveland Browns", "Carolina Panthers"] },
  { name: "Shaquil Barrett", colleges: ["Colorado State"], position: "LB", teams: ["Denver Broncos", "Tampa Bay Buccaneers"] },
  { name: "Derrick Brooks", colleges: ["Florida State"], position: "LB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Tedy Bruschi", colleges: ["Arizona"], position: "LB", teams: ["New England Patriots"] },
  { name: "Zach Thomas", colleges: ["Texas Tech"], position: "LB", teams: ["Miami Dolphins", "Dallas Cowboys", "Kansas City Chiefs"] },
  { name: "James Harrison", colleges: ["Kent State"], position: "LB", teams: ["Pittsburgh Steelers", "Cincinnati Bengals"] },
  { name: "LaMarr Woodley", colleges: ["Michigan"], position: "LB", teams: ["Pittsburgh Steelers", "Oakland Raiders"] },
  { name: "DeMarcus Ware", colleges: ["Troy"], position: "LB", teams: ["Dallas Cowboys", "Denver Broncos"] },
  { name: "Landon Collins", colleges: ["Alabama"], position: "LB", teams: ["New York Giants", "Washington Redskins", "Atlanta Falcons"] },
  { name: "Jeremiah Owusu-Koramoah", colleges: ["Notre Dame"], position: "LB", teams: ["Cleveland Browns"] },
  { name: "Roquan Smith", colleges: ["Georgia"], position: "LB", teams: ["Chicago Bears", "Baltimore Ravens"] },
  { name: "Foye Oluokun", colleges: ["Yale"], position: "LB", teams: ["Atlanta Falcons", "Jacksonville Jaguars"] },
  { name: "Eric Kendricks", colleges: ["UCLA"], position: "LB", teams: ["Minnesota Vikings", "Los Angeles Chargers"] },
  { name: "Michael Strahan", colleges: ["Texas Southern"], position: "DE", teams: ["New York Giants"] },
  { name: "Dwight Freeney", colleges: ["Syracuse"], position: "DE", teams: ["Indianapolis Colts", "San Diego Chargers", "Arizona Cardinals", "Atlanta Falcons", "Seattle Seahawks", "Detroit Lions"] },
  { name: "Julius Peppers", colleges: ["North Carolina"], position: "DE", teams: ["Carolina Panthers", "Chicago Bears", "Green Bay Packers"] },
  { name: "Osi Umenyiora", colleges: ["Troy"], position: "DE", teams: ["New York Giants", "Atlanta Falcons"] },
  { name: "Robert Mathis", colleges: ["Alabama A&M"], position: "DE", teams: ["Indianapolis Colts"] },
  { name: "John Abraham", colleges: ["South Carolina"], position: "DE", teams: ["New York Jets", "Atlanta Falcons", "Arizona Cardinals"] },
  { name: "Mario Williams", colleges: ["NC State"], position: "DE", teams: ["Houston Texans", "Buffalo Bills", "Miami Dolphins"] },
  { name: "Joey Bosa", colleges: ["Ohio State"], position: "DE", teams: ["Los Angeles Chargers", "Buffalo Bills"] },
  { name: "Nick Bosa", colleges: ["Ohio State"], position: "DE", teams: ["San Francisco 49ers"] },
  { name: "Maxx Crosby", colleges: ["Eastern Michigan"], position: "DE", teams: ["Las Vegas Raiders"] },
  { name: "Aidan Hutchinson", colleges: ["Michigan"], position: "DE", teams: ["Detroit Lions"] },
  { name: "Will Anderson Jr.", colleges: ["Alabama"], position: "DE", teams: ["Houston Texans"] },
  { name: "Rashan Gary", colleges: ["Michigan"], position: "LB", teams: ["Green Bay Packers"] },
  { name: "Brian Burns", colleges: ["Florida State"], position: "DE", teams: ["Carolina Panthers", "New York Giants"] },
  { name: "Haason Reddick", colleges: ["Temple"], position: "LB", teams: ["Arizona Cardinals", "Carolina Panthers", "Philadelphia Eagles", "New York Jets"] },
  { name: "Leonard Williams", colleges: ["USC"], position: "DT", teams: ["New York Jets", "New York Giants", "Seattle Seahawks"] },
  { name: "Fletcher Cox", colleges: ["Mississippi State"], position: "DT", teams: ["Philadelphia Eagles"] },
  { name: "Grady Jarrett", colleges: ["Clemson"], position: "DT", teams: ["Atlanta Falcons"] },
  { name: "Cameron Jordan", colleges: ["California"], position: "DE", teams: ["New Orleans Saints"] },
  { name: "Daron Payne", colleges: ["Alabama"], position: "DT", teams: ["Washington Commanders"] },
  { name: "Dexter Lawrence", colleges: ["Clemson"], position: "DT", teams: ["New York Giants"] },
  { name: "Chris Jones", colleges: ["Mississippi State"], position: "DT", teams: ["Kansas City Chiefs"] },
  { name: "Quinnen Williams", colleges: ["Alabama"], position: "DT", teams: ["New York Jets", "Dallas Cowboys"] },
  { name: "Warren Sapp", colleges: ["Miami (FL)"], position: "DT", teams: ["Tampa Bay Buccaneers", "Oakland Raiders"] },
  { name: "Vince Wilfork", colleges: ["Miami (FL)"], position: "DT", teams: ["New England Patriots", "Houston Texans"] },
  { name: "Ndamukong Suh", colleges: ["Nebraska"], position: "DT", teams: ["Detroit Lions", "Miami Dolphins", "Los Angeles Rams", "Tampa Bay Buccaneers"] },
  { name: "Haloti Ngata", colleges: ["Oregon"], position: "DT", teams: ["Baltimore Ravens", "Detroit Lions", "Philadelphia Eagles"] },
  { name: "Gerald McCoy", colleges: ["Oklahoma"], position: "DT", teams: ["Tampa Bay Buccaneers", "Carolina Panthers"] },
  { name: "Darrelle Revis", colleges: ["Pittsburgh"], position: "CB", teams: ["New York Jets", "Tampa Bay Buccaneers", "New England Patriots", "Pittsburgh Steelers", "Kansas City Chiefs"] },
  { name: "Nnamdi Asomugha", colleges: ["California"], position: "CB", teams: ["Oakland Raiders", "Philadelphia Eagles", "San Francisco 49ers", "New York Jets"] },
  { name: "Champ Bailey", colleges: ["Georgia"], position: "CB", teams: ["Washington Redskins", "Denver Broncos"] },
  { name: "Asante Samuel", colleges: ["Central Florida"], position: "CB", teams: ["New England Patriots", "Philadelphia Eagles", "Atlanta Falcons"] },
  { name: "Ty Law", colleges: ["Michigan"], position: "CB", teams: ["New England Patriots", "New York Jets", "Denver Broncos", "Kansas City Chiefs"] },
  { name: "Aqib Talib", colleges: ["Kansas"], position: "CB", teams: ["Tampa Bay Buccaneers", "New England Patriots", "Denver Broncos", "Los Angeles Rams"] },
  { name: "Joe Haden", colleges: ["Florida"], position: "CB", teams: ["Cleveland Browns", "Pittsburgh Steelers"] },
  { name: "Stephon Gilmore", colleges: ["South Carolina"], position: "CB", teams: ["Buffalo Bills", "New England Patriots", "Carolina Panthers", "Indianapolis Colts"] },
  { name: "Marshon Lattimore", colleges: ["Ohio State"], position: "CB", teams: ["New Orleans Saints"] },
  { name: "Xavien Howard", colleges: ["Baylor"], position: "CB", teams: ["Miami Dolphins"] },
  { name: "Jaire Alexander", colleges: ["Louisville"], position: "CB", teams: ["Green Bay Packers"] },
  { name: "Denzel Ward", colleges: ["Ohio State"], position: "CB", teams: ["Cleveland Browns"] },
  { name: "Patrick Surtain II", colleges: ["Alabama"], position: "CB", teams: ["Denver Broncos"] },
  { name: "Derek Stingley Jr.", colleges: ["LSU"], position: "CB", teams: ["Houston Texans"] },
  { name: "Marlon Humphrey", colleges: ["Alabama"], position: "CB", teams: ["Baltimore Ravens"] },
  { name: "Darius Slay", colleges: ["Mississippi State"], position: "CB", teams: ["Detroit Lions", "Philadelphia Eagles"] },
  { name: "Byron Jones", colleges: ["Connecticut"], position: "CB", teams: ["Dallas Cowboys", "Miami Dolphins"] },
  { name: "Bryce Young", colleges: ["Alabama"], position: "QB", teams: ["Carolina Panthers"] },
  { name: "Devon Witherspoon", colleges: ["Illinois"], position: "CB", teams: ["Seattle Seahawks"] },
  { name: "Christian Gonzalez", colleges: ["Oregon"], position: "CB", teams: ["New England Patriots"] },
  { name: "Ed Reed", colleges: ["Miami (FL)"], position: "S", teams: ["Baltimore Ravens", "Houston Texans", "New York Jets"] },
  { name: "Brian Dawkins", colleges: ["Clemson"], position: "S", teams: ["Philadelphia Eagles", "Denver Broncos"] },
  { name: "Ronnie Lott", colleges: ["USC"], position: "S", teams: ["San Francisco 49ers", "Los Angeles Raiders", "New York Jets", "Kansas City Chiefs"] },
  { name: "Sean Taylor", colleges: ["Miami (FL)"], position: "S", teams: ["Washington Redskins"] },
  { name: "Bob Sanders", colleges: ["Iowa"], position: "S", teams: ["Indianapolis Colts"] },
  { name: "John Lynch", colleges: ["Stanford"], position: "S", teams: ["Tampa Bay Buccaneers", "Denver Broncos"] },
  { name: "Adrian Wilson", colleges: ["NC State"], position: "S", teams: ["Arizona Cardinals"] },
  { name: "Harrison Smith", colleges: ["Notre Dame"], position: "S", teams: ["Minnesota Vikings"] },
  { name: "Justin Simmons", colleges: ["Boston College"], position: "S", teams: ["Denver Broncos", "Atlanta Falcons"] },
  { name: "Kevin Byard", colleges: ["Middle Tennessee State"], position: "S", teams: ["Tennessee Titans", "Philadelphia Eagles", "Chicago Bears"] },
  { name: "Jordan Poyer", colleges: ["Oregon State"], position: "S", teams: ["Buffalo Bills", "Miami Dolphins"] },
  { name: "Micah Hyde", colleges: ["Iowa"], position: "S", teams: ["Green Bay Packers", "Buffalo Bills"] },
  { name: "Tyrann Mathieu", colleges: ["LSU"], position: "S", teams: ["Arizona Cardinals", "Houston Texans", "Kansas City Chiefs", "New Orleans Saints", "New England Patriots"] },
  { name: "Derwin James", colleges: ["Florida State"], position: "S", teams: ["Los Angeles Chargers"] },
  { name: "Kyle Hamilton", colleges: ["Notre Dame"], position: "S", teams: ["Baltimore Ravens"] },
  { name: "Jordan Love", colleges: ["Utah State"], position: "QB", teams: ["Green Bay Packers"] },
  { name: "Sam Howell", colleges: ["North Carolina"], position: "QB", teams: ["Washington Commanders"] },
  { name: "Hendon Hooker", colleges: ["Virginia Tech", "Tennessee"], position: "QB", teams: ["Detroit Lions"] },
  { name: "Anthony Richardson", colleges: ["Florida"], position: "QB", teams: ["Indianapolis Colts"] },
  { name: "Will Levis", colleges: ["Kentucky", "Penn State"], position: "QB", teams: ["Tennessee Titans"] },
  { name: "Aidan O'Connell", colleges: ["Purdue"], position: "QB", teams: ["Las Vegas Raiders"] },
  { name: "Tommy DeVito", colleges: ["Illinois", "Syracuse"], position: "QB", teams: ["New York Giants"] },
  { name: "Tyler Huntley", colleges: ["Utah"], position: "QB", teams: ["Baltimore Ravens", "Miami Dolphins"] },
  { name: "Josh Dobbs", colleges: ["Tennessee"], position: "QB", teams: ["Pittsburgh Steelers", "Cleveland Browns", "Arizona Cardinals", "Minnesota Vikings"] },
  { name: "Ryan Mallett", colleges: ["Arkansas", "Michigan"], position: "QB", teams: ["New England Patriots", "Houston Texans", "Baltimore Ravens"] },
  { name: "Christian Ponder", colleges: ["Florida State"], position: "QB", teams: ["Minnesota Vikings", "Oakland Raiders"] },
  { name: "EJ Manuel", colleges: ["Florida State"], position: "QB", teams: ["Buffalo Bills"] },
  { name: "Chad Henne", colleges: ["Michigan"], position: "QB", teams: ["Miami Dolphins", "Jacksonville Jaguars", "Kansas City Chiefs"] },
  { name: "Colt McCoy", colleges: ["Texas"], position: "QB", teams: ["Cleveland Browns", "San Francisco 49ers", "Washington Redskins", "New York Giants", "Arizona Cardinals"] },
  { name: "Cordarrelle Patterson", colleges: ["Tennessee"], position: "RB", teams: ["Minnesota Vikings", "Oakland Raiders", "New England Patriots", "Chicago Bears", "Atlanta Falcons"] },
  { name: "Chris Carson", colleges: ["Oklahoma State"], position: "RB", teams: ["Seattle Seahawks"] },
  { name: "Sony Michel", colleges: ["Georgia"], position: "RB", teams: ["New England Patriots", "Los Angeles Rams", "Miami Dolphins"] },
  { name: "Rex Burkhead", colleges: ["Nebraska"], position: "RB", teams: ["Cincinnati Bengals", "New England Patriots", "Houston Texans"] },
  { name: "Damien Harris", colleges: ["Alabama"], position: "RB", teams: ["New England Patriots", "Buffalo Bills"] },
  { name: "Khalil Herbert", colleges: ["Virginia Tech"], position: "RB", teams: ["Chicago Bears"] },
  { name: "Elijah Mitchell", colleges: ["Louisiana"], position: "RB", teams: ["San Francisco 49ers"] },
  { name: "Damien Williams", colleges: ["Oklahoma"], position: "RB", teams: ["Miami Dolphins", "Kansas City Chiefs", "Chicago Bears", "Atlanta Falcons"] },
  { name: "Latavius Murray", colleges: ["UCF"], position: "RB", teams: ["Oakland Raiders", "Minnesota Vikings", "New Orleans Saints", "Baltimore Ravens", "Denver Broncos"] },
  { name: "Giovani Bernard", colleges: ["North Carolina"], position: "RB", teams: ["Cincinnati Bengals", "Tampa Bay Buccaneers"] },
  { name: "Mark Ingram", colleges: ["Alabama"], position: "RB", teams: ["New Orleans Saints", "Baltimore Ravens", "Houston Texans"] },
  { name: "Lamar Miller", colleges: ["Miami (FL)"], position: "RB", teams: ["Miami Dolphins", "Houston Texans"] },
  { name: "C.J. Anderson", colleges: ["California"], position: "RB", teams: ["Denver Broncos", "Carolina Panthers", "Oakland Raiders", "Los Angeles Rams"] },
  { name: "Andre Ellington", colleges: ["Clemson"], position: "RB", teams: ["Arizona Cardinals", "Houston Texans"] },
  { name: "Doug Martin", colleges: ["Boise State"], position: "RB", teams: ["Tampa Bay Buccaneers", "Oakland Raiders"] },
  { name: "BenJarvus Green-Ellis", colleges: ["Ole Miss"], position: "RB", teams: ["New England Patriots", "Cincinnati Bengals"] },
  { name: "Ryan Grant", colleges: ["Notre Dame", "Tulane"], position: "RB", teams: ["New York Giants", "Green Bay Packers", "Indianapolis Colts"] },
  { name: "Darren Sproles", colleges: ["Kansas State"], position: "RB", teams: ["San Diego Chargers", "New Orleans Saints", "Philadelphia Eagles"] },
  { name: "Danny Woodhead", colleges: ["Chadron State"], position: "RB", teams: ["New England Patriots", "San Diego Chargers", "Baltimore Ravens"] },
  { name: "Michael Turner", colleges: ["Northern Illinois"], position: "RB", teams: ["San Diego Chargers", "Atlanta Falcons"] },
  { name: "Rashard Mendenhall", colleges: ["Illinois"], position: "RB", teams: ["Pittsburgh Steelers", "Arizona Cardinals"] },
  { name: "Ryan Mathews", colleges: ["Fresno State"], position: "RB", teams: ["San Diego Chargers", "Philadelphia Eagles"] },
  { name: "Beanie Wells", colleges: ["Ohio State"], position: "RB", teams: ["Arizona Cardinals"] },
  { name: "Pierre Thomas", colleges: ["Illinois"], position: "RB", teams: ["New Orleans Saints", "San Francisco 49ers"] },
  { name: "Sterling Shepard", colleges: ["Oklahoma"], position: "WR", teams: ["New York Giants", "Tampa Bay Buccaneers"] },
  { name: "Corey Davis", colleges: ["Western Michigan"], position: "WR", teams: ["Tennessee Titans", "New York Jets"] },
  { name: "Josh Reynolds", colleges: ["Texas A&M"], position: "WR", teams: ["Los Angeles Rams", "Tennessee Titans", "Detroit Lions"] },
  { name: "Darius Slayton", colleges: ["Auburn"], position: "WR", teams: ["New York Giants"] },
  { name: "Kendall Wright", colleges: ["Baylor"], position: "WR", teams: ["Tennessee Titans", "Chicago Bears", "Minnesota Vikings"] },
  { name: "Harry Douglas", colleges: ["Louisville"], position: "WR", teams: ["Atlanta Falcons", "Tennessee Titans"] },
  { name: "Kevin White", colleges: ["West Virginia"], position: "WR", teams: ["Chicago Bears"] },
  { name: "Breshad Perriman", colleges: ["UCF"], position: "WR", teams: ["Baltimore Ravens", "Cleveland Browns", "Tampa Bay Buccaneers", "New York Jets"] },
  { name: "Mike Williams", colleges: ["Clemson"], position: "WR", teams: ["Los Angeles Chargers", "New York Jets"] },
  { name: "N'Keal Harry", colleges: ["Arizona State"], position: "WR", teams: ["New England Patriots", "Chicago Bears"] },
  { name: "Van Jefferson", colleges: ["Florida"], position: "WR", teams: ["Los Angeles Rams"] },
  { name: "Kadarius Toney", colleges: ["Florida"], position: "WR", teams: ["New York Giants", "Kansas City Chiefs"] },
  { name: "Rondale Moore", colleges: ["Purdue"], position: "WR", teams: ["Arizona Cardinals", "Atlanta Falcons"] },
  { name: "Amon-Ra St. Brown", colleges: ["USC"], position: "WR", teams: ["Detroit Lions"] },
  { name: "Romeo Doubs", colleges: ["Nevada"], position: "WR", teams: ["Green Bay Packers"] },
  { name: "Jayden Reed", colleges: ["Michigan State"], position: "WR", teams: ["Green Bay Packers"] },
  { name: "George Pickens", colleges: ["Georgia"], position: "WR", teams: ["Pittsburgh Steelers", "Dallas Cowboys"] },
  { name: "Drake London", colleges: ["USC"], position: "WR", teams: ["Atlanta Falcons"] },
  { name: "Wan'Dale Robinson", colleges: ["Nebraska", "Kentucky"], position: "WR", teams: ["New York Giants"] },
  { name: "Tyler Higbee", colleges: ["Western Kentucky"], position: "TE", teams: ["Los Angeles Rams"] },
  { name: "Gerald Everett", colleges: ["South Alabama"], position: "TE", teams: ["Los Angeles Rams", "Seattle Seahawks", "Los Angeles Chargers"] },
  { name: "Noah Fant", colleges: ["Iowa"], position: "TE", teams: ["Denver Broncos", "Seattle Seahawks"] },
  { name: "Jonnu Smith", colleges: ["Florida International"], position: "TE", teams: ["Tennessee Titans", "New England Patriots", "Atlanta Falcons", "Pittsburgh Steelers", "Miami Dolphins"] },
  { name: "Taysom Hill", colleges: ["BYU"], position: "QB", teams: ["New Orleans Saints"] },
  { name: "Mo Alie-Cox", colleges: ["VCU"], position: "TE", teams: ["Indianapolis Colts"] },
  { name: "Blake Jarwin", colleges: ["Oklahoma State"], position: "TE", teams: ["Dallas Cowboys"] },
  { name: "Dawson Knox", colleges: ["Ole Miss"], position: "TE", teams: ["Buffalo Bills"] },
  { name: "Tyler Conklin", colleges: ["Central Michigan"], position: "TE", teams: ["Minnesota Vikings", "New York Jets"] },
  { name: "David Njoku", colleges: ["Miami (FL)"], position: "TE", teams: ["Cleveland Browns"] },
  { name: "Irv Smith Jr.", colleges: ["Alabama"], position: "TE", teams: ["Minnesota Vikings", "Cincinnati Bengals"] },
  { name: "Will Dissly", colleges: ["Washington"], position: "TE", teams: ["Seattle Seahawks"] },
  { name: "Demarcus Lawrence", colleges: ["Boise State"], position: "DE", teams: ["Dallas Cowboys"] },
  { name: "Randy Gregory", colleges: ["Nebraska"], position: "DE", teams: ["Dallas Cowboys", "Denver Broncos"] },
  { name: "Za'Darius Smith", colleges: ["Kentucky"], position: "LB", teams: ["Baltimore Ravens", "Green Bay Packers", "Minnesota Vikings", "Philadelphia Eagles"] },
  { name: "Preston Smith", colleges: ["Mississippi State"], position: "LB", teams: ["Washington Redskins", "Green Bay Packers", "Pittsburgh Steelers"] },
  { name: "Alex Highsmith", colleges: ["Charlotte"], position: "LB", teams: ["Pittsburgh Steelers"] },
  { name: "Carl Lawson", colleges: ["Auburn"], position: "DE", teams: ["Cincinnati Bengals", "New York Jets"] },
  { name: "Yannick Ngakoue", colleges: ["Maryland"], position: "DE", teams: ["Jacksonville Jaguars", "Minnesota Vikings", "Baltimore Ravens", "Las Vegas Raiders", "Indianapolis Colts", "Chicago Bears"] },
  { name: "Marcus Davenport", colleges: ["UTSA"], position: "DE", teams: ["New Orleans Saints", "Minnesota Vikings"] },
  { name: "Montez Sweat", colleges: ["Mississippi State"], position: "DE", teams: ["Washington Commanders", "Chicago Bears"] },
  { name: "Travon Walker", colleges: ["Georgia"], position: "DE", teams: ["Jacksonville Jaguars"] },
  { name: "Kayvon Thibodeaux", colleges: ["Oregon"], position: "LB", teams: ["New York Giants"] },
  { name: "Jadeveon Clowney", colleges: ["South Carolina"], position: "DE", teams: ["Houston Texans", "Seattle Seahawks", "Tennessee Titans", "Cleveland Browns", "Baltimore Ravens", "Carolina Panthers", "Dallas Cowboys"] },
  { name: "Chandler Jones", colleges: ["Syracuse"], position: "DE", teams: ["New England Patriots", "Arizona Cardinals", "Las Vegas Raiders"] },
  { name: "Robert Quinn", colleges: ["North Carolina"], position: "DE", teams: ["St. Louis Rams", "Los Angeles Rams", "Miami Dolphins", "Dallas Cowboys", "Chicago Bears", "Philadelphia Eagles"] },
  { name: "Danielle Hunter", colleges: ["LSU"], position: "DE", teams: ["Minnesota Vikings", "Houston Texans"] },
  { name: "Trey Hendrickson", colleges: ["Florida Atlantic"], position: "DE", teams: ["New Orleans Saints", "Cincinnati Bengals"] },
  { name: "Justin Houston", colleges: ["Georgia"], position: "LB", teams: ["Kansas City Chiefs", "Indianapolis Colts", "Baltimore Ravens"] },
  { name: "George Karlaftis", colleges: ["Purdue"], position: "DE", teams: ["Kansas City Chiefs"] },
  { name: "Malcolm Butler", colleges: ["West Alabama"], position: "CB", teams: ["New England Patriots", "Tennessee Titans"] },
  { name: "Chris Harris Jr.", colleges: ["Kansas"], position: "CB", teams: ["Denver Broncos", "Los Angeles Chargers"] },
  { name: "Marcus Peters", colleges: ["Washington"], position: "CB", teams: ["Kansas City Chiefs", "Los Angeles Rams", "Baltimore Ravens"] },
  { name: "Josh Norman", colleges: ["Coastal Carolina"], position: "CB", teams: ["Carolina Panthers", "Washington Redskins", "Buffalo Bills", "San Francisco 49ers", "Jacksonville Jaguars"] },
  { name: "Brandon Browner", colleges: ["Oregon State"], position: "CB", teams: ["Seattle Seahawks", "New England Patriots", "New Orleans Saints"] },
  { name: "Deangelo Hall", colleges: ["Virginia Tech"], position: "CB", teams: ["Atlanta Falcons", "Oakland Raiders", "Washington Redskins"] },
  { name: "Kendall Fuller", colleges: ["Virginia Tech"], position: "CB", teams: ["Washington Redskins", "Kansas City Chiefs"] },
  { name: "Eli Apple", colleges: ["Ohio State"], position: "CB", teams: ["New York Giants", "New Orleans Saints", "Carolina Panthers"] },
  { name: "Adoree' Jackson", colleges: ["USC"], position: "CB", teams: ["Tennessee Titans", "New York Giants"] },
  { name: "Tre'Davious White", colleges: ["LSU"], position: "CB", teams: ["Buffalo Bills"] },
  { name: "Terence Newman", colleges: ["Kansas State"], position: "CB", teams: ["Dallas Cowboys", "Cincinnati Bengals", "Minnesota Vikings"] },
  { name: "Quandre Diggs", colleges: ["Texas"], position: "S", teams: ["Detroit Lions", "Seattle Seahawks"] },
  { name: "Jessie Bates III", colleges: ["Wake Forest"], position: "S", teams: ["Cincinnati Bengals", "Atlanta Falcons"] },
  { name: "Marcus Williams", colleges: ["Utah"], position: "S", teams: ["New Orleans Saints", "Baltimore Ravens"] },
  { name: "Minkah Fitzpatrick", colleges: ["Alabama"], position: "S", teams: ["Miami Dolphins", "Pittsburgh Steelers"] },
  { name: "Derwin James", colleges: ["Florida State"], position: "S", teams: ["Los Angeles Chargers"] },
  { name: "Jamal Adams", colleges: ["LSU"], position: "S", teams: ["New York Jets", "Seattle Seahawks", "Tennessee Titans", "Las Vegas Raiders"] },
  { name: "Bernard Pollard", colleges: ["Purdue"], position: "S", teams: ["Kansas City Chiefs", "Houston Texans", "Baltimore Ravens", "Tennessee Titans"] },
  { name: "Eric Berry", colleges: ["Tennessee"], position: "S", teams: ["Kansas City Chiefs"] },
  { name: "Kam Chancellor", colleges: ["Virginia Tech"], position: "S", teams: ["Seattle Seahawks"] },
  { name: "Reshad Jones", colleges: ["Georgia"], position: "S", teams: ["Miami Dolphins"] },
  { name: "Earl Thomas", colleges: ["Texas"], position: "S", teams: ["Seattle Seahawks", "Baltimore Ravens"] },
  { name: "Marc Bulger", colleges: ["West Virginia"], position: "QB", teams: ["St. Louis Rams"] },
  { name: "Randall Cunningham", colleges: ["UNLV"], position: "QB", teams: ["Philadelphia Eagles", "Minnesota Vikings", "Dallas Cowboys", "Baltimore Ravens"] },
  { name: "Warren Moon", colleges: ["Washington"], position: "QB", teams: ["Houston Oilers", "Minnesota Vikings", "Seattle Seahawks", "Kansas City Chiefs"] },
  { name: "Drew Bledsoe", colleges: ["Washington State"], position: "QB", teams: ["New England Patriots", "Buffalo Bills", "Dallas Cowboys"] },
  { name: "Donovan McNabb", colleges: ["Syracuse"], position: "QB", teams: ["Philadelphia Eagles", "Washington Redskins", "Minnesota Vikings"] },
  { name: "Daunte Culpepper", colleges: ["UCF"], position: "QB", teams: ["Minnesota Vikings", "Miami Dolphins", "Oakland Raiders", "Detroit Lions"] },
  { name: "Tarvaris Jackson", colleges: ["Alabama State", "Iowa State"], position: "QB", teams: ["Minnesota Vikings", "Seattle Seahawks", "Buffalo Bills"] },
  { name: "Terrell Davis", colleges: ["Georgia"], position: "RB", teams: ["Denver Broncos"] },
  { name: "Jerome Bettis", colleges: ["Notre Dame"], position: "RB", teams: ["Los Angeles Rams", "Pittsburgh Steelers"] },
  { name: "Ricky Williams", colleges: ["Texas"], position: "RB", teams: ["New Orleans Saints", "Miami Dolphins", "Baltimore Ravens"] },
  { name: "Corey Dillon", colleges: ["Washington"], position: "RB", teams: ["Cincinnati Bengals", "New England Patriots"] },
  { name: "Priest Holmes", colleges: ["Texas"], position: "RB", teams: ["Baltimore Ravens", "Kansas City Chiefs"] },
  { name: "Tiki Barber", colleges: ["Virginia"], position: "RB", teams: ["New York Giants"] },
  { name: "Earl Campbell", colleges: ["Texas"], position: "RB", teams: ["Houston Oilers", "New Orleans Saints"] },
  { name: "John Riggins", colleges: ["Kansas"], position: "RB", teams: ["New York Jets", "Washington Redskins"] },
  { name: "Franco Harris", colleges: ["Penn State"], position: "RB", teams: ["Pittsburgh Steelers", "Seattle Seahawks"] },
  { name: "Marion Barber", colleges: ["Minnesota"], position: "RB", teams: ["Dallas Cowboys", "Chicago Bears"] },
  { name: "Kevin Smith", colleges: ["UCF"], position: "RB", teams: ["Detroit Lions"] },
  { name: "Cadillac Williams", colleges: ["Auburn"], position: "RB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Carnell Williams", colleges: ["Auburn"], position: "RB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Michael Bush", colleges: ["Louisville"], position: "RB", teams: ["Oakland Raiders", "Chicago Bears"] },
  { name: "Jonathan Stewart", colleges: ["Oregon"], position: "RB", teams: ["Carolina Panthers", "New York Giants"] },
  { name: "Anquan Boldin", colleges: ["Florida State"], position: "WR", teams: ["Arizona Cardinals", "Baltimore Ravens", "San Francisco 49ers", "Detroit Lions", "Buffalo Bills"] },
  { name: "Tim Brown", colleges: ["Notre Dame"], position: "WR", teams: ["Los Angeles Raiders", "Oakland Raiders", "Tampa Bay Buccaneers"] },
  { name: "Michael Irvin", colleges: ["Miami (FL)"], position: "WR", teams: ["Dallas Cowboys"] },
  { name: "Cris Carter", colleges: ["Ohio State"], position: "WR", teams: ["Philadelphia Eagles", "Minnesota Vikings", "Miami Dolphins"] },
  { name: "Ben Watson", colleges: ["Georgia"], position: "TE", teams: ["New England Patriots", "Cleveland Browns", "New Orleans Saints", "Baltimore Ravens"] },
  { name: "Alge Crumpler", colleges: ["North Carolina"], position: "TE", teams: ["Atlanta Falcons", "Tennessee Titans", "New England Patriots"] },
  { name: "L.J. Smith", colleges: ["Rutgers"], position: "TE", teams: ["Philadelphia Eagles", "Baltimore Ravens"] },
  { name: "Richard Seymour", colleges: ["Georgia"], position: "DT", teams: ["New England Patriots", "Oakland Raiders"] },
  { name: "Ronde Barber", colleges: ["Virginia"], position: "CB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Antrel Rolle", colleges: ["Miami (FL)"], position: "CB", teams: ["Arizona Cardinals", "New York Giants", "Chicago Bears"] },
  { name: "Rashean Mathis", colleges: ["Bethune-Cookman"], position: "CB", teams: ["Jacksonville Jaguars", "Detroit Lions"] },
  { name: "Lito Sheppard", colleges: ["Florida"], position: "CB", teams: ["Philadelphia Eagles", "New York Jets"] },
  { name: "Bijan Robinson", colleges: ["Texas"], position: "RB", teams: ["Atlanta Falcons"] },
  { name: "Jahmyr Gibbs", colleges: ["Georgia Tech", "Alabama"], position: "RB", teams: ["Detroit Lions"] },
  { name: "Jaylen Wright", colleges: ["Tennessee"], position: "RB", teams: ["Miami Dolphins"] },
  { name: "MarShawn Lloyd", colleges: ["USC"], position: "RB", teams: ["Green Bay Packers"] },
  { name: "Rome Odunze", colleges: ["Washington"], position: "WR", teams: ["Chicago Bears"] },
  { name: "Malik Nabers", colleges: ["LSU"], position: "WR", teams: ["New York Giants"] },
  { name: "Brian Thomas Jr.", colleges: ["LSU"], position: "WR", teams: ["Jacksonville Jaguars"] },
  { name: "Ladd McConkey", colleges: ["Georgia"], position: "WR", teams: ["Los Angeles Chargers"] },
  { name: "Xavier Worthy", colleges: ["Texas"], position: "WR", teams: ["Kansas City Chiefs"] },
  { name: "Keon Coleman", colleges: ["Michigan State", "Florida State"], position: "WR", teams: ["Buffalo Bills"] },
  { name: "Ja'Lynn Polk", colleges: ["Washington"], position: "WR", teams: ["New England Patriots"] },
  { name: "Trey McBride", colleges: ["Colorado State"], position: "TE", teams: ["Arizona Cardinals"] },
  { name: "Brock Bowers", colleges: ["Georgia"], position: "TE", teams: ["Las Vegas Raiders"] },
  { name: "Laiatu Latu", colleges: ["UCLA", "Idaho"], position: "DE", teams: ["Indianapolis Colts"] },
  { name: "Jared Verse", colleges: ["Florida State", "Albany"], position: "DE", teams: ["Los Angeles Rams"] },
  { name: "Dallas Turner", colleges: ["Alabama"], position: "LB", teams: ["Minnesota Vikings"] },
  { name: "Byron Murphy II", colleges: ["Texas"], position: "DT", teams: ["Minnesota Vikings"] },
  { name: "Nate Wiggins", colleges: ["Clemson"], position: "CB", teams: ["Baltimore Ravens"] },
  { name: "Quinyon Mitchell", colleges: ["Toledo"], position: "CB", teams: ["Philadelphia Eagles"] },
  { name: "Terrion Arnold", colleges: ["Alabama"], position: "CB", teams: ["Detroit Lions"] },
  { name: "Kamren Kinchens", colleges: ["Miami (FL)"], position: "S", teams: ["Miami Dolphins"] },
  { name: "Steve McNair", colleges: ["Alcorn State"], position: "QB", teams: ["Tennessee Titans", "Baltimore Ravens"] },
  { name: "Spencer Rattler", colleges: ["Oklahoma", "South Carolina"], position: "QB", teams: ["New Orleans Saints"] },
  { name: "James Cook", colleges: ["Georgia"], position: "RB", teams: ["Buffalo Bills"] },
  { name: "Kyren Williams", colleges: ["Notre Dame"], position: "RB", teams: ["Los Angeles Rams"] },
  { name: "Chase Brown", colleges: ["Illinois"], position: "RB", teams: ["Cincinnati Bengals"] },
  { name: "Chuba Hubbard", colleges: ["Oklahoma State"], position: "RB", teams: ["Carolina Panthers"] },
  { name: "Isiah Pacheco", colleges: ["Rutgers"], position: "RB", teams: ["Kansas City Chiefs"] },
  { name: "Rhamondre Stevenson", colleges: ["Oklahoma"], position: "RB", teams: ["New England Patriots"] },
  { name: "Brian Robinson Jr.", colleges: ["Alabama"], position: "RB", teams: ["Washington Commanders"] },
  { name: "Tyler Allgeier", colleges: ["BYU"], position: "RB", teams: ["Atlanta Falcons"] },
  { name: "Tyjae Spears", colleges: ["Tulane"], position: "RB", teams: ["Tennessee Titans"] },
  { name: "Tank Bigsby", colleges: ["Auburn"], position: "RB", teams: ["Jacksonville Jaguars"] },
  { name: "Bucky Irving", colleges: ["Oregon"], position: "RB", teams: ["Tampa Bay Buccaneers"] },
  { name: "Jordan Mason", colleges: ["Georgia Tech"], position: "RB", teams: ["San Francisco 49ers", "Minnesota Vikings"] },
  { name: "Alec Pierce", colleges: ["Cincinnati"], position: "WR", teams: ["Indianapolis Colts"] },
  { name: "Chris Olave", colleges: ["Ohio State"], position: "WR", teams: ["New Orleans Saints"] },
  { name: "Michael Pittman Jr.", colleges: ["USC"], position: "WR", teams: ["Indianapolis Colts"] },
  { name: "Rashee Rice", colleges: ["SMU"], position: "WR", teams: ["Kansas City Chiefs"] },
  { name: "Marquez Valdes-Scantling", colleges: ["South Florida"], position: "WR", teams: ["Green Bay Packers", "Kansas City Chiefs", "New Orleans Saints"] },
  { name: "Dyami Brown", colleges: ["North Carolina"], position: "WR", teams: ["Washington Commanders"] },
  { name: "Josh Palmer", colleges: ["Tennessee"], position: "WR", teams: ["Los Angeles Chargers", "Buffalo Bills"] },
  { name: "Jameson Williams", colleges: ["Ohio State", "Alabama"], position: "WR", teams: ["Detroit Lions"] },
  { name: "Jakobi Meyers", colleges: ["NC State"], position: "WR", teams: ["New England Patriots", "Las Vegas Raiders"] },
  { name: "Donovan Peoples-Jones", colleges: ["Michigan"], position: "WR", teams: ["Cleveland Browns", "Detroit Lions"] },
  { name: "Nico Collins", colleges: ["Michigan"], position: "WR", teams: ["Houston Texans"] },
  { name: "Courtland Sutton", colleges: ["SMU"], position: "WR", teams: ["Denver Broncos"] },
  { name: "Christian Kirk", colleges: ["Texas A&M"], position: "WR", teams: ["Arizona Cardinals", "Jacksonville Jaguars"] },
  { name: "Darnell Mooney", colleges: ["Tulane"], position: "WR", teams: ["Chicago Bears", "Atlanta Falcons"] },
  { name: "Tucker Kraft", colleges: ["South Dakota State"], position: "TE", teams: ["Green Bay Packers"] },
  { name: "Isaiah Likely", colleges: ["Coastal Carolina"], position: "TE", teams: ["Baltimore Ravens"] },
  { name: "Chigoziem Okonkwo", colleges: ["Maryland"], position: "TE", teams: ["Tennessee Titans"] },
  { name: "Cole Turner", colleges: ["Nevada"], position: "TE", teams: ["Washington Commanders"] }];

function normalize(s) {
  return s.toLowerCase()
    .replace(/university of /g,"").replace(/\buniversity\b/g,"")
    .replace(/\bcollege\b/g,"").replace(/\bstate\b/g,"st")
    .replace(/[^a-z0-9]/g,"").trim();
}
const ALIASES = {
  "usc":["southern california","southern cal"],"lsu":["louisiana state"],
  "smu":["southern methodist"],"tcu":["texas christian"],"byu":["brigham young"],
  "ole miss":["mississippi","miss"],"mississippi st":["miss state","miss st"],"miami fl":["miami florida","miami"],
  "miami oh":["miami ohio"],"unc":["north carolina"],"nc state":["north carolina state"],
  "pitt":["pittsburgh"],"penn st":["penn state"],"ohio st":["ohio state"],
  "michigan st":["michigan state"],"florida st":["florida state"],"utep":["texas el paso"],
  "bama":["alabama"],"roll tide":["alabama"],"cal":["california"],"cuse":["syracuse"],
  "chattanooga":["tennessee-chattanooga"],"utc":["tennessee-chattanooga"],
  "wvu":["west virginia"],"vt":["virginia tech"],"hokies":["virginia tech"],
  "wsu":["washington state"],"asu":["arizona state"],"csu":["colorado state"],
  "ksu":["kansas state"],"isu":["iowa state"],"bsu":["boise state"],
  "usu":["utah state"],"ndsu":["north dakota state"],
  "gt":["georgia tech"],"bc":["boston college"],
  "uconn":["connecticut"],"umass":["massachusetts"],
  "ecu":["east carolina"],
};
function checkAnswer(guess, colleges) {
  const g = normalize(guess);
  for (const college of colleges) {
    const c = normalize(college);
    if (g === c) return true;
    // startsWith match: only allow if college is NOT a "state" school (ends in "st")
    // OR if the guess itself ends in "st" (user typed "state" or "st")
    if (c.startsWith(g) && g.length >= 4 && !c.endsWith("st")) return true;
    if (c.startsWith(g) && g.length >= 4 && c.endsWith("st") && g.endsWith("st")) return true;
    // Alias match: each alias group defines a set of equivalent forms for one school
    for (const [key,variants] of Object.entries(ALIASES)) {
      const allForms = [normalize(key), ...variants.map(normalize)];
      // If guess matches any form in the group, AND college matches any form in the group
      if (allForms.includes(g) && allForms.includes(c)) return true;
    }
  }
  return false;
}

function shuffle(arr) {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
  return a;
}

export default function App() {
  const [phase, setPhase] = useState("idle");
  const [player, setPlayer] = useState(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState([]);
  const [queue, setQueue] = useState([]);
  const [shake, setShake] = useState(false);
  const [showGiveUp, setShowGiveUp] = useState(false);
  const [milestone, setMilestone] = useState(null);

  const MILESTONES = {
    5:  { emoji: "📈", msg: "Good Start" },
    10: { emoji: "🧠", msg: "Looks like we've got a ball knower on our hands." },
    15: { emoji: "🧃", msg: "Someone has juice." },
    20: { emoji: "🧐", msg: "You better not be looking these up." },
    25: { emoji: "🧱", msg: "Alright you're built different." },
    30: { emoji: "😱", msg: "Mel Kiper Jr. is that you?" },
    40: { emoji: "🤜", msg: "Everything else can wait. Keep going." },
    50: { emoji: "🐐", msg: "Ok goat." },
  };
  const inputRef = useRef(null);

  useEffect(() => { setQueue(shuffle(PLAYERS)); }, []);



  function nextPlayer(q) {
    const nq = q.length > 0 ? q : shuffle(PLAYERS);
    setPlayer(nq[0]); setQueue(nq.slice(1));
    setAnswer(""); setAttempts(0); setShake(false); setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 80);
  }

  function handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!answer.trim() || phase !== "playing") return;
    const correct = checkAnswer(answer.trim(), player.colleges);
    if (correct) {
      const ns = streak + 1; setStreak(ns);
      if (ns > bestStreak) setBestStreak(ns);
      setHistory(h => [...h, { name: player.name, colleges: player.colleges, correct: true }]);
      setPhase("correct");
      if (MILESTONES[ns]) {
        setMilestone(MILESTONES[ns]);
        setTimeout(() => setMilestone(null), 3000);
      }
      setTimeout(() => nextPlayer(queue), 2000);
    } else {
      const na = attempts + 1; setShake(true); setTimeout(() => setShake(false), 500);
      if (na >= 3) {
        setStreak(0);
        setHistory(h => [...h, { name: player.name, colleges: player.colleges, correct: false }]);
        setAttempts(na); setPhase("reveal");
        setTimeout(() => nextPlayer(queue), 3000);
      } else {
        setAttempts(na); setAnswer(""); inputRef.current?.focus();
      }
    }
  }

  const posColor = player ? (POS_COLORS[player.position] || "#888") : "#888";
  const borderColor = phase === "correct" ? "#2ecc71" : phase === "reveal" ? "#e74c3c" : "#181830";

  return (
    <div style={{
      minHeight:"100vh", background:"#07070f",
      backgroundImage:"radial-gradient(ellipse at 50% 0%,#10102a 0%,#07070f 60%)",
      color:"#f0f0f0", fontFamily:"Georgia,serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:"28px 16px 56px",
    }}>
      <style>{`
        @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
        @keyframes milestoneIn{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
        .fadein{animation:fadeUp .35s cubic-bezier(.22,1,.36,1) both}
      `}</style>

      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:9,letterSpacing:7,color:"#1c1c38",textTransform:"uppercase",marginBottom:8}}>NFL College Trivia</div>
        <h1 style={{
          fontSize:"clamp(28px,6vw,50px)",fontWeight:900,margin:0,lineHeight:1,
          background:"linear-gradient(135deg,#8a6020,#e8c85a,#c8971e,#e8c85a,#8a6020)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",letterSpacing:-1,
        }}>{"Where'd He Play?"}</h1>
        <p style={{color:"#222240",fontSize:10,margin:"8px 0 0",letterSpacing:3,textTransform:"uppercase"}}>
          Name the college &middot; 3 tries &middot; keep your streak
        </p>
      </div>

      <div style={{
        display:"flex",marginBottom:24,background:"#0b0b1e",
        border:"1px solid #161632",borderRadius:12,overflow:"hidden",
      }}>
        <>
          <div style={{padding:"13px 36px",textAlign:"center",borderRight:"1px solid #161632"}}>
            <div style={{fontSize:26,fontWeight:900,color:streak>=5?"#e74c3c":"#c8a050",lineHeight:1}}>{streak}</div>
            <div style={{fontSize:8,color:"#222240",letterSpacing:4,textTransform:"uppercase",marginTop:3}}>Streak{streak>=1?" 🔥":""}</div>
          </div>
          <div style={{padding:"13px 36px",textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:900,color:"#c8a050",lineHeight:1}}>{bestStreak}</div>
            <div style={{fontSize:8,color:"#222240",letterSpacing:4,textTransform:"uppercase",marginTop:3}}>Best</div>
          </div>
        </>
      </div>

      <div className="fadein" key={player?.name||"idle"} style={{
        width:"100%",maxWidth:420,
        background:"linear-gradient(165deg,#0e0e22,#080816)",
        border:`2px solid ${borderColor}`,
        borderRadius:22,padding:"30px 26px 26px",
        boxShadow:"0 16px 60px #00000099",
        display:"flex",flexDirection:"column",alignItems:"center",
        transition:"border-color .4s, box-shadow .4s",
      }}>

        {phase==="idle" && (
          <div style={{textAlign:"center",padding:"8px 0"}}>
            <div style={{fontSize:52,marginBottom:16}}>{"🏈"}</div>
            <p style={{color:"#2a2a50",fontSize:13,lineHeight:1.9,marginBottom:24,maxWidth:280}}>
              A player appears. Guess what college they attended. 3 tries per player.
            </p>
            <button onClick={()=>nextPlayer(queue)} style={{
              background:"linear-gradient(135deg,#8a6020,#c8971e,#e8c85a)",
              color:"#07070f",border:"none",borderRadius:10,
              padding:"13px 38px",fontSize:14,fontWeight:900,
              cursor:"pointer",letterSpacing:1.5,textTransform:"uppercase",
            }}>Start Game</button>
          </div>
        )}
        {(phase==="playing"||phase==="correct"||phase==="reveal") && player && (
          <div style={{width:"100%",textAlign:"center"}}>

            <h2 style={{
              fontSize:"clamp(20px,5vw,30px)",fontWeight:900,margin:"0 0 4px",lineHeight:1.2,
              color:phase==="correct"?"#2ecc71":phase==="reveal"?"#e74c3c":"#eeeeee",
              transition:"color .3s",letterSpacing:-0.5,textAlign:"center",
            }}>{player.name}</h2>

            <div style={{
              display:"inline-flex",alignItems:"center",gap:6,
              background:posColor+"18",border:`1px solid ${posColor}44`,
              borderRadius:100,padding:"3px 12px",margin:"0 0 4px",
            }}>
              <span style={{color:posColor,fontSize:10,fontWeight:800,letterSpacing:1}}>{player.position}</span>
            </div>

            <div style={{fontSize:10,color:"#222244",margin:"4px 0 16px",lineHeight:1.9}}>
              {player.teams.join(" \u00B7 ")}
            </div>

            <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:18}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{
                  width:10,height:10,borderRadius:"50%",
                  background:phase==="reveal"?"#e74c3c":i<attempts?"#e74c3c":i===attempts&&phase==="playing"?posColor:"transparent",
                  border:`2px solid ${phase==="reveal"?"#e74c3c77":i<attempts?"#e74c3c77":i===attempts&&phase==="playing"?posColor:"#1e1e3c"}`,
                  boxShadow:i===attempts&&phase==="playing"?`0 0 8px ${posColor}88`:"none",
                  transition:"all .3s",
                }}/>
              ))}
            </div>

            {(phase==="correct"||phase==="reveal") && (
              <div style={{
                marginBottom:14,padding:"12px 18px",
                background:"#080818",borderRadius:10,
                border:`1px solid ${phase==="correct"?"#2ecc7130":"#e74c3c30"}`,
              }}>
                <div style={{fontSize:10,color:"#252548",marginBottom:3,letterSpacing:1.5,textTransform:"uppercase"}}>
                  {phase==="correct"?"Correct!":"Answer"}
                </div>
                <div style={{fontSize:20,fontWeight:900,color:phase==="correct"?"#2ecc71":"#e74c3c"}}>
                  {player.colleges.join(" / ")}
                </div>
                <div style={{fontSize:9,color:"#161632",marginTop:5,letterSpacing:2,textTransform:"uppercase"}}>Next player incoming</div>
              </div>
            )}
            {phase==="playing" && (
              <div style={{display:"flex",gap:8,animation:shake?"shake .5s ease":"none"}}>
                <input ref={inputRef} value={answer} onChange={e=>setAnswer(e.target.value)}
                  onKeyDown={e=>{ if(e.key==="Enter") handleSubmit(e); }}
                  placeholder="Type the college..."
                  style={{
                    flex:1,background:"#07071a",border:"2px solid #141432",
                    borderRadius:10,padding:"12px 14px",fontSize:16,
                    color:"#f0f0f0",outline:"none",fontFamily:"Georgia,serif",
                    transition:"border-color .2s",
                  }}
                  onFocus={e=>e.target.style.borderColor=posColor}
                  onBlur={e=>e.target.style.borderColor="#141432"}
                  autoComplete="off"
                />
                <button onClick={handleSubmit} style={{
                  background:posColor,color:"#07070f",border:"none",
                  borderRadius:10,padding:"12px 20px",fontSize:17,fontWeight:900,
                  cursor:"pointer",boxShadow:`0 4px 14px ${posColor}55`,
                }}>{"→"}</button>
              </div>
            )}

            {phase==="playing" && (
              <button onClick={()=>setShowGiveUp(true)} style={{
                marginTop:10,width:"100%",background:"transparent",
                color:"#2a2a48",border:"1px solid #1a1a34",borderRadius:10,
                padding:"8px 0",fontSize:11,fontWeight:700,cursor:"pointer",
                letterSpacing:1.5,textTransform:"uppercase",transition:"color .2s, border-color .2s",
              }}
                onMouseEnter={e=>{e.target.style.color="#e74c3c";e.target.style.borderColor="#e74c3c44";}}
                onMouseLeave={e=>{e.target.style.color="#2a2a48";e.target.style.borderColor="#1a1a34";}}
              >No Idea</button>
            )}

          </div>
        )}
      </div>

      {milestone && (
        <div style={{
          position:"fixed",inset:0,display:"flex",alignItems:"center",
          justifyContent:"center",zIndex:999,pointerEvents:"none",
        }}>
          <div style={{
            background:"linear-gradient(135deg,#1a1a3e,#0f0f2a)",
            border:"2px solid #c8a05055",
            borderRadius:20,padding:"32px 40px",textAlign:"center",
            boxShadow:"0 0 60px #c8a05033,0 20px 60px #00000088",
            animation:"milestoneIn .35s cubic-bezier(.34,1.56,.64,1)",
            maxWidth:320,
          }}>
            <div style={{fontSize:52,lineHeight:1,marginBottom:12}}>{milestone.emoji}</div>
            <div style={{
              fontSize:13,fontWeight:900,color:"#c8a050",letterSpacing:3,
              textTransform:"uppercase",marginBottom:8,
            }}>
              {Object.keys(MILESTONES).find(k => MILESTONES[k] === milestone)} streak
            </div>
            <div style={{fontSize:17,color:"#e8e8f0",fontFamily:"Georgia,serif",lineHeight:1.5}}>
              {milestone.msg}
            </div>
          </div>
        </div>
      )}

      {showGiveUp && (
        <div style={{
          position:"fixed",inset:0,background:"#000000bb",
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,
        }}>
          <div style={{
            background:"#0e0e22",border:"2px solid #e74c3c55",borderRadius:18,
            padding:"32px 28px",maxWidth:320,width:"90%",textAlign:"center",
            boxShadow:"0 24px 80px #000000cc",
          }}>
            <h3 style={{margin:"0 0 10px",fontSize:18,fontWeight:900,color:"#eeeeee"}}>Give up?</h3>
            <p style={{margin:"0 0 24px",fontSize:13,color:"#444466",lineHeight:1.7}}>
              Your current streak of <span style={{color:"#e74c3c",fontWeight:900}}>{streak}</span> will end.
            </p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setShowGiveUp(false)} style={{
                flex:1,background:"#141432",color:"#aaaacc",border:"1px solid #252548",
                borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:700,cursor:"pointer",
              }}>Cancel</button>
              <button onClick={()=>{
                setShowGiveUp(false);
                setStreak(0);
                setHistory(h=>[...h,{name:player.name,colleges:player.colleges,correct:false}]);
                setAttempts(3);
                setPhase("reveal");
                setTimeout(()=>nextPlayer(queue),3000);
              }} style={{
                flex:1,background:"#e74c3c",color:"#fff",border:"none",
                borderRadius:10,padding:"11px 0",fontSize:13,fontWeight:900,cursor:"pointer",
                boxShadow:"0 4px 14px #e74c3c44",
              }}>No Idea</button>
            </div>
          </div>
        </div>
      )}
      {history.length>0&&(
        <div style={{width:"100%",maxWidth:420,marginTop:20}}>
          <div style={{fontSize:8,letterSpacing:6,color:"#121228",textTransform:"uppercase",marginBottom:8}}>Recent</div>
          {[...history].reverse().slice(0,8).map((h,i)=>(
            <div key={i} style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"8px 13px",marginBottom:4,background:"#09091c",
              border:`1px solid ${h.correct?"#2ecc7115":"#e74c3c15"}`,
              borderRadius:9,fontSize:12,
            }}>
              <span style={{color:"#666688",fontWeight:700}}>{h.name}</span>
              <span style={{color:"#202040",fontSize:10}}>{h.colleges.join(" / ")}</span>
              <span style={{color:h.correct?"#2ecc71":"#e74c3c",fontSize:16}}>{h.correct?"✓":"✗"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
