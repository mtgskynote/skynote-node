import React, { useEffect } from 'react';
import audioAnalyzerUtils from '../utils/audioAnalyzerUtils';

const { extractFeatures, detectVariableSections, plotAudioWithHighlights } =
  audioAnalyzerUtils;

const HighlightedAudioChart = ({ audioBuffer }) => {
  useEffect(() => {
    if (audioBuffer) {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      extractFeatures(audioBuffer, audioContext).then((features) => {
        console.log(features);
        // const sections = detectVariableSections(features);
        // plotAudioWithHighlights(audioBuffer, sections, 'audioChart');
      });
    }
  }, [audioBuffer]);

  return (
    <div>
      <canvas id="audioChart"></canvas>
    </div>
  );
};

export default HighlightedAudioChart;
