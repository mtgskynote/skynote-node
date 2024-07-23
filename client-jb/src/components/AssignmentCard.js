import React from 'react'
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

const AssignmentCard = ({ assignmentId, daysLeft, dueDate, score }) => {
  const dateOptions = {
    weekDay: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }
  const navigate = useNavigate()

  const handleRecord = () => {
    navigate(`/all-lessons/${score.fname}`)
  }

  const handleSeeMore = () => {
    navigate(`/assignments/#${assignmentId}`)
  }

  return (
    <Card
      className={`h-48 w-80 max-w-sm relative rounded overflow-hidden shadow-md hover:shadow-lg bg-blue-300 text-white`}
    >
      <CardContent className="flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center text-sm">
            <div className="overflow-hidden">
              <div
                className={`${
                  daysLeft < 0 ? 'bg-red-500' : 'bg-orange-500'
                } py-1 px-2 rounded`}
              >
                {daysLeft < 0 ? 'LATE' : 'UNSUBMITTED'}
              </div>
            </div>
            <div className="overflow-hidden">
              <div className="bg-gray-500 py-1 px-2 rounded">
                Due {dueDate.toLocaleString('en-UK', dateOptions)}
              </div>
            </div>
          </div>
          <div className="whitespace-normal flex mt-2.5">
            <div className="overflow-hidden font-bold text-2xl">
              {score.title}
            </div>
          </div>
          <div className="whitespace-normal flex text-slate-50 text-md">
            {score.skill} | {score.level}
          </div>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <div
            onClick={handleRecord}
            className="hover:cursor-pointer transition ease-in-out delay-50 flex-grow text-center text-gray-800 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-blue-100 font-extralight hover:font-bold py-1 px-4 rounded-l-none outline-none rounded hover:cursor"
          >
            Record
          </div>
          <div className="w-2"></div>
          <div
            onClick={handleSeeMore}
            className="hover:cursor-pointer transition ease-in-out delay-50 flex-grow text-center text-gray-800 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-blue-100 font-extralight hover:font-bold py-1 px-4 rounded-r-none outline-none rounded hover:cursor"
          >
            See more
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

AssignmentCard.propTypes = {
  assignmentId: PropTypes.string.isRequired,
  daysLeft: PropTypes.number.isRequired,
  dueDate: PropTypes.instanceOf(Date).isRequired,
  score: PropTypes.shape({
    fname: PropTypes.string, // Assuming fname is a string. Adjust based on actual data structure
    title: PropTypes.string.isRequired,
    skill: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
  }).isRequired,
};

export default AssignmentCard
