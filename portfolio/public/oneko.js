// oneko.js: https://github.com/adryd325/oneko.js
// Modified: 4-hour color rotation + tab-switch speed fix + rainbow mode + 60fps smooth

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement('div');

  let nekoPosX = 32;
  let nekoPosY = 32;

  let renderX = 32;
  let renderY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;

  // ── 4-hour slot based color filters (24 hours / 4h = 6 slots, repeated) ────
  // Each slot index 0–5 repeats every 4 hours throughout the day.
  // White-theme friendly + multi-color variety including rainbow-style entries.
  const slotFilters = [
    // Slot 0 (00:00–03:59) — Midnight Blue
    'brightness(0.55) sepia(0.8) saturate(4)   hue-rotate(200deg) contrast(1.3)',
    // Slot 1 (04:00–07:59) — Sunrise Orange
    'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(30deg)  contrast(1.35)',
    // Slot 2 (08:00–11:59) — Fresh Green
    'brightness(0.45) sepia(0.8) saturate(4)   hue-rotate(80deg)  contrast(1.35)',
    // Slot 3 (12:00–15:59) — Sky Cyan
    'brightness(0.55) sepia(0.8) saturate(4.5) hue-rotate(170deg) contrast(1.3)',
    // Slot 4 (16:00–19:59) — Lavender Purple
    'brightness(0.5)  sepia(0.8) saturate(4)   hue-rotate(270deg) contrast(1.3)',
    // Slot 5 (20:00–23:59) — Hot Pink
    'brightness(0.55) sepia(0.8) saturate(5)   hue-rotate(320deg) contrast(1.3)',
  ];

  // Extra bonus colors cycling within each slot (changes every 4h but offset by minutes)
  // Keeping 12 named colors so there's enough variety across a full day
  const allFilters = [
    'brightness(0.55) sepia(0.8) saturate(4)   hue-rotate(200deg) contrast(1.3)',  // Blue
    'brightness(0.5)  sepia(0.8) saturate(4)   hue-rotate(270deg) contrast(1.3)',  // Purple
    'brightness(0.55) sepia(0.8) saturate(5)   hue-rotate(320deg) contrast(1.3)',  // Pink
    'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(0deg)   contrast(1.35)', // Red
    'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(30deg)  contrast(1.35)', // Orange
    'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(50deg)  contrast(1.35)', // Yellow
    'brightness(0.45) sepia(0.8) saturate(4)   hue-rotate(80deg)  contrast(1.35)', // Green
    'brightness(0.55) sepia(0.8) saturate(4.5) hue-rotate(170deg) contrast(1.3)',  // Cyan
    'brightness(0.5)  sepia(0.8) saturate(4.5) hue-rotate(155deg) contrast(1.3)',  // Teal
    'brightness(0.55) sepia(0.8) saturate(4.5) hue-rotate(290deg) contrast(1.3)',  // Violet
    'brightness(0.5)  sepia(0.9) saturate(6)   hue-rotate(15deg)  contrast(1.4)',  // Deep Orange
    'brightness(0.5)  sepia(0.8) saturate(5)   hue-rotate(340deg) contrast(1.3)',  // Rose
  ];

  const RAINBOW_MODE = false;
  const RAINBOW_CYCLE_MS = 4000;

  function getRainbowFilter() {
    const hue = (Date.now() % RAINBOW_CYCLE_MS) / RAINBOW_CYCLE_MS * 360;
    return `brightness(0.5) sepia(0.9) saturate(5) hue-rotate(${hue.toFixed(1)}deg) contrast(1.35)`;
  }

  // Returns color index based on current 4-hour slot (0–5 repeating)
  function get4HourSlot() {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(totalMinutes / 240) % allFilters.length;
  }

  function getThemeFilter() {
    if (RAINBOW_MODE) return getRainbowFilter();
    return allFilters[get4HourSlot()];
  }

  // Update color every 4 hours; check every minute for accuracy
  let currentColorSlot = get4HourSlot();
  setInterval(function () {
    const newSlot = get4HourSlot();
    if (newSlot !== currentColorSlot) {
      currentColorSlot = newSlot;
      if (!RAINBOW_MODE) nekoEl.style.filter = getThemeFilter();
    }
  }, 60 * 1000);

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired: [[-3, -2]],
    sleeping: [[-2, 0], [-2, -1]],
    N: [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E: [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S: [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W: [[-4, -2], [-4, -3]],
    NW: [[-1, 0], [-1, -1]],
  };

  function init() {
    nekoEl.id = 'oneko';
    nekoEl.ariaHidden = true;
    nekoEl.style.width = '32px';
    nekoEl.style.height = '32px';
    nekoEl.style.position = 'fixed';
    nekoEl.style.pointerEvents = 'none';
    nekoEl.style.imageRendering = 'pixelated';
    nekoEl.style.backgroundRepeat = 'no-repeat';
    nekoEl.style.backgroundSize = '256px 128px';
    nekoEl.style.backgroundPosition = '0 0';
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.willChange = 'transform';
    nekoEl.style.left = '0px';
    nekoEl.style.top = '0px';
    nekoEl.style.transform = `translate(${nekoPosX - 16}px, ${nekoPosY - 16}px)`;

    let nekoFile = './oneko.gif';
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat;
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.filter = getThemeFilter();

    const themeObserver = new MutationObserver(() => {
      if (!RAINBOW_MODE) nekoEl.style.filter = getThemeFilter();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    document.body.appendChild(nekoEl);

    document.addEventListener('mousemove', function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    // ── FIX: Tab switch speed bug ────────────────────────────────────────────
    // When tab becomes hidden, mark timestamp as stale so the next frame
    // after re-focus doesn't accumulate a huge delta and cause a speed burst.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        lastFrameTimestamp = null;
        logicAccumulator = 0;
      }
    });
    // ────────────────────────────────────────────────────────────────────────

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp = null;
  let logicAccumulator = 0;
  const LOGIC_INTERVAL = 100;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;

    // ── FIX: If timestamp was reset (tab switch), re-init and skip this frame
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
      window.requestAnimationFrame(onAnimationFrame);
      return;
    }

    const delta = Math.min(timestamp - lastFrameTimestamp, 200); // cap at 200ms to prevent jumps
    lastFrameTimestamp = timestamp;

    logicAccumulator += delta;
    if (logicAccumulator >= LOGIC_INTERVAL) {
      logicAccumulator -= LOGIC_INTERVAL;
      if (RAINBOW_MODE) nekoEl.style.filter = getRainbowFilter();
      frame();
    }

    const lerpFactor = 0.28;
    renderX += (nekoPosX - renderX) * lerpFactor;
    renderY += (nekoPosY - renderY) * lerpFactor;

    nekoEl.style.transform = `translate(${Math.round(renderX - 16)}px, ${Math.round(renderY - 16)}px)`;

    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, frame) {
    const sprite = spriteSets[name][frame % spriteSets[name].length];
    nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;
    if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
      let avalibleIdleAnimations = ['sleeping', 'scratchSelf'];
      if (nekoPosX < 32) avalibleIdleAnimations.push('scratchWallW');
      if (nekoPosY < 32) avalibleIdleAnimations.push('scratchWallN');
      if (nekoPosX > window.innerWidth - 32) avalibleIdleAnimations.push('scratchWallE');
      if (nekoPosY > window.innerHeight - 32) avalibleIdleAnimations.push('scratchWallS');
      idleAnimation = avalibleIdleAnimations[Math.floor(Math.random() * avalibleIdleAnimations.length)];
    }
    switch (idleAnimation) {
      case 'sleeping':
        if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
        setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case 'scratchWallN':
      case 'scratchWallS':
      case 'scratchWallE':
      case 'scratchWallW':
      case 'scratchSelf':
        setSprite(idleAnimation, idleAnimationFrame);
        if (idleAnimationFrame > 9) resetIdleAnimation();
        break;
      default:
        setSprite('idle', 0);
        return;
    }
    idleAnimationFrame += 1;
  }

  function frame() {
    frameCount += 1;
    const diffX = nekoPosX - mousePosX;
    const diffY = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite('alert', 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    let direction = '';
    direction = diffY / distance > 0.5 ? 'N' : '';
    direction += diffY / distance < -0.5 ? 'S' : '';
    direction += diffX / distance > 0.5 ? 'W' : '';
    direction += diffX / distance < -0.5 ? 'E' : '';
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
  }

  init();
})();