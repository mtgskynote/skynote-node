import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  deleteRecording,
  editRecording,
} from '../utils/studentRecordingMethods';
import {
  CardContent,
  Typography,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import StarRating from './StarRating';
import PopUpWindow from './PopUpWindow';

/**
 * The RecordingCard component displays information about a recording and provides options to view, edit, or delete it.
 *
 * Props:
 * - recordingName (string): The name of the recording.
 * - skill (string): The skill level associated with the recording.
 * - stars (number): The star rating of the recording.
 * - xml (string): The XML path for the recording.
 * - recordingId (string): The unique identifier for the recording.
 * - recordingDate (string): The date of the recording.
 * - onDeleteRecording (function): Callback to handle recording deletion.
 * - width (string): The width of the recording card.
 * - backgroundColour (string): The background color of the recording card.
 * - hoverBackgroundColour (string): The background color of the recording card on hover.
 * - textColour (string): The text color of the recording card.
 * - onEditRecording (function): Callback to handle recording name edits.
 *
 * The component:
 * - Uses useState to manage the visibility of edit and delete pop-up windows, the new recording name, warnings, and loading states.
 * - Provides functions to handle viewing, editing, and deleting recordings.
 */
const RecordingCard = ({
  recordingName,
  skill,
  stars,
  xml,
  recordingId,
  recordingDate,
  onDeleteRecording,
  width,
  backgroundColour,
  hoverBackgroundColour,
  textColour,
  onEditRecording,
}) => {
  const [showEditPopUpWindow, setShowEditPopUpWindow] = useState(false);
  const [showDeletePopUpWindow, setShowDeletePopUpWindow] = useState(false);
  const [newRecordingName, setNewRecordingName] = useState(recordingName);
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showEditLoading, setShowEditLoading] = useState(false);
  const [showDeleteLoading, setShowDeleteLoading] = useState(false);
  const navigate = useNavigate();

  // Set defaults
  const xSize = width ? width : '290px';
  const bColour = backgroundColour ? backgroundColour : 'bg-blue-400';
  const hoverColour = hoverBackgroundColour
    ? hoverBackgroundColour
    : 'hover:bg-blue-500';
  const tColour = textColour ? textColour : 'text-white';

  // Navigate to the ListRecordings route with the provided xml and recordingId
  const handleViewRecording = async () => {
    navigate(`/ListRecordings/${xml}`, { state: { id: recordingId } });
  };

  // Handle opening the delete recording popup window
  const handleShowEditPopUpWindow = () => {
    setShowEditPopUpWindow(true);
  };

  // Handle closing the delete recording popup window
  const handleHideEditPopUpWindow = () => {
    setShowEditPopUpWindow(false);
    setTimeout(() => {
      setNewRecordingName(recordingName);
      setShowEditWarning(false);
    }, 1000);
  };

  // Set new recording name whenever the user input changes
  const handleRenameRecording = (e) => {
    setNewRecordingName(e.target.value);
  };

  // Update recording name in the database
  const handleUpdateRecordingName = () => {
    if (newRecordingName !== '' && newRecordingName !== recordingName) {
      setShowEditWarning(false);
      setShowEditLoading(true);
      editRecording(recordingId, newRecordingName).then(() => {
        onEditRecording(recordingName, newRecordingName);
        setNewRecordingName(newRecordingName);
        setShowEditPopUpWindow(false);
        setShowEditLoading(false);
      });
    } else if (newRecordingName === recordingName) {
      setShowEditWarning(false);
      setShowEditPopUpWindow(false);
    } else {
      setShowEditWarning(true);
    }
  };

  // Open the delete recording popup window
  const handleShowDeletePopUpWindow = () => {
    setShowDeletePopUpWindow(true);
  };

  // Close the delete recording popup window
  const handleHideDeletePopUpWindow = () => {
    setShowDeletePopUpWindow(false);
  };

  // Delete recording from the database
  const handleDeleteRecording = () => {
    setShowDeleteLoading(true);
    deleteRecording(recordingId)
      .then(() => {
        onDeleteRecording(recordingId);
        setShowDeletePopUpWindow(false);
        setShowDeleteLoading(false);
      })
      .catch((error) => {
        console.log(`Cannot delete recording from database: ${error}`);
        setShowDeleteLoading(false);
        setShowDeleteWarning(true);
      });
  };

  return (
    <div>
      <div className="flex">
        <div
          className={`relative transition ease-in-out delay-50 rounded overflow-hidden shadow-md hover:shadow-lg ${bColour} ${hoverColour} hover:cursor-pointer mb-3`}
          style={{ width: xSize, aspectRatio: '3 / 2' }}
          onClick={handleViewRecording}
        >
          <CardContent>
            <div
              className={`flex justify-between items-start ${tColour} align-text-top`}
            >
              <div className="overflow-hidden">
                <Typography
                  variant="h5"
                  component="div"
                  className={`font-bold text-clip sm:text-lg md:text-lg lg:text-lg xl:text-xl whitespace-normal mr-6 max-w-36`}
                >
                  {recordingName}
                </Typography>
              </div>
              <div></div>
              <div
                className={`sm:text-xs md:text-xs lg:text-xs xl:text-sm font-extralight p-1 rounded align-right`}
              >
                {recordingDate}
              </div>
            </div>

            <div className="whitespace-normal w-fit">
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                className={`${tColour} sm:text-xs md:text-xs lg:text-xs xl:text-sm`}
              >
                {skill}
              </Typography>
            </div>
            <div className="absolute inset-x-0 bottom-0 w-full p-3 flex align-text-bottom">
              <StarRating
                stars={stars}
                size={'sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl'}
              />
              <div className="grid grid-cols-2 ml-auto">
                <Tooltip placement="bottom" title="Edit" arrow>
                  <IconButton
                    className="text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowEditPopUpWindow();
                    }}
                  >
                    <EditIcon className="text-3xl" />
                  </IconButton>
                </Tooltip>
                <Tooltip placement="bottom" title="Delete" arrow>
                  <IconButton
                    className="text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShowDeletePopUpWindow();
                    }}
                  >
                    <DeleteIcon className="text-3xl" />
                  </IconButton>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Edit Pop Up Window */}
      <PopUpWindow isOpen={showEditPopUpWindow}>
        <div className="relative">
          {showEditLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
              <CircularProgress />
            </div>
          )}
          <div className={`mb-4 ${showEditLoading ? 'opacity-50' : ''}`}>
            <label className="block text-gray-700 mb-2" htmlFor="recordingName">
              Edit recording name:
            </label>
            <input
              type="text"
              id="recordingName"
              value={newRecordingName}
              onChange={handleRenameRecording}
              className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={showEditLoading}
            />
            {showEditWarning && (
              <div className="bg-red-100 text-red-700 text-sm py-1 px-2 mb-4 rounded-lg flex justify-center items-center transition duration-300 ease-in-out">
                <p className="m-0">Recording name cannot be empty</p>
              </div>
            )}
          </div>
          <div className="flex justify-between space-x-2">
            <button
              onClick={handleHideEditPopUpWindow}
              className="bg-slate-50 border-solid border-slate-500 outline-none text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out w-full"
              disabled={showEditLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdateRecordingName}
              className="bg-green-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out w-full"
              disabled={showEditLoading}
            >
              Confirm
            </button>
          </div>
        </div>
      </PopUpWindow>

      {/* Delete Pop Up Window */}
      <PopUpWindow isOpen={showDeletePopUpWindow}>
        <div className="relative">
          {showDeleteLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
              <CircularProgress />
            </div>
          )}
          <div className={`${showDeleteLoading ? 'opacity-50' : ''}`}>
            {showDeleteWarning && (
              <div className="bg-red-100 text-red-700 text-sm py-1 px-2 mb-4 rounded-lg flex justify-center items-center transition duration-300 ease-in-out">
                <p className="m-0">Could not delete {recordingName}.</p>
              </div>
            )}
            <p className="text-xl font-extrabold text-gray-800 mb-1">
              Are you sure you want to delete <span>{recordingName}</span>?
            </p>
            <p className="text-gray-600 mb-4">
              This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={handleHideDeletePopUpWindow}
                className="bg-slate-50 border-solid border-slate-500 outline-none text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out w-full"
                disabled={showDeleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRecording}
                className="bg-red-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out w-full"
                disabled={showDeleteLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </PopUpWindow>
    </div>
  );
};

RecordingCard.propTypes = {
  recordingName: PropTypes.string.isRequired,
  skill: PropTypes.string,
  stars: PropTypes.number.isRequired,
  xml: PropTypes.string.isRequired,
  recordingId: PropTypes.string.isRequired,
  recordingDate: PropTypes.string.isRequired,
  onDeleteRecording: PropTypes.func.isRequired,
  width: PropTypes.string,
  backgroundColour: PropTypes.string,
  hoverBackgroundColour: PropTypes.string,
  textColour: PropTypes.string,
  onEditRecording: PropTypes.func.isRequired,
};

export default RecordingCard;
