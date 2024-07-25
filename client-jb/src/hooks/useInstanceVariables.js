import { useRef } from "react";

const useInstanceVariables = (props) => {
  const osmd = useRef(undefined);
  const cursorInterval = useRef(null);
  const previousTimestamp = useRef(null);
  const notePositionX = useRef(null);
  const notePositionY = useRef(null);
  const noteColor = useRef(null);
  const index = useRef(null);
  const spacing = useRef(4);
  const countGoodNotes = useRef(0);
  const countBadNotes = useRef(0);
  const coords = useRef([0, 0]);
  const color = useRef("black");
  const zoom = useRef(props.zoom);
  const drawPitch = useRef(props.drawPitch);
  const totalReps = useRef(0);
  const showingRep = useRef(0);
  const selectionEndReached = useRef(false);
  const calculatePunctuation = useRef(false);
  const playbackManager = useRef(null);

  return {
    osmd,
    cursorInterval,
    previousTimestamp,
    notePositionX,
    notePositionY,
    noteColor,
    index,
    spacing,
    countGoodNotes,
    countBadNotes,
    coords,
    color,
    zoom,
    drawPitch,
    totalReps,
    showingRep,
    selectionEndReached,
    calculatePunctuation,
  };
};

export default useInstanceVariables;
