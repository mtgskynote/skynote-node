import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/appContext';
import {
  getManyRecordings,
  deleteRecording,
} from '../../utils/studentRecordingMethods';
import {
  loadImportedFileToLocalStorage,
  deleteImportedFileFromLocalStorage,
  removeScoreFromLocalStorageScoreData,
  deleteImportedScore,
  editImportedScoreTitleInLocalStorageScoreData,
  editImportedScoreInDataBase,
} from '../../utils/usersMethods';
import {
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { CloseRounded as CloseRoundedIcon } from '@mui/icons-material';
import AudioPlayerIcon from '../buttons/AudioPlayerIcon';
import StarRating from '../charts/StarRating';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavouriteButton from '../buttons/FavouriteButton';
import EditPopUp from '../popups/EditPopUp';
import DeletePopUp from '../popups/DeletePopUp';

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
  importedScore,
  importName,
  renderImportButtons,
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

  const [showEditPopUpWindow, setShowEditPopUpWindow] = useState(false);
  const [showDeletePopUpWindow, setShowDeletePopUpWindow] = useState(false);
  const [newImportTitle, setNewImportName] = useState(importName || '');
  const [newSkill, setNewSkill] = useState(skill || '');
  const [showEditWarning, setShowEditWarning] = useState(false);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [showEditLoading, setShowEditLoading] = useState(false);
  const [showDeleteLoading, setShowDeleteLoading] = useState(false);

  const { getCurrentUser } = useAppContext();

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

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  });

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

  const handleViewScore = async (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.

    if (!xml || typeof xml !== 'string') {
      console.error('Invalid xml path:', xml);
      return;
    }

    const basePath = '/all-lessons/';
    let path = xml;

    // Ensure the path includes the base path
    if (!path.startsWith(basePath)) {
      path = `${basePath}${path}`;
    }

    // Strip the basePath if it is included in the XML path for comparison
    const fileName = path.replace(basePath, '');

    // Find the relevant score entry in local storage
    const storedScoreData = JSON.parse(localStorage.getItem('scoreData')) || [];
    const scoreEntry = storedScoreData.find((item) => item.fname === fileName);

    if (scoreEntry) {
      // File is found in the scoreData already
      if (importedScore) {
        const currentUser = await getCurrentUser();
        await loadImportedFileToLocalStorage(currentUser.id, scoreEntry);
      }
      navigate(path, {
        state: { id, fileData: scoreEntry },
      });
    } else {
      console.error('File not found in local ScoreData');
    }
  };

  const handleOpenRecordingsModal = async (e) => {
    e.stopPropagation();

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

  const handleCloseRecordingsModal = () => {
    deletedRecordingIds.forEach((recordingId) => {
      reloadRecordingsCallback(recordingId);
    });

    const event = new Event('stopAllAudio');
    window.dispatchEvent(event);
    setPlayingAudioId(null);

    setAllRecordings(recordings);
    setDeletedRecordingIds([]);
    setOpenRecordingsModal(false);
    setLoading(false);
  };

  const handleClickOutsideModal = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseRecordingsModal();
    }
  };

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
    } catch (error) {
      console.log(`Cannot delete recording from database: ${error}`);
      setDeletionStatus('failure');
    } finally {
      setDeletingRecording(null);
    }
  };

  const handleViewRecording = async (recordingId, xml) => {
    navigate(`/ListRecordings/${xml}`, { state: { id: recordingId } });
  };

  const handleAudioPlay = (audioId) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(audioId);
    }
  };

  // Update recording name in the database
  const handleEditImportedScore = async () => {
    if (newImportTitle !== '' && newSkill !== '' && newImportTitle !== title) {
      setShowEditLoading(true);
      setShowEditWarning(false);
      // Prepare updates object
      const updates = {};
      if (newImportTitle !== undefined) updates.title = newImportTitle;
      if (newSkill !== undefined) updates.skill = newSkill;

      // Update in localStorage
      editImportedScoreTitleInLocalStorageScoreData(
        id,
        newImportTitle,
        newSkill
      );

      // Update in database
      try {
        await editImportedScoreInDataBase(id, updates);
      } catch (error) {
        console.error('Error updating score:', error);
        setShowEditWarning(true);
      }
      setShowEditLoading(false);
      setShowEditPopUpWindow(false);
      if (refreshData) refreshData();
    } else if (title === newImportTitle) {
      setShowEditWarning(false);
      setShowEditPopUpWindow(false);
    } else {
      setShowEditWarning(true);
    }
  };

  const handleDeleteImportedScore = async () => {
    try {
      const result = await getCurrentUser();
      const userId = result.id;

      await deleteImportedScore(userId, id); // Axios delete call in usermethods

      // Update local storage by removing the score
      removeScoreFromLocalStorageScoreData(id);

      // remove file from local storage if its there
      deleteImportedFileFromLocalStorage(xml.split('/').pop());

      if (refreshData) refreshData();

      setShowDeletePopUpWindow(false);
      setShowDeleteLoading(false);
    } catch (error) {
      console.error('Error deleting score:', error);
      setShowDeleteLoading(false);
      setShowDeleteWarning(true);
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
              {!importedScore && (
                <div
                  className={`sm:text-xs md:text-xs lg:text-xs xl:text-sm font-extralight p-1 rounded align-right`}
                >
                  Level {level}
                </div>
              )}
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
                {!renderImportButtons && (
                  <FavouriteButton
                    key={id}
                    songId={id}
                    singTitle={title}
                    initialIsFavourite={isFavourite}
                    refreshData={refreshData}
                  />
                )}
                {renderImportButtons && (
                  <div className="grid grid-cols-2 ml-auto">
                    <Tooltip placement="bottom" title="Edit" arrow>
                      <IconButton
                        className="text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowEditPopUpWindow(true);
                        }}
                      >
                        <EditIcon className="text-3xl" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="bottom" title="Delete Score" arrow>
                      <IconButton
                        className="text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeletePopUpWindow(true);
                        }}
                      >
                        <DeleteIcon className="text-3xl" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Edit Import Pop-Up */}
      <EditPopUp
        isOpen={showEditPopUpWindow}
        itemName={title}
        newItemName={newImportTitle}
        showLoading={showEditLoading}
        showWarning={showEditWarning}
        handleHidePopUp={() => setShowEditPopUpWindow(false)}
        handleInputChange={(e) => setNewImportName(e.target.value)}
        handleConfirmEdit={handleEditImportedScore}
        secondaryItemName={skill}
        newSecondaryItemName={newSkill}
        handleSecondaryInputChange={(e) => setNewSkill(e.target.value)}
      />

      {/* Delete Pop-Up */}
      <DeletePopUp
        isOpen={showDeletePopUpWindow}
        itemName={title}
        showLoading={showDeleteLoading}
        showWarning={showDeleteWarning}
        handleHidePopUp={() => setShowDeletePopUpWindow(false)}
        handleConfirmDelete={handleDeleteImportedScore}
      />

      {/* Modal */}
      <div
        className={`cursor-default fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
          openRecordingsModal ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseRecordingsModal}
      >
        <div
          ref={modalRef}
          className={`bg-white p-8 rounded shadow-md transition-transform duration-300 transform ${
            openRecordingsModal ? 'scale-100' : 'scale-95'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <div>
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
                              isPlaying={
                                playingAudioId === recording.recordingId
                              }
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
  ),
  reloadRecordingsCallback: PropTypes.func,
  renderViewRecordings: PropTypes.bool,
  width: PropTypes.string,
  backgroundColour: PropTypes.string,
  hoverBackgroundColour: PropTypes.string,
  textColour: PropTypes.string,
  refreshData: PropTypes.func,
  importedScore: PropTypes.bool,
  importName: PropTypes.string,
  renderImportButtons: PropTypes.bool,
};

export default LessonCard;
