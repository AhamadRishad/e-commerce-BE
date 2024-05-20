import express from "express";
import userRouter from "./routes/userRoutes.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoutes.js";

dotenv.config();

const app = express()
app.use(express.json())
app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);

const port = process.env.PORT || 3001;

connectDb();
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })