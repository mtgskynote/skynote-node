// Navbar.js
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/appContext'
import { getMessages } from '../utils/messagesMethods.js'
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
} from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import {
  AccountCircle,
  Notifications,
  Settings,
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from '@mui/icons-material'
import { useMediaQuery } from '@material-ui/core'
import InstrumentDropdown from './InstrumentDropdown.js'

function Navbar() {
  // State variables
  const [userData, setUserData] = useState(null) // User data retrieved from API
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0) // Number of unread messages
  const [unreadMessagesContent, setUnreadMessagesContent] = useState([]) // Content of unread messages
  const [notificationsOpen, setNotificationsOpen] = useState(false) // Whether notifications are open
  const [profileAnchorEl, setProfileAnchorEl] = useState(null) // Anchor element for profile menu
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null) // Anchor element for settings menu
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null) // Anchor element for mobile menu
  const [mobileNavOpen, setMobileNavOpen] = useState(false) // Whether mobile navigation is open

  // App context and media query hook
  const { logoutUser, getCurrentUser } = useAppContext()
  const isLargeScreen = useMediaQuery('(min-width: 1024px)')

  // Function to fetch user data from API
  const fetchDataFromAPI = () => {
    getCurrentUser()
      .then((result) => {
        setUserData(result)
      })
      .catch((error) => {
        console.log(`getCurrentUser() error: ${error}`)
      })
  }

  // Effect to fetch user data and unread messages on mount or when userData changes
  useEffect(() => {
    if (userData === null) {
      fetchDataFromAPI()
    }

    if (userData !== null && userData.teacher) {
      getMessages(userData.id, userData.teacher)
        .then((result) => {
          let messagesCount = 0
          const messagesContent = []

          result.forEach((message) => {
            if (message.sender === userData.teacher && message.seen === false) {
              messagesCount++
              messagesContent.push(message.content)
            }
          })
          setUnreadMessagesCount(messagesCount)
          setUnreadMessagesContent(messagesContent)
        })
        .catch((error) => {
          console.log(
            `Cannot get unread messages count content from database: ${error}`
          )
        })
    }
  }, [userData])

  // Effect to remove mobile nav dropdown from screen when the screen is resized to large
  useEffect(() => {
    if (isLargeScreen) {
      setMobileAnchorEl(null)
      setMobileNavOpen(false)
    }
  }, [isLargeScreen, mobileAnchorEl])

  // Handlers for profile, settings, notifications, and mobile navigation
  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget)
  }

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget)
  }

  const handleNotificationsClick = () => {
    setNotificationsOpen((prev) => !prev)
  }

  const handleClose = () => {
    setProfileAnchorEl(null)
    setSettingsAnchorEl(null)
    setNotificationsOpen(false)
  }

  const handleMobileClose = () => {
    setMobileAnchorEl(null)
    setMobileNavOpen(false)
  }

  const handleClickAway = () => {
    setNotificationsOpen(false)
  }

  const handleNavIcon = (event) => {
    setMobileNavOpen(!mobileNavOpen)
    setMobileAnchorEl(event.currentTarget)
  }

  // Navigation items
  const navItems = [
    ['Dashboard', '/'],
    ['Lessons', '/lessons'],
    ['Assignments', '/assignments'],
    // ["Imported Scores", "/imported-scores"],
  ]

  const navItemsMobile = [
    ['Sound Visualization', '/TimbreVisualization'],
    ['My Profile', '/profile'],
  ]

  // Navbar component with navigation and user options
  return (
    <AppBar position="fixed">
      <Toolbar className="justify-between">
        {/* Greeting section */}
        <div className="flex items-center">
          {/* <h5 className="text-slate-50 font-light">
            Hello{" "}
            <span className="font-black">{userData ? userData.name : ""}</span>
            {"!"}
          </h5> */}
          <InstrumentDropdown />
        </div>

        {/* Desktop navigation - main pages section */}
        <div className="hidden lg:flex justify-center items-center w-2/5 space-x-10">
          {/* Render navigation links */}
          {navItems.map(([title, url], index) => {
            return (
              <NavLink
                key={index}
                to={url}
                className={({ isActive }) =>
                  [
                    'text-slate-50 no-underline transition-all duration-300 hover:text-3xl whitespace-nowrap',
                    isActive ? 'font-bold text-3xl' : 'font-normal text-2xl',
                  ].join(' ')
                }
              >
                {title}
              </NavLink>
            )
          })}
        </div>

        {/* Desktop navigation - notifications and settings section */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Notifications */}
          <ClickAwayListener onClickAway={handleClickAway}>
            <div className="relative">
              <Tooltip
                placement="bottom"
                title={!notificationsOpen && 'Notifications'}
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
              {/* Notifications dropdown */}
              <div
                className={`z-50 absolute right-0 w-96 bg-white shadow-md rounded-sm p-4 overflow-y-auto max-h-screen-75 transition-opacity duration-300 ${
                  notificationsOpen
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Render unread messages */}
                {unreadMessagesCount > 0 ? (
                  unreadMessagesContent.map((message, index) => (
                    <div key={index} className="mb-2">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
                        {message}
                      </div>
                    </div>
                  ))
                ) : (
                  // Render message for no unread messages
                  <div className="text-gray-600 mb-2 w-full bg-green-100 p-2 rounded">
                    Looks like your inbox is in perfect harmony 🎶 No new
                    messages here!
                  </div>
                )}
                {/* Link to see all messages */}
                <NavLink to="/assignments" onClick={handleClose}>
                  <button className="mt-2 w-full font-bold text-lg bg-blue-500 hover:bg-blue-600 text-slate-50 font-bold py-2 px-4 rounded border-0">
                    See all messages
                  </button>
                </NavLink>
              </div>
            </div>
          </ClickAwayListener>

          {/* Settings */}
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
          {/* Settings dropdown */}
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

          {/* Profile */}
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
          {/* Profile dropdown */}
          <Menu
            anchorEl={profileAnchorEl}
            open={Boolean(profileAnchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose} component={NavLink} to="/profile">
              My Profile
            </MenuItem>
            <MenuItem onClick={logoutUser}>Logout</MenuItem>
          </Menu>
        </div>

        {/* Mobile navigation - toggle button */}
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
        {/* Mobile navigation - menu */}
        <Menu
          anchorEl={isLargeScreen ? null : mobileAnchorEl}
          open={mobileNavOpen}
          onClose={handleMobileClose}
        >
          {/* Render navigation links for mobile */}
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
            )
          })}
          {/* Logout option */}
          <MenuItem onClick={logoutUser}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
