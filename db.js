import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.PGUSER,         // например: postgres
  host: process.env.PGHOST,         // localhost
  database: process.env.PGDATABASE, // my_auth_db
  password: process.env.PGPASSWORD, // твой пароль
  port: Number(process.env.PGPORT), // 5432
  ssl: false, // ❌ отключаем SSL (важно!)
});

export default pool;
