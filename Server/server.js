import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./src/config/db.js";
import http from "http";
import { initSocket } from "./src/socket.js";



const app = express();
const server = http.createServer(app);
initSocket(server);

const corsOption = {
  origin: process.env.CORS_ORIGIN,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));


connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  })


/* importing routes  */
import userRouter from "./src/routes/user.routes.js";
import boardRouter from "./src/routes/board.routes.js"
import columnRouter from "./src/routes/column.routes.js"
import cardRouter from "./src/routes/card.routes.js"
import commentRouter from "./src/routes/comment.routes.js"
import activityRouter from "./src/routes/activity.routes.js"

/* routes declaration */
app.use("/api/v1/user", userRouter);
app.use("/api/v1/board", boardRouter);
app.use("/api/v1/column", columnRouter);
app.use("/api/v1/activity", activityRouter);
app.use("/api/v1/card", cardRouter);
app.use("/api/v1/comment", commentRouter);

