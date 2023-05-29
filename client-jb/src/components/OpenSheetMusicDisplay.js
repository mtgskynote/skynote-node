// opensheetmusicdisplay.js

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

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      amplitudeData: [],
    };

    this.osmd = undefined;
    this.divRef = React.createRef();
    // this.chartRef = React.createRef();
  }

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

  setupCursorPositionTracking() {
    const cursorElement = this.osmd.cursor.cursorElement;
    let prevLeft = cursorElement.style.left;
    let prevTop = cursorElement.style.top;

    const debounceDelay = 100; // Adjust the debounce delay as needed
    let timeoutId;

    const updateCursorPosition = () => {
      const currentLeft = cursorElement.style.left;
      const currentTop = cursorElement.style.top;

      if (currentLeft !== prevLeft || currentTop !== prevTop) {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          console.log("Left cursor position:", currentLeft);
          console.log("Top cursor position:", currentTop);
        }, debounceDelay);

        prevLeft = currentLeft;
        prevTop = currentTop;
      }

      // Recursive call to updateCursorPosition
      requestAnimationFrame(updateCursorPosition);
    };

    requestAnimationFrame(updateCursorPosition);
  }

  // Sets up osmd features and options for rendering the xml score
  setupOsmd() {
    const options = {
      autoResize:
        this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle:
        this.props.drawTitle !== undefined ? this.props.drawTitle : true,
      followCursor:
        this.props.followCursor !== undefined ? this.props.followCursor : true,
      // zoom: this.props.zoom !== undefined ? this.props.zoom : 1.0,
    };

    this.osmd = new OSMD(this.divRef.current, options);

    this.osmd.load(this.props.file).then(() => {
      this.osmd.render();
      const cursor = this.osmd.cursor;
      this.props.cursorRef.current = cursor;
      cursor.show();
      this.osmd.zoom = this.props.zoom;
      this.playbackControl = this.playbackOsmd(this.osmd);
      this.playbackControl.initialize();

      this.props.playbackRef.current = this.playbackManager;

      // setup cursor position tracking
      this.setupCursorPositionTracking();
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
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
    } else if (this.props.file !== prevProps.file) {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
    }

    if (this.props.metroVol !== prevProps.metroVol) {
      this.updateMetronomeVolume(this.props.metroVol);
    }

    if (this.props.bpm !== prevProps.bpm) {
      this.updateBpm(this.props.bpm);
    }

    if (this.props.zoom !== prevProps.zoom) {
      // console.log("zoom2_OSMD", this.props.zoom);
      this.osmd.zoom = this.props.zoom;
      this.osmd.render(); // update the OSMD instance after changing the zoom level
    }

    if (this.props.followCursor !== prevProps.followCursor) {
      this.osmd.followCursor = this.props.followCursor;
    }

    if (this.props.amplitude !== prevProps.amplitude) {
      const { amplitudeData } = this.state;
      const scaledAmplitude =
        ((this.props.amplitude - 0.0078125) / (1 - 0.0078125)) * 10;
      const newAmplitudeData = [...amplitudeData, scaledAmplitude];

      this.setState({ amplitudeData: newAmplitudeData });
    }

    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();
  }

  render() {
    const { amplitude } = this.props;
    const scaledAmplitude = ((amplitude - 0.0078125) / (1 - 0.0078125)) * 10;

    const currentTop = this.osmd?.cursor?.cursorElement?.style.top;
    const currentLeft = this.osmd?.cursor?.cursorElement?.style.left;

    // console.log("churrosTop", currentTop);
    // console.log("churrosLeft", currentLeft);
    const options = {
      plugins: {
        legend: true,
      },
    };

    const dataset = {
      label: "Amplitude Points",
      data: this.state.amplitudeData,
      backgroundColor: "aqua",
      borderColor: "black",
      pointBorderColor: "aqua",
    };

    const data = {
      labels: Array.from(Array(this.state.amplitudeData.length).keys()).map(
        String
      ), // Use index as labels
      datasets: [dataset],
    };

    // console.log("datadatadata", data);

    return (
      <div>
        <div ref={this.divRef} />
        <div
          style={{
            position: "absolute",
            top: currentTop,
            left: currentLeft,
            width: "100%",
            height: "2px",
            background: "black",
            transform: `scaleX(${amplitude})`,
            transformOrigin: "left",
          }}
        />
        <Line data={data} options={options}></Line>
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
