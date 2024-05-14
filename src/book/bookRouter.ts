import { Router } from "express";
import { createBook } from "./bookController";
import multer from "multer";
import path from "path";

const bookRouter = Router();

const upload = multer({
  //path agar exist nahi krta h toh multer khud se folder create kr dega
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fieldSize: 3e7 }, //3e7 means 30mb: 30*1024*1024
});

// we are selecting field because we have multiple files, one is coverimage and other ook pdf
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

export default bookRouter;
