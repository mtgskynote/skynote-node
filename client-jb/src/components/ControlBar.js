import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ModeToggle from './ModeToggle';
import ShortcutsPanel from './ShortcutsPanel';
import StatsPanel from './StatsPanel';
import IconButtonWithTooltip from './IconButtonWithTooltip';
import ControlBarPopover from './ControlBarPopover';
import RangeInput from './RangeInput';
import ControlBarPanel from './ControlBarPanel';
import RepetitionToggle from './RepetitionToggle';
import {
  allModeIcons,
  practiceModeIcons,
  recordModeIcons,
} from '../utils/controlBarIcons';

const ControlBar = ({
  onTransposeChange,
  onBpmChange,
  onMidiVolumeChange,
  onMetronomeVolumeChange,
  onModeChange,
  onToggleListen,
  onTogglePlay,
  onReset,
  onRecord,
  handleViewAllRecordings,
  isListening,
  isPlaying,
  isRecording,
  isBpmDisabled,
  playbackMode,
  handleShowPopUpWindow,
  handleToggleStats,
  handleToggleInfo,
  showStats,
  showInfo,
  stats,
  practiceMode,
  isMac,
  handleRepeatsIterator,
  repeatsIterator,
  currentRep,
  showToggleRepetition,
}) => {
  const [practiceModeOn, setPracticeModeOn] = useState(true);
  const [initialMidiVolume, setInitialMidiVolume] = useState(
    practiceModeOn ? 50 : 0
  );

  const initialTranspose = 0;
  const initialBpm = 100;
  const initialMetronomeVolume = 0;

  // Sets the current mode state and passes this state up the parent components
  const handleModeChange = (newMode) => {
    setPracticeModeOn(newMode);
    onModeChange(newMode);
  };

  // Handle resetting MIDI volume based on mode
  useEffect(() => {
    setInitialMidiVolume(practiceModeOn ? 50 : 0);
  }, [practiceModeOn]);

  // Ensure that component practice mode state variable reflects parent component's state
  useEffect(() => {
    setPracticeModeOn(practiceMode);
  }, [practiceMode]);

  return (
    <div
      className={`relative  w-1/2 ${
        playbackMode ? 'lg:w-1/2' : 'lg:w-3/5'
      } md:mx-8 md:w-full sm:w-5/6`}
    >
      {playbackMode && (
        <ControlBarPanel show={showStats} stats={stats}>
          <StatsPanel stats={stats} />
        </ControlBarPanel>
      )}
      <ControlBarPanel show={showInfo} stats={stats}>
        <ShortcutsPanel
          playbackMode={playbackMode}
          practiceModeOn={practiceModeOn}
          isMac={isMac}
        />
      </ControlBarPanel>
      <div
        className={`px-4 py-3 bg-blue-400 ${
          showStats ? 'rounded-t-none rounded-b-3xl' : 'rounded-3xl'
        } shadow-md relative z-20 transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center h-full">
          {!playbackMode && (
            <div>
              <ModeToggle
                onModeChange={handleModeChange}
                practiceMode={practiceMode}
              />
            </div>
          )}

          {!playbackMode && (
            <div className="ml-6 h-auto w-0.5 self-stretch bg-white/20"></div>
          )}

          <div className="flex flex-grow justify-around">
            {practiceModeOn
              ? practiceModeIcons(
                  playbackMode,
                  isListening,
                  isPlaying,
                  onReset,
                  onToggleListen,
                  onTogglePlay
                )
                  .filter((modeIcon) =>
                    playbackMode ? modeIcon.showInPlaybackMode : true
                  )
                  .map((modeIcon, index) => (
                    <IconButtonWithTooltip
                      key={index}
                      tooltip={modeIcon.tooltip}
                      onClick={modeIcon.toggle}
                      icon={
                        modeIcon.flag ? modeIcon.iconPause : modeIcon.iconPlay
                      }
                      className="text-white"
                    />
                  ))
              : recordModeIcons(isRecording, onRecord).map(
                  (modeIcon, index) => (
                    <IconButtonWithTooltip
                      key={index}
                      tooltip={modeIcon.tooltip}
                      onClick={modeIcon.toggle}
                      icon={modeIcon.icon}
                      className={`${
                        isRecording && modeIcon.tooltip === 'Stop Recording'
                          ? 'text-red-500'
                          : 'text-white'
                      }`}
                    />
                  )
                )}
            {allModeIcons(
              playbackMode,
              practiceModeOn,
              isBpmDisabled,
              initialTranspose,
              initialBpm,
              initialMetronomeVolume,
              initialMidiVolume,
              onTransposeChange,
              onBpmChange,
              onMetronomeVolumeChange,
              onMidiVolumeChange,
              handleToggleStats,
              handleToggleInfo
            )
              .filter((modeIcon) =>
                playbackMode
                  ? modeIcon.showInPlaybackMode
                  : modeIcon.showInInteractiveMode
              )
              .map((modeIcon, index) =>
                modeIcon.tooltip === 'Stats' ||
                modeIcon.tooltip === 'Shortcuts' ? (
                  <IconButtonWithTooltip
                    key={index}
                    tooltip={modeIcon.tooltip}
                    onClick={modeIcon.toggle}
                    icon={modeIcon.icon}
                    className="text-white"
                  />
                ) : (
                  <ControlBarPopover key={index}>
                    {/* Popover trigger */}
                    <IconButtonWithTooltip
                      tooltip={modeIcon.tooltip}
                      onClick={() => {}}
                      icon={modeIcon.icon}
                      className="text-white"
                    />

                    {/* Popover content */}
                    <div>
                      {modeIcon.labels.map((label, index) => (
                        <RangeInput
                          key={index}
                          label={label}
                          min={modeIcon.mins[index]}
                          max={modeIcon.maxs[index]}
                          initial={modeIcon.initials[index]}
                          onValueChange={modeIcon.onChanges[index]}
                          disabled={modeIcon.slidersDisabled[index]}
                        />
                      ))}
                    </div>
                  </ControlBarPopover>
                )
              )}
          </div>

          <div className="mr-6 h-auto w-0.5 self-stretch bg-white/20"></div>

          <div className="flex justify-between items-center space-x-4">
            {(playbackMode || showToggleRepetition) && (
              <RepetitionToggle
                onToggle={handleRepeatsIterator}
                repetitionNumber={currentRep}
                isToggled={repeatsIterator}
                isPlaying={isPlaying}
              />
            )}
            {(() => {
              let handler,
                buttonText,
                textColor,
                hoverTextColor,
                bgColor,
                hoverBgColor;
              if (!playbackMode) {
                handler = handleViewAllRecordings;
                buttonText = 'View All Recordings';
                textColor = 'text-gray-700';
                hoverTextColor = 'text-gray-900';
                bgColor = 'bg-slate-50';
                hoverBgColor = 'bg-slate-100';
              } else {
                handler = handleShowPopUpWindow;
                buttonText = 'Delete recording';
                textColor = 'text-white';
                hoverTextColor = 'text-white';
                bgColor = 'bg-red-500';
                hoverBgColor = 'bg-red-600';
              }

              return (
                <button
                  onClick={handler}
                  className={`hover:cursor-pointer transition ease-in-out delay-50 text-center ${textColor} hover:${hoverTextColor} border-transparent focus:border-transparent focus:ring-0 focus:outline-none ${bgColor} hover:${hoverBgColor} font-semibold py-1 px-2 rounded-l-none outline-none rounded`}
                >
                  {buttonText}
                </button>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

ControlBar.propTypes = {
  onTransposeChange: PropTypes.func.isRequired,
  onBpmChange: PropTypes.func.isRequired,
  onMidiVolumeChange: PropTypes.func.isRequired,
  onMetronomeVolumeChange: PropTypes.func.isRequired,
  onModeChange: PropTypes.func,
  onToggleListen: PropTypes.func,
  onTogglePlay: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onRecord: PropTypes.func,
  handleViewAllRecordings: PropTypes.func.isRequired,
  isListening: PropTypes.bool,
  isPlaying: PropTypes.bool.isRequired,
  isRecording: PropTypes.bool,
  isBpmDisabled: PropTypes.bool,
  playbackMode: PropTypes.bool.isRequired,
  handleShowPopUpWindow: PropTypes.func,
  handleToggleStats: PropTypes.func,
  handleToggleInfo: PropTypes.func.isRequired,
  showStats: PropTypes.bool,
  showInfo: PropTypes.bool.isRequired,
  stats: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    bpm: PropTypes.number,
    stars: PropTypes.number,
    level: PropTypes.number,
    skill: PropTypes.string,
    transpose: PropTypes.number,
  }),
  practiceMode: PropTypes.bool.isRequired,
  isMac: PropTypes.bool.isRequired,
  handleRepeatsIterator: PropTypes.func.isRequired,
  repeatsIterator: PropTypes.bool.isRequired,
  currentRep: PropTypes.number.isRequired,
  showToggleRepetition: PropTypes.bool.isRequired,
};

export default ControlBar;
