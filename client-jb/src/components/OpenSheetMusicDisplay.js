// opensheetmusicdisplay.js
// necessary imports
import React, { Component, useRef } from "react";
import { OpenSheetMusicDisplay as OSMD, RepetitionInstruction } from "opensheetmusicdisplay";
import {
  PlaybackManager,
  LinearTimingSource,
  BasicAudioPlayer,
  IAudioMetronomePlayer,
} from "opensheetmusicdisplay";

import LineChart from "./LineChartOSMD";
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
} from "chart.js";

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement);


//Convert frequency Hertz to MIDI function
const freq2midipitch = (freq) => {
  return(12 * (Math.log2(freq / 440)) + 69)
}

const midi2StaffGaps=(playedNoteMidi)=>{

  // Create a mapping of MIDI note values to staff offsets
  const midiToStaffMapping = {
    // Define mappings for specific MIDI notes
    48:13,     // C3
    49:12.5,   // C#3
    50:12,     // D3
    51:11.5,   // D#3
    52:11,     // E3
    53:10,     // F3
    54:9.5,    // F#3
    55:9,      // G3
    56:8.5,    // G#3
    57:8,      // A3
    58:7.5,    // A#3
    59:7,      // B3
    60: 6,     // C4
    61: 5.5,   // C#4
    62: 5,     // D4
    63: 4.5,   // D#4
    64:4,      // E4
    65:3,      // F4
    66:2.5,    // F#4
    67:2,      // G4
    68:1.5,    // G#4
    69:1,      // A4
    70:0.5,    // A#4
    71:0,      // B4 --> middle line of the staff
    72:-1,     //C5
    73:-1.5,   //C#5
    74:-2,     //D5
    75:-2.5,   //D#5
    76:-3,     //E5
    77:-4,     //F5
    78:-4.5,   //F#5
    79:-5,     //G5
    80:-5.5,   //G#5
    81:-6,     //A5
    82:-6.5,   //A#5
    83:-7,     //B5
    84:-8,     //C6
  };
  const playedNoteMidiINT=Math.floor(playedNoteMidi); //integer part of playedNoteMidi
  const playedNoteMidiDECIMAL=playedNoteMidi-playedNoteMidiINT; //decimal part of playedNoteMidi

  //Assign to staff positions according to dictionary
  const noteStaffINT= midiToStaffMapping[playedNoteMidiINT]; //integer part of staff step
  const noteStaffDiff= Math.abs(midiToStaffMapping[playedNoteMidiINT+1]-noteStaffINT); //difference in staff step with consecutive
  const noteStaffDECIMAL= playedNoteMidiDECIMAL*noteStaffDiff //map decimal part to the step with consecutive

  let result;
    if(noteStaffINT-noteStaffDECIMAL){
      result=noteStaffINT-noteStaffDECIMAL;
    }else{
      result=0; //FIXME, value 0 so it keeps in middle line of staff, but other solution required (change its color)
    }
    return (result)
  
}

