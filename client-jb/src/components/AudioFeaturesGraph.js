import React, { useRef, useEffect } from 'react';

const AudioFeaturesGraph = ({
  values,
  sampleRate,
  hopSize,
  color = '#000000',
  title = 'Audio Features',
  width = 875,
  height = 224,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Set the canvas dimensions to account for the device pixel ratio
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.scale(devicePixelRatio, devicePixelRatio);

    const padding = 50;
    const topPadding = 20;
    const graphWidth = width - padding;
    const graphHeight = height - padding - topPadding;
    const scaleX = graphWidth / values.length;
    const maxValue = Math.max(...values);
    const scaleY = graphHeight / maxValue;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw x and y axes
    context.strokeStyle = '#1e293b';
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(padding, graphHeight + topPadding);
    context.lineTo(width, graphHeight + topPadding);
    context.moveTo(padding, topPadding);
    context.lineTo(padding, graphHeight + topPadding);
    context.stroke();

    // Draw x axis values (time in seconds)
    context.fillStyle = '#1e293b';
    context.font = '12px Arial';
    const duration = (values.length * hopSize) / sampleRate;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i * graphWidth) / 10;
      const time = (i * duration) / 10;
      context.fillText(time.toFixed(2), x, graphHeight + topPadding + 15);
    }

    // Draw x-axis label
    context.fillText(
      'Time (seconds)',
      width / 2 - 30,
      graphHeight + topPadding + 35
    );

    // Draw y axis values
    for (let i = 0; i <= 5; i++) {
      const y = graphHeight + topPadding - (i * graphHeight) / 5;
      context.fillText(((i * maxValue) / 5).toFixed(2), 10, y + 3);
    }

    // Draw the graph line
    context.strokeStyle = color;
    context.lineWidth = 2; // Thicker line
    context.beginPath();
    context.moveTo(padding, graphHeight + topPadding - values[0] * scaleY);
    values.forEach((value, index) => {
      context.lineTo(
        padding + index * scaleX,
        graphHeight + topPadding - value * scaleY
      );
    });
    context.stroke();
  }, [values, sampleRate, hopSize, color, width, height]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas.getContext('2d');
  //   const devicePixelRatio = window.devicePixelRatio || 1;

  //   // Set the canvas dimensions to account for the device pixel ratio
  //   canvas.width = width * devicePixelRatio;
  //   canvas.height = height * devicePixelRatio;
  //   canvas.style.width = `${width}px`;
  //   canvas.style.height = `${height}px`;
  //   context.scale(devicePixelRatio, devicePixelRatio);

  //   const padding = 50;
  //   const topPadding = 20;
  //   const graphWidth = width - padding;
  //   const graphHeight = height - padding - topPadding;
  //   const scaleX = graphWidth / values.length;
  //   const maxValue = maxY || Math.max(...values);
  //   const scaleY = graphHeight / maxValue;

  //   // Clear the canvas
  //   context.clearRect(0, 0, canvas.width, canvas.height);

  //   // Draw x and y axes
  //   context.strokeStyle = '#1e293b';
  //   context.lineWidth = 1;
  //   context.beginPath();
  //   context.moveTo(padding, graphHeight + topPadding);
  //   context.lineTo(width, graphHeight + topPadding);
  //   context.moveTo(padding, topPadding);
  //   context.lineTo(padding, graphHeight + topPadding);
  //   context.stroke();

  //   // Draw x axis values (time in seconds)
  //   context.fillStyle = '#1e293b';
  //   context.font = '10px Arial';
  //   const duration = (values.length * hopSize) / sampleRate;
  //   for (let i = 0; i <= 10; i++) {
  //     const x = padding + (i * graphWidth) / 10;
  //     const time = (i * duration) / 10;
  //     context.fillText(time.toFixed(2), x, graphHeight + topPadding + 15);
  //   }

  //   // Draw x-axis label
  //   context.fillText(
  //     'Time (seconds)',
  //     width / 2 - 30,
  //     graphHeight + topPadding + 35
  //   );

  //   // Draw y axis values
  //   for (let i = 0; i <= 5; i++) {
  //     const y = graphHeight + topPadding - (i * graphHeight) / 5;
  //     context.fillText(((i * maxValue) / 5).toFixed(2), 10, y + 3);
  //   }

  //   // Draw the graph line
  //   context.strokeStyle = color;
  //   context.lineWidth = 2; // Thicker line
  //   context.beginPath();
  //   context.moveTo(padding, graphHeight + topPadding - values[0] * scaleY);
  //   values.forEach((value, index) => {
  //     context.lineTo(
  //       padding + index * scaleX,
  //       graphHeight + topPadding - value * scaleY
  //     );
  //   });
  //   context.stroke();
  // }, [values, sampleRate, hopSize, maxY, color, width, height]);

  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-4 text-slate-800">{title}</div>
      <canvas ref={canvasRef} className="w-full h-56 mr-32" />
    </div>
  );
};

export default AudioFeaturesGraph;
