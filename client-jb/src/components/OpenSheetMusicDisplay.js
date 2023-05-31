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

import { Line } from "react-chartjs-2";
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
      amplitudeData: [], // amplitude data
      pitchData: [], // pitch data
      lineChartVisible: true, // chart visibility
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

  resize() {
    this.forceUpdate();
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

    // for amplitude changes
    if (this.props.amplitude !== prevProps.amplitude) {
      const { amplitudeData } = this.state;
      const scaledAmplitude =
        ((this.props.amplitude - 0.0078125) / (1 - 0.0078125)) * 10;
      const newAmplitudeData = [...amplitudeData, scaledAmplitude];
      this.setState({ amplitudeData: newAmplitudeData });
    }

    // for pitch changes
    if (this.props.pitch !== prevProps.pitch) {
      const { pitchData } = this.state;
      const newPitchData = [...pitchData, this.props.pitch];
      this.setState({ pitchData: newPitchData });
    }

    // to draw the line chart when the play button is clicked
    if (this.props.playClicked && !prevProps.playClicked) {
      this.setState({ lineChartVisible: true });
      console.log("chartVisible", this.state.lineChartVisible);
    }

    // resize the osmd when the window is resized
    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();
  }

  render() {
    //----------line chart calculations----------------//
    //amplitude
    const { amplitude } = this.props;
    const scaledAmplitude = ((amplitude - 0.0078125) / (1 - 0.0078125)) * 10;

    //pitch
    const { pitch } = this.props;

    function normalizeFrequency(frequency) {
      const minFrequency = 20;
      const maxFrequency = 20000;
      let normalizedPitch =
        (frequency - minFrequency) / (maxFrequency - minFrequency);
      return normalizedPitch;
    }

    const normalizedPitch = normalizeFrequency(pitch);

    // console.log("pitch hello pitch", pitch);
    const currentTop = this.osmd?.cursor?.cursorElement?.style.top;
    const currentLeft = this.osmd?.cursor?.cursorElement?.style.left;

    // console.log("Top", currentTop);
    // console.log("Left", currentLeft);

    // line chart options and data
    const options = {
      plugins: {
        legend: true,
      },
    };

    // // for amplitude
    // const dataset = {
    //   label: "Amplitude Points",
    //   data: this.state.amplitudeData,
    //   backgroundColor: "aqua",
    //   borderColor: "black",
    //   pointBorderColor: "aqua",
    // };

    // const data = {
    //   labels: Array.from(Array(this.state.amplitudeData.length).keys()).map(
    //     String
    //   ),
    //   datasets: [dataset],
    // };

    // // for pitch
    const dataset = {
      label: "Frequency",
      data: this.state.pitchData,
      backgroundColor: "aqua",
      borderColor: "black",
      pointBorderColor: "aqua",
    };

    const data = {
      labels: Array.from(Array(this.state.pitchData.length).keys()).map(String),
      datasets: [dataset],
    };

    return (
      <div>
        <div
          style={{
            position: "absolute",
            top: currentTop,
            left: currentLeft,
            width: "100%",
            height: "2px",
            background: "black",
            transform: `scaleX(${normalizedPitch * 10})`,
            transformOrigin: "left",
          }}
        />
        <div ref={this.divRef} />

        {this.state.lineChartVisible && (
          <Line data={data} options={options}></Line>
        )}
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
