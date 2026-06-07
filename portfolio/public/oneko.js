// oneko.js: https://github.com/adryd325/oneko.js
// Modified: Multicolor cats (calico/tabby/tuxedo) + 4-hour rotation + tab-switch speed fix + 60fps smooth

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

  // ── Cat skin variants ────────────────────────────────────────────────────
  // Each skin = { file, label }
  // 'file' is relative to the script's directory (same folder as oneko.js)
  // Override per-skin by setting data-cat on the <script> tag (uses that for all)
  const catSkins = [
    { file: 'oneko_calico.gif',  label: 'Calico' },   // orange/cream/brown patches
    { file: 'oneko_tabby.gif',   label: 'Tabby' },    // orange striped
    { file: 'oneko_tuxedo.gif',  label: 'Tuxedo' },   // black & white
    { file: 'oneko_calico.gif',  label: 'Calico2',
      filter: 'hue-rotate(200deg) saturate(1.2)' },   // blue-tinted calico
    { file: 'oneko_tabby.gif',   label: 'Tabby Pink',
      filter: 'hue-rotate(310deg) saturate(1.4) brightness(1.1)' }, // pink tabby
    { file: 'oneko_tuxedo.gif',  label: 'Tuxedo Gold',
      filter: 'hue-rotate(30deg) saturate(2) brightness(1.05)' },   // gold tuxedo
  ];

  // ── 4-hour slot color rotation ───────────────────────────────────────────
  // 6 skins × 4 hours = full 24-hour cycle
  function get4HourSlot() {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    return Math.floor(totalMinutes / 240) % catSkins.length;
  }

  function getCurrentSkin() {
    return catSkins[get4HourSlot()];
  }

  function applySkin(skin) {
    const skinFile = skin.file;
    // Resolve path relative to this script's location
    const scriptSrc = (document.currentScript && document.currentScript.src) || '';
    const base = scriptSrc ? scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1) : './';
    nekoEl.style.backgroundImage = `url(${base}${skinFile})`;
    nekoEl.style.filter = skin.filter || 'none';
  }

  const spriteSets = {
    idle:         [[-3, -3]],
    alert:        [[-7, -3]],
    scratchSelf:  [[-5, 0], [-6, 0], [-7, 0]],
    scratchWallN: [[0, 0], [0, -1]],
    scratchWallS: [[-7, -1], [-6, -2]],
    scratchWallE: [[-2, -2], [-2, -3]],
    scratchWallW: [[-4, 0], [-4, -1]],
    tired:        [[-3, -2]],
    sleeping:     [[-2, 0], [-2, -1]],
    N:  [[-1, -2], [-1, -3]],
    NE: [[0, -2], [0, -3]],
    E:  [[-3, 0], [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S:  [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W:  [[-4, -2], [-4, -3]],
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

    // Check for manual override via data-cat attribute
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoEl.style.backgroundImage = `url(${curScript.dataset.cat})`;
      nekoEl.style.filter = 'none';
    } else {
      applySkin(getCurrentSkin());
    }

    document.body.appendChild(nekoEl);

    document.addEventListener('mousemove', function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    // ── FIX: Tab switch speed bug ─────────────────────────────────────────
    // When tab is hidden, accumulated delta becomes huge → speed burst on return.
    // Reset timestamp so the first frame after re-focus is treated as fresh.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        lastFrameTimestamp = null;
        logicAccumulator = 0;
      }
    });
    // ─────────────────────────────────────────────────────────────────────

    // Auto-update skin every minute (switches at exact 4-hour boundary)
    let currentSlot = get4HourSlot();
    setInterval(function () {
      const newSlot = get4HourSlot();
      if (newSlot !== currentSlot && !(curScript && curScript.dataset.cat)) {
        currentSlot = newSlot;
        applySkin(getCurrentSkin());
      }
    }, 60 * 1000);

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp = null;
  let logicAccumulator = 0;
  const LOGIC_INTERVAL = 100;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;

    // ── FIX: Skip first frame after tab switch (timestamp was reset)
    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
      window.requestAnimationFrame(onAnimationFrame);
      return;
    }

    // Cap delta at 200ms to absorb any remaining stutter
    const delta = Math.min(timestamp - lastFrameTimestamp, 200);
    lastFrameTimestamp = timestamp;

    logicAccumulator += delta;
    if (logicAccumulator >= LOGIC_INTERVAL) {
      logicAccumulator -= LOGIC_INTERVAL;
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
      let available = ['sleeping', 'scratchSelf'];
      if (nekoPosX < 32) available.push('scratchWallW');
      if (nekoPosY < 32) available.push('scratchWallN');
      if (nekoPosX > window.innerWidth - 32) available.push('scratchWallE');
      if (nekoPosY > window.innerHeight - 32) available.push('scratchWallS');
      idleAnimation = available[Math.floor(Math.random() * available.length)];
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

    idleTime = 0;

    let direction = '';
    direction  = diffY / distance > 0.5  ? 'N' : '';
    direction += diffY / distance < -0.5 ? 'S' : '';
    direction += diffX / distance > 0.5  ? 'W' : '';
    direction += diffX / distance < -0.5 ? 'E' : '';
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
  }

  init();
})();