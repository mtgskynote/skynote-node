import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';

const StatsPanel = ({ stats }) => (
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
);

export default StatsPanel;

StatsPanel.propTypes = {
  stats: PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    bpm: PropTypes.number,
    transpose: PropTypes.number,
    stars: PropTypes.number,
    level: PropTypes.number,
    skill: PropTypes.string,
  }),
};
