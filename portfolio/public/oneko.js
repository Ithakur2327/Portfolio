// oneko.js: https://github.com/adryd325/oneko.js
// Modified: Day-based cat colors (Saturday = Green) + optional rainbow mode

(function oneko() {
  const isReducedMotion =
    window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
    window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

  if (isReducedMotion) return;

  const nekoEl = document.createElement('div');

  let nekoPosX = 32;
  let nekoPosY = 32;

  let mousePosX = 0;
  let mousePosY = 0;

  let frameCount = 0;
  let idleTime = 0;
  let idleAnimation = null;
  let idleAnimationFrame = 0;

  const nekoSpeed = 10;

  // ── Day-based color filters ──────────────────────────────────────────────
  // getDay() returns: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const dayFilters = {
    0: 'brightness(0.55) sepia(0.8) saturate(4)   hue-rotate(200deg) contrast(1.3)', // Sunday    → Blue
    1: 'brightness(0.5)  sepia(0.8) saturate(4)   hue-rotate(270deg) contrast(1.3)', // Monday    → Purple
    2: 'brightness(0.55) sepia(0.8) saturate(5)   hue-rotate(320deg) contrast(1.3)', // Tuesday   → Pink
    3: 'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(0deg)   contrast(1.35)', // Wednesday → Red
    4: 'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(30deg)  contrast(1.35)', // Thursday  → Orange
    5: 'brightness(0.5)  sepia(0.9) saturate(5)   hue-rotate(50deg)  contrast(1.35)', // Friday    → Yellow
    6: 'brightness(0.45) sepia(0.8) saturate(4)   hue-rotate(80deg)  contrast(1.35)', // Saturday  → Green ✦
  };

  // ── RAINBOW MODE ─────────────────────────────────────────────────────────
  // Set this to true for a smoothly cycling rainbow cat!
  const RAINBOW_MODE = false;

  // Rainbow cycle speed: smaller = faster (in milliseconds per full cycle)
  const RAINBOW_CYCLE_MS = 4000;

  function getRainbowFilter() {
    const hue = (Date.now() % RAINBOW_CYCLE_MS) / RAINBOW_CYCLE_MS * 360;
    return `brightness(0.5) sepia(0.9) saturate(5) hue-rotate(${hue.toFixed(1)}deg) contrast(1.35)`;
  }

  function getThemeFilter() {
    if (RAINBOW_MODE) return getRainbowFilter();
    const day = new Date().getDay();
    return dayFilters[day];
  }
  // ─────────────────────────────────────────────────────────────────────────

  const spriteSets = {
    idle: [[-3, -3]],
    alert: [[-7, -3]],
    scratchSelf: [
      [-5, 0],
      [-6, 0],
      [-7, 0],
    ],
    scratchWallN: [
      [0, 0],
      [0, -1],
    ],
    scratchWallS: [
      [-7, -1],
      [-6, -2],
    ],
    scratchWallE: [
      [-2, -2],
      [-2, -3],
    ],
    scratchWallW: [
      [-4, 0],
      [-4, -1],
    ],
    tired: [[-3, -2]],
    sleeping: [
      [-2, 0],
      [-2, -1],
    ],
    N: [
      [-1, -2],
      [-1, -3],
    ],
    NE: [
      [0, -2],
      [0, -3],
    ],
    E: [
      [-3, 0],
      [-3, -1],
    ],
    SE: [
      [-5, -1],
      [-5, -2],
    ],
    S: [
      [-6, -3],
      [-7, -2],
    ],
    SW: [
      [-5, -3],
      [-6, -1],
    ],
    W: [
      [-4, -2],
      [-4, -3],
    ],
    NW: [
      [-1, 0],
      [-1, -1],
    ],
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
    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
    nekoEl.style.zIndex = 2147483647;

    let nekoFile = './oneko.gif';
    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoFile = curScript.dataset.cat;
    }
    nekoEl.style.backgroundImage = `url(${nekoFile})`;
    nekoEl.style.filter = getThemeFilter();

    // Watch for dark/light mode class changes
    const themeObserver = new MutationObserver(() => {
      if (!RAINBOW_MODE) nekoEl.style.filter = getThemeFilter();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    document.body.appendChild(nekoEl);

    document.addEventListener('mousemove', function (event) {
      mousePosX = event.clientX;
      mousePosY = event.clientY;
    });

    window.requestAnimationFrame(onAnimationFrame);
  }

  let lastFrameTimestamp;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;
    if (!lastFrameTimestamp) lastFrameTimestamp = timestamp;

    if (timestamp - lastFrameTimestamp > 100) {
      lastFrameTimestamp = timestamp;
      // Update rainbow filter every frame tick
      if (RAINBOW_MODE) nekoEl.style.filter = getRainbowFilter();
      frame();
    }
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

    if (
      idleTime > 10 &&
      Math.floor(Math.random() * 200) == 0 &&
      idleAnimation == null
    ) {
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

    let direction;
    direction = diffY / distance > 0.5 ? 'N' : '';
    direction += diffY / distance < -0.5 ? 'S' : '';
    direction += diffX / distance > 0.5 ? 'W' : '';
    direction += diffX / distance < -0.5 ? 'E' : '';
    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;

    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);

    nekoEl.style.left = `${nekoPosX - 16}px`;
    nekoEl.style.top = `${nekoPosY - 16}px`;
  }

  init();
})();