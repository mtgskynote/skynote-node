const freq2midipitch = (freq) => {
  return 12 * Math.log2(freq / 440) + 69;
};

//Convert MIDI to pixel offset, B4 being 0 (middle line of the staff)
const midi2StaffGaps = (playedNoteMidi) => {
  // Create a mapping of MIDI note values to staff offsets
  const midiToStaffMapping = {
    // Define mappings for specific MIDI notes
    48: 13, // C3
    49: 12.5, // C#3
    50: 12, // D3
    51: 11.5, // D#3
    52: 11, // E3
    53: 10, // F3
    54: 9.5, // F#3
    55: 9, // G3
    56: 8.5, // G#3
    57: 8, // A3
    58: 7.5, // A#3
    59: 7, // B3
    60: 6, // C4
    61: 5.5, // C#4
    62: 5, // D4
    63: 4.5, // D#4
    64: 4, // E4
    65: 3, // F4
    66: 2.5, // F#4
    67: 2, // G4
    68: 1.5, // G#4
    69: 1, // A4
    70: 0.5, // A#4
    71: 0, // B4 --> middle line of the staff
    72: -1, //C5
    73: -1.5, //C#5
    74: -2, //D5
    75: -2.5, //D#5
    76: -3, //E5
    77: -4, //F5
    78: -4.5, //F#5
    79: -5, //G5
    80: -5.5, //G#5
    81: -6, //A5
    82: -6.5, //A#5
    83: -7, //B5
    84: -8, //C6
  };
  const playedNoteMidiINT = Math.floor(playedNoteMidi); //integer part of playedNoteMidi
  const playedNoteMidiDECIMAL = playedNoteMidi - playedNoteMidiINT; //decimal part of playedNoteMidi

  //Assign to staff positions according to dictionary
  const noteStaffINT = midiToStaffMapping[playedNoteMidiINT]; //integer part of staff step
  const noteStaffDiff = Math.abs(
    midiToStaffMapping[playedNoteMidiINT + 1] - noteStaffINT
  ); //difference in staff step with consecutive
  const noteStaffDECIMAL = playedNoteMidiDECIMAL * noteStaffDiff; //map decimal part to the step with consecutive

  let result;
  if (noteStaffINT - noteStaffDECIMAL) {
    result = noteStaffINT - noteStaffDECIMAL;
  } else {
    result = 0; //FIXME, value 0 so it keeps in middle line of staff, but other solution required (change its color)
  }
  return result;
};

const generateNoteIDsAssociation = (osmd) => {
  //function that generates an association between the noteIDs of SVGElements of current render/osmd page,
  //with our-own-generated IDs(noteID_"measureindex"noteindex")
  let IDdictionary = {};
  let IDInverseDictionary = {};
  if (osmd.graphic.measureList) {
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
        const ourID = 'noteId_' + String(stave_index) + String(note_index);
        IDdictionary[noteID] = ourID; //dict[auto-ID]=our-ID
        IDInverseDictionary[ourID] = noteID; // the inverse dict[our_ID]=auto-ID
      }
    }
    return [IDdictionary, IDInverseDictionary];
  }
};

const renderPitchLineZoom = (osmd, state, prevZoom, showingRep) => {
  //When zoom happens, coordinates X and Y of pitch tracking points have to be updated
  let staves = osmd.graphic.measureList;
  let copy_pitchPositionX = state.pitchPositionX.slice();
  let copy_pitchPositionY = state.pitchPositionY.slice();
  for (let stave_index = 0; stave_index < staves.length; stave_index++) {
    let stave = staves[stave_index][0];
    const staveLines = document.getElementsByClassName('vf-stave')[stave_index];
    const upperLineStave = staveLines.children[0].getBoundingClientRect().top; //upper line
    const middleLineStave = staveLines.children[2].getBoundingClientRect().top; //middle line
    const lowerLineStave = staveLines.children[4].getBoundingClientRect().top; //lower line
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
      //check for notehead color
      const colorsArray = state.colorNotes.slice();
      const index = colorsArray.findIndex(
        (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
      );
      if (index !== -1) {
        //note has a color assigned--> color notehead
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
          //this is for all the quarter and whole notes
          svgElement.children[0].children[0].children[0].style.fill =
            colorsArray[index][0][1]; // notehead
          svgElement.children[0].children[1].children[0].style.fill =
            colorsArray[index][0][1]; // notehead
        }
      }
      //check for pitch tracking line
      for (let index = 0; index < copy_pitchPositionX.length; index++) {
        if (state.recordedNoteIDs[index] === noteID) {
          //this note has been recorded
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
};

const setNoteColor = (osmd, colorsArray, stave, noteIndex, showingRep) => {
  let note = stave.staffEntries[noteIndex];
  let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
  let noteNEWID = osmd.IDdict[noteID];
  let noteX = note.graphicalVoiceEntries[0].notes[0]
    .getSVGGElement()
    .getBoundingClientRect().x;

  // Check for notehead color
  const colorIndex = colorsArray.findIndex((item) => {
    return item[0][0] === noteNEWID && item[0][2] === showingRep;
  });
  // COLOR INDEX IS -1??
  if (colorIndex !== -1) {
    // Note has a color assigned --> color notehead
    // This is for all the notes except the quarter and whole notes
    const svgElement = note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
    svgElement.children[0].children[0].children[0].style.fill =
      colorsArray[colorIndex][0][1]; // notehead
    if (
      svgElement &&
      svgElement.children[0] &&
      svgElement.children[0].children[0] &&
      svgElement.children[0].children[1]
    ) {
      svgElement.children[0].children[0].children[0].style.fill =
        colorsArray[colorIndex][0][1]; // notehead
      svgElement.children[0].children[1].children[0].style.fill =
        colorsArray[colorIndex][0][1]; // notehead
    }
  }
  return [noteX, noteID];
};

export {
  freq2midipitch,
  midi2StaffGaps,
  generateNoteIDsAssociation,
  renderPitchLineZoom,
  setNoteColor,
};
