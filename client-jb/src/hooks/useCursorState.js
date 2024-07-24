import { useState } from "react";

const useCursorState = () => {
  const [initialCursorTop, setInitialCursorTop] = useState(0);
  const [initialCursorLeft, setInitialCursorLeft] = useState(0);
  const [currentGNoteinScorePitch, setCurrentGNoteinScorePitch] =
    useState(null);

  return {
    initialCursorTop,
    setInitialCursorTop,
    initialCursorLeft,
    setInitialCursorLeft,
    currentGNoteinScorePitch,
    setCurrentGNoteinScorePitch,
  };
};

export default useCursorState;
