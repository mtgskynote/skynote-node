import React, { useState, useRef } from 'react';

const AudioPlayer = () => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (importedFile) {
        if (file.name.endsWith('.mp3')) {
          // Handle audio file
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContext.decodeAudioData(importedFile.target.result, function (buffer) {
            setAudioBuffer(buffer);
          });
        } else if (file.name.endsWith('.json')) {
          // Handle JSON file
          console.log("holaaa", file);
          const uint8Array = new Uint8Array(importedFile.target.result);
          const jsonString = new TextDecoder().decode(uint8Array);    
          const jsonContent = JSON.parse(jsonString);
          console.log('JSON Content:', jsonContent);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const playAudio = () => {
    if (audioBuffer) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start(0);
    }
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} />
      <button onClick={playAudio} disabled={!audioBuffer}>
        Play Audio
      </button>
    </div>
  );
};

export default AudioPlayer;


