import e from "express";
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
        const filePath = req.file.path; // Path of the file to upload
        const folderName = 'capstoneProject'; // cloudinary folder name

          cloudinaryInstance.uploader.upload(filePath, {folder:folderName}, async (err , result) => {
            if(err){
                console.log(`image upload err : ${err}`);
                return res.status(400).send('image upload failed');        
                }


            const imageUrl = result.url;
            const body = req.body;

            const {productName , brandName , price ,category ,description, adminEmail, sellingPrice} = body;

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
                sellingPrice,
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

// Ond all category one product to display / showcase 
export const getCategoryOneProduct = async (req,res) => {
    try {
        const productCategory = await Cart.distinct("category");
        // console.log("category :",productCategory);

        //array to store one product from each category
        const productByCategory = [];

        for(const category of productCategory){
            const product = await Cart.findOne({category:category});
            
            if(product){
                productByCategory.push(product);
            }
        }

        res.json({
            message:"category product",
            data:productByCategory,
            success:true,
            error:false
        })
    } catch (error) {
        res.status(400).json({
            message: error.message || err,
            error:true,
            success:false
        })
    }
}

// export const getCategoryWiseProducts = async (req,res) => {
//   try {
//     console.log('hitted to getCategoryWisePorducts')
//     const { category } = req?.body || req?.query
//     const product = await Cart.find({category: category })
//     console.log(product);

//     res.json({
//         data : product,
//         message : "Product",
//         success : true,
//         error : false
//     })
//   } catch (error) {
//     res.status(400).json({
//         message : err.message || err,
//         error : true,
//         success : false
//     })
//   }
// }


export const getCategoryWiseProducts = async (req, res) => {
    try {
      console.log('hitted to getCategoryWisePorducts');
      
      // Extract category from request body or query parameters
      const category = req.body.category 
      
      if (!category) {
        return res.status(400).json({
          message: 'Category is required',
          error: true,
          success: false
        });
      }
  
      // Find products by category
      const products = await Cart.find({ category });
  
      console.log(products);
  
      // Respond with the found products
      res.json({
        data: products,
        message: "Products retrieved successfully",
        success: true,
        error: false
      });
    } catch (err) {
      console.error('Error retrieving products:', err);
  
      // Respond with the error message
      res.status(500).json({
        message: err.message || 'Internal server error',
        error: true,
        success: false
      });
    }
  };
 

export default {
    getCart,
    addCart,
    getCategoryOneProduct,
    getCategoryWiseProducts
}
