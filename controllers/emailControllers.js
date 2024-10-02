const User = require('../models/userModel');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const JWT = require("jsonwebtoken");
// const { authenticateUser } = require('../services/authentication');

const getemailVerification = async (req,res)=>{

     return res.status(201).json({ status: true, message: "email already exist" })
}

const postemailVerification = async (req,res)=>{
    const {email} = req.body;
    const user = await User.findOne({email});
    if(user){
        return res.status(201).json({status: true, message: "email already exist"});
    }
    else{
        return res.status(201).json({status: false, message: "email does not exist"});
    }
};



const otpStore = {}; // Simple in-memory store for OTPs

const forgotPassword = async (req,res)=>{
    const {email} = req.body;

     // Check if user exists with the provided email
     const user = await User.findOne({ email });
     if (!user) {
         return res.status(404).json({ status: false, message: "User with this email does not exist" });
     }

    // Generate a random OTP (One Time Password)
    const otp = crypto.randomInt(100000, 999999); // Generates a 6-digit OTP

    // Generate a token using JWT (or any other mechanism)
    const token = JWT.sign({ email,otp}, 'DinneAppSecret', { expiresIn: '10m' }); // Token valid for 10 minutes
   
    // Store the OTP in memory (key: email, value: otp and expiration)
    otpStore[email] = { otp, expiresIn: Date.now() + 10 * 60 * 1000 }; // OTP valid for 10 minutes

    // Set up the email transport using nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: 'dhammashila025@gmail.com', // generated ethereal user
            pass: 'fsxg mifd gqly rgxr', // generated ethereal password
        },
        tls: {
            rejectUnauthorized: false,
            
        }
    });

    // Set up email options
    const mailOptions = {
        from: '"dhammashila025@gmail.com', // sender address
        to: email, // receiver's email
        subject: "Your OTP Code", // Subject line
        text: `Your OTP code is ${otp}. It is valid for 10 minutes.`, // plain text body
        html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`, // HTML body
    };

    try {
        // Send the OTP to the user's email
        await transporter.sendMail(mailOptions);

        // Store the token in a cookie
        res.cookie('token', token, { httpOnly: true, secure: true });
        console.log("token",token)

        // Respond with a success message
        return res.status(200).json({ status: true, message: "OTP sent successfully", otp: otp });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error sending OTP", error: error.message });
    }
};


const postoptVerification = async (req, res) => {
    const { email, otp } = req.body;

    // Check if OTP was sent for the email
    const otpData = otpStore[email];
    if (!otpData) {
        return res.status(400).json({ status: false, message: "No OTP found for this email" });
    }

    // Check if the OTP has expired
    if (Date.now() > otpData.expiresIn) {
        return res.status(400).json({ status: false, message: "OTP has expired" });
    }

    // Compare the provided OTP with the stored OTP
    if (parseInt(otp) === otpData.otp) {
        // OTP is correct
        // Clear the OTP from memory after successful verification
        delete otpStore[email];

        // Respond with success
        return res.status(200).json({ status: true, message: "OTP verified successfully" });
    } else {
        // OTP is incorrect
        return res.status(400).json({ status: false, message: "OTP does not match" });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password in the database
        const user = await User.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Send success response
        return res.status(200).json({ status: true, message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Error resetting password", error: error.message });
    }
};




module.exports = {
    getemailVerification,
    postemailVerification, 
    forgotPassword,
    postoptVerification,
    resetPassword
}