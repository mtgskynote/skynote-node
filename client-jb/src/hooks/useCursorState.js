import { useState } from "react";

const useCursorState = () => {
  const [initialCursorTop, setInitialCursorTop] = useState(0);
  const [initialCursorLeft, setInitialCursorLeft] = useState(0);

  return {
    initialCursorTop,
    setInitialCursorTop,
    initialCursorLeft,
    setInitialCursorLeft,
  };
};

export default useCursorState;
