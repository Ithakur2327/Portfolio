// oneko.js: https://github.com/adryd325/oneko.js
// Modified: 10 calico themed colour variants + 1-hour rotation + tab-switch speed fix + 60fps smooth
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

  // ── 10 Calico Themed Variants (CSS filter only – no extra image files) ──
  // All use the same oneko_calico.gif/png; colour is shifted via CSS filter.
  // Themes follow the 24-hour clock: skin = hour % 10
  //
  //  Hour  Skin#  Theme
  //   0     0     🐱 Original Calico   (warm orange/cream/brown)
  //   1     1     🌸 Pink Sakura        (soft pink)
  //   2     2     💜 Purple Mystic      (deep purple)
  //   3     3     🩵 Cyan Arctic        (icy blue-cyan)
  //   4     4     💚 Green Forest       (leafy green)
  //   5     5     💛 Golden Yellow      (bright gold)
  //   6     6     ❤️  Ruby Red           (deep red)
  //   7     7     🌙 Midnight Blue      (dark navy)
  //   8     8     🪻 Lavender           (soft purple-pink)
  //   9     9     🌅 Sunset Orange      (warm amber-orange)
  //  10     0     (cycle repeats)
  const catSkins = [
    {
      label: 'Original Calico',
      filter: 'none',
      emoji: '🐱',
    },
    {
      label: 'Pink Sakura',
      filter: 'hue-rotate(310deg) saturate(1.6) brightness(1.1)',
      emoji: '🌸',
    },
    {
      label: 'Purple Mystic',
      filter: 'hue-rotate(200deg) saturate(1.8) brightness(0.95)',
      emoji: '💜',
    },
    {
      label: 'Cyan Arctic',
      filter: 'hue-rotate(160deg) saturate(1.5) brightness(1.1)',
      emoji: '🩵',
    },
    {
      label: 'Green Forest',
      filter: 'hue-rotate(100deg) saturate(1.6) brightness(0.95)',
      emoji: '💚',
    },
    {
      label: 'Golden Yellow',
      filter: 'hue-rotate(30deg) saturate(2.2) brightness(1.1)',
      emoji: '💛',
    },
    {
      label: 'Ruby Red',
      filter: 'hue-rotate(340deg) saturate(2.0) brightness(0.9)',
      emoji: '❤️',
    },
    {
      label: 'Midnight Blue',
      filter: 'hue-rotate(185deg) saturate(2.0) brightness(0.7)',
      emoji: '🌙',
    },
    {
      label: 'Lavender',
      filter: 'hue-rotate(220deg) saturate(1.3) brightness(1.15)',
      emoji: '🪻',
    },
    {
      label: 'Sunset Orange',
      filter: 'hue-rotate(15deg) saturate(2.5) brightness(1.05)',
      emoji: '🌅',
    },
  ];

  // ── 1-hour slot rotation ─────────────────────────────────────────────────
  // Returns 0-9 based on current hour (hour % 10)
  function getHourSlot() {
    return new Date().getHours() % catSkins.length;
  }

  function getCurrentSkin() {
    return catSkins[getHourSlot()];
  }

  // Resolve the calico image path relative to this script
  function getCalicoPath() {
    const curScript = document.currentScript || _scriptRef;
    const scriptSrc = (curScript && curScript.src) || '';
    const base = scriptSrc
      ? scriptSrc.substring(0, scriptSrc.lastIndexOf('/') + 1)
      : './';
    // Support both .gif and .png – prefer .png if available via data-calico
    const customFile = curScript && curScript.dataset.calico;
    return base + (customFile || 'oneko_calico.gif');
  }

  function applySkin(skin) {
    nekoEl.style.backgroundImage = `url(${getCalicoPath()})`;
    nekoEl.style.filter = skin.filter;
    // Optional: log to console for debugging
    // console.log(`[oneko] Skin changed → ${skin.emoji} ${skin.label}`);
  }

  // Keep a ref to the script element since document.currentScript
  // is only valid during initial evaluation
  const _scriptRef = document.currentScript;

  // ── Sprite map ───────────────────────────────────────────────────────────
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

  // ── Init ─────────────────────────────────────────────────────────────────
  function init() {
    nekoEl.id = 'oneko';
    nekoEl.ariaHidden = true;
    nekoEl.style.width = '32px';
    nekoEl.style.height = '32px';
    nekoEl.style.position = 'fixed';
    nekoEl.style.pointerEvents = 'none';
    // Sprite sheet is supersampled at 4x (128px per 32px frame) so the browser's
    // own high-quality downscaling renders a crisp, smooth cat instead of the
    // blocky/aliased look you get from 1:1 pixel art stretched on hi-DPI screens.
    nekoEl.style.imageRendering = 'auto';
    nekoEl.style.backgroundRepeat = 'no-repeat';
    nekoEl.style.backgroundSize = '256px 128px';
    nekoEl.style.backgroundPosition = '0 0';
    nekoEl.style.zIndex = 2147483647;
    nekoEl.style.willChange = 'transform';
    nekoEl.style.left = '0px';
    nekoEl.style.top = '0px';
    nekoEl.style.transform = `translate(${nekoPosX - 16}px, ${nekoPosY - 16}px)`;

    // Manual override: <script src="oneko.js" data-cat="my_cat.gif"></script>
    // If data-cat is set, use that image with no filter (full manual control)
    const curScript = _scriptRef;
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

    // ── FIX: Tab switch speed bug ──────────────────────────────────────────
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        lastFrameTimestamp = null;
        logicAccumulator = 0;
      }
    });

    // ── Auto skin update every minute ──────────────────────────────────────
    // Checks at the top of each minute; switches instantly at the hour boundary
    let currentSlot = getHourSlot();
    setInterval(function () {
      // Skip if manual override is active
      if (curScript && curScript.dataset.cat) return;
      const newSlot = getHourSlot();
      if (newSlot !== currentSlot) {
        currentSlot = newSlot;
        applySkin(getCurrentSkin());
      }
    }, 60 * 1000); // check every 60 seconds

    window.requestAnimationFrame(onAnimationFrame);
  }

  // ── Animation loop ───────────────────────────────────────────────────────
  let lastFrameTimestamp = null;
  let logicAccumulator = 0;
  const LOGIC_INTERVAL = 100;

  function onAnimationFrame(timestamp) {
    if (!nekoEl.isConnected) return;

    if (!lastFrameTimestamp) {
      lastFrameTimestamp = timestamp;
      window.requestAnimationFrame(onAnimationFrame);
      return;
    }

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

  // ── Sprite helpers ───────────────────────────────────────────────────────
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
      Math.floor(Math.random() * 200) === 0 &&
      idleAnimation == null
    ) {
      const available = ['sleeping', 'scratchSelf'];
      if (nekoPosX < 32)                        available.push('scratchWallW');
      if (nekoPosY < 32)                        available.push('scratchWallN');
      if (nekoPosX > window.innerWidth  - 32)   available.push('scratchWallE');
      if (nekoPosY > window.innerHeight - 32)   available.push('scratchWallS');
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
    const diffX    = nekoPosX - mousePosX;
    const diffY    = nekoPosY - mousePosY;
    const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

    if (distance < nekoSpeed || distance < 48) {
      idle();
      return;
    }

    idleAnimation      = null;
    idleAnimationFrame = 0;

    if (idleTime > 1) {
      setSprite('alert', 0);
      idleTime = Math.min(idleTime, 7);
      idleTime -= 1;
      return;
    }

    idleTime = 0;

    let direction  = diffY / distance >  0.5 ? 'N' : '';
    direction     += diffY / distance < -0.5 ? 'S' : '';
    direction     += diffX / distance >  0.5 ? 'W' : '';
    direction     += diffX / distance < -0.5 ? 'E' : '';

    setSprite(direction, frameCount);

    nekoPosX -= (diffX / distance) * nekoSpeed;
    nekoPosY -= (diffY / distance) * nekoSpeed;
    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth  - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
  }

  init();
})();