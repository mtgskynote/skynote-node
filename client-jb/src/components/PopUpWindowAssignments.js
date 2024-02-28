import React, { useEffect, useRef, useState } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';
import { putAssignment } from "../utils/assignmentsMethods.js";

const PopUpWindowAssignments = (props) => {

  const [fetchedData, setFetchedData] = useState({});
  const [listOptions, setListOptions] = useState(null);
  const studentsInputRef = useRef();
  const messageInputRef = useRef();
  const dueInputRef = useRef();
  const tasksInputRef = useRef();

  // Assuming you have an array of students
  const students = [
    { id: '645b6e484612a8ebe8525933', name: 'Luna' },
    { id: 'anotherStudentId', name: 'Sam' },
    { id: 'anotherStudentId', name: 'Lonce' },
    { id: 'anotherStudentId', name: 'Amaia' },
    { id: 'anotherStudentId', name: 'Alvaro' },
    // Add more students as needed
  ];

  const handleClose = () => {
    props.handlerBack("no_see")
  };

  const handleCreate = (event) => {
    console.log("Submitting...(not really:/)")
    event.preventDefault();
    const studentsInputValue = studentsInputRef.current.value;
    const messageInputValue = messageInputRef.current.value;
    const dueInputValue = dueInputRef.current.value + "T23:59:59.000+00:00";
    const tasksInputValue = tasksInputRef.current.value;
    const postDate = new Date().toISOString();

    console.log("TODOOOO:\n", studentsInputValue, messageInputValue, dueInputValue, tasksInputValue, postDate);
    //Now I need to create an assignmentObject with all the info (add teacherId and postDate), and then upload it to the DB
    // assignmentObject = 
    // putAssignment(assignmentObject);
    
    // handleClose();
  }
  useEffect(() => {

    const data= JSON.parse(localStorage.getItem("scoreData"));
    const auxArray = [];
    data.forEach(score => {
      auxArray.push({title: score.title, level:score.level});
    })
    setFetchedData(data);
    setListOptions(auxArray);

  }, [])
  if (listOptions === null || students === null) {
    return <div>Loading...</div>
  } else {
    return (
      <div className={PopUpWindowCSS.popUpWindowAssignments}>
          <div className={PopUpWindowCSS.titleAssignments}>Create new assignment</div>
          <div className={PopUpWindowCSS.contentAssignments}>
          <form onSubmit={handleCreate}>
                  <div className={PopUpWindowCSS.field}>
                    <label htmlFor="studentIds" className={PopUpWindowCSS.profilelabel}>Students (Ctrl+click to select more than one)</label>
                    <select
                      className={PopUpWindowCSS.profileinput}
                      id="studentIds"
                      name="studentIds"
                      ref={studentsInputRef}
                      multiple
                      required
                    >
                      {students.map((student, index) => (
                        <option key={index} value={student.id}>{`${student.name}`}</option>
                      ))}
                    </select>
                  </div>

                  <div className={PopUpWindowCSS.itemAssignments}>
                    <label htmlFor="message" className={PopUpWindowCSS.profilelabel}>Message</label>
                    <input
                      className={PopUpWindowCSS.inputTextAssignments}
                      type="text"
                      id="message" 
                      name="message"
                      placeholder='Write your message here'
                      ref={messageInputRef}
                      required
                    />
                  </div>

                  <div className={PopUpWindowCSS.itemAssignments}>
                    <label htmlFor="due" className={PopUpWindowCSS.profilelabel}>Due date</label>
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
                    <label htmlFor="tasks" className={PopUpWindowCSS.profilelabel}>Tasks (Ctrl+click to select more than one)</label>
                    <select
                      className={PopUpWindowCSS.profileinput}
                      id="tasks"
                      name="tasks"
                      ref={tasksInputRef}
                      multiple
                      required
                    >
                      {fetchedData.map((title, index) => (
                        <option key={index} value={title._id}>{`${title.title} (level ${title.level})`}</option>
                      ))}
                    </select>
                  </div>
                  <div className={PopUpWindowCSS.buttonGroupAssignments}  >
                  <button className={PopUpWindowCSS.buttonCloseAssignments} type="submit">Save Changes</button>
                  <button className={PopUpWindowCSS.buttonCloseAssignments} onClick={handleClose}>Close</button>
                  </div>
                </form>
          </div>
      </div>
    );
  };
};

export default PopUpWindowAssignments;