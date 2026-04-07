import { generateOtp } from "../utils/generateOtp.js";
import bcrypt from "bcrypt";
import { generateRegistrationOptToken } from "../utils/jwt.js";
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

    const otpToken = generateRegistrationOptToken({
      email,
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
}
