import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteRecording } from "../utils/studentRecordingMethods";
import { CardContent, Typography, Tooltip, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StarRating from "./StarRating";

const RecordingCard = ({
  recordingName,
  skill,
  stars,
  xml,
  id,
  recordingId,
  onDeleteRecording,
  width,
  backgroundColour,
  hoverBackgroundColour,
  textColour,
}) => {
  const navigate = useNavigate();

  // set defaults
  const xSize = width ? width : "290px";
  const bColour = backgroundColour ? backgroundColour : "bg-blue-400";
  const hoverColour = hoverBackgroundColour
    ? hoverBackgroundColour
    : "hover:bg-blue-500";
  const tColour = textColour ? textColour : "text-white";

  // Navigates to the ListRecordings route with the provided xml and recordingId.
  const handleViewRecording = async () => {
    navigate(`/ListRecordings/${xml}`, { state: { id: recordingId } });
  };

  return (
    <div>
      <div className="flex">
        <div
          className={`relative transition ease-in-out delay-50 rounded overflow-hidden shadow-md hover:shadow-lg ${bColour} ${hoverColour} hover:cursor-pointer mb-3`}
          style={{ width: xSize, aspectRatio: "3 / 2" }}
          onClick={handleViewRecording}
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
                  {recordingName}
                </Typography>
              </div>
              <div></div>
              <div></div>
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
              <div className="grid grid-cols-2 ml-auto">
                <Tooltip placement="bottom" title="Edit" arrow>
                  <IconButton className="text-white">
                    <EditIcon className="text-3xl" />
                  </IconButton>
                </Tooltip>
                <Tooltip placement="bottom" title="Delete" arrow>
                  <IconButton
                    className="text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecording(recordingName, recordingId);
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
    </div>
  );
};

export default RecordingCard;
