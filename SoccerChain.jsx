import { useState, useRef, useEffect, useCallback, useMemo } from “react”;
import { Helmet } from “react-helmet-async”;
import { usePlayCount } from “./usePlayCount.jsx”;
import { SOCCER_PLAYERS } from “./soccerChainPlayers.js”;

// ── DATA ─────────────────────────────────────────────────────────────────────

// Derive all unique teams from player data
const ALL_TEAMS = […new Set(SOCCER_PLAYERS.flatMap(p => p.teams))].sort();

const TEAM_ALIASES = {
// ── PREMIER LEAGUE ──
“Arsenal”:[“arsenal”,“gunners”,“afc”],
“Aston Villa”:[“aston villa”,“villa”,“avfc”],
“AFC Bournemouth”:[“bournemouth”,“afc bournemouth”,“cherries”],
“Brentford”:[“brentford”,“bees”],
“Brighton & Hove Albion”:[“brighton”,“brighton and hove albion”,“brighton hove albion”,“seagulls”,“bha”],
“Burnley”:[“burnley”,“clarets”],
“Chelsea”:[“chelsea”,“blues”,“cfc”],
“Crystal Palace”:[“crystal palace”,“palace”,“cpfc”,“eagles”],
“Everton”:[“everton”,“toffees”,“efc”],
“Fulham”:[“fulham”,“cottagers”,“ffc”],
“Leeds United”:[“leeds”,“leeds united”,“lufc”],
“Leicester City”:[“leicester”,“leicester city”,“foxes”,“lcfc”],
“Liverpool”:[“liverpool”,“reds”,“lfc”],
“Manchester City”:[“manchester city”,“man city”,“city”,“mcfc”,“man c”],
“Manchester United”:[“manchester united”,“man united”,“man utd”,“united”,“mufc”,“man u”],
“Newcastle United”:[“newcastle”,“newcastle united”,“magpies”,“nufc”,“toon”],
“Norwich City”:[“norwich”,“norwich city”,“canaries”,“ncfc”],
“Nottingham Forest”:[“nottingham forest”,“forest”,“nffc”,“notts forest”],
“Sheffield United”:[“sheffield united”,“sheffield utd”,“blades”,“sufc”],
“Southampton”:[“southampton”,“saints”,“soton”],
“Sunderland”:[“sunderland”,“black cats”,“safc”],
“Tottenham Hotspur”:[“tottenham”,“spurs”,“tottenham hotspur”,“thfc”,“tot”],
“Watford”:[“watford”,“hornets”,“wfc”],
“West Bromwich Albion”:[“west brom”,“west bromwich albion”,“west bromwich”,“wba”,“baggies”],
“West Ham United”:[“west ham”,“west ham united”,“hammers”,“whu”,“whufc”],
“Wolverhampton Wanderers”:[“wolves”,“wolverhampton”,“wolverhampton wanderers”,“wwfc”],
“Stoke City”:[“stoke”,“stoke city”,“potters”],
“Swansea City”:[“swansea”,“swansea city”,“swans”,“jacks”],
“Hull City”:[“hull”,“hull city”,“tigers”],
“Cardiff City”:[“cardiff”,“cardiff city”,“bluebirds”],
“Middlesbrough”:[“middlesbrough”,“boro”],
“Huddersfield Town”:[“huddersfield”,“huddersfield town”,“terriers”],
“Blackburn Rovers”:[“blackburn”,“blackburn rovers”,“rovers”],
“Bolton Wanderers”:[“bolton”,“bolton wanderers”,“trotters”],
“Wigan Athletic”:[“wigan”,“wigan athletic”,“latics”],
“Birmingham City”:[“birmingham”,“birmingham city”,“blues”,“bcfc”],
“Reading”:[“reading”,“royals”],
“Portsmouth”:[“portsmouth”,“pompey”],
“Derby County”:[“derby”,“derby county”,“rams”],
“Charlton Athletic”:[“charlton”,“charlton athletic”,“addicks”],
“Ipswich Town”:[“ipswich”,“ipswich town”,“tractor boys”],
“Coventry City”:[“coventry”,“coventry city”,“sky blues”],
“Bradford City”:[“bradford”,“bradford city”,“bantams”],
“Blackpool”:[“blackpool”,“seasiders”,“tangerines”],
“Luton Town”:[“luton”,“luton town”,“hatters”],
“Oldham Athletic”:[“oldham”,“oldham athletic”],
“Wimbledon”:[“wimbledon”,“dons”],
“Queens Park Rangers”:[“qpr”,“queens park rangers”],
“Sheffield Wednesday”:[“sheffield wednesday”,“wednesday”,“owls”],

// ── LA LIGA ──
“Real Madrid”:[“real madrid”,“madrid”,“rmcf”,“real”,“los blancos”],
“Barcelona”:[“barcelona”,“barca”,“barça”,“fcb”,“blaugrana”,“fc barcelona”],
“Atlético Madrid”:[“atletico madrid”,“atletico”,“atleti”,“atm”],
“Sevilla”:[“sevilla”,“sfc”,“sevillistas”],
“Real Betis”:[“betis”,“real betis”,“verdiblancos”],
“Real Sociedad”:[“real sociedad”,“sociedad”,“la real”,“txuri urdin”],
“Villarreal”:[“villarreal”,“yellow submarine”,“submarino amarillo”],
“Athletic Bilbao”:[“athletic bilbao”,“athletic”,“bilbao”,“athletic club”],
“Valencia”:[“valencia”,“los che”,“vcf”],
“Celta Vigo”:[“celta vigo”,“celta”,“rc celta”],
“Espanyol”:[“espanyol”,“rcd espanyol”,“periquitos”],
“Getafe”:[“getafe”,“getafe cf”],
“Osasuna”:[“osasuna”,“ca osasuna”,“rojillos”],
“Mallorca”:[“mallorca”,“rcd mallorca”,“real mallorca”],
“Rayo Vallecano”:[“rayo vallecano”,“rayo”],
“Alavés”:[“alaves”,“deportivo alaves”],
“Girona”:[“girona”,“girona fc”],
“Real Valladolid”:[“valladolid”,“real valladolid”,“pucela”],
“Cádiz”:[“cadiz”,“cadiz cf”],
“Elche”:[“elche”,“elche cf”],
“Granada”:[“granada”,“granada cf”],
“Levante”:[“levante”,“levante ud”],
“Eibar”:[“eibar”,“sd eibar”],
“Leganés”:[“leganes”,“cd leganes”],
“Huesca”:[“huesca”,“sd huesca”],
“Real Oviedo”:[“oviedo”,“real oviedo”],
“Racing Santander”:[“racing santander”,“racing”],
“Deportivo La Coruña”:[“deportivo”,“deportivo la coruna”,“depor”,“la coruna”],
“Real Zaragoza”:[“zaragoza”,“real zaragoza”],
“Recreativo”:[“recreativo”,“recreativo de huelva”],
“Numancia”:[“numancia”,“cd numancia”],
“Xerez”:[“xerez”],
“Tenerife”:[“tenerife”,“cd tenerife”],
“Almería”:[“almeria”,“ud almeria”],
“Sporting Gijón”:[“sporting gijon”,“sporting”,“gijon”],
“Las Palmas”:[“las palmas”,“ud las palmas”],
“Albacete”:[“albacete”,“albacete balompie”],
“Córdoba”:[“cordoba”,“cordoba cf”],
“Gimnàstic”:[“gimnastic”,“nastic”,“gimnastic de tarragona”],
“Hércules”:[“hercules”,“hercules cf”],
“Málaga”:[“malaga”,“malaga cf”],
“Real Murcia”:[“real murcia”,“murcia”],

// ── BUNDESLIGA ──
“Bayern Munich”:[“bayern munich”,“bayern”,“fcb”,“fc bayern”,“bayern munchen”,“bayern münchen”],
“Borussia Dortmund”:[“dortmund”,“borussia dortmund”,“bvb”],
“RB Leipzig”:[“rb leipzig”,“leipzig”,“rbl”,“rasenballsport”],
“Bayer Leverkusen”:[“leverkusen”,“bayer leverkusen”,“bayer 04”,“b04”],
“Eintracht Frankfurt”:[“eintracht frankfurt”,“frankfurt”,“sge”,“eintracht”],
“Borussia Mönchengladbach”:[“monchengladbach”,“moenchengladbach”,“gladbach”,“borussia monchengladbach”,“bmg”,“fohlen”],
“VfB Stuttgart”:[“stuttgart”,“vfb stuttgart”,“vfb”],
“VfL Wolfsburg”:[“wolfsburg”,“vfl wolfsburg”,“wolves”],
“SC Freiburg”:[“freiburg”,“sc freiburg”],
“TSG Hoffenheim”:[“hoffenheim”,“tsg hoffenheim”,“tsg”,“1899 hoffenheim”],
“1. FC Union Berlin”:[“union berlin”,“union”,“fcub”],
“FC Augsburg”:[“augsburg”,“fc augsburg”,“fca”],
“1. FSV Mainz 05”:[“mainz”,“mainz 05”,“fsv mainz”],
“Werder Bremen”:[“werder bremen”,“bremen”,“werder”,“svw”],
“Hertha BSC”:[“hertha”,“hertha berlin”,“hertha bsc”,“bsc”],
“FC Köln”:[“koln”,“cologne”,“fc koln”,“fc cologne”,“1 fc koln”,“effzeh”],
“FC Schalke 04”:[“schalke”,“schalke 04”,“fc schalke”,“s04”],
“Fortuna Düsseldorf”:[“dusseldorf”,“fortuna dusseldorf”,“fortuna”,“f95”],
“SC Paderborn 07”:[“paderborn”,“sc paderborn”],
“Arminia Bielefeld”:[“bielefeld”,“arminia bielefeld”,“arminia”,“dsc”],
“SpVgg Greuther Fürth”:[“greuther furth”,“furth”,“spvgg greuther furth”],
“VfL Bochum”:[“bochum”,“vfl bochum”],
“SV Darmstadt 98”:[“darmstadt”,“sv darmstadt”,“darmstadt 98”],
“1. FC Heidenheim”:[“heidenheim”,“fc heidenheim”,“1 fc heidenheim”],
“Hamburger SV”:[“hamburg”,“hamburger sv”,“hsv”],
“1. FC Nürnberg”:[“nurnberg”,“nurnberg”,“1 fc nurnberg”,“fcn”,“nuremberg”],
“1. FC Kaiserslautern”:[“kaiserslautern”,“1 fc kaiserslautern”,“fck”,“lautern”],
“Hannover 96”:[“hannover”,“hannover 96”,“h96”],
“FC Ingolstadt 04”:[“ingolstadt”,“fc ingolstadt”],
“Energie Cottbus”:[“cottbus”,“energie cottbus”],
“MSV Duisburg”:[“duisburg”,“msv duisburg”],
“Alemannia Aachen”:[“aachen”,“alemannia aachen”],
“Holstein Kiel”:[“kiel”,“holstein kiel”,“holstein”],
“FC St. Pauli”:[“st pauli”,“fc st pauli”,“sankt pauli”],
“1860 Munich”:[“1860 munich”,“1860 munchen”,“tsv 1860”],
“Eintracht Braunschweig”:[“braunschweig”,“eintracht braunschweig”],
“Hansa Rostock”:[“hansa rostock”,“rostock”,“hansa”],
“Karlsruher SC”:[“karlsruhe”,“karlsruher”,“karlsruher sc”,“ksc”],
“SpVgg Unterhaching”:[“unterhaching”,“spvgg unterhaching”],

// ── SERIE A ──
“Juventus”:[“juventus”,“juve”,“jfc”,“old lady”,“bianconeri”],
“AC Milan”:[“ac milan”,“milan”,“rossoneri”,“acm”],
“Inter Milan”:[“inter milan”,“inter”,“internazionale”,“nerazzurri”,“fc internazionale”],
“AS Roma”:[“roma”,“as roma”,“giallorossi”],
“Napoli”:[“napoli”,“ssc napoli”,“partenopei”],
“Lazio”:[“lazio”,“ss lazio”,“biancocelesti”],
“Fiorentina”:[“fiorentina”,“acf fiorentina”,“viola”,“la viola”],
“Atalanta”:[“atalanta”,“atalanta bc”,“la dea”],
“Torino”:[“torino”,“torino fc”,“toro”,“il toro”],
“Sampdoria”:[“sampdoria”,“uc sampdoria”,“samp”,“blucerchiati”],
“Udinese”:[“udinese”,“udinese calcio”],
“Bologna”:[“bologna”,“bologna fc”],
“Genoa”:[“genoa”,“genoa cfc”,“grifone”],
“Sassuolo”:[“sassuolo”,“us sassuolo”],
“Hellas Verona”:[“verona”,“hellas verona”,“hellas”],
“Cagliari”:[“cagliari”,“cagliari calcio”],
“Parma”:[“parma”,“parma calcio”],
“Empoli”:[“empoli”,“empoli fc”],
“Lecce”:[“lecce”,“us lecce”],
“Spezia”:[“spezia”,“spezia calcio”,“la spezia”],
“Salernitana”:[“salernitana”,“us salernitana”],
“Cremonese”:[“cremonese”,“us cremonese”],
“Monza”:[“monza”,“ac monza”],
“Frosinone”:[“frosinone”,“frosinone calcio”],
“Como”:[“como”,“como 1907”],
“Venezia”:[“venezia”,“venezia fc”],
“Benevento”:[“benevento”],
“Crotone”:[“crotone”,“fc crotone”],
“Brescia”:[“brescia”,“brescia calcio”],
“SPAL”:[“spal”],
“Chievo Verona”:[“chievo”,“chievo verona”,“chievoVerona”],
“Siena”:[“siena”,“ac siena”,“robur siena”],
“Catania”:[“catania”,“calcio catania”],
“Cesena”:[“cesena”,“ac cesena”],
“Livorno”:[“livorno”,“as livorno”],
“Novara”:[“novara”,“novara calcio”],
“Pescara”:[“pescara”,“pescara calcio”],
“Perugia”:[“perugia”,“ac perugia”],
“Reggina”:[“reggina”],
“Palermo”:[“palermo”,“us palermo”],
“Bari”:[“bari”,“as bari”,“ssc bari”],
“Carpi”:[“carpi”,“carpi fc”],
“Treviso”:[“treviso”],
“Messina”:[“messina”],
“Ascoli”:[“ascoli”],
“Ancona”:[“ancona”],
“Modena”:[“modena”,“modena fc”],
“Piacenza”:[“piacenza”],
“Pisa”:[“pisa”,“ac pisa”],
“Vicenza”:[“vicenza”,“lanerossi vicenza”],

// ── LIGUE 1 ──
“Paris Saint-Germain”:[“psg”,“paris saint germain”,“paris sg”,“paris”,“paris saint-germain”],
“Olympique de Marseille”:[“marseille”,“om”,“olympique marseille”,“olympique de marseille”],
“Olympique Lyonnais”:[“lyon”,“ol”,“olympique lyonnais”,“olympique lyon”],
“AS Monaco”:[“monaco”,“as monaco”,“asm”],
“LOSC Lille”:[“lille”,“losc”,“losc lille”,“lille osc”],
“OGC Nice”:[“nice”,“ogc nice”],
“RC Lens”:[“lens”,“rc lens”,“racing lens”],
“Stade Rennais”:[“rennes”,“rennais”,“stade rennais”],
“RC Strasbourg”:[“strasbourg”,“rc strasbourg”,“racing strasbourg”],
“Stade de Reims”:[“reims”,“stade de reims”],
“FC Nantes”:[“nantes”,“fc nantes”,“fcn”,“canaris”],
“Montpellier HSC”:[“montpellier”,“montpellier hsc”,“mhsc”],
“Toulouse FC”:[“toulouse”,“toulouse fc”,“tfc”,“tefece”],
“Stade Brestois 29”:[“brest”,“stade brestois”,“sb29”],
“Le Havre AC”:[“le havre”,“le havre ac”,“hac”],
“Clermont Foot”:[“clermont”,“clermont foot”,“cf63”],
“FC Lorient”:[“lorient”,“fc lorient”,“fcl”],
“AJ Auxerre”:[“auxerre”,“aj auxerre”,“aja”],
“Angers SCO”:[“angers”,“angers sco”,“sco”],
“Estac Troyes”:[“troyes”,“estac troyes”,“estac”],
“FC Metz”:[“metz”,“fc metz”],
“Girondins de Bordeaux”:[“bordeaux”,“girondins”,“girondins de bordeaux”],
“AS Saint-Étienne”:[“saint etienne”,“saint-etienne”,“st etienne”,“asse”,“les verts”],
“FC Sochaux”:[“sochaux”,“fc sochaux”],
“SC Bastia”:[“bastia”,“sc bastia”],
“SM Caen”:[“caen”,“sm caen”],
“Dijon FCO”:[“dijon”,“dijon fco”,“dfco”],
“Amiens SC”:[“amiens”,“amiens sc”],
“EA Guingamp”:[“guingamp”,“ea guingamp”,“eag”],
“GFC Ajaccio”:[“ajaccio”,“gfc ajaccio”,“ac ajaccio”],
“AC Arles-Avignon”:[“arles”,“arles avignon”,“ac arles”],
“FC Valenciennes”:[“valenciennes”,“fc valenciennes”,“vafc”],
“Le Mans FC”:[“le mans”,“le mans fc”,“muc”],
“AS Nancy”:[“nancy”,“as nancy”,“asnl”],
“Évian TG”:[“evian”,“evian tg”],
“Boulogne”:[“boulogne”,“us boulogne”],
“Gazélec Ajaccio”:[“gazelec”,“gazelec ajaccio”],
“Grenoble Foot”:[“grenoble”,“grenoble foot”],
“Istres”:[“istres”,“fc istres”],
“Nîmes”:[“nimes”,“nimes olympique”],
“Paris FC”:[“paris fc”],
“Sedan”:[“sedan”,“cs sedan”],
“Chamois Niortais”:[“niort”,“chamois niortais”],
};

