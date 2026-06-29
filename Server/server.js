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
  credentials: true
};

app.use(express.json());    //it deserializes the incoming req bodies that are fomatted as JSON into JS obj. 
app.use(cookieParser());    //parses incoming cookie header string and convert it into JS obj attaching it to req.cookies.
app.use(cors(corsOption));  

/* CORS
WHAT is it?
By default browser has SAME ORIGIN POLICY(SOP) which prevents a website from reading API responses from a different domain.
CORS stands for CROSS ORIGIN RESOURCE SHARING it a mechanism that allows us to safely bypass this restriction.
By setting specific CORS HTTP headers on our server response, we can explicitly tell the browser that out frontend app is 
allowed to read and access the server's resources, even though they are on different origin.

CORS security feature enforced by browser, not server
The above middleware configures CORS, adds necessary http headers to our server response
like allow-access-control-origin to tell browser that req from specific frontend URL are allowed.
If another website tries to call this API, the middleware won't provide the allowed hearder,
hence the user browser will block that website from reading the response.
*/

connectDB()
  .then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed!", err);
  })


  app.get('/', (req, res) => {
  res.send('Hello World')
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

// errors handling

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong."

  return res.status(statusCode)
  .json({
    success: false,
    statusCode,
    message
  })
})

