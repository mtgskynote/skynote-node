import React, { useState, useRef } from 'react';

const AudioPlayer = () => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioContext.decodeAudioData(e.target.result, function (buffer) {
          setAudioBuffer(buffer);
        });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const playAudio = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".wav" />
      <button onClick={playAudio} disabled={!audioBuffer}>
        Play
      </button>
    </div>
  );
};

export default AudioPlayer;
