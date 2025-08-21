const express=require('express');
const router = express.Router();
const {
       capturePayment, 
       getKeyId,
       paymentVerification,
       paymentRefund,
       fetchAllPayments,
       fetchPaymentWithId,
       fetchCardDetails
    } = require('../Controllers/Razorpay.js');
const { addToCart, removeFromCart, showAllCartItems, orderedProducts, refundedProducts } = require('../Controllers/Ecommerce.js');
const { signUp, login } = require('../Controllers/Authz.js');
const { authz, isCustomer } = require('../Middlewares/Authz.js');

// auth routes
router.post('/signup',signUp);
router.post('/login',login);

// razorpay & e-commerce routes
router.get('/getkey',getKeyId)
router.get('/allpayments',fetchAllPayments);
router.post('/checkout',capturePayment);
router.post('/paymentverification',authz,isCustomer,paymentVerification);
router.post('/refund',authz,isCustomer,paymentRefund);
router.post('/paymentdetailswithid',fetchPaymentWithId);
router.post('/fetchcarddetails',fetchCardDetails);
router.post('/addtocart',authz,isCustomer,addToCart);
router.delete('/removefromcart',authz,isCustomer,removeFromCart);
router.post('/showcartitems',authz,isCustomer,showAllCartItems);
router.post('/orderedproducts',authz,isCustomer,orderedProducts);
router.post('/refundedproducts',authz,isCustomer,refundedProducts);

module.exports=router;