import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength:4,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength:4,
    },
    role: {
        type: String,
        enum: ["admin" , "manager"],
    },
    hashPassword: {
        type: String,
        required: true,
        minLength: 6,
    },
    mobile: {
        type:Number,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 10,
    },
    cart: [{ type: mongoose.Types.ObjectId, ref: "cart" }],

},
{ timestamps: true}
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;