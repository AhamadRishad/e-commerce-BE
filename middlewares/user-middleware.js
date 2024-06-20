import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// req.headers.authorization.split(' ')[1]
function authenticateUser(req, res, next) {
    console.log("hitted to authenticateUser")
    const token = req.cookies.token ||   (req.headers.authorization && req.headers.authorization.split(' ')[1])  ;
    console.log('token ::',token)
    if (!token) {
        return res.status(403).send("Token not valid or missing");
      }
    jwt.verify(token,process.env.SE, (err,user)=>{
        console.log(err);
        if(err) return res.status(403).send("Token not valid or missing");
        req.user = user;
        // console.log(req.user)
        // console.log(req.user.role);
        next();
    })
    
}

export default authenticateUser;