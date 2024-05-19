import express from "express";
import connectDb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express()

const port = process.env.PORT || 3001;

connectDb();
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })