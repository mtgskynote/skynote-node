import React from "react";
import { Star } from "@material-ui/icons";

const LessonCard = ({ title, subject, level, score }) => {
  const filledStars = Array.from({ length: score }, (_, index) => (
    <Star key={index} className="text-yellow-500" />
  ));
  const emptyStars = Array.from({ length: 3 - score }, (_, index) => (
    <Star key={score + index} />
  ));

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg border border-gray-300 p-4">
      <div>
        <div className="font-bold text-xl">{title}</div>
        <div className="text-sm">{subject}</div>
      </div>
      <div className="text-right">{level}</div>
      <div className="flex items-end">
        {filledStars}
        {emptyStars}
      </div>
    </div>
  );
};

export default LessonCard;