const renderPitchLineZoom=(osmd, state, prevZoom, showingRep)=>{
  //When zoom happens, coordinates X and Y of pitch tracking points have to be updated
  let staves = osmd.graphic.measureList;
  let copy_pitchPositionX=state.pitchPositionX.slice();
  let copy_pitchPositionY=state.pitchPositionY.slice();
  for (let stave_index = 0; stave_index < staves.length; stave_index++) {
    let stave = staves[stave_index][0];
    const staveLines=document.getElementsByClassName("vf-stave")[stave_index]
    const upperLineStave= staveLines.children[0].getBoundingClientRect().top; //upper line
    const middleLineStave= staveLines.children[2].getBoundingClientRect().top; //middle line
    const lowerLineStave= staveLines.children[4].getBoundingClientRect().top; //lower line
    const oneStepPixels=Math.abs(upperLineStave-lowerLineStave)/4/2; //steps corresponding to one step in staff

      for (let note_index = 0; note_index < stave.staffEntries.length; note_index++) {
          let note = stave.staffEntries[note_index]
          let noteID= note.graphicalVoiceEntries[0].notes[0].getSVGId();
          let noteX=note.graphicalVoiceEntries[0].notes[0].getSVGGElement().getBoundingClientRect().x 
          //check for notehead color
          const colorsArray=state.colorNotes.slice()
          const index = colorsArray.findIndex(item => item[0][0] === noteID && item[0][2]==showingRep);
          if(index!==-1){ 
            //note has a color assigned--> color notehead
            // this is for all the notes except the quarter and whole notes
            const svgElement = note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
            svgElement.children[0].children[0].children[0].style.fill =
              colorsArray[index][0][1]; // notehead
            if (
              svgElement &&
              svgElement.children[0] &&
              svgElement.children[0].children[0] &&
              svgElement.children[0].children[1]
            ) {
              //this is for all the quarter and whole notes
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
            }
          }          
          //check for pitch tracking line
          for(let index=0; index<copy_pitchPositionX.length; index++){
            if (state.recordedNoteIDs[index] === noteID) {
              let midiToStaffStep= midi2StaffGaps(freq2midipitch(state.pitchData[index]))
              copy_pitchPositionX[index]= noteX;
              copy_pitchPositionY[index]= middleLineStave+midiToStaffStep*oneStepPixels;
            }
          }
          
      }
    }
    let copy_recordedNoteIndex=state.recordedNoteIndex.slice()
    copy_recordedNoteIndex=copy_recordedNoteIndex.map(item => item * osmd.zoom / prevZoom);
    return [copy_pitchPositionX, copy_pitchPositionY, copy_recordedNoteIndex];
}

