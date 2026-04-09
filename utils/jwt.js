import jwt from "jsonwebtoken";

export const generateRegistrationOtpToken = ({
  fullName,
  email,
  phoneNumber,
  otp,
}) => {
  return jwt.sign(
    {
      fullName,
      email,
      phoneNumber,
      otp,
      type: "REGISTER_OTP",
    },
    process.env.OTP_JWT_SECRET,
    {
      expiresIn: "5m",
    },
  );
};

export const verifyRegistrationOtpToken = (token) => {
  return jwt.verify(token, process.env.OTP_JWT_SECRET);
};