const express=require('express')
const router=express.Router()
const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const VerificationCode = require("../models/Verification");


//REGISTER
router.post("/register",async(req,res)=>{
    try{
        const {username,email,password}=req.body
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hashSync(password,salt)
        const newUser=new User({username,email,password:hashedPassword})
        const savedUser=await newUser.save()
        res.status(200).json(savedUser)

    }
    catch(err){
        console.log(err)
        res.status(500).json(err)
    }

})


// forgot password
router.post("/verify-code", async (req, res) => {
    const { email, code, password } = req.body;
  
    try {
      // Check if the verification code exists and matches the one sent
      const codeRecord = await VerificationCode.findOne({ email, code });
      if (!codeRecord) {
        return res.status(400).json({ message: "Invalid or expired verification code" });
      }
  
      // If the code matches, hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password
      const user = await User.findOne({ email });
      user.password = hashedPassword;
      await user.save();
  
      // Remove the used verification code from the database
      await VerificationCode.deleteOne({ email });
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error verifying code or updating password", error: err });
    }
  });
  



  router.post("/sendverificationcode", async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        service: 'Gmail', // Use your email provider
        auth: {
          user: 'rahul78905435@gmail.com', // Your Gmail username
          pass: 'mvhv trpw thcj bepz', // Your Gmail password or app password
        },
      });
    
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate a verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6-character hex code
      
      // Store the code and email in a VerificationCode model (or use Redis)
      const codeRecord = new VerificationCode({ email, code: verificationCode });
      await codeRecord.save();
      
      // Send the email with the verification code
      const mailOptions = {
        from: 'rahul78905435@gmail.com', // sender address
        to: email, // receiver
        subject: 'Password Reset Verification Code',
        text: `Your verification code is: ${verificationCode}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: "Verification code sent successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error sending verification code", error: err });
    }
  });

//LOGIN
router.post("/login",async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email})
       
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(req.body.password,user.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        const token=jwt.sign({_id:user._id,username:user.username,email:user.email},'dsfdfdfhjdsfjdhfjdf',{expiresIn:"3d"})
        const {password,...info}=user._doc
        res.cookie("token",token).status(200).json(info)

    }
    catch(err){
        res.status(500).json(err)
    }
})



//LOGOUT
router.get("/logout",async (req,res)=>{
    try{
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("User logged out successfully!")

    }
    catch(err){
        res.status(500).json(err)
    }
})

//REFETCH USER
router.get("/refetch", (req,res)=>{
    const token=req.cookies.token
    jwt.verify(token,'dsfdfdfhjdsfjdhfjdf',{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})



module.exports=router