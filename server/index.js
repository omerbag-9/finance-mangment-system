import express from 'express';
import { connectDB } from './db/connection.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve('./config/.env') })

const app = express();

const port = process.env.PORT || 3000;
connectDB();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});