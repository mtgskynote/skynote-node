import { useRef, useCallback } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import useAssociateNoteIds from "./useAssociateNoteIds";
import usePlaybackOsmd from "./usePlaybackOsmd";

const useOsmdSetup = (props, instanceVariables, divRef) => {
  const generateNoteIdsAssociation = useAssociateNoteIds();
  const playbackOsmd = usePlaybackOsmd(props);
  const playbackManagerRef = useRef(null);

  const setupOptions = useCallback(() => {
    return {
      autoResize: props.autoResize !== undefined ? props.autoResize : true,
      drawTitle: props.drawTitle !== undefined ? props.drawTitle : true,
      followCursor:
        props.followCursor !== undefined ? props.followCursor : true,
    };
  }, [props.autoResize, props.drawTitle, props.followCursor]);

  const initializeOsmd = useCallback(
    (osmdInstance) => {
      osmdInstance.render();
      osmdInstance.cursor.CursorOptions.color = "#4ade80";
      osmdInstance.render();
      const cursor = osmdInstance.cursor;
      props.cursorRef.current = cursor;
      cursor.show();
      setInitialCursorTop(cursor.cursorElement.style.top);
      setInitialCursorLeft(cursor.cursorElement.style.left);
    },
    [props.cursorRef]
  );

  const setupPlayback = useCallback(
    (osmdInstance) => {
      osmdInstance.zoom = props.zoom;
      const playbackControl = playbackOsmd(osmdInstance);
      playbackControl.initialize();
      props.playbackRef.current = playbackManagerRef.current;

      if (props.visual === "yes") {
        osmdInstance.cursor.CursorOptions.color = "#dde172";
        osmdInstance.render();
      }
      [osmdInstance.IDdict, osmdInstance.IDInvDict] =
        generateNoteIdsAssociation(osmdInstance);
    },
    [props.zoom, props.visual, playbackOsmd, generateNoteIdsAssociation]
  );

  const setupCursorInterval = useCallback(() => {
    instanceVariables.cursorInterval.current = setInterval(() => {
      // Check cursor change logic here
    }, 200);
  }, [instanceVariables.cursorInterval]);

  const setupOsmd = useCallback(() => {
    const options = setupOptions();
    const osmdInstance = new OSMD(divRef.current, options);
    instanceVariables.osmd.current = osmdInstance;

    osmdInstance.load(props.file).then(() => {
      if (osmdInstance.Sheet) {
        initializeOsmd(osmdInstance);
        setupPlayback(osmdInstance);
        setupCursorInterval();
      }
    });
  }, [
    setupOptions,
    initializeOsmd,
    setupPlayback,
    setupCursorInterval,
    instanceVariables.osmd,
    props.file,
  ]);

  return setupOsmd;
};

export default useOsmdSetup;
