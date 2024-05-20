import { cloudinaryInstance } from "../config/cloudinary.js";
import Admin from "../models/adminModel.js";
import Cart from "../models/cartModel.js"


// get cart
export const getCart = async (req, res) => {
   try {
    const carts = await Cart.find();
    res.status(200).send(carts);
   } catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Failed to fetch Data");
   }
    
}

// add to cart

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

            const {title , description , price ,mobile , adminEmail} = body;

            const findAdmin = await Admin.find({email: adminEmail});

            if(!findAdmin){
                return res.status(400).send('admin is not exist');
            }
               
            const createCart = new Cart({
                title,
                description,
                price,
                mobile,
                admin: findAdmin._id,
                image: imageUrl
            })

            const newCreatedCart = await createCart.save();
            if(!newCreatedCart){
                return res.status(400).send('cart is not created');
            }
            res.status(201).send(newCreatedCart);
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
