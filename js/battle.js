const canvas = document.getElementById('battle-canvas');
const ctx = canvas.getContext('2d');
let W, H, midY, player, enemy, bullets = [], effects = [], particles = [], keys = {};
let timer = 120, timerInterval = null, lastTime = 0, battleActive = false, shakeTime = 0;

function resizeCanvas(){
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height - 70;
  W = canvas.width;
  H = canvas.height;
  midY = H * 0.48;
}
window.addEventListener('resize', () => {
  if(gameState === 'battle') resizeCanvas();
});

function startBattle(){
  showScreen('battle-screen');
  resizeCanvas();
  updateRoundInfo();

  if (enemyChar && enemyChar.bgm && (!currentBgm || currentBgm.paused)) {
    playBgm(enemyChar.bgm, true, 0.45);
  }

  const bg = enemyChar.bg_img || '';
  if(bg){
    canvas.style.backgroundImage = `url('${bg}')`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
  } else {
    canvas.style.backgroundImage = 'none';
  }

  const pEng = playerChar.Eng, eEng = enemyChar.Eng;
  player = {x:W/2, y:H-110, char:playerChar, eng:pEng, maxEng:pEng, spd:playerChar.spd, bomb:playerChar.bomb, hitTimer:0, fireCD:0, bombUsed:false, status:{}, specialFlash:0, speedMul:1};
  enemy  = {x:W/2, y:110,   char:enemyChar,  eng:eEng, maxEng:eEng, spd:enemyChar.spd,  bomb:enemyChar.bomb,  hitTimer:0, fireCD:1.2, bombUsed:false, status:{}, specialFlash:0, aiTimer:0, aiDirX:1, aiDirY:0, speedMul:1};
  bullets = []; effects = []; particles = [];
  timer = 120; battleActive = true; shakeTime = 0;

  document.getElementById('player-face').src = playerChar.face_n;
  document.getElementById('enemy-face').src  = enemyChar.face_n;
  updateHPBars();
  document.getElementById('timer').textContent = timer;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if(!battleActive) return;
    timer--;
    document.getElementById('timer').textContent = timer;
    if(timer <= 0) endBattleByTime();
  }, 1000);

  lastTime = performance.now();
  requestAnimationFrame(battleLoop);

  window.onkeydown = e => {
    keys[e.key] = true;
    if(e.key === ' ' || e.key === 'Spacebar'){
      e.preventDefault();
      if(player.fireCD <= 0 && !player.status.freeze){
        firePattern(player, -1);
        player.fireCD = playerChar.delay;
      }
    }
    if((e.key === 'q' || e.key === 'Q') && !player.bombUsed) useBomb(player);
  };
  window.onkeyup = e => { keys[e.key] = false; };
}

function updateHPBars(){
  const pPct = Math.max(0, player.eng / player.maxEng * 100);
  const ePct = Math.max(0, enemy.eng  / enemy.maxEng  * 100);
  document.getElementById('player-hp-bar').style.width = pPct + '%';
  document.getElementById('enemy-hp-bar').style.width  = ePct + '%';
  document.getElementById('player-hp-pct').textContent = pPct.toFixed(1) + '%';
  document.getElementById('enemy-hp-pct').textContent  = ePct.toFixed(1) + '%';
}

function battleLoop(now){
  if(!battleActive) return;
  const dt = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  update(dt);
  draw();
  requestAnimationFrame(battleLoop);
}

