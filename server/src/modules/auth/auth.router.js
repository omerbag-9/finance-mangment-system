import { Router } from "express";
import {  changPassword, forgetPassword, login, signup, verifyAccount } from "./auth.controller.js";
import { isValid } from "../../middleware/validation.js";
import { loginSchema } from "./auth.validation.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

 const authRouter = Router()

// signup
authRouter.post('/signup', asyncHandler(signup))

// verify email
authRouter.get('/verify-account' , asyncHandler(verifyAccount))

// signin 
authRouter.post('/login', isValid(loginSchema),asyncHandler(login))

//  reset password
authRouter.post('/forget-password',
    asyncHandler(forgetPassword)
)

// change password
authRouter.put('/change-password',asyncHandler(changPassword))
export default authRouter