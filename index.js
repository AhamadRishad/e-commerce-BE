import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";
import adminRouter from "./routes/adminRoutes.js";
import managerRouter from "./routes/managerRouter.js";
import paymentRouter from "./routes/payment.js";



dotenv.config();

const app = express()
app.use(express.json())
app.use(cookieParser());

// app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:5173", // Your localhost URL
  "https://e-commerce-fe-green.vercel.app" // Your deployed frontend URL
];

app.use(
  cors({
    origin: function(origin, callback) {
      // Check if the origin is in the allowed origins list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);


app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);
app.use('/api/v1/manager',managerRouter);
app.use("/api/v1/payment", paymentRouter);

const port = process.env.PORT || 3001;

connectDb();
app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })