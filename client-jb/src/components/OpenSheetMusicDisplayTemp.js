import React, { useState, useRef, useEffect } from "react";

const OpenSheetMusicDisplay = (props) => {
  const [pitchColor, setPitchColor] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [pitchConfidenceData, setPitchConfidenceData] = useState([]);
  const [pitchPositionX, setPitchPositionX] = useState([]);
  const [pitchPositionY, setPitchPositionY] = useState([]);
  const [recordedNoteIndex, setRecordedNoteIndex] = useState([]);
  const [repetitionNumber, setRepetitionNumber] = useState([]);
  const [recordedNoteIDs, setRecordedNoteIDs] = useState([]);
  const [recordedNoteNEWIDs, setRecordedNoteNEWIDs] = useState([]);
  const [colorNotes, setColorNotes] = useState([]);
  const [initialCursorTop, setInitialCursorTop] = useState(0);
  const [initialCursorLeft, setInitialCursorLeft] = useState(0);
  const [currentGNoteinScorePitch, setCurrentGNoteinScorePitch] =
    useState(null);
  const [selectionEndReached, setSelectionEndReached] = useState(false);
  const [calculatePunctuation, setCalculatePunctuation] = useState(false);

  const osmd = useRef(undefined);
  const divRef = useRef();
  const cursorInterval = useRef(null);
  const previousTimestamp = useRef(null);
  const notePositionX = useRef(null);
  const notePositionY = useRef(null);
  const noteColor = useRef(null);
  const index = useRef(null);
  const spacing = 4;
  const countGoodNotes = useRef(0);
  const countBadNotes = useRef(0);
  const coords = useRef([0, 0]);
  const color = "black";
  const zoom = props.zoom;
  const drawPitch = props.drawPitch;
  const totalReps = useRef(0);
  const showingRep = useRef(0);

  const playbackOsmd = (osmd) => {
    const timingSource = new LinearTimingSource();
    const playbackManager = new PlaybackManager(
      timingSource,
      IAudioMetronomePlayer,
      new BasicAudioPlayer(),
      undefined
    );

    const handleSelectionEndReached = (o) => {
      console.log("end");
      setSelectionEndReached(true);
      if (props.startPitchTrack) {
        setCalculatePunctuation(true);
      }
    };

    const myListener = {
      selectionEndReached: handleSelectionEndReached,
      resetOccurred: (o) => {},
      cursorPositionChanged: (timestamp, data) => {},
      pauseOccurred: (o) => {
        console.log("pause");
      },
      notesPlaybackEventOccurred: (o) => {},
    };

    playbackManager.addListener(myListener);

    playbackManager.DoPlayback = true;
    playbackManager.DoPreCount = false;
    playbackManager.PreCountMeasures = 1;

    const initialize = () => {
      timingSource.reset();
      timingSource.pause();
      timingSource.Settings = osmd.Sheet.playbackSettings;
      playbackManager.initialize(osmd.Sheet.musicPartManager);
      playbackManager.addListener(osmd.cursor);
      playbackManager.reset();
      osmd.PlaybackManager = playbackManager;

      for (const instrument of playbackManager.InstrumentIdMapping.values()) {
        instrument.Volume = props.recordVol;
      }
    };

    return {
      initialize,
    };
  };

  const setupOsmd = () => {
    const options = {
      autoResize: props.autoResize !== undefined ? props.autoResize : true,
      drawTitle: props.drawTitle !== undefined ? props.drawTitle : true,
      followCursor:
        props.followCursor !== undefined ? props.followCursor : true,
    };

    osmd.current = new OSMD(divRef.current, options);

    osmd.current.load(props.file).then(() => {
      if (osmd.current.Sheet) {
        osmd.current.render();
        osmd.current.cursor.CursorOptions.color = "#4ade80";
        osmd.current.render();
        const cursor = osmd.current.cursor;
        props.cursorRef.current = cursor;
        cursor.show();
        setInitialCursorTop(cursor.cursorElement.style.top);
        setInitialCursorLeft(cursor.cursorElement.style.left);
      }

      osmd.current.zoom = props.zoom;
      const playbackControl = playbackOsmd(osmd.current);
      playbackControl.initialize();

      props.playbackRef.current = playbackManager;

      cursorInterval.current = setInterval(checkCursorChange, 200);
      if (props.visual === "yes") {
        osmd.current.cursor.CursorOptions.color = "#dde172";
        osmd.current.render();
      }

      [osmd.current.IDdict, osmd.current.IDInvDict] =
        generateNoteIDsAssociation(osmd.current);
    });
  };

  useEffect(() => {
    setupOsmd();

    return () => {
      const playbackManager = props.playbackRef.current;
      if (playbackManager) {
        const basicAudioPlayer = playbackManager.AudioPlayer;
        if (basicAudioPlayer) {
          basicAudioPlayer.setVolume(0);
          basicAudioPlayer.stopSound();
        }
        playbackManager.pause();
      }

      clearInterval(cursorInterval.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <div ref={divRef}>{/* Render component UI here */}</div>;
};

export default OpenSheetMusicDisplay;
