import React, { useEffect, useRef, useState } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';
import { putAssignment } from '../utils/assignmentsMethods.js';

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
    { id: '63f5ec964b6cde570ab031f9', name: 'Abhishek Choubey' },
    { id: '64086d1a35ae091d3376f383', name: 'Foo' },
    { id: '641b001fb6f4609169b11e2b', name: 'Kristen' },
    { id: '640b1a85d101afc9710bd7f3', name: 'Lonce' },
    // Add more students as needed
  ];

  const handleClose = () => {
    props.handlerBack('no_see');
  };

  const handleCreate = (event) => {
    console.log('Submitting...');
    event.preventDefault();
    const studentsInputValue = Array.from(
      studentsInputRef.current.selectedOptions
    ).map((option) => option.value);
    const messageInputValue = messageInputRef.current.value;
    const dueInputValue = dueInputRef.current.value + 'T23:59:59.000+00:00';
    // const tasksInputValue = Array.from(tasksInputRef.current.selectedOptions).map(option => option.value);
    const tasksInputValue = Array.from(
      tasksInputRef.current.selectedOptions
    ).map((option) => ({ score: option.value }));
    const postDate = new Date().toISOString();

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //TEACHER ID IS FIXED CAUSE WE CURRENTLY DON'T HAVE TEACHER SPECIFIC ACCOUNTS, PLUS, THIS IS JUST FOR TESTING SO IT NEEDS TO
    // REVIEWED BEFORE MOVING IT TO THE ACTUAL CODE
    const assignmentTest = {
      teacherId: '5d34c59c098c00453a233bf3',
      students: studentsInputValue,
      message: messageInputValue,
      post: postDate,
      due: dueInputValue,
      tasks: tasksInputValue,
    };
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // UNCOMMENT THIS AFTER DEBUGGING
    putAssignment(assignmentTest);
    handleClose();
    console.log('Submited :)');
  };
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('scoreData'));
    const auxArray = [];
    data.forEach((score) => {
      auxArray.push({ title: score.title, level: score.level });
    });
    setFetchedData(data);
    setListOptions(auxArray);
  }, []);
  if (listOptions === null || students === null) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className={PopUpWindowCSS.popUpWindowAssignments}>
        <div className={PopUpWindowCSS.titleAssignments}>
          Create new assignment
        </div>
        <div className={PopUpWindowCSS.contentAssignments}>
          <form className={PopUpWindowCSS.form} onSubmit={handleCreate}>
            <div className={PopUpWindowCSS.itemAssignments}>
              <div className={PopUpWindowCSS.inputElementAssignments}>
                <label
                  htmlFor="studentIds"
                  className={PopUpWindowCSS.formlabel}
                >
                  Students
                </label>
                <select
                  className={PopUpWindowCSS.inputTextAssignments}
                  id="studentIds"
                  name="studentIds"
                  ref={studentsInputRef}
                  multiple
                  required
                >
                  {students.map((student, index) => (
                    <option
                      key={index}
                      value={student.id}
                    >{`${student.name}`}</option>
                  ))}
                </select>
              </div>

              <div className={PopUpWindowCSS.inputElementAssignments}>
                <label htmlFor="message" className={PopUpWindowCSS.formlabel}>
                  Message
                </label>
                <textarea
                  className={PopUpWindowCSS.inputTextAssignments}
                  id="message"
                  name="message"
                  placeholder="Write your message here"
                  ref={messageInputRef}
                  required
                />
              </div>

              <div className={PopUpWindowCSS.inputElementAssignments}>
                <label htmlFor="due" className={PopUpWindowCSS.formlabel}>
                  Due date
                </label>
                <input
                  className={PopUpWindowCSS.inputTextAssignments}
                  type="date"
                  id="due"
                  name="due"
                  ref={dueInputRef}
                  required
                />
              </div>

              <div className={PopUpWindowCSS.inputElementAssignments}>
                <label htmlFor="tasks" className={PopUpWindowCSS.formlabel}>
                  Tasks
                </label>
                <select
                  className={PopUpWindowCSS.inputTextAssignments}
                  id="tasks"
                  name="tasks"
                  ref={tasksInputRef}
                  multiple
                  required
                >
                  {fetchedData.map((title, index) => (
                    <option
                      key={index}
                      value={title._id}
                    >{`${title.title} (level ${title.level})`}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={PopUpWindowCSS.buttonGroupAssignments}>
              <button
                className={PopUpWindowCSS.buttonAssignments}
                type="submit"
              >
                Save Changes
              </button>
              <button
                className={PopUpWindowCSS.buttonAssignments}
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
};

export default PopUpWindowAssignments;
