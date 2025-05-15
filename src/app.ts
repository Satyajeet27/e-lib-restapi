import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import userRouter from "./user/userRoute";
import bookRouter from "./book/bookRouter";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  // const error = createHttpError(400, "something went wrong");
  // throw error;
  res.json({ message: "Welcome to api" });
});

app.get("/test", (req, res) => {
  res.status(200).json({
    message: "created for testing git",
  });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

//global handler
app.use(globalErrorHandler);
export default app;