// Build a lowercase lookup from aliases → canonical team name
// Only include aliases for teams that exist in the dataset
const ALIAS_LOOKUP = new Map();
for (const team of ALL_TEAMS) {
ALIAS_LOOKUP.set(team.toLowerCase().trim(), team);
const aliases = TEAM_ALIASES[team];
if (aliases) {
for (const a of aliases) ALIAS_LOOKUP.set(a.toLowerCase().trim(), team);
}
}

// ── HELPERS ──────────────────────────────────────────────────────────────────

function normalize(s) {
return s.toLowerCase().trim()
.replace(/[-–—]/g, “ “)
.replace(/[’’]/g, “’”)
.replace(/[^a-z0-9 ’éèêëàâäùûüôöîïçñ]/g, “”)
.replace(/\s+/g, “ “);
}

function phoneticNorm(s) {
return s.toLowerCase()
.replace(/é|è|ê|ë/g,“e”).replace(/à|â|ä/g,“a”).replace(/ù|û|ü/g,“u”)
.replace(/ô|ö/g,“o”).replace(/î|ï/g,“i”).replace(/ç/g,“c”).replace(/ñ/g,“n”)
.replace(/ph/g,“f”).replace(/ou/g,“u”).replace(/ck/g,“k”)
.replace(/ae/g,“e”).replace(/oo/g,“u”).replace(/[aeiou]+/g,“a”)
.replace(/(.)\1+/g,”$1”).trim();
}

