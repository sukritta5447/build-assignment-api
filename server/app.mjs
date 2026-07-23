import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/db-test", async(req,res)=> {
  const result = await connectionPool.query('select * from users')
  return res.json({data: result.rows})
})

app.get("/assignments" ,async (req,res)=>{
  try{
    const result = await connectionPool.query(`select * from assignments`)
    return res.status(200).json({data: result.rows})

  } catch(error) {
    return res.status(500).json({ "message": "Server could not read assignment because database connection" })
  }
})

app.get("/assignments/:id", async(req,res) => {
    try {
      const id = req.params.id
      const result = await connectionPool.query(`select * from assignments where assignment_id = $1`,[id])
      if(result.rows.length === 0) {
        return res.status(404).json({ "message": "Server could not find a requested assignment" })
      }
      return res.status(200).json({data: result.rows})
    } catch {
      return res.status(500).json({ "message": "Server could not read assignment because database connection" })
    }
})

app.put("/assignments/:id", async(req,res) => {
  try {
    const id = req.params.id
    const {title,content,category} = req.body
    if(!content || !title || !category) {
      return res.status(400).json({ 
        message: "Title, content, and category are required"})
      }
    
    const result = await connectionPool.query(`update assignments set title = $1 ,content = $2 ,category = $3 where assignment_id = $4`, [title,content,category,id])
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        message: "Server could not find requested assignment to update" 
      });
    }
    return res.status(200).json({ "message": "Updated assignment successfully" })
  } catch {
    return res.status(500).json({ "message": "Server could not update assignment because database connection" })
  }
})

app.delete("/assignments/:id", async(req,res)=>{
  try{
    const id = req.params.id
    const result = await connectionPool.query(`delete from assignments where assignment_id = $1`,[id])
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        message: "Server could not find requested assignment to update" 
      }); }
    return res.status(200).json({ "message": "Deleted assignment successfully" })
  } catch {
    return res.status(500).json({ "message": "Server could not delete assignment because database connection" })
  }
})

app.post("/assignments", async(req,res) => {
    try {
      const {title, content, category} = req.body

      if(!title || !content || !category) {
        return res.status(400).json({ "message": "Server could not create assignment because there are missing data from client" })
      }
      const result = await connectionPool.query(
        `insert into assignments(title,content,category) values($1,$2,$3)`
      ,[title, content, category])
      return res.status(201).json({ "message": "Created assignment successfully" })

    } catch (error) {
      return res.status(500).json({ "message": "Server could not create assignment because database connection" })
    }
})

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
