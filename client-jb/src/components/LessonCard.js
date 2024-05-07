import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

const LessonCard = ({ title, skill, level, stars, xml, id }) => {
  const navigate = useNavigate();
  const [openRecordingsModal, setOpenRecordingsModal] = useState(false);

  const filledStars = Array.from({ length: stars }, (_, index) => (
    <StarRateRoundedIcon key={index} className="text-yellow-300 text-4xl" />
  ));

  const emptyStars = Array.from({ length: 3 - stars }, (_, index) => (
    <StarBorderRoundedIcon
      key={stars + index}
      className="text-yellow-300 text-4xl"
    />
  ));

  const handleClick = () => {
    navigate(`/ListRecordings/${xml}`, { state: { id } });
  };

  const handleOpenRecordingsModal = () => {
    setOpenRecordingsModal(true);
  };

  const handleCloseRecordingsModal = () => {
    setOpenRecordingsModal(false);
  };

  return (
    <div className="group">
      <Card
        className={`h-48 w-80 transition ease-in-out delay-50 max-w-sm relative rounded-sm overflow-hidden shadow-md hover:shadow-lg bg-blue-400 group-hover:bg-blue-500 hover:cursor-pointer`}
        onClick={handleClick}
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
            {filledStars}
            {emptyStars}
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
          className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300 ${
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
            <Typography variant="h6" gutterBottom>
              Modal Title
            </Typography>
            <Typography variant="body1">
              This is the content of the modal.
            </Typography>
            <Button onClick={handleCloseRecordingsModal}>Close Modal</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LessonCard;
