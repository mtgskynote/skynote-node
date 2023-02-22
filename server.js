import express from "express";
import dotenv from "dotenv";

dotenv.config();
import "express-async-errors"; // this is a package that allows us to use async await in express
import morgan from "morgan"; // this is a package that allows us to log the requests in the console

// db and authenticate user
import connectDB from "./db/connect.js";

//routers
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobRoutes.js";

// middleware
import notFoundMiddleWare from "./middleware-jb/not-found.js";
import errorHandlerMiddleWare from "./middleware-jb/error-handler.js"; // best practice to import it at the last

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // morgan is a middleware that allows us to log the requests in the console
}

// since authrouter contains routes that are post methods
// as json we can use a built-in method from express we can invoke it
// to make json values available in the code.

// app.use is a method that allows us to use middleware
app.use(express.json());

console.log("hello world");
// app.get is a method that allows us to create a route.

app.get("/api/v1", (req, res) => {
  res.send({ msg: "API" });
});
// app.use is a method that allows us to use middleware
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", jobsRoutes);

app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleWare);

const port = process.env.PORT || 3000;
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
