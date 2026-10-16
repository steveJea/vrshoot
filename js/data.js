const RAW = "https://raw.githubusercontent.com/steveJea/vrshoot/main/img/";
const BGM_RAW = "https://raw.githubusercontent.com/steveJea/vrshoot/main/bgm/";

const characters = [
  {id:10001,name:"YURI",Pwr:150,Eng:1100,spd:140,delay:1.2,b_spd:300,RPS:6,sim_f:2,bomb:"dark",
   face_a:RAW+"10001_fa.webp",face_n:RAW+"10001_fn.webp",SD_full:RAW+"10001_full.webp",pf_img:RAW+"10001_pf.webp",
   win_txt:"Vile and hideous creature. Embrace your death.",
   lose_img:RAW+"10001_lose.webp",win_img:RAW+"10001_end.webp",win_mp4:RAW+"10001_end.mp4",bg_img:RAW+"10001_bg.webp",
   con_img:RAW+"10001_con.webp",bgm:BGM_RAW+"10001.mp3",
   f_txt:"Yuri killed Seongjin and sat upon the true throne of darkness.\nBut she, who had always been empty inside, set out in search of new prey.\nThe doors of Yuri's Castle finally opened—and within waits the lewd, cold Yuri."},
  {id:10002,name:"SEKANG",Pwr:200,Eng:1200,spd:80,delay:1.7,b_spd:180,RPS:3,sim_f:4,bomb:"fire",
   face_a:RAW+"10002_fa.webp",face_n:RAW+"10002_fn.webp",SD_full:RAW+"10002_full.webp",pf_img:RAW+"10002_pf.webp",
   win_txt:"Don't block my path!",
   lose_img:RAW+"10002_lose.webp",win_img:RAW+"10002_end.webp",win_mp4:RAW+"10002_end.mp4",bg_img:RAW+"10002_bg.webp",
   con_img:RAW+"10002_con.webp",bgm:BGM_RAW+"10002.mp3",
   f_txt:"Sekang seized victory as a matter of course.\nHe continues to follow the trail of his vanished younger sister.\n“Seryoen… please, be safe!”"},
  {id:10003,name:"HOO",Pwr:170,Eng:1200,spd:110,delay:1.7,b_spd:300,RPS:4,sim_f:3,bomb:"ice",
   face_a:RAW+"10003_fa.webp",face_n:RAW+"10003_fn.webp",SD_full:RAW+"10003_full.webp",pf_img:RAW+"10003_pf.webp",
   win_txt:"Mad about it? Still want more? Push it and you'll really die.",
   lose_img:RAW+"10003_lose.webp",win_img:RAW+"10003_end.webp",win_mp4:RAW+"10003_end.mp4",bg_img:RAW+"10003_bg.webp",
   con_img:RAW+"10003_con.webp",bgm:BGM_RAW+"10003.mp3",
   f_txt:"He had joined the game out of sheer boredom—and won it without much difficulty.\nToday, as always, he stands on the street smoking, watching the girls who pass by."},
  {id:10004,name:"SAEM",Pwr:150,Eng:1000,spd:150,delay:1.1,b_spd:300,RPS:2,sim_f:5,bomb:"ice",
   face_a:RAW+"10004_fa.webp",face_n:RAW+"10004_fn.webp",SD_full:RAW+"10004_full.webp",pf_img:RAW+"10004_pf.webp",
   win_txt:"Gross...you're so ugly. And you smell terrible.",
   lose_img:RAW+"10004_lose.webp",win_img:RAW+"10004_end.webp",win_mp4:RAW+"10004_end.mp4",bg_img:RAW+"10004_bg.webp",
   con_img:RAW+"10004_con.webp",bgm:BGM_RAW+"10004.mp3",
   f_txt:"Having claimed victory, Saem returned to school.\nCraving blood more and more, she was steadily descending into a blood-soaked demon."},
  {id:10005,name:"H.K.",Pwr:160,Eng:900,spd:150,delay:0.9,b_spd:300,RPS:5,sim_f:2,bomb:"dark",
   face_a:RAW+"10005_fa.webp",face_n:RAW+"10005_fn.webp",SD_full:RAW+"10005_full.webp",pf_img:RAW+"10005_pf.webp",
   win_txt:"Hehehehehe... You fool. Still want to play with me?",
   lose_img:RAW+"10005_lose.webp",win_img:RAW+"10005_end.webp",win_mp4:RAW+"10005_end.mp4",bg_img:RAW+"10005_bg.webp",
   con_img:RAW+"10005_con.webp",bgm:BGM_RAW+"10005.mp3",
   f_txt:"H.K. won with ease.\nLicking his blood, she felt an orgasm.\nH.K. has now evolved into an even stronger, sharper beast."},
  {id:10006,name:"NAHYOEN",Pwr:120,Eng:1000,spd:180,delay:0.9,b_spd:300,RPS:3,sim_f:3,bomb:"dark",
   face_a:RAW+"10006_fa.webp",face_n:RAW+"10006_fn.webp",SD_full:RAW+"10006_full.webp",pf_img:RAW+"10006_pf.webp",
   win_txt:"What a waste of time... on trash like you.",
   lose_img:RAW+"10006_lose.webp",win_img:RAW+"10006_end.webp",win_mp4:RAW+"10006_end.mp4",bg_img:RAW+"10006_bg.webp",
   con_img:RAW+"10006_con.webp",bgm:BGM_RAW+"10006.mp3",
   f_txt:"Nahyoen barely managed to defeat Seongjin and returned home.\nHaving finally received recognition from her sister, she felt truly happy."},
  {id:10007,name:"JOONKI",Pwr:130,Eng:900,spd:180,delay:1.3,b_spd:300,RPS:6,sim_f:2,bomb:"wind",
   face_a:RAW+"10007_fa.webp",face_n:RAW+"10007_fn.webp",SD_full:RAW+"10007_full.webp",pf_img:RAW+"10007_pf.webp",
   win_txt:"Yo, I actually won, didn't I? See ya!",
   lose_img:RAW+"10007_lose.webp",win_img:RAW+"10007_end.webp",win_mp4:RAW+"10007_end.mp4",bg_img:RAW+"10007_bg.webp",
   con_img:RAW+"10007_con.webp",bgm:BGM_RAW+"10007.mp3",
   f_txt:"Joonki claimed victory, yet he realized his training was still far from enough.\n“I will overcome any hardship and become the strongest in this city!”"},
  {id:10008,name:"SEONGHO",Pwr:150,Eng:1300,spd:120,delay:1.5,b_spd:200,RPS:3,sim_f:4,bomb:"dark",
   face_a:RAW+"10008_fa.webp",face_n:RAW+"10008_fn.webp",SD_full:RAW+"10008_full.webp",pf_img:RAW+"10008_pf.webp",
   win_txt:"In the name of God, I will take your life.",
   lose_img:RAW+"10008_lose.webp",win_img:RAW+"10008_end.webp",win_mp4:RAW+"10008_end.mp4",bg_img:RAW+"10008_bg.webp",
   con_img:RAW+"10008_con.webp",bgm:BGM_RAW+"10008.mp3",
   f_txt:"Seongho claimed victory in the name of God.\nHe continues his holy mission in the brutal city."},
  {id:10009,name:"JINSEONG",Pwr:160,Eng:900,spd:150,delay:1.5,b_spd:300,RPS:2,sim_f:6,bomb:"fire",
   face_a:RAW+"10009_fa.webp",face_n:RAW+"10009_fn.webp",SD_full:RAW+"10009_full.webp",pf_img:RAW+"10009_pf.webp",
   win_txt:"Where should I cut you, first?",
   lose_img:RAW+"10009_lose.webp",win_img:RAW+"10009_end.webp",win_mp4:RAW+"10009_end.mp4",bg_img:RAW+"10009_bg.webp",
   con_img:RAW+"10009_con.webp",bgm:BGM_RAW+"10009.mp3",
   f_txt:"Jinseong won the battle.\nHe still seeks the next prey to cut."},
  {id:10010,name:"JUNCHEOL",Pwr:175,Eng:800,spd:145,delay:1.2,b_spd:300,RPS:8,sim_f:1,bomb:"fire",
   face_a:RAW+"10010_fa.webp",face_n:RAW+"10010_fn.webp",SD_full:RAW+"10010_full.webp",pf_img:RAW+"10010_pf.webp",
   win_txt:"Don't mess with me!",
   lose_img:RAW+"10010_lose.webp",win_img:RAW+"10010_end.webp",win_mp4:RAW+"10010_end.mp4",bg_img:RAW+"10010_bg.webp",
   con_img:RAW+"10010_con.webp",bgm:BGM_RAW+"10010.mp3",
   f_txt:"Juncheol claimed victory.\nNo one dares to mess with him anymore."},
  {id:10011,name:"HYERI",Pwr:130,Eng:1400,spd:130,delay:1.0,b_spd:300,RPS:4,sim_f:4,bomb:"light",
   face_a:RAW+"10011_fa.webp",face_n:RAW+"10011_fn.webp",SD_full:RAW+"10011_full.webp",pf_img:RAW+"10011_pf.webp",
   win_txt:"Does it hurt a lot? I'm sorry.",
   lose_img:RAW+"10011_lose.webp",win_img:RAW+"10011_end.webp",win_mp4:RAW+"10011_end.mp4",bg_img:RAW+"10011_bg.webp",
   con_img:RAW+"10011_con.webp",bgm:BGM_RAW+"10011.mp3",
   f_txt:"Hyeri won, yet she felt a strange emptiness.\n“Does it really have to end like this?”"},
  {id:10012,name:"MINSEOP",Pwr:200,Eng:1000,spd:100,delay:1.7,b_spd:300,RPS:6,sim_f:2,bomb:"wind",
   face_a:RAW+"10012_fa.webp",face_n:RAW+"10012_fn.webp",SD_full:RAW+"10012_full.webp",pf_img:RAW+"10012_pf.webp",
   win_txt:"From now on, you are my slave.",
   lose_img:RAW+"10012_lose.webp",win_img:RAW+"10012_end.webp",win_mp4:RAW+"10012_end.mp4",bg_img:RAW+"10012_bg.webp",
   con_img:RAW+"10012_con.webp",bgm:BGM_RAW+"10012.mp3",
   f_txt:"Minseop claimed absolute victory.\nFrom now on, the city belongs to him."}
];

