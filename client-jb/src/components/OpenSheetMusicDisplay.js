// opensheetmusicdisplay.js

// necessary imports
import React, { Component } from "react";
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

// opsnsheetmusicdisplay class component
class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pitchData: [], // pitch data
      newStartPitchTrack: false, // start pitch track
    };

    this.osmd = undefined;
    this.divRef = React.createRef();
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

    // check the current divref
    console.log("bon dia bon dia bon dia", this.divRef.current);

    //define the osmd features to be included
    this.osmd.load(this.props.file).then(() => {
      this.osmd.render();
      const cursor = this.osmd.cursor;
      this.props.cursorRef.current = cursor;
      cursor.show();
      this.osmd.zoom = this.props.zoom;
      this.playbackControl = this.playbackOsmd(this.osmd);
      this.playbackControl.initialize();

      this.props.playbackRef.current = this.playbackManager;
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

    if (this.props.startPitchTrack !== prevProps.startPitchTrack) {
      // Access the updated value of startPitchTrack prop
      const newStartPitchTrack = this.props.startPitchTrack;
      console.log("startPitchTrack hello hello", newStartPitchTrack);
    }

    // resize the osmd when the window is resized
    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();
  }

  render() {
    const { startPitchTrack } = this.props;
    console.log("newStartPitchTrack bon diaaaaaaa", startPitchTrack);
    //----------line chart calculations----------------//

    //pitch for making the (pitch tracking line)
    const { pitch } = this.props;
    function normalizeFrequency(frequency) {
      const minFrequency = 20;
      const maxFrequency = 20000;
      let normalizedPitch =
        (frequency - minFrequency) / (maxFrequency - minFrequency);
      return normalizedPitch;
    }
    const normalizedPitch = normalizeFrequency(pitch);

    // cursor position

    let currentTop = this.osmd?.cursor?.cursorElement?.style.top;
    let currentLeft = this.osmd?.cursor?.cursorElement?.style.left;
    // console.log("currentTop", currentTop);
    // console.log("currentLeft", currentLeft);

    const cursorPosition = {
      currentTop,
      currentLeft,
      normalizedPitch,
    };

    return (
      <div style={{ position: "relative" }}>
        <div ref={this.divRef} />
        {startPitchTrack && ( // Conditionally render the line chart based on newStartPitchTrack
          <LineChart
            lineVisible={this.state.lineChartVisible}
            pitchData={this.state.pitchData}
            cursorPosition={cursorPosition}
          />
        )}
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
