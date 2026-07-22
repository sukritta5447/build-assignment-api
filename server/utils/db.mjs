// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://LingLingS:88888888@localhost:5432/LMS-assignment",
});

export default connectionPool;
