import type { NextFunction, Request, Response } from "express";

const auth = (req: Request, res: Response, next: NextFunction) => {
  // 1-> Check if the token exist

  //console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
      //data: result,
    });
  }
  next();
};

export default auth;
