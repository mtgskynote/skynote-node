import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import CircularProgress from '@material-ui/core/CircularProgress'; // Import based on your setup
import PopUpWindow from './PopUpWindow'; // Assuming you have a PopUpWindow component

/**
 * EditPopUp component to display a pop-up for editing an item's details.
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Determines whether the pop-up is visible.
 * @param {string} props.newItemName - The new name of the item being edited.
 * @param {boolean} props.showLoading - Indicates whether a loading spinner should be displayed.
 * @param {boolean} props.showWarning - Indicates whether a warning message should be displayed.
 * @param {Function} props.handleHidePopUp - Callback function to close the pop-up.
 * @param {Function} props.handleInputChange - Callback function to handle changes to the score name input field.
 * @param {Function} props.handleConfirmEdit - Callback function to confirm the edit action.
 * @param {string} [props.secondaryItemName] - The label for the score skill name, if applicable.
 * @param {string} [props.secondaryItemValue] - The value of the score skill name, if applicable.
 * @param {Function} [props.handleSecondaryInputChange] - Callback function to handle changes to the secondary input field, if applicable.
 * @example
 * // Example usage:
 * // <EditPopUp
 * //   isOpen={true}
 * //   newItemName="New Title"
 * //   showLoading={false}
 * //   showWarning={false}
 * //   handleHidePopUp={() => console.log('Pop-up closed')}
 * //   handleInputChange={(e) => console.log(e.target.value)}
 * //   handleConfirmEdit={() => console.log('Edit confirmed')}
 * //   secondaryItemName="Skill"
 * //   secondaryItemValue="New Skill"
 * //   handleSecondaryInputChange={(e) => console.log(e.target.value)}
 * // />
 */
const EditPopUp = ({
  isOpen,
  newItemName,
  showLoading,
  showWarning,
  handleHidePopUp,
  handleInputChange,
  handleConfirmEdit,
  secondaryItemName,
  secondaryItemValue,
  handleSecondaryInputChange,
}) => {
  return (
    <PopUpWindow isOpen={isOpen}>
      <div className="relative">
        {showLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
            <CircularProgress />
          </div>
        )}
        <div className={`mb-4 ${showLoading ? 'opacity-50' : ''}`}>
          <label className="block text-gray-700 mb-2" htmlFor="itemName">
            Edit title:
          </label>
          <input
            type="text"
            id="itemName"
            value={newItemName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={showLoading}
          />
          {showWarning && (
            <div className="bg-red-100 text-red-700 text-sm py-1 px-2 mb-4 rounded-lg flex justify-center items-center transition duration-300 ease-in-out">
              <p className="m-0">Field cannot be empty</p>
            </div>
          )}
          {secondaryItemName && (
            <>
              <label
                className="block text-gray-700 mb-2"
                htmlFor="secondaryItemName"
              >
                Edit skill:
              </label>
              <input
                type="text"
                id="secondaryItemName"
                value={secondaryItemValue}
                onChange={handleSecondaryInputChange}
                className="w-full px-3 py-2 mb-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={showLoading}
              />
            </>
          )}
        </div>
        <div className="flex justify-between space-x-2">
          <button
            onClick={handleHidePopUp}
            className="bg-slate-50 border-solid border-slate-500 outline-none text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out w-full"
            disabled={showLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmEdit}
            className="bg-green-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out w-full"
            disabled={showLoading}
          >
            Confirm
          </button>
        </div>
      </div>
    </PopUpWindow>
  );
};

EditPopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  itemName: PropTypes.string,
  newItemName: PropTypes.string.isRequired,
  showLoading: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  handleHidePopUp: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleConfirmEdit: PropTypes.func.isRequired,
  secondaryItemName: PropTypes.string,
  secondaryItemValue: PropTypes.string,
  handleSecondaryInputChange: PropTypes.func,
};

export default EditPopUp;
