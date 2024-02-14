import React from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindowGrades = (props) => {

  const handleClose = () => {
    props.handlerBack("nosee")
  };

  return (
    <div className={PopUpWindowCSS.popUpWindowGrades}>
        <div className={PopUpWindowCSS.contentGrades}>
            <div className={PopUpWindowCSS.titleGrades}> 
                Your grade for this assignment
            </div >
            {props.grade?
                <div className={PopUpWindowCSS.gradeGrades}>
                    {props.grade}
                </div>:
                <div className={PopUpWindowCSS.gradeGrades}> 
                    Not graded
                    </div>
            }
            {props.comment?
            <div className={PopUpWindowCSS.commentGrades}>
                {props.comment}
            </div>:
            <div className={PopUpWindowCSS.commentGrades}> 
                No comment
            </div>}

          <button className={PopUpWindowCSS.buttonCloseGrades} onClick={handleClose}>Close</button>
        </div>
    </div>
  );
};

export default PopUpWindowGrades;