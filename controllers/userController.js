import bcrypt from "bcrypt"
import User from "../models/userModels.js";
import { generateToken } from "../utils/generateToken.js";




export const signup = async (req,res) => {
    try {
        console.log('hitted')
        console.log(req.body);

        const {email, password , name , mobile} = req.body
        console.log(email)

        const userExist = await User.findOne({email});

        if(userExist){
            return res.send('user is already exist');
        }

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password,saltRounds);

        const newUser = new User({
            email,
            name,
            mobile,
            hashPassword,
            role:"general"
        })
        const newUserCreated = await newUser.save();

        if(!newUserCreated){
            return res.status(400).send('user is not created');
        }
        // else{
        //     res.send('signed successfully')
        // }

        const token = generateToken(email);
        res.cookie('token',token,{
            httpOnly: true,
            secure: true, // Ensure to use secure in production
            sameSite: 'None', // Necessary for cross-domain cookies
        });
        res.status(201).json({
            message:"signup successfully",

            
        });
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).json({
            message:"signup failed",
            error: true,
            success: false   
        });
    }
};

export const signin = async (req,res) => {
    try {
        console.log('hitted sign in ');

        const {email , password} = req.body;
        const user = await User.findOne({email});

        console.log(user);

        if(!user){
            return res.status(400).json({
                message: "User not found",
                error: true,
                success: false,
                data: null
            });
        }

        const matchPassword = await bcrypt.compare(password,user.hashPassword);

        if(!matchPassword){
            return res.status(400).json({
                message:"Invalid Password",
                error: true,
                success: false,
                data: null
            });
        }
        // else{
        //     res.send('signed in successfully')
        // }

        const token = generateToken(email);
        res.cookie('token',token,{
            httpOnly: true,
            secure: true, // Ensure to use secure in production
            sameSite: 'None', // Necessary for cross-domain cookies
        });
        // res.status(201).send('Logged in');
        res.json({ message: "signup successfully", token });
            
    } catch (error) {
        console.log(error, "Something wrong");
      res.status(500).json({
        message:"signup failed",
        error: true,
        success: false,
        data: null
      });
    }
}

//LogOut its there to compleate 






export default {
    signup,
    signin,
    
}