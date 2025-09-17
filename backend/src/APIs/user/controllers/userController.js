import asyncHandler from "express-async-handler";
import userModel from "../models/userModel.js";
import emailService from "../../../config/emailService.js";
import oneTimePassword from "../../../config/generateOtp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export default {
  register: asyncHandler(async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      countryCode,
      phoneNumber,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !countryCode ||
      !phoneNumber
    ) {
      return res
        .status(404)
        .json({ message: "All fields are required", success: false });
    }

    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(404).json({
        message: "User already exist with this email",
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res
        .status(404)
        .json({ message: "password and confirm password must be same" });
    }
    const otp = String(oneTimePassword.generateOTP());

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      confirmPassword: hashPassword,
      phoneNumber,
      countryCode,
      otp,
    });

    try {
      await emailService.sendEmail(
        email,
        "RTCA - OTP for Registeration",
        `Your OTP is ${otp}. Please do not share with anyone.`
      );
    } catch (error) {
      console.log("Error sending otp");
    }
    return res.status(200).json({
      message: `OTP has been sent to this email ${email}. Please verify the OTP to register yourself`,
      success: true,
    });
  }),
  verifyOtp: asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Email and otp required", success: false });
    }
    const exisitingUser = await userModel.findOne({ email });
    if (!exisitingUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    if (exisitingUser.otp !== otp) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please enter valid otp." });
    } else {
      exisitingUser.isVerified = true;
      exisitingUser.otp = null;
      await exisitingUser.save();

      return res
        .status(200)
        .json({ message: "You are now Verified.", success: true });
    }
  }),
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const exisitingUser = await userModel.findOne({ email });
    if (!exisitingUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const comparePassword = await bcrypt.compare(
      password,
      exisitingUser.password
    );

    if (!comparePassword) {
      return res
        .status(404)
        .json({ message: "Something went wrong", success: false });
    }
    if (!exisitingUser.isVerified) {
      return res
        .status(404)
        .json({ message: "Please verify the otp to login", success: false });
    }

    await exisitingUser.save();
    const token = jwt.sign(
      { userId: exisitingUser._id },
      process.env.JWT_SECRET_CODE,
      { expiresIn: "2h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7200000,
      sameSite: "strict",
    });
    return res.status(200).json({
      message: "Successfully login",
      user: exisitingUser,
      success: true,
    });
  }),
  logout: asyncHandler(async (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });
    return res.status(200).json({ message: "Logged out successfully" });
  }),
  getAllUsers:asyncHandler(async(req,res)=>{
    const users = await userModel.find().select("-password -confirmPassword -otp")
    if(users.length === 0){
        return res.status(200).json({message:"No users found"})
    }
    return res.status(200).json({message:"Fetched users",users,success:true})
  })
};
