import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'

const app = express();

const corsOption = {
  origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));
app.use(mongoSanitize());
app.use(xss());


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  })


/* importing routes  */
import userRouter from "./src/routes/user.routes.js";
import boardRouter from "./src/routes/board.routes.js"

/* routes declaration */
app.use("/api/v1/user", userRouter);
app.use("/api/v1/board", boardRouter);