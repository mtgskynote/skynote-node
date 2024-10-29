import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const HighlightedAudioChart = ({ audioData, sr, highlightedSections }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 800; // Set width as per your requirement
    const height = 200; // Set height as per your requirement

    // Clear previous content
    svg.selectAll('*').remove();
    svg.attr('width', width).attr('height', height);

    // Scale for x-axis (time in seconds)
    const xScale = d3
      .scaleLinear()
      .domain([0, audioData.length])
      .range([0, width]);

    // Scale for y-axis (audio amplitude)
    const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 0]);

    // Draw the waveform
    const line = d3
      .line()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d));

    svg
      .append('path')
      .datum(audioData)
      .attr('fill', 'none')
      .attr('stroke', '#000')
      .attr('stroke-width', 1)
      .attr('d', line);

    // Draw highlighted sections
    highlightedSections.forEach((section, idx) => {
      const [start, end] = section;
      svg
        .append('rect')
        .attr('x', xScale(start))
        .attr('y', 0)
        .attr('width', xScale(end) - xScale(start))
        .attr('height', height)
        .attr('fill', ['red', 'green', 'orange'][idx])
        .attr('opacity', 0.3);
    });

    // Add x-axis (time)
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10) // Set the number of ticks
      .tickFormat((d) => (d / sr).toFixed(2)); // Convert sample index to seconds

    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis);
  }, [audioData, sr, highlightedSections]);

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-2">
        Highlighted Sections on Original Audio
      </h2>
      <svg ref={svgRef} />
    </div>
  );
};

export default HighlightedAudioChart;
