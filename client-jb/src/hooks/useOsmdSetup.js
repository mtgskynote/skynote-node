import { useCallback } from "react";
import { OpenSheetMusicDisplay as OSMD } from "opensheetmusicdisplay";
import useAssociateNoteIds from "./useAssociateNoteIds";
import useOsmdPlayback from "./useOsmdPlayback";

const useOsmdSetup = (
  props,
  instanceVariables,
  divRef,
  pitchState,
  cursorState,
  setIsLoaded
) => {
  const generateNoteIdsAssociation = useAssociateNoteIds();
  const playbackOsmd = useOsmdPlayback(props);

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
      cursorState.setInitialCursorTop(cursor.cursorElement.style.top);
      cursorState.setInitialCursorLeft(cursor.cursorElement.style.left);
    },
    [props.cursorRef, cursorState]
  );

  const setupPlayback = useCallback(
    (osmdInstance) => {
      osmdInstance.zoom = props.zoom;
      const playbackControl = playbackOsmd(osmdInstance);
      playbackControl.initialize();
      instanceVariables.playbackManager.current = osmdInstance.PlaybackManager;
      props.playbackRef.current = instanceVariables.playbackManager.current;

      if (props.visual === "yes") {
        osmdInstance.cursor.CursorOptions.color = "#dde172";
        osmdInstance.render();
      }
      [osmdInstance.IDdict, osmdInstance.IDInvDict] =
        generateNoteIdsAssociation(osmdInstance);
    },
    [
      props.zoom,
      props.visual,
      playbackOsmd,
      generateNoteIdsAssociation,
      instanceVariables.playbackManager,
      props.playbackRef,
    ]
  );

  // useEffect(() => {
  //   const osmdInstance = instanceVariables.osmd.current;

  //   const checkCursorChange = () => {
  //     const cursorCurrent =
  //       osmdInstance.cursor.Iterator.currentTimeStamp.RealValue;

  //     const updateVisualMode = (cursorCurrent) => {
  //       if (
  //         instanceVariables.previousTimestamp.current !== null &&
  //         props.visual === "yes" &&
  //         instanceVariables.previousTimestamp.current > cursorCurrent &&
  //         instanceVariables.playbackManager.current.isPlaying
  //       ) {
  //         if (
  //           instanceVariables.showingRep.current <
  //           instanceVariables.totalReps.current
  //         ) {
  //           instanceVariables.showingRep.current++;
  //         } else {
  //           instanceVariables.showingRep.current = 0;
  //         }
  //         props.showRepeatsInfo(
  //           instanceVariables.showingRep.current,
  //           instanceVariables.totalReps.current
  //         );

  //         const staves = osmdInstance.current.graphic.measureList;
  //         for (
  //           let stave_index = 0;
  //           stave_index < staves.length;
  //           stave_index++
  //         ) {
  //           let stave = staves[stave_index][0];
  //           for (
  //             let note_index = 0;
  //             note_index < stave.staffEntries.length;
  //             note_index++
  //           ) {
  //             let note = stave.staffEntries[note_index];
  //             let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
  //             let noteNEWID = osmdInstance.current.IDdict[noteID];
  //             const colorsArray = [...pitchState.colorNotes];
  //             const index = colorsArray.findIndex(
  //               (item) =>
  //                 item[0][0] === noteNEWID &&
  //                 item[0][2] === instanceVariables.showingRep.current
  //             );
  //             if (index !== -1) {
  //               const svgElement =
  //                 note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
  //               svgElement.children[0].children[0].children[0].style.fill =
  //                 colorsArray[index][0][1];
  //               if (svgElement.children[0].children[1]) {
  //                 svgElement.children[0].children[1].children[0].style.fill =
  //                   colorsArray[index][0][1];
  //               }
  //             }
  //           }
  //         }
  //         props.cursorJumpsBack();
  //       }
  //     };

  //     const extractNotePosition = (gNote) => {
  //       const svgElement = gNote.getSVGGElement();
  //       if (
  //         svgElement &&
  //         svgElement.children[0] &&
  //         svgElement.children[0].children[0] &&
  //         svgElement.children[0].children[1]
  //       ) {
  //         const notePos =
  //           svgElement.children[0].children[1].children[0].getBoundingClientRect();
  //         instanceVariables.notePositionX.current = notePos.x;
  //         instanceVariables.notePositionY.current = notePos.y;
  //       } else {
  //         const notePos =
  //           svgElement.children[0].children[0].children[0].getBoundingClientRect();
  //         instanceVariables.notePositionX.current = notePos.x;
  //         instanceVariables.notePositionY.current = notePos.y;
  //       }
  //     };

  //     const updateNoteColors = (
  //       gNote,
  //       lastPitchData,
  //       lastPitchConfidenceData
  //     ) => {
  //       const colorPitchMatched = "#00FF00";
  //       const colorPitchNotMatched = "#FF0000";
  //       let notePitch;

  //       if (osmdInstance.cursor.NotesUnderCursor()[0].Pitch !== undefined) {
  //         notePitch = osmdInstance.cursor.NotesUnderCursor()[0].Pitch.frequency;
  //         if (lastPitchConfidenceData >= 0.5) {
  //           if (
  //             lastPitchData !== undefined &&
  //             Math.abs(
  //               freq2midipitch(lastPitchData) - freq2midipitch(notePitch)
  //             ) <= 0.25
  //           ) {
  //             instanceVariables.countGoodNotes.current += 1;
  //           } else {
  //             instanceVariables.countBadNotes.current += 1;
  //           }
  //         }
  //       } else {
  //         notePitch = 0;
  //         if (lastPitchConfidenceData <= 0.5) {
  //           instanceVariables.countGoodNotes.current += 1;
  //         } else {
  //           instanceVariables.countBadNotes.current += 1;
  //         }
  //       }

  //       const total =
  //         instanceVariables.countBadNotes.current +
  //         instanceVariables.countGoodNotes.current;
  //       if (
  //         total !== 0 &&
  //         instanceVariables.countGoodNotes.current >= Math.ceil(total * 0.5)
  //       ) {
  //         instanceVariables.noteColor.current = colorPitchMatched;
  //       } else if (
  //         total !== 0 &&
  //         instanceVariables.countGoodNotes.current < Math.ceil(total * 0.5)
  //       ) {
  //         instanceVariables.noteColor.current = colorPitchNotMatched;
  //       }

  //       if (pitchState.currentGNoteinScorePitch) {
  //         const noteID =
  //           osmdInstance.IDdict[pitchState.currentGNoteinScorePitch.getSVGId()];
  //         const colorsArray = pitchState.colorNotes.slice();
  //         const index = colorsArray.findIndex(
  //           (item) =>
  //             item[0][0] === noteID &&
  //             item[0][2] === instanceVariables.totalReps.current
  //         );
  //         if (index !== -1) {
  //           colorsArray[index][0][1] = instanceVariables.noteColor.current;
  //         } else {
  //           colorsArray.push([
  //             [
  //               noteID,
  //               instanceVariables.noteColor.current,
  //               instanceVariables.totalReps.current,
  //             ],
  //           ]);
  //         }
  //         pitchState.setColorNotes(colorsArray);

  //         const svgElement =
  //           pitchState.currentGNoteinScorePitch.getSVGGElement();
  //         svgElement.children[0].children[0].children[0].style.fill =
  //           instanceVariables.noteColor.current;
  //         if (
  //           svgElement &&
  //           svgElement.children[0] &&
  //           svgElement.children[0].children[0] &&
  //           svgElement.children[0].children[1]
  //         ) {
  //           svgElement.children[0].children[0].children[0].style.fill =
  //             instanceVariables.noteColor.current;
  //           svgElement.children[0].children[1].children[0].style.fill =
  //             instanceVariables.noteColor.current;
  //         }
  //       }

  //       if (gNote !== pitchState.currentGNoteinScorePitch) {
  //         instanceVariables.countBadNotes.current = 0;
  //         instanceVariables.countGoodNotes.current = 0;
  //         instanceVariables.noteColor.current = "#000000";
  //       }
  //       pitchState.setCurrentGNoteinScorePitch(gNote);
  //     };

  //     const handleRecording = () => {
  //       if (props.startPitchTrack) {
  //         if (instanceVariables.previousTimestamp.current > cursorCurrent) {
  //           instanceVariables.totalReps.current += 1;
  //           instanceVariables.showingRep.current =
  //             instanceVariables.totalReps.current;
  //           resetNotesColor(osmdInstance);
  //         }

  //         const gNote = osmdInstance.cursor.GNotesUnderCursor()[0];
  //         extractNotePosition(gNote);

  //         const lastPitchData =
  //           pitchState.pitchData[pitchState.pitchData.length - 1];
  //         const lastPitchConfidenceData =
  //           pitchState.pitchConfidenceData[
  //             pitchState.pitchConfidenceData.length - 1
  //           ];

  //         console.log("pitch data:", pitchState.pitchData);
  //         console.log("last pitch confidence data:", lastPitchConfidenceData);

  //         updateNoteColors(gNote, lastPitchData, lastPitchConfidenceData);
  //       }
  //     };

  //     updateVisualMode(cursorCurrent);
  //     handleRecording();

  //     instanceVariables.previousTimestamp.current = cursorCurrent;
  //   };

  //   const cursorInterval = setInterval(checkCursorChange, 200);
  //   instanceVariables.cursorInterval.current = cursorInterval;

  //   return () => clearInterval(cursorInterval);
  // }, [
  //   props.startPitchTrack,
  //   props.visual,
  //   props.showRepeatsInfo,
  //   props.cursorJumpsBack,
  //   instanceVariables,
  //   pitchState,
  //   resetNotesColor,
  // ]);

  const setupOsmd = useCallback(() => {
    const options = setupOptions();
    const osmdInstance = new OSMD(divRef.current, options);
    instanceVariables.osmd.current = osmdInstance;

    osmdInstance.load(`${props.file}`).then(() => {
      if (osmdInstance.Sheet) {
        initializeOsmd(osmdInstance);
        setupPlayback(osmdInstance);
        setIsLoaded(true);
      }
    });
  }, [
    setupOptions,
    initializeOsmd,
    setupPlayback,
    instanceVariables.osmd,
    props.file,
    setIsLoaded,
    divRef,
  ]);

  return setupOsmd;
};

export default useOsmdSetup;
