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
      if(!homingMode && cheatBuffer.length >= HOMING_CODE_LEN){
        checkHomingCode(cheatBuffer.slice(-HOMING_CODE_LEN)).then(ok => { if(ok) showHomingIndicator(); });
      }
      if(!yuriAwakened && cheatBuffer.length >= AWAKEN_CODE_LEN){
        checkAwakenCode(cheatBuffer.slice(-AWAKEN_CODE_LEN)).then(ok => { if(ok){ renderSelect(); showAwakenIndicator(); popAwakenCard(); } });
      }
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

// ===== 유도탄 모드 표시 =====
function showHomingIndicator(){
  const el = document.getElementById('homing-indicator');
  if(el) el.style.display = homingMode ? 'block' : 'none';
}
showHomingIndicator();

// ===== 각성 유리 표시 =====
function showAwakenIndicator(){
  const el = document.getElementById('awaken-indicator');
  if(el) el.style.display = yuriAwakened ? 'block' : 'none';
}
showAwakenIndicator();
function popAwakenCard(){
  const idx = characters.findIndex(c => c.id === 10018);
  const card = document.querySelectorAll('#char-grid .char-card')[idx];
  if(!card) return;
  if(!document.getElementById('awaken-style')){
    const st = document.createElement('style'); st.id = 'awaken-style';
    st.textContent = '@keyframes awakenPop{0%{transform:scale(1);filter:brightness(1)}25%{transform:scale(1.35) rotate(-4deg);filter:brightness(3) drop-shadow(0 0 20px #c4f)}55%{transform:scale(.9) rotate(3deg);filter:brightness(1.6)}100%{transform:scale(1);filter:brightness(1)}}'
      + '.awaken-pop{animation:awakenPop .7s ease-out;position:relative;z-index:10;box-shadow:0 0 24px #c4f}'
      + '@keyframes awakenTxt{0%{opacity:0;transform:translate(-50%,0) scale(.5)}30%{opacity:1;transform:translate(-50%,-20px) scale(1.3)}100%{opacity:0;transform:translate(-50%,-60px) scale(1)}}'
      + '.awaken-txt{position:absolute;left:50%;top:10%;font-weight:900;font-size:28px;color:#fff;text-shadow:0 0 10px #c4f,0 0 20px #f0f;pointer-events:none;animation:awakenTxt 1.2s ease-out forwards;white-space:nowrap}';
    document.head.appendChild(st);
  }
  card.classList.add('awaken-pop');
  const t = document.createElement('div'); t.className = 'awaken-txt'; t.textContent = '뿅~ ✨';
  card.appendChild(t);
  setTimeout(() => { card.classList.remove('awaken-pop'); t.remove(); }, 1300);
}
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
