// opensheetmusicdisplay.js

import React, { Component } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import {
  PlaybackManager,
  LinearTimingSource,
  BasicAudioPlayer,
  IAudioMetronomePlayer,
} from "opensheetmusicdisplay";

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
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

  myListener = {
    selectionEndReached: function (o) {
      console.log("end");
    },
    resetOccurred: function (o) {},
    cursorPositionChanged: function (timestamp, data) {},
    pauseOccurred: function (o) {
      console.log("pause");
    },
    notesPlaybackEventOccurred: function (o) {},
  };

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

      // listener for cursor position
      // this.drawContinuousLine(0);
      // Draw red lines around note positions
      for (let i = 0; i < this.osmd.graphic.measureList.length; i++) {
        const measures = this.osmd.graphic.measureList[i];
        for (let j = 0; j < measures.length; j++) {
          const measure = measures[j];
          for (const se of measure.staffEntries) {
            const y = se.getLowestYAtEntry();
            const x = se.PositionAndShape.AbsolutePosition.x;
            console.log(`x: ${x}, y: ${y}`);
            this.osmd.Drawer.DrawOverlayLine(
              { x: x - 0.5, y: y },
              { x: x + 0.5, y: y },
              this.osmd.graphic.MusicPages[0]
            );
          }
        }
      }
    });
  }

  // cursorPositionChanged(timestamp, data) {
  //   const { cursorPosition } = data;
  //   const { amplitude } = this.props;
  //   const { prevCursorPosition } = this.state;

  //   // Calculate the line position based on the amplitude and cursor position
  //   const linePosition =
  //     prevCursorPosition + amplitude * (cursorPosition - prevCursorPosition);

  //   // Redraw the line
  //   this.drawContinuousLine(linePosition);

  //   // Update the previous cursor position in the component state
  //   this.setState({ prevCursorPosition: cursorPosition });
  // }

  // drawContinuousLine(position) {
  //   const { osmd } = this;
  //   const musicPage = osmd.graphic.MusicPages[0]; // Assuming single-page display

  //   // Remove previous line (optional)
  //   this.osmd.Drawer.EraseOverlay(musicPage);

  //   // Draw the continuous line
  //   this.osmd.Drawer.DrawOverlayLine(
  //     { x: 0, y: position },
  //     { x: musicPage.width, y: position },
  //     musicPage
  //   );
  // }

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

    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();
  }

  render() {
    const { amplitude, cursorPosition } = this.props;
    return (
      <div>
        <div ref={this.divRef} />
        <div
          style={{
            position: "absolute",
            top: `${cursorPosition}px`,
            width: "100%",
            height: "2px",
            background: "red",
            transform: `scaleX(${amplitude})`,
            transformOrigin: "left",
          }}
        />
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
