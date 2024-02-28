import React, { useEffect, useRef, useState } from 'react';
import PopUpWindowCSS from './PopUpWindow.module.css';

const PopUpWindowAssignments = (props) => {

  const [fetchedData, setFetchedData] = useState({});
  const [listOptions, setListOptions] = useState(null);
  const studentsInputRef = useRef();
  const teacherInputRef = useRef();
  const messageInputRef = useRef();
  const dueInputRef = useRef();
  const postInputRef = useRef();
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

  const handleChange = (selectedOptions) => {
    // Handle the selected options
    console.log('Selected Options:', selectedOptions);
  };

  const handleCreate = (event) => {
    console.log("Submitting...(not really:/)")
    event.preventDefault();
    const studentsInputValue = studentsInputRef.current.value;
    const teacherInputValue = teacherInputRef.current.value;
    const messageInputValue = messageInputRef.current.value;
    const dueInputValue = dueInputRef.current.value;
    const postInputValue = postInputRef.current.value;
    const tasksInputValue = tasksInputRef.current.value;

    console.log("TODOOOO:\n", studentsInputValue, teacherInputValue, messageInputValue, dueInputValue, postInputValue, tasksInputValue);
  }
  useEffect(() => {
    const loadData = async () => {
      const data= JSON.parse(localStorage.getItem("scoreData"));
      const auxArray = [];
      data.forEach(score => {
        auxArray.push([score.title, score.level]);
      })
      setFetchedData(data);
      setListOptions(auxArray);
      console.log("Holaaaa", auxArray);
    };

    loadData();
    
  }, [])
  if (listOptions === null) {
    return <div>Loading...</div>
  } else {
    return (
      <div className={PopUpWindowCSS.popUpWindowAssignments}>
          <div className={PopUpWindowCSS.titleAssignments}>Create new assignment</div>
          <div className={PopUpWindowCSS.contentAssignments}>
          <form onSubmit={handleCreate}>
                  <div className={PopUpWindowCSS.itemAssignments}>
                    <label htmlFor="studentIds" className={PopUpWindowCSS.profilelabel}> Select students</label>
                    <input
                      className={PopUpWindowCSS.checkboxAssignments}
                      type="text"
                      id="studentIds" 
                      name="name"
                      placeholder='work in progress - checkbox list dropdown'
                      ref={studentsInputRef}
                      required
                    />
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
                    <label htmlFor="due" className={PopUpWindowCSS.profilelabel}>Due date:</label>
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
                    <label htmlFor="tasks" className={PopUpWindowCSS.profilelabel}>Tasks (Ctrl+click to select more than one):</label>
                    <select
                      className={PopUpWindowCSS.profileinput}
                      id="tasks"
                      name="tasks"
                      ref={tasksInputRef}
                      multiple
                      required
                    >
                      {/* Dynamically generate options from allTitles array */}
                      {listOptions.map((title, index) => (
                        <option key={index} value={title}>{`${title[0]} (level ${title[1]})`}</option>
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