function update(dt){
  let mx = 0, my = 0;
  if(keys['ArrowLeft'] || keys['a'] || keys['A']) mx = -1;
  if(keys['ArrowRight']|| keys['d'] || keys['D']) mx = 1;
  if(keys['ArrowUp']   || keys['w'] || keys['W']) my = -1;
  if(keys['ArrowDown'] || keys['s'] || keys['S']) my = 1;

  const pSpeed = (player.spd / 100) * 260 * (player.speedMul || 1) * (player.status.slow ? 0.2 : 1);
  if(!player.status.freeze){
    player.x += mx * pSpeed * dt;
    player.y += my * pSpeed * dt;
    player.x = Math.max(50, Math.min(W - 50, player.x));
    player.y = Math.max(midY + 40, Math.min(H - 60, player.y));
  }

  enemy.aiTimer -= dt;
  let dodgeX = 0, dodgeY = 0;
  for(const b of bullets){
    if(b.owner !== 'player') continue;
    const dx = b.x - enemy.x, dy = b.y - enemy.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if(dist < 180 && Math.abs(dx) < 70){
      dodgeX += dx > 0 ? -1 : 1;
      dodgeY += dy > 0 ? -0.6 : 0.4;
    }
  }
  if(Math.abs(dodgeX) + Math.abs(dodgeY) > 0.3){
    enemy.aiDirX = dodgeX; enemy.aiDirY = dodgeY; enemy.aiTimer = 0.35;
  } else if(enemy.aiTimer <= 0){
    enemy.aiDirX = (Math.random() - 0.5) * 2;
    enemy.aiDirY = (Math.random() - 0.5) * 1.2;
    enemy.aiTimer = 0.5 + Math.random() * 0.9;
  }

  const eSpeed = (enemy.spd / 100) * 230 * (enemy.speedMul || 1) * (enemy.status.slow ? 0.2 : 1);
  if(!enemy.status.freeze){
    const len = Math.sqrt(enemy.aiDirX * enemy.aiDirX + enemy.aiDirY * enemy.aiDirY) || 1;
    enemy.x += (enemy.aiDirX / len) * eSpeed * dt;
    enemy.y += (enemy.aiDirY / len) * eSpeed * dt;
    enemy.x = Math.max(50, Math.min(W - 50, enemy.x));
    enemy.y = Math.max(60, Math.min(midY - 40, enemy.y));
  }

  if(player.fireCD > 0) player.fireCD -= dt;
  if(enemy.fireCD  > 0) enemy.fireCD  -= dt;
  if(!enemy.status.freeze && enemy.fireCD <= 0){
    firePattern(enemy, 1);
    enemy.fireCD = enemyChar.delay;
    if(!enemy.bombUsed && enemy.eng < enemy.maxEng * 0.5 && Math.random() < 0.35) useBomb(enemy);
  }

  for(let i = bullets.length - 1; i >= 0; i--){
    const b = bullets[i];
    if(b.homing){
      const target = b.owner === 'player' ? enemy : player;
      const dx = target.x - b.x, dy = target.y - b.y;
      const dist = Math.sqrt(dx*dx + dy*dy) || 1;
      const speed = b.speed || 380;
      b.vx = (dx / dist) * speed;
      b.vy = (dy / dist) * speed;
    }
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    const target = b.owner === 'player' ? enemy : player;
    if(Math.abs(b.y - target.y) < 50 && Math.abs(b.x - target.x) < 48){
      applyDamage(target, b.dmg);
      if(b.onHit) b.onHit(target);
      spawnExplosion(b.x, b.y, b.owner === 'player' ? '#4af' : '#f44');
      bullets.splice(i, 1);
      continue;
    }
    if(b.y < -40 || b.y > H + 40 || b.x < -40 || b.x > W + 40) bullets.splice(i, 1);
  }

  updateStatus(player, dt);
  updateStatus(enemy, dt);

  if(player.hitTimer > 0){
    player.hitTimer -= dt;
    if(player.hitTimer <= 0) document.getElementById('player-face').src = playerChar.face_n;
  }
  if(enemy.hitTimer > 0){
    enemy.hitTimer -= dt;
    if(enemy.hitTimer <= 0) document.getElementById('enemy-face').src = enemyChar.face_n;
  }
  if(player.specialFlash > 0) player.specialFlash -= dt;
  if(enemy.specialFlash  > 0) enemy.specialFlash  -= dt;
  if(shakeTime > 0) shakeTime -= dt;

  for(let i = particles.length - 1; i >= 0; i--){
    const p = particles[i];
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if(p.life <= 0) particles.splice(i, 1);
  }

  if(player.eng <= 0){ player.eng = 0; endBattle(false); }
  else if(enemy.eng <= 0){ enemy.eng = 0; endBattle(true); }
}

function firePattern(ent, dir){
  const baseDmg = Math.max(1, Math.floor(ent.char.Pwr / 10));
  const speed = ent.char.b_spd * dir;
  const rps = ent.char.RPS || 1;
  const sim = ent.char.sim_f || 1;
  const interval = 75;

  for(let i = 0; i < rps; i++){
    setTimeout(() => {
      if(!battleActive) return;
      let angles = [];
      if(sim <= 1){
        angles = [0];
      } else {
        const maxSpread = Math.min(1.6, 0.25 + sim * 0.07);
        for(let j = 0; j < sim; j++){
          const t = sim === 1 ? 0 : (j / (sim - 1) - 0.5) * 2;
          angles.push(t * maxSpread);
        }
      }
      angles.forEach(ang => {
        bullets.push({
          x: ent.x, y: ent.y + (dir > 0 ? 45 : -45),
          vx: ang * 95,
          vy: speed * 0.96,
          dmg: baseDmg,
          owner: dir < 0 ? 'player' : 'enemy',
          color: dir < 0 ? '#4af' : '#f44'
        });
      });
    }, i * interval);
  }
}