function levenshtein(a, b) {
const m = a.length, n = b.length;
const dp = Array.from({ length: m + 1 }, (_, i) => [i, …Array(n).fill(0)]);
for (let j = 0; j <= n; j++) dp[0][j] = j;
for (let i = 1; i <= m; i++) {
for (let j = 1; j <= n; j++) {
dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
}
}
return dp[m][n];
}

const PLAYER_NORMALIZED = new Map();
SOCCER_PLAYERS.forEach(p => PLAYER_NORMALIZED.set(normalize(p.name), p.name));

function findPlayerSuggestion(raw) {
const norm = normalize(raw);
const words = norm.split(” “);
if (words.length < 2) return null;
const inpFirst = words[0], inpLast = words.slice(1).join(” “);
const lastInitial = inpLast[0], firstCode = inpFirst.charCodeAt(0);
const inpFirstPh = phoneticNorm(inpFirst), inpLastPh = phoneticNorm(inpLast);
let best = null, bestScore = [999, 999];
for (const [key, canonical] of PLAYER_NORMALIZED) {
const kw = key.split(” “); if (kw.length < 2) continue;
const kFirst = kw[0], kLast = kw.slice(1).join(” “);
if (!kLast.startsWith(lastInitial)) continue;
if (Math.abs(kFirst.charCodeAt(0) - firstCode) > 1) continue;
const fpd = levenshtein(inpFirstPh, phoneticNorm(kFirst));
const lpd = levenshtein(inpLastPh, phoneticNorm(kLast));
if (fpd > 2 || lpd > 2) continue;
const fd = levenshtein(norm, key);
if (fd === 0 || fd > 7) continue;
const score = [fpd + lpd, fd];
if (score[0] < bestScore[0] || (score[0] === bestScore[0] && score[1] < bestScore[1])) {
bestScore = score; best = canonical;
}
}
return best;
}

