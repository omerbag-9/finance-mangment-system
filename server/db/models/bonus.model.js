import mongoose, { model, Schema } from 'mongoose';
import { bonusStatus } from '../../src/utils/constant/enums.js';

const bonusSchema = new Schema({
  title: { type: String, required: true, trim: true },
  amount: { type: Number, required: true, min: 0 },
  recipient: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(bonusStatus),
    default: 'PENDING' 
  },
  reason: { type: String, required: true },
  attachments: [{
    fileName: String,
    fileUrl: String
  }],
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  rejectedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvalDate: Date,
  rejcetionDate: Date,
  comments: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    month: String,
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Bonus = model('Bonus', bonusSchema);
