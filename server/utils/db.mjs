// Create PostgreSQL connection pool here
import pg from "pg";

const { Pool } = pg;

const connectionPool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://postgres:.Whitememo95@localhost:5432/API-assignment",
});

export default connectionPool;