const bosses = [
  {id:10013,name:"NARI",Pwr:210,Eng:2000,spd:150,delay:1.0,b_spd:350,RPS:5,sim_f:5,bomb:"demon",pw:"poweroverwhelming",
   face_a:RAW+"10013_fa.webp",face_n:RAW+"10013_fn.webp",SD_full:RAW+"10013_full.webp",pf_img:RAW+"10013_pf.webp",
   boss_img:RAW+"boss_10013.webp",win_txt:"The world is better off when you disappear.",
   lose_img:RAW+"10013_lose.webp",win_img:RAW+"10013_end.webp",win_mp4:RAW+"10013_end.mp4",bg_img:RAW+"10013_bg.webp",
   con_img:RAW+"10013_con.webp",bgm:BGM_RAW+"10013.mp3",
   f_txt:"It is empty. No one can stand against me. I am both light and darkness."},
  {id:10014,name:"QRI",Pwr:250,Eng:2500,spd:150,delay:1.0,b_spd:350,RPS:4,sim_f:7,bomb:"demon",pw:"sexydynamite",
   face_a:RAW+"10014_fa.webp",face_n:RAW+"10014_fn.webp",SD_full:RAW+"10014_full.webp",pf_img:RAW+"10014_pf.webp",
   boss_img:RAW+"boss_10014.webp",win_txt:"Slower than a turtle, weaker than a snail... Pathetic",
   lose_img:RAW+"10014_lose.webp",win_img:RAW+"10014_end.webp",win_mp4:RAW+"10014_end.mp4",bg_img:RAW+"10014_bg.webp",
   con_img:RAW+"10014_con.webp",bgm:BGM_RAW+"10014.mp3",
   f_txt:"I have proven that I am the strongest. Now I will call forth blood, and I will rule over blood. I will become the eternal Empress of Blood."},
  {id:10015,name:"SEONGJIN",Pwr:400,Eng:3000,spd:180,delay:0.8,b_spd:350,RPS:3,sim_f:20,bomb:"abyss",pw:"shinlimsurgery",
   face_a:RAW+"10015_fa.webp",face_n:RAW+"10015_fn.webp",SD_full:RAW+"10015_full.webp",pf_img:RAW+"10015_pf.webp",
   boss_img:RAW+"boss_10015.webp",win_txt:"What makes you better than an insect?",
   lose_img:RAW+"10015_lose.webp",win_img:RAW+"10015_end.webp",win_mp4:RAW+"10015_end.mp4",bg_img:RAW+"10015_bg.webp",
   con_img:RAW+"10015_con.webp",bgm:BGM_RAW+"10015.mp3",
   f_txt:"No one can replace me. I am a great existence. Even a god cannot stand against me. Simply put—everything begins because of me, and everything ends because of me."}
];

