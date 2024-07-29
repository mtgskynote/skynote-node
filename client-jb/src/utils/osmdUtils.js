// INSERT COMMENT
const freq2midipitch = (freq) => {
  return 12 * Math.log2(freq / 440) + 69;
};

// INSERT COMMENT
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

// INSERT COMMENT
const resetNotesColor = (osmd) => {
  const colorBlack = "#000000";
  let svgContainer = osmd.container;
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

export { freq2midipitch, midi2StaffGaps, resetNotesColor };
