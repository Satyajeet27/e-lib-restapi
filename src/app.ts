import express from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.get("/", (req, res, next) => {
  // const error = createHttpError(400, "something went wrong");
  // throw error;
  res.json({ message: "Welcome to api" });
});

//global handler
app.use(globalErrorHandler);
export default app;
