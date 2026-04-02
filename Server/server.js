import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";

const app = express();

const corsOption = {
  origin: "http://localhost:5173",
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));


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
import userRouter from "./src/routes/user.route.js";

/* routes declaration */
app.use("/api/v1/user", userRouter);