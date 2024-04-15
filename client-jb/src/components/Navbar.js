// Navbar.js
import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { getMessages } from "../utils/messagesMethods.js";
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from "@mui/material";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { AccountCircle, Notifications, Settings } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [userData, setUserData] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadMessagesContent, setUnreadMessagesContent] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);

  const { logoutUser, getCurrentUser } = useAppContext();

  const fetchDataFromAPI = () => {
    // get the current user from the app context so that we can fetch user data
    // this function is already asynchronous
    getCurrentUser()
      .then((result) => {
        setUserData(result);
      })
      .catch((error) => {
        console.log(`getCurentUser() error: ${error}`);
      });
  };

  // get user data to display greeting in upper left hand corner
  useEffect(() => {
    if (userData === null) {
      fetchDataFromAPI();
    }

    // need to handle for asynchronicity
    if (userData !== null) {
      getMessages(userData.id, userData.teacher)
        .then((result) => {
          let messagesCount = 0;
          const messagesContent = [];

          // filter by messages sent from the teacher that have not yet been seen by the user
          result.forEach((message) => {
            if (message.sender === userData.teacher && message.seen === false) {
              messagesCount++;
              messagesContent.push(message.content);
            }
          });
          setUnreadMessagesCount(messagesCount);
          setUnreadMessagesContent(messagesContent);
        })
        .catch((error) => {
          console.log(
            `Cannot get unread messages count content from database: ${error}`
          );
        });
    }
  }, [userData]);

  // handle clicks to profile icon
  // clicking the profile icon will open a modal displaying links to profile page and logout
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  // handle clicks to settings icon
  // clicking the settings icon will open a modal displaying a link to sound visualization
  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen((prev) => !prev);
  };

  // general function to handle when a user clicks away from an open modal
  const handleClose = () => {
    setProfileAnchorEl(null);
    setSettingsAnchorEl(null);
    setNotificationsOpen(false);
  };

  const handleClickAway = () => {
    setNotificationsOpen(false);
  };

  return (
    <AppBar position="fixed">
      <Toolbar className="justify-between">
        {/* This first inner block is primarily used to center the three middle page links.
         * The logo for SkyNote should be placed in the upper left hand corner.
         */}
        <div className="flex items-center">
          <h5 className="text-slate-50 font-light">
            Hello{" "}
            <span className="font-black">{userData ? userData.name : ""}</span>
            {"!"}
          </h5>
        </div>

        <div className="flex justify-center items-center w-2/5 space-x-10">
          {/* Add NavLinks for three main application pages: Dashboard, Lessons, and Assignments.
           * We use NavLink from react-router-dom because a link's style can be conditionally set when it is active.
           * Text size and weight is conditionally changed when active versus inactive.
           */}
          {[
            ["Dashboard", "/"],
            ["Lessons", "/all-lessons"],
            ["Assignments", "/assignments"],
          ].map(([title, url], index) => {
            return (
              <NavLink
                key={index}
                to={url}
                className={({ isActive }) =>
                  [
                    "text-slate-50 no-underline transition-all duration-300 hover:text-3xl",
                    isActive ? "font-bold text-3xl" : "font-normal text-2xl",
                  ].join(" ")
                }
              >
                {title}
              </NavLink>
            );
          })}
        </div>

        {/* This divider contains navigation links to view messages/notifications, settings, and the user profile
         * Each icon opens up a modal with more information.
         */}
        <div className="flex items-center space-x-4">
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="relative">
              <Tooltip
                placement="bottom"
                title={!notificationsOpen && "Notifications"}
                arrow
              >
                <IconButton
                  start="edge"
                  aria-label="notifications"
                  className="text-slate-50"
                  onClick={handleNotificationsClick}
                >
                  <Badge badgeContent={unreadMessagesCount} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
              </Tooltip>
              <div
                className={`z-50 absolute right-0 w-96 bg-white shadow-md rounded-sm p-4 overflow-y-auto max-h-screen-75 transition-opacity duration-300 ${
                  notificationsOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                {unreadMessagesCount > 0 ? (
                  unreadMessagesContent.map((message, index) => (
                    <div key={index} className="mb-2">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                        {message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-600 mb-2 w-full bg-green-100 p-2 rounded">
                    Looks like your inbox is in perfect harmony 🎶 No new
                    messages here!
                  </div>
                )}
                <NavLink to="/assignments" onClick={handleClose}>
                  <button className="mt-2 w-full font-bold text-lg bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded border-0">
                    See all messages
                  </button>
                </NavLink>
              </div>
            </div>
          </ClickAwayListener>

          <Tooltip placement="bottom" title="Settings" arrow>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="settings"
              onClick={handleSettingsClick}
            >
              <Settings />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={settingsAnchorEl}
            open={Boolean(settingsAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={handleClose}
              component={NavLink}
              to="/TimbreVisualization"
            >
              Sound Visualization
            </MenuItem>
          </Menu>

          {/* The following block of code handles navigation to a user's profile and logging out.
           * The tooltip displays information below the account circle icon.
           * Clicking the account circle icon opens up a sub-menu with the aforementioned navigation links.
           */}
          <Tooltip placement="bottom" title="Profile" arrow>
            <IconButton
              edge="start"
              className="text-slate-50"
              aria-label="profile"
              onClick={handleProfileClick}
            >
              <AccountCircle />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={NavLink} to="/profile">
              My Account
            </MenuItem>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
