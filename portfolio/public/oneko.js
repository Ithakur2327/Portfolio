
(function oneko() {
  const isReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches === true;
  if (isReducedMotion) return;

  // Low-end detection: skip on very constrained devices
  const isLowEnd = (
    (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory !== undefined && navigator.deviceMemory <= 1)
  );
  if (isLowEnd) return;

  const nekoEl = document.createElement('div');

  let nekoPosX = 32, nekoPosY = 32;
  let renderX  = 32, renderY  = 32;
  let mousePosX = 0, mousePosY = 0;
  let frameCount = 0, idleTime = 0;
  let idleAnimation = null, idleAnimationFrame = 0;
  const nekoSpeed = 10;

  // ── 12 multicolor cat skins ───────────────────────────────────────────────
  const catSkins = [
    { file: 'oneko_cat1_calico.png',    label: 'Calico'    },
    { file: 'oneko_cat2_tabby.png',     label: 'Tabby'     },
    { file: 'oneko_cat3_tuxedo.png',    label: 'Tuxedo'    },
    { file: 'oneko_cat4_blue.png',      label: 'Blue'      },
    { file: 'oneko_cat5_pink.png',      label: 'Pink'      },
    { file: 'oneko_cat6_gold.png',      label: 'Gold'      },
    { file: 'oneko_cat7_purple.png',    label: 'Purple'    },
    { file: 'oneko_cat8_mint.png',      label: 'Mint'      },
    { file: 'oneko_cat9_red.png',       label: 'Red'       },
    { file: 'oneko_cat10_cyan.png',     label: 'Cyan'      },
    { file: 'oneko_cat11_lavender.png', label: 'Lavender'  },
    { file: 'oneko_cat12_sunset.png',   label: 'Sunset'    },
  ];

  // ── 1-hour slot rotation (12 cats × 1 hour = 12-hour cycle) ──────────────
  function getHourSlot() {
    return new Date().getHours() % catSkins.length;
  }

  function getCurrentSkin() {
    return catSkins[getHourSlot()];
  }

  // Resolve path relative to this script
  function skinUrl(file) {
    const src = (document.currentScript && document.currentScript.src) || '';
    const base = src ? src.substring(0, src.lastIndexOf('/') + 1) : './';
    return base + file;
  }

  function applySkin(skin) {
    nekoEl.style.backgroundImage = 'url(' + skinUrl(skin.file) + ')';
    nekoEl.style.filter = 'none';
  }

  // ── Sprite map ────────────────────────────────────────────────────────────
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
    NE: [[0, -2],  [0, -3]],
    E:  [[-3, 0],  [-3, -1]],
    SE: [[-5, -1], [-5, -2]],
    S:  [[-6, -3], [-7, -2]],
    SW: [[-5, -3], [-6, -1]],
    W:  [[-4, -2], [-4, -3]],
    NW: [[-1, 0],  [-1, -1]],
  };

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    nekoEl.id = 'oneko';
    nekoEl.ariaHidden = true;
    Object.assign(nekoEl.style, {
      width:  '32px',
      height: '32px',
      position: 'fixed',
      pointerEvents: 'none',
      imageRendering: 'pixelated',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '256px 128px',
      backgroundPosition: '0 0',
      zIndex: '2147483647',
      willChange: 'transform',
      left: '0px',
      top:  '0px',
      transform: 'translate(' + (nekoPosX - 16) + 'px,' + (nekoPosY - 16) + 'px)',
    });

    const curScript = document.currentScript;
    if (curScript && curScript.dataset.cat) {
      nekoEl.style.backgroundImage = 'url(' + curScript.dataset.cat + ')';
    } else {
      applySkin(getCurrentSkin());
    }

    document.body.appendChild(nekoEl);

    document.addEventListener('mousemove', function(e) {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
    });

    // Tab-switch: reset timestamp to avoid speed burst
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        lastFrameTimestamp = null;
        logicAccumulator = 0;
      }
    });

    // Hourly skin check (exact boundary switch)
    let currentSlot = getHourSlot();
    setInterval(function() {
      const newSlot = getHourSlot();
      if (newSlot !== currentSlot && !(curScript && curScript.dataset.cat)) {
        currentSlot = newSlot;
        applySkin(getCurrentSkin());
      }
    }, 60 * 1000);

    window.requestAnimationFrame(onAnimationFrame);
  }

  // ── RAF loop — capped delta, lerp render ──────────────────────────────────
  let lastFrameTimestamp = null;
  let logicAccumulator = 0;
  const LOGIC_INTERVAL = 100; // 10 logic fps (cat movement speed unchanged)

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

    // Silky-smooth position lerp (looks 200fps even on 60Hz)
    const lerpFactor = 0.28;
    renderX += (nekoPosX - renderX) * lerpFactor;
    renderY += (nekoPosY - renderY) * lerpFactor;

    nekoEl.style.transform =
      'translate(' + Math.round(renderX - 16) + 'px,' + Math.round(renderY - 16) + 'px)';

    window.requestAnimationFrame(onAnimationFrame);
  }

  function setSprite(name, f) {
    const sprite = spriteSets[name][f % spriteSets[name].length];
    nekoEl.style.backgroundPosition = (sprite[0] * 32) + 'px ' + (sprite[1] * 32) + 'px';
  }

  function resetIdleAnimation() {
    idleAnimation = null;
    idleAnimationFrame = 0;
  }

  function idle() {
    idleTime += 1;
    if (idleTime > 10 && Math.floor(Math.random() * 200) === 0 && idleAnimation == null) {
      const available = ['sleeping', 'scratchSelf'];
      if (nekoPosX < 32) available.push('scratchWallW');
      if (nekoPosY < 32) available.push('scratchWallN');
      if (nekoPosX > window.innerWidth - 32)  available.push('scratchWallE');
      if (nekoPosY > window.innerHeight - 32) available.push('scratchWallS');
      idleAnimation = available[Math.floor(Math.random() * available.length)];
    }
    switch (idleAnimation) {
      case 'sleeping':
        if (idleAnimationFrame < 8) { setSprite('tired', 0); break; }
        setSprite('sleeping', Math.floor(idleAnimationFrame / 4));
        if (idleAnimationFrame > 192) resetIdleAnimation();
        break;
      case 'scratchWallN': case 'scratchWallS':
      case 'scratchWallE': case 'scratchWallW':
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
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);

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
    nekoPosX = Math.min(Math.max(16, nekoPosX), window.innerWidth  - 16);
    nekoPosY = Math.min(Math.max(16, nekoPosY), window.innerHeight - 16);
  }

  init();
})();