import React from 'react';
import PropTypes from 'prop-types';

const ShortcutsPanel = ({ playbackMode, practiceModeOn, isMac }) => (
  <div className={`${practiceModeOn ? 'pb-2' : 'pb-8'}`}>
    <p className="font-bold text-white text-2xl mb-3">Shortcuts</p>
    <div className="flex justify-between space-x-4">
      <div>
        {(playbackMode || practiceModeOn) && (
          <div>
            <span className="text-white font-bold">
              {isMac ? 'Command' : 'Ctrl'} + Shift + R:{' '}
            </span>
            <span className="text-white opacity-75">Reset</span>
          </div>
        )}
        <div>
          <span className="text-white font-bold">
            {playbackMode ? `S: ` : `M: `}
          </span>
          <span className="text-white opacity-75">
            {playbackMode ? 'Toggle Stats' : 'Switch Modes'}
          </span>
        </div>
      </div>
      <div>
        {!playbackMode && practiceModeOn && (
          <div>
            <span className="text-white font-bold">L: </span>
            <span className="text-white opacity-75">Toggle Listen</span>
          </div>
        )}
        {practiceModeOn && (
          <div>
            <span className="text-white font-bold">P: </span>
            <span className="text-white opacity-75">
              {playbackMode ? 'Toggle Playback' : 'Toggle Practice'}
            </span>
          </div>
        )}
        {!playbackMode && !practiceModeOn && (
          <div>
            <span className="text-white font-bold">R: </span>
            <span className="text-white opacity-75">Toggle Record</span>
          </div>
        )}
      </div>
      <div>
        <div>
          <span className="text-white font-bold">I: </span>
          <span className="text-white opacity-75">View Shortcuts</span>
        </div>
      </div>
    </div>
  </div>
);

ShortcutsPanel.propTypes = {
  playbackMode: PropTypes.bool.isRequired,
  practiceModeOn: PropTypes.bool.isRequired,
  isMac: PropTypes.bool.isRequired,
};

export default ShortcutsPanel;
