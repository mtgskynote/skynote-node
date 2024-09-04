import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, useTheme } from '@mui/material';
import { tokens } from '../theme';

/**
 * The Header component displays a header with a title and an optional subtitle.
 *
 * Props:
 * - title (string): The main title text. This prop is required.
 * - subtitle (string): The subtitle text. This prop is optional.
 *
 * The component:
 * - Uses MUI's useTheme hook to access the current theme.
 * - Uses a custom tokens function to get color values based on the theme mode.
 */
const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: '0 0 5px 0' }}
      >
        {title}
      </Typography>
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

export default Header;
