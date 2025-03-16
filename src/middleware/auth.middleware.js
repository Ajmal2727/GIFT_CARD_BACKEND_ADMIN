import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = `${process.env.ACCESS_TOKEN_SECRET}`;


export const verifyToken = (req, res, next) => {
    // const token = req.cookies.accessToken; // Get token from cookies
    const cookie =  req.headers?.Authorization || req?.headers?.authorization || req.cookies?.accessToken    
    
    const token = cookie?.replace('Bearer ', '');
    console.log("Received Token:", token);
    
    if (!token) {
        return res.status(401).json({statusCode:401, success:false, message: "acccess denied. no token provided" });
    }

    try {
        const decoded = jwt.verify(token,ACCESS_TOKEN_SECRET);
        console.log("Decoded Token:", decoded); // Debugging
        
        if (!decoded) {
            throw new Error("Invalid Access Token");
        }
        
        req.user = decoded; // Attach decoded user info to request object
        next(); // Proceed to next middleware
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(403).json({ error: "Invalid or expired token." });
    }
};

