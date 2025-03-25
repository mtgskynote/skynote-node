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
  resetNotesColor,
} from '../utils/osmdUtils';

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement);

const SAMPLE_RATE = 16000; // Audio worklet sample rate
const HOP_SIZE = 256; // Hop size
const POINTS_PER_SECOND = SAMPLE_RATE / HOP_SIZE; // Rate of pitch points collected per second

const OpenSheetMusicDisplay = (props) => {
  const [selectionEndReached, setSelectionEndReached] = useState(false);
  const [calculatePunctuation, setCalculatePunctuation] = useState(false);
  const [isPitchDataReady, setIsPitchDataReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const osmd = useRef(undefined);
  const playbackManager = useRef(null);
  const osmdDivRef = useRef();
  const previousTimestamp = useRef(null);
  const notePositionX = useRef(null);
  const notePositionY = useRef(null);
  const pitchPositionXRef = useRef([]);
  const pitchPositionYRef = useRef([]);
  const recordedNoteIndexRef = useRef([]);
  const repetitionNumberRef = useRef([]);
  const recordedNoteIDsRef = useRef([]);
  const recordedNoteNEWIDsRef = useRef([]);
  const noteColor = useRef(null);
  const pitchColorRef = useRef([]);
  const index = useRef(null);
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
  const pitchDataRef = useRef([]);
  const pitchConfidenceDataRef = useRef([]);
  const colorNotesRef = useRef([]);
  const currentGNoteinScorePitchRef = useRef(null);
  const currentMeasureWidth = useRef(null);
  const isFirstNoteInStaffRef = useRef(false);
  const wasFirstNoteInStaffRef = useRef(false);
  const isFirstNoteTransitionRef = useRef(false);
  const firstNoteXPositionRef = useRef(null);
  const currentStaffElementWidthRef = useRef(null);
  const currentNumStaffMeasuresRef = useRef(null);
  const firstNoteXPositionViewportRef = useRef(null);

  const lineChartStyle = {
    position: 'absolute',
    pointerEvents: 'none',
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
      resetOccurred: () => {},
      cursorPositionChanged: () => {},
      soundLoaded: () => {},
      allSoundsLoaded: () => {},
      pauseOccurred: () => {
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
      playbackManager.current.setBpm(props.bpm);
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

    osmd.current = new OSMD(osmdDivRef.current, options);

    osmd.current.load(props.file).then(() => {
      osmd.current.TransposeCalculator = new TransposeCalculator();
      if (osmd.current.Sheet) {
        osmd.current.Sheet.Transpose = props.transpose;
        osmd.current.updateGraphic();
        osmd.current.render();
        osmd.current.cursor.CursorOptions.color = '#4ade80';
        osmd.current.render();
        const cursor = osmd.current.cursor;
        props.cursorRef.current = cursor;
        cursor.show();
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
        colorNotesRef.current = json.noteColors;
        recordedNoteNEWIDsRef.current = json.noteNEWIDs;
        recordedNoteIndexRef.current = json.noteIndex;
        pitchDataRef.current = json.pitchTrackPoints;
        pitchColorRef.current = json.pitchPointColor;
        repetitionNumberRef.current = json.repetitionNumber;
        showingRep.current = 0;
        totalReps.current = Math.max(...json.repetitionNumber);

        // Generate autoIds from ourIDs
        const AUXrecordedNoteIds = json.noteNEWIDs.map(
          (newID) => osmd.current.IDInvDict[newID]
        );
        recordedNoteIDsRef.current = AUXrecordedNoteIds;

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
        pitchPositionXRef.current = copy_pitchPositionX;
        pitchPositionYRef.current = copy_pitchPositionY;

        setIsPitchDataReady(true);
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
    if (!osmd.current?.cursor) return;

    const cursorCurrent =
      osmd.current.cursor.Iterator.currentTimeStamp.RealValue;

    if (
      previousTimestamp.current !== null &&
      visualRef.current === 'yes' &&
      previousTimestamp.current > cursorCurrent &&
      playbackManager.current.isPlaying
    ) {
      showingRep.current =
        showingRep.current < totalReps.current ? showingRep.current + 1 : 0;
      props.setCurrentRep(showingRep.current + 1);

      osmd.current.graphic.measureList.forEach(([stave]) => {
        stave.staffEntries.forEach((_, noteIndex) => {
          const colorsArray = [...colorNotesRef.current];
          setNoteColor(
            osmd.current,
            colorsArray,
            stave,
            noteIndex,
            showingRep.current
          );
        });
      });

      props.cursorJumpsBack();
    }
    if (startPitchTrackRef.current) {
      if (previousTimestamp.current > cursorCurrent) {
        totalReps.current = totalReps.current + 1;
        showingRep.current = totalReps.current;
        resetNotesColor(osmd.current);
      }

      const gNote = osmd.current.cursor.GNotesUnderCursor()[0];
      // const gStaffEntry = gNote.parentVoiceEntry.parentStaffEntry;
      // currentNumStaffMeasuresRef.current =
      //   gStaffEntry.parentMeasure.parentMusicSystem.GraphicalMeasures.length;

      // isFirstNoteInStaffRef.current =
      //   gStaffEntry.parentMeasure.MeasureNumber ===
      //     gStaffEntry.parentMeasure.parentMusicSystem.GraphicalMeasures[0][0]
      //       .MeasureNumber && gStaffEntry.relInMeasureTimestamp.RealValue === 0;

      // if (isFirstNoteInStaffRef.current) {
      //   const svgElement = gNote.getSVGGElement();
      //   const staffElement = svgElement.closest('g.staffline');
      //   const staffBBox = staffElement.getBBox();
      //   currentStaffElementWidthRef.current = staffBBox.width;
      //   firstNoteXPositionRef.current =
      //     svgElement.children[0].children[0].children[0].getBoundingClientRect().x;
      // }

      // isFirstNoteTransitionRef.current =
      //   !wasFirstNoteInStaffRef.current && isFirstNoteInStaffRef.current;

      // wasFirstNoteInStaffRef.current = isFirstNoteInStaffRef.current;

      const svgElement = gNote.getSVGGElement();
      const measureElement = svgElement.closest('g.vf-measure');
      const measureWidth = measureElement.getBBox().width;
      if (currentMeasureWidth.current !== measureWidth) {
        currentMeasureWidth.current = measureWidth;
      }

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
        osmd.current.cursor.NotesUnderCursor()[0].TransposedPitch !== undefined
      ) {
        if (parseInt(props.transpose) === 0) {
          notePitch = osmd.current.cursor.NotesUnderCursor()[0].Pitch.frequency;
        } else {
          notePitch =
            osmd.current.cursor.NotesUnderCursor()[0].TransposedPitch.frequency;
        }
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
      if (total !== 0 && countGoodNotes.current >= Math.ceil(total * 0.1)) {
        noteColor.current = colorPitchMatched;
      } else if (
        total !== 0 &&
        countGoodNotes.current < Math.ceil(total * 0.1)
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
      currentGNoteinScorePitchRef.current = gNote;
    }
    previousTimestamp.current = cursorCurrent;
  };

  useEffect(() => {
    visualRef.current = props.visual;
    startPitchTrackRef.current = props.startPitchTrack;

    if (props.startPitchTrack || props.visual === 'yes') {
      cursorInterval.current = setInterval(handleCursorUpdate, 100);
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
  }, [props.visual, props.startPitchTrack]);

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
          pitchPositionX: pitchPositionXRef.current,
          pitchPositionY: pitchPositionYRef.current,
          colorNotes: colorNotesRef.current,
          recordedNoteIDs: recordedNoteIDsRef.current,
          pitchData: pitchDataRef.current,
          recordedNoteIndex: recordedNoteIndexRef.current,
        };
        const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
          renderPitchLineZoom(
            osmd.current,
            renderState,
            zoom.current,
            showingRep.current
          );
        pitchPositionXRef.current = updatedPitchPositionX;
        pitchPositionYRef.current = updatedPitchPositionY;
        recordedNoteIndexRef.current = updatedNoteIndex;
      }
    }
  }, [scrolled]);

  useEffect(() => {
    if (props.canDownload) {
      let numStars;
      if (calculatePunctuation) {
        // If recording is complete, calculate punctuation and amount of stars
        const aux = colorNotesRef.current.slice();
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
        pitchTrackPoints: pitchDataRef.current,
        pitchX: pitchPositionXRef.current,
        pitchY: pitchPositionYRef.current,
        pitchPointColor: pitchColorRef.current,
        repetitionNumber: repetitionNumberRef.current,
        noteNEWIDs: recordedNoteNEWIDsRef.current,
        noteIndex: recordedNoteIndexRef.current,
        noteColors: colorNotesRef.current,
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
        pitchPositionX: pitchPositionXRef.current,
        pitchPositionY: pitchPositionYRef.current,
        colorNotes: colorNotesRef.current,
        recordedNoteIDs: recordedNoteIDsRef.current,
        pitchData: pitchDataRef.current,
        recordedNoteIndex: recordedNoteIndexRef.current,
      };
      const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
        renderPitchLineZoom(
          osmd.current,
          renderState,
          zoom.current,
          showingRep.current
        );
      pitchPositionXRef.current = updatedPitchPositionX;
      pitchPositionYRef.current = updatedPitchPositionY;
      recordedNoteIndexRef.current = updatedNoteIndex;
      zoom.current = props.zoom; // This forces LineChart to re-render the points
    }
  }, [props.zoom]);

  useEffect(() => {
    if (osmd.current.graphic) {
      if (showingRep.current < totalReps.current) {
        showingRep.current = showingRep.current + 1;
        osmd.current.Sheet.SourceMeasures[0].firstRepetitionInstructions[0].parentRepetition.UserNumberOfRepetitions = 1;
        osmd.current.PlaybackManager.recalculatePlaybackEntriesAndRepetitions();
      } else {
        showingRep.current = 0;
        osmd.current.Sheet.SourceMeasures[0].firstRepetitionInstructions[0].parentRepetition.UserNumberOfRepetitions = 2;
        osmd.current.PlaybackManager.recalculatePlaybackEntriesAndRepetitions();
      }
      props.setCurrentRep(showingRep.current + 1);
      resetNotesColor(osmd.current);

      let staves = osmd.current.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
        for (
          let note_index = 0;
          note_index < stave.staffEntries.length;
          note_index++
        ) {
          // check for notehead color
          const colorsArray = colorNotesRef.current.slice();
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
      // if (isFirstNoteTransitionRef.current) {
      //   index.current = 0;
      // } else {
      //   const bpm = parseInt(osmd.current.PlaybackManager.currentBPM);
      //   const secondsPerBeat = 60 / bpm;
      //   const beatsPerMeasure = 4;
      //   const totalBeatsInStaffline =
      //     currentNumStaffMeasuresRef.current * beatsPerMeasure;

      //   // if the cursor is currently inside a staffline:
      //   let adjustedStafflineWidth =
      //     currentStaffElementWidthRef.current - firstNoteXPositionRef.current;

      //   const beatWidthPixels = adjustedStafflineWidth / totalBeatsInStaffline;
      //   const pixelsPerSecond = beatWidthPixels / secondsPerBeat;
      //   const spacingPerPoint = pixelsPerSecond / POINTS_PER_SECOND;

      //   index.current += spacingPerPoint * 1.7;

      // const bpm = parseInt(osmd.current.PlaybackManager.currentBPM); // Current BPM
      // const secondsPerBeat = 60 / bpm; // Seconds per beat
      // const beatsPerMeasure = 4;
      // const totalBeatsInStaffline =
      //   currentNumStaffMeasuresRef.current * beatsPerMeasure;

      // // Calculate total duration of the staffline in seconds
      // const secondsPerStaffline = totalBeatsInStaffline * secondsPerBeat;
      // const pointsPerStaffline = POINTS_PER_SECOND * secondsPerStaffline;

      // // Adjust the staffline width for the first note in the staffline
      // let adjustedStafflineWidth = currentStaffElementWidthRef.current;
      // if (isFirstNoteInStaffRef.current) {
      //   adjustedStafflineWidth -= firstNoteXPositionRef.current; // Subtract the x position of the first note
      // }

      // // Calculate spacing per point for the staffline
      // const spacingPerPoint = adjustedStafflineWidth / pointsPerStaffline;

      // index.current += spacingPerPoint;
      // }
      if (
        notePositionX.current ===
        pitchPositionXRef.current[pitchPositionXRef.current.length - 1]
      ) {
        // we are still on the same note
        // index.current = index.current + 6;
        const bpm = parseInt(osmd.current.PlaybackManager.currentBPM);
        const secondsPerBeat = 60 / bpm;
        const beatsPerMeasure = 4;

        const secondsPerMeasure = beatsPerMeasure * secondsPerBeat;
        const pointsPerMeasure = POINTS_PER_SECOND * secondsPerMeasure;

        let adjustedMeasureWidth = currentMeasureWidth.current;

        const spacingPerPoint = adjustedMeasureWidth / pointsPerMeasure;

        index.current += spacingPerPoint;

        // index.current =
        //   index.current +
        //   (currentMeasureWidth.current *
        //     0.006 *
        //     parseInt(osmd.current.PlaybackManager.currentBPM)) /
        //     60; // 0.02 is the aproximate "rate" at which points are drawn every measure
      } else {
        // new note
        index.current = 0; // reset index
      }

      // Calculate Y coordinate
      const newPitchMIDI = freq2midipitch(props.pitch[props.pitch.length - 1]); // played note
      const midiToStaffStep = midi2StaffGaps(newPitchMIDI); // where to locate the played note in the staff with respect to B4(middle line)
      if (
        midiToStaffStep === 0 ||
        props.pitchConfidence[props.pitchConfidence.length - 1] < 0.4
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
        recordedNoteIDsRef.current = [...recordedNoteIDsRef.current, noteID];
        recordedNoteNEWIDsRef.current = [
          ...recordedNoteNEWIDsRef.current,
          newNoteID,
        ];
        // Add note index
        recordedNoteIndexRef.current = [
          ...recordedNoteIndexRef.current,
          index.current,
        ];
        // Add pitch data
        pitchDataRef.current = [
          ...pitchDataRef.current,
          parseFloat(props.pitch[props.pitch.length - 1]),
        ];
        // Add pitch confidence data
        pitchConfidenceDataRef.current = [
          ...pitchConfidenceDataRef.current,
          props.pitchConfidence[props.pitchConfidence.length - 1],
        ];
        // Add X position to array
        pitchPositionXRef.current = [
          ...pitchPositionXRef.current,
          notePositionX.current,
        ];
        // Add Y position to array
        pitchPositionYRef.current = [
          ...pitchPositionYRef.current,
          noteStaffPositionY,
        ];
        // Add note color
        pitchColorRef.current = [...pitchColorRef.current, color.current];
        // Add current number of repetition
        repetitionNumberRef.current = [
          ...repetitionNumberRef.current,
          parseInt(totalReps.current),
        ];
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
      resetNotesColor(osmd.current);
      if (props.visual === 'no') {
        colorNotesRef.current = [];
        recordedNoteIDsRef.current = [];
        recordedNoteNEWIDsRef.current = [];
        recordedNoteIndexRef.current = [];
        pitchDataRef.current = [];
        pitchConfidenceDataRef.current = [];
        pitchPositionXRef.current = [];
        pitchPositionYRef.current = [];
        pitchColorRef.current = [];
        repetitionNumberRef.current = [];
        showingRep.current = 0;
        totalReps.current = 0;
        previousTimestamp.current = 0;
        props.onResetDone(); // call the function passed from the parent component
      } else {
        showingRep.current = 0;
        props.setCurrentRep(showingRep.current + 1);
        let staves = osmd.current.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
          let stave = staves[stave_index][0];
          for (
            let note_index = 0;
            note_index < stave.staffEntries.length;
            note_index++
          ) {
            // check for notehead color
            const colorsArray = colorNotesRef.current.slice();
            setNoteColor(osmd.current, colorsArray, stave, note_index, 0);
          }
        }
        props.onResetDone(); // call the function passed from the parent component
      }
    }
  }, [props.isResetButtonPressed]);

  // Trigger a scroll to ensure that pitch line redraws when window is resized
  useEffect(() => {
    const handleResize = () => {
      window.scrollTo({ top: 50, behavior: 'smooth' });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <div style={lineChartStyle}>
        <LineChart
          width={coords.current[0]}
          height={coords.current[1]}
          zoom={zoom.current}
          pitchColor={pitchColorRef.current}
          pitchData={pitchDataRef.current}
          pitchDataPosX={pitchPositionXRef.current}
          pitchDataPosY={pitchPositionYRef.current}
          pitchIndex={recordedNoteIndexRef.current}
          repetitionNumber={repetitionNumberRef.current}
          showingRep={showingRep.current}
          isPitchDataReady={isPitchDataReady}
          firstNoteXPosition={firstNoteXPositionRef.current}
        />
      </div>

      <div ref={osmdDivRef} />
    </div>
  );
};

export default OpenSheetMusicDisplay;
