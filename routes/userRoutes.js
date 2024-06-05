import express from "express";
import {signup,  signin } from "../controllers/userController.js";
import authenticateUser from "../middlewares/user-middleware.js";
import User from "../models/userModels.js";
import { getCardDetails, getCategoryOneProduct, getCategoryWiseProducts } from "../controllers/cartController.js";

const userRouter = express.Router();

userRouter.get("/check-user", authenticateUser, async (req, res) => {
    const user = req.user;

    console.log("data",user.data);
    const findUser = await User.findOne({email: user.data});
    console.log(findUser);
    if(!findUser){
        return res.json({message:"authentication failed", success:false})
    }

    res.json({message:"authenticated User", success:true})

});

userRouter.get("/",(req,res) => {
    res.send("user route")
});

userRouter.post('/signup', signup );
userRouter.post('/signin', signin );
userRouter.get('/all-single-category',getCategoryOneProduct);
userRouter.post('/category-wise-products',getCategoryWiseProducts);
userRouter.post('/get-Card-details',getCardDetails)

export default userRouter;