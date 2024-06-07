import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "cart", required: true },
    quantity: { type: Number, default: 1 }
  });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
    },
    hashPassword: {
        type: String,
        required: true,
        minLength: 6,
    },
    name:{
        type: String,
        required: true,
        maxLength: 50,
    },
    mobile:{
        type:Number,
        required: true, 
        minLength: 10,
        maxLength: 10,
        unique: true,
    },
    //  cart: [{ type: mongoose.Types.ObjectId, ref: "cart" },
    //         { type: Number, default:0  } ],
    
    cart: [cartItemSchema]

},
{ timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;