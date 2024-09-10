import React, { useState, useEffect } from 'react';
import AssignmentTaskCard from './AssignmentTaskCard';

const AssignmentPanel = ({
  dueDate,
  postedDate,
  tasks,
  scoresData,
  assignmentId,
  userId,
}) => {
  const [status, setStatus] = useState('');

  const statusColors = {
    late: 'bg-red-500 text-white',
    unsubmitted: 'bg-yellow-500 text-white',
    submitted: 'bg-green-500 text-white',
  };

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

  useEffect(() => {
    const allSubmitted = tasks.every((task) => {
      return task.answer;
    });

    if (dueDate < new Date().toISOString() && !allSubmitted) setStatus('late');
    else if (dueDate > new Date().toISOString() && !allSubmitted)
      setStatus('unsubmitted');
    else if (allSubmitted) setStatus('submitted');
  }, [tasks]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 flex flex-col space-y-2">
      <div className="flex justify-between items-start">
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
      {/* ADD MESSAGE HERE :D */}
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

export default AssignmentPanel;
