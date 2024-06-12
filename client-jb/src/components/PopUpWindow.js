// import React, { useState } from 'react';
// import PopUpWindowCSS from './PopUpWindow.module.css';

// const PopUpWindow = (props) => {

//   const [fileName, setFileName] = useState("");

//   const handleSave = () => {
//     // Handle save logic here
//     console.log("Saving recording")
//     // Close/tell to hide the window after saving
//     props.handlerBack(false, "save", fileName)
//   };

//   const handleDelete = () => {
//     console.log("Deleting recording")
//     // Handle delete logic here
//     // Close/tell to hide the window after deleting
//     props.handlerBack(false, "delete")
//   };

//   const handleFileNameChange = (event) => {
//     setFileName(event.target.value);
// };

//   return (
//     <div className={PopUpWindowCSS.popUpWindowSave}>
//         <div className={PopUpWindowCSS.contentSave}>
//           <p>Do you want to save or delete this recording?</p>
//           <div><input
//                     type="text"
//                     placeholder="Enter file name"
//                     value={fileName}
//                     onChange={handleFileNameChange}
//           /></div>
//           <button className={PopUpWindowCSS.buttonSave} onClick={handleSave}>Save</button>
//           <button className={PopUpWindowCSS.buttonSave} onClick={handleDelete}>Delete</button>
//         </div>
//     </div>
//   );
// };

// export default PopUpWindow;

import React, { useState } from "react";

const PopUpWindow = ({ onSaveRecording, onDeleteRecording }) => {
  const [fileName, setFileName] = useState("");

  const handleRenameFile = (e) => {
    setFileName(e.target.value);
  };

  const handleSaveRecording = () => {
    onSaveRecording(fileName);
  };

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