function useBomb(ent){
  if(ent.bombUsed || ent.status.freeze) return;
  ent.bombUsed = true;
  if(ent === player) specialUsedThisMatch = true;
  ent.specialFlash = 1.2;
  const target = ent === player ? enemy : player;
  const type = ent.bomb;
  const isPlayer = ent === player;

  if(type === 'dark'){
    target.status.dark = 3;
    target.status.darkDmg = target.maxEng * 0.05;
    target.speedMul = 0.8;
    addEffect(target.x, target.y, '🌑', 2.5);
  }
  else if(type === 'fire'){
    for(let i = 0; i < 3; i++){
      setTimeout(() => {
        if(!battleActive) return;
        bullets.push({
          x: ent.x, y: ent.y + (isPlayer ? -40 : 40),
          vx: 0, vy: isPlayer ? -300 : 300,
          dmg: 50, owner: isPlayer ? 'player' : 'enemy',
          color: '#ff6600', homing: true, speed: 420,
          onHit: (t) => { t.status.burn = 2; t.status.burnDmg = t.maxEng * 0.01; }
        });
      }, i * 120);
    }
    addEffect(ent.x, ent.y, '🔥', 1.5);
  }
  else if(type === 'ice'){
    target.status.freeze = 3;
    target.status.iceDmg = target.maxEng * 0.01;
    addEffect(target.x, target.y, '❄️', 2.8);
  }
  else if(type === 'wind'){
    for(let i = 0; i < 10; i++){
      setTimeout(() => {
        if(!battleActive) return;
        bullets.push({
          x: ent.x + (Math.random() - 0.5) * 30, y: ent.y + (isPlayer ? -35 : 35),
          vx: (Math.random() - 0.5) * 40, vy: isPlayer ? -280 : 280,
          dmg: 15, owner: isPlayer ? 'player' : 'enemy',
          color: '#88ccff', homing: true, speed: 400,
          onHit: (t) => { t.status.windSlow = (t.status.windSlow || 0) + 0.3; t.speedMul = 0.2; }
        });
      }, i * 55);
    }
    addEffect(ent.x, ent.y, '💨', 1.8);
  }
  else if(type === 'light'){
    ent.status.heal = 5;
    ent.status.healPct = 0.02;
    ent.speedMul = 1.2;
    addEffect(ent.x, ent.y, '✨', 2.5);
  }
  else if(type === 'demon'){
    target.status.demon = 5;
    target.status.demonDmg = target.maxEng * 0.04;
    target.speedMul = 0.6;
    addEffect(target.x, target.y, '😈', 2.8);
  }
  else if(type === 'abyss'){
    const dmg = target.maxEng * 0.40;
    target.eng = Math.max(0, target.eng - dmg);
    updateHPBars();
    target.status.freeze = 3;
    spawnBlackExplosion(target.x, target.y);
    addEffect(target.x, target.y, '💀', 2.5);
  }
}

function applyDamage(ent, dmg){
  ent.eng -= dmg;
  if(ent.eng < 0) ent.eng = 0;
  ent.hitTimer = 0.28;
  if(ent === player){
    document.getElementById('player-face').src = playerChar.face_a;
    shakeTime = 0.4;
    document.getElementById('battle-screen').classList.add('shake');
    setTimeout(() => document.getElementById('battle-screen').classList.remove('shake'), 400);
  } else {
    document.getElementById('enemy-face').src = enemyChar.face_a;
  }
  updateHPBars();
}

function updateStatus(ent, dt){
  if(ent.status.dark > 0){
    ent.status.dark -= dt;
    ent.eng = Math.max(0, ent.eng - ent.status.darkDmg * dt);
    updateHPBars();
    if(ent.status.dark <= 0){ delete ent.status.dark; delete ent.status.darkDmg; ent.speedMul = 1; }
  }
  if(ent.status.burn > 0){
    ent.status.burn -= dt;
    ent.eng = Math.max(0, ent.eng - (ent.status.burnDmg || 0) * dt);
    updateHPBars();
    if(ent.status.burn <= 0){ delete ent.status.burn; delete ent.status.burnDmg; }
  }
  if(ent.status.iceDmg && ent.status.freeze > 0){
    ent.eng = Math.max(0, ent.eng - ent.status.iceDmg * dt);
    updateHPBars();
  }
  if(ent.status.freeze > 0){
    ent.status.freeze -= dt;
    if(ent.status.freeze <= 0){ delete ent.status.freeze; delete ent.status.iceDmg; }
  }
  if(ent.status.windSlow > 0){
    ent.status.windSlow -= dt;
    if(ent.status.windSlow <= 0){ delete ent.status.windSlow; ent.speedMul = 1; }
  }
  if(ent.status.heal > 0){
    ent.status.heal -= dt;
    ent.eng = Math.min(ent.maxEng, ent.eng + (ent.status.healPct || 0.02) * ent.maxEng * dt);
    updateHPBars();
    if(ent.status.heal <= 0){ delete ent.status.heal; delete ent.status.healPct; ent.speedMul = 1; }
  }
  if(ent.status.demon > 0){
    ent.status.demon -= dt;
    ent.eng = Math.max(0, ent.eng - ent.status.demonDmg * dt);
    updateHPBars();
    if(ent.status.demon <= 0){ delete ent.status.demon; delete ent.status.demonDmg; ent.speedMul = 1; }
  }
  if(ent.status.slow > 0){
    ent.status.slow -= dt;
    if(ent.status.slow <= 0) delete ent.status.slow;
  }
}

