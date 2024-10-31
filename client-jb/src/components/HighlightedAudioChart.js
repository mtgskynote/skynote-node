import React, { useEffect, useRef, useState, useMemo } from 'react';
import IconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

const HighlightedAudioChart = React.memo(
  ({
    audioData,
    sr,
    highlightedSections,
    audioBuffer,
    audioContext,
    playingSection,
    setPlayingSection,
    waveSurferRef,
  }) => {
    const canvasRef = useRef();
    const [isPlaying, setIsPlaying] = useState(null); // Track which section is playing
    const [sourceNode, setSourceNode] = useState(null); // Track audio source node for control

    // Memoize combined sections to avoid unnecessary recalculations
    const combinedSections = useMemo(() => {
      if (!highlightedSections) return [];

      const sectionLabels = ['Timbre', 'Loudness', 'Pitch'];
      const sectionColors = ['red', 'green', 'orange'];

      return highlightedSections.reduce((acc, section, idx) => {
        const [start, end] = section;
        const label = sectionLabels[idx];
        const color = sectionColors[idx];
        const existingSection = acc.find(
          (s) => s.start === start && s.end === end
        );

        if (existingSection) {
          existingSection.label += ` + ${label}`;
        } else {
          acc.push({ start, end, label, color });
        }

        return acc;
      }, []);
    }, [highlightedSections]);

    useEffect(() => {
      const margin = { top: 20, right: 15, bottom: 40, left: 20 };
      const width = 800 - margin.left - margin.right;
      const height = 200 - margin.top - margin.bottom;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (width + margin.left + margin.right) * dpr;
      canvas.height = (height + margin.top + margin.bottom) * dpr;
      ctx.scale(dpr, dpr);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.translate(margin.left, margin.top);

      const xScale = (d) => (d / (audioData.length / sr)) * width;
      const yScale = (d) => ((d + 1) / 2) * height;

      // Draw waveform
      ctx.beginPath();
      ctx.moveTo(0, yScale(audioData[0]));
      for (let i = 1; i < audioData.length; i++) {
        ctx.lineTo(xScale(i / sr), yScale(audioData[i]));
      }
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw highlighted sections
      combinedSections.forEach((section) => {
        const { start, end, color, label } = section;
        const xPos = xScale(start / sr);
        const sectionWidth = xScale(end / sr) - xPos;

        // Draw highlighted section rectangles
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(xPos, 0, sectionWidth, height);
        ctx.globalAlpha = 1.0;

        // Draw section labels
        ctx.fillStyle = '#1e293b';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(label, xPos + sectionWidth / 2, -10);
      });

      // Draw axes
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, height);
      ctx.stroke();

      // Draw x-axis labels (time in seconds)
      const numTicks = 10;
      const tickInterval = audioData.length / sr / numTicks;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#1e293b';
      for (let i = 0; i <= numTicks; i++) {
        const x = (i * width) / numTicks;
        const time = (i * tickInterval).toFixed(1);
        ctx.fillText(time, x, height + 5);
      }

      // Draw x-axis label
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('Time (seconds)', width / 2, height + 25);

      ctx.translate(-margin.left, -margin.top);
    }, [audioData, sr, combinedSections]); // Only depend on combinedSections

    const handlePlayPause = (idx, start, end) => {
      // Stop waveform audio if it's playing
      if (playingSection === 'waveform' && waveSurferRef.current) {
        waveSurferRef.current.pause();
        setIsPlaying(null);
      }

      if (isPlaying === idx && sourceNode) {
        sourceNode.stop();
        setIsPlaying(null);
        setPlayingSection(null);
        return;
      }

      if (sourceNode) {
        sourceNode.stop();
      }

      if (audioContext && audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0, start / sr, (end - start) / sr);
        source.onended = () => {
          setIsPlaying(null);
        };
        setSourceNode(source);
        setIsPlaying(idx);
        setPlayingSection(idx);
      }
    };

    useEffect(() => {
      if (playingSection === 'waveform' && sourceNode) {
        setIsPlaying(null);
        sourceNode.stop();
      }
    }, [playingSection]);

    return (
      <div className="flex flex-col items-center">
        <div className="text-center mb-4 text-slate-800">
          Highlighted Sections on Original Audio
        </div>
        <div className="flex flex-row items-center">
          <canvas ref={canvasRef} style={{ width: '800px', height: '200px' }} />
          <div className="flex flex-col justify-center ml-4 self-center">
            {combinedSections.map((section, idx) => (
              <div key={idx}>
                <IconButton
                  onClick={() =>
                    handlePlayPause(idx, section.start, section.end)
                  }
                  style={{ color: section.color }}
                >
                  {playingSection === idx ? (
                    <PauseCircleIcon />
                  ) : (
                    <PlayCircleIcon />
                  )}
                </IconButton>
                <span className="text-sm text-slate-800">{section.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default HighlightedAudioChart;