const hiddenChars = [ 
  {id:10016,name:"S.H.",Pwr:600,Eng:1050,spd:270,delay:0.7,b_spd:400,RPS:10,sim_f:6,bomb:"abyss",pw:"madplanner",isHidden:true,
   face_a:RAW+"10016_fa.webp",face_n:RAW+"10016_fn.webp",SD_full:RAW+"10016_full.webp",pf_img:RAW+"10016_pf.webp",
   boss_img:RAW+"boss_10016.webp",win_txt:"The darkness of the abyss will erode you away.",
   lose_img:RAW+"10016_lose.webp",win_img:RAW+"10016_end.webp",win_mp4:RAW+"10016_end.mp4",bg_img:RAW+"10016_bg.webp",
   con_img:RAW+"10016_con.webp",bgm:BGM_RAW+"10016.mp3",
   f_txt:"The evil instinct has awakened in the new demon who put the previous one to sleep. Now there is no one left who can stop her. Having finished her preparations to bring this world to ruin, she will slowly begin to reveal herself. “I’m coming now. Let’s all have a wonderful time.”"},
    {id:10017,name:"J.Y.",Pwr:600,Eng:1500,spd:200,delay:0.5,b_spd:400,RPS:6,sim_f:10,bomb:"abyss",pw:"yanuaegi",isHidden:true,
   face_a:RAW+"10017_fa.webp",face_n:RAW+"10017_fn.webp",SD_full:RAW+"10017_full.webp",pf_img:RAW+"10017_pf.webp",
   boss_img:RAW+"boss_10017.webp",win_txt:"With that level of skill, maybe you should hit the books instead.",
   lose_img:RAW+"10017_lose.webp",win_img:RAW+"10017_end.webp",win_mp4:RAW+"10017_end.mp4",bg_img:RAW+"10017_bg.webp",
   con_img:RAW+"10017_con.webp",bgm:BGM_RAW+"10017.mp3",
   f_txt:"J.Y. defeated the incarnation of the devil. Yet far too many villains still remain in this world. Unable to turn away from the power granted by God, J.Y. continues to hunt down evil today—even with her fragile girl’s body. “Villains, wait. I will punish you with the power of light.”"}
];

