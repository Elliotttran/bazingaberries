const tokens = {
  board: {
    gap: '3px',
    padding: '8px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },

  tiles: [
    { // 0 — Strawberry
      image: '/img/strawberry.png',
      glowColor: 'rgba(255,107,107,0.8)',
    },
    { // 1 — Blueberry
      image: '/img/blueberry.png',
      glowColor: 'rgba(116,185,255,0.8)',
    },
    { // 2 — Grape
      image: '/img/grape.png',
      glowColor: 'rgba(162,155,254,0.8)',
    },
    { // 3 — Banana
      image: '/img/banana.png',
      glowColor: 'rgba(255,234,167,0.8)',
    },
    { // 4 — Kiwi
      image: '/img/kiwi.png',
      glowColor: 'rgba(85,239,196,0.8)',
    },
    { // 5 — Orange
      image: '/img/orange.png',
      glowColor: 'rgba(250,177,160,0.8)',
    },
    { // 6 — Cherry
      image: '/img/cherry.png',
      glowColor: 'rgba(253,121,168,0.8)',
    },
  ],

  tile: {
    borderRadius: '50%',
  },

  animation: {
    popDuration: '280ms',
    dropDuration: '350ms',
    dropEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    swapDuration: '200ms',
    shakeDuration: '300ms',
    selectPulseDuration: '800ms',
    hypeOverlayDuration: '1200ms',
  },

  hud: {
    scoreColor: '#ffeaa7',
    movesColor: '#dfe6e9',
    fontSize: '1.3rem',
    fontWeight: '700',
  },

  bazinga: {
    color: '#ffeaa7',
    fontSize: 'clamp(2rem, 10vw, 4.5rem)',
    fontWeight: '900',
    textShadow: '0 0 20px rgba(255,234,167,0.6), 0 4px 8px rgba(0,0,0,0.5)',
  },
};

export default tokens;
