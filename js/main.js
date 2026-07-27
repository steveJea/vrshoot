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
