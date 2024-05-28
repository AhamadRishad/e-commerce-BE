import express from "express"
import { removeAdmin } from "../controllers/managerController.js";
import { getAllAdmins } from "../controllers/managerController.js";

const managerRouter = express.Router();

managerRouter.delete("/delete-admin/:id",removeAdmin)
managerRouter.get("/get-admins",getAllAdmins)

export default managerRouter;