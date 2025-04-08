import * as tf from '@tensorflow/tfjs-node';
import chalk from 'chalk';

// Configuration
const MODEL_PATH = 'file://./crepeModel/model.json';
const CENT_MAPPING = tf.add(
  tf.linspace(0, 7180, 360),
  tf.tensor(1997.3794084376191)
);

let model = null;

export async function initializeModel() {
  try {
    model = await tf.loadLayersModel(MODEL_PATH);
    return model;
  } catch (error) {
    console.error(chalk.red('Model loading failed:'), error);
    throw new Error('Model initialization failed');
  }
}

export async function processAudioFrame(audioChunk) {
  if (!model) throw new Error('Model not initialized');
  let zeromean, framestd, normalized, input, activation;

  try {
    const arrayBuffer = audioChunk.buffer.slice(
      audioChunk.byteOffset,
      audioChunk.byteOffset + audioChunk.length
    );
    const frame = new Float32Array(arrayBuffer);

    // Audio processing pipeline
    zeromean = tf.sub(frame, tf.mean(frame));
    framestd = tf.div(tf.norm(zeromean), Math.sqrt(1024));
    normalized = tf.div(zeromean, framestd);
    input = normalized.reshape([1, 1024]);

    // Model prediction
    activation = model.predict(input).reshape([360]);
    const confidence = activation.max().dataSync()[0];
    const center = activation.argMax().dataSync()[0];

    // Pitch calculation
    const start = Math.max(0, center - 4);
    const end = Math.min(360, center + 5);
    const weights = activation.slice([start], [end - start]);
    const cents = CENT_MAPPING.slice([start], [end - start]);

    const productSum = tf.sum(tf.mul(weights, cents)).dataSync()[0];
    const weightSum = tf.sum(weights).dataSync()[0];
    const predictedCent = productSum / weightSum;
    const predictedHz = 10 * Math.pow(2, predictedCent / 1200.0);

    return {
      pitch: predictedHz,
      confidence: confidence,
      vector: Array.from(activation.dataSync()),
    };
  } catch (error) {
    console.error(chalk.bgRed.white.bold(' Error processing audio: '), error);
  } finally {
    // Clean up TensorFlow tensors to prevent memory leaks
    tf.dispose([zeromean, framestd, normalized, input, activation]);
  }
}
