
 import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

  function authenticateAdmin(req, res, next) {
       const AdminToken = req.cookies.AdminToken || req.headers.authorization.split(' ')[1];;
    if (!AdminToken) {
        return res.status(403).send("Token not provided");

    }
    jwt.verify(AdminToken, process.env.SECRET_ADMIN, (err, admin) => {
        if (err) return res.status(403).send("Token not valid or missing");        
        req.admin = admin;
    
        next();
      })     



   
}

export default authenticateAdmin;
