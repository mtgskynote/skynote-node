import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

// Update user email and name when editing the profile
const updateProfileData = async (req, res) => {
    console.log("req.body", req.body);
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

export { changePassword, updateProfileData };