function addEffect(x, y, emoji, life){ effects.push({x, y, emoji, life, max: life}); }
function spawnExplosion(x, y, color){
  for(let i = 0; i < 12; i++){
    const a = Math.random() * Math.PI * 2, s = 80 + Math.random() * 120;
    particles.push({x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 0.35 + Math.random()*0.25, color, size: 3 + Math.random()*4});
  }
}
function spawnBlackExplosion(x, y){
  for(let i = 0; i < 25; i++){
    const a = Math.random() * Math.PI * 2, s = 100 + Math.random() * 180;
    particles.push({x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 0.5 + Math.random()*0.4, color: '#111', size: 5 + Math.random()*7});
  }
}

function draw(){
  ctx.clearRect(0, 0, W, H);
  let ox = 0, oy = 0;
  if(shakeTime > 0){ ox = (Math.random() - 0.5) * 10; oy = (Math.random() - 0.5) * 8; }
  ctx.save();
  ctx.translate(ox, oy);

  ctx.strokeStyle = 'rgba(180,50,50,.35)';
  ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(W, midY); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = 'rgba(150,50,50,.15)';
  ctx.font = '14px sans-serif';
  ctx.fillText('상대방 진영', 20, 28);
  ctx.fillStyle = 'rgba(50,80,150,.15)';
  ctx.fillText('나의 진영', 20, H - 18);

  drawEntity(player);
  drawEntity(enemy);

  bullets.forEach(b => {
    ctx.beginPath();
    ctx.fillStyle = b.color;
    const r = b.homing ? 8 : 6;
    ctx.arc(b.x, b.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(b.x, b.y, r * 0.4, 0, Math.PI * 2); ctx.fill();
  });

  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life * 2);
    ctx.beginPath();
    ctx.fillStyle = p.color;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  effects.forEach((e, i) => {
    e.life -= 0.016;
    if(e.life <= 0){ effects.splice(i, 1); return; }
    ctx.globalAlpha = e.life / e.max;
    ctx.font = '32px serif';
    ctx.fillText(e.emoji, e.x - 16, e.y - 55);
  });
  ctx.globalAlpha = 1;

  [player, enemy].forEach(ent => {
    if(ent.specialFlash > 0){
      ctx.beginPath();
      ctx.strokeStyle = `rgba(255,255,100,${ent.specialFlash})`;
      ctx.lineWidth = 6;
      ctx.arc(ent.x, ent.y, 60 + (1 - ent.specialFlash) * 30, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = `rgba(255,200,50,${ent.specialFlash * 0.25})`;
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, 55, 0, Math.PI * 2); ctx.fill();
    }
  });

  if(player.status.freeze){
    ctx.fillStyle = 'rgba(100,200,255,.25)';
    ctx.beginPath(); ctx.arc(player.x, player.y, 55, 0, Math.PI * 2); ctx.fill();
  }
  if(enemy.status.freeze){
    ctx.fillStyle = 'rgba(100,200,255,.25)';
    ctx.beginPath(); ctx.arc(enemy.x, enemy.y, 55, 0, Math.PI * 2); ctx.fill();
  }

  ctx.restore();
}

function drawEntity(ent){
  const img = ent.hitTimer > 0 ? ent.char.img_a : ent.char.img_n;
  const size = 92;
  ctx.save();
  ctx.beginPath();
  ctx.arc(ent.x, ent.y, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  if(img.complete && img.naturalWidth > 0){
    ctx.drawImage(img, ent.x - size/2, ent.y - size/2, size, size);
  } else {
    ctx.fillStyle = ent === player ? '#4af' : '#f44';
    ctx.fillRect(ent.x - size/2, ent.y - size/2, size, size);
  }
  ctx.restore();
  ctx.beginPath();
  ctx.strokeStyle = ent === player ? '#4af' : '#f44';
  ctx.lineWidth = 3;
  ctx.arc(ent.x, ent.y, size/2 + 1, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#222';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(ent.char.name, ent.x, ent.y + size/2 + 18);
  ctx.textAlign = 'left';
}
