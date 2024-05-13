import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRoute";

const app = express();

app.get("/", (req, res, next) => {
  // const error = createHttpError(400, "something went wrong");
  // throw error;
  res.json({ message: "Welcome to api" });
});
app.use(express.json());
app.use("/api/users", userRouter);

//global handler
app.use(globalErrorHandler);
export default app;
