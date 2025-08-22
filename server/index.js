const express=require('express');
const fileUpload=require('express-fileupload');
const cors = require("cors");
const cookieParser = require('cookie-parser')
const paymentRoutes=require('./Routes/paymentRoutes.js');
const { dbconnect } = require('./Config/supabase.js');

require('dotenv').config();
const app=express();

app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// API routes
app.use('/api/v1',paymentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

const PORT=process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT}`);
    await dbconnect();
});

module.exports = app;