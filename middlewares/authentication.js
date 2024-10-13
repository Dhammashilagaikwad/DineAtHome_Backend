const { validateToken } = require("../services/authentication"); // all middlewares should be connected to each others

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
           return next();
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log("User payload from cookie:", userPayload);
        } catch (error) { 
            console.error("Error validating token from cookie:", error);
        }
      return next();
    };
};

module.exports = {
    checkForAuthenticationCookie,
}

// middleware check for req.use is exist or not 

//generic middleware function for checking every tokens response