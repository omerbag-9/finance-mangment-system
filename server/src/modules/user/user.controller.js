
// import cloudinary from "../../utils/cloudinary.js"
import { AppError } from "../../utils/appError.js"
import { comparePassword, hashPassword } from "../../utils/hash-and-compare.js"
import { generateToken } from "../../utils/token.js"
import { messages } from "../../utils/constant/messages.js"
import { sendEmail } from "../../utils/email.js"
import { User } from "../../../db/models/user.model.js"

export const getUsers = async (req, res, next) => {
    const users = await User.find()
    return res.status(200).json({ success: true, data: users })
}

export const getUserProfile = async (req, res, next) => {
    const userId = req.authUser._id
    const user = await User.findById(userId)
    if (!user) {
        return next(new AppError(messages.USER.NOT_FOUND, 404))
    }
    user.password = undefined
    return res.status(200).json({ success: true, data: user })
}