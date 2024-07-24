/* eslint-disable */
// TODO: Eslint is disabled because this file will be deleted

import React from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindowGrading = (props) => {
  const handleClose = () => {
    props.handlerBack('no_see');
  };

  return (
    <div className={PopUpWindowCSS.popUpWindowGrading}>
      <div className={PopUpWindowCSS.titleGrading}>Under construction :)</div>
      <button
        className={PopUpWindowCSS.buttonAssignments}
        onClick={handleClose}
      >
        Close
      </button>
    </div>
  );
};

export default PopUpWindowGrading;
