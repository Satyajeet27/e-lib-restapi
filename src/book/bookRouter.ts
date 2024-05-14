import { Router } from "express";
import { createBook } from "./bookController";

const bookRouter = Router();

bookRouter.post("/", createBook);

export default bookRouter;
