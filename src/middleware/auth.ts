import type { NextFunction, Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import { pool } from "../db";
import type { Role } from "../types";

const auth = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //console.log(roles);
      // console.log(roles); ["admin"]
      // 1-> Check if the token exists
      // 2-> Verify Token
      // 3-> Check if the user exists
      // 4-> Is the user status Active

      //console.log(req.headers.authorization);

      //? 1-> Check if the token exists
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
          //data: result,
        });
      }
      const token = authorization.replace(/^Bearer\s+/i, "");

      //? 2-> Verify Token
      const decode = jwt.verify(
        token as string,
        config.jwt_secret,
      ) as JwtPayload;

      //console.log(decode);

      //? 3-> Check if the user exists
      const user = await pool.query(
        `
    SELECT * FROM  users WHERE email=$1
    `,
        [decode.email],
      );
      //console.log(user.rows[0]);
      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
          //data: result,
        });
        return;
      }
      //? 4-> Is the user status Active
      if (!user.rows[0].is_active) {
        return res.status(403).json({
          success: false,
          message: "Forbidden!!",
          //data: result,
        });
        return;
      }
      //roles = ["admin", "agent","user"]
      //user.role = "admin"
      if (roles.length && !roles.includes(user.rows[0].role)) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized access",
        });
      }
      req.user = decode;
      // console.log(req);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
