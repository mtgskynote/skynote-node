import React from 'react';
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from '@mui/icons-material';
import { IconButton } from '@mui/material';

/**
 * The MobileNavToggle component provides a button to toggle the mobile navigation menu.
 *
 * Props:
 * - mobileNavOpen (boolean): Indicates if the mobile navigation menu is open.
 * - handleNavIcon (function): Callback to handle the toggle action.
 */
const MobileNavToggle = ({ mobileNavOpen, handleNavIcon }) => {
  return (
    <>
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
    </>
  );
};

export default MobileNavToggle;
