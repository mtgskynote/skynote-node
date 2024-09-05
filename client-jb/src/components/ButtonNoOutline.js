import React from 'react';

/**
 * The ButtonNoOutline component renders a customizable button without an outline.
 *
 * Props:
 * - handler (function): Callback function to handle button click events.
 * - text (string): The text to display inside the button.
 * - bgColor (string): The Tailwind CSS background color of the button.
 * - hoverBgColor (string): The Tailwind CSS background color of the button on hover.
 * - textColor (string): The Tailwind CSS text color of the button.
 * - hoverTextColor (string): The Tailwind CSS text color of the button on hover. Defaults to textColor if not provided.
 */
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

ButtonNoOutline.propTypes = {
  handler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  bgColor: PropTypes.string.isRequired,
  hoverBgColor: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired,
  hoverTextColor: PropTypes.string,
};

export default ButtonNoOutline;
