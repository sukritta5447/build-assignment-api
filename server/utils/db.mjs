import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default connectionPool;
