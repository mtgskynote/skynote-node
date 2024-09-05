import React from 'react';

/**
 * The ListRecordingsHeader component displays a header with a title, skill, and level for a list of recordings.
 *
 * Props:
 * - title (string): The title of the recordings list.
 * - skill (string): The skill level associated with the recordings.
 * - level (number): The level associated with the recordings.
 */
const ListRecordingsHeader = ({ title, skill, level }) => {
  return (
    <div>
      <div className="flex items-center justify-between mt-12">
        {/* Left side: Title */}
        <div className="text-2xl font-bold capitalize">{title}</div>

        {/* Right side: Skill and Level */}
        <div className="text-lg text-gray-600 text-right">
          <div>{skill}</div>
          <div>Level {level}</div>
        </div>
      </div>
      <hr className="h-0.5 border-t-0 bg-gray-700 mb-10" />
    </div>
  );
};

ListRecordingsHeader.propTypes = {
  title: PropTypes.string.isRequired,
  skill: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
};

export default ListRecordingsHeader;
