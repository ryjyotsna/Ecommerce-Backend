import { AuthService } from "../../service/AuthService.js";
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber } = req.body;

    if (!fullName || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const data = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};
