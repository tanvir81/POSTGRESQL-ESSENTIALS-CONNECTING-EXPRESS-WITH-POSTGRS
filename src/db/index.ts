import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_string,
});

// ?-------------VARCHAR Usecase---------
//? 1. Common uses of VARCHAR
//? Column	Example	SQL data type
//? name	Tanvir Khan	VARCHAR(100)
//? email	tanvir@gmail.com	VARCHAR(255)
//? password	Hashed password	VARCHAR(255)
//? phone	01712345678	VARCHAR(15)
//? city	Dhaka	VARCHAR(100)
//? country	Bangladesh	VARCHAR(100)
//? username	tanvir123	VARCHAR(50)

//console.log(pool);
export const initDB = async () => {
  try {
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS users(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      age INT,
      is_Active BOOLEAN DEFAULT true,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()

      );
      `,
    );
    // ? For Profile
    await pool.query(`
  CREATE TABLE IF NOT EXISTS profile(
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  bio TEXT,
  address TEXT,
  phone VARCHAR(15),
  gender VARCHAR(15),

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
  )
  `);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
