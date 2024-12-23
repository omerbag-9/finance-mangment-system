import express from 'express';
import { connectDB } from './db/connection.js';
import dotenv from 'dotenv';
import path from 'path';
import { globalErrorHandling } from './src/utils/asyncHandler.js';
import authRouter from './src/modules/auth/auth.router.js';
import userRouter from './src/modules/user/user.router.js';
import bonusRouter from './src/modules/bonus/bonus.router.js';
import cors from 'cors';

dotenv.config({ path: path.resolve('./config/.env') })


const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/bonus', bonusRouter);

const port = process.env.PORT || 3000;
connectDB();

app.use(globalErrorHandling)
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});