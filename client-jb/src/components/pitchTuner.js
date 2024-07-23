import React, { useState, useRef } from 'react';
import pitchTunerCSS from './pitchTuner.module.css';
import notesimg from '../assets/images/notes.png';

// ---------  Constants  --------------------------//
//"\u266D" "\u266F"
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
  noteobj.mistuning = midif - noteint;
  return noteobj;
};

//=====================================================================================================
//              PitchTuner exported react component
//=====================================================================================================
//export function PitchTuner (m_width, m_height){
var scrollval = 0;
const PitchTuner = React.forwardRef(
  ({ m_width = 200, m_height = 200 }, ref) => {
    const [pval, setPVal] = useState({
      note: 'E',
      acc: '\u266F',
      mistuning: 0.4,
    });
    // const textareaRef = useRef(null);
    const notesareaRef = useRef(null);

    const setPitch = (freq, conf = 0) => {
      let noteobj = freq2note(freq);
      if (conf < 0.75) {
        noteobj = { note: '-', acc: '-', mistuning: 0 };
        return; // don't move the pitch indicator if confidence is low
      }

      // console.log(`Note:  ${pval.note}${pval.acc}, mistuning: ${pval.mistuning}`)
      setPVal(noteobj);

      // Now update the graphical pitch indicator

      let graphcalNoteWidth = notesareaRef.current.scrollWidth / 36;
      let middleEb =
        notesareaRef.current.scrollWidth / 2 - 150 + graphcalNoteWidth / 2;

      let midif = freq2midipitch(freq); // floating point midif
      let fpdifference = midif - (Math.round((midif - 63) / 12) * 12 + 63); // floating point difference in semitones from nearest Eb, our middle note on the graphics
      // now convert semitones to pixels
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
      //console.log(`Note:  ${pval.note}${pval.acc}, is ${fpdifference} semitones from Eb`)
    };

    React.useImperativeHandle(ref, () => ({
      setPitch: setPitch,
    }));

    //   Note:  {pval.note}{pval.acc}  <br />
    //   Fine Tuning <br />
    //  <input   type="range" min="-.5" max=".5" step=".01" value={pval.mistuning} className="slider" id="myRange" />
    //  <br />
    //  <textarea ref={textareaRef} className={pitchTunerCSS.scrollableTextarea}  width="10em" >
    //    1 2 3 HEY This is a long scrollable text area.............................akjf;aljfdsajksdfkas;kdfjaksfaskfd;askfa;slkfaslkfa;lskdf;daslkf;alkjfdsalkjfdkjfds;akf;akfjdsakf;daskddkfj
    //  </textarea>

    return (
      <>
        <div
          className={pitchTunerCSS.myContainer}
          width={m_width}
          height={m_height}
        >
          <div className={pitchTunerCSS.vertical}></div>

          <br />
          <div ref={notesareaRef} className={pitchTunerCSS.notesareaDiv}>
            <img
              src={notesimg}
              alt="Unable to load :("
              className={pitchTunerCSS.scrollableNotesImage}
            ></img>
          </div>
        </div>
      </>
    );
  }
);

export default PitchTuner;
