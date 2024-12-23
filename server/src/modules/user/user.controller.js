
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
        // Get current month's start and end dates
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Create base query and populate bonuses
        const userQuery = User.find().populate({
            path: 'bonuses',
            match: {
                createdAt: {
                    $gte: startOfMonth,
                    $lte: endOfMonth
                }
            }
        });

        // Apply API features
        const apiFeatures = new ApiFeatures(userQuery, req.query)
            .filter()
            .sort()
            .select()
            .paginate();

        // Execute query
        const users = await apiFeatures.query;

        // Transform users to include bonus status
        const transformedUsers = users.map(user => ({
            ...user.toObject(),
            hasBonusThisMonth: user.bonuses && user.bonuses.length > 0,
            bonusAmount: user.bonuses && user.bonuses.length > 0 ? 
                user.bonuses[0].amount : null,
            bonusStatus: user.bonuses && user.bonuses.length > 0 ? 
                user.bonuses[0].status : null
        }));

        return res.status(200).json({
            success: true,
            count: transformedUsers.length,
            data: transformedUsers
        });
    } catch (error) {
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