import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  getManyRecordings,
  deleteRecording,
} from "../utils/studentRecordingMethods";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  LinearProgress,
} from "@mui/material";
import { CloseRounded as CloseRoundedIcon } from "@mui/icons-material";
import AudioPlayerIcon from "./AudioPlayerIcon";
import StarRating from "./StarRating";

const LessonCard = ({
  title,
  skill,
  level,
  stars,
  xml,
  id,
  recordings,
  reloadRecordingsCallback,
}) => {
  const navigate = useNavigate();
  const [allRecordings, setAllRecordings] = useState(recordings);
  const [openRecordingsModal, setOpenRecordingsModal] = useState(false);
  const [recordingsAudio, setRecordingsAudio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingRecording, setDeletingRecording] = useState(null);
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [deletedRecordingIds, setDeletedRecordingIds] = useState([]);

  const modalRef = useRef(null);

  /**
   * This useEffect hook is responsible for managing the 'deletionStatus' state.
   * It sets a timer to clear the 'deletionStatus' state after 10 seconds if it is not null.
   * This is done to prevent unnecessary re-renders when the 'deletionStatus' state is updated.
   */
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
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  });

  /**
   * This function, `formatDate`, is responsible for converting a given date string into a formatted string that follows the "en-UK" locale format.
   * It takes a date string as input and returns a new Date object with the specified format.
   * @param {String} dateString - The date string to be formatted.
   */
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

  /**
   * Handles the click event for viewing the score of the lesson.
   * It navigates to the '/all-lessons' route, passing the 'xml' and 'id' props as state in the URL.
   * @param {Object} e - The event object.
   */
  const handleViewScore = (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.
    navigate(`/all-lessons/${xml}`, { state: { id } });
  };

  /**
   * Handles the click event for opening the recordings modal.
   * It sets the 'openRecordingsModal' state to true and sets the 'loading' state to true.
   * It then fetches the audio for the recordings using the 'getManyRecordings' function.
   * If successful, it updates the 'recordingsAudio' state with the fetched audio data.
   * If an error occurs during the fetching process, it logs the error to the console.
   * Finally, it sets the 'loading' state to false.
   * @param {Object} e - The event object.
   */
  const handleOpenRecordingsModal = async (e) => {
    e.stopPropagation(); // Prevents the event from bubbling up to the parent component.
    console.log(recordingsAudio);

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
      console.log(recordingsAudio);
    } catch (error) {
      console.error("Error fetching recordings audio:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the click event for closing the recordings modal.
   * It sets the 'openRecordingsModal' state to false and sets the 'loading' state to false.
   */
  const handleCloseRecordingsModal = () => {
    deletedRecordingIds.forEach((recordingId) => {
      reloadRecordingsCallback(recordingId);
    });
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

  /**
   * Handles the click event for deleting a recording.
   * It sets the 'deletingRecording' state to the provided 'recordingId' and sets the 'loading' state to true.
   * It then calls the 'deleteRecording' function with the 'recordingId' as an argument.
   * If successful, it updates the 'recordingsAudio' state by filtering out the deleted recording.
   * If an error occurs during the deletion process, it logs the error to the console.
   * Finally, it sets the 'loading' state to false and sets the 'deletionStatus' state to the appropriate status message.
   * @param {Number} recordingId - The ID of the recording to be deleted.
   */
  const handleDeleteRecording = async (recordingId) => {
    setDeletingRecording(recordingId);
    try {
      await deleteRecording(recordingId);

      const prevRecordingsAudio = recordingsAudio;
      const filteredRecordingsAudio = prevRecordingsAudio.filter(
        (recording) => recording._id.toString() !== recordingId.toString()
      );
      setRecordingsAudio(filteredRecordingsAudio);

      const prevAllRecordings = allRecordings;
      const filteredAllRecordings = prevAllRecordings.filter(
        (recording) => recording._id.toString() !== recordingId.toString()
      );
      setAllRecordings(filteredAllRecordings);

      deletedRecordingIds.push(recordingId);
      setDeletionStatus("success");
    } catch (error) {
      console.log(`Cannot delete recording from database: ${error}`);
      setDeletionStatus("failure");
    } finally {
      setDeletingRecording(null);
    }
  };

  /**
   * Handles the click event for viewing a recording.
   * It navigates to the '/ListRecordings' route, passing the 'xml' and 'recordingId' props as state in the URL.
   * @param {Number} recordingId - The ID of the recording to be viewed.
   * @param {String} xml - The XML identifier for the lesson.
   */
  const handleViewRecording = async (recordingId, xml) => {
    navigate(`/ListRecordings/${xml}`, { state: { id: recordingId } });
  };

  return (
    <div>
      <Card
        className={`h-48 w-80 transition ease-in-out delay-50 max-w-sm relative rounded-sm overflow-hidden shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 hover:cursor-pointer`}
        onClick={handleViewScore}
        id={id}
      >
        <CardContent>
          <div className="flex justify-between items-center text-white">
            <div className="w-3/4 overflow-hidden">
              <Typography
                variant="h5"
                component="div"
                className="font-bold text-clip w-full whitespace-normal"
              >
                {title}
              </Typography>
            </div>
            <div className="text-xl font-extralight p-1 rounded">
              Level {level}
            </div>
          </div>
          <div className="whitespace-normal">
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom
              className="text-slate-100 text-md"
            >
              {skill}
            </Typography>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-3 flex items-end">
            <StarRating stars={stars} />
            <button
              onClick={handleOpenRecordingsModal}
              className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-800 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-blue-700 hover:text-white font-extralight hover:font-bold py-1 px-2 rounded-l-none outline-none rounded"
            >
              View All Recordings
            </button>
          </div>
        </CardContent>
      </Card>
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
                      className="bg-red-500 hover:bg-red-400 text-white focus:outline-none border-none rounded"
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
                            <AudioPlayerIcon audio={recording.audio} />
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
