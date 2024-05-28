// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// dotenv.config();

// function authenticateAdmin (req , res , next) {
//     const token = req.cookies.token;

//     jwt.verify(token,process.env.SE, (err, user) => {
//         console.log(err);
//         if(err) 
           
//           res.status(403).send("Token not valid or missing");
//         req.admin = user;
//         console.log(req.admin.role);
//         if(req.admin.role !== "admin" && req.admin.role !=="manager") {
//             res.send("not authenticated");
//         }
//         next();
//     })
   
// }
// export default authenticateAdmin;

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import Admin from "../models/adminModel.js";
dotenv.config();

  function authenticateAdmin(req, res, next) {

// export const authenticateAdmin = async (req, res, next) => {
       const token = req.cookies.token;
    if (!token) {
        return res.status(403).send("Token not provided");
    }
    jwt.verify(token, process.env.SE, (err, admin) => {
        if (err) {
            return res.status(403).send("Token not valid or missing");
        }
        req.admin = admin;
         console.log("req.admin",req.admin);
        // console.log(req.admin)
        // if (req.admin.role !== "admin" || req.admin.role !== "manager") {
        //        return res.status(403).send("Not authenticated");
        //      }
        // console.log(req.admin.role);  
        next();
      })     


    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     const admin = await Admin.findById(decoded.id);

    //     if (!admin) {
    //         return res.status(401).send('Authorization denied, admin not found');
    //     }

    //     req.admin = {
    //         id: admin._id,
    //         data: admin.email, // assuming the token has email stored as 'data'
    //         role: admin.role
    //     };

    //     next();
    // } catch (error) {
    //     console.error('Something went wrong with authentication middleware', error);
    //     res.status(401).send('Token is not valid');
    // }











    // jwt.verify(token, process.env.SE, (err, user) => {
    //     if (err) {
    //         return res.status(403).send("Token not valid or missing");
    //     }

    //     // req.admin = user;

    //     // if (req.admin.role !== "admin" || req.admin.role !== "manager") {
    //     //     return res.status(403).send("Not authenticated");
    //     // }

    //     next();
    // });

   
}

export default authenticateAdmin;
