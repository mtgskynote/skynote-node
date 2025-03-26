import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import notesimg from '../../assets/images/notes.png';

const note_objects = [
  { note: 'A', acc: ' ', mistuning: 0 },
  { note: 'B', acc: '\u266D', mistuning: 0 },
  { note: 'B', acc: ' ', mistuning: 0 },
  { note: 'C', acc: ' ', mistuning: 0 },
  { note: 'C', acc: '\u266F', mistuning: 0 },
  { note: 'D', acc: ' ', mistuning: 0 },
  { note: 'E', acc: '\u266D', mistuning: 0 },
  { note: 'E', acc: ' ', mistuning: 0 },
  { note: 'F', acc: ' ', mistuning: 0 },
  { note: 'F', acc: '\u266F', mistuning: 0 },
  { note: 'G', acc: ' ', mistuning: 0 },
  { note: 'G', acc: '\u266F', mistuning: 0 },
];

const freq2midipitch = (freq) => {
  return 12 * Math.log2(freq / 440) + 69;
};

const freq2note = (freq) => {
  let midif = freq2midipitch(freq);
  let noteint = Math.round(midif);
  let noteobj = note_objects[Math.round(midif - 21) % 12];
  if (noteobj) {
    noteobj.mistuning = midif - noteint;
  }
  return noteobj;
};

var scrollval = 0;
const PitchTuner = React.forwardRef(
  ({ m_width = 200, m_height = 200 }, ref) => {
    const [, setPVal] = useState({
      note: 'E',
      acc: '\u266F',
      mistuning: 0.4,
    });
    const notesareaRef = useRef(null);

    const setPitch = (freq, conf = 0) => {
      let noteobj = freq2note(freq);
      if (conf < 0.75) {
        noteobj = { note: '-', acc: '-', mistuning: 0 };
        return; // don't move the pitch indicator if confidence is low
      }

      setPVal(noteobj);

      let graphcalNoteWidth = notesareaRef.current.scrollWidth / 36;
      let middleEb =
        notesareaRef.current.scrollWidth / 2 - 150 + graphcalNoteWidth / 2;

      let midif = freq2midipitch(freq); // floating point midif
      let fpdifference = midif - (Math.round((midif - 63) / 12) * 12 + 63); // floating point difference in semitones from nearest Eb, our middle note on the graphics
      scrollval = middleEb + fpdifference * graphcalNoteWidth;

      if (
        Math.abs(notesareaRef.current.scrollLeft - scrollval) >
        graphcalNoteWidth * 2
      ) {
        notesareaRef.current.scrollTo({
          left: scrollval,
          behavior: 'instant',
        });
      }
      notesareaRef.current.scrollLeft = scrollval;
    };

    React.useImperativeHandle(ref, () => ({
      setPitch: setPitch,
    }));

    return (
      <div className="w-full max-w-[400px] mx-auto p-6">
        {/* <h2 className="text-center text-xl font-semibold mb-4 text-gray-700">
          Pitch Tuner
        </h2> */}

        {/* Vertical pitch indicator */}
        <div className="relative flex items-center justify-center h-6 mb-2">
          <div className="absolute w-1 h-6 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full shadow-md" />
        </div>

        {/* Notes scroll area */}
        <div
          ref={notesareaRef}
          className="overflow-x-auto no-scrollbar border border-gray-200 rounded-xl shadow-inner bg-white"
        >
          <img src={notesimg} alt="Pitch notes" className="w-[1200px] h-auto" />
        </div>
      </div>
    );
  }
);

PitchTuner.displayName = 'PitchTuner';

PitchTuner.propTypes = {
  m_width: PropTypes.number,
  m_height: PropTypes.number,
};

export default PitchTuner;
