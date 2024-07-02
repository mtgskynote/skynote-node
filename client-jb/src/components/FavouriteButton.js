import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const FavouriteButton = ({ songId }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true); // Track initial load state
    const { getCurrentUser } = useAppContext();

    useEffect(() => {
        fetchDataFromAPI(); // Fetch initial favourite status on component mount
    }, []);

    const fetchDataFromAPI = async () => {
        try {
            const result = await getCurrentUser();
            const response = await axios.get("/api/v1/auth/getProfileData", {
                params: {
                    userId: result.id,
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (response.status === 200) {
                const isFav = response.data.user.favourites.some(
                    (fav) => fav.songId === songId
                );
                setIsFavourite(isFav); // Update initial favourite status
                setInitialLoad(false); // Mark initial load as complete
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleToggleFavourite = async () => {
        try {
            const result = await getCurrentUser();
            const userId = result.id;
            if (isFavourite) {
                await axios.delete(`/api/v1/profile/favourite/${userId}/${songId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setIsFavourite(false); // Update state optimistically
            } else {
                await axios.post(`/api/v1/profile/favourite/${userId}/${songId}`, null, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setIsFavourite(true); // Update state optimistically
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Tooltip
            placement="bottom"
            title={isFavourite ? "Remove From Favourites" : "Add To Favourites"}
            arrow
        >
            <IconButton
                aria-label={isFavourite  | !initialLoad ? "Remove From Favourites" : "Add To Favourites"}
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

export default FavouriteButton;
