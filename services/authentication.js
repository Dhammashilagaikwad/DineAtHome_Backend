const JWT = require("jsonwebtoken");

const secret = "DinneAppSecret";

// create a token
function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        // profileImageURL: user.profileImageURL,
       
    };
    const token = JWT.sign(payload, secret);
    return token;
}


// validate token

function validateToken(token) {
    try {
        const payload = JWT.verify(token, secret);
        return payload;
    } catch (err) {
        throw new Error("Invalid token");
    }
}
// Middleware to authenticate the user based on JWT token

const authenticateUser = (req, res, next) => {
    let token = req.cookies ? req.cookies.token : null; // Check if cookies exist
    
    // If no token from cookies, check Authorization header
    if (!token && req.headers['authorization']) {
        token = req.headers['authorization'];
    }

    console.log("Token from cookies:", req.cookies ? req.cookies.token : null);
console.log("Token from authorization header:", req.headers['authorization']);

    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length); // Remove "Bearer " from the start
    }

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = JWT.verify(token, secret);
        console.log("Decoded token payload:", decoded);  // Log the decoded token
        req.user = decoded; 
        console.log("Decoded token payload:", decoded); 
        next();
        console.log("Token received:", token);
    } catch (error) {
        console.error("JWT verification error:", error);
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = {
    createTokenForUser,
    validateToken,
    authenticateUser,
}