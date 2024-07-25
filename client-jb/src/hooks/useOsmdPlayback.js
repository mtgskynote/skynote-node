import { useCallback, useRef } from "react";
import {
  PlaybackManager,
  LinearTimingSource,
  IAudioMetronomePlayer,
  BasicAudioPlayer,
} from "opensheetmusicdisplay";
import useInstanceVariables from "../hooks/useInstanceVariables";

const useOsmdPlayback = (props) => {
  const selectionEndReachedRef = useRef(false);
  const calculatePunctuationRef = useRef(false);

  return useCallback(
    (osmd) => {
      const timingSource = new LinearTimingSource();
      const playbackManager = new PlaybackManager(
        timingSource,
        IAudioMetronomePlayer,
        new BasicAudioPlayer(),
        undefined
      );

      const handleSelectionEndReached = () => {
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

      return { initialize };
    },
    [props.startPitchTrack, props.recordVol]
  );
};

export default useOsmdPlayback;
