import React, { useReducer, useContext } from "react";
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
} from "./actions";

import reducer from "./reducer";
import axios from "axios";

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
  showSidebar: true, // as an overlay
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
      addUserToLocalStorage({ user, token, location });
    } catch (error) {
      dispatch({
        type: SETUP_USER_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  // Logout user
  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeUserFromLocalStorage();
  };

  // functions for getting the names of the scores from the database

  const getAllLevels = async (level) => {
    try {
      const response = await axios.post("/api/v1/scores/levels", {
        level: level,
      });
      // console.log(response.data);
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
      // console.log(response.data);
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
      // console.log("names:", response.data);
    } catch (error) {
      console.error("Error fetching file names:", error);
    }
  };

  // Return provider component with context value
  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        getAllLevels,
        getAllSkills,
        getAllNames,
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
