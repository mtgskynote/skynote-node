import React, { useRef, useEffect, useState, useCallback } from "react";
import { usePitchState } from "../hooks/usePitchState";
import useCursorState from "../hooks/useCursorState";
import useInstanceVariables from "../hooks/useInstanceVariables";
import useOsmdSetup from "../hooks/useOsmdSetup";
import {
  freq2midipitch,
  resetNotesColor,
  midi2StaffGaps,
} from "../utils/osmdUtils";
import useRenderPitchLineZoom from "../hooks/useRenderPitchLineZoom";
import LineChart from "./LineChartOSMD";

const OpenSheetMusicDisplay = (props) => {
  const pitchState = usePitchState();
  const cursorState = useCursorState();
  const instanceVariables = useInstanceVariables(props);
  const [scrolled, setScrolled] = useState(false);

  const divRef = useRef(null);
  const playbackRef = props.playbackRef;
  const [isLoaded, setIsLoaded] = useState(false);

  const setupOsmd = useOsmdSetup(
    props,
    instanceVariables,
    divRef,
    pitchState,
    cursorState,
    setIsLoaded
  );
  const { renderPitchLineZoom } = useRenderPitchLineZoom();

  // Define default line chart style
  const lineChartStyle = {
    position: "absolute",
    pointerEvents: "none",
  };

  // Update metronome volume
  const updateMetronomeVolume = useCallback(
    (newVolume) => {
      const osmd = instanceVariables.osmd.current;
      if (osmd && osmd.PlaybackManager) {
        osmd.PlaybackManager.Metronome.Volume = newVolume;
      }
    },
    [instanceVariables.osmd]
  );

  // Update BPM value
  const updateBpm = useCallback(
    (newBpm) => {
      const osmd = instanceVariables.osmd.current;
      if (osmd && osmd.PlaybackManager) {
        osmd.PlaybackManager.setBpm(newBpm);
        const sourceMeasures = osmd.Sheet.SourceMeasures;
        for (let i = 0; i < sourceMeasures.length; i++) {
          sourceMeasures[i].TempoInBPM = newBpm;
        }
      }
    },
    [instanceVariables.osmd]
  );

  // Cleanup function to replace componentWillUnmount
  useEffect(() => {
    return () => {
      const playbackManager = props.playbackRef.current;
      console.log("yAAS", playbackManager);
      if (playbackManager) {
        const basicAudioPlayer = playbackManager.AudioPlayer;
        if (basicAudioPlayer) {
          basicAudioPlayer.setVolume(0);
          basicAudioPlayer.stopSound();
        }
        playbackManager.pause();
      }

      if (instanceVariables.cursorInterval.current) {
        clearInterval(instanceVariables.cursorInterval.current);
      }
    };
  }, [playbackRef, instanceVariables.cursorInterval]);

  // Handle cursor color based on current mode
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (osmd) {
      if (props.mode) {
        osmd.cursor.CursorOptions.color = "#4ade80"; // Practice mode
      } else {
        osmd.cursor.CursorOptions.color = "#f87171"; // Record mode
      }
      osmd.render();
    }
  }, [props.mode]);

  // Setup OSMD score on first page load
  useEffect(() => {
    setupOsmd();
  }, []);

  // Setup OSMD whenever the title changes
  useEffect(() => {
    setupOsmd();
  }, [props.drawTitle]);

  // Handle loading a score file into OSMD
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (osmd) {
      osmd.load(props.file).then(() => osmd.render());
    }
  }, [props.file, instanceVariables.osmd.current]);

  // Handle downloading a recording
  useEffect(() => {
    if (props.canDownload) {
      let numStars;
      const colorNotes = usePitchState.colorNotes.slice();
      if (instanceVariables.calculatePunctuation.current === true) {
        // Calculate num stars achieved when recording is done
        const colors = colorNotes
          .map((innerArray) => innerArray.map((subArray) => subArray[1]))
          .flat();
        const numGreen = colors.filter((color) => color === "#00FF00").length;
        const numTotal = colors.length;
        const proportion = numGreen / numTotal;
        if (proportion >= 0.8) {
          numStars = 3;
        } else if (proportion >= 0.6 && proportion < 0.8) {
          numStars = 2;
        } else if (proportion >= 0.3 && proportion < 0.6) {
          numStars = 1;
        } else {
          numStars = 0;
        }
        instanceVariables.calculatePunctuation.current = false;
      } else {
        numStars = 0;
      }

      const dataToSave = {
        pitchTrackPoints: usePitchState.pitchData,
        pitchX: usePitchState.pitchPositionX,
        pitchY: usePitchState.pitchPositionY,
        pitchPointColor: usePitchState.pitchColor,
        repetitionNumber: usePitchState.repetitionNumber,
        noteNEWIDs: usePitchState.recordedNoteNEWIDs,
        noteIndex: usePitchState.recordedNoteIndex,
        noteColors: usePitchState.colorNotes,
        bpm: props.bpm,
        stars: numStars,
      };

      const jsonString = JSON.stringify(dataToSave);
      props.dataToDownload(jsonString);
    }
  }, [props.canDownload]);

  // Update all values for a recorded score (when viewing in playback mode)
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    const json = props.visualJSON;
    if (props.visualJSON && osmd) {
      pitchState.setColorNotes(json.noteColors);
      pitchState.setRecordedNoteNEWIDs(json.noteNEWIDs);
      pitchState.setRecordedNoteIndex(json.noteIndex);
      pitchState.setPitchData(json.pitchTrackPoints);
      pitchState.setPitchColor(json.pitchPointColor);
      pitchState.setRepetitionNumber(json.repetitionNumber);
      instanceVariables.showingRep.current = 0;
      instanceVariables.totalReps.current = Math.max(...json.repetitionNumber);

      // Generate autoIds from our IDs
      const AUXrecordedNoteIds = json.noteNEWIDs.map(
        (newID) => osmd.IDInvDict[newID]
      );
      usePitchState.setRecordedNoteIDs(AUXrecordedNoteIds);

      // Update color of notes and XY positions of pitch track line points
      let copy_pitchPositionX = json.pitchX.slice();
      let copy_pitchPositionY = json.pitchY.slice();

      if (osmd.graphic.measureList) {
        let staves = osmd.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          const staveLines =
            document.getElementsByClassName("vf-stave")[stave_index];
          const upperLineStave =
            staveLines.children[0].getBoundingClientRect().top; //upper line
          const middleLineStave =
            staveLines.children[2].getBoundingClientRect().top; //middle line
          const lowerLineStave =
            staveLines.children[4].getBoundingClientRect().top; //lower line
          const oneStepPixels =
            Math.abs(upperLineStave - lowerLineStave) / 4 / 2; //steps corresponding to one step in staff
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            let note = stave.staffEntries[note_index];
            let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
            let noteNEWID = osmd.IDdict[noteID];
            let noteX = note.graphicalVoiceEntries[0].notes[0]
              .getSVGGElement()
              .getBoundingClientRect().x;

            // Check for notehead color
            const colorsArray = json.noteColors.slice();
            const index = colorsArray.findIndex(
              (item) =>
                item[0][0] === noteNEWID &&
                item[0][2] === instanceVariables.showingRep.current
            );
            if (index !== -1) {
              // This is for all the notes except the quarter and whole notes
              const svgElement =
                note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              if (
                svgElement &&
                svgElement.children[0] &&
                svgElement.children[0].children[0] &&
                svgElement.children[0].children[1]
              ) {
                // This is for all the quarter and whole notes
                svgElement.children[0].children[0].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
                svgElement.children[0].children[1].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
              }
            }
            // Check for pitch tracking line
            for (let index = 0; index < copy_pitchPositionX.length; index++) {
              if (AUXrecordedNoteIds[index] === noteID) {
                //this note has been recorded
                let midiToStaffStep = midi2StaffGaps(
                  freq2midipitch(json.pitchTrackPoints[index])
                );
                copy_pitchPositionX[index] = noteX;
                copy_pitchPositionY[index] =
                  middleLineStave + midiToStaffStep * oneStepPixels;
              }
            }
          }
        }
      }

      pitchState.setPitchPositionX(copy_pitchPositionX);
      pitchState.setPitchPositionY(copy_pitchPositionY);
    }
  }, [props.visualJSON]);

  // Get initial page coordinates for pitch tracking line on first page load
  useEffect(() => {
    const container = document.getElementById("osmdSvgPage1");
    if (container) {
      instanceVariables.coords.current = [
        container.getBoundingClientRect().width,
        container.getBoundingClientRect().height,
      ];
    }
  }, []);

  // Handle new pitch line coordinates when page is scrolled
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (scrolled) {
      setScrolled(false); // Reset the scrolled flag

      if (osmd?.graphic?.measureList) {
        const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
          renderPitchLineZoom(osmd, props.state, props.zoom, props.showingRep);

        pitchState.setPitchPositionX(updatedPitchPositionX);
        pitchState.setPitchPositionY(updatedPitchPositionY);
        pitchState.setRecordedNoteIndex(updatedNoteIndex);
      }
    }
  }, [scrolled, props.state, props.zoom, props.showingRep]);

  // Handle BPM changes
  useEffect(() => {
    updateBpm(props.bpm);
  }, [props.bpm]);

  // Handle metronome volume changes
  useEffect(() => {
    updateMetronomeVolume(props.metroVol);
  }, [props.metroVol]);

  // Handle MIDI volume changes
  useEffect(() => {
    const playbackManager = props.playbackRef.current;
    if (playbackManager) {
      for (const instrument of playbackManager.InstrumentIdMapping.values()) {
        instrument.Volume = props.recordVol;
      }
    }
  }, [props.recordVol]);

  // Handle zoom changes
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (osmd && isLoaded) {
      osmd.zoom = props.zoom;
      osmd.render(); // update the OSMD instance after changing the zoom level
      const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
        renderPitchLineZoom(
          osmd,
          pitchState,
          props.zoom,
          instanceVariables.showingRep.current
        );
      pitchState.setPitchPositionX(updatedPitchPositionX);
      pitchState.setPitchPositionY(updatedPitchPositionY);
      pitchState.setRecordedNoteIndex(updatedNoteIndex);
      instanceVariables.zoom.current = props.zoom; // This forces LineChart to rerender
    }
  }, [props.zoom]);

  // Handle score repetitions during recording or practicing
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    let showingRep = instanceVariables.showingRep.current;
    const totalReps = instanceVariables.totalReps.current;

    if (showingRep < totalReps) {
      showingRep++;
    } else {
      showingRep = 0;
    }
    props.showRepeatsInfo(showingRep, totalReps);
    resetNotesColor(osmd);

    if (osmd?.graphic?.measureList) {
      let staves = osmd.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
        for (
          let note_index = 0;
          note_index < stave.staffEntries.length;
          note_index++
        ) {
          let note = stave.staffEntries[note_index];
          let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
          let noteNEWID = osmd.IDdict[noteID];

          // Check for notehead color
          const colorsArray = pitchState.colorNotes.slice();
          const index = colorsArray.findIndex(
            (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
          );

          if (index !== -1) {
            // Reset all note colors but quarter and whole notes
            const svgElement =
              note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
            svgElement.children[0].children[0].children[0].style.fill =
              colorsArray[index][0][1]; // Notehead
            if (
              svgElement &&
              svgElement.children[0] &&
              svgElement.children[0].children[0] &&
              svgElement.children[0].children[1]
            ) {
              // Reset quarter and whole notes colors
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // Notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorsArray[index][0][1]; // Notehead
            }
          }
        }
      }
    }
  }, [props.repeatsIterator]);

  // Handles automatic scroll while cursor is advancing
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    osmd.followCursor = props.followCursor;
  }, [props.followCursor]);

  // Handle pitch tracking while recording or practicing
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (props.startPitchTrack && osmd) {
      const lastXPitchIndex = pitchState.pitchPositionX.length - 1;

      // Add index to X coordinates to advance X-axis pitch tracker when new pitch arrives
      if (
        instanceVariables.notePositionX.current ===
        pitchState.pitchPositionX[lastXPitchIndex]
      ) {
        instanceVariables.index.current =
          instanceVariables.index.current + instanceVariables.spacing.current;
      } else {
        // Reset index
        instanceVariables.index.current = 0;
      }

      const lastPropsPitchIndex = props.pitch.length - 1;
      const lastPropsConfidenceIndex = props.pitchConfidence.length - 1;

      // Calculate the Y coordinate from the played note
      const newPitchMIDI = freq2midipitch(props.pitch[lastPropsPitchIndex]);

      // Determine location of played note with respect to middle staff line (B4)
      const midiToStaffStep = midi2StaffGaps(newPitchMIDI);
      if (
        midiToStaffStep === 0 ||
        props.pitchConfidence[lastPropsConfidenceIndex] < 0.5
      ) {
        // Don't show pitch line if confidence is less than 0.5
        instanceVariables.color.current = "#FFFFFF";
      } else {
        // Pitch line is visible
        instanceVariables.color.current = "#000000";
      }

      const staveLines =
        document.getElementsByClassName("vf-stave")[
          osmd.cursor.Iterator.currentMeasureIndex
        ];
      const upperLineStave = staveLines.children[0].getBoundingClientRect().top;
      const middleLineStave =
        staveLines.children[2].getBoundingClientRect().top;
      const lowerLineStave = staveLines.children[4].getBoundingClientRect().top;
      // Steps corresponding to one step in staff
      const oneStepPixels = Math.abs(upperLineStave - lowerLineStave) / 4 / 2;

      const noteStaffPositionY =
        middleLineStave + midiToStaffStep * oneStepPixels;

      // Add pitch to array and note identification data
      if (pitchState.currentGNoteinScorePitch) {
        const noteID = pitchState.currentGNoteinScorePitch.getSVGId();

        pitchState.setRecordedNoteIDs((prevState) => [...prevState, noteID]);
        pitchState.setRecordedNoteNEWIDs((prevState) => [
          ...prevState,
          osmd.IDdict[noteID],
        ]);
        pitchState.setRecordedNoteIndex((prevState) => [
          ...prevState,
          instanceVariables.index.current,
        ]);
        pitchState.setPitchData((prevState) => [
          ...prevState,
          props.pitch[lastPropsPitchIndex],
        ]);
        pitchState.setPitchConfidenceData((prevState) => [
          ...prevState,
          props.pitchConfidence[lastPropsConfidenceIndex],
        ]);
        pitchState.setPitchPositionX((prevState) => [
          ...prevState,
          instanceVariables.notePositionX.current,
        ]);
        pitchState.setPitchPositionY((prevState) => [
          ...prevState,
          noteStaffPositionY,
        ]);
        pitchState.setPitchColor((prevState) => [
          ...prevState,
          instanceVariables.color.current,
        ]);
        pitchState.setRepetitionNumber((prevState) => [
          ...prevState,
          instanceVariables.totalReps.current,
        ]);
      }
    }
  }, [props.startPitchTrack, props.pitch]);

  // Handle cursor reset
  useEffect(() => {
    const osmd = instanceVariables.osmd.current;
    if (props.isResetButtonPressed && osmd) {
      if (props.visual === "no") {
        pitchState.setColorNotes([]);
        pitchState.setRecordedNoteIDs([]);
        pitchState.setRecordedNoteNEWIDs([]);
        pitchState.setRecordedNoteIndex([]);
        pitchState.setPitchData([]);
        pitchState.setPitchPositionX([]);
        pitchState.setPitchPositionY([]);
        pitchState.setPitchColor([]);
        pitchState.setRepetitionNumber([]);

        resetNotesColor(osmd);

        instanceVariables.showingRep.current = 0;
        instanceVariables.totalReps.current = 0;
        instanceVariables.previousTimestamp.current = 0;

        props.showRepeatsInfo(0, 0);
        props.onResetDone();
      }
    } else {
      instanceVariables.showingRep.current = 0;

      if (osmd?.graphic?.measureList) {
        let staves = osmd.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            let note = stave.staffEntries[note_index];
            let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
            let noteNEWID = osmd.IDdict[noteID];
            // Check for notehead color
            const colorsArray = pitchState.colorNotes.slice();
            const index = colorsArray.findIndex(
              (item) => item[0][0] === noteNEWID && item[0][2] === 0
            );
            if (index !== -1) {
              // Update color for all notes but quarter and whole notes
              const svgElement =
                note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1];
              if (
                svgElement &&
                svgElement.children[0] &&
                svgElement.children[0].children[0] &&
                svgElement.children[0].children[1]
              ) {
                // Update color for quarter and whole notes
                svgElement.children[0].children[0].children[0].style.fill =
                  colorsArray[index][0][1];
                svgElement.children[0].children[1].children[0].style.fill =
                  colorsArray[index][0][1];
              }
            }
          }
        }
      }
      props.onResetDone();
    }
  }, [props.isResetButtonPressed]);

  return (
    <div>
      <div style={lineChartStyle}>
        <LineChart
          drawPitch={instanceVariables.drawPitch.current}
          width={instanceVariables.coords.current[0]}
          height={instanceVariables.coords.current[1]}
          zoom={instanceVariables.zoom.current}
          pitchColor={pitchState.pitchColor}
          pitchData={pitchState.pitchData}
          pitchDataPosX={pitchState.pitchPositionX}
          pitchDataPosY={pitchState.pitchPositionY}
          pitchIndex={pitchState.recordedNoteIndex}
          repetitionNumber={pitchState.repetitionNumber}
          showingRep={instanceVariables.showingRep.current}
        />
      </div>

      <div ref={divRef} />
    </div>
  );
};

export default OpenSheetMusicDisplay;
