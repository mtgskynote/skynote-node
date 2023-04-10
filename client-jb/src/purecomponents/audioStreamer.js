// Create an audio context
const audioContext = new AudioContext(); // must be audioContext.resumed()'d by a user before mic will work.

var makeAudioStreamer = function () {
  var audioStreamer = {
    // Create an analyser node to extract amplitude data
    analyserNode: audioContext.createAnalyser(),
    pitch: null,

    init: function () {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        audioContext.resume();
        const sourceNode = audioContext.createMediaStreamSource(stream);

        // analyserNode defined in object
        this.analyserNode.fftSize = 2048;

        // Connect the source node to the analyser node
        sourceNode.connect(this.analyserNode);

        // Connect the analyser node to the audio context destination
        // NO DESTINATION for now - we don't want to hear the microphone audio played back
        //analyserNode.connect(audioContext.destination);

        // Load pitch detection model
        this.pitch = ml5.pitchDetection(
          "./model",
          audioContext,
          stream,
          this.modelLoaded.bind(this)
        );
      });
    },

    // Define a function to get the amplitude level of the first channel
    getAmplitude: function () {
      const bufferLength = this.analyserNode.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      this.analyserNode.getByteTimeDomainData(dataArray);
      let maxAmplitude = 0;
      for (let i = 0; i < bufferLength; i++) {
        const amplitude = Math.abs((dataArray[i] - 128) / 128);
        if (amplitude > maxAmplitude) {
          maxAmplitude = amplitude;
        }
      }
      return maxAmplitude;
    },

    // Callback function for pitch detection model
    // ... other parts of the audioStreamer object ...

    modelLoaded: function () {
      console.log("Pitch detection model loaded");
      this.getPitch(); //  to continuously get pitch after the model is loaded
    },

    getPitch: function () {
      if (this.pitch) {
        this.pitch.getPitch((err, frequency) => {
          if (frequency) {
            console.log("Frequency detected:", frequency);
          } else {
            console.log("No pitch detected");
          }
          this.getPitch(); // to recursively call the getPitch function
        });
      } else {
        console.log("Pitch detection model not loaded yet");
      }
    },
  };

  return audioStreamer;
};

export { makeAudioStreamer };
