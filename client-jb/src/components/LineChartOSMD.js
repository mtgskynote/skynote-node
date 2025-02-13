import React, { useEffect, useRef, memo, useState } from 'react';
import PropTypes from 'prop-types';

const LineChart = memo((props) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [showingRep, setShowingRep] = useState(props.showingRep);

  useEffect(() => {
    setShowingRep(props.showingRep);
  }, [props.showingRep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const containerElement = containerRef.current;
    const rect = containerElement.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2 * props.zoom;

    const distanceThreshold = rect.width * 0.1;
    let lastPitch = null;
    let isDrawing = false;

    ctx.fillStyle = 'red';
    for (let i = 0; i < props.pitchDataPosX.length; i++) {
      if (props.showingRep === props.repetitionNumber[i]) {
        let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
        let y = props.pitchDataPosY[i] - rect.top;
        ctx.fillRect(x, y, 3, 3);
      } // Small red squares at each pitch point
    }

    for (let i = 0; i < props.pitchDataPosX.length; i++) {
      if (
        props.showingRep === props.repetitionNumber[i] &&
        props.pitchColor[i] !== '#FFFFFF'
      ) {
        let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
        let y = props.pitchDataPosY[i] - rect.top;
        let currentPitch = props.pitchData[i];

        let isLargeJump =
          Math.abs(
            x -
              (props.pitchDataPosX[i - 1] + props.pitchIndex[i - 1] - rect.left)
          ) > distanceThreshold;

        let isNewPitch = false;
        if (lastPitch !== null && currentPitch > 0) {
          const halfStepThreshold = lastPitch * (Math.pow(2, 1 / 12) - 1);
          isNewPitch = Math.abs(currentPitch - lastPitch) > halfStepThreshold;
        }

        if (isNewPitch || isLargeJump || !isDrawing) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          isDrawing = true;
        } else {
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        lastPitch = currentPitch;
      } else {
        isDrawing = false; // Reset drawing state if the point is invalid
      }
    }
  }, [
    props.pitchData,
    props.zoom,
    showingRep,
    props.pitchDataPosX,
    props.pitchDataPosY,
    props.isPitchDataReady,
  ]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
    </div>
  );
});

LineChart.displayName = 'LineChart';

LineChart.propTypes = {
  pitchData: PropTypes.array.isRequired,
  pitchDataPosX: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchDataPosY: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchIndex: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  repetitionNumber: PropTypes.arrayOf(PropTypes.number).isRequired,
  showingRep: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isPitchDataReady: PropTypes.bool.isRequired,
};

export default LineChart;
