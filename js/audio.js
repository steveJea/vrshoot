let currentBgm = null;
let bgmFadeTimer = null;
let titleBgmStarted = false;

function playBgm(src, loop = true, volume = 0.45) {
  if (!src) return;
  if (currentBgm && currentBgm.src.includes(src.split('/').pop()) && !currentBgm.paused) {
    return;
  }
  stopBgm(false);
  currentBgm = new Audio(src);
  currentBgm.loop = loop;
  currentBgm.volume = volume;
  currentBgm.play().catch(()=>{});
}

function stopBgm(fade = true) {
  if (!currentBgm) return;
  if (bgmFadeTimer) clearInterval(bgmFadeTimer);
  if (!fade) {
    currentBgm.pause();
    currentBgm = null;
    return;
  }
  const step = 0.05;
  bgmFadeTimer = setInterval(() => {
    if (!currentBgm) { clearInterval(bgmFadeTimer); return; }
    if (currentBgm.volume > step) {
      currentBgm.volume = Math.max(0, currentBgm.volume - step);
    } else {
      currentBgm.pause();
      currentBgm = null;
      clearInterval(bgmFadeTimer);
    }
  }, 50);
}

function tryStartTitleBgm() {
  if (titleBgmStarted) return;
  titleBgmStarted = true;
  playBgm(BGM_RAW + "title.mp3", true, 0.4);
}
