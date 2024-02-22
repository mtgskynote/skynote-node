import React from 'react';
import { useRef } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindowAssignments = (props) => {

  const studentsInputRef = useRef();
  const teacherInputRef = useRef();
  const messageInputRef = useRef();
  const dueInputRef = useRef();
  const postInputRef = useRef();
  const tasksInputRef = useRef();

  const handleClose = () => {
    props.handlerBack("no_see")
  };

  const handleCreate = () => {
    console.log("Submitting...(not really:/)")
    const studentsInputValue = studentsInputRef.current.value;
    const teacherInputValue = teacherInputRef.current.value;
    const messageInputValue = messageInputRef.current.value;
    const dueInputValue = dueInputRef.current.value;
    const postInputValue = postInputRef.current.value;
    const tasksInputValue = tasksInputRef.current.value;

    console.log("TODOOOO:\n", studentsInputValue, teacherInputValue, messageInputValue, dueInputValue, postInputValue, tasksInputValue);
  }

  return (
    <div className={PopUpWindowCSS.popUpWindowGrades}>
        <div className={PopUpWindowCSS.contentGrades}>
        <form onSubmit={handleCreate}>
                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="studentIds" className={PopUpWindowCSS.profilelabel}>StudentIds(Array of ObjectIds):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="text"
                    id="studentIds" 
                    name="name"
                    placeholder='645b6e484612a8ebe8525933'
                    ref={studentsInputRef}
                    required
                  />
                </div>

                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="teacherId" className={PopUpWindowCSS.profilelabel}>TeacherId(ObjectId):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="text"
                    id="teacherId" 
                    name="teacherId"
                    placeholder='5d34c59c098c00453a233bf3'
                    ref={teacherInputRef}
                    required
                  />
                </div>

                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="message" className={PopUpWindowCSS.profilelabel}>Message(String):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="text"
                    id="message" 
                    name="message"
                    placeholder='Hola como estas?'
                    ref={messageInputRef}
                    required
                  />
                </div>

                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="due" className={PopUpWindowCSS.profilelabel}>Due(Date):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="date"
                    id="due" 
                    name="due"
                    ref={dueInputRef}
                    required
                  />
                </div>

                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="post" className={PopUpWindowCSS.profilelabel}>Post(Date):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="date"
                    id="post" 
                    name="post"
                    ref={postInputRef}
                    required
                  />
                </div>

                <div className={PopUpWindowCSS.field}>
                  <label htmlFor="tasks" className={PopUpWindowCSS.profilelabel}>Tasks(Array):</label>
                  <input
                    className={PopUpWindowCSS.profileinput}
                    type="text"
                    id="tasks" 
                    name="tasks"
                    placeholder='Work in progress'
                    ref={tasksInputRef}
                    required
                  />
                </div>
                <button className={PopUpWindowCSS.buttonCloseGrades} type="submit">Save Changes</button>
                <button className={PopUpWindowCSS.buttonCloseGrades} onClick={handleClose}>Close</button>
              </form>
        </div>
    </div>
  );
};

export default PopUpWindowAssignments;