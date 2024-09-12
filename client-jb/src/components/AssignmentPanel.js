import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AssignmentTaskCard from './AssignmentTaskCard';

const AssignmentPanel = ({
  dueDate,
  postedDate,
  tasks,
  message,
  scoresData,
  assignmentId,
  userId,
}) => {
  const [status, setStatus] = useState('');

  // Set colors for different statuses
  const statusColors = {
    late: 'bg-red-500 text-white',
    unsubmitted: 'bg-yellow-500 text-white',
    submitted: 'bg-green-500 text-white',
    none: 'bg-gray-500 text-white',
  };

  // Format dates for posted and due dates
  const formatDate = (date) => {
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };

    return new Date(date).toLocaleDateString('en-UK', options);
  };

  // Calculate the label of an assignment based on due date and task completionz
  useEffect(() => {
    const allSubmitted = tasks.every((task) => {
      return task.answer;
    });

    if (tasks.length === 0) setStatus('none');
    else if (dueDate < new Date().toISOString() && !allSubmitted)
      setStatus('late');
    else if (dueDate > new Date().toISOString() && !allSubmitted)
      setStatus('unsubmitted');
    else if (allSubmitted) setStatus('submitted');
  }, [tasks]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col space-y-2">
      {/* Header - status tag, due date, and posted date */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-sm font-semibold ${statusColors[status]} uppercase`}
          >
            {status}
          </span>
          <span className="px-2 py-1 rounded-full bg-gray-400 text-white text-sm">
            Due: {formatDate(dueDate)}
          </span>
        </div>
        <span className="px-2 py-1 rounded-full bg-gray-400 text-white text-sm">
          Posted: {formatDate(postedDate)}
        </span>
      </div>
      {/* Message from teacher */}
      <div className="bg-gray-100 text-gray-700 p-4 rounded-lg shadow-inner">
        {message}
      </div>
      {/* Task cards - each task assigned by a teacher for a specific assignment */}
      <div className="flex space-x-4 overflow-x-auto py-2">
        {tasks.map((task, index) => {
          const score = scoresData.find((score) => score._id === task.score);
          return (
            <AssignmentTaskCard
              key={index}
              task={task}
              score={score}
              assignmentId={assignmentId}
              userId={userId}
            />
          );
        })}
      </div>
    </div>
  );
};

AssignmentPanel.propTypes = {
  dueDate: PropTypes.string.isRequired,
  postedDate: PropTypes.string.isRequired,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
      score: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
      answers: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
          studentId: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
          recordingId: PropTypes.string,
          grade: PropTypes.number,
          comment: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  message: PropTypes.string,
  scoresData: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
    })
  ).isRequired,
  assignmentId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
};

export default AssignmentPanel;
