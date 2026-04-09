import express from "express";
import { registerUser } from "../controller/auth/register.js";
import { verifyRegistrationOtp } from "../controller/auth/verifyOtp.js";

const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/verify-otp", verifyRegistrationOtp);

export default authRoute;
