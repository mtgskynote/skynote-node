import { useCallback } from "react";
import {
  PlaybackManager,
  LinearTimingSource,
  IAudioMetronomePlayer,
  BasicAudioPlayer,
} from "opensheetmusicdisplay";
import useInstanceVariables from "../hooks/useInstanceVariables";
import { usePitchState } from "./usePitchState";

const useOsmdPlayback = (props) => {
  const instanceVariables = useInstanceVariables(props);
  const pitchState = usePitchState();

  return useCallback(
    (osmd) => {
      const timingSource = new LinearTimingSource();
      instanceVariables.playbackManager.current = new PlaybackManager(
        timingSource,
        IAudioMetronomePlayer,
        new BasicAudioPlayer(),
        undefined
      );

      const playbackManager = instanceVariables.playbackManager.current;

      const handleSelectionEndReached = () => {
        // Update the flag when the event occurs
        props.cursorActivity(true);
        instanceVariables.previousTimestamp.current = null;
        if (props.startPitchTrack) {
          // Set flag to calculate stars based on recording accuracy
          instanceVariables.calculatePunctuation.current = true;
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
        instanceVariables.playbackManager.current = playbackManager;

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
