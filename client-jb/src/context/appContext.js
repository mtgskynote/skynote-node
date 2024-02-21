import React, { useReducer, useContext } from "react";

import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  LOGOUT_USER,
} from "./actions";

import reducer from "./reducer";
import axios from "axios";
import XMLParser from "react-xml-parser";


// Get user, token, and userLocation from local storage
const user = localStorage.getItem("user");
const token = localStorage.getItem("token");
const userLocation = localStorage.getItem("location");

// Set initial state
const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: token,
  userLocation: userLocation || "",
  jobLocation: userLocation || "",
};


// Create context
const AppContext = React.createContext();

// Create provider component
const AppProvider = ({ children }) => {
  // children is a prop that is passed to the component
  // children is the component that is wrapped by the AppProvider
  // in this case, the component is App.js

  // Use reducer hook to manage state
  const [state, dispatch] = useReducer(reducer, initialState);

  // Display alert message
  const displayAlert = () => {
    dispatch({
      type: DISPLAY_ALERT,
    });
    clearAlert();
  };

  // Clear alert message after 3 seconds
  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 3000);
  };

  // Add user, token, and location to local storage
  const addUserToLocalStorage = (user, token, location) => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    localStorage.setItem("location", location);
  };

  // Remove user, token, and location from local storage
  const removeUserFromLocalStorage = (user, token, location) => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("location");
    localStorage.removeItem("scoreData"); //This is technically not User data, but it's simpler if I leave it here cause we have to get rid of it anyways :)
  };

  // Set up user with current user, endpoint, and alert text
  const setupUser = async ({ currentUser, endPoint, alertText }) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const { data } = await axios.post(
        `/api/v1/auth/${endPoint}`,
        currentUser
      );  

      const { user, token, location } = data;

      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: {
          user,
          token,
          location,
          alertText,
        },
      });
      addUserToLocalStorage(user, token, location );  // why are we doing this?
      getAllScoreData2();
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };


  // Logout user
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  const getCurrentUser = async () => {
    return state.user;
  }

  // functions for getting the names of the scores from the database

  const getAllLevels = async (level) => {
    try {
      const response = await axios.post("/api/v1/scores/levels", {
        level: level,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  const getAllSkills = async (level) => {
    try {
      const response = await axios.post("/api/v1/scores/skills", {
        level: level,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  const getAllNames = async (level, skill) => {
    try {
      const response = await axios.post("/api/v1/scores/names", {
        level: level,
        skill: skill,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  //Lonce`s
  const getAllScoreData = async() => {
    try {
      const response = await axios.get("/api/v1/scores/getAllScoreData", {
      });
      console.log("======================   names returned :");//, response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };  

  //OUR
  const getAllScoreData2 = async() => {
    try {
      const response = await axios.get("/api/v1/scores/getAllScoreData2", {
      });
      var tempScoreData=response.data;
      for (let file of tempScoreData) {
        let scoreName = await getTitle(file.fname);
        tempScoreData.find(obj => obj.fname === file.fname).title = scoreName;
      }
      localStorage.setItem("scoreData", JSON.stringify(tempScoreData));
      return tempScoreData;
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  }; 

  const getTitle = async (fileName) => {
    try {
      const response = await fetch(`xmlScores/violin/${fileName}.xml`);
      const xmlFileData = await response.text();
      const movementTitle = Array.from(
        new XMLParser()
          .parseFromString(xmlFileData)
          .getElementsByTagName("movement-title")
      );
      const workTitle = Array.from(
        new XMLParser()
          .parseFromString(xmlFileData)
          .getElementsByTagName("work-title")
      );
      if (movementTitle.length > 0) {
        return movementTitle[0].value;
      } else if (workTitle.length > 0) {
        return workTitle[0].value;
      } else {
        //console.log(`NO DATA FOUND FOR ${fileName}.xml`);
        return fileName
      }
    } catch (err) {
      console.log(err.message);
      return fileName;
    }
  };

 
  // Return provider component with context value
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        logoutUser,
        getCurrentUser,
        getAllLevels,
        getAllSkills,
        getAllNames,
        getAllScoreData,
        getAllScoreData2, //ours
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Create custom hook to use AppContext
const useAppContext = () => {
  return useContext(AppContext);
};

// Export AppProvider, initialState, and useAppContext
export { AppProvider, initialState, useAppContext };
