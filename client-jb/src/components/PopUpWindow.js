import React, { useState, useEffect } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindow = (props) => {
    const [showWindow, setShowWindow] = useState(false);

    useEffect(() => {
        if(props.showWindow){
            setShowWindow(true)
        }else{
            setShowWindow(false)
        }
      }, [props]);

  const handleSave = () => {
    // Handle save logic here
    console.log("Saving recording")
    // Close/tell to hide the window after saving
    setShowWindow(false); 
    props.handlerBack(false, "save")
  };

  const handleDelete = () => {
    console.log("Deleting recording")
    // Handle delete logic here
    // Close/tell to hide the window after deleting
    setShowWindow(false); 
    props.handlerBack(false, "delete")
  };

  return (
    <div className={PopUpWindowCSS.popUpWindowSave}>
        <div className={PopUpWindowCSS.contentSave}>
          <p>Do you want to save or delete this recording?</p>
          <button className={PopUpWindowCSS.buttonSave} onClick={handleSave}>Save</button>
          <button className={PopUpWindowCSS.buttonSave} onClick={handleDelete}>Delete</button>
        </div>
    </div>
  );
};

export default PopUpWindow;
