import express from "express";
import { cloudinaryInstance } from "../config/cloudinary.js";
import Admin from "../models/adminModel.js";
import Cart from "../models/cartModel.js"
import Payment from "../models/paymentModel.js";


// get cart
// replace this to manager
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

            if(!findAdmin){
                return res.status(400).send('admin is not exist');
            }
            const STATUS = 'inactive'
               
            const createCart = new Cart({
                productName,
                brandName,
                price,
                sellingPrice,
                category,
                description,
                STATUS,
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
      const products = await Cart.find({ category ,STATUS:"active"});
  
      // console.log(products);
  
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
 
  export const getCardDetails = async (req,res) => {
    try {
      console.log('hitted to getCartDetails')
      // console.log("req.body : ",req.body)
      const { productId } = req.body

      const product = await Cart.findById(productId) 
       
      if(!product){
          return res.status(404).send("product not found");
      }

      // console.log(product)
      res.json({
        data:product,
        message:"OK",
        success:true,
        error:false
      })
    } catch (error) {
      res.json({
        message: error.message || err,
        error:true,
        success:false
      })
    }
  }





export const displayReview = async (req, res) => {
  try {
    console.log("hitted to displayReview");
    const { productId } = req.body;
console.log("productId",productId)
   
    const paymentDetails = await Payment.find();

    let reviewPromises = [];

  
    for (const payment of paymentDetails) {
  
      if (payment.review && payment.review.length > 0) {
    
        for (const review of payment.review) {

          if (review.productID === productId) {

            reviewPromises.push((async () => {
              const productDetails = await Cart.findById(review.productID);
              return { review, productDetails };
            })());
          }
        }
      }
    }

    const reviewsFound = await Promise.all(reviewPromises);
console.log("reviewsFound :" ,reviewsFound )
    if (reviewsFound.length > 0) {
      res.json({
        message: "Reviews found",
        reviews: reviewsFound,
        error: false,
        success: true
      });
    } else {
      res.json({
        message: "No reviews found for the given product ID",
        error: false,
        success: false
      });
    }
  } catch (error) {
    res.json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};


export default {
    getCart,
    addCart,
    getCategoryOneProduct,
    getCategoryWiseProducts,
    getCardDetails,
    displayReview
}
