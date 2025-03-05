import express, { Request, Response } from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import myUserRoutes from './routes/myUserRoutes';
import cookieParser from 'cookie-parser';
import { v2 as cloudinary } from 'cloudinary';

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log('Connected to DB'));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.get('/health', async (req: Request, res: Response) => {
  res.send({ message: 'health OK!' });
});

const port = process.env.PORT || 3000;

app.use('/api/user', myUserRoutes);

app.listen(port, () => {
  console.log('Server running at PORT: ', port);
});
