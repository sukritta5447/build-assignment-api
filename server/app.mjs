import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.post("/assignments", async (req, res) => {
  const {title, content, category} = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ "message": "Server could not create assignment because there are missing data from client" });
  }

    try {
      const query = "INSERT INTO assignments (title, content, category) VALUES ($1, $2, $3) RETURNING *";
      await connectionPool.query(query, [title, content, category]);
      return res.status(201).json({ "message": "Created assignment sucessfully" });
    } catch (error) {
      return res.status(500).json({
      message:
        "Server could not create assignment because database connection",
    });
    }
});

// User สามารถดูข้อมูลแบบทดสอบทั้งหมดในระบบได้
app.get("/assignments", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT assignment_id AS id, title, content, category FROM assignments");
    return res.status(200).json({ data: result.rows });
  } catch (e) {
    return res.status(500).json({ 
      "message": "Server could not read assignment because database connection" 
    });
  }
});

// User สามารถดูข้อมูลแบบทดสอบอันเดียวได้
app.get("/assignments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query("SELECT assignment_id AS id, title, content, category FROM assignments WHERE assignment_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ "message": "Server could not find a requested assignment" });
    }
    return res.status(200).json({ data: result.rows[0] });
  } catch (e) {
    return res.status(500).json({ 
      "message": "Server could not read assignment because database connection" 
    });
  }
});

// User สามารถแก้ไขแบบทดสอบที่ได้เคยสร้างไว้ก่อนหน้านี้
app.put("/assignments/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, category } = req.body;

  if (!title || !content || !category) {
    return res.status(400).json({ "message": "Server could not find a requested assignment to update" });
  }

  try {
    const result = await connectionPool.query("UPDATE assignments SET title = $1, content = $2, category = $3 WHERE assignment_id = $4 RETURNING *", [title, content, category, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ "message": "Server could not find a requested assignment to update" });
    }
    return res.status(200).json({ "message": "Updated assignment successfully" });
  } catch (e) {
    return res.status(500).json({ "message": "Server could not update assignment because database connection" });
  }
});

// User สามารถลบแบบทดสอบที่ได้เคยสร้างไว้ก่อนหน้านี้
app.delete("/assignments/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await connectionPool.query("DELETE FROM assignments WHERE assignment_id = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ "message": "Server could not find a requested assignment to delete" });
    }
    return res.status(200).json({ "message": "Deleted assignment successfully" });
  } catch (e) {
    return res.status(500).json({ "message": "Server could not delete assignment because database connection" });
  }
});

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
