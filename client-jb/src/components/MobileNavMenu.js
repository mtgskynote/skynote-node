import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';

/**
 * The MobileNavMenu component provides a dropdown menu for mobile navigation.
 *
 * Props:
 * - isLargeScreen (boolean): Indicates if the screen size is large.
 * - mobileAnchorEl (object|null): Anchor element for the mobile menu.
 * - mobileNavOpen (boolean): Controls the visibility of the mobile menu.
 * - handleMobileClose (function): Callback to close the mobile menu.
 * - navItems (array): List of main navigation items.
 * - navItemsMobile (array): List of additional navigation items for mobile.
 * - logoutUser (function): Callback to log out the user.
 *
 * The component:
 * - Renders navigation links by combining navItems and navItemsMobile.
 * - Closes the menu when a navigation link is clicked.
 */
const MobileNavMenu = ({
  isLargeScreen,
  mobileAnchorEl,
  mobileNavOpen,
  handleMobileClose,
  navItems,
  navItemsMobile,
  logoutUser,
}) => {
  return (
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
        );
      })}
      {/* Logout option */}
      <MenuItem onClick={logoutUser}>Logout</MenuItem>
    </Menu>
  );
};

export default MobileNavMenu;
