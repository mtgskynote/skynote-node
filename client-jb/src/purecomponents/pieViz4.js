import React from 'react';

const colors=["IndianRed", "Olive",  "Purple",  "Aqua",    "Green",      "Silver",    "Yellow"]; 
const static_xmlns = "http://www.w3.org/2000/svg";

class PieViz extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pieSeg: [],
			pieCenter: {x: -1, y: -1},
			radius: -1
		};
	}

	componentDidMount() {
		const { labels, pie_radius, m_width, m_height } = this.props;
		const numPieSegments = labels.length;
		const svgelmt = document.createElementNS(static_xmlns, "svg");
		svgelmt.setAttributeNS(null, "width", m_width);
		svgelmt.setAttributeNS(null, "height", m_height);
		svgelmt.style.display = "table";
		svgelmt.style.margin = "auto"; // centers

		const pieCenter = { x: m_width / 2, y: m_height / 2 };
		const myPieStruct = this._makePieStruct(pieCenter, pie_radius, numPieSegments, labels, svgelmt);

		for (let i = 0; i < numPieSegments; i++) {
			const pieSeg = {
				color: colors[i],
				start_angle: i * 2 * Math.PI / numPieSegments,
				end_angle: (i + 1) * 2 * Math.PI / numPieSegments,
				norm_r: 0.25
			};
			pieSeg.svg = document.createElementNS(static_xmlns, 'path');
			pieSeg.svg.setAttributeNS(null, 'fill', pieSeg.color);
			pieSeg.svg.setAttributeNS(null, 'd', this._circleSegmentPath(pieCenter, pieSeg.norm_r * pie_radius, pieSeg.start_angle, pieSeg.end_angle));
			svgelmt.appendChild(pieSeg.svg);
			this.setState(prevState => ({
				pieSeg: [...prevState.pieSeg, pieSeg]
			}));
		}

		this.setState({
			pieCenter,
			radius: pie_radius
		});
	}

	// user calls to set the radius of a wedge (normed in [0,1])
	set_wedge_radius(seg_num, norm_radius) {
		if (seg_num < 0 || seg_num >= this.state.pieSeg.length)
			console.log(`seg_num ${seg_num} is out of range.`);

		const pieSeg = this.state.pieSeg[seg_num];
		pieSeg.norm_r = this.circleScale * norm_radius;
		pieSeg.svg.setAttributeNS(null, 'd',
			this._circleSegmentPath(this.state.pieCenter, pieSeg.norm_r * this.state.radius, pieSeg.start_angle, pieSeg.end_angle));
	}

	// create a path string for a pie wedge
	_circleSegmentPath(c, r, startAngle, endAngle) {
		const startX = c.x + r * Math.cos(startAngle);
		const startY = c.y + r * Math.sin(startAngle);
		const endX = c.x + r * Math.cos(endAngle);
		const endY = c.y + r * Math.sin(endAngle);
		const largeArcFlag = endAngle - startAngle <= Math.PI ? 0 : 1;
		const sweepFlag = endAngle > startAngle ? 1 : 0;
////		const path = `M ${c.x} ${
////=============================================================
////} 
////return `${path} ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} Z`;
////}
  // Construct the SVG path string
        const path = `M ${c.x} ${c.y} L ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY} L ${c.x} ${c.y}`;

        return path;
    }



// create the data structure for pie segments
_makePieStruct(pieCenter, radius, numSegments, labels, svgelmt) {
this.circleScale = radius;
const pieStruct = [];
for (let i = 0; i < numSegments; i++) {
    const pieSeg = {
        color: colors[i],
        start_angle: i * 2 * Math.PI / numSegments,
        end_angle: (i + 1) * 2 * Math.PI / numSegments,
        norm_r: 0.25
    };
    pieSeg.svg = document.createElementNS(static_xmlns, 'path');
    pieSeg.svg.setAttributeNS(null, 'fill', pieSeg.color);
    pieSeg.svg.setAttributeNS(null, 'd', this._circleSegmentPath(pieCenter, pieSeg.norm_r * radius, pieSeg.start_angle, pieSeg.end_angle));
    svgelmt.appendChild(pieSeg.svg);
    pieStruct.push(pieSeg);
}
return pieStruct;
}

render() {
const { labels, pie_radius, m_width, m_height } = this.props;
return (
    <div>
        <svg ref={el => (this.pieSvg = el)}></svg>
    </div>
);
}
}

//export default PieViz;
export { PieViz };
