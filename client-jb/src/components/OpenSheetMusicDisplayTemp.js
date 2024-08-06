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
} from '../utils/osmdUtils';

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement);

const OpenSheetMusicDisplay = (props) => {
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
  const divRef = useRef();
  const cursorInterval = useRef(null);
  const previousTimestamp = useRef(null);
  const notePositionX = useRef(null);
  const notePositionY = useRef(null);
  const noteColor = useRef(null);
  const index = useRef(null);
  const spacing = 4;
  const countGoodNotes = useRef(0);
  const countBadNotes = useRef(0);
  const coords = useRef([0, 0]);
  const color = 'black';
  const zoom = props.zoom;
  const drawPitch = props.drawPitch;
  const totalReps = useRef(0);
  const showingRep = useRef(0);
  const isScrollingRef = useRef(null); // Ref for timeout ID

  const lineChartStyle = {
    position: 'absolute',
    pointerEvents: 'none',
  };

  const checkCursorChange = () => {
    const cursorCurrent = osmd.cursor.Iterator.currentTimeStamp.RealValue;

    if (selectionEndReached.current === true) {
      props.cursorActivity(true);
      previousTimestamp.current = null;
      selectionEndReached.current = false; //ready for next time
    }

    if (
      previousTimestamp.current !== null &&
      props.visual === 'yes' &&
      previousTimestamp.current > cursorCurrent &&
      playbackManager.isPlaying
    ) {
      if (showingRep < totalReps) {
        showingRep.current = showingRep + 1;
      } else {
        showingRep.current = 0;
      }
      props.showRepeatsInfo(showingRep.current, totalReps.current);

      const staves = osmd.graphic.measureList;
      for (let stave_index = 0; stave_index < staves.length; stave_index++) {
        let stave = staves[stave_index][0];
        for (
          let note_index = 0;
          note_index < stave.staffEntries.length;
          note_index++
        ) {
          let note = stave.staffEntries[note_index];
          let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
          let noteNEWID = osmd.IDdict[noteID];
          const colorsArray = [...colorNotes];
          const index = colorsArray.findIndex(
            (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
          );
          if (index !== -1) {
            const svgElement =
              note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
            svgElement.children[0].children[0].children[0].style.fill =
              colorsArray[index][0][1]; // notehead
            if (
              svgElement &&
              svgElement.children[0] &&
              svgElement.children[0].children[0] &&
              svgElement.children[0].children[1]
            ) {
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              svgElement.children[0].children[1].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
            }
          }
        }
      }
      props.cursorJumpsBack();
    }

    if (props.startPitchTrack) {
      if (previousTimestamp.current > cursorCurrent) {
        totalReps.current = totalReps + 1;
        showingRep.current = totalReps;
        resetNotesColor();
      }

      const gNote = osmd.cursor.GNotesUnderCursor()[0];
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

      const lastPitchData = pitchData[pitchData.length - 1];
      const lastPitchConfidenceData =
        pitchConfidenceData[pitchConfidenceData.length - 1];

      const colorPitchMatched = '#00FF00'; //green
      const colorPitchNotMatched = '#FF0000'; //red

      let notePitch;
      if (osmd.cursor.NotesUnderCursor()[0].Pitch !== undefined) {
        notePitch =
          osmd.cursor.NotesUnderCursor()[0].TransposedPitch !== undefined
            ? osmd.cursor.NotesUnderCursor()[0].TransposedPitch.frequency
            : osmd.cursor.NotesUnderCursor()[0].Pitch.frequency;
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
      } else if (total !== 0 && countGoodNotes < Math.ceil(total * 0.5)) {
        noteColor.current = colorPitchNotMatched;
      }

      if (currentGNoteinScorePitch) {
        const noteID = osmd.IDdict[currentGNoteinScorePitch.getSVGId()];
        const colorsArray = [...colorNotes];
        const index = colorsArray.findIndex(
          (item) => item[0][0] === noteID && item[0][2] === totalReps
        );
        if (index !== -1) {
          colorsArray[index][0][1] = noteColor.current;
        } else {
          colorsArray.push([[noteID, noteColor.current, totalReps.current]]);
        }
        setColorNotes(colorsArray);

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

      if (gNote !== currentGNoteinScorePitch) {
        countBadNotes.current = 0;
        countGoodNotes.current = 0;
        noteColor.current = '#000000';
      }
      setCurrentGNoteinScorePitch(gNote);
    }

    previousTimestamp.current = cursorCurrent;
  };

  const resetNotesColor = () => {
    const colorBlack = '#000000'; // black color

    // Get the SVG container element
    var svgContainer = osmd.container;

    // Select all SVG elements within the container
    var svgElements = svgContainer.getElementsByTagName('svg');

    // Iterate through each SVG element
    for (var i = 0; i < svgElements.length; i++) {
      var svgElement = svgElements[i];

      // Select all elements with class "vf-notehead" within the SVG element
      var noteheads = svgElement.getElementsByClassName('vf-notehead');

      // Iterate through all the notehead elements
      for (var j = 0; j < noteheads.length; j++) {
        let notehead = noteheads[j];

        // Select the inner <path> element
        let path = notehead.querySelector('path');

        // Set the fill attribute to black
        path.setAttribute('style', 'fill: ' + colorBlack + ' !important');
      }
    }
  };

  const playbackOsmd = (osmd) => {
    const timingSource = new LinearTimingSource();
    const playbackManager = new PlaybackManager(
      timingSource,
      IAudioMetronomePlayer,
      new BasicAudioPlayer(),
      undefined
    );

    const handleSelectionEndReached = (o) => {
      console.log('end');
      setSelectionEndReached(true);
      if (props.startPitchTrack) {
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

    playbackManager.addListener(myListener);

    playbackManager.DoPlayback = true;
    playbackManager.DoPreCount = false;
    playbackManager.PreCountMeasures = 1;

    const initialize = () => {
      timingSource.reset();
      timingSource.pause();
      timingSource.Settings = osmd.Sheet.playbackSettings;
      playbackManager.initialize(osmd.Sheet.musicPartManager);
      playbackManager.addListener(osmd.cursor);
      playbackManager.reset();
      osmd.PlaybackManager = playbackManager;

      for (const instrument of playbackManager.InstrumentIdMapping.values()) {
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

    osmd.current.load(props.file).then(() => {
      osmd.current.TransposeCalculator = new TransposeCalculator();
      if (osmd.current.Sheet) {
        osmd.current.Sheet.Transpose = this.props.transpose;
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

      osmd.current.zoom = props.zoom;
      const playbackControl = playbackOsmd(osmd.current);
      playbackControl.initialize();

      props.playbackRef.current = playbackManager;

      cursorInterval.current = setInterval(checkCursorChange, 200);
      if (props.visual === 'yes') {
        osmd.current.cursor.CursorOptions.color = '#dde172';
        osmd.current.render();
      }

      [osmd.current.IDdict, osmd.current.IDInvDict] =
        generateNoteIDsAssociation(osmd.current);
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
    }
  };

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
      const playbackManager = props.playbackRef.current;
      if (playbackManager) {
        const basicAudioPlayer = playbackManager.AudioPlayer;
        if (basicAudioPlayer) {
          basicAudioPlayer.setVolume(0);
          basicAudioPlayer.stopSound();
        }
        playbackManager.pause();
      }

      clearInterval(cursorInterval.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  useEffect(() => {
    if (props.mode) {
      // practice mode
      osmd.cursor.CursorOptions.color = '#4ade80';
    } else {
      // record mode
      osmd.cursor.CursorOptions.color = '#f87171';
    }
    osmd.render();
  }, [props.mode]);

  useEffect(() => {
    const container = document.getElementById('osmdSvgPage1');
    if (container) {
      coords.current = [
        container.getBoundingClientRect().width,
        container.getBoundingClientRect().height,
      ];
    }
  }, []);

  useEffect(() => {
    if (scrolled) {
      setScrolled(false);
      if (osmd.graphic?.measureList) {
        const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
          renderPitchLineZoom(
            osmd,
            { pitchPositionX, pitchPositionY, recordedNoteIndex },
            zoom,
            showingRep
          );
        setPitchPositionX(updatedPitchPositionX);
        setPitchPositionY(updatedPitchPositionY);
        setRecordedNoteIndex(updatedNoteIndex);
      }
    }
  }, [scrolled]);

  useEffect(() => {
    setupOsmd();
  }, [props.drawTitle]);

  useEffect(() => {
    osmd.load(props.file).then(() => osmd.render());
  }, [props.file]);

  useEffect(() => {
    if (props.canDownload) {
      let n_stars;
      if (calculatePunctuation) {
        // If recording is complete
        // Calculate punctuation and amount of stars
        const aux = colorNotes.slice();
        const colors = aux
          .map((innerArray) => innerArray.map((subArray) => subArray[1]))
          .flat();
        const n_green = colors.filter((color) => color === '#00FF00').length;
        const n_total = colors.length;
        const proportion = n_green / n_total;
        if (proportion >= 0.8) {
          n_stars = 3;
        } else if (proportion >= 0.6 && proportion < 0.8) {
          n_stars = 2;
        } else if (proportion >= 0.3 && proportion < 0.6) {
          n_stars = 1;
        } else {
          n_stars = 0;
        }

        setCalculatePunctuation(false);
      } else {
        // If recording is only a part of the score
        // No punctuation
        n_stars = 0;
      }

      // Save data
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
        stars: n_stars,
      };

      const jsonString = JSON.stringify(dataToSave);
      props.dataToDownload(jsonString);
    }
  }, [props.canDownload]);

  useEffect(() => {
    if (props.visualJSON) {
      const json = props.visualJSON;

      // Update values
      setColorNotes(json.noteColors);
      setRecordedNoteNEWIDs(json.noteNEWIDs);
      setRecordedNoteIndex(json.noteIndex);
      setPitchData(json.pitchTrackPoints);
      setPitchColor(json.pitchPointColor);
      setRepetitionNumber(json.repetitionNumber);
      showingRep.current = 0;
      totalReps.current = Math.max(...json.repetitionNumber);

      // Generate autoIds from ourIDs
      const AUXrecordedNoteIds = json.noteNEWIDs.map(
        (newID) => osmd.IDInvDict[newID]
      );
      setRecordedNoteIDs(AUXrecordedNoteIds);

      // Update color of notes and positions for pitch track line points
      let copy_pitchPositionX = json.pitchX.slice();
      let copy_pitchPositionY = json.pitchY.slice();

      if (osmd.graphic.measureList) {
        let staves = osmd.graphic.measureList;
        for (let stave_index = 0; stave_index < staves.length; stave_index++) {
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
            let note = stave.staffEntries[note_index];
            let noteID = note.graphicalVoiceEntries[0].notes[0].getSVGId();
            let noteNEWID = osmd.IDdict[noteID];
            let noteX = note.graphicalVoiceEntries[0].notes[0]
              .getSVGGElement()
              .getBoundingClientRect().x;

            // Check for notehead color
            const colorsArray = json.noteColors.slice();
            const index = colorsArray.findIndex(
              (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
            );
            if (index !== -1) {
              // Note has a color assigned --> color notehead
              // This is for all the notes except the quarter and whole notes
              const svgElement =
                note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              if (
                svgElement &&
                svgElement.children[0] &&
                svgElement.children[0].children[0] &&
                svgElement.children[0].children[1]
              ) {
                // This is for all the quarter and whole notes
                svgElement.children[0].children[0].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
                svgElement.children[0].children[1].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
              }
            }

            // Check for pitch tracking line
            for (let index = 0; index < copy_pitchPositionX.length; index++) {
              if (AUXrecordedNoteIds[index] === noteID) {
                // This note has been recorded
                let midiToStaffStep = midi2StaffGaps(
                  freq2midipitch(json.pitchTrackPoints[index])
                );
                copy_pitchPositionX[index] = noteX;
                copy_pitchPositionY[index] =
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
  }, [props.visualJSON]);

  useEffect(() => {
    updateMetronomeVolume(props.metroVol);
  }, [props.metroVol]);

  useEffect(() => {
    updateBpm(props.bpm);
  }, [props.bpm]);

  useEffect(() => {
    updateTranspose(props.transpose);
  }, [props.transpose]);

  useEffect(() => {
    osmd.zoom = props.zoom;
    osmd.render(); // update the OSMD instance after changing the zoom level
    const renderState = {
      pitchPositionX,
      pitchPositionY,
      colorNotes,
      recordedNoteIDs,
      pitchData,
      recordedNoteIndex,
    };
    const [updatedPitchPositionX, updatedPitchPositionY, updatedNoteIndex] =
      renderPitchLineZoom(osmd, renderState, zoom, showingRep);
    setPitchPositionX(updatedPitchPositionX);
    setPitchPositionY(updatedPitchPositionY);
    setRecordedNoteIndex(updatedNoteIndex);
    zoom = props.zoom; // This forces thta LineChart re-renders the points position
  }, [props.zoom]);

  useEffect(() => {
    if (showingRep < totalReps) {
      showingRep++;
    } else {
      showingRep = 0;
    }

    props.showRepeatsInfo(showingRep, totalReps);
    resetNotesColor();

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
        let noteNEWID = osmd.IDdict[noteID];
        //check for notehead color
        const colorsArray = colorNotes.slice();
        const index = colorsArray.findIndex(
          (item) => item[0][0] === noteNEWID && item[0][2] === showingRep
        );
        if (index !== -1) {
          //note has a color assigned--> color notehead
          // this is for all the notes except the quarter and whole notes
          const svgElement =
            note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
          svgElement.children[0].children[0].children[0].style.fill =
            colorsArray[index][0][1]; // notehead
          if (
            svgElement &&
            svgElement.children[0] &&
            svgElement.children[0].children[0] &&
            svgElement.children[0].children[1]
          ) {
            //this is for all the quarter and whole notes
            svgElement.children[0].children[0].children[0].style.fill =
              colorsArray[index][0][1]; // notehead
            svgElement.children[0].children[1].children[0].style.fill =
              colorsArray[index][0][1]; // notehead
          }
        }
      }
    }
  }, [props.repeatsIterator]);

  useEffect(() => {
    osmd.followCursor = props.followCursor;
  }, [props.followCursor]);

  useEffect(() => {
    if (props.startPitchTrack) {
      if (notePositionX === pitchPositionX[pitchPositionX.length - 1]) {
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
        props.pitchConfidence[props.pitchConfidence.length - 1] < 0.5
      ) {
        // Color turns white/invisible when pitch is out of bounds or pitch confidence is below 0.5
        setColor('#FFFFFF');
      } else {
        setColor('#000000');
      }

      const staveLines =
        document.getElementsByClassName('vf-stave')[
          osmd.cursor.Iterator.currentMeasureIndex
        ];
      const upperLineStave = staveLines.children[0].getBoundingClientRect().top; // upper line
      const middleLineStave =
        staveLines.children[2].getBoundingClientRect().top; // middle line
      const lowerLineStave = staveLines.children[4].getBoundingClientRect().top; // lower line
      const oneStepPixels = Math.abs(upperLineStave - lowerLineStave) / 4 / 2; // steps corresponding to one step in staff

      const noteStaffPositionY =
        middleLineStave + midiToStaffStep * oneStepPixels;

      // Add pitch to array and note identification data
      if (currentGNoteinScorePitch) {
        // Add note ID
        const noteID = currentGNoteinScorePitch.getSVGId();
        setRecordedNoteIDs([...recordedNoteIDs, noteID]);
        setRecordedNoteNEWIDs([...recordedNoteNEWIDs, osmd.IDdict[noteID]]);
        // Add note index
        setRecordedNoteIndex([...recordedNoteIndex, index]);
        // Add pitch data
        setPitchData([...pitchData, props.pitch[props.pitch.length - 1]]);
        // Add pitch confidence data
        setPitchConfidenceData([
          ...pitchConfidenceData,
          props.pitchConfidence[props.pitchConfidence.length - 1],
        ]);
        // Add X position to array
        setPitchPositionX([...pitchPositionX, notePositionX]);
        // Add Y position to array
        setPitchPositionY([...pitchPositionY, noteStaffPositionY]);
        // Add note color
        setPitchColor([...pitchColor, color]);
        // Add current number of repetition
        setRepetitionNumber([...repetitionNumber, totalReps]);
      }
    }
  }, [props.pitch, props.startPitchTrack]);

  useEffect(() => {
    const playbackManager = props.playbackRef.current;
    if (playbackManager) {
      for (const instrument of playbackManager.InstrumentIdMapping.values()) {
        instrument.Volume = props.recordVol;
      }
    }
  }, [props.recordVol]);

  useEffect(() => {
    if (props.isResetButtonPressed) {
      if (props.visual === 'no') {
        setColorNotes([]);
        setRecordedNoteIDs([]);
        setRecordedNoteNEWIDs([]);
        setRecordedNoteIndex([]);
        setPitchData([]);
        setPitchPositionX([]);
        setPitchPositionY([]);
        setPitchColor([]);
        setRepetitionNumber([]);
        resetNotesColor();
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
            let noteNEWID = osmd.IDdict[noteID];
            //check for notehead color
            const colorsArray = colorNotes.slice();
            const index = colorsArray.findIndex(
              (item) => item[0][0] === noteNEWID && item[0][2] === 0
            );
            if (index !== -1) {
              //note has a color assigned--> color notehead
              // this is for all the notes except the quarter and whole notes
              const svgElement =
                note.graphicalVoiceEntries[0].notes[0].getSVGGElement();
              svgElement.children[0].children[0].children[0].style.fill =
                colorsArray[index][0][1]; // notehead
              if (
                svgElement &&
                svgElement.children[0] &&
                svgElement.children[0].children[0] &&
                svgElement.children[0].children[1]
              ) {
                //this is for all the quarter and whole notes
                svgElement.children[0].children[0].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
                svgElement.children[0].children[1].children[0].style.fill =
                  colorsArray[index][0][1]; // notehead
              }
            }
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
          drawPitch={drawPitch.current}
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
