import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required().trim(),
    password: Joi.string().min(8).required(),
    role: Joi.string().valid('student', 'staff', 'doctor', 'admin').required(),
    permissionGroup: Joi.string().required()
  });
  
  export const loginSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().required()
  });
  