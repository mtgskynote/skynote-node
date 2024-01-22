/* 
    Create a script node for estimating pitch from the audio stream.
    Parameters:
        audioContext
        bufferSize
        pitchCallback - a callback with an arg: the object {pitch, confidence} w/ pitch in Hz, confidence in [0,1]
        pitchVectorCallback - a callback with an arg: Float32Array(360) of pitch strength values
*/ 
//import '../libs/tfjs-0.8.0.min.js'; // defines tf in the global space
import * as tf from '@tensorflow/tfjs';

export async function makeCrepeScriptNode(audioContext, bufferSize, pitchCallback, pitchVectorCallback ) {
    console.log(`loaded crepeScriptNode module`)
    function status(message) {
        //document.getElementById('status').innerHTML = message;  // useful for phones with no console.
        console.log(message)
        }

      // perform resampling the audio to 16000 Hz, on which the model is trained.
    // setting a sample rate in AudioContext is not supported by most browsers at the moment.
    function resample(audioBuffer, onComplete) {
        const interpolate = (audioBuffer.sampleRate % 16000 !== 0);
        const multiplier = audioBuffer.sampleRate / 16000;
        const original = audioBuffer.getChannelData(0);
        const subsamples = new Float32Array(1024);
        for (var i = 0; i < 1024; i++) {
        if (!interpolate) {
            subsamples[i] = original[i * multiplier];
        } else {
            // simplistic, linear resampling
            var left = Math.floor(i * multiplier);
            var right = left + 1;
            var p = i * multiplier - left;
            subsamples[i] = (1 - p) * original[left] + p * original[right];
        }
        }
        onComplete(subsamples);
    }
    function process_microphone_buffer(event) {
        //console.log(`process_mic_buffer`)
        //console.log(`..   baseLatency: ${audioContext.baseLatency} and outputLatency: ${audioContext.outputLatency}) `)
        resample(event.inputBuffer, function(resampled) {
          tf.tidy(() => {
            // run the prediction on the model
            const frame = tf.tensor(resampled.slice(0, 1024));
            const zeromean = tf.sub(frame, tf.mean(frame));
            const framestd = tf.tensor(tf.norm(zeromean).dataSync()/Math.sqrt(1024));
            const normalized = tf.div(zeromean, framestd);
            const input = normalized.reshape([1, 1024]);
            const activation = window.model.predict([input]).reshape([360]);
    
            // the confidence of voicing activity and the argmax bin
            const confidence = activation.max().dataSync()[0];   // *** pass confidence to callback
            const center = activation.argMax().dataSync()[0];
    
            // slice the local neighborhood around the argmax bin
            const start = Math.max(0, center - 4);
            const end = Math.min(360, center + 5);
            const weights = activation.slice([start], [end - start]);
            const cents = cent_mapping.slice([start], [end - start]);
    
            // take the local weighted average to get the predicted pitch
            const products = tf.mul(weights, cents);
            const productSum = products.dataSync().reduce((a, b) => a + b, 0);
            const weightSum = weights.dataSync().reduce((a, b) => a + b, 0);
            const predicted_cent = productSum / weightSum;
            const predicted_hz = 10 * Math.pow(2, predicted_cent / 1200.0);  // *** pass predicted_hz to callback
            //console.log(`pitchcallback with ${pitchCallback}`)
            pitchCallback && pitchCallback({pitch: predicted_hz.toFixed(3), confidence: confidence.toFixed(3)})
            pitchVectorCallback && pitchVectorCallback(activation.dataSync());
          });
        });
    }

    async function initTF() {
        try {
            status('Loading Keras model...');
            console.log(`tf is ${tf}`)
            console.log(`and tf.loadModel is ${tf.loadModel}`)
            //window.model = await tf.loadModel('model/model.json');
            window.model = await tf.loadModel('/model/model.json');
            status('Model loading complete');

        } catch (e) {
            console.log(e.message);
        }
    }
    await initTF();


    // bin number -> cent value mapping
    const cent_mapping = tf.add(tf.linspace(0, 7180, 360), tf.tensor(1997.3794084376191))

    let scriptNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
    scriptNode.onaudioprocess = process_microphone_buffer;

    return scriptNode
}