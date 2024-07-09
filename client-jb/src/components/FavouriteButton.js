import React, { useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/appContext";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const FavouriteButton = ({ 
    songId, 
    singTitle,
    initialIsFavourite, 
    refreshData
}) => {
    const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
    const { getCurrentUser } = useAppContext();

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
            refreshData();
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
                aria-label={isFavourite ? "Remove From Favourites" : "Add To Favourites"}
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
