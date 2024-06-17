import express from 'express';
import dotenv from 'dotenv';
import crypto from 'crypto';
import Payment from '../models/paymentModel.js';
import razorpayInstance from '../config/payment.js';
import authenticateUser from '../middlewares/user-middleware.js';
import User from '../models/userModels.js';
import Cart from '../models/cartModel.js';


dotenv.config();

const paymentRouter = express.Router();

paymentRouter.post('/order' ,(req,res) => {
    console.log('hitted to order')
    const {amount} = req.body;
    console.log("amount : ",amount)

    try {
        const options = {
            amount :amount * 100,
            currency : 'INR',
            receipt : crypto.randomBytes(10).toString('hex'),
            // payment_capture : 1
        };

        razorpayInstance.orders.create(options, (error,order) => {
            if(error){
                console.log(error);
                return res.status(500).json({error:error.message});
            }
            res.status(200).json({data: order});
            console.log(order);
        });
    } catch (error) {
        res.status(500).json({message:"Internal server Error!!"});
        console.log(error);
    }
});


paymentRouter.post('/payment-verify',authenticateUser,async(req , res) => {
    console.log("hitted to /payment-verify");

    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body ;

    console.log('req.body payment : ', req.body);
    try {
    const currentUser = req.user.data;
    console.log("currentUser :",currentUser);

    const findUser = await User.findOne({email:currentUser})
    const userAllCart = findUser.cart;
    const userID = findUser._id;
    console.log("userID :",userID);
    console.log("userAllCart :",userAllCart)

      {/**adding admin id for each product after searching product id  */}
      const updatedCart = await Promise.all(userAllCart.map(async (item) => {
        const product = await Cart.findById(item.product);
        return {
            ...item,
            adminID: product.admin[0] 
        };
    }));



   
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
         .createHmac('sha256', process.env.RAZORPAY_SECRET ||'s')
         .update(sign.toString())
         .digest('hex');

         console.log(razorpay_signature === expectedSign);

         const isAuthentic = expectedSign === razorpay_signature;
         console.log("isAuthentic :", isAuthentic);

      
        

         if(isAuthentic){
             const payment = new Payment({
                 razorpay_order_id,
                 razorpay_payment_id,
                 razorpay_signature,
                 userAllCart:updatedCart,
                 userID,
             })

             await payment.save();

               // Clear userAllCart
            findUser.cart = [];
            await findUser.save();
       

         res.json({
             message: "Payment Successful",
             success: true,
             error: false,
         })
        }else{
            res.status(400).json({
                message: "Payment Failed",
                error: true,
                success: false,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        })
    }
})


export default paymentRouter;

