// import React, { useEffect, useRef, memo } from 'react';
// import PropTypes from 'prop-types';

// //Pitch track line component
// const LineChart = memo((props) => {
//   const containerRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     const containerElement = containerRef.current;
//     const rect = containerElement.getBoundingClientRect();

//     // Clear the canvas
//     ctx.clearRect(0, 0, rect.width, rect.height);

//     ctx.lineWidth = 2 * props.zoom; // Adjust the thickness as needed

//     // Draw the line
//     ctx.beginPath();
//     ctx.moveTo(
//       props.pitchDataPosX[0] + props.pitchIndex[0] - rect.left,
//       props.pitchDataPosY[0] - rect.top
//     );

//     // Set a threshold for the distance; adjust as needed
//     const distanceThreshold = rect.width * 0.009;
//     //To jump between notes: props.pitchIndex[1]!==0?(props.pitchIndex[1]+1):(props.pitchIndex[2]+1);
//     //To avoid line joining when jumping score lines: rect.width*0.6 (0.6 or whatever ratio <0.9)

//     // for (let i = 1; i < props.pitchDataPosX.length; i++) {
//     //   if (
//     //     props.showingRep === props.repetitionNumber[i] &&
//     //     props.pitchColor[i] !== '#FFFFFF'
//     //   ) {
//     //     // get coordinates (x,y)
//     //     let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
//     //     let y = props.pitchDataPosY[i] - rect.top;

//     //     // if previous pitch input was "invalid", force the jump
//     //     if (props.pitchColor[i - 1] === '#FFFFFF') {
//     //       ctx.moveTo(x, y);
//     //     } else {
//     //       //calculate distance
//     //       let distance = Math.abs(
//     //         x -
//     //           (props.pitchDataPosX[i - 1] + props.pitchIndex[i - 1] - rect.left)
//     //       );
//     //       console.log('threshold ' + distanceThreshold);
//     //       console.log('distance ' + distance);
//     //       // check distance from previous pitch (note change=bigger distance normally)
//     //       if (distance > distanceThreshold) {
//     //         ctx.moveTo(x, y); // force jump
//     //       } else {
//     //         ctx.lineTo(x, y); // continue line
//     //       }
//     //     }
//     //   }
//     // }
//     // ctx.stroke();
//     console.log(props.pitchData);
//     for (let i = 0; i < props.pitchDataPosX.length; i++) {
//       if (
//         props.showingRep === props.repetitionNumber[i] &&
//         props.pitchColor[i] !== '#FFFFFF' // Skip invalid notes
//       ) {
//         let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
//         let y = props.pitchDataPosY[i] - rect.top;

//         // Check if we should break the line
//         let shouldBreak =
//           i === 0 || // Always start fresh for the first note
//           props.pitchColor[i - 1] === '#FFFFFF' || // If the previous note was invalid
//           Math.abs(
//             x -
//               (props.pitchDataPosX[i - 1] + props.pitchIndex[i - 1] - rect.left)
//           ) > distanceThreshold; // Large distance means a separate note

//         if (shouldBreak) {
//           ctx.beginPath(); // Start a new stroke for discrete notes
//           ctx.moveTo(x, y);
//         }

//         ctx.lineTo(x, y); // Draw the line
//         ctx.stroke(); // Ensure each segment is separately drawn
//       }
//     }
//   }, [
//     props.pitchData,
//     props.zoom,
//     props.showingRep,
//     props.pitchDataPosX,
//     props.pitchDataPosY,
//   ]);

//   return (
//     <div ref={containerRef}>
//       <canvas ref={canvasRef} width={props.width} height={props.height} />;
//     </div>
//   );
// });

// LineChart.propTypes = {
//   pitchData: PropTypes.arrayOf(
//     PropTypes.oneOfType([PropTypes.number, PropTypes.string])
//   ).isRequired,
//   pitchDataPosX: PropTypes.arrayOf(PropTypes.number).isRequired,
//   pitchDataPosY: PropTypes.arrayOf(PropTypes.number).isRequired,
//   pitchIndex: PropTypes.arrayOf(PropTypes.number).isRequired,
//   pitchColor: PropTypes.arrayOf(PropTypes.string).isRequired,
//   repetitionNumber: PropTypes.arrayOf(PropTypes.number).isRequired,
//   showingRep: PropTypes.number.isRequired,
//   zoom: PropTypes.number,
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
// };

// export default LineChart;

import React, { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';

const LineChart = memo((props) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const containerElement = containerRef.current;
    const rect = containerElement.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.lineWidth = 2 * props.zoom;

    const distanceThreshold = rect.width * 0.009;
    let lastPitch = null;
    let isDrawing = false;

    for (let i = 0; i < props.pitchDataPosX.length; i++) {
      if (
        props.showingRep === props.repetitionNumber[i] &&
        props.pitchColor[i] !== '#FFFFFF'
      ) {
        let x = props.pitchDataPosX[i] + props.pitchIndex[i] - rect.left;
        let y = props.pitchDataPosY[i] - rect.top;
        let currentPitch = props.pitchData[i];

        let isFirstNote = i === 0;
        let isLargeJump =
          isFirstNote ||
          Math.abs(
            x -
              (props.pitchDataPosX[i - 1] + props.pitchIndex[i - 1] - rect.left)
          ) > distanceThreshold;

        let isNewPitch = false;
        if (lastPitch !== null && currentPitch > 0) {
          const halfStepThreshold = lastPitch * (Math.pow(2, 1 / 12) - 1);
          isNewPitch = Math.abs(currentPitch - lastPitch) > halfStepThreshold;
        }

        if (isFirstNote || isNewPitch || isLargeJump || !isDrawing) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          isDrawing = true;
        }

        ctx.lineTo(x, y);
        ctx.stroke();

        lastPitch = currentPitch;
      }
    }
  }, [
    props.pitchData,
    props.zoom,
    props.showingRep,
    props.pitchDataPosX,
    props.pitchDataPosY,
  ]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} width={props.width} height={props.height} />
    </div>
  );
});

LineChart.propTypes = {
  pitchData: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchDataPosX: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchDataPosY: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchIndex: PropTypes.arrayOf(PropTypes.number).isRequired,
  pitchColor: PropTypes.arrayOf(PropTypes.string).isRequired,
  repetitionNumber: PropTypes.arrayOf(PropTypes.number).isRequired,
  showingRep: PropTypes.number.isRequired,
  zoom: PropTypes.number,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default LineChart;
