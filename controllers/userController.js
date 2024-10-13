const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { authenticateUser } = require('../services/authentication');


// Get all users (both login and signup)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            status: true,
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};

// Get user by ID (login or signup user by ID)
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        return res.status(200).json({
            status: true,
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};


//post login route
const postloginUser = async (req, res) => {
    const { email, password } = req.body; 
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);

         // Find user to get the username
         const user = await User.findOne({ email });
        // Create cookie and send response
        return res.cookie("token", token).json({
            message: "Login successful",
            token, // Optionally send the token in the response for client-side use
            username: user.username // Include username in the response
        });
    } catch (error) {
        // Instead of rendering a view, send a JSON response for the error
        return res.status(400).json({
            error: "Incorrect Email or Password!",
        });
    }
};

//post signup route
const posthandleUserSignup = async (req, res) => {
    const { username, email, password} = req.body;

    if (!username || !email || !password ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "Username already exists" });
        }

        await User.create({
            username,
            email,
            password,
           
        });
        return res.status(201).json({ status: true, message: "signup sucessfully"});
    } catch (error) {
        return res.status(500).json({ message: "Server error", error });
    }
};



// Edit user by ID (for login or signup user by ID)
const editUserById = async (req, res) => {
    const { id } = req.params;
    const { username, email} = req.body;

    try {
        // Check if email or username are already taken by another user
        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: id } });
            if (emailExists) {
                return res.status(400).json({ status: false, message: "Email already exists" });
            }
        }

        if (username) {
            const usernameExists = await User.findOne({ username, _id: { $ne: id } });
            if (usernameExists) {
                return res.status(400).json({ status: false, message: "Username already exists" });
            }
        }

        // Find user by ID and update allowed fields
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email },
            { new: true, runValidators: true } // Return the updated user and validate input
        );

        return res.status(200).json({
            status: true,
            message: "User updated successfully",
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                // address: updatedUser.address,
                // mobileNumber: updatedUser.mobileNumber,
            }
        });

    } catch (error) {
        console.error("Error updating user:", error); // Log the error
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

// Delete user by ID (login or signup user by ID)
const deleteUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ status: false, message: "User not found" });
        }
        return res.status(200).json({
            status: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
};

// Logout user
const logoutUser = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};

// Delete user account (logout and delete account)
// const deleteUserAccount = async (req, res) => {
//     const userId = req.user._id; // Assuming authenticateUser middleware sets req.user
//     try {
//         const deletedUser = await User.findByIdAndDelete(userId);
//         if (!deletedUser) {
//             return res.status(404).json({ status: false, message: "User not found" });
//         }
//         res.clearCookie("token");
//         return res.status(200).json({
//             status: true,
//             message: "User account deleted successfully"
//         });
//     } catch (error) {
//         return res.status(500).json({
//             status: false,
//             message: "Server error",
//             error: error.message
//         });
//     }
// };





const deleteUserAccount = async (req, res) => {
    const { email, password } = req.body;
console.log(email, password);
    try {
        // Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({
                status: false,
                message: "Email and password are required"
            });
        }

        // Check if user exists with the provided email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            return res.status(404).json({
                status: false,
                message: "User not found with this email"
            });
        }

        // Ensure user has a password
        if (!user.password) {
            console.log("Password not found for the user in the database");
            return res.status(500).json({
                status: false,
                message: "User password not set in the database"
            });
        }

         // Log the hashed password for comparison
         console.log("Hashed password in DB:", user.password);

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        // const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Password comparison:", isPasswordValid);  // Logging password validation
        if (!isPasswordValid) {
            return res.status(401).json({
                status: false,
                message: "Incorrect password"
            });
        }

        // Delete the user if email and password match
        const deletedUser = await User.findByIdAndDelete(user._id);
        if (!deletedUser) {
            return res.status(404).json({
                status: false,
                message: "User not found for deletion"
            });
        }

        // Clear authentication tokens or cookies (if any)
        res.clearCookie("token");
        
        return res.status(200).json({
            status: true,
            message: "User account deleted successfully"
        });
    } catch (error) {
        console.log("Error during deletion:", error.message);
        return res.status(500).json({
            status: false,
            message: "Server error",
            error: error.message
        });
    }
};



module.exports = {
    getAllUsers,
    getUserById,
    editUserById,
    deleteUserById,
    logoutUser,
    deleteUserAccount,
    postloginUser,
    posthandleUserSignup
};



// module.exports = {
    
//     // posthandleUserSignup,
//     // gethandleUserSignup,
//     // getloginUser,
//     // postloginUser,
//     // logoutUser,
//     // editProfile,
   

// }
