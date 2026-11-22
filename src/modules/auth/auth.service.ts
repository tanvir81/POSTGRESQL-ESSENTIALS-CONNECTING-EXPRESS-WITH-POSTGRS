import bcrypt from "bcryptjs";
import { pool } from "../../db";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payLoad: {
  email: string;
  password: string;
}) => {
  // Check if the user exist -> Done
  // Check if the password match ->Done
  // Check the user status ->Done
  // If pass all then generate jwt token ->

  const { email, password } = payLoad;

  const user = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email],
  );
  // console.log(user.rows[0]);
  if (user.rowCount === 0) {
    throw new Error("Invalid credential!!");
  }

  const matchPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid credential!!");
  }
  if (!user.rows[0].is_active) {
    throw new Error("Access Denied!!");
  }

  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(jwtPayload, config.refresh_secret, {
    expiresIn: "10d",
  });
  return { accessToken, refreshToken, user: user.rows[0] };
};

const generateAccessToken = async (authorization: string) => {
  if (!authorization) {
    throw new Error("Unauthorized access!!");
  }
  const token = authorization.replace(/^Bearer\s+/i, "");

  //? 2-> Verify Token
  const decode = jwt.verify(
    token as string,
    config.refresh_secret,
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
    throw new Error("User Not Found");
  }
  //? 4-> Is the user status Active
  if (!user.rows[0].is_active) {
    throw new Error("Forbidden!!");
  }
  const jwtPayload = {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email,
    role: user.rows[0].role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_secret, {
    expiresIn: "1h",
  });
  return { accessToken };
};

export const authService = {
  loginUserIntoDB,
  generateAccessToken,
};
