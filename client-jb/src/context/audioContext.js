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

//----------------------------------------------------

// microphoneManager.js
let microphoneStream = null;

async function startMicrophone() {
  if (microphoneStream) {
    console.log('Microphone already started');
    return microphoneStream;
  }
  try {
    microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log('Microphone started');
    return microphoneStream;
  } catch (err) {
    console.error('Failed to get microphone access:', err);
    throw err;
  }
}

function stopMicrophone() {
  if (microphoneStream) {
    microphoneStream.getTracks().forEach(track => track.stop());
    microphoneStream = null;
    console.log('Microphone stopped');
  }
}

function isMicrophoneActive() {
  return microphoneStream !== null;
}

export { startMicrophone, stopMicrophone, isMicrophoneActive };
