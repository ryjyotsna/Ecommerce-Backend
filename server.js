import express from 'express';
const app = express();
import dotenv from 'dotenv';
import connectDB from './config/db.js';
dotenv.config({
  path:"./.env"
});

const PORT = process.env.PORT;
connectDB();

app.get('/health', (req, res) => {
  res.send('API is healthy');
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});