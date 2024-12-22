import { User } from "../../db/models/user.model.js"
import { AppError } from "../utils/appError.js"
import { messages } from "../utils/constant/messages.js"

export const isActive = () => {
    return async (req, res, next) => {
        const userId = req.authUser._id
        const user = await User.findById(userId)
        if (!user) {
            return next(new AppError(messages.USER_NOT_FOUND, 404))
        }
        if (user.isActive === false) {
            return next(new AppError(messages.USER_NOT_ACTIVE, 400))
        }
        next()
    }
}
