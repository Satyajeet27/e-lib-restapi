import { NextFunction, Request, Response } from "express";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({ message: "user created" });
  } catch (error) {}
};

export { createUser };
