import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        minLength:1,
        MaxLength:30,
        
    },
    brandName: {
        type:String,
        required:true,
        MaxLength:30,
    },
    price: {
        type:Number,
        required:true,

    },
    sellingPrice:{
        type:Number,
        required:true,
    },

    image: {
        type:String,
        required:true,
        
    },
    STATUS:{
        type:String,
        required:true,
        enum:["active","inactive"],
        default:"inactive",
    },
   category: {
    type:String,
    minLength:1,
    maxLength:20,
   
   },
   description:{
    type:String,
    minLength:1,
    maxLength:1000,
   },
    admin: [{ type: mongoose.Types.ObjectId, ref: "admin" }],

},
{ timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);

export default Cart;