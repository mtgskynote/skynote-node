import { useCallback } from "react";
import { freq2midipitch, midi2StaffGaps } from "../utils/osmdUtils";

const useRenderPitchLineZoom = () => {
  const renderPitchLineZoom = useCallback(
    (osmd, state, prevZoom, showingRep) => {
      // When zoom happens, coordinates X and Y of pitch tracking points have to be updated
      let staves = osmd.graphic.measureList;
      let copy_pitchPositionX = state.pitchPositionX.slice();
      let copy_pitchPositionY = state.pitchPositionY.slice();

      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
        const staveLines =
          document.getElementsByClassName("vf-stave")[stave_index];
        const upperLineStave =
          staveLines.children[0].getBoundingClientRect().top; // upper line
        const middleLineStave =
          staveLines.children[2].getBoundingClientRect().top; // middle line
        const lowerLineStave =
          staveLines.children[4].getBoundingClientRect().top; // lower line
        const oneStepPixels = Math.abs(upperLineStave - lowerLineStave) / 4 / 2; // steps corresponding to one step in staff

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
          // check for notehead color
          const colorsArray = state.colorNotes.slice();
          const index = colorsArray.findIndex(
            (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
          );
          if (index !== -1) {
            // note has a color assigned --> color notehead
            // this is for all the notes except the quarter and whole notes
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
              // this is for all the quarter and whole notes
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
            }
          }
          // check for pitch tracking line
          for (let index = 0; index < copy_pitchPositionX.length; index++) {
            if (state.recordedNoteIDs[index] === noteID) {
              // this note has been recorded
              let midiToStaffStep = midi2StaffGaps(
                freq2midipitch(state.pitchData[index])
              );
              copy_pitchPositionX[index] = noteX;
              copy_pitchPositionY[index] =
                middleLineStave + midiToStaffStep * oneStepPixels;
            }
          }
        }
      }
      let copy_recordedNoteIndex = state.recordedNoteIndex.slice();
      copy_recordedNoteIndex = copy_recordedNoteIndex.map(
        (item) => (item * osmd.zoom) / prevZoom
      );
      return [copy_pitchPositionX, copy_pitchPositionY, copy_recordedNoteIndex];
    },
    []
  );

  return { renderPitchLineZoom };
};

export default useRenderPitchLineZoom;
