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
import {
  AccountCircle,
  Notifications,
  Settings,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import { useMediaQuery } from "@material-ui/core";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [userData, setUserData] = useState(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [unreadMessagesContent, setUnreadMessagesContent] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const { logoutUser, getCurrentUser } = useAppContext();
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

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

  const handleMobileClose = () => {
    setMobileAnchorEl(null);
    setMobileNavOpen(false);
  };

  const handleClickAway = () => {
    setNotificationsOpen(false);
  };

  const handleNavIcon = (event) => {
    setMobileNavOpen(!mobileNavOpen);
    setMobileAnchorEl(event.currentTarget);
  };

  const navItems = [
    ["Dashboard", "/"],
    ["Lessons", "/all-lessons"],
    ["Assignments", "/assignments"],
  ];

  const navItemsMobile = [
    ["Sound Visualization", "/TimbreVisualization"],
    ["My Account", "/profile"],
  ];

  return (
    <AppBar position="fixed">
      <Toolbar className="justify-between">
        <div className="flex items-center">
          <h5 className="text-slate-50 font-light">
            Hello{" "}
            <span className="font-black">{userData ? userData.name : ""}</span>
            {"!"}
          </h5>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex justify-center items-center w-2/5 space-x-10">
          {navItems.map(([title, url], index) => {
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

        <div className="hidden lg:flex items-center space-x-4">
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

        {/* Mobile Navigation Menu */}
        {mobileNavOpen ? (
          <IconButton
            start="edge"
            aria-label="mobile-menu-open"
            className="text-slate-50 lg:hidden block ease-in-out"
            onClick={handleNavIcon}
          >
            <MenuOpenIcon />
          </IconButton>
        ) : (
          <IconButton
            start="edge"
            aria-label="mobile-menu-closed"
            className="text-slate-50 lg:hidden block"
            onClick={handleNavIcon}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Menu
          anchorEl={isLargeScreen ? handleMobileClose : mobileAnchorEl}
          open={mobileNavOpen}
          onClose={handleMobileClose}
        >
          {navItems.concat(navItemsMobile).map(([title, url], index) => {
            return (
              <MenuItem
                onClick={handleMobileClose}
                component={NavLink}
                to={url}
                key={index}
              >
                {title}
              </MenuItem>
            );
          })}
          <MenuItem onClick={logoutUser}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
