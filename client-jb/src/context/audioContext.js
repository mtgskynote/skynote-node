// src/audioContext.js
let audioContext;

function createAudioContext() {
  return new (window.AudioContext || window.webkitAudioContext)({ latencyHint: 'interactive' });
}

export function getAudioContext() {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
}

export async function suspendAudioContext() {
  if (audioContext && audioContext.state !== 'suspended') {
    await audioContext.suspend();
  }
}

export async function resumeAudioContext() {
  if (!audioContext) {
    audioContext = createAudioContext();
  } else if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
}