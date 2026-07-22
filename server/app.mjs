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
