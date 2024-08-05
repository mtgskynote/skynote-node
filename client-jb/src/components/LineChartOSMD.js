import React, { useEffect, useRef, useCallback } from "react";

const LineChart = (props) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      ctxRef.current = canvas.getContext("2d");
    }
  }, []);

  const drawLine = useCallback(() => {
    const ctx = ctxRef.current;
    const containerElement = containerRef.current;
    const rect = containerElement.getBoundingClientRect();

    // Clear the canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    ctx.lineWidth = 2 * props.zoom;

    ctx.beginPath();
    ctx.moveTo(
      props.pitchDataPosX[0] + props.pitchIndex[0] - rect.left,
      props.pitchDataPosY[0] - rect.top
    );

    const distanceThreshold = rect.width * 0.6;

    for (let i = 1; i < props.pitchDataPosX.length; i++) {
      if (
        props.showingRep === props.repetitionNumber[i] &&
        props.pitchColor[i] !== "#FFFFFF"
      ) {
        // let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
        let x = props.pitchDataPosX[i] - rect.left;
        let y = props.pitchDataPosY[i] - rect.top;

        if (props.pitchColor[i - 1] === "#FFFFFF") {
          ctx.moveTo(x, y);
        } else {
          let distance = Math.abs(
            x -
              (props.pitchDataPosX[i - 1] + props.pitchIndex[i - 1] - rect.left)
          );
          if (distance > distanceThreshold) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
      }
    }

    ctx.stroke();
  }, [
    props.pitchDataPosX,
    props.pitchDataPosY,
    props.pitchIndex,
    props.pitchColor,
    props.showingRep,
    props.zoom,
  ]);

  useEffect(() => {
    if (ctxRef.current) {
      drawLine();
    }
  }, [drawLine]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
    </div>
  );
};

export default LineChart;
