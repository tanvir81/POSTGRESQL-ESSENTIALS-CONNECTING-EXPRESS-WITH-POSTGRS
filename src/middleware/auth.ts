import type { NextFunction, Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  // console.log(roles); ["admin"]
  // 1-> Check if the token exists
  // 2-> Verify Token
  // 3-> Check if the user exists
  // 4-> Is the user status Active

  //console.log(req.headers.authorization);
  const token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
      //data: result,
    });
  }

  const decode = jwt.verify(token as string, config.jwt_secret) as JwtPayload;

  //console.log(decode);

  const user = await pool.query(
    `
    SELECT * FROM  users WHERE email=$1
    `,
    [decode.email],
  );
  //console.log(user.rows[0]);
  if (user.rowCount === 0) {
    res.status(404).json({
      success: false,
      message: "User Not Found",
      //data: result,
    });
  }
  if (!user.rows[0].is_active) {
    res.status(403).json({
      success: false,
      message: "Forbidden!!",
      //data: result,
    });
  }

  next();
};

export default auth;
