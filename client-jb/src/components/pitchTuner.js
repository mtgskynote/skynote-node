import React, { useState } from "react";

// ---------  Constants  --------------------------//
//"\u266D" "\u266F"
const note_objects = [
    {note: "A", acc: " ", mistuning: 0}, 
    {note: "B", acc: "\u266D", mistuning: 0},
    {note: "B", acc: " ", mistuning: 0},
    {note: "C", acc: " ", mistuning: 0},
    {note: "C", acc: "\u266F", mistuning: 0},
    {note: "D", acc: " ", mistuning: 0},
    {note: "E", acc: "\u266D", mistuning: 0},
    {note: "E", acc: " ", mistuning: 0},
    {note: "F", acc: " ", mistuning: 0},
    {note: "F", acc: "\u266F", mistuning: 0},
    {note: "G", acc: " ", mistuning: 0},
    {note: "G", acc: "\u266F", mistuning: 0}
    ];

const freq2midipitch = (freq) => {
    return(12 * (Math.log2(freq / 440)) + 69)
}

const freq2note = (freq) => {
    let midif=freq2midipitch(freq)
    let noteint=Math.round(midif)
    let noteobj=note_objects[Math.round(midif-21)%12]
    noteobj.mistuning=midif-noteint
    return noteobj;
}
//=====================================================================================================


//=====================================================================================================
//              PieChart exported react component
//=====================================================================================================
//export function PitchTuner (m_width, m_height){
const PitchTuner = React.forwardRef(({
        m_width = 200,
        m_height = 200,
      }, ref) => {

    const [pval, setPVal] = useState({note: "E", acc:"\u266F", mistuning:.4});

     const setPitch = (freq, conf=0) => {
         let noteobj=freq2note(freq)
         if (conf<.6) {
            noteobj={note: "-", acc: "-", mistuning: 0}
         } 
         console.log(`Note:  ${pval.note}${pval.acc}, mistuning: ${pval.mistuning}`)
         setPVal(noteobj)
     }

     React.useImperativeHandle(ref, () => ({
        setPitch: setPitch
      }));

  return (
    <><div width={m_width} height={m_height}>
          Note:  {pval.note}{pval.acc}  <br />
       Fine Tuning <br />
      <input type="range" min="-.5" max=".5" step=".01" value={pval.mistuning} class="slider" id="myRange" />
      </div>
      </>
  );
});

export default PitchTuner;
