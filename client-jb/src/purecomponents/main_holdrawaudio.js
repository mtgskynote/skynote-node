
import {makeControlBar} from './controlbar.js';
import {pieViz} from './pieViz.js';

// Create an audio context
const audioContext = new AudioContext();  // must be audioContext.resumed()'d by a user before mic will work.


const randInt=function(min, max){ return  Math.floor(min + (max+1-min)*Math.random()) }

var m_width = window.innerWidth;
var m_height = window.innerHeight;

console.log("svg_div width is  " + m_width.toString());
console.log("svg_div height is  " + m_height.toString());


//-------------------------------------------

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
	// Create a media stream source node from the microphone
	navigator.mediaDevices.getUserMedia({ audio: true })
	  .then(stream => {
	  	audioContext.resume();
	    const sourceNode = audioContext.createMediaStreamSource(stream);

	    // Create an analyser node to extract amplitude data
	    const analyserNode = audioContext.createAnalyser();
	    analyserNode.fftSize = 2048;

	    // Connect the source node to the analyser node
	    sourceNode.connect(analyserNode);

	    // Connect the analyser node to the audio context destination
	    // NO DESTINATION for now
	    //analyserNode.connect(audioContext.destination);

	    // Define a function to get the amplitude level of the first channel
	    function getAmplitude() {
	      const bufferLength = analyserNode.frequencyBinCount;
	      const dataArray = new Uint8Array(bufferLength);
	      analyserNode.getByteTimeDomainData(dataArray);
	      let maxAmplitude = 0;
	      for (let i = 0; i < bufferLength; i++) {
	        const amplitude = Math.abs((dataArray[i] - 128) / 128);
	        if (amplitude > maxAmplitude) {
	          maxAmplitude = amplitude;
	        }
	      }
	      return maxAmplitude;
	    }

	    // Define a function to update the amplitude level
	    function updateAmplitude() {
	      const amplitude = getAmplitude();
	      console.log(amplitude);
	      requestAnimationFrame(updateAmplitude);
	    }

	    // Start updating the amplitude level
	    updateAmplitude();
	  })
	  .catch(error => {
	    console.error(error);
	  });

});
// ------------------------------------------------------


// Now set a random wedge to a random radius (in [0,1])

setInterval(function(){
	pieViz.set_wedge_radius(randInt(0, labels.length-1), Math.random())}
	, 50 );


// ------------------------------------------------------

