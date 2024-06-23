import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { generateAdminToken } from "../utils/generateToken.js";
import Cart from "../models/cartModel.js";
// import Cart from "../models/cartModel.js";

export const signup = async (req, res) => {

    try {
        console.log('hitted admin signup')
        console.log(req.body);

        const {email , password , name , mobile} = req.body;
        const adminExist = await Admin.findOne({email});

        if(adminExist) {
            return res.json({
                message:"this Admin is already exist",
                
            })
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

        const AdminToken = generateAdminToken(savedAdmin);
        res.cookie("AdminToken",AdminToken,{
            httpOnly: true,
            secure: true, // Ensure to use secure in production
            sameSite: 'None', // Necessary for cross-domain cookies
        });
        res.json({
            message:"signed in ! " , AdminToken
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
            return res.status(404).json({
                message: "seller not found",
                success:false,
                error:true,
                data:null
            });
        }
        const isMatchPass = await bcrypt.compare(password, admin.hashPassword);
        
        if(!isMatchPass) {
            return res.status(400).json({
                message:"Invalid Password",
                success:false,
                error:true,
                data:null
            })
        }

        const AdminToken = generateAdminToken(admin);
        
        res.cookie("AdminToken",AdminToken,{
            httpOnly: true,
            secure: true, // Ensure to use secure in production
            sameSite: 'None', // Necessary for cross-domain cookies
        });
        res.json({
            message:"Logged in !",
            AdminToken
        });   

    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
}

export const updateProduct = async (req, res) => {
    try {
        console.log("hittted to update produt")
        const id = req.params.id;
        console.log(id);
        const STATUS = 'inactive'

        const {description, price, productName, brandName, category,sellingPrice } = req.body;
        console.log('req.body :',req.body);
        const updatedProduct = await Cart.findOneAndUpdate(
          { _id: id },
          { description, price, productName, brandName ,category,sellingPrice,STATUS },
          {
            new: true,
          }
   );
        console.log(updatedProduct)
        if (!updatedProduct) {
          return res.send("Course is not updated");
        }
        console.log(updatedProduct);
        return res.send(updatedProduct);
        
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
  };

  export const removeProduct = async (req, res) => {
    try {
        // its not complete the only manager can delete admin 
        console.log("Hitted to pruct remove")
        const id = req.params.id;
        console.log(id);

        const product = await Cart.findById(id);
        if(!product){
            return res.status(404).send("product not found");
        }
        // product.admin.pop(id)
        // await product.save()
       
        
       const relatedAdmin = product.admin;
       const removeRelatedAdmin = await Admin.findById(relatedAdmin);
    //    console.log("removeRelatedAdmin :",removeRelatedAdmin);
      const  removeIdFromAdmin = removeRelatedAdmin.cart;
    //   console.log("removeIdFromAdmin :",removeIdFromAdmin)
    if(removeIdFromAdmin == id){
        // console.log('yes its same')
        removeRelatedAdmin.cart.pop(id)
        removeRelatedAdmin.save()
    }
      const remove = await Cart.deleteOne({ _id: id })
       
        console.log("product :",product);
        console.log("admin id :", product.admin)

        if(!remove) {
            return res.status(404).send("failed to remove");
        }

        return res.send('removed successfully')
    } catch (error) {
        console.log(error, "Something wrong");
        res.status(500).send("Internal Server Error");
    }
}







export default {
    signup,
    login,
    updateProduct,
    removeProduct,
    
    
}