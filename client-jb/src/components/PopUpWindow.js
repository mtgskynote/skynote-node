import React, { useState } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindow = (props) => {

  const [fileName, setFileName] = useState("");

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving recording")
    // Close/tell to hide the window after saving
    props.handlerBack(false, "save", fileName)
  };

  const handleDelete = () => {
    console.log("Deleting recording")
    // Handle delete logic here
    // Close/tell to hide the window after deleting
    props.handlerBack(false, "delete")
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
};

  return (
    <div className={PopUpWindowCSS.popUpWindowSave}>
        <div className={PopUpWindowCSS.contentSave}>
          <p>Do you want to save or delete this recording?</p>
          <div><input
                    type="text"
                    placeholder="Enter file name"
                    value={fileName}
                    onChange={handleFileNameChange}
          /></div>
          <button className={PopUpWindowCSS.buttonSave} onClick={handleSave}>Save</button>
          <button className={PopUpWindowCSS.buttonSave} onClick={handleDelete}>Delete</button>
        </div>
    </div>
  );
};

export default PopUpWindow;
