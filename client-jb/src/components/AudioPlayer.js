import React, { useState, useRef } from 'react';
import { getAudioContext } from '../context/audioContext';

/**
 * The AudioPlayer component allows users to select and play audio files.
 *
 * State:
 * - audioBuffer (AudioBuffer|null): The decoded audio data.
 *
 * Refs:
 * - fileInputRef (object): Reference to the file input element.
 *
 * The component:
 * - Handles file selection and reads the file using FileReader.
 * - Decodes audio data if the selected file is an MP3.
 * - Parses and logs JSON content if the selected file is a JSON.
 * - Plays the decoded audio using the Web Audio API.
 */
const AudioPlayer = () => {
  const [audioBuffer, setAudioBuffer] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    const fileInput = fileInputRef.current;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = function (importedFile) {
        if (file.name.endsWith('.mp3')) {
          // Handle audio file
          const audioContext = getAudioContext();
          audioContext.decodeAudioData(
            importedFile.target.result,
            function (buffer) {
              setAudioBuffer(buffer);
            }
          );
        } else if (file.name.endsWith('.json')) {
          // Handle JSON file
          console.log('holaaa', file);
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
      const audioContext = getAudioContext();
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
