import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import validateToken from './middlewares/validate.js';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/auth.js'
import recipeRoutes from './Routes/recipes.js'
import profileRoutes from './Routes/profile.js'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

await connectDB();

app.use(cookieParser());

const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";        //let's make it development ready
app.use(cors({
  origin: frontendURL,
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/recipes', validateToken, recipeRoutes);
app.use("/profile", validateToken, profileRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
