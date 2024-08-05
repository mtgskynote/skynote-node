import { useCallback } from "react";

const useAssociateNoteIds = () => {
  return useCallback((osmd) => {
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
          const ourID = "noteId_" + String(stave_index) + String(note_index);
          // console.log(ourID);
          IDdictionary[noteID] = ourID;
          IDInverseDictionary[ourID] = noteID;
        }
      }
    }
    return [IDdictionary, IDInverseDictionary];
  }, []);
};

export default useAssociateNoteIds;
