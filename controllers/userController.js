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
            hashPassword
        })
        const newUserCreated = await newUser.save();

        if(!newUserCreated){
            return res.status(400).send('user is not created');
        }
        // else{
        //     res.send('signed successfully')
        // }

        const token = generateToken(email);
        res.cookie('token',token);
        res.status(201).send('signed successfully');
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
};

export const signin = async (req,res) => {
    try {
        console.log('hitted sign in ');

        const {email , password} = req.body;
        const user = await User.findOne({email});

        console.log(user);

        if(!user){
            return res.status(400).send('user is not exist');
        }

        const matchPassword = await bcrypt.compare(password,user.hashPassword);

        if(!matchPassword){
            return res.status(400).send('password is not match');
        }
        // else{
        //     res.send('signed in successfully')
        // }

        const token = generateToken(email);
        res.cookie('token',token);
        res.status(201).send('Logged in');
            
    } catch (error) {
        console.log(error, "Something wrong");
      res.status(500).send("Internal Server Error");
    }
}


export default {
    signup,
    signin,
}