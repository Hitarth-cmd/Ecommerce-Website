const supabaseService = require("../services/supabaseService");

exports.addToCart = async(req,res)=>{
    try{

        const {product} = req.body;
        if(!product)
        {
            return res.status(400).json({
                success:false,
                message:"product is missing"
            })
        }

       // console.log("product -> ",product);

        //get user id
        const userId = req.user.id;
        if(!userId)
        {
            return res.status(400).json({
                success:false,
                message:"User's id is missing"
            })
        }

        //check does it already exist
        const existingCartItem = await supabaseService.findCartItem(product, userId);
        if(existingCartItem){
            return res.status(401).json({
                success:false,
                message:"Product is already in the cart"
            })
        }

        // create new record in cart schema
        const newCart = await supabaseService.createCartItem({
            product,
            user_id: userId
        })

        //return successfull response
        return res.status(200).json({
            success:true,
            message:"added product into cart successfully"
        })
    }
    catch(error)
    {
        console.error("Error while adding product to cart:", error);
        return res.status(500).json({
            success:false,
            message:"Error while adding product to cart",
            error:error.message
        })
    }
}


// Remove product from cart
exports.removeFromCart = async (req, res) => {
    try {
        // Get product ID from request body (support both id and _id from client)
        const { _id, id } = req.body;
        const cartItemId = id || _id;

        //console.log("id -> ",_id);

        // Validation for missing product ID
        if (!cartItemId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is missing"
            });
        }

        // Extract user ID from request
        const userId = req.user.id;

        // Validation for missing user ID
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing"
            });
        }
    
        // Find and remove the product from the cart
        const cartProduct = await supabaseService.deleteCartItem(cartItemId);

        if (!cartProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

       // console.log("yes");

        // Return successful response
        return res.status(200).json({
            success: true,
            message: "Successfully removed product from cart"
        });
    } catch (error) {
        console.error("Error while removing product from cart:", error);
        return res.status(500).json({
            success: false,
            message: "Error while removing product from cart",
            error: error.message
        });
    }
};


exports.showAllCartItems = async (req,res) =>{
    try{

        //console.log("yes");
        // get user ID and validate
        const userId = req.user.id;
        if(!userId){
            return res.status(400).json({
                success:false,
                message:"User is missing",
            })
        }

        const data = await supabaseService.findCartByUserId(userId);

       // console.log("data -> ",data);

        //return successFull response
        return res.status(200).json({
            success:true,
            message:"Fetched Cart data successFully",
            data:data
        })
    }
    catch(error){
        return res.status(400).json({
            success:false,
            message:"Error while fetching Cart Items",
            error:error
        })
    }
}

// show all ordered products
exports.orderedProducts = async (req, res) => {
    try {
        // get user's id from request
        const userId = req.user.id;

        // validate user id
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing"
            });
        }

        // get user's ordered products
        const orderedProducts = await supabaseService.findOrderedProductsByStatus(userId, 'ordered');

        // return success response with ordered products
        return res.status(200).json({
            success: true,
            orderedProducts: orderedProducts
        });

    } catch (error) {
        // return error response
        return res.status(500).json({
            success: false,
            message: "Error while fetching ordered products",
            error: error.message
        });
    }
};


// show all refunded products
exports.refundedProducts = async (req, res) => {
    try {
        // get user's id from request
        const userId = req.user.id;

        // validate user id
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is missing"
            });
        }

        // get user's refunded products
        const refundedProducts = await supabaseService.findOrderedProductsByStatus(userId, 'refunded');

        // return success response with refunded products
        return res.status(200).json({
            success: true,
            refundedProducts: refundedProducts
        });

    } catch (error) {
        // return error response
        return res.status(500).json({
            success: false,
            message: "Error while fetching refunded products",
            error: error.message
        });
    }
};

