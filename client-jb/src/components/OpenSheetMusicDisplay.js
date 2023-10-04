// opensheetmusicdisplay.js
// necessary imports
import React, { Component, useEffect } from "react";
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

// creating the class component
class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pitchData: [],
      initialCursorTop: 0,
      initialCursorLeft: 0,
      currentNoteinScorePitch: null,
    };
    this.osmd = undefined;
    this.divRef = React.createRef();
    this.cursorInterval = null;
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

      this.cursorInterval = setInterval(this.checkCursorChange, 100);
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
    if (this.props.startPitchTrack) {
      const notePitch = this.osmd.cursor.NotesUnderCursor()[0]?.Pitch.frequency;
      this.setState({ currentNoteinScorePitch: notePitch });

      //check if pitch data is equal to the current note in score pitch
      // Get the last pitch in the pitchData array
      const lastPitchData =
        this.state.pitchData[this.state.pitchData.length - 1];

      // Compare the last pitch in the pitchData array with the current pitch
      // Check if the absolute difference between them is less than or equal to 3hz
      const colorPitchMatched = "#00FF00"; //green
      const colorPitchNotMatched = "#FF0000"; //red
      const gNote = this.osmd.cursor.GNotesUnderCursor()[0];

      //for pitch matched
      if (
        lastPitchData !== undefined &&
        Math.abs(lastPitchData - notePitch) <= 3
      ) {
        // console.log(
        //   "played pitch is equal to current note in score, scoreNotePitch: ",
        //   notePitch,
        //   "detectedPitch:",
        //   lastPitchData
        // );

        //change color to green if pitch is close enough
        if (gNote) {
          // this is for all the notes except the quarter and whole notes
          const svgElement = gNote.getSVGGElement();
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
      }

      //for pitch not matched
      else {
        // console.log(
        //   "played pitch is not equal to current note in score, scoreNotePitch:",
        //   notePitch,
        //   "detectedPitch:",
        //   lastPitchData
        // );

        //change color to red if pitch is not close enough
        if (gNote) {
          // this is for all the notes except the quarter and whole notes
          const svgElement = gNote.getSVGGElement();
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
      }
    }
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
      // console.log("zoom2_OSMD", this.props.zoom);
      this.osmd.zoom = this.props.zoom;
      this.osmd.render(); // update the OSMD instance after changing the zoom level
    }

    // follow cursor changes
    if (this.props.followCursor !== prevProps.followCursor) {
      this.osmd.followCursor = this.props.followCursor;
    }

    // for pitch changes
    if (this.props.pitch !== prevProps.pitch) {
      const { pitchData } = this.state;
      const newPitchData = [...pitchData, this.props.pitch];
      this.setState({ pitchData: newPitchData });
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

    // if (prevProps.startPitchTrack && !this.props.startPitchTrack) {
    //   console.log("startPitchTrack");
    // }

    if (
      prevProps.isResetButtonPressed !== this.props.isResetButtonPressed &&
      this.props.isResetButtonPressed
    ) {
      this.resetNotesColor();
      // console.log("resetting");
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
    const { startPitchTrack } = this.props;

    const { isResetButtonPressed } = this.state;

    const lineChartStyle = {
      position: "relative",
      top: "300px",
      left: this.state.initialCursorLeft,
      pointerEvents: "none",
    };

    return (
      <div style={{ position: "relative" }}>
        {startPitchTrack && (
          <div style={lineChartStyle}>
            <LineChart
              lineVisible={this.state.lineChartVisible}
              pitchData={this.state.pitchData}
            />
          </div>
        )}
        <div ref={this.divRef} />
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
