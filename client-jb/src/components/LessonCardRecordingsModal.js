import React from 'react';
import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material';
import { LinearProgress, CircularProgress } from '@mui/material';
import AudioPlayerIcon from './AudioPlayerIcon';
import StarRating from './StarRating';

/**
 * The LessonCardRecordingsModal component displays a modal with a list of recordings for a score.
 *
 * Props:
 * - open (boolean): Controls the visibility of the modal.
 * - handleCloseRecordingsModal (function): Callback to close the modal.
 * - ref (object): Reference to the modal element.
 * - loading (boolean): Indicates if the recordings are being loaded.
 * - recordingsAudio (object): Audio data for the recordings.
 * - title (string): The title of the lesson.
 * - tColour (string): Tailwind CSS class for text color.
 * - allRecordings (array): List of all recordings.
 * - playingAudioId (string): ID of the currently playing audio.
 * - handleAudioPlay (function): Callback to handle audio play.
 * - handleViewRecording (function): Callback to view a recording.
 * - handleDeleteRecording (function): Callback to delete a recording.
 * - deletingRecording (boolean): Indicates if a recording is being deleted.
 * - deletionStatus (string): Status of the deletion operation.
 * - xml (string): Link to the recording of the score.
 *
 * The component:
 * - Renders a table with recordings, including name, date, stars, and action buttons.
 * - Provides buttons to view and delete recordings.
 * - Shows a progress bar and status message during deletion.
 */
const LessonCardRecordingsModal = ({
  open,
  handleCloseRecordingsModal,
  ref,
  loading,
  recordingsAudio,
  title,
  tColour,
  allRecordings,
  playingAudioId,
  handleAudioPlay,
  handleViewRecording,
  handleDeleteRecording,
  deletingRecording,
  deletionStatus,
  xml,
}) => {
  // Converts a given date string into a formatted string that follows the "en-UK" locale format.
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('en-UK', options);
  };

  return (
    <div
      className={`cursor-default fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleCloseRecordingsModal}
    >
      <div
        ref={ref}
        className={`bg-white p-8 rounded shadow-md transition-transform duration-300 transform ${
          open ? 'scale-100' : 'scale-95'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? ( // Display loading indicator if loading
          <CircularProgress />
        ) : (
          <div>
            {/* Display modal content if recordingsAudio is loaded */}
            {recordingsAudio ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">All Recordings - {title}</h5>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseRecordingsModal();
                    }}
                    className={`bg-red-500 hover:bg-red-400 ${tColour} focus:outline-none border-none rounded`}
                  >
                    <CloseRoundedIcon className="rounded text-2xl" />
                  </button>
                </div>
                {/* Render table with recordings and recordingsAudio data */}
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
                    {allRecordings.map((recording, index) => (
                      <tr key={index} className="odd:bg-gray-100">
                        <td className="border-none px-4 py-2 text-left">
                          {recording.recordingName}
                          <AudioPlayerIcon
                            audio={recording.audio}
                            isPlaying={playingAudioId === recording.recordingId}
                            onPlay={() =>
                              handleAudioPlay(recording.recordingId)
                            }
                          />
                        </td>
                        <td className="border-none px-4 py-2 text-left">
                          {formatDate(recording.recordingDate)}
                        </td>
                        <td className="border-none px-4 py-2 text-left">
                          <StarRating stars={recording.stars} />
                        </td>
                        <td className="border-none px-4 py-2 text-left">
                          <button
                            className="hover:cursor-pointer transition ease-in-out delay-50 text-center text-blue-500 border-solid border-2 border-blue-500 focus:ring-0 focus:outline-none bg-inherit hover:bg-white hover:border-blue-700 hover:text-blue-700 py-1 px-2 rounded-l-none outline-none rounded hover:cursor"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewRecording(recording.recordingId, xml);
                            }}
                          >
                            View
                          </button>
                          <button
                            className="ml-1 hover:cursor-pointer transition ease-in-out delay-50 text-center text-red-500 border-solid border-2 border-red-500 focus:ring-0 focus:outline-none bg-inherit hover:bg-white hover:border-red-700 hover:text-red-700 py-1 px-2 rounded-l-none outline-none rounded hover:cursor"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRecording(recording.recordingId);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="w-full">No recordings available.</div>
            )}
            <div className="mt-2">
              {deletingRecording && <LinearProgress />}
              {deletionStatus && (
                <div
                  className={`transition-opacity duration-500 ${
                    deletionStatus === 'success'
                      ? 'bg-green-200 text-green-700'
                      : 'bg-red-200 text-red-700'
                  } p-2 rounded-md mt-2`}
                >
                  {deletionStatus === 'success'
                    ? 'Recording successfully deleted.'
                    : 'Failed to delete recording.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonCardRecordingsModal;
