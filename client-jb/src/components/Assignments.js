import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AssignmentsCSS from './Assignments.module.css';
import { getAllAssignments } from '../utils/assignmentsMethods.js';
import { getProfileData } from '../utils/usersMethods.js';
import {
  faFileImport,
  faUser,
  faTriangleExclamation,
  faEye,
  faMusic,
  faPencilSquare,
  faBoxArchive,
  faRecordVinyl,
  faBookBookmark,
} from '@fortawesome/free-solid-svg-icons';
import PopUpWindowGrades from './PopUpWindowGrades';
import PopUpWindowRecordings from './PopUpWindowRecordings.js';
import Messages from './messages.js';
import LoadingScreen from './LoadingScreen.js';
import Error from './Error.js';
import MessagesCard from './MessagesCard.js';

const Assignments = () => {
  const navigate = useNavigate();
  const { getCurrentUser } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [scoresData, setScoresData] = useState(null);
  const [userAnnouncements, setUserAnnouncements] = useState(null);
  const [popUpWindowGrade, setPopUpWindowGrade] = useState(false);
  const [popUpWindowRecordings, setPopUpWindowRecordings] = useState(false);
  const [taskComment, setTaskComment] = useState(null);
  const [taskGrade, setTaskGrade] = useState(null);
  const [selectedScore, setSelectedScore] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [teacherDataError, setTeacherDataError] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState(false);

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  const errorMessages = {
    teacherDataError: "We can't find a teacher for your user.",
    assignmentsError: "We can't find any assignments for your user.",
  };

  const fetchDataFromAPI = () => {
    getCurrentUser()
      .then((result) => {
        setUserData(result);
      })
      .catch((error) => {
        console.log(`getCurrentUser() error: ${error}`);
      });
  };

  const handleSeeClick = (id, scoreXML) => {
    navigate(`/ListRecordings/${scoreXML}`, { state: { id: id } });
  };

  const handleRecord = (scoreXML) => {
    navigate(`/all-lessons/${scoreXML}`);
  };

  const handleSeeGrades = (option, comment, grade) => {
    if (option === 'see') {
      setPopUpWindowGrade(true);
      setTaskComment(comment);
      setTaskGrade(grade);
    } else {
      setPopUpWindowGrade(false);
      setTaskComment(null);
      setTaskGrade(null);
    }
  };

  const handleSelectRecording = (option, scoreId, announcementId) => {
    if (option === 'open') {
      setPopUpWindowRecordings(true);
      setSelectedScore(scoreId);
      setSelectedAnnouncement(announcementId);
    } else {
      setPopUpWindowRecordings(false);
      setSelectedScore(null);
      setSelectedAnnouncement(null);
    }
  };

  const fetchTeacherInfo = async (teacherId) => {
    try {
      const result = await getProfileData(teacherId);
      if (result && result.user && result.user._id) {
        setTeacherData({
          id: result.user._id,
          name: result.user.name,
          lastName: result.user.lastName,
          email: result.user.email,
        });
      } else {
        console.error('Invalid teacher data received:', result);
        setTeacherDataError(true);
      }
    } catch (error) {
      console.error('Error getting teacher profile data:', error);
      setTeacherDataError(true);
    }
  };

  //get User Data
  useEffect(() => {
    if (userData === null) {
      fetchDataFromAPI();
    } else {
      if (userData.teacher) {
        fetchTeacherInfo(userData.teacher);
      } else {
        setTeacherDataError(true);
      }
    }
  }, [userData]);

  //get Scores data
  useEffect(() => {
    // import local data
    const local = JSON.parse(localStorage.getItem('scoreData'));
    // save in state
    setScoresData(local);
  }, []); // Only once

  useEffect(() => {
    if (userData !== null && scoresData !== null && teacherData !== null) {
      // Assignments
      getAllAssignments(userData.id)
        .then((result) => {
          if (result.length !== 0) {
            setUserAnnouncements(result.reverse());
          } else {
            setAssignmentsError(true);
          }
        })
        .catch((error) => {
          setAssignmentsError(true);
          console.error('Error fetching assignments:', error);
        });
    }
  }, [userData, scoresData, teacherData]);

  useEffect(() => {
    if (userAnnouncements) {
      const hash = window.location.hash.substring(1); // Get the hash from the URL
      const element = document.getElementById(hash); // Find the element with that ID

      if (element) {
        const rect = element.getBoundingClientRect(); // Get the position of the element
        const offset = window.innerWidth >= 600 ? 64 : 56; // AppBar height
        const y = rect.top + window.scrollY - offset; // Calculate the y-coordinate to scroll to

        window.scroll({
          top: y,
          behavior: 'smooth',
        });
      }
    }
  }, [userAnnouncements]);

  useEffect(() => {
    if (userData && userAnnouncements && teacherData !== null) {
      setIsLoading(false);
    }
    if (teacherDataError || assignmentsError) {
      setIsLoading(false);
    }
  }, [
    userData,
    teacherDataError,
    userAnnouncements,
    teacherData,
    assignmentsError,
  ]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen px-8 pt-2 pb-12">
      <div className="h-full flex">
        {/* Left side with cards stacked vertically */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div className="bg-white shadow-md rounded-lg p-4">Card 1</div>
            <div className="bg-white shadow-md rounded-lg p-4">Card 2</div>
            <div className="bg-white shadow-md rounded-lg p-4">Card 3</div>
            <div className="bg-white shadow-md rounded-lg p-4">Card 4</div>
            {/* Add more cards as needed */}
          </div>
        </div>

        {/* Right side messages board */}
        <div className="w-1/3 p-4 flex flex-col">
          <MessagesCard user={userData} teacher={teacherData} />
        </div>
      </div>
    </div>
    /* {teacherDataError ? (
        <Error message={errorMessages.teacherDataError} />
      ) : assignmentsError ? (
        <Error message={errorMessages.assignmentsError} />
      ) : (
        <div className={AssignmentsCSS.container}>
          <div className={AssignmentsCSS.left}>
            {userAnnouncements !== null ? (
              userAnnouncements.map((announcement, index) => (
                <div
                  id={announcement._id}
                  className={AssignmentsCSS.tableBox}
                  key={index}
                >
                  <div>
                    <div className={AssignmentsCSS.header}>
                      <div>
                        Posted on:{' '}
                        {new Date(announcement.postDate).toLocaleDateString(
                          'es-ES',
                          options
                        )}
                      </div>
                      <div>
                        Due on:{' '}
                        {new Date(announcement.dueDate).toLocaleDateString(
                          'es-ES',
                          options
                        )}
                      </div>
                    </div>
                    <div className={AssignmentsCSS.announcementBody}>
                      <div className={AssignmentsCSS.teacher}>
                        {teacherData.name}{' '}
                        <FontAwesomeIcon
                          icon={faUser}
                          className={AssignmentsCSS.userIcon}
                        />{' '}
                        said...
                      </div>
                      <div className={AssignmentsCSS.message}>
                        {announcement.message}
                      </div>
                      <div className={AssignmentsCSS.footNote}>
                        {announcement.tasks ? (
                          <div className={AssignmentsCSS.note}>
                            <FontAwesomeIcon
                              icon={faTriangleExclamation}
                              className={AssignmentsCSS.exclamationIcon}
                            />
                            <div className={AssignmentsCSS.text}>
                              {announcement.tasks.length} submission
                              assignment(s) linked to this announcement
                            </div>
                            <FontAwesomeIcon
                              icon={faTriangleExclamation}
                              className={AssignmentsCSS.exclamationIcon}
                            />
                          </div>
                        ) : (
                          ''
                        )}
                        <div className={AssignmentsCSS.taskGroup}>
                          {announcement.tasks.map((task, index) => {
                            var current_score = scoresData.find(
                              (item) => item._id === task.score
                            );
                            return (
                              <div
                                className={AssignmentsCSS.taskItem}
                                key={index}
                              >
                                <div className={AssignmentsCSS.taskHeader}>
                                  <div>
                                    <h6>
                                      <FontAwesomeIcon
                                        icon={faMusic}
                                        className={AssignmentsCSS.simpleIcon}
                                      />
                                      {current_score.title}
                                    </h6>
                                  </div>
                                  <div>
                                    <h6>
                                      <FontAwesomeIcon
                                        icon={faPencilSquare}
                                        className={AssignmentsCSS.simpleIcon}
                                      />
                                      {current_score.skill}
                                    </h6>
                                  </div>
                                  <div>
                                    <h6>
                                      <FontAwesomeIcon
                                        icon={faBoxArchive}
                                        className={AssignmentsCSS.simpleIcon}
                                      />
                                      Level {current_score.level}
                                    </h6>
                                  </div>
                                </div>
                                <div>
                                  {task.answer ? (
                                    <div className={AssignmentsCSS.submitted}>
                                      <div className={AssignmentsCSS.cursive}>
                                        Status: Submitted
                                      </div>
                                      <div
                                        className={AssignmentsCSS.buttonGroup}
                                      >
                                        <FontAwesomeIcon
                                          title="Go to recording assigned to this submission"
                                          icon={faEye}
                                          className={AssignmentsCSS.simpleIcon}
                                          onClick={() =>
                                            handleSeeClick(
                                              task.answer.recordingId,
                                              current_score.fname
                                            )
                                          }
                                        />
                                        <FontAwesomeIcon
                                          title="See grade and comment"
                                          icon={faBookBookmark}
                                          className={AssignmentsCSS.simpleIcon}
                                          onClick={() =>
                                            handleSeeGrades(
                                              'see',
                                              task.answer.comment,
                                              task.answer.grade
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={AssignmentsCSS.notSubmitted}
                                    >
                                      <div className={AssignmentsCSS.cursive}>
                                        Status: Not submitted
                                      </div>
                                      <div
                                        className={AssignmentsCSS.buttonGroup}
                                      >
                                        <FontAwesomeIcon
                                          title="Record for this submission"
                                          icon={faRecordVinyl}
                                          className={AssignmentsCSS.simpleIcon}
                                          onClick={() =>
                                            handleRecord(current_score.fname)
                                          }
                                        />
                                        <FontAwesomeIcon
                                          title="Assign recording to this submission"
                                          icon={faFileImport}
                                          className={AssignmentsCSS.simpleIcon}
                                          onClick={() =>
                                            handleSelectRecording(
                                              'open',
                                              task.score,
                                              announcement._id
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>No announcements yet</div>
            )}
          </div>
          <div className={AssignmentsCSS.right}>
            {userData !== null ? (
              <Messages user={userData} teacher={teacherData} />
            ) : (
              <Messages />
            )}
          </div>
          {popUpWindowGrade && (
            <PopUpWindowGrades
              handlerBack={handleSeeGrades}
              comment={taskComment}
              grade={taskGrade}
            />
          )}
          {popUpWindowRecordings && (
            <PopUpWindowRecordings
              handlerBack={handleSelectRecording}
              scoreId={selectedScore}
              userId={userData.id}
              announcementId={selectedAnnouncement}
            />
          )}
        </div>
      )} */
  );
};

export default Assignments;
