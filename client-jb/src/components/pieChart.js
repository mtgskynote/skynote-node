import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
const static_xmlns = 'http://www.w3.org/2000/svg';

const def_colors = [
  'IndianRed',
  'Olive',
  'Purple',
  'Aqua',
  'Green',
  'Silver',
  'Yellow',
];
const def_labels = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const def_segments = [0.1, 1, 0.8, 0.5];

const circleScale = 0.82;

const makePieStructure = function (
  svg,
  center = { x: 0, y: 0 },
  radius = 100,
  labels = def_labels,
  segments = def_segments
) {
  for (let i = 0; i < 3; i++) {
    const circle = document.createElementNS(static_xmlns, 'circle');
    circle.setAttributeNS(null, 'cx', center.x);
    circle.setAttributeNS(null, 'cy', center.y);
    circle.setAttributeNS(null, 'r', (circleScale * (3 - i) * radius) / 3);
    circle.setAttributeNS(null, 'stroke', 'black');
    circle.setAttributeNS(null, 'fill', 'Azure');
    svg.appendChild(circle);
  }

  let numRadialLines = segments.length;

  // Create the specified number of radial lines
  for (let i = 0; i < numRadialLines; i++) {
    const line = document.createElementNS(static_xmlns, 'line');
    line.setAttributeNS(null, 'x1', center.x);
    line.setAttributeNS(null, 'y1', center.y);
    line.setAttributeNS(
      null,
      'x2',
      center.x + radius * Math.cos((i * 2 * Math.PI) / numRadialLines)
    );
    line.setAttributeNS(
      null,
      'y2',
      center.y + radius * Math.sin((i * 2 * Math.PI) / numRadialLines)
    );
    line.setAttributeNS(null, 'stroke', 'black');
    svg.appendChild(line);
  }

  // Create the text labels for the different segments
  for (let i = 0; i < numRadialLines; i++) {
    // Create a new text element
    var textElement = document.createElementNS(static_xmlns, 'text');

    // Set the text content
    textElement.textContent = labels[i];

    // Add the text element to the SVG container to get its size
    svg.appendChild(textElement);
    var textBBox = textElement.getBBox();
    svg.removeChild(textElement);

    var x =
      center.x + radius * Math.cos(((i + 0.5) * 2 * Math.PI) / numRadialLines);
    var y =
      center.y + radius * Math.sin(((i + 0.5) * 2 * Math.PI) / numRadialLines);

    // Calculate the x and y values for centering the text
    const centerX = x - textBBox.width / 2;
    const centerY = y + textBBox.height / 2;

    // Set the location of the text element
    textElement.setAttribute('x', centerX);
    textElement.setAttribute('y', centerY);

    // Add the text element to the SVG container
    svg.appendChild(textElement);
  }
};

// generic function for creating a path string for a pie wedge
const circleSegmentPath = function (c, r, startAngle, endAngle) {
  // Calculate the start and end points of the arc
  const startX = c.x + r * Math.cos(startAngle);
  const startY = c.y + r * Math.sin(startAngle);
  const endX = c.x + r * Math.cos(endAngle);
  const endY = c.y + r * Math.sin(endAngle);

  // Calculate the large arc flag and sweep flag
  const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
  const sweepFlag = endAngle > startAngle ? 1 : 0;

  // Construct the SVG path string
  const path = `M ${c.x} ${c.y} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} L ${c.x} ${c.y}`;
  return path;
};

const PieChart = React.forwardRef(
  (
    { labels = def_labels, radius = 100, m_width = 200, m_height = 200 },
    ref
  ) => {
    const svgRef = useRef(null);
    const [segments, setSegments] = useState([0, 0, 0, 0]);

    const updateData = (updatedData) => {
      // Perform the update logic here
      setSegments(updatedData);
    };

    React.useImperativeHandle(ref, () => ({
      updateData: updateData,
    }));

    var pie = {
      numSegments: segments.length,
      center: { x: m_width / 2, y: m_height / 2 },
      radius: radius,
    };

    if (svgRef && svgRef.current) {
      while (svgRef.current.lastChild) {
        svgRef.current.removeChild(svgRef.current.lastChild);
      }

      // LW: segments is good

      makePieStructure(
        svgRef.current,
        pie.center,
        pie.radius,
        labels,
        //m_width,
        //m_height,
        segments
      );

      let i = 0;
      for (let segmentr of segments) {
        if (Number.isNaN(segmentr)) {
          segmentr = 0;
        }
        const arc = document.createElementNS(static_xmlns, 'path');
        arc.setAttribute(
          'd',
          circleSegmentPath(
            pie.center,
            segmentr * pie.radius * circleScale,
            (i * 2 * Math.PI) / pie.numSegments,
            ((i + 1) * 2 * Math.PI) / pie.numSegments
          )
        );
        arc.setAttribute('fill', def_colors[i]);

        // Append the arc element to the SVG container
        svgRef.current.appendChild(arc);
        i = i + 1;
      }
    }

    return (
      <div>
        {/* Render an empty SVG container with a ref */}
        <svg ref={svgRef} width={m_width} height={m_height} />
      </div>
    );
  }
);

PieChart.displayName = 'PieChart';

PieChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string),
  radius: PropTypes.number,
  m_width: PropTypes.number,
  m_height: PropTypes.number,
};

export default PieChart;
