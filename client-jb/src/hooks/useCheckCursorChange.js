import { useEffect, useRef } from "react";
import { freq2midipitch } from "../utils/osmdUtils";

const useCheckCursorChange = (
  osmdInstance,
  props,
  instanceVariables,
  pitchState,
  resetNotesColor
) => {
  const previousTimestamp = useRef(instanceVariables.previousTimestamp.current);

  useEffect(() => {
    if (!osmdInstance) return;

    const cursorCurrent =
      osmdInstance.cursor.Iterator.currentTimeStamp.RealValue;

    const updateVisualMode = () => {
      if (
        previousTimestamp.current !== null &&
        props.visual === "yes" &&
        previousTimestamp.current > cursorCurrent &&
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

        const staves = osmdInstance.current.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            let note = stave.staffEntries[note_index];
            let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
            let noteNEWID = osmdInstance.current.IDdict[noteID];
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

    updateVisualMode();
    previousTimestamp.current = cursorCurrent;
  }, [
    props.visual,
    osmdInstance.cursor.Iterator.currentTimeStamp.RealValue,
    instanceVariables.playbackManager.current.isPlaying,
  ]);

  useEffect(() => {
    if (!osmdInstance || !props.startPitchTrack) return;

    const cursorCurrent =
      osmdInstance.cursor.Iterator.currentTimeStamp.RealValue;

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

      if (osmdInstance.cursor.NotesUnderCursor()[0].Pitch !== undefined) {
        notePitch = osmdInstance.cursor.NotesUnderCursor()[0].Pitch.frequency;
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
          osmdInstance.current.IDdict[
            pitchState.currentGNoteinScorePitch.getSVGId()
          ];
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
      if (instanceVariables.previousTimestamp.current > cursorCurrent) {
        instanceVariables.totalReps.current += 1;
        instanceVariables.showingRep.current =
          instanceVariables.totalReps.current;
        resetNotesColor(osmdInstance);
      }

      const gNote = osmdInstance.cursor.GNotesUnderCursor()[0];
      extractNotePosition(gNote);

      const lastPitchData =
        pitchState.pitchData[pitchState.pitchData.length - 1];
      const lastPitchConfidenceData =
        pitchState.pitchConfidenceData[
          pitchState.pitchConfidenceData.length - 1
        ];

      updateNoteColors(gNote, lastPitchData, lastPitchConfidenceData);
    };

    handleRecording();
    previousTimestamp.current = cursorCurrent;
  }, [
    osmdInstance,
    props.startPitchTrack,
    pitchState.pitchData,
    pitchState.pitchConfidenceData,
  ]);
};

export default useCheckCursorChange;
