import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getRecData } from '../../utils/studentRecordingMethods.js';
import { updateAssignment } from '../../utils/assignmentsMethods.js';
import PopUpWindow from './PopUpWindow.js';
import StarRating from '../charts/StarRating.js';
import ButtonNoOutline from '../buttons/ButtonNoOutline.js';

const PopUpWindowSubmit = ({
  isOpen,
  handleClose,
  score,
  assignmentId,
  userId,
}) => {
  const [recordings, setRecordings] = useState(null);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const fetchRecordings = () => {
    const tempRecordings = [];
    getRecData(userId, score._id)
      .then((result) => {
        result.forEach((recording) => {
          tempRecordings.push({
            name: recording.recordingName,
            id: recording.recordingId,
            stars: recording.recordingStars,
            date: new Date(recording.recordingDate).toLocaleDateString(
              'en-UK',
              options
            ),
          });
        });
        setRecordings(tempRecordings);
      })
      .catch((error) => {
        console.log(`Cannot get recordings from database: ${error}`);
      });
  };

  const handleSubmitRecording = (recordingId) => {
    updateAssignment(assignmentId, userId, score._id, recordingId).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    if (
      userId !== null &&
      userId !== undefined &&
      score !== null &&
      score !== undefined
    ) {
      fetchRecordings();
    }
  }, [userId, score]);

  return (
    <PopUpWindow isOpen={isOpen} onClose={handleClose}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-grow text-xl font-semibold mr-8">
          Submit a recording for {score.title}
        </div>
        <ButtonNoOutline
          handler={handleClose}
          bgColor="red-500"
          hoverBgColor="red-600"
          textColor="white"
          text="Close"
        />
      </div>
      {recordings ? (
        <table className="table-auto w-full border-solid border border-2">
          <thead>
            <tr className="border-solid border border-2 border-blue-400">
              <th className="text-white bg-blue-500 border-none px-4 py-2">
                Recording Name
              </th>
              <th className="text-white bg-blue-500 border-none px-4 py-2">
                Recording Date
              </th>
              <th className="text-white bg-blue-500 border-none px-4 py-2">
                Stars Achieved
              </th>
              <th className="text-white bg-blue-500 border-none px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {recordings.map((recording, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="border-none px-4 py-2 text-left">
                  {recording.name}
                </td>
                <td className="border-none px-4 py-2 text-left">
                  {recording.date}
                </td>
                <td className="border-none px-4 py-2 text-left">
                  <StarRating stars={recording.stars} />
                </td>
                <td className="border-none px-4 py-2 text-left">
                  <ButtonNoOutline
                    handler={() => handleSubmitRecording(recording.id)}
                    bgColor="blue-500"
                    hoverBgColor="blue-600"
                    textColor="white"
                    text="Submit"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No recordings for this score.</p>
      )}
    </PopUpWindow>
  );
};

PopUpWindowSubmit.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  score: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  assignmentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default PopUpWindowSubmit;
