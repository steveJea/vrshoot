// ===== Utility =====
function findChar(id){
  return allChars.find(c => c.id === id);
}

// ===== Event Listeners =====
document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', function(e){
  if(gameState === 'title'){
    tryStartTitleBgm();
    showScreen('select-screen');
    renderSelect();
    return;
  }
  if(gameState === 'select'){
    if(e.key.length === 1 && /[a-zA-Z]/.test(e.key)){
      cheatBuffer += e.key.toLowerCase();
      if(cheatBuffer.length > 30) cheatBuffer = cheatBuffer.slice(-30);
      for(const ch of unlockables){
        if(ch.pw && cheatBuffer.endsWith(ch.pw)){
          addUnlockCard(ch);
          cheatBuffer = "";
          break;
        }
      }
    }
  }
  if(gameState === 'continue'){
    doContinue();
  }
  if(gameState === 'gameover'){
    returnToTitle();
  }
});

document.getElementById('title-screen').addEventListener('click', tryStartTitleBgm);

// ===== 유도탄 코드 입력 =====
(function setupCheatInput(){
  const input = document.getElementById('cheat-input');
  const btn = document.getElementById('cheat-btn');
  const msg = document.getElementById('cheat-msg');
  const indicator = document.getElementById('homing-indicator');
  const box = document.getElementById('cheat-box');
  const showOn = () => { indicator.style.display = 'inline'; input.style.display = 'none'; btn.style.display = 'none'; msg.textContent = ''; box.style.opacity = '1'; };
  if(homingMode) showOn();
  async function submit(){
    if(await checkHomingCode(input.value)){ showOn(); }
    else { msg.textContent = '잘못된 코드'; msg.style.color = '#f66'; input.value = ''; setTimeout(() => { msg.textContent = ''; }, 1500); }
  }
  // 입력 중 키가 게임 단축키/캐릭터 해금 버퍼로 전달되지 않도록 차단
  input.addEventListener('keydown', e => { e.stopPropagation(); if(e.key === 'Enter') submit(); });
  btn.addEventListener('click', e => { e.stopPropagation(); submit(); });
})();
document.getElementById('gameover-screen').addEventListener('click', returnToTitle);

document.getElementById('modal-confirm').onclick = function(){
  if(!pendingChar) return;
  document.getElementById('profile-modal').classList.remove('show');
  confirmSelect(pendingChar);
  pendingChar = null;
};

document.getElementById('modal-close').onclick = function(){
  document.getElementById('profile-modal').classList.remove('show');
  pendingChar = null;
};

document.getElementById('ending-screen').addEventListener('click', () => {
  if(gameState !== 'ending') return;
  if(endingPhase === 0){
    clearInterval(typingTimer);
    document.getElementById('ending-txt').textContent = fullFtxt;
    document.getElementById('ending-hint').textContent = '다시 클릭하면 GAME OVER';
    endingPhase = 1;
  } else if(endingPhase === 1){
    const go = document.getElementById('gameover-screen');
    go.style.backgroundImage = `url('${playerChar.win_img}')`;
    go.style.backgroundSize = 'cover';
    go.style.backgroundPosition = 'center';
    showScreen('gameover-screen');
    endingPhase = 2;
  }
});

// ===== Core Flow =====
function confirmSelect(c){
  playerChar = c;
  const candidates = characters.filter(x => x.id !== c.id);
  enemyChar = candidates[Math.floor(Math.random() * candidates.length)];
  isBossFight = false;
  matchScore = {p:0, e:0};
  currentRound = 1;
  specialUsedThisMatch = false;
  setTimeout(goToVS, 400);
}

function endBattle(playerWinRound){
  battleActive = false;
  clearInterval(timerInterval);
  window.onkeydown = null;
  window.onkeyup = null;

  if(playerWinRound) matchScore.p++;
  else matchScore.e++;
  updateRoundInfo();

  // 매치가 끝났을 때만 BGM 정지 (다음 라운드면 유지)
  if(matchScore.p >= 2 || matchScore.e >= 2){
    stopBgm(true);
  }

  setTimeout(() => {
    // ===== Match Win (first to 2) =====
    if(matchScore.p >= 2){
      // Secret flag
      if(enemyChar.id === 10006 && !specialUsedThisMatch) flags.noQ_10006 = true;
      if(enemyChar.id === 10001 && !specialUsedThisMatch) flags.noQ_10001 = true;

      if(!isBossFight) defeated.add(enemyChar.id);

      document.getElementById('vic-player').src = playerChar.face_n;
      document.getElementById('vic-enemy').src  = enemyChar.face_a;
      document.getElementById('vic-txt').textContent = playerChar.win_txt;
      showScreen('victory-screen');

      setTimeout(() => {
        if(!isBossFight){
          if(defeated.size < MAX_NORMAL_FIGHTS){
            const remaining = characters.filter(x => x.id !== playerChar.id && !defeated.has(x.id));
            if(remaining.length === 0){
              bossIndex = 0; isBossFight = true; enemyChar = bosses[0];
              matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
              goToVS();
            } else {
              enemyChar = remaining[Math.floor(Math.random() * remaining.length)];
              matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
              goToVS();
            }
          } else {
            bossIndex = 0; isBossFight = true; enemyChar = bosses[0];
            matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
            goToVS();
          }
        } else {
          // Boss / Secret progression
          const eid = enemyChar.id;
          if(eid === 10014 && flags.noQ_10006){
            enemyChar = findChar(10016);
            matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
            goToVS();
          } else if(eid === 10016){
            enemyChar = findChar(10015);
            matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
            goToVS();
          } else if(eid === 10015 && flags.noQ_10001){
            enemyChar = findChar(10017);
            matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
            goToVS();
          } else if(eid === 10017 || eid === 10015){
            startEnding();
          } else {
            bossIndex++;
            if(bossIndex >= bosses.length){
              startEnding();
            } else {
              enemyChar = bosses[bossIndex];
              matchScore = {p:0,e:0}; currentRound = 1; specialUsedThisMatch = false;
              goToVS();
            }
          }
        }
      }, 2800);
    }
    // ===== Match Lose =====
    else if(matchScore.e >= 2){
      document.getElementById('fail-player').src = playerChar.face_a;
      document.getElementById('fail-enemy').src  = enemyChar.face_n;
      document.getElementById('fail-txt').textContent = enemyChar.win_txt;
      showScreen('fail-screen');
      setTimeout(() => {
        if(continuesLeft > 0){
          startContinue();
        } else {
          goGameOver();
        }
      }, 2200);
    }
    // ===== Next Round =====
    else {
      currentRound++;
      setTimeout(() => {
        startBattle();
      }, 1200);
    }
  }, 400);
}

function endBattleByTime(){
  const pRatio = player.eng / player.maxEng;
  const eRatio = enemy.eng / enemy.maxEng;
  if(pRatio >= eRatio) endBattle(true);
  else endBattle(false);
}
