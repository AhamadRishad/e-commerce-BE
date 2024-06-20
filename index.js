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
//     origin: 
//     // "http://localhost:5173",
//     "https://e-commerce-f6fmwi9yt-ahamad-rishads-projects.vercel.app/",
//     credentials: true,
//   })
// );

// const allowedOrigins = [
//   "http://localhost:5173", // Your localhost URL
//   // "https://e-commerce-fe-green.vercel.app" // Your deployed frontend URL
//   "https://e-commerce-f6fmwi9yt-ahamad-rishads-projects.vercel.app/"
// ];

// app.use(
//   cors({
//     origin: function(origin, callback) {
//       // Check if the origin is in the allowed origins list
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true
//   })
// );


// const corsOptions = {
//   origin: 'https://e-commerce-fe-green.vercel.app', // Your Vercel frontend URL
//   credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
//   optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };

// app.use(cors(corsOptions));

const allowedOrigins = [
  'http://localhost:5173', // Local development URL
  'https://e-commerce-fe-green.vercel.app' // Your Vercel hosted frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowed origins array
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));




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