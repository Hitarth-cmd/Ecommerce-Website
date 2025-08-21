const supabaseService = require('../services/supabaseService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//signup
exports.signUp=async (req,res)=>{
    try{

        //fetching all data from req body
        const{
            userName,
            phoneNumber,
            password,
            confirmPassword,
            accountType
        }=req.body;

        //console.log(req.body);
        
        //cheking are there all fields
        if(!userName || !phoneNumber || !password || !confirmPassword || !accountType)
        {
            return res.status(400).json({
                success:false,
                message:"Fill all details",
            })
        }

        //password and confirmPassword should be same
        if(password!=confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"Password and confirmPassword values does not match"
            })
        }

        //check user already exist or not
        const isUserPresent = await supabaseService.findUserByPhone(phoneNumber);
        if(isUserPresent)
        {
            return res.status(400).json({
                success:false,
                message:"User is already Registered"
            })
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //creating entry in User DB
        const user = await supabaseService.createUser({
            user_name: userName,
            phone_number: phoneNumber,
            password: hashedPassword, // Save the hashed password
            account_type: accountType,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${userName}${userName}`,
        });

        //return response
        return res.status(200).json({
            success:true,
            message:"User registered SuccessFully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}


// User login
exports.login = async (req, res) => {
    try {
        // Fetch data from request body
        const { phoneNumber, 
                password, 
                accountType } = req.body;

        // Validate if fields are present
        if (!phoneNumber || !password || !accountType) {
            return res.status(400).json({
                success: false,
                message: "Enter all fields"
            });
        }

        // Check if user exists
        const user = await supabaseService.findUserByPhone(phoneNumber);
        
        if (!user || user.account_type !== accountType) {
            return res.status(400).json({
                success: false,
                message: "User is not registered, please sign up first"
            });
        }

        // Password matching
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        // Payload for JWT
        const payLoad = {
            phoneNumber: user.phone_number,
            accountType: accountType,
            id: user.id,
        };

        // Generate JWT token
        const token = jwt.sign(payLoad, process.env.JWT_SECRET, {
            expiresIn: "4h",
        });

        user.token = token;
        user.password = undefined; // Ensure password is not sent in response

        // Create cookies and send response
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
            httpOnly: true,
        };

        return res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "User logged in successfully"
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};