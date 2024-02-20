import express from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';

dotenv.config();
import "express-async-errors"; // this is a package that allows us to use async await in express
import morgan from "morgan"; // this is a package that allows us to log the requests in the console

// db and authenticate user
import connectDB from "./db/connect.js";

//routers
import authRouter from "./routes/authRoutes.js";
import scoreRouter from "./routes/scoreRoutes.js";
import recordingRouter from "./routes/recordingRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// middleware
import notFoundMiddleWare from "./middleware-jb/not-found.js";
import errorHandlerMiddleWare from "./middleware-jb/error-handler.js"; // best practice to import it at the last
import authenticateUser from "./middleware-jb/authenticateUser.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const app = express();

app.use(express.json({ limit: '16mb' })); // For JSON payloads
app.use(express.urlencoded({ limit: '16mb', extended: true })); // For URL-encoded data

// Middleware to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Middleware to parse application/json
app.use(bodyParser.json());


if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // morgan is a middleware that allows us to log the requests in the console
}

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.

// app.use is a method that allows us to use middleware
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./client-jb/build")));
//app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send({ msg: "API" });
});

// app.use is a method that allows us to use middleware
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/scores", scoreRouter);
app.use("/api/v1/recordings", recordingRouter);
app.use("/api/v1/messages", messageRouter);

// only when ready to deploy
app.get("*", function (request, response) {
  response.sendFile(path.resolve(__dirname, "./client-jb/build", "index.html"));
});

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 5000;
//const port = process.env.PORT;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log("error in start", error);
  }
};

start();
