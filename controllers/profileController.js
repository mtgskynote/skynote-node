import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import mongoose from "mongoose";

// Update user email and name when editing the profile
const updateProfileData = async (req, res) => {
    console.log("updateProfileData req.body", req.body);
    const { email, name, lastName, instrument } = req.body;

    if (!email || !name) {
        throw new BadRequestError("Please provide at least name and email");
    }

    try {
        const user = await User.findOne({ _id: req.user.userId });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        user.email = email;
        user.name = name;
        user.lastName = lastName;
        user.instrument = instrument;

        await user.save();

        const token = user.createJWT();

        res.status(StatusCodes.OK).json({
            success: true,
            user,
            token,
            location: user.location,
            message: "Document updated successfully",
        });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating user",
        });
    }
};

// Change user password
const changePassword = async (req, res) => {
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({ _id: req.user.userId });

        if (!user) {
            throw new NotFoundError("User not found");
        }

        // Update user's password
        user.password = newPassword; // Assign the new password
        await user.save(); // Save the user document

        res.status(StatusCodes.OK).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (err) {
        console.error("Error changing password:", err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error changing password",
        });
    }
};

const addFavourite = async (req, res) => {
    try {
        const { userId, songId } = req.params;
        const user = await User.findById(userId);

        console.log(`Adding favourite: userId=${userId}, songId=${songId}`);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFavourite = user.favourites.some((fav) =>
            fav.songId.equals(songId)
        );
        if (isFavourite) {
            return res.status(400).json({ message: "Song already in favourites" });
        }

        user.favourites.push({ songId: mongoose.Types.ObjectId(songId) });
        await user.save();

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.error('Error adding favourite:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

const removeFavourite = async (req, res) => {
    try {
        const { userId, songId } = req.params;
        const user = await User.findById(userId);

        console.log(`Removing favourite: userId=${userId}, songId=${songId}`);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.favourites = user.favourites.filter(
            (fav) => !fav.songId.equals(songId)
        );
        await user.save();

        res.status(StatusCodes.OK).json(user);
    } catch (error) {
        console.error('Error removing favourite:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export { changePassword, updateProfileData, addFavourite, removeFavourite };
