import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is required");
}
const refreshSecret = process.env.JWT_REFRESH_SECRET;

if (!refreshSecret) {
  throw new Error("JWT_REFRESH_SECRET is required");
}

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL as string,
  jwt_secret: jwtSecret as string,
  refresh_secret: refreshSecret as string,
};

export default config;
