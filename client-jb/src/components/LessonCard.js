import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getManyRecordings,
  deleteRecording,
} from "../utils/studentRecordingMethods";
import {
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
  Button,
  Tooltip,
  IconButton,
} from "@mui/material";
import { CloseRounded as CloseRoundedIcon } from "@mui/icons-material";
import AudioPlayerIcon from "./AudioPlayerIcon";
import StarRating from "./StarRating";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

const LessonCard = ({
  title,
  skill,
  level,
  stars,
  xml,
  id,
  recordings,
  reloadRecordingsCallback,
  renderViewRecordings,
  width,
  backgroundColour,
  hoverBackgroundColour,
  textColour,
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
  const [isFavourite, setIsFavourite] = useState(false);

  const modalRef = useRef(null);

  // set defaults
  const viewRecordings =
    renderViewRecordings !== false ? renderViewRecordings : false;
  const xSize = width ? width : "290px";
  const bColour = backgroundColour ? backgroundColour : "bg-blue-400";
  const hoverColour = hoverBackgroundColour
    ? hoverBackgroundColour
    : "hover:bg-blue-500";
  const tColour = textColour ? textColour : "text-white";

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
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  });

  // Converts a given date string into a formatted string that follows the "en-UK" locale format.
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-UK", options);
  };

  // Handles the click event for viewing the score of the lesson and navigates to the '/all-lessons' route.
  const handleViewScore = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.

    let path = xml;
    const basePath = "/all-lessons/";
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
      console.error("Error fetching recordings audio:", error);
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
    const event = new Event("stopAllAudio");
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
      setDeletionStatus("success");
      console.log(deletionStatus);
    } catch (error) {
      console.log(`Cannot delete recording from database: ${error}`);
      setDeletionStatus("failure");
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

  const handleAddToFavourites = () => {
    setIsFavourite(true);
  };

  const handleRemoveFromFavourites = () => {
    setIsFavourite(false);
  };

  return (
    <div>
      <div className="flex">
        <div
          className={`relative transition ease-in-out delay-50 rounded overflow-hidden shadow-md hover:shadow-lg ${bColour} ${hoverColour} hover:cursor-pointer mb-3`}
          style={{ width: xSize, aspectRatio: "3 / 2" }}
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
                size={"sm:text-3xl md:text-3xl lg:text-3xl xl:text-4xl"}
              />
              <div
                className={
                  viewRecordings ? "grid grid-cols-2 ml-auto" : "ml-auto"
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

                {isFavourite ? (
                  <Tooltip
                    placement="bottom"
                    title="Remove From Favourites"
                    arrow
                  >
                    <IconButton
                      aria-label="Remove From Favourites"
                      className={`text-rose-300 cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromFavourites();
                      }}
                    >
                      <FavoriteIcon className="sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip placement="bottom" title="Add To Favourites" arrow>
                    <IconButton
                      aria-label="Add To Favourites"
                      className={`${tColour} cursor-pointer`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToFavourites();
                      }}
                    >
                      <FavoriteBorderIcon className="hover:text-rose-300 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>

      {/* Modal */}
      <div
        className={`cursor-default fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
          openRecordingsModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleCloseRecordingsModal}
      >
        <div
          ref={modalRef}
          className={`bg-white p-8 rounded shadow-md transition-transform duration-300 transform ${
            openRecordingsModal ? "scale-100" : "scale-95"
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
                      deletionStatus === "success"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    } p-2 rounded-md mt-2`}
                  >
                    {deletionStatus === "success"
                      ? "Recording successfully deleted."
                      : "Failed to delete recording."}
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

export default LessonCard;
