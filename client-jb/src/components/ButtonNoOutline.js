import React from 'react';

const ButtonNoOutline = ({
  handler,
  text,
  bgColor,
  hoverBgColor,
  textColor,
  hoverTextColor,
}) => {
  const hoverText = hoverTextColor || textColor;
  return (
    <button
      onClick={handler}
      className={`ml-auto hover:cursor-pointer transition ease-in-out delay-50 text-center text-${textColor} hover:text-${hoverText} text-sm border-transparent focus:border-transparent focus:ring-0 focus:outline-none bg-${bgColor} hover:bg-${hoverBgColor} font-extralight py-1 px-2 rounded-l-none outline-none rounded`}
    >
      {text}
    </button>
  );
};

export default ButtonNoOutline;
