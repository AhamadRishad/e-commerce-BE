import express from "express";
import mongoose from "mongoose";
import {signup,  signin, } from "../controllers/userController.js";
import authenticateUser from "../middlewares/user-middleware.js";
import User from "../models/userModels.js";
import { getCardDetails, getCategoryOneProduct, getCategoryWiseProducts } from "../controllers/cartController.js";


const userRouter = express.Router();

// check user Authentication
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

//USER add to cart 
 userRouter.post('/add-to-cart',authenticateUser , async (req,res) => {
    try {
        console.log("hitted to addToCartController")

        const currentUser = req.user.data

        const findUser = await User.findOne({email:currentUser})
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        console.log("findUser",findUser);
        const { productId } = req?.body
        const productObjectId = new mongoose.Types.ObjectId(productId);

        const existingCartItem = findUser.cart.find(item => item.product.equals(productObjectId));

        
         if(existingCartItem){
            return res.status(400).json({
                        message:"Product already added to cart",
                        error:true,
                        success:false
                    })
         }

         findUser.cart.push({ product:productObjectId , quantity: 1 });
         const saveUser = await findUser.save();

        res.json({
            message:"Product added to cart",
            success:true,
            data:saveUser,
            error:false
        })

    } catch (err) {
        res.json({
            message: err?.message ||err,
            error:true,
            success:false 
        })
    }

 })


 userRouter.post('/add-quantity',authenticateUser ,async (req,res) => {
    try {
        console.log('hitted to add quantity ');
        
        const currentUser = req.user.data;

        const findUser = await User.findOne({email:currentUser})
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        const { productId ,operator } = req?.body;
        console.log("productId :" ,productId  )
        console.log("operator :" ,operator  )

        if (!productId) {
            return res.status(404).json({
                message: "product not found",
                error: true,
                success: false
            });
        }
        const productObjectId = new mongoose.Types.ObjectId(productId);
        const existingCartItem = findUser.cart.find(item => item.product.equals(productObjectId));

        if(operator === 'plus'){
            existingCartItem.quantity += 1;
        }else if(operator === 'minus'){
                if (existingCartItem.quantity > 0) {
                existingCartItem.quantity -= 1;
            }
        }

        const saveUser = await findUser.save();

        res.json({
            message: "Product increaced or decreased",
            success: true,
            data: saveUser,
            error: false
        });

    } catch (error) {
        res.json({
            message: error?.message ||error,
            error:true,
            success:false 
        })
    }
 })

 userRouter.get('/quantity-count',authenticateUser ,async (req,res) => {
    try {
        console.log('hitted to quantity count');
        const currentUser = req.user.data;
        console.log("currentUser  :",currentUser)
        const findUser = await User.findOne({ email: currentUser });
        console.log("findUser :", findUser)
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        // const totalProducts = findUser.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalProducts = findUser.cart.length


        res.json({
            message: "Product quantity updated",
            success: true,
            totalProducts: totalProducts, 
            error: false
        });

    } catch (error) {
        res.json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
 })

userRouter.get('/user-added-all-cart',authenticateUser , async (req,res) => {
    try {
        console.log("hitted to all-user-added-cart" );
        const currentUser = req.user.data;
        const findUser = await User.findOne({email:currentUser});

        console.log("findUser :", findUser)

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }
        const userAllCart = findUser.cart;
        res.json({
            message: "user all carts",
            success: true,
            userAllCart: userAllCart, 
            error: false
        });


    } catch (error) {
         res.json({
            message: error?.message || error,
            error: true,
            success: false
        });
    }
})



userRouter.get("/",(req,res) => {
    res.send("user route")
});


userRouter.post('/signup', signup );
userRouter.post('/signin', signin );
userRouter.get('/all-single-category',getCategoryOneProduct);
userRouter.post('/category-wise-products',getCategoryWiseProducts);
userRouter.post('/get-Card-details',getCardDetails)
// userRouter.post('/add-to-cart',addToCartController);

export default userRouter;