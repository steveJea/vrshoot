function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  gameState = id.replace('-screen','');
}

function updateRoundInfo(){
  document.getElementById('round-info').textContent = `ROUND ${currentRound}`;
  document.getElementById('player-score').textContent = matchScore.p;
  document.getElementById('enemy-score').textContent = matchScore.e;
}

function renderSelect(){
  const grid = document.getElementById('char-grid');
  grid.innerHTML = '';
  document.getElementById('boss-area').innerHTML = '';
  unlockedIds.clear();
  characters.forEach(c => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = '<img src="'+c.pf_img+'" alt="'+c.name+'"><div class="name">'+c.name+'</div>';
    card.onclick = function(){ openProfile(c); };
    grid.appendChild(card);
  });
}

function addUnlockCard(ch){
  if(unlockedIds.has(ch.id)) return;
  unlockedIds.add(ch.id);
  const area = document.getElementById('boss-area');
  const card = document.createElement('div');
  const isHidden = !!ch.isHidden;
  card.className = 'char-card ' + (isHidden ? 'hidden-card' : 'boss-card');
  card.dataset.id = ch.id;
  card.innerHTML = '<img src="'+ch.pf_img+'" alt="'+ch.name+'"><div class="name">'+ch.name+'</div>';
  card.onclick = function(){ openProfile(ch); };
  area.appendChild(card);
}

function openProfile(c){
  pendingChar = c;
  document.getElementById('modal-img').src = c.pf_img;
  document.getElementById('modal-name').textContent = c.name;
  document.getElementById('modal-pwr').textContent = c.Pwr;
  document.getElementById('modal-eng').textContent = c.Eng;
  document.getElementById('modal-spd').textContent = c.spd;
  document.getElementById('modal-bomb').textContent = c.bomb.toUpperCase();
  document.getElementById('profile-modal').classList.add('show');
}

function goToVS(){
  stopBgm(true);
  if (enemyChar && enemyChar.bgm) {
    setTimeout(() => playBgm(enemyChar.bgm, true, 0.45), 300);
  }

  const normal = document.getElementById('vs-normal');
  const bossDiv = document.getElementById('vs-boss');
  if(isBossFight && enemyChar.boss_img){
    normal.style.display = 'none';
    bossDiv.style.display = 'flex';
    document.getElementById('vs-boss-img').src = enemyChar.boss_img;
    document.getElementById('vs-boss-name').textContent = enemyChar.name;
  } else {
    normal.style.display = 'flex';
    bossDiv.style.display = 'none';
    document.getElementById('vs-player-img').src = playerChar.SD_full || playerChar.pf_img;
    document.getElementById('vs-player-name').textContent = playerChar.name;
    document.getElementById('vs-enemy-img').src = enemyChar.SD_full || enemyChar.pf_img;
    document.getElementById('vs-enemy-name').textContent = enemyChar.name;
  }
  showScreen('vs-screen');
  setTimeout(startBattle, 2200);
}

function startContinue(){
  document.getElementById('con-img').src = playerChar.con_img || playerChar.pf_img;
  document.getElementById('con-left').textContent = continuesLeft;
  conTime = 10.00;
  document.getElementById('con-count').textContent = '10.00';
  showScreen('continue-screen');
  if(conInterval) clearInterval(conInterval);
  conInterval = setInterval(()=>{
    conTime = Math.max(0, conTime - 0.01);
    document.getElementById('con-count').textContent = conTime.toFixed(2);
    if(conTime <= 0){
      clearInterval(conInterval);
      conInterval = null;
      goGameOver();
    }
  }, 10);
}

function doContinue(){
  if(gameState !== 'continue' || continuesLeft <= 0) return;
  clearInterval(conInterval);
  conInterval = null;
  continuesLeft--;
  matchScore = {p:0, e:0};
  currentRound = 1;
  specialUsedThisMatch = false;
  goToVS();
}

function goGameOver(){
  const go = document.getElementById('gameover-screen');
  go.style.backgroundImage = `url('${playerChar.lose_img}')`;
  go.style.backgroundSize = 'cover';
  go.style.backgroundPosition = 'center';
  showScreen('gameover-screen');
}

function returnToTitle(){
  stopBgm(true);
  showScreen('title-screen');
  defeated.clear();
  playerChar = null;
  bossIndex = 0;
  isBossFight = false;
  matchScore = {p:0, e:0};
  currentRound = 1;
  continuesLeft = 3;
  specialUsedThisMatch = false;
  flags = {noQ_10006:false, noQ_10001:false};
  document.getElementById('gameover-screen').style.backgroundImage = '';
  titleBgmStarted = false;
  tryStartTitleBgm();
}

let typingTimer = null, fullFtxt = '', typedLen = 0, endingPhase = 0;

function startEnding() {
  endingPhase = 0;
  fullFtxt = playerChar.f_txt || "Victory... The true ending begins.";
  typedLen = 0;

  stopBgm(true);
  setTimeout(() => playBgm(BGM_RAW + "ending.mp3", true, 0.5), 400);

  const media = playerChar.win_mp4 || playerChar.win_img;
  const isVideo = media && media.endsWith('.mp4');
  const old = document.getElementById('ending-img');

  if (isVideo) {
    old.outerHTML = `<video id="ending-img" autoplay muted loop playsinline style="max-width:90%;max-height:52%;border-radius:8px;margin-bottom:18px;object-fit:contain"><source src="${media}" type="video/mp4"></video>`;
  } else {
    old.outerHTML = `<img id="ending-img" src="${media}" style="max-width:90%;max-height:52%;object-fit:contain;margin-bottom:18px;border-radius:8px">`;
  }

  document.getElementById('ending-txt').textContent = '';
  document.getElementById('ending-hint').textContent = '클릭하면 전체 텍스트가 표시됩니다';
  showScreen('ending-screen');

  typingTimer = setInterval(() => {
    if (typedLen < fullFtxt.length) {
      typedLen++;
      document.getElementById('ending-txt').textContent = fullFtxt.substring(0, typedLen);
    } else {
      clearInterval(typingTimer);
      document.getElementById('ending-hint').textContent = '다시 클릭하면 GAME OVER';
      endingPhase = 1;
    }
  }, 28);

  setTimeout(() => {
    if (gameState === 'ending') {
      clearInterval(typingTimer);
      const go = document.getElementById('gameover-screen');
      go.style.backgroundImage = `url('${playerChar.win_img}')`;
      go.style.backgroundSize = 'cover';
      go.style.backgroundPosition = 'center';
      showScreen('gameover-screen');
      endingPhase = 2;
    }
  }, 18000);
}
