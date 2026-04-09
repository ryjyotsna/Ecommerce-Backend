import { generateOtp } from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import {
  generateRegistrationOtpToken,
  verifyRegistrationOtpToken,
} from "../utils/jwt.js";
import User from "../model/user.model.js";
import { sendOtpEmail } from "../utils/sendmail.js";

export class AuthService {
  static async register(data) {
    const { fullName, email, password, phoneNumber } = data;

    //check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User already exists");
    }

    //create new user
    const hashPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    const otpToken = generateRegistrationOtpToken({
      fullName,
      email,
      phoneNumber,
      otp,
    });
    const newUser = await User.create({
      fullName,
      email,
      password: hashPassword,
      phoneNumber,
    });
    await sendOtpEmail(email, otp);
    return {
      message: "OTP sent to email",
      otpToken,
    };
  }

  static async verifyRegistrationOtp(data) {
    const { otp, token } = data;
    //verify token and otp
    if (!token) {
      throw new Error("Invalid or expired OTP token");
    }
    const payload = verifyRegistrationOtpToken(token);

    console.log(payload);

    if (payload.type !== "REGISTER_OTP") {
      throw new Error("Invalid OTP token type");
    }
    if (payload.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    //activate user
    const existingUser = await User.findOne({
      email: payload.email,
    });
    if (!existingUser) {
      throw new Error("User not found");
    }
    console.log(existingUser);
    const updatedUser = await User.updateOne(
      {
        email: payload.email,
      },
      {
        $set: {
          isVerified: true
        },
      },
    );
    console.log("Updated User:", updatedUser);
    return {
      success: true,
      message: "OTP verified",
      user: {
        id:updatedUser._id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
     
      },
    };
  }
}