// creating the class component
class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pitchColor: [],
      pitchData: [],
      pitchConfidenceData: [],
      pitchPositionX:[],
      pitchPositionY:[],
      recordedNoteIndex:[],
      repetitionNumber:[],
      recordedNoteIDs:[],
      colorNotes:[],
      initialCursorTop: 0,
      initialCursorLeft: 0,
      currentNoteinScorePitch: null,
      currentGNoteinScorePitch: null,
      
      
    };
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.cursorInterval = null;
    this.countFinishRecording=25 //if recording is active and cursor doesnt move, stop recording
    this.previousTimestamp=null; 
    this.notePositionX=null;
    this.notePositionY=null;
    this.noteColor=null;
    this.index=null;
    this.spacing=4;
    this.countGoodNotes=0; 
    this.countBadNotes=0;
    this.coords=[0,0];
    this.color = "black";
    this.zoom=props.zoom;
    this.totalReps=0;
    this.showingRep=0;
  }

  
  // defining the playback manager for playing music and cursor controls
  // you first define and then initialize the playback manager
  playbackOsmd(osmd) {
    var timingSource = new LinearTimingSource();
    this.playbackManager = new PlaybackManager(
      timingSource,
      IAudioMetronomePlayer,
      new BasicAudioPlayer(),
      undefined
    );
    this.playbackManager.DoPlayback = true;
    this.playbackManager.DoPreCount = false;
    this.playbackManager.PreCountMeasures = 1;

    const initialize = () => {
      timingSource.reset();
      timingSource.pause();
      timingSource.Settings = osmd.Sheet.playbackSettings;
      this.playbackManager.initialize(osmd.Sheet.musicPartManager);
      this.playbackManager.addListener(osmd.cursor);
      this.playbackManager.reset();
      this.osmd.PlaybackManager = this.playbackManager;

      for (const instrument of this.playbackManager.InstrumentIdMapping.values()) {
        instrument.Volume = this.props.recordVol;
      }
    };

    return {
      initialize,
    };
  }

  // Sets up osmd features and options for rendering the xml score
  setupOsmd() {
    // options for osmd
    const options = {
      autoResize:
        this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle:
        this.props.drawTitle !== undefined ? this.props.drawTitle : true,
      followCursor:
        this.props.followCursor !== undefined ? this.props.followCursor : true,
    };

    // define a new class instance of opensheetmusicdisplay
    this.osmd = new OSMD(this.divRef.current, options);

    //define the osmd features to be included
    this.osmd.load(this.props.file).then(() => {
      if (this.osmd.Sheet) {
        this.osmd.render();
        const cursor = this.osmd.cursor;
        this.props.cursorRef.current = cursor;
        cursor.show();
        this.setState({
          initialCursorTop: cursor.cursorElement.style.top,
          initialCursorLeft: cursor.cursorElement.style.left,
        });
      }

      this.osmd.zoom = this.props.zoom;
      this.playbackControl = this.playbackOsmd(this.osmd);
      this.playbackControl.initialize();

      this.props.playbackRef.current = this.playbackManager;

      this.cursorInterval = setInterval(this.checkCursorChange, 200);

    });
  }

  componentWillUnmount() {
    const playbackManager = this.props.playbackRef.current;
    if (playbackManager) {
      const basicAudioPlayer = playbackManager.AudioPlayer;
      if (basicAudioPlayer) {
        basicAudioPlayer.setVolume(0);
        basicAudioPlayer.stopSound();
      }
      playbackManager.pause();
    }

    clearInterval(this.cursorInterval);
    // clearInterval(this.cursorInterval);
    window.removeEventListener("resize", this.resize);
  }

  // update metronome volume
  updateMetronomeVolume(newVolume) {
    this.osmd.PlaybackManager.Metronome.Volume = newVolume;
  }

  // update bpm value
  updateBpm(newBpm) {
    this.osmd.PlaybackManager.setBpm(newBpm);
  }

  //function to check cursor change
  checkCursorChange = () => {
    const cursorCurrent=this.osmd.cursor.Iterator.currentTimeStamp
    //console.log(this.osmd.cursor.Iterator.EndReached)

    //if recording active
    if (this.props.startPitchTrack){

      //Check for repetitions
      if (this.previousTimestamp > cursorCurrent.RealValue) {
        // Cursor moved back, repetition detected
        this.totalReps++;
        this.showingRep = this.totalReps;
      }

      // STOP RECORDING WHEN CURSOR REACHES THE END /////////////
      // check if cursor stays in the same position for a long time
      if(cursorCurrent.RealValue===this.previousTimestamp){
        //Cursor has not moved
        this.countFinishRecording=this.countFinishRecording-1;
        if(this.countFinishRecording===0){
          //when countdown reaches zero, stop recording 
          this.props.cursorActivity(true);
          this.previousTimestamp=null;
          this.countFinishRecording=25;
        }
      }else{
        //If cursor keeps moving, reset
        this.countFinishRecording=25;
      }

      //store timestampfor next iteration
      this.previousTimestamp=cursorCurrent.RealValue; 
      ////////////////////////////////////////////////////////
      
      // EXTRACT POSITION OF NOTE UNDER CURSOR////////////////
      //Absolute Position
      const svgElement=this.osmd.cursor.GNotesUnderCursor()[0].getSVGGElement()
      if (
        svgElement &&
        svgElement.children[0] &&
        svgElement.children[0].children[0] &&
        svgElement.children[0].children[1]
      ){
        const notePos=svgElement.children[0].children[1].children[0].getBoundingClientRect();
        this.notePositionX=notePos.x
        this.notePositionY=notePos.y
      }else{
        const notePos=svgElement.children[0].children[0].children[0].getBoundingClientRect();
        this.notePositionX=notePos.x
        this.notePositionY=notePos.y
      }
      ////////////////////////////////////////////////////////


      // DETERMINE RED/GREEN COLOR OF NOTEHEAD ///////////////
      // Get the last pitch in the pitchData array
      const lastPitchData =
        this.state.pitchData[this.state.pitchData.length - 1];
      const lastPitchConfidenceData =
        this.state.pitchConfidenceData[this.state.pitchConfidenceData.length - 1];


      //Current Note/Silence under cursor
      var notePitch;
      if(this.osmd.cursor.NotesUnderCursor()[0].Pitch!==undefined){
        //note
        notePitch = this.osmd.cursor.NotesUnderCursor()[0].Pitch.frequency;
      }else{
        //silence
        notePitch = 0;
      }
      const gNote = this.osmd.cursor.GNotesUnderCursor()[0];
      
      //Prepare colors
      const colorPitchMatched = "#00FF00"; //green
      const colorPitchNotMatched = "#FF0000"; //red

      //Check if pitch was matched or not, only if confidence of newPitchdata is >=0.5
      if(lastPitchConfidenceData>=0.5){
        if (
          lastPitchData !== undefined &&
          Math.abs(freq2midipitch(lastPitchData) - freq2midipitch(notePitch)) <= 0.25 // 0.25 MIDI error margin
        ) {
          this.countGoodNotes=this.countGoodNotes+1;  
        }
        else {
          this.countBadNotes=this.countBadNotes+1;
        }
        var total=this.countBadNotes+this.countGoodNotes;
        if(total!==0 && (this.countGoodNotes>= Math.ceil(total*0.5))){
          //GOOD NOTE - change color to green
          this.noteColor=colorPitchMatched;
        }else{
          //WRONG NOTE - change color to red
          this.noteColor=colorPitchNotMatched;
        }
      }

      if(this.state.currentGNoteinScorePitch){
        //Save/overwrite color data
        const noteID=this.state.currentGNoteinScorePitch.getSVGId();
        const colorsArray=this.state.colorNotes.slice()
        const index = colorsArray.findIndex(item => item[0][0] === noteID && item[0][2]===this.totalReps);
        if(index!==-1){ 
          //note was already contained and had a color assigned--> overwrite
          colorsArray[index][0][1]=this.noteColor;
        }else{
          //note was not contained --> add it
          colorsArray.push([[noteID, this.noteColor, this.totalReps]]);            
        }
        this.setState({colorNotes : colorsArray});

        //Change visual color of note
        // this is for all the notes except the quarter and whole notes
        //const svgElement = this.state.currentGNoteinScorePitch.getSVGGElement();
        svgElement.children[0].children[0].children[0].style.fill =
          this.noteColor; // notehead
        if (
          svgElement &&
          svgElement.children[0] &&
          svgElement.children[0].children[0] &&
          svgElement.children[0].children[1]
        ) {
          //this is for all the quarter and whole notes
          svgElement.children[0].children[0].children[0].style.fill =
          this.noteColor; // notehead
          svgElement.children[0].children[1].children[0].style.fill =
          this.noteColor; // notehead
        }
      }
      //When note changes, reset values
      if(gNote!==this.state.currentGNoteinScorePitch){
        //Reset for next note checking
        this.countBadNotes=0;
        this.countGoodNotes=0;
        this.noteColor="#000000"
      }
      //Update new vales for future comparisons
      this.setState({ currentNoteinScorePitch: notePitch });
      this.setState({ currentGNoteinScorePitch: gNote });
    }
  
  }////////////////////////////////////////////////////////

  

  resetNotesColor = () => {
    const colorBlack = "#000000"; // black color

    // Get the SVG container element
    var svgContainer = this.osmd.container;

    // Select all SVG elements within the container
    var svgElements = svgContainer.getElementsByTagName("svg");

    // Iterate through each SVG element
    for (var i = 0; i < svgElements.length; i++) {
      var svgElement = svgElements[i];

      // Select all elements with class "vf-notehead" within the SVG element
      var noteheads = svgElement.getElementsByClassName("vf-notehead");

      // Iterate through all the notehead elements
      for (var j = 0; j < noteheads.length; j++) {
        let notehead = noteheads[j];

        // Select the inner <path> element
        let path = notehead.querySelector("path");

        // Set the fill attribute to black
        path.setAttribute("style", "fill: " + colorBlack + " !important");
      }
    }
  };

  componentDidUpdate(prevProps) {

    const container = document.getElementById('osmdSvgPage1');
    this.coords=[container.getBoundingClientRect().width,container.getBoundingClientRect().height];
    
    // for title and file changes
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
    } else if (this.props.file !== prevProps.file) {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
    }

    // for metronome volume and bpm changes
    if (this.props.metroVol !== prevProps.metroVol) {
      this.updateMetronomeVolume(this.props.metroVol);
    }

    if (this.props.bpm !== prevProps.bpm) {
      this.updateBpm(this.props.bpm);
    }

    // for zoom changes
    if (this.props.zoom !== prevProps.zoom) {
      this.osmd.zoom = this.props.zoom;
      this.osmd.render(); // update the OSMD instance after changing the zoom level
      const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] = renderPitchLineZoom(this.osmd, this.state, this.zoom, this.showingRep);
      this.setState({pitchPositionX: updatedPitchPositionX});
      this.setState({ pitchPositionY: updatedPitchPositionY});
      this.setState({recordedNoteIndex:updatedNoteIndex})
      this.zoom=this.props.zoom; // This forces thta LineChart re-renders the points position
    }

    //for switch repeats layers changes
    if (this.props.repeatsIterator !== prevProps.repeatsIterator) {
      if (this.showingRep < this.totalReps) {
        this.showingRep++;
      } else {
        this.showingRep = 0;
      }
      this.resetNotesColor();
      //Update color of notes
      let staves = this.osmd.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
          for (let note_index = 0; note_index < stave.staffEntries.length; note_index++) {
              let note = stave.staffEntries[note_index]
              let noteID= note.graphicalVoiceEntries[0].notes[0].getSVGId();
              //check for notehead color
              const colorsArray=this.state.colorNotes.slice()
              const index = colorsArray.findIndex(item => item[0][0] === noteID && item[0][2]==this.showingRep);
              if(index!==-1){ 
                //note has a color assigned--> color notehead
                // this is for all the notes except the quarter and whole notes
                const svgElement = note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
                svgElement.children[0].children[0].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
                if (
                  svgElement &&
                  svgElement.children[0] &&
                  svgElement.children[0].children[0] &&
                  svgElement.children[0].children[1]
                ) {
                  //this is for all the quarter and whole notes
                  svgElement.children[0].children[0].children[0].style.fill =
                    colorsArray[index][0][1]; // notehead
                  svgElement.children[0].children[1].children[0].style.fill =
                    colorsArray[index][0][1]; // notehead
                }
          }} }         


    }

    // follow cursor changes
    if (this.props.followCursor !== prevProps.followCursor) {
      this.osmd.followCursor = this.props.followCursor;
    }

    // for pitch changes
    if(this.props.startPitchTrack){
      if (this.props.pitch !== prevProps.pitch) { //new pitch

        //Add index to X coordinates to advance pitch tracker in X axis when new pitch arrives
        if(this.notePositionX===(this.state.pitchPositionX[this.state.pitchPositionX.length-1])){ //we are still on the same note
          this.index=this.index+this.spacing; //6 is the spacing between points
        }else{ //new note
          this.index=0; //reset index
        }
        ////////////////////////////////////////////////////////

        //Calculate Y coordinate ///////////////////////////////
        const newPitchMIDI= freq2midipitch(this.props.pitch[this.props.pitch.length-1]); //played note
        const currentNoteinScorePitchMIDI= freq2midipitch(this.state.currentNoteinScorePitch); //note under cursor
        const midiToStaffStep=midi2StaffGaps(newPitchMIDI) //where to locate the played note in the staff with respect to B4(middle line)
        if (midiToStaffStep === 0 || this.props.pitchConfidence[this.props.pitchConfidence.length-1]<0.5) { //
          //Color turns gray when pitch is out of bounds or pitch confidence is below 0.5
          this.color = "#CBCBCB";
        } else {
          this.color = "#000000";
          //this changes color for different repetitions, should be removed when fixed
          /*switch (this.totalReps){
            case 0:
              this.color = "#000000";
              break;
            case 1:
              this.color = "#FF00FF";
              break;
            case 2:
              this.color = "#93C572";
              break;
            case 3:
              this.color = "#00FFFF";
              break;
            default:
              this.color = "#F28500";
              break;
          }*/
        }
        
        const staveLines=document.getElementsByClassName("vf-stave")[this.osmd.cursor.Iterator.currentMeasureIndex]
        const upperLineStave= staveLines.children[0].getBoundingClientRect().top; //upper line
        const middleLineStave= staveLines.children[2].getBoundingClientRect().top; //middle line//document.getElementById("cursorImg-0").getBoundingClientRect().top+(document.getElementById("cursorImg-0").getBoundingClientRect().height/2); //middle line
        const lowerLineStave= staveLines.children[4].getBoundingClientRect().top; //lower line
        const oneStepPixels=Math.abs(upperLineStave-lowerLineStave)/4/2; //steps corresponding to one step in staff

        const noteStaffPositionY=middleLineStave+midiToStaffStep*oneStepPixels;
        ////////////////////////////////////////////////////////

        //Add pitch to array and note identification data///////
        if(this.state.currentGNoteinScorePitch){
          //Add note ID
          const addNewNoteID=[...this.state.recordedNoteIDs, this.state.currentGNoteinScorePitch.getSVGId()];
          this.setState({ recordedNoteIDs: addNewNoteID });
          //Add note index
          const addNoteIndex=[...this.state.recordedNoteIndex, this.index];
          this.setState({ recordedNoteIndex:addNoteIndex});
          //Add pitch data
          const newPitchData = [...this.state.pitchData, this.props.pitch[this.props.pitch.length-1]];
          this.setState({ pitchData: newPitchData });
          //Add pitch confidence data
          const newPitchConfidenceData = [...this.state.pitchConfidenceData, this.props.pitchConfidence[this.props.pitchConfidence.length-1]];
          this.setState({ pitchConfidenceData: newPitchConfidenceData });
          //Add X position to array
          const addedNewPositionX= [...this.state.pitchPositionX, this.notePositionX];
          this.setState({ pitchPositionX: addedNewPositionX })
          //Add Y position to array
          const addedNewPositionY= [...this.state.pitchPositionY, noteStaffPositionY];
          this.setState({ pitchPositionY: addedNewPositionY })
          //Add note color
          const addPitchColor = [...this.state.pitchColor, this.color];
          this.setState({ pitchColor: addPitchColor })
          //Add current number of repetition
          const addRepetitionNumber = [...this.state.repetitionNumber, this.totalReps];
          this.setState({ repetitionNumber: addRepetitionNumber})
        }
        ////////////////////////////////////////////////////////        
      }
    }

    // if record is clicked, put volume to 0, else put volume to 1
    if (this.props.recordVol !== prevProps.recordVol) {
      const playbackManager = this.props.playbackRef.current;
      if (playbackManager) {
        for (const instrument of playbackManager.InstrumentIdMapping.values()) {
          instrument.Volume = this.props.recordVol;
        }
      }
    }

    if (
      prevProps.isResetButtonPressed !== this.props.isResetButtonPressed &&
      this.props.isResetButtonPressed
    ) {
      this.setState({colorNotes:[]});
      this.setState({ recordedNoteIDs: [] });
      this.setState({ recordedNoteIndex:[]});
      this.setState({ pitchData: [] });
      this.setState({ pitchPositionX: [] })
      this.setState({ pitchPositionY: [] })
      this.setState({ pitchColor: [] })
      this.setState({ repetitionNumber: []})
      this.resetNotesColor();
      this.props.onResetDone(); // call the function passed from the parent component
    }

    // resize the osmd when the window is resized
    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();

    // Add a listener for cursor change events
  }

  render() {
    const { showPitchTrack } = this.props;

    const { isResetButtonPressed } = this.state;

    const lineChartStyle = {
      position: "absolute",
      pointerEvents: "none",
    };

    return (
      <div > 

          <div style={lineChartStyle}>
            <LineChart
              width={this.coords[0]}
              height={this.coords[1]}
              zoom={this.zoom}
              pitchColor = {this.state.pitchColor}
              pitchData={this.state.pitchData}
              pitchDataPosX={this.state.pitchPositionX}
              pitchDataPosY={this.state.pitchPositionY}
              pitchIndex={this.state.recordedNoteIndex}
              repetitionNumber={this.state.repetitionNumber}
              showingRep={this.showingRep}
              
            />
          </div>
        
        <div  ref={this.divRef}  /> 
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
