import React from 'react';
import ControlBarPanel from './ControlBarPanel';
import StarRating from './StarRating';

/**
 * The ControlBarStatsPanel component displays a panel with statistical information for the ControlBar component.
 *
 * Props:
 * - showStats (boolean): Determines whether to show the stats panel.
 * - stats (object): Contains the statistical data to display, including:
 *   - name (string): Name of the recording.
 *   - date (string): Date of the recording.
 *   - bpm (number): Beats per minute.
 *   - transpose (number): Transpose value.
 *   - stars (number): Star rating of the recording.
 *   - level (number): Skill level of the score.
 *   - skill (string): Skill description of the score.
 *
 * The component uses:
 * - ControlBarPanel to conditionally display the stats.
 * - StarRating to display the star rating.
 */
const ControlBarStatsPanel = ({ showStats, stats }) => {
  return (
    <ControlBarPanel show={showStats}>
      <div className="flex justify-between">
        <div>
          <p className="text-white font-bold text-2xl mb-0">{stats.name}</p>
          <p className="text-white opacity-75 mb-3">
            {stats.date} | {stats.bpm} BPM | {stats.transpose > 0 ? '+' : ''}
            {stats.transpose} Transpose
          </p>
          <StarRating size="text-3xl" stars={stats.stars} />
        </div>
        <div>
          <p className="text-white font-bold text-xl mb-0 text-right">
            Level {stats.level}
          </p>
          <p className="text-white opacity-75">{stats.skill}</p>
        </div>
      </div>
    </ControlBarPanel>
  );
};

export default ControlBarStatsPanel;
