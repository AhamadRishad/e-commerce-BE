import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateManager(req ,res , next){
    const token = req.cookies.token;
    
    jwt.verify(token,process.env.SECRET_ADMIN ,(err ,user) => {
        if(err) return res.status(403)
        req.user = user;
        if(req.user.role !== "manager"){
            return res.send("not authenticated");
        }
        next();
    })
}

export default authenticateManager;