const unlockables = [...bosses, ...hiddenChars];
const allChars = [...characters, ...bosses, ...hiddenChars];

// Preload face images
characters.forEach(c => {
  c.img_n = new Image(); c.img_n.src = c.face_n;
  c.img_a = new Image(); c.img_a.src = c.face_a;
});
unlockables.forEach(c => {
  c.img_n = new Image(); c.img_n.src = c.face_n;
  c.img_a = new Image(); c.img_a.src = c.face_a;
});

const MAX_NORMAL_FIGHTS = 5;

// ===== Shared Global State =====
let gameState = "title";
let defeated = new Set();
let playerChar = null;
let enemyChar = null;
let bossIndex = 0;
let isBossFight = false;
let cheatBuffer = "";
let unlockedIds = new Set();
let pendingChar = null;

let matchScore = {p:0, e:0};
let currentRound = 1;
let continuesLeft = 3;
let specialUsedThisMatch = false;
let flags = {noQ_10006: false, noQ_10001: false};
let conInterval = null;
let conTime = 10.00;

// ===== 각성 유리 치트 (선택 화면에서 'yuriisback' 입력, 세션 동안 유지) =====
const AWAKEN_CODE_HASH = 'b526c0d2f8ae2b8678bae62a3697a1ff809595ea644eb7752a90c840fff9432a'; // SHA-256
const AWAKEN_CODE_LEN = 10;
const AWAKEN_YURI = {id:10018,name:"[AWAKEN] YURI",Pwr:1000,Eng:2000,spd:300,delay:0.3,b_spd:500,RPS:6,sim_f:10,bomb:"abyss",
  face_a:RAW+"10018_fa.webp",face_n:RAW+"10018_fn.webp",SD_full:RAW+"10018_full.webp",pf_img:RAW+"10018_pf.webp",
  boss_img:RAW+"boss_10018.webp",win_txt:"A goddess? Funny… none came when I died, either.",
  lose_txt:"Ha… haha… dying again? …This is getting old.", // 패배 시 대사 (이 캐릭터 전용)
  lose_img:RAW+"10018_lose.webp",win_img:RAW+"10018_end.webp",win_mp4:RAW+"10018_end.mp4",bg_img:RAW+"10018_bg.webp",
  con_img:RAW+"10018_con.webp",bgm:BGM_RAW+"10001.mp3", // 10018 전용 BGM 없음 → 유리 BGM 유지
  f_txt:"She looked up at the empty sky.\n\"No gods. No meaning.\nSo I'll just play.\"\nShe snapped her fingers. The fallen twitched.\n\"Get up. One more round.\n…Dead toys are no fun.\""};
