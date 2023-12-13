// opensheetmusicdisplay.js
// necessary imports
import React, { Component } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay"; //RepetitionInstruction
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
/////////////////////////////////////////////////////////
//THIS DEALS WITH THE AUTO-SCROLL OF THE CURSOR, IT MIGHT NOT BE THE MOST EFFICIENT WAY OF DOING IT
//SO WE'LL CONSIDER THIS A TEMPORAL PATCH :), THE SECOND PART OF THIS IS INSIDE componentDidUpdate
let isScrolling;
let scrolled = false;
window.addEventListener('scroll', function (event) {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);

    // Set a timeout to run after scrolling ends
    isScrolling = setTimeout(function () {
        // Run the code here
        scrolled = true;
    }, 100);
}, false);
////////////////////////////////////////////////////////////////////////////////////////////////

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

const generateNoteIDsAssociation=(osmd)=>{
  //function that generates an association between the noteIDs of SVGElements of current render/osmd page, 
  //with our-own-generated IDs(noteID_"measureindex"noteindex")
  let IDdictionary={}
  let IDInverseDictionary={}
  if(osmd.graphic.measureList){
    let staves = osmd.graphic.measureList;
  for (let stave_index = 0; stave_index < staves.length; stave_index++) {
    let stave = staves[stave_index][0];
      for (let note_index = 0; note_index < stave.staffEntries.length; note_index++) {
          let note = stave.staffEntries[note_index]
          let noteID= note.graphicalVoiceEntries[0].notes[0].getSVGId();
          const ourID = "noteId_"+String(stave_index)+String(note_index);
          IDdictionary[noteID] = ourID; //dict[auto-ID]=our-ID
          IDInverseDictionary[ourID]=noteID // the inverse dict[our_ID]=auto-ID
      }
    }
    return [IDdictionary, IDInverseDictionary];
  }
  
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
          let noteNEWID=osmd.IDdict[noteID]
          let noteX=note.graphicalVoiceEntries[0].notes[0].getSVGGElement().getBoundingClientRect().x 
          //check for notehead color
          const colorsArray=state.colorNotes.slice()
          const index = colorsArray.findIndex(item => item[0][0] === noteNEWID && item[0][2]===showingRep);
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
            if (state.recordedNoteIDs[index] === noteID) { //this note has been recorded
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
      recordedNoteNEWIDs:[],
      colorNotes:[],
      initialCursorTop: 0,
      initialCursorLeft: 0,
      currentGNoteinScorePitch: null,
      
      
    };
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.cursorInterval = null;
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
    this.selectionEndReached=false;
  }
  //this.IPlaybackListener=new IPlaybackListener()
  
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
    const handleSelectionEndReached = (o) => {
      console.log('end');
      // Update the flag when the event occurs
      this.selectionEndReached=true;
    };
    var myListener = {
      selectionEndReached: handleSelectionEndReached,
      resetOccurred: function(o) {},
      cursorPositionChanged: function(timestamp, data) {},
      pauseOccurred: function(o) {console.log("pause")},
      notesPlaybackEventOccurred: function(o) {}
    };
    this.playbackManager.addListener(myListener);

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
        this.osmd.cursor.CursorOptions.color="#add8e6";
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

      //when we come in visual mode, in the setup we set the cursor color to yellow
      this.cursorInterval = setInterval(this.checkCursorChange, 200);
      if(this.props.visual==="yes"){
        this.osmd.cursor.CursorOptions.color="#dde172"
        this.osmd.render()
      }
      //save dictionary of IDs associations
      [this.osmd.IDdict, this.osmd.IDInvDict] = generateNoteIDsAssociation(this.osmd)
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
    //Update bpm
    this.osmd.PlaybackManager.setBpm(newBpm);
    //Just in case, update bpm values for every measure of the score
    const sourceMeasures = this.osmd.Sheet.SourceMeasures;
    for (let i = 0; i < sourceMeasures.length; i++) {
      sourceMeasures[i].TempoInBPM = newBpm;
    }
  }

  //function to check cursor change
  checkCursorChange = () => {
    const cursorCurrent=this.osmd.cursor.Iterator.currentTimeStamp.RealValue;

    //WHEN CURSOR REACHES THE END /////////////
    if(this.selectionEndReached === true){ 
      this.props.cursorActivity(true);
      this.previousTimestamp=null;
      this.selectionEndReached=false; //ready for next time
    }
    
    //if recording active
    if (this.props.startPitchTrack){

      

      //Check for repetitions
      if (this.previousTimestamp > cursorCurrent) {
        // Cursor moved back, repetition detected
        this.totalReps++;
        this.showingRep = this.totalReps;
        this.resetNotesColor();
      }

      //store timestampfor next iteration
      this.previousTimestamp=cursorCurrent; 
      ////////////////////////////////////////////////////////
      
      // EXTRACT POSITION OF NOTE UNDER CURSOR////////////////

      //Get note object under cursor
      const gNote = this.osmd.cursor.GNotesUnderCursor()[0];
      
      //Absolute Position
      const svgElement=gNote.getSVGGElement()
      /*console.log(this.osmd.cursor.GNotesUnderCursor())
      console.log("element under the cursor ",gNote.vfpitch[0])
      console.log("time stamp ", cursorCurrent.RealValue)*/
      
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

      //Prepare colors
      const colorPitchMatched = "#00FF00"; //green
      const colorPitchNotMatched = "#FF0000"; //red

      //Current Note/Silence under cursor
      var notePitch;
      if(this.osmd.cursor.NotesUnderCursor()[0].Pitch!==undefined){
        //note
        notePitch = this.osmd.cursor.NotesUnderCursor()[0].Pitch.frequency;
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
        }
      }else{
        //silence
        notePitch = 0;
        //Check if pitch was matched or not, only if confidence of newPitchdata is >=0.5
        if(lastPitchConfidenceData<=0.5){
            this.countGoodNotes=this.countGoodNotes+1;  
          }
          else {
            this.countBadNotes=this.countBadNotes+1;
          }
      }
      
        
      var total=this.countBadNotes+this.countGoodNotes;
      if(total!==0 && (this.countGoodNotes>= Math.ceil(total*0.5))){
        //GOOD NOTE - change color to green
        this.noteColor=colorPitchMatched;
      }else if(total!==0 && (this.countGoodNotes< Math.ceil(total*0.5))){
        //WRONG NOTE - change color to red
        this.noteColor=colorPitchNotMatched;
      }
    

      if(this.state.currentGNoteinScorePitch){
        //Save/overwrite color data
        const noteID=this.osmd.IDdict[this.state.currentGNoteinScorePitch.getSVGId()];
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

  //mode changed
    if (this.props.mode !== prevProps.mode) { 
      if(this.props.mode){ //practice mode
        this.osmd.cursor.CursorOptions.color="#add8e6"
        this.osmd.render()
      }else{ //record mode
        this.osmd.cursor.CursorOptions.color="#a3cd8f"
        this.osmd.render()
      }
    }

    const container = document.getElementById('osmdSvgPage1');
    this.coords=[container.getBoundingClientRect().width,container.getBoundingClientRect().height];

    /////////////////////////////////////////////////////////
    //THIS DEALS WITH THE AUTO-SCROLL OF THE CURSOR, IT MIGHT NOT BE THE MOST EFFICIENT WAY OF DOING IT
    //SO WE'LL CONSIDER THIS A TEMPORAL PATCH :), THE FIRST PART OF THIS IS AT THE TOP
    if (scrolled === true) {
      scrolled = false;
      //this.osmd.render(); // update the OSMD instance after changing the zoom level
      const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] = renderPitchLineZoom(this.osmd, this.state, this.zoom, this.showingRep);
      this.setState({pitchPositionX: updatedPitchPositionX});
      this.setState({ pitchPositionY: updatedPitchPositionY});
      this.setState({recordedNoteIndex:updatedNoteIndex})
    }
    //////////////////////////////////////////////////////////

    // for title and file changes
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
    } else if (this.props.file !== prevProps.file) {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
    }

    // for downloading
    if (this.props.canDownload === true && this.props.canDownload !== prevProps.canDownload) {
      const dataToSave = {
        pitchTrackPoints: this.state.pitchData,
        pitchX:this.state.pitchPositionX,
        pitchY:this.state.pitchPositionY,
        pitchPointColor: this.state.pitchColor,
        repetitionNumber: this.state.repetitionNumber,
        //noteIDs: this.state.recordedNoteIDs, dont need to save this, as they may change in new OSMD page
        noteNEWIDs: this.state.recordedNoteNEWIDs,
        noteIndex: this.state.recordedNoteIndex,
        noteColors: this.state.colorNotes,
        bpm: this.props.bpm
      };

      const jsonString = JSON.stringify(dataToSave);
      const jsonBlob = new Blob([jsonString], { type: "application/json" });
      this.props.dataToDownload(jsonBlob);
    }
    
    // newJson import - UPDATE ALL NECCESSARY VALUES
    if (this.props.visualJSON !== prevProps.visualJSON) {
      const json=this.props.visualJSON
      //update values:
      this.setState({colorNotes:json.noteColors});
      this.setState({ recordedNoteNEWIDs: json.noteNEWIDs});
      this.setState({ recordedNoteIndex:json.noteIndex});
      this.setState({ pitchData: json.pitchTrackPoints });
      this.setState({ pitchColor: json.pitchPointColor })
      this.setState({ repetitionNumber: json.repetitionNumber})
      this.showingRep=0; 
      this.totalReps=Math.max(...json.repetitionNumber);
      //Generate autoIds from ourIDs
      const AUXrecordedNoteIds=json.noteNEWIDs.map(newID => this.osmd.IDInvDict[newID]);
      this.setState({ recordedNoteIDs: AUXrecordedNoteIds});
      //Update color of notes, to be able to see them as well as update position X and Y for pitch track line points
      let copy_pitchPositionX=json.pitchX.slice();
      let copy_pitchPositionY=json.pitchY.slice();
      let staves = this.osmd.graphic.measureList;
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
              let noteNEWID=this.osmd.IDdict[noteID]
              let noteX=note.graphicalVoiceEntries[0].notes[0].getSVGGElement().getBoundingClientRect().x
              //check for notehead color
              const colorsArray=json.noteColors.slice()
              const index = colorsArray.findIndex(item => item[0][0] === noteNEWID && item[0][2]===this.showingRep);
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
              if (AUXrecordedNoteIds[index] === noteID) { //this note has been recorded
                let midiToStaffStep= midi2StaffGaps(freq2midipitch(json.pitchTrackPoints[index]))
                copy_pitchPositionX[index]= noteX;
                copy_pitchPositionY[index]= middleLineStave+midiToStaffStep*oneStepPixels;
            }
          }
            } 
      }
      //Save in state the new pitch track line X and Y point positions
      this.setState({ pitchPositionX: copy_pitchPositionX })
      this.setState({ pitchPositionY: copy_pitchPositionY })
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
      this.props.showRepeatsInfo(this.showingRep, this.totalReps);
      this.resetNotesColor();
      //Update color of notes
      let staves = this.osmd.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
          for (let note_index = 0; note_index < stave.staffEntries.length; note_index++) {
              let note = stave.staffEntries[note_index]
              let noteID= note.graphicalVoiceEntries[0].notes[0].getSVGId();
              let noteNEWID=this.osmd.IDdict[noteID]
              //check for notehead color
              const colorsArray=this.state.colorNotes.slice()
              const index = colorsArray.findIndex(item => item[0][0] === noteNEWID && item[0][2]===this.showingRep);
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
        const midiToStaffStep=midi2StaffGaps(newPitchMIDI) //where to locate the played note in the staff with respect to B4(middle line)
        if (midiToStaffStep === 0 || this.props.pitchConfidence[this.props.pitchConfidence.length-1]<0.5) { //
          //Color turns white/invisible when pitch is out of bounds or pitch confidence is below 0.5
          this.color = "#FFFFFF"; //"#FFFFFF"
        } else {
          this.color = "#000000";
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
          const noteID=this.state.currentGNoteinScorePitch.getSVGId()
          const addNewNoteID=[...this.state.recordedNoteIDs,noteID ];
          this.setState({ recordedNoteIDs: addNewNoteID });
          const addNewNoteNEWID=[...this.state.recordedNoteNEWIDs, this.osmd.IDdict[noteID]];
          this.setState({ recordedNoteNEWIDs: addNewNoteNEWID });
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
      this.setState({ recordedNoteNEWIDs: [] });
      this.setState({ recordedNoteIndex:[]});
      this.setState({ pitchData: [] });
      this.setState({ pitchPositionX: [] })
      this.setState({ pitchPositionY: [] })
      this.setState({ pitchColor: [] })
      this.setState({ repetitionNumber: []})
      this.resetNotesColor();
      this.showingRep=0;
      this.totalReps=0;
      this.previousTimestamp=0;
      this.props.showRepeatsInfo(0,0)
      this.props.onResetDone(); // call the function passed from the parent component
    }

    // resize the osmd when the window is resized
    //window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();

    // Add a listener for cursor change events
  }

  render() {
    //const { showPitchTrack } = this.props;

    //const { isResetButtonPressed } = this.state;

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
