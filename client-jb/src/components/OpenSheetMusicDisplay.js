// opensheetmusicdisplay.js
// necessary imports
import React, { Component, useRef } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
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

// creating the class component
class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pitchData: [],
      pitchPositionX:[],
      pitchPositionY:[],
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
    this.index=0;
    this.countGoodNotes=0; 
    this.countBadNotes=0;
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

      // let gNotes = this.osmd.cursor.GNotesUnderCursor();
      // console.log("gNotes", gNotes);

      this.osmd.zoom = this.props.zoom;
      this.playbackControl = this.playbackOsmd(this.osmd);
      this.playbackControl.initialize();

      this.props.playbackRef.current = this.playbackManager;

      this.cursorInterval = setInterval(this.checkCursorChange, 200);

      /*if(this.notePositionX!==null){
        const addedNewPositionX= [...this.state.pitchPositionX, this.notePositionX];
        this.setState({ pitchPositionX: addedNewPositionX })
        console.log("sizes ", this.state.pitchData, this.state.pitchPositionX)
      }*/
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

    //if recording active
    if (this.props.startPitchTrack){

      // STOP RECORDING WHEN CURSOR REACHES THE END /////////////
      // check if cursor stays in the same position for a long time
      if(cursorCurrent===this.previousTimestamp){
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

      //store for next iteration
      this.previousTimestamp=cursorCurrent; 
      ////////////////////////////////////////////////////////
    
      // EXTRACT POSITION OF NOTE UNDER CURSOR////////////////
      //Current Note under cursor Absolute Position
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
      //this.notePositionX=notePos.x
      //this.notePositionY=notePos.y
      ////////////////////////////////////////////////////////


      // DETERMINE RED/GREEN COLOR OF NOTEHEAD ///////////////
      // Get the last pitch in the pitchData array
      const lastPitchData =
        this.state.pitchData[this.state.pitchData.length - 1];

      //Current Note under cursor
      const notePitch = this.osmd.cursor.NotesUnderCursor()[0]?.Pitch.frequency;
      const gNote = this.osmd.cursor.GNotesUnderCursor()[0];
      
      //Prepare colors
      const colorPitchMatched = "#00FF00"; //green
      const colorPitchNotMatched = "#FF0000"; //red

      //Check if pitch was matched or not
      if (
        lastPitchData !== undefined &&
        Math.abs(lastPitchData - notePitch) <= 3
      ) {
        this.countGoodNotes=this.countGoodNotes+1;     
      }
      else {
        this.countBadNotes=this.countBadNotes+1;
      }

      //When note chanes, set red/green previous note
      if(gNote!==this.state.currentGNoteinScorePitch){
        var total=this.countBadNotes+this.countGoodNotes;
        if(total!==0 && (this.countGoodNotes>= Math.ceil(total*0.5))){
          //change color to green 
          if(this.state.currentGNoteinScorePitch){
            // this is for all the notes except the quarter and whole notes
            const svgElement = this.state.currentGNoteinScorePitch.getSVGGElement();
            svgElement.children[0].children[0].children[0].style.fill =
              colorPitchMatched; // notehead
            if (
              svgElement &&
              svgElement.children[0] &&
              svgElement.children[0].children[0] &&
              svgElement.children[0].children[1]
            ) {
              //this is for all the quarter and whole notes
              svgElement.children[0].children[0].children[0].style.fill =
                colorPitchMatched; // notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorPitchMatched; // notehead
            }
          }  
        }else if(total!==0 && (this.countGoodNotes < Math.ceil(total*0.5))){
          //change color to red if pitch is not close enough
          if(this.state.currentGNoteinScorePitch){
            // this is for all the notes except the quarter and whole notes
            const svgElement = this.state.currentGNoteinScorePitch.getSVGGElement();
            svgElement.children[0].children[0].children[0].style.fill =
              colorPitchNotMatched; // notehead
            if (
              svgElement &&
              svgElement.children[0] &&
              svgElement.children[0].children[0] &&
              svgElement.children[0].children[1]
            ) {
              //this is for all the quarter and whole notes
              svgElement.children[0].children[0].children[0].style.fill =
                colorPitchNotMatched; // notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorPitchNotMatched; // notehead
              }
          }
          
        }else{
          console.log("NOTE Not catched")
        }
        //Reset for next note checking
        this.countBadNotes=0;
        this.countGoodNotes=0;
      }
      //Update new vales for future comparisons
      this.setState({ currentNoteinScorePitch: notePitch });
      this.setState({ currentGNoteinScorePitch: gNote });
    }
    ////////////////////////////////////////////////////////
  };

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
    //We register the measures where repetitions happen
    //if (this.osmd.cursor.iterator.CurrentMeasureIndex !== prevProps.osmd.cursor.iterator.CurrentMeasureIndex) {
      const repetitions = this.osmd.Sheet.Repetitions;
      var repArray = [];
      for (let i in repetitions) {
        repArray.push(repetitions[i].BackwardJumpInstructions[0].measureIndex);
      }
      //We remove the last value, since the last measure always gets registered as repetition (we don't want that :S)
      repArray.pop();

      if (repArray.includes(this.osmd.cursor.iterator.CurrentMeasureIndex)) {
        console.log("Oi mate, I found a repetition at measure ", this.osmd.cursor.iterator.CurrentMeasureIndex, ", that's bloody bonkers innit?");
        //this.setState({ pitchData: [] });
      }
    //}
    
    console.log("Repetition in measures: ", repetitions);
    //console.log("Cursor is at: ", this.osmd.cursor.iterator.CurrentMeasureIndex);

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
    }

    // follow cursor changes
    if (this.props.followCursor !== prevProps.followCursor) {
      this.osmd.followCursor = this.props.followCursor;
    }

    // for pitch changes
    if(this.props.startPitchTrack){
      if (this.props.pitch !== prevProps.pitch) { //new pitch

        //Add index to X coordinates to advance pitch tracker in X axis when new pitch arrives
        if(this.notePositionX===(this.state.pitchPositionX[this.state.pitchPositionX.length-1]-this.index)){ //we are still on the same note
          this.index=this.index+6; //6 is the spacing between points
        }else{ //new note
          this.index=0; //reset index
        }
        ////////////////////////////////////////////////////////

        //Add error done to Y coordinates///////////////////////
        const newPitchMIDI= freq2midipitch(this.props.pitch[this.props.pitch.length-1]); //played note
        const currentNoteinScorePitchMIDI= freq2midipitch(this.state.currentNoteinScorePitch); //note under cursor
        const MIDIdifference=Math.abs(newPitchMIDI-currentNoteinScorePitchMIDI) //error MIDI
        const errorPixels=MIDIdifference*5-2.5; //5 pixels corresponds to a semitone (1 MIDI value), FIXME
        ////////////////////////////////////////////////////////

        //Add pitch to array ///////////////////////////////////
        const newPitchData = this.props.pitch;
        this.setState({ pitchData: newPitchData });
        //Add X position to array
        const addedNewPositionX= [...this.state.pitchPositionX, this.notePositionX+this.index];
        this.setState({ pitchPositionX: addedNewPositionX })
        //Add Y position to array
        const addedNewPositionY= [...this.state.pitchPositionY, this.notePositionY+errorPixels];
        this.setState({ pitchPositionY: addedNewPositionY })
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
      ///////////////////////THIS IS ONLY FOR DEBUGGING PURPOSES, PLEASE DELETE WHEN FINISHED/////////////////////
      backgroundColor: "green",
      opacity: 0.25,
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////
      position: "absolute",
      //top: parseFloat(this.state.initialCursorTop) + 75,
      //left: this.state.initialCursorLeft,
      pointerEvents: "none",
      background:"blue",
      
    };

    return (
      <div > 
        {showPitchTrack && (
          <div style={lineChartStyle}>
            <LineChart
              //lineVisible={this.state.lineChartVisible}
              width={1000}
              height={123}
              pitchData={this.state.pitchData}
              pitchDataPosX={this.state.pitchPositionX}
              pitchDataPosY={this.state.pitchPositionY}
            />
          </div>
        )}
        <div  ref={this.divRef}  /> 
      </div> //style={{zIndex: 2 }}
    );
  }
}

export default OpenSheetMusicDisplay;
