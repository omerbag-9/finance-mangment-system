import Joi from "joi";

export const updateProfileSchema = Joi.object({
    name: Joi.string().trim(),
    email: Joi.string().email().trim(),
    currentPassword: Joi.string().min(8),
    newPassword: Joi.string().min(8)
  });
  