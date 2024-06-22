import express from "express"
import { removeAdmin } from "../controllers/managerController.js";
import { getAllAdmins } from "../controllers/managerController.js";
import authenticateUser from "../middlewares/user-middleware.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModels.js";
import Payment from "../models/paymentModel.js";
import Cart from "../models/cartModel.js";
import razorpayInstance from "../config/payment.js";

const managerRouter = express.Router();

managerRouter.delete("/delete-admin/:id",removeAdmin)
managerRouter.get("/get-admins",getAllAdmins)






managerRouter.get('/all-Admins', authenticateUser, async (req, res) => {
    try {
        console.log("hitted to add admins");
        
        const currentUser = req.user.data;
        const findUser = await User.findOne({ email: currentUser });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
                data: null
            });
        }

        const role = findUser.role;

        if (role !== 'manager') {
            return res.status(403).json({
                message: "You are not authorized to access this route",
                error: true,
                success: false,
                data: null
            });
        }

        const admins = await Admin.find();
        res.status(200).json({
            message: "manager found : here is all admin details",
            error: false,
            success: true,
            data: admins
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
});


managerRouter.get('/all-users',authenticateUser,async(req,res)=> {
    try {
        console.log("hitted to manager :: all users")

        const currentUser = req.user.data;
        const findUser = await User.findOne({ email: currentUser });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
                data: null
            });
        }

        const role = findUser.role;

        if (role !== 'manager') {
            return res.status(403).json({
                message: "You are not authorized to access this route",
                error: true,
                success: false,
                data: null
            });
        }

        const users = await User.find();
        res.status(200).json({
            message: "manager found : here is all admin details",
            error: false,
            success: true,
            data: users
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
})


managerRouter.get('/all-orders', authenticateUser, async (req, res) => {
    try {
        console.log('hitted all orders API')

        const currentUser = req.user.data;

        const findUser = await User.findOne({ email: currentUser });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
                data: null
            });
        }

        const role = findUser.role;

        if (role !== 'manager') {
            return res.status(403).json({
                message: "You are not authorized to access this route",
                error: true,
                success: false,
                data: null
            });
        }

        const allOrders = await Payment.find();
        const detailedOrders = await Promise.all(allOrders.map(async (order) => {
            const user = await User.findById(order.userID).select('email');
            const detailedCart = await Promise.all(order.userAllCart.map(async (cartItem) => {
                const product = await Cart.findById(cartItem.product);
                return {
                    ...cartItem.toObject(),
                    productDetails: product
                };
            }));
            const paymentDetails = await razorpayInstance.payments.fetch(order.razorpay_payment_id);

            return {
                ...order.toObject(),
                userEmail: user ? user.email : null,
                userAllCart: detailedCart,
                paymentDetails,
            };
        }));

        res.status(200).json({
            message: "Orders fetched successfully",
            error: false,
            success: true,
            data: detailedOrders
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
});


managerRouter.get('/verify-product',authenticateUser,async (req,res) =>{
    try {
        console.log('hitted to manager verify product');

        const currentUser = req.user.data;
        const findUser = await User.findOne({ email: currentUser });

        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false,
                data: null
            });
        }

        const role = findUser.role;

        if (role !== 'manager') {
            return res.status(403).json({
                message: "You are not authorized to access this route",
                error: true,
                success: false,
                data: null
            });
        }
        // const findAllProduct = await Cart.find();
        // console.log("findAllProduct STATUS::",findAllProduct.STATUS)
        // // const verify = findAllProduct.STATUS  


        const inactiveProducts = await Cart.find({ STATUS: "inactive" });

        if (inactiveProducts.length === 0) {
            return res.status(404).json({
              message: "No inactive products found",
              error: true,
              success: false,
              data: null
            });
          }
      

        res.status(200).json({
            message: "manager found : here is all admin details",
            error: false,
            success: true,
            data: inactiveProducts
        });


    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
})




managerRouter.post('/active-product', authenticateUser, async (req, res) => {
    try {
      console.log('hitted to active product');
  
      const currentUser = req.user.data;
      const findUser = await User.findOne({ email: currentUser });
  
      if (!findUser) {
        return res.status(404).json({
          message: "User not found",
          error: true,
          success: false,
          data: null
        });
      }
  
      const role = findUser.role;
  
      if (role !== 'manager') {
        return res.status(403).json({
          message: "You are not authorized to access this route",
          error: true,
          success: false,
          data: null
        });
      }
  
      const { productID, status } = req.body;
      console.log("productID::", productID, "status::", status);
  
      if (!productID || !status) {
        return res.status(400).json({
          message: "Product ID and status are required",
          error: true,
          success: false,
          data: null
        });
      }
  
      const findProduct = await Cart.findById(productID);
  
      if (!findProduct) {
        return res.status(404).json({
          message: "Product not found",
          error: true,
          success: false,
          data: null
        });
      }
  
      if (status === 'active') {
        if (findProduct.STATUS === 'active') {
          return res.status(400).json({
            message: "Product is already active",
            error: true,
            success: false,
            data: findProduct
          });
        }
        findProduct.STATUS = 'active';
        await findProduct.save();
        return res.status(200).json({
          message: "Product status updated to active",
          error: false,
          success: true,
          data: findProduct
        });
      } else if (status === 'inactive') {
        if (findProduct.STATUS === 'inactive') {
            console.log("Product is already inactive")
          return res.status(400).json({
            message: "Product is already inactive",
            error: true,
            success: false,
            data: findProduct
          });
        }
        findProduct.STATUS = 'inactive';
        await findProduct.save();
        console.log("Product status updated to inactive")
        return res.status(200).json({
          message: "Product status updated to inactive",
          error: false,
          success: true,
          data: findProduct
        });
      }
      //  else if (status === 'ignore') {
      //   await Cart.deleteOne({ _id: productID });
      //    console.log("Product has been deleted")
      //   return res.status(200).json({
      //     message: "Product has been ignored",
      //     error: false,
      //     success: true,
      //     data: null
      //   });
      // }
       else {
        return res.status(400).json({
          message: "Invalid status value",
          error: true,
          success: false,
          data: null
        });
      }
  
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        message: error.message || "Internal Server Error",
        error: true,
        success: false
      });
    }
  });
  





export default managerRouter;



