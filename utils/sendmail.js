import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  const { EMAIL, PASSWORD } = process.env;

  if (!EMAIL || !PASSWORD) {
    throw new Error("Email credentials are not set in environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  });

  await transporter.sendMail({
    from: EMAIL,
    to: email,
    subject: "Your OTP",
    html: `
        <h2>Welcome to our E-commerce App</h2>
        <p>Your OTP for login is: <b>${otp}</b></p>
        <p>valid for 5 minutes.</p>
        `,
  });
};