function resolveTeam(input) {
const n = normalize(input);
// Direct match against canonical names
for (const team of ALL_TEAMS) {
if (normalize(team) === n) return team;
}
// Alias lookup
const found = ALIAS_LOOKUP.get(n);
if (found) return found;
// Fuzzy: check if input is a substring of any team or alias
for (const [alias, canonical] of ALIAS_LOOKUP) {
if (alias.includes(n) || n.includes(alias)) return canonical;
}
return null;
}

const FIRST_NAME_ALIASES = {
“matthew”:[“matt”],“michael”:[“mike”],“robert”:[“rob”,“bob”,“bobby”],
“william”:[“will”,“bill”],“james”:[“jim”,“jimmy”],“joseph”:[“joe”,“joey”],
“thomas”:[“tom”,“tommy”],“christopher”:[“chris”],“nicholas”:[“nick”],
“anthony”:[“tony”],“jonathan”:[“jon”],“nathaniel”:[“nate”],
“benjamin”:[“ben”],“daniel”:[“dan”,“danny”],“timothy”:[“tim”],
“jeffrey”:[“jeff”],“stephen”:[“steve”],“steven”:[“steve”],
“patrick”:[“pat”],“kenneth”:[“ken”,“kenny”],
“alexandre”:[“alex”],“alessandro”:[“alex”],“alexander”:[“alex”],
“francisco”:[“paco”,“fran”],“mohamed”:[“mohammed”,“muhammad”,“mo”],
“cristiano”:[“cr7”],“giuseppe”:[“beppe”],“andrea”:[“andi”],
“pierre”:[“pierrot”],“jean”:[“jeannot”],
“gabriel”:[“gabi”],“rafael”:[“rafa”],“gonzalo”:[“gonzo”],
“fernando”:[“nando”,“fer”],“roberto”:[“robbie”,“rob”],
“philippe”:[“phil”],“frederic”:[“fred”],“nicolas”:[“nico”,“nick”],
“emmanuel”:[“manu”],“samuel”:[“sam”],“jerome”:[“jerry”],
};
const FIRST_NAME_REVERSE = {};
for (const [full, shorts] of Object.entries(FIRST_NAME_ALIASES)) {
for (const s of shorts) { if (!FIRST_NAME_REVERSE[s]) FIRST_NAME_REVERSE[s] = []; FIRST_NAME_REVERSE[s].push(full); }
}

function resolvePlayer(input) {
const n = normalize(input);
const stripSuffix = s => s.replace(/\b(jr|sr|ii|iii|iv)\b/g, “”).replace(/\s+/g, “ “).trim();
const matches = [];
const exact = SOCCER_PLAYERS.find(p => normalize(p.name) === n);
if (exact) matches.push(exact);
const nStripped = stripSuffix(n);
SOCCER_PLAYERS.forEach(p => {
if (p !== exact && stripSuffix(normalize(p.name)) === nStripped) matches.push(p);
});
const parts = nStripped.split(” “);
if (parts.length >= 2) {
const firstName = parts[0], lastName = parts.slice(1).join(” “);
for (const fullFirst of (FIRST_NAME_REVERSE[firstName] || [])) {
const expanded = fullFirst + “ “ + lastName;
SOCCER_PLAYERS.forEach(p => { if (!matches.includes(p) && stripSuffix(normalize(p.name)) === expanded) matches.push(p); });
}
for (const nick of (FIRST_NAME_ALIASES[firstName] || [])) {
const shortened = nick + “ “ + lastName;
SOCCER_PLAYERS.forEach(p => { if (!matches.includes(p) && stripSuffix(normalize(p.name)) === shortened) matches.push(p); });
}
// Fuzzy first-name match with exact last name
SOCCER_PLAYERS.forEach(p => {
if (matches.includes(p)) return;
const pp = stripSuffix(normalize(p.name)).split(” “);
if (pp.length < 2) return;
if (pp.slice(1).join(” “) !== lastName) return;
if (levenshtein(firstName, pp[0]) <= 2) matches.push(p);
});
}
// Single-name player search (e.g., “Ronaldinho”, “Neymar”, “Pelé”)
if (parts.length === 1 && matches.length === 0) {
SOCCER_PLAYERS.forEach(p => {
const pn = normalize(p.name);
if (pn === n || pn.split(” “).some(w => w === n)) matches.push(p);
});
}
return matches.length > 0 ? matches : null;
}

