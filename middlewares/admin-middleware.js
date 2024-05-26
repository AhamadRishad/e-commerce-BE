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
dotenv.config();

function authenticateAdmin(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).send("Token not provided");
    }

    jwt.verify(token, process.env.SE, (err, user) => {
        if (err) {
            return res.status(403).send("Token not valid or missing");
        }

        // req.admin = user;

        // if (req.admin.role !== "admin" || req.admin.role !== "manager") {
        //     return res.status(403).send("Not authenticated");
        // }

        next();
    });
   
}

export default authenticateAdmin;
