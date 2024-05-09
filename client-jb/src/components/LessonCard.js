import React, { useState } from "react";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import {
  CloseRounded as CloseRoundedIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
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
  const [openRecordingsModal, setOpenRecordingsModal] = useState(false);
  const [recordingsAudio, setRecordingsAudio] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleViewScore = () => {
    navigate(`/all-lessons/${xml}`, { state: { id } });
  };

  const handleOpenRecordingsModal = async () => {
    setOpenRecordingsModal(true); // Open the modal immediately
    setLoading(true); // Set loading state to true

    try {
      if (recordingsAudio === null) {
        const recordingIds = recordings.map(
          (recording) => recording.recordingId
        );
        const recordingAudios = await getManyRecordings(recordingIds);

        recordings.forEach((recording) => {
          const recordingAudioMatch = recordingAudios.find(
            (recordingAudio) => recordingAudio._id === recording.recordingId
          );
          if (recordingAudioMatch) {
            recording.audio = recordingAudioMatch.audio;
          }
        });

        console.log(recordings);
        setRecordingsAudio(recordingAudios);
      }
    } catch (error) {
      console.error("Error fetching recordings audio:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseRecordingsModal = () => {
    setOpenRecordingsModal(false);
    setLoading(false);
  };

  const handleDeleteRecording = async (recordingId) => {
    try {
      await deleteRecording(recordingId);

      setRecordingsAudio(
        recordingsAudio.filter((recording) => recording._id !== recordingId)
      );
      reloadRecordingsCallback();
    } catch (error) {
      console.log(`Cannot delete recording from database: ${error}`);
    }
  };

  const handleViewRecording = async (recordingId, xml) => {
    navigate(`/ListRecordings/${xml}`, { state: { recordingId } });
  };

  return (
    <div className="">
      <Card
        className={`h-48 w-80 transition ease-in-out delay-50 max-w-sm relative rounded-sm overflow-hidden shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 hover:cursor-pointer`}
        // onClick={handleViewScore}
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
              className="ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-gray-800 border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-slate-50 hover:bg-blue-800 hover:text-white font-extralight hover:font-bold py-1 px-2 rounded-l-none outline-none rounded hover:cursor"
            >
              View All Recordings
            </button>
          </div>
        </CardContent>

        {/* Modal */}
        <div
          className={`cursor-default fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
            openRecordingsModal
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleCloseRecordingsModal}
        >
          <div
            className={`bg-white p-8 rounded shadow-md transition-transform duration-300 transform ${
              openRecordingsModal ? "scale-100" : "scale-95"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {loading ? ( // Display loading indicator if loading
              <CircularProgress />
            ) : (
              <>
                {/* Display modal content if recordingsAudio is loaded */}
                {recordingsAudio ? (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">All Recordings - {title}</h5>
                      <button
                        onClick={handleCloseRecordingsModal}
                        className="bg-red-500 hover:bg-red-400 text-white focus:outline-none border-none rounded"
                      >
                        <CloseRoundedIcon className="rounded text-2xl" />
                      </button>
                    </div>
                    {/* Render table with recordings and recordingsAudio data */}
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2">
                            Recording Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Recording Date
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Stars Achieved
                          </th>
                          <th className="border border-gray-300 px-4 py-2">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recordings.map((recording, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 px-4 py-2">
                              {recording.recordingName}
                              <AudioPlayerIcon audio={recording.audio} />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {formatDate(recording.recordingDate)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <StarRating stars={recording.stars} />
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              <button
                                className="hover:cursor-pointer transition ease-in-out delay-50 text-center text-blue-500 border-solid border-2 border-blue-500 focus:ring-0 focus:outline-none bg-inherit hover:bg-slate-50 hover:border-blue-600 hover:text-blue-600 py-1 px-2 rounded-l-none outline-none rounded hover:cursor"
                                onClick={() =>
                                  handleViewRecording(
                                    recording.recordingId,
                                    xml
                                  )
                                }
                              >
                                View Recording
                              </button>
                              <Tooltip
                                title="Delete Recording"
                                placement="right"
                              >
                                <IconButton
                                  onClick={() =>
                                    handleDeleteRecording(recording.recordingId)
                                  }
                                  aria-label="Delete"
                                  className="hover:text-red-500"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>No recordings available.</div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonCard;
