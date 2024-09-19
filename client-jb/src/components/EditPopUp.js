import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import CircularProgress from '@material-ui/core/CircularProgress'; // Import based on your setup
import PopUpWindow from './PopUpWindow'; // Assuming you have a PopUpWindow component

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
