import { model, Schema } from 'mongoose';
import { userRoles } from '../../src/utils/constant/enums.js';

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true,
    lowercase: true 
  },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: Object.values(userRoles),
    required: true 
  },
  isActive: { type: Boolean, default: false },
  otp:Number,
  otpExpiry: Date,
  otpAttempts: { type: Number, default: 0 },
}, { timestamps: true });

export const User = model('User', userSchema);
