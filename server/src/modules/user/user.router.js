import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../../middleware/authentication.js";
import { getUserProfile, getUsers } from "./user.controller.js";
import { isActive } from "../../middleware/isActive.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import {  userRoles } from "../../utils/constant/enums.js";

const userRouter = Router()

// get all users
userRouter.get('/',
    isAuthenticated(),
    isAuthorized(userRoles.MANAGER),
    asyncHandler(getUsers)
)

// //  update user
// userRouter.put('/',
//     isAuthenticated(),
//     isAuthorized(userRoles.MANAGER),
//     isValid(updateProfileSchema),
//     isActive(),
//     asyncHandler(updateUser)
// )

// //  delete user
// userRouter.delete('/',
//     isAuthenticated(),
//     isAuthorized(userRoles.MANAGER),
//     isActive(),
//     asyncHandler(deleteUser)
// )

// get user profile
userRouter.get('/profile/:id',
    isAuthenticated(),
    isActive(),
    isAuthorized([userRoles.MANAGER , userRoles.FINANCE_STAFF]),
    asyncHandler(getUserProfile)
)

export default userRouter