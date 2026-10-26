import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/route.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
