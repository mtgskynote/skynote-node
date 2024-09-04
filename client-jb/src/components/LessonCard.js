import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  getManyRecordings,
  deleteRecording,
} from '../utils/studentRecordingMethods';
import { CardContent, Typography, Tooltip, IconButton } from '@mui/material';
import StarRating from './StarRating';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavouriteButton from './FavouriteButton';
import LessonCardRecordingsModal from './LessonCardRecordingsModal';

/**
 * The LessonCard component displays information about a score and provides various interactive features.
 *
 * Props:
 * - title (string): The title of the lesson.
 * - skill (string): The skill level required for the lesson.
 * - level (string): The level of the lesson.
 * - stars (number): The star rating of the lesson.
 * - isFavourite (boolean): Indicates if the lesson is marked as a favourite.
 * - xml (string): The XML path for the lesson.
 * - id (string): The unique identifier for the lesson.
 * - recordings (array): List of recordings associated with the lesson.
 * - reloadRecordingsCallback (function): Callback to reload recordings.
 * - renderViewRecordings (boolean): Determines if the view recordings button should be rendered.
 * - width (string): The width of the lesson card.
 * - backgroundColour (string): The background color of the lesson card.
 * - hoverBackgroundColour (string): The background color of the lesson card on hover.
 * - textColour (string): The text color of the lesson card.
 * - refreshData (function): Callback to refresh data.
 *
 * The component:
 * - Provides functions to handle viewing scores, opening/closing the recordings modal, deleting recordings, viewing recordings, and toggling audio playback.
 * - Renders the lesson card with title, skill, level, star rating, and buttons for viewing recordings and marking as favourite.
 * - Displays a modal with recordings when the view recordings button is clicked.
 */
