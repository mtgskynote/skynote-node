import React, { useState, useEffect } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindowDelete = (props) => {
    const [showWindow, setShowWindow] = useState(false);

    useEffect(() => {
        if(props.showWindow){
            setShowWindow(true)
        }else{
            setShowWindow(false)
        }
      }, [props]);

  const handleOption1 = () => {
    // Handle Option1 logic here
    console.log("Saving recording")
    // Close/tell to hide the window after saving
    setShowWindow(false); 
    props.handlerBack("1")
  };

  const handleOption2 = () => {
    console.log("Deleting recording")
    // Handle Option2 logic here
    // Close/tell to hide the window after deleting
    setShowWindow(false); 
    props.handlerBack("2")
  };

  return (
    <div className={PopUpWindowCSS.popUpWindowDelete}>
        <div className={PopUpWindowCSS.contentDelete}>
          <p>Are you sure you want to delete this recording?</p>
          <button className={PopUpWindowCSS.buttonDelete} onClick={handleOption1}>Yes</button>
          <button className={PopUpWindowCSS.buttonDelete} onClick={handleOption2}>No</button>
        </div>
    </div>
  );
};

export default PopUpWindowDelete;