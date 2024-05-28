import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateUser(req, res, next) {
    const token = req.cookies.token;
    jwt.verify(token,process.env.SE, (err,user)=>{
        console.log(err);
        if(err) return res.status(403).send("Token not valid or missing");
        req.user = user;
        console.log(req.user)
        console.log(req.user.role);
        next();
    })
    
}

export default authenticateUser;