const LessonCard = ({
  title,
  skill,
  level,
  stars,
  isFavourite,
  xml,
  id,
  recordings,
  reloadRecordingsCallback,
  renderViewRecordings,
  width,
  backgroundColour,
  hoverBackgroundColour,
  textColour,
  refreshData,
}) => {
  const navigate = useNavigate();
  const [allRecordings, setAllRecordings] = useState(recordings);
  const [openRecordingsModal, setOpenRecordingsModal] = useState(false);
  const [recordingsAudio, setRecordingsAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingRecording, setDeletingRecording] = useState(null);
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [deletedRecordingIds, setDeletedRecordingIds] = useState([]);
  const [playingAudioId, setPlayingAudioId] = useState(null);

  const modalRef = useRef(null);

  // set defaults
  const viewRecordings =
    renderViewRecordings !== false ? renderViewRecordings : false;
  const xSize = width ? width : '290px';
  const bColour = backgroundColour ? backgroundColour : 'bg-blue-400';
  const hoverColour = hoverBackgroundColour
    ? hoverBackgroundColour
    : 'hover:bg-blue-500';
  const tColour = textColour ? textColour : 'text-white';

  // Resets the deletionStatus to null after 10 seconds when it changes.
  useEffect(() => {
    let timer;
    if (deletionStatus) {
      timer = setTimeout(() => {
        setDeletionStatus(null);
      }, 10000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [deletionStatus]);

  // Adds and removes a mousedown event listener for closing the modal when clicking outside of it.
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  });

  // Handles the click event for viewing the score of the lesson and navigates to the '/all-lessons' route.
  const handleViewScore = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.

    let path = xml;
    const basePath = '/all-lessons/';
    if (!xml.startsWith(basePath)) {
      path = `${basePath}${xml}`;
    }

    navigate(path, { state: { id } });
  };

  // Opens the recordings modal, fetches the audio for all recordings if not already fetched, and updates the state accordingly.
  const handleOpenRecordingsModal = async (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.

    setOpenRecordingsModal(true);
    setLoading(true);

    try {
      if (recordingsAudio === null) {
        const recordingIds = allRecordings.map(
          (recording) => recording.recordingId
        );
        const recordingAudios = await getManyRecordings(recordingIds);

        allRecordings.forEach((recording) => {
          const recordingAudioMatch = recordingAudios.find(
            (recordingAudio) => recordingAudio._id === recording.recordingId
          );
          if (recordingAudioMatch) {
            recording.audio = recordingAudioMatch.audio;
          }
        });

        setRecordingsAudio(recordingAudios);
      }
    } catch (error) {
      console.error('Error fetching recordings audio:', error);
    } finally {
      setLoading(false);
    }
  };

  // Closes the recordings modal and resets the state.
  const handleCloseRecordingsModal = () => {
    deletedRecordingIds.forEach((recordingId) => {
      reloadRecordingsCallback(recordingId);
    });

    // Dispatch the 'stopAllAudio' event
    const event = new Event('stopAllAudio');
    window.dispatchEvent(event);
    setPlayingAudioId(null);

    setAllRecordings(recordings);
    setDeletedRecordingIds([]);
    setOpenRecordingsModal(false);
    setLoading(false);
  };

  // Closes the recordings modal when a click is detected outside of it.
  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseRecordingsModal();
    }
  };

  // Deletes the recording with the provided recordingId and updates the state accordingly.
  const handleDeleteRecording = async (recordingId) => {
    setDeletingRecording(recordingId);
    try {
      await deleteRecording(recordingId);

      setRecordingsAudio((recordingsAudio) =>
        recordingsAudio.filter((recording) => recording._id !== recordingId)
      );

      setAllRecordings((allRecordings) =>
        allRecordings.filter(
          (recording) => recording.recordingId !== recordingId
        )
      );

      deletedRecordingIds.push(recordingId);
      setDeletionStatus('success');
      console.log(deletionStatus);
    } catch (error) {
      console.log(`Cannot delete recording from database: ${error}`);
      setDeletionStatus('failure');
    } finally {
      setDeletingRecording(null);
    }
  };

  // Navigates to the ListRecordings route with the provided xml and recordingId.
  const handleViewRecording = async (recordingId, xml) => {
    navigate(`/ListRecordings/${xml}`, { state: { id: recordingId } });
  };

  // Toggles the playing audio ID based on the provided audioId.
  const handleAudioPlay = (audioId) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null); // If the currently playing audio is clicked again, set playingAudioId to null
    } else {
      setPlayingAudioId(audioId); // Set the new audio as playing
    }
  };

  return (
    <div>
      <div className="flex">
        <div
          className={`relative transition ease-in-out delay-50 rounded overflow-hidden shadow-md hover:shadow-lg ${bColour} ${hoverColour} hover:cursor-pointer mb-3`}
          style={{ width: xSize, aspectRatio: '3 / 2' }}
          onClick={handleViewScore}
          id={id}
        >
          <CardContent>
            {/* Top Section */}
            <div
              className={`flex justify-between items-start ${tColour} align-text-top`}
            >
              <div className="overflow-hidden">
                <Typography
                  variant="h5"
                  component="div"
                  className={`font-bold text-clip sm:text-lg md:text-lg lg:text-lg xl:text-xl whitespace-normal mr-6 max-w-36`}
                >
                  {title}
                </Typography>
              </div>
              <div></div>
              <div
                className={`sm:text-xs md:text-xs lg:text-xs xl:text-sm font-extralight p-1 rounded align-right`}
              >
                Level {level}
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
              <div
                className={
                  viewRecordings ? 'grid grid-cols-2 ml-auto' : 'ml-auto'
                }
              >
                {viewRecordings ? (
                  <Tooltip placement="bottom" title="View All Recordings" arrow>
                    <IconButton
                      aria-label="View All Recordings"
                      className={`${tColour} cursor-pointer`}
                      onClick={handleOpenRecordingsModal}
                    >
                      <QueueMusicIcon className="sm:text-3xl md:text-3xl lg:text-4xl xl:text-4xl" />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <FavouriteButton
                  key={id}
                  songId={id}
                  singTitle={title}
                  initialIsFavourite={isFavourite}
                  refreshData={refreshData}
                />
              </div>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Modal */}
      <LessonCardRecordingsModal
        ref={modalRef}
        open={openRecordingsModal}
        title={title}
        allRecordings={allRecordings}
        recordingsAudio={recordingsAudio}
        loading={loading}
        deletionStatus={deletionStatus}
        deletingRecording={deletingRecording}
        playingAudioId={playingAudioId}
        handleCloseRecordingsModal={handleCloseRecordingsModal}
        handleDeleteRecording={handleDeleteRecording}
        handleViewRecording={handleViewRecording}
        handleAudioPlay={handleAudioPlay}
        xml={xml}
      />
    </div>
  );
};

LessonCard.propTypes = {
  title: PropTypes.string.isRequired,
  skill: PropTypes.string.isRequired,
  level: PropTypes.number.isRequired,
  stars: PropTypes.number.isRequired,
  isFavourite: PropTypes.bool.isRequired,
  xml: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  recordings: PropTypes.arrayOf(
    PropTypes.shape({
      recordingId: PropTypes.string.isRequired,
      recordingName: PropTypes.string.isRequired,
      recordingDate: PropTypes.string.isRequired,
      stars: PropTypes.number.isRequired,
      audio: PropTypes.string,
    })
  ).isRequired,
  reloadRecordingsCallback: PropTypes.func.isRequired,
  renderViewRecordings: PropTypes.bool,
  width: PropTypes.string,
  backgroundColour: PropTypes.string,
  hoverBackgroundColour: PropTypes.string,
  textColour: PropTypes.string,
  refreshData: PropTypes.func.isRequired,
};

export default LessonCard;
