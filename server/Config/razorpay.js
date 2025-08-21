const Razorpay = require('razorpay');
require('dotenv').config();

const keyId = process.env.RAZORPAY_KEY_ID || process.env.razorpay_key_id || 'YOUR_DEFAULT_KEY_ID';
const keySecret = process.env.RAZORPAY_SECRET || process.env.key_secret || 'YOUR_DEFAULT_KEY_SECRET';

exports.instance = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
});
