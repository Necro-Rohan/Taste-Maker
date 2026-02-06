import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';
import validateToken from './middlewares/validate.js';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/auth.route.js'
import recipeRoutes from './Routes/recipes.js'
import profileRoutes from './Routes/profile.js'

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3001;

await connectDB();

app.use(cookieParser());

const frontendURLs = [
        process.env.FRONTEND_URL,
        "http://localhost:5174",
      ].filter((value) => {
        return Boolean(value);
      });      

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || frontendURLs.includes(origin)) {
      return callback(null, true)
    }else {
      return callback(null, false);
    }
  },
  credentials: true,
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/recipes', validateToken, recipeRoutes);
app.use("/profile", validateToken, profileRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
