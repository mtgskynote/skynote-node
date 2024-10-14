import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress'; // Import based on your setup
import PopUpWindow from './PopUpWindow'; // Assuming you have a PopUpWindow component

const DeletePopUp = ({
  isOpen,
  itemName,
  showLoading,
  showWarning,
  handleHidePopUp,
  handleConfirmDelete,
}) => {
  return (
    <PopUpWindow isOpen={isOpen}>
      <div className="relative">
        {showLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10">
            <CircularProgress />
          </div>
        )}
        <div className={`${showLoading ? 'opacity-50' : ''}`}>
          {showWarning && (
            <div className="bg-red-100 text-red-700 text-sm py-1 px-2 mb-4 rounded-lg flex justify-center items-center transition duration-300 ease-in-out">
              <p className="m-0">Could not delete {itemName}.</p>
            </div>
          )}
          <p className="text-xl font-extrabold text-gray-800 mb-1">
            Are you sure you want to delete <span>{itemName}</span>?
          </p>
          <p className="text-gray-600 mb-4">
            This action is permanent and cannot be undone.
          </p>
          <div className="flex justify-between space-x-2">
            <button
              onClick={handleHidePopUp}
              className="bg-slate-50 border-solid border-slate-500 outline-none text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition duration-300 ease-in-out w-full"
              disabled={showLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="bg-red-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out w-full"
              disabled={showLoading}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </PopUpWindow>
  );
};

DeletePopUp.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  itemName: PropTypes.string.isRequired,
  showLoading: PropTypes.bool.isRequired,
  showWarning: PropTypes.bool.isRequired,
  handleHidePopUp: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired,
};

export default DeletePopUp;
