// opensheetmusicdisplay.js

import React, { Component } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";

class OpenSheetMusicDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { dataReady: false };
    this.osmd = undefined;
    this.divRef = React.createRef();
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
      this.osmd.zoom = this.props.zoom !== undefined ? this.props.zoom : 1.0; // 1.0 is default
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

  render() {
    return <div ref={this.divRef} />;
  }
}

export default OpenSheetMusicDisplay;
