import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/user.routes.js";
import interviewRouter from "./routes/interview.routes.js";

dotenv.config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
connectDB();

// routes
app.use("/api/v1", userRouter);
app.use("/api/v1/interview", interviewRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
