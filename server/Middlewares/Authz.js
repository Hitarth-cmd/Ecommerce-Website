const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.authz = async (req, res, next) => {
    try {
        //console.log("conole -> ",req.body.token);

        //.log(req.cookies);

        // Check for token in multiple places: body, cookies, and Authorization header
        let token = req.body.token || req.cookies.token;
        
        // If no token found, check Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.replace('Bearer ', '');
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing, please login first"
            });
        }

        console.log("Token found:", token);
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token payload:", payload);

            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while verifying the token"
        });
    }
    next();
};



exports.isCustomer = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Customer") {
            return res.status(403).json({
                success: false,
                message: "Access forbidden. This protected route is for Customers only."
            });
        }
        //console.log("yes");
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User Role is not matching"
        });
    }
};