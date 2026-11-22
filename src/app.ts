import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

import fs from "fs";
import logger from "./middleware/logger";
import globalErrorHandeler from "./middleware/globalErrorhandeler";
import cors from "cors";
import cookieParser from "cookie-parser";

const corsOptions = {
  origin: [
    "http://localhost:3000",
    //"http://localhost:5000",
    //"http://localhost:8000",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// ? Express custom  Middlewere logger from logger.ts
app.use(logger);

app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req: Request, res: Response) => {
  // console.log(req);
  //res.send("This Is Root Route!!");
  res.status(200).json({
    success: true,
    message: "This is the route Route",
    author: "Tanvir",
  });
});

// ? Globel Error Hendeler
app.use(globalErrorHandeler);

export default app;
