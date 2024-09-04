import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useAppContext } from '../context/appContext';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

/**
 * The FavouriteButton component allows users to toggle a song as a favourite.
 *
 * Props:
 * - songId (string): The unique identifier for the song.
 * - initialIsFavourite (boolean): Initial state indicating if the song is a favourite.
 * - refreshData (function): Optional callback to refresh data after toggling.
 *
 * The component:
 * - Sends a POST or DELETE request to the server to update the favourite status.
 * - Optimistically updates the favourite state on success.
 * - Displays a tooltip and an icon button that toggles between favourite and non-favourite states.
 */
const FavouriteButton = ({ songId, initialIsFavourite, refreshData }) => {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const { getCurrentUser } = useAppContext();

  const handleToggleFavourite = async () => {
    try {
      const result = await getCurrentUser();
      const userId = result.id;
      if (isFavourite) {
        await axios.delete(`/api/v1/profile/favourite/${userId}/${songId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setIsFavourite(false); // Update state optimistically
      } else {
        await axios.post(
          `/api/v1/profile/favourite/${userId}/${songId}`,
          null,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setIsFavourite(true); // Update state optimistically
      }
      if (refreshData) refreshData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Tooltip
      placement="bottom"
      title={isFavourite ? 'Remove From Favourites' : 'Add To Favourites'}
      arrow
    >
      <IconButton
        aria-label={
          isFavourite ? 'Remove From Favourites' : 'Add To Favourites'
        }
        className={`text-rose-300 cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          handleToggleFavourite();
        }}
      >
        {isFavourite ? (
          <FavoriteIcon className="sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
        ) : (
          <FavoriteBorderIcon className="hover:text-rose-300 sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl" />
        )}
      </IconButton>
    </Tooltip>
  );
};

FavouriteButton.propTypes = {
  songId: PropTypes.string.isRequired,
  initialIsFavourite: PropTypes.bool.isRequired,
  refreshData: PropTypes.func,
};

export default FavouriteButton;
