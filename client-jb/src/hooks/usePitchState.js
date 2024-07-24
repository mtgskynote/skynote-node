import { useState } from "react";

export const usePitchState = () => {
  const [pitchColor, setPitchColor] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [pitchConfidenceData, setPitchConfidenceData] = useState([]);
  const [pitchPositionX, setPitchPositionX] = useState([]);
  const [pitchPositionY, setPitchPositionY] = useState([]);
  const [recordedNoteIndex, setRecordedNoteIndex] = useState([]);
  const [repetitionNumber, setRepetitionNumber] = useState([]);
  const [recordedNoteIDs, setRecordedNoteIDs] = useState([]);
  const [recordedNoteNEWIDs, setRecordedNoteNEWIDs] = useState([]);

  return {
    pitchColor,
    setPitchColor,
    pitchData,
    setPitchData,
    pitchConfidenceData,
    setPitchConfidenceData,
    pitchPositionX,
    setPitchPositionX,
    pitchPositionY,
    setPitchPositionY,
    recordedNoteIndex,
    setRecordedNoteIndex,
    repetitionNumber,
    setRepetitionNumber,
    recordedNoteIDs,
    setRecordedNoteIDs,
    recordedNoteNEWIDs,
    setRecordedNoteNEWIDs,
  };
};
