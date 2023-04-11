import React, { useRef, useEffect, useState } from "react";
import { useControlBar } from "../purecomponents/controlbar";

// Custom hook to handle resizing
function useResizeObserver(ref) {
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    if (observeTarget) {
      resizeObserver.observe(observeTarget);
    }

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
}

const colors = [
  "IndianRed",
  "Olive",
  "Purple",
  "Aqua",
  "Green",
  "Silver",
  "Yellow",
];
const static_xmlns = "http://www.w3.org/2000/svg";

const TimberVisualization = ({
  labels,
  pie_radius,
  m_width,
  m_height,
  audioStreamer,
}) => {
  const controlbar = useControlBar();

  const containerRef = useRef();
  const dimensions = useResizeObserver(containerRef);
  const svgRef = useRef();

  useEffect(() => {
    if (!audioStreamer || !dimensions) return;

    const pieViz = {
      // ... (all properties and methods from original pieViz object except init) ...
      circleScale: 0.82, // ratio of outer circle radius to radial line length
      strokeColor: "black",
      strokeWidth: 1,

      // set in init, used for drawing
      pieSeg: [],
      pieCenter: { x: -1, y: -1 },
      radius: -1,

      // user calls to set the radius of a wedge (normed in [0,1])
      set_wedge_radius(seg_num, norm_radius) {
        if (seg_num < 0 || seg_num >= pieViz.pieSeg.length)
          console.log(`seg_num ${seg_num} is out of range.`);

        pieViz.pieSeg[seg_num].norm_r = pieViz.circleScale * norm_radius;
        pieViz.pieSeg[seg_num].svg.setAttributeNS(
          null,
          "d",
          pieViz._circleSegmentPath(
            pieViz.pieCenter,
            pieViz.pieSeg[seg_num].norm_r * pieViz.radius,
            pieViz.pieSeg[seg_num].start_angle,
            pieViz.pieSeg[seg_num].end_angle
          )
        );
      },

      // create a path string for a pie wedge
      _circleSegmentPath: function (c, r, startAngle, endAngle) {
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
      },

      // Done only once during initialization
      _makePieStruct: function (center, radius, numRadialLines, labels, svg) {
        // Define the properties of the circles and lines
        const radius1 = pieViz.circleScale * radius;
        const radius2 = (pieViz.circleScale * 2 * radius) / 3;
        const radius3 = (pieViz.circleScale * radius) / 3;

        // Create the three concentric circles
        const circle1 = document.createElementNS(static_xmlns, "circle");
        circle1.setAttributeNS(null, "cx", center.x);
        circle1.setAttributeNS(null, "cy", center.y);
        circle1.setAttributeNS(null, "r", radius1);
        circle1.setAttributeNS(null, "stroke", pieViz.strokeColor);
        circle1.setAttributeNS(null, "stroke-width", pieViz.strokeWidth);
        circle1.setAttributeNS(null, "fill", "Azure");
        svg.appendChild(circle1);

        const circle2 = document.createElementNS(static_xmlns, "circle");
        circle2.setAttributeNS(null, "cx", center.x);
        circle2.setAttributeNS(null, "cy", center.y);
        circle2.setAttributeNS(null, "r", radius2);
        circle2.setAttributeNS(null, "stroke", pieViz.strokeColor);
        circle2.setAttributeNS(null, "stroke-width", pieViz.strokeWidth);
        circle2.setAttributeNS(null, "fill", "none");
        svg.appendChild(circle2);

        const circle3 = document.createElementNS(static_xmlns, "circle");
        circle3.setAttributeNS(null, "cx", center.x);
        circle3.setAttributeNS(null, "cy", center.y);
        circle3.setAttributeNS(null, "r", radius3);
        circle3.setAttributeNS(null, "stroke", pieViz.strokeColor);
        circle3.setAttributeNS(null, "stroke-width", pieViz.strokeWidth);
        circle3.setAttributeNS(null, "fill", "none");
        svg.appendChild(circle3);

        // Create the specified number of radial lines
        for (let i = 0; i < numRadialLines; i++) {
          const line = document.createElementNS(static_xmlns, "line");
          line.setAttributeNS(null, "x1", center.x);
          line.setAttributeNS(null, "y1", center.y);
          line.setAttributeNS(
            null,
            "x2",
            center.x + radius * Math.cos((i * 2 * Math.PI) / numRadialLines)
          );
          line.setAttributeNS(
            null,
            "y2",
            center.y + radius * Math.sin((i * 2 * Math.PI) / numRadialLines)
          );
          line.setAttributeNS(null, "stroke", pieViz.strokeColor);
          line.setAttributeNS(null, "stroke-width", pieViz.strokeWidth);
          svg.appendChild(line);
        }

        console.log("svg  " + svg.getAttribute("width").toString());
        console.log("svg height is  " + svg.getAttribute("height").toString());

        // Create the text labels for the different segments
        for (let i = 0; i < numRadialLines; i++) {
          // Create a new text element
          var textElement = document.createElementNS(static_xmlns, "text");

          // Set the text content
          textElement.textContent = labels[i];

          // Add the text element to the SVG container to get its size
          svg.appendChild(textElement);
          var textBBox = textElement.getBBox();
          console.log(
            `textBBox.width for ${textElement.textContent} is ${textBBox.width}`
          );
          svg.removeChild(textElement);

          var x =
            center.x +
            radius * Math.cos(((i + 0.5) * 2 * Math.PI) / numRadialLines);
          var y =
            center.y +
            radius * Math.sin(((i + 0.5) * 2 * Math.PI) / numRadialLines);

          // Calculate the x and y values for centering the text
          const centerX = x - textBBox.width / 2;
          const centerY = y + textBBox.height / 2;

          // Set the location of the text element
          textElement.setAttribute("x", centerX);
          textElement.setAttribute("y", centerY);

          // Add the text element to the SVG container
          svg.appendChild(textElement);
        }

        return svg;
      },

      init: function (labels, pie_radius, m_width, m_height, svg) {
        const numRadialLines = labels.length;
        const centerX = m_width / 2;
        const centerY = m_height / 2;
        const center = { x: centerX, y: centerY };
        const radius = pie_radius;

        // Store values in pieViz
        this.pieCenter = center;
        this.radius = radius;

        // Create pie segments
        for (let i = 0; i < numRadialLines; i++) {
          const start_angle = (i * 2 * Math.PI) / numRadialLines;
          const end_angle = ((i + 1) * 2 * Math.PI) / numRadialLines;

          const path = document.createElementNS(static_xmlns, "path");
          path.setAttributeNS(
            null,
            "d",
            this._circleSegmentPath(center, 0, start_angle, end_angle)
          );
          path.setAttributeNS(null, "fill", colors[i]);
          svg.appendChild(path);

          this.pieSeg.push({
            start_angle,
            end_angle,
            norm_r: 0,
            svg: path,
          });
        }

        // Draw pie chart structure
        this._makePieStruct(center, radius, numRadialLines, labels, svg);
      },
    };

    const svgelmt = svgRef.current;

    // Initialize the pie visualization
    pieViz.init(labels, pie_radius, m_width, m_height, svgelmt);

    const updateViz = async () => {
      // Get amplitude and pitch from audioStreamer
      const amplitude = audioStreamer.getAmplitude();
      const pitch = await audioStreamer.getPitch().catch((err) => {
        console.error("Error getting pitch:", err);
        return 0;
      });

      // Normalize amplitude and pitch
      const normAmplitude = Math.min(amplitude, 1);
      const normPitch = Math.min(pitch / 2000, 1);

      // Update the pie visualization
      pieViz.set_wedge_radius(5, normAmplitude);
      pieViz.set_wedge_radius(6, normPitch);

      // Call updateViz again in the next animation frame
      requestAnimationFrame(updateViz);
    };

    updateViz();
  }, [audioStreamer, dimensions, labels, m_height, m_width, pie_radius]);

  return (
    <>
      <div>{controlbar}</div>
      <div ref={containerRef} style={{ position: "relative" }}>
        <svg ref={svgRef} width={m_width} height={m_height} />
      </div>
    </>
  );
};

export default TimberVisualization;
