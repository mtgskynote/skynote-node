import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";

const LessonCard = ({ title, skill, level, stars, xml, id }) => {
  const navigate = useNavigate();

  const filledStars = Array.from({ length: stars }, (_, index) => (
    <StarRateRoundedIcon key={index} className="text-yellow-300 text-4xl" />
  ));

  const emptyStars = Array.from({ length: 3 - stars }, (_, index) => (
    <StarBorderRoundedIcon
      key={stars + index}
      className="text-yellow-300 text-4xl"
    />
  ));

  // Define colors for different skills
  const levelColors = {
    1: ["bg-[#87b3fa]", "hover:bg-[#5c97f7]"],
    2: ["bg-[#87b3fa]", "hover:bg-[#5c97f7]"],
  };

  // Determine the background color based on the skill
  const bgColor = levelColors[level] || ["bg-gray-500", "hover:bg-gray-400"];

  const handleClick = () => {
    navigate(`/ListRecordings/${xml}`, { state: { id } });
  };

  return (
    <Card
      className={`h-48 w-80 transition ease-in-out delay-50 max-w-sm relative rounded-sm overflow-hidden shadow-md hover:shadow-lg bg-blue-400 hover:bg-blue-500 hover:cursor-pointer`}
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
      </CardContent>
      <div className="absolute inset-x-0 bottom-0 p-3 flex items-end">
        {filledStars}
        {emptyStars}
      </div>
    </Card>
  );
};

export default LessonCard;
