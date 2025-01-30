import {
  PlayCircle as PlayIcon,
  PauseCircle as PauseIcon,
  RadioButtonChecked as RecordIcon,
  ImportExport as TransposeIcon,
  AccessTime as BpmIcon,
  VolumeUp as VolumeIcon,
  Hearing as ListenIcon,
  HearingDisabled as ListenPauseIcon,
  RestartAlt as ResetIcon,
  Equalizer as StatsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

export const allModeIcons = (
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
) => [
  {
    tooltip: 'Transpose',
    icon: <TransposeIcon className="text-4xl" />,
    labels: ['Transpose'],
    mins: [-12],
    maxs: [12],
    initials: [initialTranspose],
    onChanges: [onTransposeChange],
    slidersDisabled: practiceModeOn ? [false] : [isBpmDisabled],
    showInPlaybackMode: false,
    showInInteractiveMode: true,
  },
  {
    tooltip: 'Metronome',
    icon: <BpmIcon className="text-4xl" />,
    labels: playbackMode ? ['Volume'] : ['BPM', 'Volume'],
    mins: playbackMode ? [0] : [30, 0],
    maxs: playbackMode ? [100] : [200, 100],
    initials: playbackMode
      ? [initialMetronomeVolume]
      : [initialBpm, initialMetronomeVolume],
    onChanges: playbackMode
      ? [onMetronomeVolumeChange]
      : [onBpmChange, onMetronomeVolumeChange],
    slidersDisabled: playbackMode ? [false] : [isBpmDisabled, false],
    showInPlaybackMode: true,
    showInInteractiveMode: true,
  },
  {
    tooltip: 'MIDI Volume',
    icon: <VolumeIcon className="text-4xl" />,
    labels: ['Volume'],
    mins: [0],
    maxs: [100],
    initials: [initialMidiVolume],
    onChanges: [onMidiVolumeChange],
    slidersDisabled: practiceModeOn ? [false] : [true],
    showInPlaybackMode: false,
    showInInteractiveMode: true,
  },
  {
    tooltip: 'Stats',
    icon: <StatsIcon className="text-4xl" />,
    toggle: handleToggleStats,
    showInPlaybackMode: true,
    showInInteractiveMode: false,
  },
  {
    tooltip: 'Shortcuts',
    icon: <InfoIcon className="text-4xl" />,
    toggle: handleToggleInfo,
    showInPlaybackMode: true,
    showInInteractiveMode: true,
  },
];

export const practiceModeIcons = (
  playbackMode,
  isListening,
  isPlaying,
  onReset,
  onToggleListen,
  onTogglePlay
) => [
  {
    tooltip: 'Reset',
    iconPlay: <ResetIcon className="text-4xl" />,
    iconPause: <ResetIcon className="text-4xl" />,
    toggle: onReset,
    showInPlaybackMode: true,
  },
  {
    tooltip: isListening ? 'Stop Listening' : 'Listen',
    iconPlay: <ListenIcon className="text-4xl" />,
    iconPause: <ListenPauseIcon className="text-4xl" />,
    toggle: onToggleListen,
    flag: isListening,
    showInPlaybackMode: false,
  },
  {
    tooltip: playbackMode
      ? isPlaying
        ? 'Pause'
        : 'Play'
      : isPlaying
      ? 'Stop Practicing'
      : 'Practice',
    iconPlay: <PlayIcon className="text-4xl" />,
    iconPause: <PauseIcon className="text-4xl" />,
    toggle: onTogglePlay,
    flag: isPlaying,
    showInPlaybackMode: true,
  },
];

export const recordModeIcons = (isRecording, onRecord) => [
  {
    tooltip: isRecording ? 'Stop Recording' : 'Record',
    icon: <RecordIcon className="text-4xl" />,
    toggle: onRecord,
  },
];
