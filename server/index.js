const express=require('express');
const fileUpload=require('express-fileupload');
const cors = require("cors");
const cookieParser = require('cookie-parser')
const path = require('path');
const paymentRoutes=require('./Routes/paymentRoutes.js');
const { dbconnect } = require('./Config/supabase.js');

require('dotenv').config();
const app=express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.use('/api/v1',paymentRoutes);

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const PORT=process.env.PORT || 8080;

app.listen(PORT, async () => {
    console.log(`Server is running at port ${PORT}`);
    console.log(`Frontend will be available at http://localhost:${PORT}`);
    await dbconnect();
});