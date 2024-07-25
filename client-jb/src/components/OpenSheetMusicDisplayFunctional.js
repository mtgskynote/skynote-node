import React, { useRef, useEffect, useState, useCallback } from "react";
import usePitchState from "../hooks/usePitchState";
import useCursorState from "../hooks/useCursorState";
import useInstanceVariables from "../hooks/useInstanceVariables";
import useOsmdSetup from "../hooks/useOsmdSetup";
import { freq2midipitch } from "../utils/osmdUtils";
import useRenderPitchLineZoom from "../hooks/useRenderPitchLineZoom";

const OpenSheetMusicDisplay = (props) => {
  const pitchState = usePitchState();
  const cursorState = useCursorState();
  const instanceVariables = useInstanceVariables(props);
  const [scrolled, setScrolled] = useState(false);

  const osmd = instanceVariables.osmd;

  const divRef = useRef(null);
  const playbackRef = props.playbackRef;

  // State for initial cursor position
  const [initialCursorTop, setInitialCursorTop] = useState(0);
  const [initialCursorLeft, setInitialCursorLeft] = useState(0);

  const setupOsmd = useOsmdSetup(props, instanceVariables, divRef);
  const { renderPitchLineZoom } = useRenderPitchLineZoom();

  // Update metronome volume
  const updateMetronomeVolume = useCallback(
    (newVolume) => {
      if (osmd.current && osmd.current.PlaybackManager) {
        osmd.current.PlaybackManager.Metronome.Volume = newVolume;
      }
    },
    [osmd]
  );

  // Update BPM value
  const updateBpm = useCallback(
    (newBpm) => {
      if (osmd.current && osmd.current.PlaybackManager) {
        osmd.current.PlaybackManager.setBpm(newBpm);
        const sourceMeasures = osmd.current.Sheet.SourceMeasures;
        for (let i = 0; i < sourceMeasures.length; i++) {
          sourceMeasures[i].TempoInBPM = newBpm;
        }
      }
    },
    [osmd]
  );

  // INSERT COMMENT
  const resetNotesColor = () => {
    const colorBlack = "#000000"; // black color
    let svgContainer = this.osmd.container;
    let svgElements = svgContainer.getElementsByTagName("svg");

    // Iterate through each note
    for (var i = 0; i < svgElements.length; i++) {
      let svgElement = svgElements[i];
      let noteheads = svgElement.getElementsByClassName("vf-notehead");
      for (let j = 0; j < noteheads.length; j++) {
        let notehead = noteheads[j];
        let path = notehead.querySelector("path");
        path.setAttribute("style", "fill: " + colorBlack + " !important");
      }
    }
  };

  // Cleanup function to replace componentWillUnmount
  useEffect(() => {
    return () => {
      const playbackManager = playbackRef.current;
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

      window.removeEventListener("resize", resize);
    };
  }, [playbackRef, instanceVariables.cursorInterval]);

  // INSERT COMMENT
  const checkCursorChange = useCallback(() => {
    const cursorCurrent =
      osmd.current.cursor.Iterator.currentTimeStamp.RealValue;
    console.log("CURSOR POSITION:", cursorCurrent);

    const checkCursorEnd = () => {
      if (instanceVariables.selectionEndReached.current) {
        props.cursorActivity(true);
        instanceVariables.previousTimestamp.current = null;
        instanceVariables.selectionEndReached.current = false;
      }
    };

    const updateVisualMode = (cursorCurrent) => {
      if (
        instanceVariables.previousTimestamp.current !== null &&
        props.visual === "yes" &&
        instanceVariables.previousTimestamp.current > cursorCurrent &&
        instanceVariables.playbackManager.current.isPlaying
      ) {
        if (
          instanceVariables.showingRep.current <
          instanceVariables.totalReps.current
        ) {
          instanceVariables.showingRep.current++;
        } else {
          instanceVariables.showingRep.current = 0;
        }
        props.showRepeatsInfo(
          instanceVariables.showingRep.current,
          instanceVariables.totalReps.current
        );

        const staves = osmd.current.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            let note = stave.staffEntries[note_index];
            let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
            let noteNEWID = osmd.current.IDdict[noteID];
            const colorsArray = [...pitchState.colorNotes];
            const index = colorsArray.findIndex(
              (item) =>
                item[0][0] === noteNEWID &&
                item[0][2] === instanceVariables.showingRep.current
            );
            if (index !== -1) {
              const svgElement =
                note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1];
              if (svgElement.children[0].children[1]) {
                svgElement.children[0].children[1].children[0].style.fill =
                  colorsArray[index][0][1];
              }
            }
          }
        }
        props.cursorJumpsBack();
      }
    };

    const extractNotePosition = (gNote) => {
      const svgElement = gNote.getSVGGElement();
      if (
        svgElement &&
        svgElement.children[0] &&
        svgElement.children[0].children[0] &&
        svgElement.children[0].children[1]
      ) {
        const notePos =
          svgElement.children[0].children[1].children[0].getBoundingClientRect();
        instanceVariables.notePositionX.current = notePos.x;
        instanceVariables.notePositionY.current = notePos.y;
      } else {
        const notePos =
          svgElement.children[0].children[0].children[0].getBoundingClientRect();
        instanceVariables.notePositionX.current = notePos.x;
        instanceVariables.notePositionY.current = notePos.y;
      }
    };

    const updateNoteColors = (
      gNote,
      lastPitchData,
      lastPitchConfidenceData
    ) => {
      const colorPitchMatched = "#00FF00";
      const colorPitchNotMatched = "#FF0000";
      let notePitch;

      if (osmd.current.cursor.NotesUnderCursor()[0].Pitch !== undefined) {
        notePitch = osmd.current.cursor.NotesUnderCursor()[0].Pitch.frequency;
        if (lastPitchConfidenceData >= 0.5) {
          if (
            lastPitchData !== undefined &&
            Math.abs(
              freq2midipitch(lastPitchData) - freq2midipitch(notePitch)
            ) <= 0.25
          ) {
            instanceVariables.countGoodNotes.current += 1;
          } else {
            instanceVariables.countBadNotes.current += 1;
          }
        }
      } else {
        notePitch = 0;
        if (lastPitchConfidenceData <= 0.5) {
          instanceVariables.countGoodNotes.current += 1;
        } else {
          instanceVariables.countBadNotes.current += 1;
        }
      }

      const total =
        instanceVariables.countBadNotes.current +
        instanceVariables.countGoodNotes.current;
      if (
        total !== 0 &&
        instanceVariables.countGoodNotes.current >= Math.ceil(total * 0.5)
      ) {
        instanceVariables.noteColor.current = colorPitchMatched;
      } else if (
        total !== 0 &&
        instanceVariables.countGoodNotes.current < Math.ceil(total * 0.5)
      ) {
        instanceVariables.noteColor.current = colorPitchNotMatched;
      }

      if (pitchState.currentGNoteinScorePitch) {
        const noteID =
          osmd.current.IDdict[pitchState.currentGNoteinScorePitch.getSVGId()];
        const colorsArray = pitchState.colorNotes.slice();
        const index = colorsArray.findIndex(
          (item) =>
            item[0][0] === noteID &&
            item[0][2] === instanceVariables.totalReps.current
        );
        if (index !== -1) {
          colorsArray[index][0][1] = instanceVariables.noteColor.current;
        } else {
          colorsArray.push([
            [
              noteID,
              instanceVariables.noteColor.current,
              instanceVariables.totalReps.current,
            ],
          ]);
        }
        pitchState.setColorNotes(colorsArray);

        const svgElement = pitchState.currentGNoteinScorePitch.getSVGGElement();
        svgElement.children[0].children[0].children[0].style.fill =
          instanceVariables.noteColor.current;
        if (
          svgElement &&
          svgElement.children[0] &&
          svgElement.children[0].children[0] &&
          svgElement.children[0].children[1]
        ) {
          svgElement.children[0].children[0].children[0].style.fill =
            instanceVariables.noteColor.current;
          svgElement.children[0].children[1].children[0].style.fill =
            instanceVariables.noteColor.current;
        }
      }

      if (gNote !== pitchState.currentGNoteinScorePitch) {
        instanceVariables.countBadNotes.current = 0;
        instanceVariables.countGoodNotes.current = 0;
        instanceVariables.noteColor.current = "#000000";
      }
      pitchState.setCurrentGNoteinScorePitch(gNote);
    };

    const handleRecording = () => {
      if (props.startPitchTrack) {
        if (instanceVariables.previousTimestamp.current > cursorCurrent) {
          instanceVariables.totalReps.current += 1;
          instanceVariables.showingRep.current =
            instanceVariables.totalReps.current;
          resetNotesColor();
        }

        const gNote = osmd.current.cursor.GNotesUnderCursor()[0];
        extractNotePosition(gNote);

        const lastPitchData =
          pitchState.pitchData[pitchState.pitchData.length - 1];
        const lastPitchConfidenceData =
          pitchState.pitchConfidenceData[
            pitchState.pitchConfidenceData.length - 1
          ];

        updateNoteColors(gNote, lastPitchData, lastPitchConfidenceData);
      }
    };

    checkCursorEnd();
    updateVisualMode(cursorCurrent);
    handleRecording();

    instanceVariables.previousTimestamp.current = cursorCurrent;
  }, [
    instanceVariables,
    pitchState,
    props.cursorActivity,
    props.cursorJumpsBack,
    props.showRepeatsInfo,
    props.startPitchTrack,
    resetNotesColor,
  ]);

  // Handle cursor color based on current mode
  useEffect(() => {
    if (osmd.current) {
      if (props.mode) {
        osmd.current.cursor.CursorOptions.color = "#4ade80"; // Practice mode
      } else {
        osmd.current.cursor.CursorOptions.color = "#f87171"; // Record mode
      }
      osmd.current.render();
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
    osmd.load(props.file).then(() => osmd.render());
  }, [props.file]);

  // Handle downloading a recording
  useEffect(() => {
    if (props.canDownload) {
      let numStars;
      const colorNotes = usePitchState.colorNotes.slice();
      if (instanceVariables.calculatePunctuation === true) {
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
        instanceVariables.calculatePunctuation = false;
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
    const json = props.visualJSON;
    //update values:
    usePitchState.setColorNotes(json.noteColors);
    usePitchState.setRecordedNoteNEWIDs(json.noteNEWIDs);
    usePitchState.setRecordedNoteIndex(json.noteIndex);
    usePitchState.setPitchData(json.pitchTrackPoints);
    usePitchState.setPitchColor(json.pitchPointColor);
    usePitchState.setRepetitionNumber(json.repetitionNumber);
    instanceVariables.showingRep = 0;
    instanceVariables.totalReps = Math.max(...json.repetitionNumber);

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
        const oneStepPixels = Math.abs(upperLineStave - lowerLineStave) / 4 / 2; //steps corresponding to one step in staff
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
              item[0][2] === instanceVariables.showingRep
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

    usePitchState.setPitchPositionX(copy_pitchPositionX);
    usePitchState.setPitchPositionY(copy_pitchPositionY);
  }, [props.visualJSON]);

  // Get initial page coordinates for pitch tracking line on first page load
  useEffect(() => {
    const container = document.getElementById("osmdSvgPage1");
    if (container) {
      instanceVariables.coords = [
        container.getBoundingClientRect().width,
        container.getBoundingClientRect().height,
      ];
    }
  }, []);

  // Handle new pitch line coordinates when page is scrolled
  useEffect(() => {
    if (scrolled) {
      setScrolled(false); // Reset the scrolled flag

      if (osmd.current?.graphic?.measureList) {
        const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
          renderPitchLineZoom(
            osmd.current,
            props.state,
            props.zoom,
            props.showingRep
          );

        setPitchPositionX(updatedPitchPositionX);
        setPitchPositionY(updatedPitchPositionY);
        setRecordedNoteIndex(updatedNoteIndex);
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
    osmd.zoom = props.zoom;
    osmd.render(); // update the OSMD instance after changing the zoom level
    const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
      renderPitchLineZoom(
        osmd,
        pitchState,
        props.zoom,
        instanceVariables.showingRep
      );
    pitchState.setPitchPositionX(updatedPitchPositionX);
    pitchState.setPitchPositionY(updatedPitchPositionY);
    pitchState.setRecordedNoteIndex(updatedNoteIndex);
    instanceVariables.zoom = props.zoom; // This forces LineChart to rerender
  }, [props.zoom]);

  // Handle score repetitions during recording or practicing
  useEffect(() => {
    let showingRep = instanceVariables.showingRep;
    const totalReps = instanceVariables.totalReps;

    if (showingRep < totalReps) {
      showingRep++;
    } else {
      showingRep = 0;
    }
    props.showRepeatsInfo(showingRep, totalReps);
    resetNotesColor();

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
  }, [props.repeatsIterator]);

  // Handles automatic scroll while cursor is advancing
  useEffect(() => {
    osmd.followCursor = props.followCursor;
  }, [props.followCursor]);

  useEffect(() => {
    if (props.startPitchTrack) {
      const lastXPitchIndex = pitchState.pitchPositionX.length - 1;

      // Add index to X coordinates to advance X-axis pitch tracker when new pitch arrives
      if (
        instanceVariables.notePositionX ===
        pitchState.pitchPositionX[lastXPitchIndex]
      ) {
        instanceVariables.index =
          instanceVariables.index + instanceVariables.spacing;
      } else {
        // Reset index
        instanceVariables.index = 0;
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
        instanceVariables.color = "#FFFFFF";
      } else {
        // Pitch line is visible
        instanceVariables.color = "#000000";
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

        setRecordedNoteIDs((prevState) => [...prevState, noteID]);
        setRecordedNoteNEWIDs((prevState) => [
          ...prevState,
          osmd.IDdict[noteID],
        ]);
        setRecordedNoteIndex((prevState) => [
          ...prevState,
          instanceVariables.index,
        ]);
        setPitchData((prevState) => [
          ...prevState,
          props.pitch[lastPropsPitchIndex],
        ]);
        setPitchConfidenceData((prevState) => [
          ...prevState,
          props.pitchConfidence[lastPropsConfidenceIndex],
        ]);
        setPitchPositionX((prevState) => [
          ...prevState,
          instanceVariables.notePositionX,
        ]);
        setPitchPositionY((prevState) => [...prevState, noteStaffPositionY]);
        setPitchColor((prevState) => [...prevState, instanceVariables.color]);
        setRepetitionNumber((prevState) => [
          ...prevState,
          instanceVariables.totalReps,
        ]);
      }
    }
  }, [props.startPitchTrack, props.pitch]);

  // Handle cursor reset
  useEffect(() => {
    if (props.isResetButtonPressed) {
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

        resetNotesColor();

        instanceVariables.showingRep = 0;
        instanceVariables.totalReps = 0;
        instanceVariables.previousTimestamp = 0;

        props.showRepeatsInfo(0, 0);
        props.onResetDone();
      }
    } else {
      instanceVariables.showingRep = 0;

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
      props.onResetDone();
    }
  }, [props.isResetButtonPressed]);

  return <div ref={divRef}>{/* Render the component UI here */}</div>;
};

export default OpenSheetMusicDisplay;
