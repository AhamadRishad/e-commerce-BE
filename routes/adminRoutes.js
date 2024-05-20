import express from "express"
import { getAllAdmins, login, removeAdmin, signup } from "../controllers/adminController.js";
import { addCart, getCart } from "../controllers/cartController.js";
import upload from "../middlewares/upload-middleware.js";
const adminRouter = express.Router();

adminRouter.post("/signup",signup)
adminRouter.post("/login",login)

adminRouter.get("/get-cart" ,getCart)
adminRouter.get("/get-admins",getAllAdmins)
adminRouter.delete("/delete-admin/:id",removeAdmin)

adminRouter.post("/add-cart",upload.single("image"),addCart)

export default adminRouter;