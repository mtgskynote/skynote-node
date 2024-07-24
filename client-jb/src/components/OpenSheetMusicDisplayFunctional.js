import React, { useRef, useEffect, useCallback } from "react";
import usePitchState from "../hooks/usePitchState";
import useCursorState from "../hooks/useCursorState";
import useInstanceVariables from "../hooks/useInstanceVariables";
import {
  PlaybackManager,
  LinearTimingSource,
  IAudioMetronomePlayer,
  BasicAudioPlayer,
} from "your-audio-library";

const OpenSheetMusicDisplay = (props) => {
  const pitchState = usePitchState();
  const cursorState = useCursorState();
  const instanceVariables = useInstanceVariables(props);

  const divRef = useRef(null);
  const playbackManagerRef = useRef(null);
  const selectionEndReachedRef = useRef(false);
  const calculatePunctuationRef = useRef(false);

  const setupListeners = (
    props,
    playbackManager,
    selectionEndReachedRef,
    calculatePunctuationRef
  ) => {
    const handleSelectionEndReached = (o) => {
      console.log("end");
      selectionEndReachedRef.current = true;
      if (props.startPitchTrack) {
        calculatePunctuationRef.current = true;
      }
    };

    const myListener = {
      selectionEndReached: handleSelectionEndReached,
      resetOccurred: () => {},
      cursorPositionChanged: (timestamp, data) => {},
      pauseOccurred: () => {
        console.log("pause");
      },
      notesPlaybackEventOccurred: () => {},
    };

    playbackManager.addListener(myListener);
  };

  const initializePlaybackManager = (
    osmd,
    playbackManager,
    timingSource,
    props
  ) => {
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

  const playbackOsmd = useCallback(
    (osmd) => {
      const timingSource = new LinearTimingSource();
      playbackManagerRef.current = new PlaybackManager(
        timingSource,
        IAudioMetronomePlayer,
        new BasicAudioPlayer(),
        undefined
      );

      setupListeners(
        props,
        playbackManagerRef.current,
        selectionEndReachedRef,
        calculatePunctuationRef
      );

      playbackManagerRef.current.DoPlayback = true;
      playbackManagerRef.current.DoPreCount = false;
      playbackManagerRef.current.PreCountMeasures = 1;

      const initialize = () => {
        initializePlaybackManager(
          osmd,
          playbackManagerRef.current,
          timingSource,
          props
        );
      };

      return { initialize };
    },
    [props]
  );

  useEffect(() => {
    if (instanceVariables.osmd.current) {
      const { initialize } = playbackOsmd(instanceVariables.osmd.current);
      initialize();
    }
  }, [instanceVariables.osmd, playbackOsmd]);

  useEffect(() => {
    return () => {
      if (instanceVariables.cursorInterval.current) {
        clearInterval(instanceVariables.cursorInterval.current);
      }
    };
  }, [instanceVariables.cursorInterval]);

  return <div ref={divRef}>{/* Render the component UI here */}</div>;
};

export default OpenSheetMusicDisplay;
