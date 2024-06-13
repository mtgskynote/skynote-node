import React, { useState } from "react";

const PopUpWindow = ({ onSaveRecording, onDeleteRecording }) => {
  const [fileName, setFileName] = useState("");

  // Update state value of file name
  const handleRenameFile = (e) => {
    setFileName(e.target.value);
  };

  // Save current file name as a recording
  const handleSaveRecording = () => {
    onSaveRecording(fileName);
  };

  // Delete current recording
  const handleDeleteRecording = () => {
    onDeleteRecording();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Save Last Recording?</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="fileName">
            Name Recording:
          </label>
          <input
            type="text"
            id="fileName"
            value={fileName}
            onChange={handleRenameFile}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex justify-between space-x-2">
          <button
            onClick={handleSaveRecording}
            className="bg-green-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out w-full"
          >
            Save
          </button>
          <button
            onClick={handleDeleteRecording}
            className="bg-red-500 border-none outline-none text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 ease-in-out w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpWindow;
