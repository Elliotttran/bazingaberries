const tokens = {
  board: {
    gap: '3px',
    padding: '8px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  },

  tiles: [
    { // 0 — Strawberry Red
      gradient: 'radial-gradient(circle at 35% 35%, #ff6b6b, #c0392b)',
      shadow: '0 4px 8px rgba(192,57,43,0.5)',
      glowColor: 'rgba(255,107,107,0.8)',
    },
    { // 1 — Blueberry Blue
      gradient: 'radial-gradient(circle at 35% 35%, #74b9ff, #2980b9)',
      shadow: '0 4px 8px rgba(41,128,185,0.5)',
      glowColor: 'rgba(116,185,255,0.8)',
    },
    { // 2 — Grape Purple
      gradient: 'radial-gradient(circle at 35% 35%, #a29bfe, #6c5ce7)',
      shadow: '0 4px 8px rgba(108,92,231,0.5)',
      glowColor: 'rgba(162,155,254,0.8)',
    },
    { // 3 — Lemon Yellow
      gradient: 'radial-gradient(circle at 35% 35%, #ffeaa7, #fdcb6e)',
      shadow: '0 4px 8px rgba(253,203,110,0.5)',
      glowColor: 'rgba(255,234,167,0.8)',
    },
    { // 4 — Lime Green
      gradient: 'radial-gradient(circle at 35% 35%, #55efc4, #00b894)',
      shadow: '0 4px 8px rgba(0,184,148,0.5)',
      glowColor: 'rgba(85,239,196,0.8)',
    },
    { // 5 — Tangerine Orange
      gradient: 'radial-gradient(circle at 35% 35%, #fab1a0, #e17055)',
      shadow: '0 4px 8px rgba(225,112,85,0.5)',
      glowColor: 'rgba(250,177,160,0.8)',
    },
    { // 6 — Bubblegum Pink
      gradient: 'radial-gradient(circle at 35% 35%, #fd79a8, #e84393)',
      shadow: '0 4px 8px rgba(232,67,147,0.5)',
      glowColor: 'rgba(253,121,168,0.8)',
    },
  ],

  tile: {
    borderRadius: '50%',
  },

  animation: {
    popDuration: '280ms',
    dropDuration: '200ms',
    dropEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    shakeDuration: '300ms',
    selectPulseDuration: '800ms',
    bazingaOverlayDuration: '900ms',
  },

  hud: {
    scoreColor: '#ffeaa7',
    movesColor: '#dfe6e9',
    fontSize: '1.3rem',
    fontWeight: '700',
  },

  bazinga: {
    color: '#ffeaa7',
    fontSize: 'clamp(2rem, 8vw, 4rem)',
    fontWeight: '900',
    textShadow: '0 0 20px rgba(255,234,167,0.6), 0 4px 8px rgba(0,0,0,0.5)',
  },
};

export default tokens;
