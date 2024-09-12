import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import GradingIcon from '@mui/icons-material/Grading';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import UploadIcon from '@mui/icons-material/Upload';
import { IconButton, Tooltip } from '@mui/material';
import PopUpWindowGrades from './PopUpWindowGrades';
import PopUpWindowSubmit from './PopUpWindowSubmit';

const AssignmentTaskCard = ({ task, score, assignmentId, userId }) => {
  const [status, setStatus] = useState('');
  const [showGradesPopUpWindow, setShowGradesPopUpWindow] = useState(false);
  const [showSubmitPopUpWindow, setShowSubmitPopUpWindow] = useState(false);
  const navigate = useNavigate();

  const statusColors = {
    submitted: 'bg-green-500 text-white',
    unsubmitted: 'bg-yellow-500 text-white',
  };

  useEffect(() => {
    const status = task.answer ? 'submitted' : 'unsubmitted';
    setStatus(status);
  }, [task]);

  // Navigate to a specific recording submission
  const handleViewSubmission = () => {
    navigate(`/ListRecordings/${score.fname}`, {
      state: { id: task.answer.recordingId },
    });
  };

  // Handle navigation to ProgressPlayFile for a specific score to record a task
  const handleRecordTask = () => {
    navigate(`/all-lessons/${score.fname}`);
  };

  // Open the grades pop-up window
  const handleOpenGradesPopUpWindow = () => {
    setShowGradesPopUpWindow(true);
  };

  // Close the grades pop-up window
  const handleCloseGradesPopUpWindow = () => {
    setShowGradesPopUpWindow(false);
  };

  // Open the submit pop-up window
  const handleOpenSubmitPopUpWindow = () => {
    setShowSubmitPopUpWindow(true);
  };

  // Close the submit pop-up window
  const handleCloseSubmitPopUpWindow = () => {
    setShowSubmitPopUpWindow(false);
  };

  return (
    <div className="min-w-[250px] bg-blue-300 py-3 px-4 rounded-lg shadow-md flex flex-col">
      <div className="text-2xl font-extrabold text-white">{score.title}</div>
      <div className="text-base text-white opacity-75 mb-0">{score.skill}</div>
      <div className="text-base text-white opacity-75">Level {score.level}</div>
      <div className="flex justify-between items-center pt-2 mt-auto">
        <span
          className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[status]} uppercase`}
        >
          {status}
        </span>
        <div className="flex text-gray-600">
          <Tooltip
            title={task.answer ? 'View Submission' : 'Record Task'}
            arrow
          >
            <IconButton
              onClick={task.answer ? handleViewSubmission : handleRecordTask}
            >
              {task.answer ? (
                <ExitToAppIcon className="text-white" />
              ) : (
                <KeyboardVoiceIcon className="text-white" />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip
            title={task.answer ? 'View Grades' : 'Upload Recording'}
            arrow
          >
            <IconButton
              onClick={
                task.answer
                  ? handleOpenGradesPopUpWindow
                  : handleOpenSubmitPopUpWindow
              }
            >
              {task.answer ? (
                <GradingIcon className="text-white" />
              ) : (
                <UploadIcon className="text-white" />
              )}
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <PopUpWindowGrades
        isOpen={showGradesPopUpWindow}
        comment={task.answer?.comment}
        grade={task.answer?.grade}
        score={score}
        handleClose={handleCloseGradesPopUpWindow}
      />
      <PopUpWindowSubmit
        isOpen={showSubmitPopUpWindow}
        handleClose={handleCloseSubmitPopUpWindow}
        score={score}
        assignmentId={assignmentId}
        userId={userId}
      />
    </div>
  );
};

AssignmentTaskCard.propTypes = {
  task: PropTypes.shape({
    answer: PropTypes.shape({
      recordingId: PropTypes.string,
      comment: PropTypes.string,
      grade: PropTypes.number,
    }),
  }).isRequired,
  score: PropTypes.shape({
    fname: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    skill: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
  }).isRequired,
  assignmentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default AssignmentTaskCard;