function playerOnTeam(player, team) {
return player.teams.includes(team);
}

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const STEP = { TEAM: “team”, PLAYER_TO_TEAM: “player_to_team” };

// ── LEADERBOARD ─────────────────────────────────────────────────────────────

const LB_KEY = “soccerChain_leaderboard”;

function getLeaderboard() {
try {
const raw = localStorage.getItem(LB_KEY);
return raw ? JSON.parse(raw) : [];
} catch { return []; }
}

function saveToLeaderboard(entry) {
const lb = getLeaderboard();
lb.push(entry);
lb.sort((a, b) => b.length - a.length);
const top10 = lb.slice(0, 10);
try { localStorage.setItem(LB_KEY, JSON.stringify(top10)); } catch {}
return top10;
}

// ── DISPLAY COMPONENTS ──────────────────────────────────────────────────────

function ChainNode({ item, type, isLatest }) {
const isTeam = type === “team”;
const colors = isTeam
? { bg: “#0a1f12”, border: “#1a7a3e”, text: “#4ade80”, label: “#1a7a3e” }
: { bg: “#0f1a2e”, border: “#2a5a9e”, text: “#60a5fa”, label: “#2a5a9e” };

return (
<div style={{
display: “flex”, flexDirection: “column”, alignItems: “center”,
animation: isLatest ? “popIn .3s cubic-bezier(.34,1.56,.64,1)” : “none”,
}}>
<div style={{
fontSize: 8, fontFamily: “‘Oswald’, sans-serif”, letterSpacing: 3,
color: colors.label, textTransform: “uppercase”, marginBottom: 3,
}}>
{isTeam ? “Club” : “Player”}
</div>
<div style={{
background: colors.bg, border: `1px solid ${colors.border}`,
borderRadius: 8, padding: “6px 12px”,
fontSize: 12, fontWeight: 700, fontFamily: “‘Oswald’, sans-serif”,
color: colors.text, letterSpacing: 0.5,
maxWidth: 180, textAlign: “center”, lineHeight: 1.3,
boxShadow: isLatest ? `0 0 12px ${colors.border}55` : “none”,
}}>
{item}
</div>
</div>
);
}

function ChainConnector() {
return <div style={{ display: “flex”, alignItems: “center”, fontSize: 14, padding: “0 4px” }}>⚽</div>;
}

function useIsMobile() {
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 600);
useEffect(() => {
const h = () => setIsMobile(window.innerWidth < 600);
window.addEventListener(“resize”, h); return () => window.removeEventListener(“resize”, h);
}, []);
return isMobile;
}

function Leaderboard({ entries, currentLength, onEnterScore, hasEnteredCurrent }) {
const isMobile = useIsMobile();

return (
<div style={{
width: “100%”, maxWidth: 520,
background: “#08081a”, border: “1px solid #111128”,
borderRadius: 14, padding: “16px 20px”, marginBottom: 20,
}}>
<div style={{
display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 14,
}}>
<div style={{ fontSize: 10, letterSpacing: 4, color: “#ffffff25”, textTransform: “uppercase” }}>
🏆 Leaderboard
</div>
{currentLength >= 2 && !hasEnteredCurrent && (
<button onClick={onEnterScore} style={{
background: “linear-gradient(135deg,#166534,#15803d)”,
border: “1px solid #22c55e44”,
borderRadius: 8, padding: isMobile ? “5px 10px” : “6px 14px”,
fontSize: 10, fontWeight: 800, color: “#4ade80”,
cursor: “pointer”, letterSpacing: 1.5, textTransform: “uppercase”,
fontFamily: “‘Oswald’, sans-serif”,
animation: “pulse 2s ease infinite”,
}}>
Enter Score →
</button>
)}
{hasEnteredCurrent && (
<div style={{ fontSize: 10, color: “#22c55e88”, letterSpacing: 1, fontWeight: 700 }}>
✓ Entered
</div>
)}
</div>

```
  {entries.length === 0 ? (
    <div style={{ fontSize: 12, color: "#ffffff20", textAlign: "center", padding: "12px 0" }}>
      No entries yet — be the first!
    </div>
  ) : (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {entries.map((entry, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "6px 10px", borderRadius: 8,
          background: i === 0 ? "#1a2a1220" : "transparent",
          border: i === 0 ? "1px solid #22c55e15" : "1px solid transparent",
        }}>
          <div style={{
            fontSize: 14, fontWeight: 900, color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#cd7f32" : "#ffffff20",
            width: 24, textAlign: "center", fontFamily: "'Oswald', sans-serif",
          }}>
            {i + 1}
          </div>
          <div style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "#f0f0f0", fontFamily: "'Oswald', sans-serif" }}>
            {entry.length} links
          </div>
          <div style={{ fontSize: 10, color: "#ffffff25", fontFamily: "'Oswald', sans-serif" }}>
            {new Date(entry.date).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
```

);
}

function ShareButtons({ chainLength, usedTeams }) {
const isMobile = useIsMobile();
const teamCount = usedTeams.size;

const shareText = `⚽ I built a ${chainLength}-link Soccer Chain on TrivialSports!\n🔗 Connected ${teamCount} clubs across Europe's top leagues\n🏆 Can you beat my chain? trivialsports.com/games/soccer-chain`;

return (
<div style={{
display: “flex”, gap: 8, flexWrap: “wrap”, justifyContent: “center”,
}}>
<button onClick={() => {
navigator.clipboard?.writeText(shareText);
}} style={{
background: “#ffffff10”, color: “#ffffff70”, border: “1px solid #ffffff15”,
borderRadius: 8, padding: “7px 14px”, fontSize: 10, fontWeight: 700,
cursor: “pointer”, letterSpacing: 1.5, textTransform: “uppercase”,
fontFamily: “‘Oswald’, sans-serif”,
}}>Copy</button>
<button onClick={() => {
window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, ‘_blank’);
}} style={{
background: “#000000”, color: “#ffffff”, border: “1px solid #333333”,
borderRadius: 8, padding: “7px 14px”, fontSize: 10, fontWeight: 700,
cursor: “pointer”, letterSpacing: 1.5, textTransform: “uppercase”,
fontFamily: “‘Oswald’, sans-serif”,
}}>𝕏 Post</button>
<button onClick={() => {
window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(shareText)}`, ‘_blank’);
}} style={{
background: “#0085ff”, color: “#ffffff”, border: “none”,
borderRadius: 8, padding: “7px 14px”, fontSize: 10, fontWeight: 700,
cursor: “pointer”, letterSpacing: 1.5, textTransform: “uppercase”,
fontFamily: “‘Oswald’, sans-serif”,
}}>Bluesky</button>
</div>
);
}

// ── MAIN GAME ────────────────────────────────────────────────────────────────
export default function SoccerChain() {
const [step, setStep] = useState(STEP.TEAM);
const [currentTarget, setCurrentTarget] = useState(null);
const [chain, setChain] = useState([]);
const [usedTeams, setUsedTeams] = useState(new Set());
const [usedPlayers, setUsedPlayers] = useState(new Set());
const [input, setInput] = useState(””);
const [shake, setShake] = useState(false);
const [rejectMsg, setRejectMsg] = useState(””);
const [suggestion, setSuggestion] = useState(null);
const justSetSuggestion = useRef(false);
const [history, setHistory] = useState([]);
const [leaderboard, setLeaderboard] = useState([]);
const [hasEnteredCurrent, setHasEnteredCurrent] = useState(false);
const inputRef = useRef(null);
const chainContainerRef = useRef(null);
const trackPlay = usePlayCount(“soccer-chain”);

// ── LocalStorage persistence ──
const SAVE_KEY = “soccerChain_save”;

function saveGame(state) {
try {
localStorage.setItem(SAVE_KEY, JSON.stringify({
step: state.step, currentTarget: state.currentTarget,
chain: state.chain, usedTeams: […state.usedTeams],
usedPlayers: […state.usedPlayers],
hasEnteredCurrent: state.hasEnteredCurrent,
history: state.history.map(h => ({ …h, usedTeams: […h.usedTeams], usedPlayers: […h.usedPlayers] })),
}));
} catch (e) {}
}
function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

useEffect(() => {
setLeaderboard(getLeaderboard());
try {
const raw = localStorage.getItem(SAVE_KEY);
if (raw) {
const s = JSON.parse(raw);
if (s.chain && s.chain.length > 1) {
setStep(s.step); setCurrentTarget(s.currentTarget);
setChain(s.chain); setUsedTeams(new Set(s.usedTeams));
setUsedPlayers(new Set(s.usedPlayers));
setHasEnteredCurrent(s.hasEnteredCurrent || false);
setHistory((s.history || []).map(h => ({ …h, usedTeams: new Set(h.usedTeams), usedPlayers: new Set(h.usedPlayers) })));
return;
}
}
} catch (e) {}
const team = ALL_TEAMS[Math.floor(Math.random() * ALL_TEAMS.length)];
setCurrentTarget(team); setUsedTeams(new Set([team])); setChain([{ item: team, type: “team” }]);
}, []);

useEffect(() => {
if (chain.length > 0 && currentTarget) {
saveGame({ step, currentTarget, chain, usedTeams, usedPlayers, hasEnteredCurrent, history });
}
}, [step, currentTarget, chain, usedTeams, usedPlayers, hasEnteredCurrent, history]);

useEffect(() => {
if (chainContainerRef.current) chainContainerRef.current.scrollLeft = chainContainerRef.current.scrollWidth;
}, [chain]);

const chainLength = Math.floor(chain.length / 2); // each player→team pair = 1 link

const reject = useCallback((msg) => {
setShake(true); setRejectMsg(msg);
setTimeout(() => setShake(false), 500);
setTimeout(() => setRejectMsg(””), 2500);
}, []);

const pushHistory = useCallback(() => {
setHistory(h => […h, { step, currentTarget, chain: […chain], usedTeams: new Set(usedTeams), usedPlayers: new Set(usedPlayers) }]);
}, [step, currentTarget, chain, usedTeams, usedPlayers]);

const handleGoBack = useCallback(() => {
setHistory(h => {
if (h.length === 0) return h;
const snap = h[h.length - 1];
setStep(snap.step); setCurrentTarget(snap.currentTarget);
setChain(snap.chain); setUsedTeams(snap.usedTeams); setUsedPlayers(snap.usedPlayers);
setInput(””); setRejectMsg(””); setTimeout(() => inputRef.current?.focus(), 50);
return h.slice(0, -1);
});
}, []);

const acceptSuggestion = useCallback((canonical) => {
setSuggestion(null); setInput(canonical);
setTimeout(() => inputRef.current?.focus(), 50);
}, []);

const handleEnterScore = useCallback(() => {
const entry = { length: chainLength, date: new Date().toISOString() };
const updated = saveToLeaderboard(entry);
setLeaderboard(updated);
setHasEnteredCurrent(true);
}, [chainLength]);

const handleSubmit = useCallback(() => {
// If there’s a pending suggestion, Enter confirms it
if (suggestion) {
const canonical = suggestion;
setSuggestion(null); setInput(””);
const candidates = resolvePlayer(canonical);
if (candidates) {
if (step === STEP.TEAM) {
const player = candidates.find(p => playerOnTeam(p, currentTarget) && !usedPlayers.has(p.name));
if (player) {
pushHistory();
const newUsed = new Set(usedPlayers); newUsed.add(player.name);
setUsedPlayers(newUsed);
setChain(c => […c, { item: player.name, type: “player” }]);
setCurrentTarget(player.name);
setStep(STEP.PLAYER_TO_TEAM);
} else { reject(“That doesn’t work here”); }
} else { reject(“That doesn’t work here”); }
}
return;
}

```
const val = input.trim();
if (!val) return;

if (step === STEP.TEAM) {
  // Need a player who played for currentTarget team
  const candidates = resolvePlayer(val);
  if (!candidates) {
    const fuzzy = findPlayerSuggestion(val);
    if (fuzzy) {
      justSetSuggestion.current = true;
      setTimeout(() => { justSetSuggestion.current = false; }, 50);
      setSuggestion(fuzzy); setRejectMsg(""); setInput("");
    } else { reject("Player not found in our database"); }
    return;
  }
  const player = candidates.find(p => playerOnTeam(p, currentTarget) && !usedPlayers.has(p.name));
  if (!player) {
    const anyOnTeam = candidates.find(p => playerOnTeam(p, currentTarget));
    if (anyOnTeam) return reject(`${anyOnTeam.name} already used`);
    return reject(`${candidates[0].name} didn't play for ${currentTarget}`);
  }
  pushHistory();
  const newUsed = new Set(usedPlayers); newUsed.add(player.name);
  setUsedPlayers(newUsed);
  setChain(c => [...c, { item: player.name, type: "player" }]);
  setCurrentTarget(player.name);
  setStep(STEP.PLAYER_TO_TEAM);
  setInput("");

} else if (step === STEP.PLAYER_TO_TEAM) {
  const team = resolveTeam(val);
  if (!team) return reject("Club not recognized");
  const player = SOCCER_PLAYERS.find(p => p.name === currentTarget);
  if (!playerOnTeam(player, team)) return reject(`${player.name} didn't play for ${team}`);
  if (usedTeams.has(team)) return reject(`${team} already used`);

  pushHistory();
  const newUsedTeams = new Set(usedTeams); newUsedTeams.add(team);
  setUsedTeams(newUsedTeams);
  setChain(c => [...c, { item: team, type: "team" }]);
  setCurrentTarget(team);
  setInput("");
  setStep(STEP.TEAM);
  setHasEnteredCurrent(false); // new link = can enter score again
}
```

}, [step, currentTarget, input, usedTeams, usedPlayers, reject, pushHistory, suggestion]);

const handleKeyDown = (e) => {
trackPlay();
if (e.key === “Enter”) handleSubmit();
if (e.key === “Escape” && suggestion) { setSuggestion(null); setRejectMsg(””); }
};

const handleReset = () => {
clearSave();
const team = ALL_TEAMS[Math.floor(Math.random() * ALL_TEAMS.length)];
setCurrentTarget(team); setUsedTeams(new Set([team])); setUsedPlayers(new Set());
setChain([{ item: team, type: “team” }]); setStep(STEP.TEAM);
setInput(””); setRejectMsg(””); setHistory([]);
setHasEnteredCurrent(false);
setTimeout(() => inputRef.current?.focus(), 50);
};

const prompt = currentTarget
? step === STEP.TEAM
? `Name a player who played for ${currentTarget}`
: `Name a club ${currentTarget} has played for`
: “”;
const hint = step === STEP.TEAM ? “Type any player’s name” : “Type any club name”;

return (
<div style={{
minHeight: “100vh”, background: “#07070f”,
backgroundImage: “radial-gradient(ellipse at 30% 10%, #071a0e 0%, #07070f 55%), radial-gradient(ellipse at 70% 90%, #0a0f1a 0%, transparent 50%)”,
color: “#f0f0f0”, fontFamily: “‘Oswald’, sans-serif”,
display: “flex”, flexDirection: “column”, alignItems: “center”,
padding: “84px 16px 60px”,
}}>
<Helmet>
<title>Soccer Chain – TrivialSports</title>
<meta name="description" content="Chain soccer players through the clubs they've played for across Europe's top 5 leagues. How long can you go?" />
<meta property="og:title" content="Soccer Chain – TrivialSports" />
<meta property="og:description" content="Chain soccer players through clubs. No repeats. How long can your chain get?" />
<meta property="og:url" content="https://trivialsports.com/games/soccer-chain" />
<meta property="og:type" content="website" />
<meta property="og:image" content="https://trivialsports.com/trivspo_banner.png" />
</Helmet>
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
<style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}} @keyframes popIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>

```
  {/* Header */}
  <div style={{ textAlign: "center", marginBottom: 32 }}>
    <div style={{ fontSize: 9, letterSpacing: 7, color: "#ffffff18", textTransform: "uppercase", marginBottom: 6 }}>Soccer</div>
    <h1 style={{
      fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: 0, lineHeight: 1,
      background: "linear-gradient(135deg,#22c55e,#4ade80,#60a5fa,#a78bfa)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: -1,
    }}>Complete The Chain</h1>
    <p style={{
      fontSize: 12, margin: "8px 0 0", letterSpacing: 1, textTransform: "uppercase",
      background: "linear-gradient(135deg,#4ade80,#60a5fa,#a78bfa)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
    }}>by linking clubs through shared players</p>
    <p style={{ color: "#22c55e", fontSize: 13, margin: "8px 0 0", letterSpacing: 0.5 }}>
      Club ⚽ Player ⚽ Club ⚽ Player ⚽ Club
    </p>

    <div style={{
      marginTop: 14, maxWidth: 420, marginLeft: "auto", marginRight: "auto",
      background: "#0b0b1e", border: "1px solid #ffffff0a", borderRadius: 10,
      padding: "10px 16px", textAlign: "left",
    }}>
      <p style={{ fontSize: 11, color: "#ffffff44", margin: "0 0 6px", lineHeight: 1.5, fontWeight: 400, letterSpacing: 0.3 }}>
        Eligible players have made <span style={{ color: "#4ade80", fontWeight: 700 }}>50+ appearances</span> in Europe's Big 5 leagues — the Premier League, La Liga, Bundesliga, Serie A, and Ligue 1.
      </p>
      <p style={{ fontSize: 11, color: "#ffffff44", margin: 0, lineHeight: 1.5, fontWeight: 400, letterSpacing: 0.3 }}>
        Think your chain is world class? <span style={{ color: "#a78bfa", fontWeight: 700 }}>Submit it to the leaderboard below.</span>
      </p>
    </div>

    <div style={{ display: "flex", gap: 10, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
      <button onClick={handleReset} style={{
        padding: "6px 16px", borderRadius: 20,
        border: "1px solid #ffffff20", background: "transparent",
        color: "#ffffff50", fontSize: 11, fontWeight: 700,
        cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase",
        fontFamily: "'Oswald', sans-serif",
      }}>🔄 Start Over</button>
    </div>

    {/* Chain stats */}
    <div style={{
      display: "flex", gap: 20, justifyContent: "center", marginTop: 16,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#4ade80" }}>{chainLength}</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#ffffff25", textTransform: "uppercase" }}>Links</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#60a5fa" }}>{usedTeams.size}</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#ffffff25", textTransform: "uppercase" }}>Clubs</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#a78bfa" }}>{usedPlayers.size}</div>
        <div style={{ fontSize: 9, letterSpacing: 3, color: "#ffffff25", textTransform: "uppercase" }}>Players</div>
      </div>
    </div>
  </div>

  {/* Always-visible share */}
  {chainLength >= 1 && (
    <div style={{ marginBottom: 20 }}>
      <ShareButtons chainLength={chainLength} usedTeams={usedTeams} />
    </div>
  )}

  {/* Active prompt + input */}
  <div style={{ width: "100%", maxWidth: 520, marginBottom: 24 }}>

    {/* Used teams */}
    {usedTeams.size > 0 && (
      <div style={{
        background: "#08081a", border: "1px solid #111128",
        borderRadius: 12, padding: "10px 14px", marginBottom: 12,
      }}>
        <div style={{ fontSize: 8, color: "#ffffff18", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
          Clubs used ({usedTeams.size})
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {[...usedTeams].map(t => (
            <span key={t} style={{
              fontSize: 10, fontWeight: 600, fontFamily: "'Oswald', sans-serif",
              letterSpacing: 0.5, color: t === currentTarget && step === STEP.TEAM ? "#4ade80" : "#ffffff35",
              background: t === currentTarget && step === STEP.TEAM ? "#22c55e12" : "#ffffff06",
              border: `1px solid ${t === currentTarget && step === STEP.TEAM ? "#22c55e33" : "#ffffff0a"}`,
              borderRadius: 5, padding: "3px 8px",
            }}>{t}</span>
          ))}
        </div>
      </div>
    )}
    <div style={{
      background: "#0b0b1e", border: "1px solid #161640",
      borderRadius: 14, padding: "18px 20px", marginBottom: 12,
    }}>
      <div style={{ fontSize: 9, color: "#ffffff28", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>
        Step {chain.length}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#f0f0f0", lineHeight: 1.3, marginBottom: 6 }}>
        {prompt}
      </div>
      <div style={{ fontSize: 10, color: "#ffffff28", letterSpacing: 1 }}>{hint}</div>
    </div>

    <div style={{ animation: shake ? "shake .5s ease" : "none" }}>
      <input
        ref={inputRef}
        value={input}
        onChange={e => { setInput(e.target.value); setRejectMsg(""); setSuggestion(null); }}
        onKeyDown={handleKeyDown}
        placeholder={step === STEP.TEAM ? "Player name..." : "Club name..."}
        autoComplete="off" autoFocus
        style={{
          width: "100%", background: "#07071a",
          border: `2px solid ${shake ? "#e74c3c" : "#141432"}`,
          borderRadius: 12, padding: "14px 18px",
          fontSize: 16, color: "#f0f0f0", outline: "none",
          fontFamily: "'Oswald', sans-serif", fontWeight: 600,
          letterSpacing: 0.5, boxSizing: "border-box",
        }}
        onFocus={e => e.target.style.borderColor = "#22c55e55"}
        onBlur={e => e.target.style.borderColor = "#141432"}
      />
    </div>

    {suggestion && (
      <div style={{ marginTop: 8, fontFamily: "Georgia, serif" }}>
        <div style={{ fontSize: 13, color: "#4ade80cc", marginBottom: 6, textAlign: "center" }}>
          Did you mean <strong style={{ color: "#4ade80", fontStyle: "italic" }}>{suggestion}</strong>?
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => acceptSuggestion(suggestion)} style={{
            background: "#22c55e22", border: "1px solid #22c55e55", color: "#4ade80",
            borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
            fontFamily: "'Oswald', sans-serif",
          }}>Yes — Enter</button>
          <button onClick={() => { setSuggestion(null); setRejectMsg(""); inputRef.current?.focus(); }} style={{
            background: "transparent", border: "1px solid #ffffff15", color: "#ffffff30",
            borderRadius: 6, padding: "4px 14px", fontSize: 11, fontWeight: 700,
            letterSpacing: 1, textTransform: "uppercase", cursor: "pointer",
            fontFamily: "'Oswald', sans-serif",
          }}>No — Esc</button>
        </div>
      </div>
    )}
    {!suggestion && rejectMsg && (
      <div style={{
        marginTop: 8, fontSize: 11, color: "#e74c3c99",
        letterSpacing: 1, textAlign: "center", animation: "fadeUp .2s ease",
      }}>{rejectMsg}</div>
    )}

    <button onClick={handleSubmit} style={{
      marginTop: 10, width: "100%",
      background: "linear-gradient(135deg,#0a3d1f,#166534)",
      border: "1px solid #22c55e44", borderRadius: 10, padding: "12px 0",
      fontSize: 12, fontWeight: 900, color: "#4ade80",
      cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
    }}>Confirm →</button>

    {history.length > 0 && (
      <button onClick={handleGoBack} style={{
        marginTop: 8, width: "100%", background: "transparent",
        border: "1px solid #ffffff18", borderRadius: 10, padding: "10px 0",
        fontSize: 11, fontWeight: 700, color: "#ffffff55",
        cursor: "pointer", letterSpacing: 2, textTransform: "uppercase",
      }}>← Go Back</button>
    )}
  </div>

  {/* Chain visualization */}
  <div style={{
    width: "100%", maxWidth: 780,
    background: "#08081a", border: "1px solid #111128",
    borderRadius: 16, padding: "16px 20px", marginBottom: 24,
    overflowX: "auto",
  }} ref={chainContainerRef}>
    <div style={{ fontSize: 8, color: "#ffffff15", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>
      Chain — {chainLength} links
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", rowGap: 10 }}>
      {chain.map((node, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center" }}>
          <ChainNode item={node.item} type={node.type} isLatest={i === chain.length - 1} />
          {i < chain.length - 1 && <ChainConnector />}
        </div>
      ))}
    </div>
  </div>

  {/* Leaderboard */}
  <Leaderboard
    entries={leaderboard}
    currentLength={chainLength}
    onEnterScore={handleEnterScore}
    hasEnteredCurrent={hasEnteredCurrent}
  />
</div>
```

);
}