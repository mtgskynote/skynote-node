import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';

const Message = ({ content, date, seen, isCurrentUser }) => {
  return (
    <div
      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div
        className={`max-w-xs md:max-w-md p-2 rounded-lg shadow-md ${
          isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-50 text-black'
        }`}
      >
        <div>{content}</div>
        <div
          className={`text-xs flex ${
            isCurrentUser ? 'justify-end' : 'justify-start'
          }`}
        >
          <div className="flex items-center justify-center h-full">
            <span className="opacity-50">{date}</span>
            {isCurrentUser && seen && (
              <span className="ml-1">
                <DoneAllIcon className="text-base text-green-500" />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;