
// import cloudinary from "../../utils/cloudinary.js"
import { AppError } from "../../utils/appError.js"
import { comparePassword, hashPassword } from "../../utils/hash-and-compare.js"
import { generateToken } from "../../utils/token.js"
import { messages } from "../../utils/constant/messages.js"
import { sendEmail } from "../../utils/email.js"
import { User } from "../../../db/models/user.model.js"
import { ApiFeatures } from "../../utils/ApiFeature.js"

export const getUsers = async (req, res, next) => {
    try {
        // Create a base query for fetching users
        const userQuery = User.find();

        // Apply API features using the ApiFeatures class
        const apiFeatures = new ApiFeatures(userQuery, req.query)
            .filter()
            .sort()
            .select()
            .paginate();

        // Execute the query with applied features
        const users = await apiFeatures.query;

        // Return the users as a response
        return res.status(200).json({ 
            success: true, 
            count: users.length, 
            data: users 
        });
    } catch (error) {
        // Pass any errors to the error handling middleware
        return next(new AppError(error.message, 400));
    }
};

export const getUserProfile = async (req, res, next) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    if (!user) {
        return next(new AppError(messages.USER.NOT_FOUND, 404))
    }
    user.password = undefined
    return res.status(200).json({ success: true, data: user })
}