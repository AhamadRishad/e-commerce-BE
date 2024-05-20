import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { generateAdminToken } from "../utils/generateToken.js";

export const signup = async (req, res) => {

    try {
        console.log('hitted admin signup')
        console.log(req.body);

        const {email , password , name , mobile} = req.body;
        const adminExist = await Admin.findOne({email});

        if(adminExist) {
            return res.send("this Admin is already exist")
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        console.log(`salt: ${salt}`);
        console.log(`hashPassword : ${hashPassword}`);

        const newAdmin = new Admin({
            name,
            email,
            hashPassword,
            mobile,
            role:"admin",
        })
        const savedAdmin = await newAdmin.save();

        if(!savedAdmin) {
            return res.send("Admin is not created something went wrong")
        }

        const token = generateAdminToken(savedAdmin);
        res.cookie("token",token);
        res.json({
            message:"signed in ! " , token
        });
            


    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
}

export const login = async (req,res) => {
    try {
        console.log('admin login hitted');
        const body = req.body;
        const {email , password} = body;
        console.log(body);

        const admin = await Admin.findOne({email});
        if(!admin) {
            return res.status(404).send("Admin not found");
        }
        const isMatchPass = await bcrypt.compare(password, admin.hashPassword);
        
        if(!isMatchPass) {
            return res.status(400).send("Invalid Password");
        }

        const token = generateAdminToken(admin);
        
        res.cookie("token",token);
        res.json({
            message:"Logged in !",
            token
        });       
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
}

//get-all-admins

export const getAllAdmins = async (req,res) => {
    try {
        console.log('hitted get all admins');
        const admins = await Admin.find();
        res.status(200).send(admins);
        
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("admin doesn't exist ");
    }
}

export const removeAdmin = async (req, res) => {
    try {
        // its not complete the only manager can delete admin
        const id = req.params.id;
        console.log(id);

        const admin = await Admin.find({ _id: id });
        if(!admin){
            return res.status(404).send("Admin not found");
        }

        const remove = await Admin.deleteOne({ _id: id })

        if(!remove) {
            return res.status(404).send("failed to remove");
        }

        return res.send('removed successfully')
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("could't remove admin ");
    }
}

export default {
    signup,
    login,
    getAllAdmins,
    removeAdmin,
}