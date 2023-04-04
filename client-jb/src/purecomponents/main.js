
import {makeControlBar} from './controlbar.js';
import {pieViz} from './pieViz.js';

import {makeAudioStreamer} from './audioStreamer.js';

const randInt=function(min, max){ return  Math.floor(min + (max+1-min)*Math.random()) }

var m_width = window.innerWidth;
var m_height = window.innerHeight;

console.log("svg_div width is  " + m_width.toString());
console.log("svg_div height is  " + m_height.toString());


//-------------------------------------------

const audioStreamer=makeAudioStreamer();

const labels=["sweetness", "warmth", "vibrato", "tremelo", "stringency", "loudness", "roughness"]


//document.body.appendChild(makePieViz(labels, 200, m_width, m_height))
// ... the element needs to be appended to the body before we make the viz or the text labels won't be properly placed. 
const svgelmt = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svgelmt.setAttributeNS(null, "width", m_width)
svgelmt.setAttributeNS(null, "height", m_height)
svgelmt.style.display = "table";
svgelmt.style.margin = "auto" //centers

document.body.appendChild(svgelmt)  
pieViz.init(labels, 200, m_width, m_height, svgelmt);

// For the controlbar, we can make the control bar and *then* append it to the document.body 
let controlbar=makeControlBar()
document.body.appendChild(controlbar)
let playbutton=controlbar.querySelector('#play')
console.log(`playbutton is ${playbutton}`)
playbutton.addEventListener('click', function(){
	audioStreamer.init();

});
// ------------------------------------------------------


// Now set a random wedge to a random radius (in [0,1])

setInterval(function(){
	let a = audioStreamer.getAmplitude();
	pieViz.set_wedge_radius(0, a)}, 50 );
	//pieViz.set_wedge_radius(randInt(0, labels.length-1), Math.random())} , 50 );


// ------------------------------------------------------

