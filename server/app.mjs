import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/assignments", async (req, res) => {
  try {
    const query = "SELECT * FROM assignments";
    const result = await connectionPool.query(query);

    return res.status(200).json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not get assignments because database connection",
    });
  }
});

app.get("/assignments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM assignments WHERE assignment_id = $1";
    const result = await connectionPool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment",
      });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not get assignment because database connection",
    });
  }
});

app.put("/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      message: "Server could not update assignment because there are missing data from client",
    });
  }

  try {
    const query = `UPDATE assignments
                   SET title = $1, content = $2, category = $3
                   WHERE assignment_id = $4
                   RETURNING *`;
    const result = await connectionPool.query(query, [
      title,
      content,
      category,
      assignmentId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to update",
      });
    }

    return res.status(200).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not update assignment because database connection",
    });
  }
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const query = `DELETE FROM assignments
                   WHERE assignment_id = $1
                   RETURNING *`;
    const result = await connectionPool.query(query, [assignmentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested assignment to delete",
      });
    }

    return res.status(200).json({
      message: "Deleted assignment successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not delete assignment because database connection",
    });
  }
});

app.post("/assignments", async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({
      message: "Server could not create assignment because there are missing data from client",
    });
  }

  try {
    const query = `INSERT INTO assignments (title, content, category)
                   VALUES ($1, $2, $3) RETURNING *`;
    await connectionPool.query(query, [title, content, category]);

    return res.status(201).json({ message: "Created assignment sucessfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Server could not create assignment because database connection",
    });
  }
});

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
