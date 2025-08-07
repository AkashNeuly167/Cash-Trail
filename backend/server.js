import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); 
app.use(cookieParser());

// Connect to DB
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/income',incomeRoutes);
app.use('/api/v1/expense',expenseRoutes);
app.use('/api/v1/dashboard',dashboardRoutes);


//server upload folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
