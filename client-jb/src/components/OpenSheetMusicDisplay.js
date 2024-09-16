/* eslint-disable */
// TODO: Eslint is disabled because the OSMD component is being refactored

import React, { useState, useRef, useEffect } from 'react';
import { OpenSheetMusicDisplay as OSMD } from 'opensheetmusicdisplay'; //RepetitionInstruction
import {
  PlaybackManager,
  LinearTimingSource,
  BasicAudioPlayer,
  IAudioMetronomePlayer,
  TransposeCalculator,
} from 'opensheetmusicdisplay';

import LineChart from './LineChartOSMD';
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale, // x axis
  LinearScale, // y axis
  PointElement,
} from 'chart.js';
import {
  freq2midipitch,
  midi2StaffGaps,
  generateNoteIDsAssociation,
  renderPitchLineZoom,
  setNoteColor,
} from '../utils/osmdUtils';

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement);

const OpenSheetMusicDisplay = (props) => {
  console.log('OSDM PROPS:', props);
  const [pitchColor, setPitchColor] = useState([]);
  const [pitchData, setPitchData] = useState([]);
  const [pitchConfidenceData, setPitchConfidenceData] = useState([]);
  const [pitchPositionX, setPitchPositionX] = useState([]);
  const [pitchPositionY, setPitchPositionY] = useState([]);
  const [recordedNoteIndex, setRecordedNoteIndex] = useState([]);
  const [repetitionNumber, setRepetitionNumber] = useState([]);
  const [recordedNoteIDs, setRecordedNoteIDs] = useState([]);
  const [recordedNoteNEWIDs, setRecordedNoteNEWIDs] = useState([]);
  const [colorNotes, setColorNotes] = useState([]);
  const [initialCursorTop, setInitialCursorTop] = useState(0);
  const [initialCursorLeft, setInitialCursorLeft] = useState(0);
  const [currentGNoteinScorePitch, setCurrentGNoteinScorePitch] =
    useState(null);
  const [selectionEndReached, setSelectionEndReached] = useState(false);
  const [calculatePunctuation, setCalculatePunctuation] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const osmd = useRef(undefined);
  const playbackManager = useRef(null);
  const divRef = useRef();
  const previousTimestamp = useRef(null);
  const notePositionX = useRef(null);
  const notePositionY = useRef(null);
  const noteColor = useRef(null);
  const index = useRef(null);
  const spacing = useRef(4);
  const countGoodNotes = useRef(0);
  const countBadNotes = useRef(0);
  const coords = useRef([0, 0]);
  const color = useRef('black');
  const zoom = useRef(props.zoom);
  const totalReps = useRef(0);
  const showingRep = useRef(0);
  const isScrollingRef = useRef(null); // Ref for timeout ID
  const cursorInterval = useRef(null);
  const visualRef = useRef(props.visual);
  const startPitchTrackRef = useRef(props.startPitchTrack);
  const pitchDataRef = useRef(pitchData);
  const pitchConfidenceDataRef = useRef(pitchConfidenceData);
  const colorNotesRef = useRef(colorNotes);
  const currentGNoteinScorePitchRef = useRef(currentGNoteinScorePitch);

  const lineChartStyle = {
    position: 'absolute',
    pointerEvents: 'none',
  };

  const resetNotesColor = () => {
    const colorBlack = '#000000';
    const svgContainer = osmd.current.container;
    const svgElements = svgContainer.getElementsByTagName('svg');

    for (let i = 0; i < svgElements.length; i++) {
      const svgElement = svgElements[i];
      // Select all elements with class "vf-notehead" within the SVG element
      const noteheads = svgElement.getElementsByClassName('vf-notehead');
      for (let j = 0; j < noteheads.length; j++) {
        let notehead = noteheads[j];
        let path = notehead.querySelector('path');
        // Set the fill attribute to black
        path.setAttribute('style', 'fill: ' + colorBlack + ' !important');
      }
    }
  };

  const playbackOsmd = (osmd) => {
    const timingSource = new LinearTimingSource();
    playbackManager.current = new PlaybackManager(
      timingSource,
      IAudioMetronomePlayer,
      new BasicAudioPlayer(),
      undefined
    );

    const handleSelectionEndReached = (o) => {
      console.log('end');
      setSelectionEndReached(true);
      if (!props.practiceMode) {
        setCalculatePunctuation(true);
      }
    };

    const myListener = {
      selectionEndReached: handleSelectionEndReached,
      resetOccurred: (o) => {},
      cursorPositionChanged: (timestamp, data) => {},
      pauseOccurred: (o) => {
        console.log('pause');
      },
      notesPlaybackEventOccurred: (o) => {},
    };

    playbackManager.current.addListener(myListener);

    playbackManager.current.DoPlayback = true;
    playbackManager.current.DoPreCount = false;
    playbackManager.current.PreCountMeasures = 1;

    const initialize = () => {
      timingSource.reset();
      timingSource.pause();
      timingSource.Settings = osmd.Sheet.playbackSettings;
      playbackManager.current.initialize(osmd.Sheet.musicPartManager);
      playbackManager.current.addListener(osmd.cursor);
      playbackManager.current.reset();
      osmd.PlaybackManager = playbackManager.current;

      for (const instrument of playbackManager.current.InstrumentIdMapping.values()) {
        instrument.Volume = props.recordVol;
      }
    };

    return {
      initialize,
    };
  };

  const setupOsmd = () => {
    const options = {
      autoResize: props.autoResize !== undefined ? props.autoResize : true,
      drawTitle: props.drawTitle !== undefined ? props.drawTitle : true,
      followCursor:
        props.followCursor !== undefined ? props.followCursor : true,
    };

    osmd.current = new OSMD(divRef.current, options);

    console.log('OSDM FILE:', props.file);
    osmd.current.load(props.file).then(() => {
      osmd.current.TransposeCalculator = new TransposeCalculator();
      if (osmd.current.Sheet) {
        console.log('SHEET IS HERE');
        osmd.current.Sheet.Transpose = props.transpose;
        osmd.current.updateGraphic();
        osmd.current.render();
        osmd.current.cursor.CursorOptions.color = '#4ade80';
        osmd.current.render();
        const cursor = osmd.current.cursor;
        props.cursorRef.current = cursor;
        cursor.show();
        setInitialCursorTop(cursor.cursorElement.style.top);
        setInitialCursorLeft(cursor.cursorElement.style.left);
      }

      const container = document.getElementById('osmdSvgPage1');
      if (container) {
        coords.current = [
          container.getBoundingClientRect().width,
          container.getBoundingClientRect().height,
        ];
      }

      osmd.current.zoom = props.zoom;
      const playbackControl = playbackOsmd(osmd.current);
      if (osmd.current.Sheet) playbackControl.initialize();

      props.playbackRef.current = playbackManager.current;

      if (props.visual === 'yes') {
        osmd.current.cursor.CursorOptions.color = '#dde172';
        osmd.current.render();
      }

      if (osmd.current.graphic)
        [osmd.current.IDdict, osmd.current.IDInvDict] =
          generateNoteIDsAssociation(osmd.current);

      if (props.visualJSON) {
        const json = props.visualJSON;

        // Update values
        setColorNotes(json.noteColors);
        colorNotesRef.current = json.noteColors;
        setRecordedNoteNEWIDs(json.noteNEWIDs);
        setRecordedNoteIndex(json.noteIndex);
        setPitchData(json.pitchTrackPoints);
        setPitchColor(json.pitchPointColor);
        setRepetitionNumber(json.repetitionNumber);
        showingRep.current = 0;
        totalReps.current = Math.max(...json.repetitionNumber);

        // Generate autoIds from ourIDs
        const AUXrecordedNoteIds = json.noteNEWIDs.map(
          (newID) => osmd.current.IDInvDict[newID]
        );
        setRecordedNoteIDs(AUXrecordedNoteIds);

        // Update color of notes and positions for pitch track line points
        let copy_pitchPositionX = json.pitchX.slice();
        let copy_pitchPositionY = json.pitchY.slice();

        if (osmd.current.graphic.measureList) {
          let staves = osmd.current.graphic.measureList;
          for (
            let stave_index = 0;
            stave_index < staves.length;
            stave_index++
          ) {
            let stave = staves[stave_index][0];
            const staveLines =
              document.getElementsByClassName('vf-stave')[stave_index];
            const upperLineStave =
              staveLines.children[0].getBoundingClientRect().top; // upper line
            const middleLineStave =
              staveLines.children[2].getBoundingClientRect().top; // middle line
            const lowerLineStave =
              staveLines.children[4].getBoundingClientRect().top; // lower line
            const oneStepPixels =
              Math.abs(upperLineStave - lowerLineStave) / 4 / 2; // steps corresponding to one step in staff

            for (
              let note_index = 0;
              note_index < stave.staffEntries.length;
              note_index++
            ) {
              // Check for notehead color
              const colorsArray = json.noteColors.slice();
              const [noteX, noteID] = setNoteColor(
                osmd.current,
                colorsArray,
                stave,
                note_index,
                showingRep.current
              );

              // Check for pitch tracking line
              for (
                let pitchIndex = 0;
                pitchIndex < copy_pitchPositionX.length;
                pitchIndex++
              ) {
                if (AUXrecordedNoteIds[pitchIndex] === noteID) {
                  // This note has been recorded
                  let midiToStaffStep = midi2StaffGaps(
                    freq2midipitch(json.pitchTrackPoints[pitchIndex])
                  );
                  copy_pitchPositionX[pitchIndex] = noteX;
                  copy_pitchPositionY[pitchIndex] =
                    middleLineStave + midiToStaffStep * oneStepPixels;
                }
              }
            }
          }
        }

        // Save in state the new pitch track line X and Y point positions
        setPitchPositionX(copy_pitchPositionX);
        setPitchPositionY(copy_pitchPositionY);
      }
    });
  };

  const updateMetronomeVolume = (newVolume) => {
    osmd.current.PlaybackManager.Metronome.Volume = newVolume;
  };

  // update bpm value
  const updateBpm = (newBpm) => {
    //Update bpm
    osmd.current.PlaybackManager.setBpm(newBpm);
    //Just in case, update bpm values for every measure of the score
    const sourceMeasures = osmd.current.Sheet.SourceMeasures;
    for (let i = 0; i < sourceMeasures.length; i++) {
      sourceMeasures[i].TempoInBPM = newBpm;
    }
  };

  const updateTranspose = (newTranspose) => {
    if (newTranspose !== undefined && newTranspose) {
      osmd.current.Sheet.Transpose = parseInt(newTranspose);
      osmd.current.updateGraphic();
      if (osmd.current.IsReadyToRender()) osmd.current.render();
      if (osmd.current.graphic)
        [osmd.current.IDdict, osmd.current.IDInvDict] =
          generateNoteIDsAssociation(osmd.current);
    }
  };

  const handleCursorUpdate = () => {
    if (osmd.current?.cursor) {
      const cursorCurrent =
        osmd.current.cursor.Iterator.currentTimeStamp.RealValue;
      if (
        previousTimestamp.current !== null &&
        visualRef.current === 'yes' &&
        previousTimestamp.current > cursorCurrent &&
        playbackManager.current.isPlaying
      ) {
        if (showingRep.current < totalReps.current) {
          showingRep.current = showingRep.current + 1;
        } else {
          showingRep.current = 0;
        }
        props.showRepeatsInfo(showingRep.current, totalReps.current);

        const staves = osmd.current.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            const colorsArray = [...colorNotesRef.current];
            setNoteColor(
              osmd.current,
              colorsArray,
              stave,
              note_index,
              showingRep.current
            );
          }
        }
        props.cursorJumpsBack();
      }
      if (startPitchTrackRef.current) {
        if (previousTimestamp.current > cursorCurrent) {
          totalReps.current = totalReps.current + 1;
          showingRep.current = totalReps.current;
          resetNotesColor();
        }

        const gNote = osmd.current.cursor.GNotesUnderCursor()[0];
        const svgElement = gNote.getSVGGElement();

        if (
          svgElement &&
          svgElement.children[0] &&
          svgElement.children[0].children[0] &&
          svgElement.children[0].children[1]
        ) {
          const notePos =
            svgElement.children[0].children[1].children[0].getBoundingClientRect();
          notePositionX.current = notePos.x;
          notePositionY.current = notePos.y;
        } else {
          const notePos =
            svgElement.children[0].children[0].children[0].getBoundingClientRect();
          notePositionX.current = notePos.x;
          notePositionY.current = notePos.y;
        }

        const lastPitchData =
          pitchDataRef.current[pitchDataRef.current.length - 1];
        const lastPitchConfidenceData =
          pitchConfidenceDataRef.current[
            pitchConfidenceDataRef.current.length - 1
          ];

        const colorPitchMatched = '#00FF00'; //green
        const colorPitchNotMatched = '#FF0000'; //red

        let notePitch;
        if (
          osmd.current.cursor.NotesUnderCursor()[0].Pitch !== undefined ||
          osmd.current.cursor.NotesUnderCursor()[0].TransposedPitch !==
            undefined
        ) {
          notePitch =
            osmd.current.cursor.NotesUnderCursor()[0].TransposedPitch !==
            undefined
              ? osmd.current.cursor.NotesUnderCursor()[0].TransposedPitch
                  .frequency
              : osmd.current.cursor.NotesUnderCursor()[0].Pitch.frequency;
          if (lastPitchConfidenceData >= 0.5) {
            if (
              lastPitchData !== undefined &&
              Math.abs(
                freq2midipitch(lastPitchData) - freq2midipitch(notePitch)
              ) <= 0.25 // 0.25 MIDI error margin
            ) {
              countGoodNotes.current = countGoodNotes.current + 1;
            } else {
              countBadNotes.current = countBadNotes.current + 1;
            }
          }
        } else {
          notePitch = 0;
          if (lastPitchConfidenceData <= 0.5) {
            countGoodNotes.current = countGoodNotes.current + 1;
          } else {
            countBadNotes.current = countBadNotes.current + 1;
          }
        }

        const total = countBadNotes.current + countGoodNotes.current;
        if (total !== 0 && countGoodNotes.current >= Math.ceil(total * 0.5)) {
          noteColor.current = colorPitchMatched;
        } else if (
          total !== 0 &&
          countGoodNotes.current < Math.ceil(total * 0.5)
        ) {
          noteColor.current = colorPitchNotMatched;
        }

        if (currentGNoteinScorePitchRef.current) {
          const noteID =
            osmd.current.IDdict[currentGNoteinScorePitchRef.current.getSVGId()];
          const colorsArray = [...colorNotesRef.current];
          const colorIndex = colorsArray.findIndex(
            (item) => item[0][0] === noteID && item[0][2] === totalReps.current
          );
          if (colorIndex !== -1) {
            colorsArray[colorIndex][0][1] = noteColor.current;
          } else {
            colorsArray.push([[noteID, noteColor.current, totalReps.current]]);
          }
          setColorNotes(colorsArray);
          colorNotesRef.current = colorsArray;

          svgElement.children[0].children[0].children[0].style.fill =
            noteColor.current; // notehead
          if (
            svgElement &&
            svgElement.children[0] &&
            svgElement.children[0].children[0] &&
            svgElement.children[0].children[1]
          ) {
            svgElement.children[0].children[0].children[0].style.fill =
              noteColor.current; // notehead
            svgElement.children[0].children[1].children[0].style.fill =
              noteColor.current; // notehead
          }
        }

        if (gNote !== currentGNoteinScorePitchRef.current) {
          countBadNotes.current = 0;
          countGoodNotes.current = 0;
          noteColor.current = '#000000';
        }
        setCurrentGNoteinScorePitch(gNote);
        currentGNoteinScorePitchRef.current = gNote;
      }
      previousTimestamp.current = cursorCurrent;
    }
  };

  useEffect(() => {
    visualRef.current = props.visual;
    startPitchTrackRef.current = props.startPitchTrack;
  }, [props.visual, props.startPitchTrack]);

  useEffect(() => {
    if (props.startPitchTrack || props.visual === 'yes') {
      cursorInterval.current = setInterval(handleCursorUpdate, 100); // Adjust the interval time as needed
    } else {
      if (cursorInterval.current) {
        clearInterval(cursorInterval.current);
        cursorInterval.current = null;
      }
    }

    return () => {
      if (cursorInterval.current) {
        clearInterval(cursorInterval.current);
      }
    };
  }, [props.startPitchTrack, props.visual]);

  useEffect(() => {
    if (selectionEndReached) {
      props.cursorActivity(true);
      previousTimestamp.current = null;
      setSelectionEndReached(false); //ready for next time
    }
  }, [selectionEndReached]);

  useEffect(() => {
    const handleScroll = () => {
      // Clear our timeout throughout the scroll
      if (isScrollingRef.current) {
        clearTimeout(isScrollingRef.current);
      }

      // Set a timeout to run after scrolling ends
      isScrollingRef.current = setTimeout(() => {
        // Update state to indicate that scrolling has ended
        setScrolled(true);
      }, 100);
    };

    // Add event listener for scroll
    window.addEventListener('scroll', handleScroll);

    // Cleanup function to remove event listener and clear timeout
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (isScrollingRef.current) {
        clearTimeout(isScrollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setupOsmd();

    return () => {
      const playbackManagerRef = props.playbackRef.current;
      if (playbackManagerRef) {
        const basicAudioPlayer = playbackManagerRef.AudioPlayer;
        if (basicAudioPlayer) {
          basicAudioPlayer.setVolume(0);
          basicAudioPlayer.stopSound();
        }
        playbackManagerRef.pause();
      }
      clearInterval(cursorInterval.current);
    };
  }, []);

  useEffect(() => {
    if (osmd.current.cursor && props.visual === 'no') {
      if (props.mode) {
        // practice mode
        osmd.current.cursor.CursorOptions.color = '#4ade80';
      } else {
        // record mode
        osmd.current.cursor.CursorOptions.color = '#f87171';
      }
      osmd.current.render();
    }
  }, [props.mode]);

  useEffect(() => {
    if (scrolled) {
      setScrolled(false);
      if (osmd.current.graphic?.measureList) {
        const renderState = {
          pitchPositionX,
          pitchPositionY,
          colorNotes,
          recordedNoteIDs,
          pitchData,
          recordedNoteIndex,
        };
        const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
          renderPitchLineZoom(
            osmd.current,
            renderState,
            zoom.current,
            showingRep.current
          );
        setPitchPositionX(updatedPitchPositionX);
        setPitchPositionY(updatedPitchPositionY);
        setRecordedNoteIndex(updatedNoteIndex);
      }
    }
  }, [scrolled]);

  useEffect(() => {
    if (props.canDownload) {
      let numStars;
      if (calculatePunctuation) {
        // If recording is complete, calculate punctuation and amount of stars
        const aux = colorNotes.slice();
        const colors = aux
          .map((innerArray) => innerArray.map((subArray) => subArray[1]))
          .flat();
        const numGreen = colors.filter((color) => color === '#00FF00').length;
        const numTotal = colors.length;
        const proportion = numGreen / numTotal;
        if (proportion >= 0.8) {
          numStars = 3;
        } else if (proportion >= 0.6 && proportion < 0.8) {
          numStars = 2;
        } else if (proportion >= 0.3 && proportion < 0.6) {
          numStars = 1;
        } else {
          numStars = 0;
        }

        setCalculatePunctuation(false);
      } else {
        // If recording is only a part of the score, set 0 stars
        numStars = 0;
      }

      const dataToSave = {
        pitchTrackPoints: pitchData,
        pitchX: pitchPositionX,
        pitchY: pitchPositionY,
        pitchPointColor: pitchColor,
        repetitionNumber: repetitionNumber,
        noteNEWIDs: recordedNoteNEWIDs,
        noteIndex: recordedNoteIndex,
        noteColors: colorNotes,
        bpm: props.bpm,
        stars: numStars,
        transpose: props.transpose,
      };

      const jsonString = JSON.stringify(dataToSave);
      props.dataToDownload(jsonString);
    }
  }, [props.canDownload, calculatePunctuation]);

  useEffect(() => {
    if (osmd.current.PlaybackManager) {
      updateMetronomeVolume(props.metroVol);
    }
  }, [props.metroVol, osmd.current]);

  useEffect(() => {
    if (osmd.current.PlaybackManager) {
      updateBpm(props.bpm);
    }
  }, [props.bpm, osmd.current]);

  useEffect(() => {
    if (
      osmd.current.PlaybackManager &&
      osmd.current.Sheet &&
      !props.playbackMode
    ) {
      updateTranspose(props.transpose);
    }
  }, [props.transpose]);

  useEffect(() => {
    if (osmd.current.Sheet) {
      osmd.current.zoom = props.zoom;
      osmd.current.render(); // update the OSMD instance after changing the zoom level
      const renderState = {
        pitchPositionX,
        pitchPositionY,
        colorNotes,
        recordedNoteIDs,
        pitchData,
        recordedNoteIndex,
      };
      const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
        renderPitchLineZoom(
          osmd.current,
          renderState,
          zoom.current,
          showingRep.current
        );
      setPitchPositionX(updatedPitchPositionX);
      setPitchPositionY(updatedPitchPositionY);
      setRecordedNoteIndex(updatedNoteIndex);
      zoom.current = props.zoom; // This forces thta LineChart re-renders the points position
    }
  }, [props.zoom]);

  useEffect(() => {
    if (osmd.current.graphic) {
      if (showingRep.current < totalReps.current) {
        showingRep.current = showingRep.current + 1;
      } else {
        showingRep.current = 0;
      }

      props.showRepeatsInfo(showingRep.current, totalReps.current);
      resetNotesColor();

      let staves = osmd.current.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
        for (
          let note_index = 0;
          note_index < stave.staffEntries.length;
          note_index++
        ) {
          // check for notehead color
          const colorsArray = colorNotes.slice();
          setNoteColor(
            osmd.current,
            colorsArray,
            stave,
            note_index,
            showingRep.current
          );
        }
      }
    }
  }, [props.repeatsIterator]);

  useEffect(() => {
    osmd.current.followCursor = props.followCursor;
  }, [props.followCursor]);

  useEffect(() => {
    if (props.startPitchTrack) {
      if (notePositionX.current === pitchPositionX[pitchPositionX.length - 1]) {
        // we are still on the same note
        index.current = index.current + spacing.current; // 6 is the spacing between points
      } else {
        // new note
        index.current = 0; // reset index
      }

      // Calculate Y coordinate
      const newPitchMIDI = freq2midipitch(props.pitch[props.pitch.length - 1]); // played note
      const midiToStaffStep = midi2StaffGaps(newPitchMIDI); // where to locate the played note in the staff with respect to B4(middle line)
      if (
        midiToStaffStep === 0 ||
        props.pitchConfidence[props.pitchConfidence.length - 1] < 0.5 // pitch confidence is becoming weirdly low on the 2nd or third time pitch tracking is done...why??
      ) {
        // Color turns white/invisible when pitch is out of bounds or pitch confidence is below 0.5
        color.current = '#FFFFFF';
      } else {
        color.current = '#000000';
      }

      const staveLines =
        document.getElementsByClassName('vf-stave')[
          osmd.current.cursor.Iterator.currentMeasureIndex
        ];
      const upperLineStave = staveLines.children[0].getBoundingClientRect().top; // upper line
      const middleLineStave =
        staveLines.children[2].getBoundingClientRect().top; // middle line
      const lowerLineStave = staveLines.children[4].getBoundingClientRect().top; // lower line
      const oneStepPixels = Math.abs(upperLineStave - lowerLineStave) / 4 / 2; // steps corresponding to one step in staff

      const noteStaffPositionY =
        middleLineStave + midiToStaffStep * oneStepPixels;

      // Add pitch to array and note identification data
      if (currentGNoteinScorePitchRef.current) {
        // Add note ID
        const newNoteID =
          osmd.current.IDdict[currentGNoteinScorePitchRef.current.getSVGId()];
        const noteID = osmd.current.IDInvDict[newNoteID];
        // const noteID = currentGNoteinScorePitchRef.current.getSVGId();
        setRecordedNoteIDs([...recordedNoteIDs, noteID]);
        setRecordedNoteNEWIDs([
          ...recordedNoteNEWIDs,
          newNoteID,
          // osmd.current.IDdict[noteID],
        ]);
        // Add note index
        setRecordedNoteIndex([...recordedNoteIndex, index.current]);
        // Add pitch data
        setPitchData([
          ...pitchData,
          parseFloat(props.pitch[props.pitch.length - 1]),
        ]);
        pitchDataRef.current = [
          ...pitchData,
          parseFloat(props.pitch[props.pitch.length - 1]),
        ];
        // Add pitch confidence data
        setPitchConfidenceData([
          ...pitchConfidenceData,
          props.pitchConfidence[props.pitchConfidence.length - 1],
        ]);
        pitchConfidenceDataRef.current = [
          ...pitchConfidenceData,
          props.pitchConfidence[props.pitchConfidence.length - 1],
        ];
        // Add X position to array
        setPitchPositionX([...pitchPositionX, notePositionX.current]);
        // Add Y position to array
        setPitchPositionY([...pitchPositionY, noteStaffPositionY]);
        // Add note color
        setPitchColor([...pitchColor, color.current]);
        // Add current number of repetition
        setRepetitionNumber([...repetitionNumber, parseInt(totalReps.current)]);
      }
    }
  }, [props.pitch, props.startPitchTrack]);

  useEffect(() => {
    const playbackManagerRef = props.playbackRef.current;
    if (playbackManagerRef) {
      for (const instrument of playbackManagerRef.InstrumentIdMapping.values()) {
        instrument.Volume = props.recordVol;
      }
    }
  }, [props.recordVol]);

  useEffect(() => {
    if (props.isResetButtonPressed) {
      resetNotesColor();
      if (props.visual === 'no') {
        setColorNotes([]);
        colorNotesRef.current = [];
        setRecordedNoteIDs([]);
        setRecordedNoteNEWIDs([]);
        setRecordedNoteIndex([]);
        setPitchData([]);
        pitchDataRef.current = [];
        setPitchConfidenceData([]);
        pitchConfidenceDataRef.current = [];
        setPitchPositionX([]);
        setPitchPositionY([]);
        setPitchColor([]);
        setRepetitionNumber([]);
        showingRep.current = 0;
        totalReps.current = 0;
        previousTimestamp.current = 0;
        props.showRepeatsInfo(0, 0);
        props.onResetDone(); // call the function passed from the parent component
      } else {
        //put showingRep at 0
        showingRep.current = 0;
        //put note colors corresponding to showingRep=0
        //Update color of notes
        let staves = osmd.current.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            // check for notehead color
            const colorsArray = colorNotes.slice();
            setNoteColor(osmd.current, colorsArray, stave, note_index, 0);
          }
        }
        //make notice that reset actions were taken care of
        props.onResetDone(); // call the function passed from the parent component
      }
    }
  }, [props.isResetButtonPressed]);

  return (
    <div>
      <div style={lineChartStyle}>
        <LineChart
          width={coords.current[0]}
          height={coords.current[1]}
          zoom={zoom.current}
          pitchColor={pitchColor}
          pitchData={pitchData}
          pitchDataPosX={pitchPositionX}
          pitchDataPosY={pitchPositionY}
          pitchIndex={recordedNoteIndex}
          repetitionNumber={repetitionNumber}
          showingRep={showingRep.current}
        />
      </div>

      <div ref={divRef} />
    </div>
  );
};

export default OpenSheetMusicDisplay;
