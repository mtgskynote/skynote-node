import React from 'react';
import PropTypes from 'prop-types';

/**
 * ButtonNoOutline component to render a button without an outline.
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.handler - The click handler function.
 * @param {string} props.text - The text to display on the button.
 * @param {string} props.bgColor - The background color of the button.
 * @param {string} props.hoverBgColor - The background color of the button on hover.
 * @param {string} props.textColor - The text color of the button.
 * @param {string} props.hoverTextColor - The text color of the button on hover.
 * @example
 * // Example usage:
 * // <ButtonNoOutline
 * //   handler={() => console.log('Button clicked')}
 * //   text="Click Me"
 * //   bgColor="blue-500"
 * //   hoverBgColor="blue-700"
 * //   textColor="white"
 * //   hoverTextColor="gray-200"
 * // />
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