let yuriAwakened = false;
function applyAwakenYuri(){
  // 플레이어 선택 슬롯에서만 교체 (상대 풀/일반 스테이지는 원래 YURI 10001 유지)
  if(!AWAKEN_YURI.img_n){
    AWAKEN_YURI.img_n = new Image(); AWAKEN_YURI.img_n.src = AWAKEN_YURI.face_n;
    AWAKEN_YURI.img_a = new Image(); AWAKEN_YURI.img_a.src = AWAKEN_YURI.face_a;
  }
  yuriAwakened = true;
  sessionStorage.setItem('yuriAwaken', '1');
}
async function checkAwakenCode(input){
  const code = (input || '').trim().toLowerCase();
  if(!code || !window.crypto || !crypto.subtle) return false;
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(code));
  const hex = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
  if(hex !== AWAKEN_CODE_HASH) return false;
  applyAwakenYuri();
  return true;
}
if(sessionStorage.getItem('yuriAwaken') === '1') applyAwakenYuri();

// ===== 히든 보스: 각성 유리 (YURI로 노히트 클리어 시 등장) =====
const HIDDEN_BOSS_YURI = Object.assign({}, AWAKEN_YURI, {isHidden:true});
HIDDEN_BOSS_YURI.img_n = new Image(); HIDDEN_BOSS_YURI.img_n.src = HIDDEN_BOSS_YURI.face_n;
HIDDEN_BOSS_YURI.img_a = new Image(); HIDDEN_BOSS_YURI.img_a.src = HIDDEN_BOSS_YURI.face_a;
let noHitMatch = true;     // 현재 매치(라운드 묶음) 동안 플레이어가 피해를 받지 않았는지
let yuriBossDone = false;  // 각성 유리는 한 판에 한 번만
let hiddenBossReturn = null; // 각성 유리전 이후 복귀할 진행 상태
let endingOverride = null;
