import assets from '../theme/assets.js';

const audioCache = {};
const throttleTimers = {};
let muted = false;
let volume = 0.7;
let unlocked = false;

// Web Audio API — for pitch-shifted playback
let audioCtx = null;
const audioBufferCache = {};

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window['webkitAudioContext'])();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

async function loadAudioBuffer(name) {
  if (audioBufferCache[name]) return audioBufferCache[name];
  const path = assets.sounds[name];
  if (!path) return null;
  const ctx = getAudioContext();
  const res = await fetch(path);
  const arrayBuf = await res.arrayBuffer();
  const audioBuf = await ctx.decodeAudioData(arrayBuf);
  audioBufferCache[name] = audioBuf;
  return audioBuf;
}

function playWithPitch(name, pitch = 1.0) {
  if (muted) return;
  loadAudioBuffer(name).then(buffer => {
    if (!buffer) return;
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = pitch;
    const gain = ctx.createGain();
    gain.gain.value = volume * 0.5;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }).catch(() => {});
}

// BGM via Web Audio — gapless looping
let bgmSource = null;
let bgmGain = null;
let bgmToken = 0;

function playBgm(name, fadeInMs = 0) {
  stopBgm();
  const token = ++bgmToken;
  loadAudioBuffer(name).then(buffer => {
    if (token !== bgmToken) return; // superseded by a later call
    if (!buffer) return;
    const ctx = getAudioContext();
    bgmSource = ctx.createBufferSource();
    bgmSource.buffer = buffer;
    bgmSource.loop = true;
    bgmGain = ctx.createGain();
    const targetVol = muted ? 0 : volume * 0.10;
    if (fadeInMs > 0) {
      bgmGain.gain.setValueAtTime(0, ctx.currentTime);
      bgmGain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + fadeInMs / 1000);
    } else {
      bgmGain.gain.value = targetVol;
    }
    bgmSource.connect(bgmGain);
    bgmGain.connect(ctx.destination);
    bgmSource.start();
  }).catch(() => {});
}

function stopBgm() {
  if (bgmSource) {
    try { bgmSource.stop(); } catch (_) {}
    bgmSource = null;
    bgmGain = null;
  }
}

function fadeBgm(durationMs = 800) {
  if (!bgmGain || !bgmSource) return;
  const ctx = getAudioContext();
  const source = bgmSource;
  bgmToken++; // prevent any queued playBgm from starting
  bgmSource = null;
  bgmGain.gain.setValueAtTime(bgmGain.gain.value, ctx.currentTime);
  bgmGain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);
  setTimeout(() => { try { source.stop(); } catch (_) {} }, durationMs + 50);
  bgmGain = null;
}

function preload() {
  Object.entries(assets.sounds).forEach(([name, path]) => {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audioCache[name] = audio;
    } catch (_) {
      // Sound file missing — silently skip
    }
  });
}

function unlock() {
  if (unlocked) return;
  unlocked = true;
  getAudioContext(); // resume AudioContext so queued BGM starts
  Object.values(audioCache).forEach(audio => {
    const p = audio.play();
    if (p && p.then) {
      p.then(() => {
        audio.pause();
        audio.currentTime = 0;
      }).catch(() => {});
    }
  });
}

function play(name) {
  if (muted || !unlocked || !audioCache[name]) return;
  try {
    const audio = audioCache[name].cloneNode();
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (_) {
    // Ignore playback errors
  }
}

function playThrottled(name, intervalMs) {
  const now = Date.now();
  if (throttleTimers[name] && now - throttleTimers[name] < intervalMs) {
    return;
  }
  throttleTimers[name] = now;
  play(name);
}

function setMuted(val) {
  muted = val;
  if (bgmGain) bgmGain.gain.value = val ? 0 : volume * 0.10;
}

function isMuted() {
  return muted;
}

function setVolume(val) {
  volume = Math.max(0, Math.min(1, val));
}

const SoundManager = {
  preload,
  unlock,
  play,
  playThrottled,
  playWithPitch,
  playBgm,
  stopBgm,
  fadeBgm,
  setMuted,
  isMuted,
  setVolume,
};

export default SoundManager;
