// controller
const { instance } = require('../Config/razorpay');
const crypto = require('crypto');
require('dotenv').config();
const supabaseService = require('../services/supabaseService');

exports.capturePayment = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount === undefined || amount === null || isNaN(Number(amount))) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        const amountInPaise = Number(amount) * 100;
        const currency = "INR";
        const receipt = generateReceipt();

        // console.log("amount -> ",amount);
        // console.log("currency -> ",currency);

        const options = {
            amount: amountInPaise,
            currency,
            receipt
        };

        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        //console.log("Payment Response:", paymentResponse);

        // Return response
        return res.status(200).json({
            success: true,
            paymentResponse
        });
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(400).json({
            success: false,
            message: "Could not initiate the order",
            error: error
        });
    }
}

// Function to generate a random receipt
function generateReceipt() {
    return Math.random().toString(36).substring(7); // Adjust length of receipt as needed
}


// Verify payment
exports.paymentVerification = async (req, res) => {
    try {
        const { product,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature } = req.body;

        const userId = req.user.id;

        // Check if user ID is present
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is missing"
            });
        }

        // Create the body string to verify the signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        // Generate the expected signature using Razorpay secret
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        // Verify if the signature is authentic
        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment signature"
            });
        }

        // Create a new payment record in the database
        const newPayment = await supabaseService.createPayment({
            razorpay_order_id,
            razorpay_signature,
            razorpay_payment_id,
            user_id: userId
        });

        // Create a new ordered product record
        const order = await supabaseService.createOrderedProduct({
            product,
            user_id: userId,
            payment_id: newPayment.id,
            status: "ordered"
        });

        // Update the payment record with the order ID
        await supabaseService.updatePayment(newPayment.id, {
            ordered_product_id: order.id
        });

        // Log and return success JSON so client can navigate
        console.log("Payment verified successfully");
        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            reference: razorpay_payment_id
        });
    } catch (error) {
        // Log the error and send an internal server error response
        console.error("Error during payment verification:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/// Payment refund
exports.paymentRefund = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user.id;

        // Validation for missing fields
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId are missing"
            });
        }

        // Check if user ID is present
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User id is missing"
            });
        }

        //get payment id
        const orderdPro = await supabaseService.findOrderedProductById(orderId);
        const payment = await supabaseService.findPaymentById(orderdPro.payment_id);
        const paymentId = payment.razorpay_payment_id;
        const amount = Math.round(Number(orderdPro.product.price || 0) * 100);

        //console.log(orderdPro);

       // console.log("pay -> ",paymentId);
        // Process the refund through Razorpay
        const refundResponse = await instance.payments.refund(paymentId, {
            amount: amount,
            speed: "optimum",
        });

        // Update the status of the ordered product to "refunded"
        await supabaseService.updateOrderStatus(orderId, "refunded");

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Payment refund successful",
            refundResponse
        });
    } catch (error) {
        console.error("Error while processing refund:", error);
        res.status(500).json({
            success: false,
            message: "Error while making request for refund",
            error: error.message
        });
    }
};




// fetch details of all payments
exports.fetchAllPayments=async(req,res)=>{
    try{
        const response= await instance.payments.all();
        console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched all payments successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching all payments details",
            error:error.message
        })
    }
}


// fetch payment by id
exports.fetchPaymentWithId = async(req,res)=>{
    try{

        const {orderId}=req.body;

        //console.log(req.body);
        //validation
        if(!orderId)
        {
            return res.status(400).json({
                success:false,
                message:"orderId is missing"
            })
        }

         //fetch payment id 
         const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('razorpay_order_id', orderId)
            .single();
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: "orderId is invalid"
            });
        }

        if(!data){
            return res.status(400).json({
                success:false,
                message:"orderId is invalid"
            })
        }
        const paymentId = data.razorpay_payment_id;

        const response= await instance.payments.fetch(paymentId);
        //console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched payment successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching payment details",
            error:error
        })
    }
}



// fetch card details used for payment
exports.fetchCardDetails = async(req,res)=>{
    try{

        const {orderId}=req.body;

        //validation
        if(!orderId)
        {
            return res.status(400).json({
                success:false,
                message:"orderId is missing"
            })
        }

        // fetch payment id 
        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('razorpay_order_id', orderId)
            .single();
        
        if (error) {
            return res.status(400).json({
                success: false,
                message: "orderId is invalid"
            });
        }

        if(!data){
            return res.status(400).json({
                success:false,
                message:"orderId is invalid"
            })
        }
        const paymentId = data.razorpay_payment_id;

        const response= await instance.payments.fetchCardDetails(paymentId)
        //console.log(response);

        return res.status(200).json({
            success:true,
            message:"fetched card details successfully",
            response
          })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"error while fetching payment card details",
            error:error
        })
    }
}



// get key id controller
exports.getKeyId= async (req,res)=>{
    try{
        const Id=process.env.RAZORPAY_KEY_ID || process.env.razorpay_key_id;
        return res.status(200).json({
            success:true,
            message:"successfully fetched razorpay key id",
            key_id:Id
        })
    }
    catch(error)
    {
        return res.status(400).json({
            success:false,
            message:"error while geting key id",
            error:error.message
        })
    }
}