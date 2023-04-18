// opensheetmusicdisplay.js

import React, { Component } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import {
  PlaybackManager,
  LinearTimingSource,
  BasicAudioPlayer,
  ControlPanel,
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
      undefined,
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
      //playbackManager.removeListener(osmd.cursor); // only necessary if no duplicate checks in addListener
      this.playbackManager.addListener(osmd.cursor);
      this.playbackManager.reset();
      this.osmd.PlaybackManager = this.playbackManager;
    };

    return {
      initialize,
    };
  }

  setupOsmd() {
    const options = {
      autoResize:
        this.props.autoResize !== undefined ? this.props.autoResize : true,
      drawTitle:
        this.props.drawTitle !== undefined ? this.props.drawTitle : true,
      zoom: this.props.zoom !== undefined ? this.props.zoom : 1.0,
    };

    this.osmd = new OSMD(this.divRef.current, options);

    this.osmd.load(this.props.file).then(() => {
      this.osmd.render();
      const cursor = this.osmd.cursor;
      this.props.cursorRef.current = cursor;
      cursor.show();
      this.osmd.zoom = this.props.zoom !== undefined ? this.props.zoom : 1.0;
      this.playbackControl = this.playbackOsmd(this.osmd);
      this.playbackControl.initialize();
    });
  }

  resize() {
    this.forceUpdate();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize);
  }

  componentDidUpdate(prevProps) {
    if (this.props.drawTitle !== prevProps.drawTitle) {
      this.setupOsmd();
    } else {
      this.osmd.load(this.props.file).then(() => this.osmd.render());
    }
    window.addEventListener("resize", this.resize);
  }

  componentDidMount() {
    this.setupOsmd();
  }

  handlePlayButtonClick() {
    if (this.osmd && this.osmd.PlaybackManager) {
      this.osmd.PlaybackManager.play();
    }
  }

  handlePauseButtonClick() {
    if (this.osmd && this.osmd.PlaybackManager) {
      this.osmd.PlaybackManager.pause();
    }
  }

  render() {
    return (
      <div>
        <div ref={this.divRef} />
        <button onClick={() => this.handlePlayButtonClick()}>Play</button>
        <button onClick={() => this.handlePauseButtonClick()}>Pause</button>
      </div>
    );
  }
}

export default OpenSheetMusicDisplay;
