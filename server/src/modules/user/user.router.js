import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../../middleware/authentication.js";
import { deleteUser, resetPassword, updateUser, logout, getUserProfile } from "./user.controller.js";
import { isActive } from "../../middleware/isActive.js";
import { updateProfileSchema } from "./user.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {  userRoles } from "../../utils/constant/enums.js";
import { isValid } from "../../middleware/validation.js";

const userRouter = Router()

//  update user
userRouter.put('/',
    isAuthenticated(),
    isAuthorized(userRoles.CUSTOMER),
    isValid(updateProfileSchema),
    isActive(),
    asyncHandler(updateUser)
)

//  delete user
userRouter.delete('/',
    isAuthenticated(),
    isAuthorized(userRoles.CUSTOMER),
    isActive(),
    asyncHandler(deleteUser)
)

// get user profile
userRouter.get('/profile',
    isAuthenticated(),
    isActive(),
    asyncHandler(getUserProfile)
)

// logout
userRouter.get('/logout',
    isAuthenticated(),
    isActive(),
    asyncHandler(logout)
)

// reset password
userRouter.put('/reset-password',
    isAuthenticated(),
    isActive(),
    asyncHandler(resetPassword)
)

export default userRouter