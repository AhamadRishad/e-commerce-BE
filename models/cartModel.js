import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minLength:3,
        MaxLength:30,
        
    },
    description: {
        type:String,
        required:true,
        minLength:3,
        MaxLength:100,
    },
    price: {
        type:Number,
        required:true,

    },
    image: {
        type:String,
        required:true,
        
    },
   
    admin: [{ type: mongoose.Types.ObjectId, ref: "admin" }],

},
{ timestamps: true }
);

const Cart = mongoose.model("cart", cartSchema);

export default Cart;