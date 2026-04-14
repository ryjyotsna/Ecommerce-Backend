import { generateOtp } from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import {
  generateRegistrationOtpToken,
  verifyRegistrationOtpToken,
} from "../utils/jwt.js";
import User from "../model/user.model.js";
// import { sendOtpEmail } from "../utils/sendmail.js"; 
export class AuthService {

  
  static async register(data) {
    const { fullName, email, password, phoneNumber } = data;

    // check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    // hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // generate OTP
    const otp = generateOtp();
    console.log("🔥 OTP GENERATED:", otp); 

    // generate token with OTP
    const otpToken = generateRegistrationOtpToken({
      fullName,
      email,
      phoneNumber,
      otp,
    });

    // create user
    await User.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
    });

    // await sendOtpEmail(email, otp);

    return {
      message: "OTP generated successfully",
      otpToken,
    };
  }

  // 🟢 VERIFY OTP
  static async verifyRegistrationOtp(data) {
    const { otp, token } = data;

    // check token
    if (!token) {
      throw new Error("Invalid or expired OTP token");
    }

    // verify token
    const payload = verifyRegistrationOtpToken(token);
    console.log("Payload:", payload);

    // validate token type
    if (payload.type !== "REGISTER_OTP") {
      throw new Error("Invalid OTP token type");
    }

    // validate OTP
    if (payload.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    // check user exists
    const existingUser = await User.findOne({
      email: payload.email,
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // update user verification status
    await User.updateOne(
      { email: payload.email },
      { $set: { isVerified: true } }
    );

    // fetch updated user 
    const user = await User.findOne({ email: payload.email });

    return {
      success: true,
      message: "OTP verified",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }
}