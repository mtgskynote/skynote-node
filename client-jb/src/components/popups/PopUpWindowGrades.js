import React from 'react';
import PropTypes from 'prop-types';
import PopUpWindow from './PopUpWindow';
import ButtonNoOutline from '../buttons/ButtonNoOutline';

const PopUpWindowGrades = ({ isOpen, comment, grade, score, handleClose }) => {
  return (
    <PopUpWindow isOpen={isOpen} onClose={handleClose}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-grow text-xl font-semibold mr-8">
            Grades for {score.title}
          </div>
          <ButtonNoOutline
            handler={handleClose}
            bgColor="red-500"
            hoverBgColor="red-600"
            textColor="white"
            text="Close"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Comment
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {comment ? comment : 'N/A'}
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Grade
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {grade ? grade : 'Ungraded'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PopUpWindow>
  );
};

PopUpWindowGrades.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  comment: PropTypes.string,
  grade: PropTypes.number,
  score: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default PopUpWindowGrades;
