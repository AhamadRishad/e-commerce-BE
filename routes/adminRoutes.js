import express from "express"
import { login, signup } from "../controllers/adminController.js";
const adminRouter = express.Router();

adminRouter.post("/signup",signup)
adminRouter.post("/login",login)

export default adminRouter;