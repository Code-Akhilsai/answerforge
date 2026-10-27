import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
connectDB();

//routes

app.use("/api/v1", userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
