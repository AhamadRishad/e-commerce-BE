import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();
const secretKey = process.env.SE;

export const generateToken = (email) =>{
    return jwt.sign({data:email , success:true}, secretKey,{
        expiresIn: '1d',
            
      });
}