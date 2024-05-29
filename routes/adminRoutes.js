import express from "express"
import jwt from "jsonwebtoken";
import {   login, removeProduct, signup, updateProduct } from "../controllers/adminController.js";
import { addCart, getCart } from "../controllers/cartController.js";
import upload from "../middlewares/upload-middleware.js";
import categories from "../helpers/categories.js";
import authenticateAdmin from "../middlewares/admin-middleware.js"
import Admin from "../models/adminModel.js";
import Cart from "../models/cartModel.js";

const adminRouter = express.Router();

adminRouter.post("/signup",signup)
adminRouter.post("/login",login)
// adminRouter.post('admin-products',getAdminProducts)

adminRouter.get("/get-cart" ,getCart)

adminRouter.get("/categories",(req, res) =>{
    try {
        res.status(200).send(categories);
    } catch (error) {
        res.status(400).send("can't found categories ")
    }
   
});

adminRouter.delete("/delete-admin/:id",removeProduct)

adminRouter.post("/add-cart",upload.single("image"),addCart)

adminRouter.put("/update-product/:id", updateProduct);

  adminRouter.post('/adminProduct',authenticateAdmin ,async (req,res) => {
    try {
        console.log("hitted to admin products")
        const admin = req.admin;
    //   admin has req.admin {
    //     data: '665449a4fbd709621afebc41',
    //     role: 'admin',
    //     iat: 1716853048,
    //     exp: 1716939448
    //   }
    //   data is his id
        console.log("data : ",admin.data);
      
        if (admin.role !== "admin" ) {
                 return res.status(403).send("Not authenticated");
               }
       
               const findAdmin = await Admin.findById(admin.data);
               const cartIds = findAdmin.cart;
                // res.json(findAdminById.cart)
                //! HERE ADD IF CONDITION
                const products = await Cart.find({ _id: { $in: cartIds } });
                res.json(products)
                
           
               
    } catch (error) {
        console.error('Error fetching admin products:', error);
        res.status(500).send('Internal Server Error');
    }
  
    


})


  adminRouter.get("/check-admin", authenticateAdmin, async (req, res) => {
    const admin = req.admin;

    console.log("data",admin.data);

   
    
    
    const findAdmin = await Admin.findById(admin.data);
    console.log("findAdmin",findAdmin);
    if(!findAdmin){
        return res.json({message:"authentication failed", success:false})
    }
  

    console.log("Admin role:", admin.role);
  
    if (admin.role !== "admin" && admin.role !== "manager" ) {
        console.error("Role not authorized:", admin.role);
     
        return res.status(403).send("Not authenticated");
    }

      res.json({message:"authenticated User", success:true})
   
 

});


adminRouter.get("/",(req,res)=>{
    res.send("admin route");
});
adminRouter.post("/",(req,res) => {
 res.send("admin post route")
});

export default adminRouter;