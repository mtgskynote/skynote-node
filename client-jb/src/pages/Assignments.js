import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/appContext.js';
import { getAllAssignments } from '../utils/assignmentsMethods.js';
import { getProfileData } from '../utils/usersMethods.js';
import LoadingScreen from '../components/navigation/LoadingScreen.js';
import Error from '../components/alerts/Error.js';
import MessagesCard from '../components/assignments/MessagesCard.js';
import AssignmentPanel from '../components/assignments/AssignmentPanel.js';

/**
 * Assignments page component to display user assignments and related information,
 * like messages.
 * @component
 * @example
 * // Example usage:
 * // <Assignments />
 */
const Assignments = () => {
  const { getCurrentUser } = useAppContext();

  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [teacherData, setTeacherData] = useState(null);
  const [scoresData, setScoresData] = useState(null);
  const [assignments, setAssignments] = useState(null);
  const [teacherDataError, setTeacherDataError] = useState(false);
  const [assignmentsError, setAssignmentsError] = useState(false);

  // Set error messages for missing data
  const errorMessages = {
    teacherDataError: "We can't find a teacher for your user.",
    assignmentsError: "We can't find any assignments for your user.",
  };

  // Get user data
  const fetchDataFromAPI = () => {
    getCurrentUser()
      .then((result) => {
        setUserData(result);
      })
      .catch((error) => {
        console.log(`getCurrentUser() error: ${error}`);
      });
  };

  // Get teacher data
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

  // Get user and teacher data
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

  // Get scores data from local storage
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('scoreData'));
    setScoresData(local);
  }, []);

  // Retrieve all assignments from a user
  useEffect(() => {
    if (userData !== null && scoresData !== null && teacherData !== null) {
      getAllAssignments(userData.id)
        .then((result) => {
          if (result.length !== 0) {
            setAssignments(result.reverse());
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

  // Automatically scroll to the corresponding assignment when navigating from a different page
  useEffect(() => {
    if (assignments) {
      const hash = window.location.hash.substring(1);
      const element = document.getElementById(hash);

      if (element) {
        const rect = element.getBoundingClientRect();
        // Offset needs to be calculated because of the additional Navbar height
        const offset = window.innerWidth >= 600 ? 64 : 56;
        const y = rect.top + window.scrollY - offset;

        window.scroll({
          top: y,
          behavior: 'smooth',
        });
      }
    }
  }, [assignments]);

  // Determine whether or not the loading screen is displayed
  useEffect(() => {
    if (userData && assignments && teacherData !== null) {
      setIsLoading(false);
    }
    if (teacherDataError || assignmentsError) {
      setIsLoading(false);
    }
  }, [userData, teacherDataError, assignments, teacherData, assignmentsError]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="h-screen px-8 pt-2 pb-16">
      {teacherDataError ? (
        <Error message={errorMessages.teacherDataError} />
      ) : assignmentsError ? (
        <Error message={errorMessages.assignmentsError} />
      ) : (
        <div className="h-full flex">
          {/* Left side - assignments board */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <div className="space-y-4">
              {assignments !== null ? (
                assignments.map((assignment, index) => {
                  return (
                    <AssignmentPanel
                      key={index}
                      dueDate={assignment.dueDate}
                      postedDate={assignment.postDate}
                      tasks={assignment.tasks}
                      message={assignment.message}
                      scoresData={scoresData}
                      assignmentId={assignment._id}
                      userId={userData.id}
                    />
                  );
                })
              ) : (
                <p className="text-center text-2xl font-bold text-gray-800">
                  Looks like your teacher hasn&apos;t assigned you anything yet!
                </p>
              )}
            </div>
          </div>

          {/* Right side - messages board */}
          <div className="w-1/3 p-4 flex flex-col">
            <MessagesCard user={userData} teacher={teacherData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
