const assets = {
  sounds: {
    select: '/sounds/select.mp3',
    swap: '/sounds/swap.mp3',
    invalid: '/sounds/invalid.mp3',
    pop: '/sounds/pop.mp3',
    bazinga: '/sounds/bazinga.mp3',
    gameover: '/sounds/gameover.mp3',
    clar1: '/sounds/clar1.mp3',
  },

  // Phase 2: tile type → image path for berry sprites
  images: {},

  // hype type → pool of image paths (random pick per event)
  hypeImages: {
    HEATING:       ['/img/hype/heatingup.png'],
    ON_FIRE:       ['/img/hype/onfire.png', '/img/hype/SMOKIN.png'],
    BAZINGABERRY:  ['/img/hype/BAZINGABERRY.png', '/img/hype/BERRYGOOD.png', '/img/hype/berryspicy.png', '/img/hype/WOW.png', '/img/hype/DELICIOUS.png'],
    MEGA_BAZINGA:  ['/img/hype/MEGABAZINGABERRY.png', '/img/hype/BUSTING.png', '/img/hype/BERRYSPREE.png', '/img/hype/WOW.png', '/img/hype/berry-blast.png'],
    BAZILLIONAIRE: ['/img/hype/BAZILLIONAIRE.png', '/img/hype/IMGONNABUST.png', '/img/hype/WOW.png', '/img/hype/DELICIOUS.png', '/img/hype/joocealert.png', '/img/hype/berryspicy.png', '/img/hype/THICC.png'],
    JUICY:         ['/img/hype/JOOCY.png', '/img/hype/THICC.png', '/img/hype/joocealert.png', '/img/hype/DELICIOUS.png'],
    MEGA_MATCH:    ['/img/hype/berry-blast.png', '/img/hype/DELICIOUS.png'],
    TRIPLE:        ['/img/hype/Triple.png', '/img/hype/combo.png', '/img/hype/WOW.png'],
    ANOTHER_ONE:   ['/img/hype/double.png', '/img/hype/combo.png'],
  },

  // Future: hype type → video URL for Sora integration
  hypeVideos: {},
};

export default assets;
