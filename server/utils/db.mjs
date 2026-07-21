// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:NtUhxh8bL6S!HuT@localhost:5432/build_api_assignment",
});

export default connectionPool;
