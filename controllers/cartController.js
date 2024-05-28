import { cloudinaryInstance } from "../config/cloudinary.js";
import Admin from "../models/adminModel.js";
import Cart from "../models/cartModel.js"


// get cart
export const getCart = async (req, res) => {
   try {
    const carts = await Cart.find();
    // const carts = await Cart.find().sort({createdAt : -1}); check it in postman this code is to show latest upload first
    res.status(200).send(carts);
   } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Failed to fetch Data");
   }
    
}

//  upload cart

export const addCart = async (req, res) => {
    try {
        console.log('add to cart hitted')
        if(!req.file){
            return res.status(400).send('image is required');
        }

        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if(err){
                console.log(`image upload err : ${err}`);
                return res.status(400).send('image upload failed');
                
            }
            // console.log(result)
            const imageUrl = result.url;
            const body = req.body;

            const {productName , brandName , price ,category ,description, adminEmail} = body;

            console.log(body)
            if (!adminEmail) {
                return res.status(400).send('adminEmail is required');
            }

            let findAdmin = await Admin.findOne({email: adminEmail});
            // const adminDetail = await Admin.find(body.adminEmail)
            // console.log("findAdmin :",findAdmin);
            // console.log("adminDetail",adminDetail);

            // if (!findAdmin) {
            //     console.log(`Admin not found with findOne, trying find...`);
            //     const admins = await Admin.find({ email: adminEmail });
            //     // findAdmin = admins.length > 0 ? admins[0] : null;
            // }

            if(!findAdmin){
                return res.status(400).send('admin is not exist');
            }
               
            const createCart = new Cart({
                productName,
                brandName,
                price,
                category,
                description,
                admin: findAdmin._id,
                image: imageUrl
            })

            const newCreatedCart = await createCart.save();

            if(!newCreatedCart){
                return res.status(400).send('cart is not created');
            }

             // Add the product ID to the admin's cart array
             findAdmin.cart.push(newCreatedCart._id);
             await findAdmin.save();

            res.status(201).send(newCreatedCart)
        })
    } catch (error) {
        console.log("something went wrong", error);
      res.send("failed to create cart");
    }
}

export default {
    getCart,
    addCart,
}
