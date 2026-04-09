import { AuthService } from "../../service/AuthService.js";

export const verifyRegistrationOtp = async (req, res) => {
    try { 
        const { otp,token } = req.body;
        if (!otp || !token) {
            return res.status(400).json({
                success: false,
                message: 'OTP and token are required'

            });
        }
        //call service layer
        const data = await AuthService.verifyRegistrationOtp({ otp, token });
        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: data
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'OTP verification failed',
            error: error.message
        });
        
    }
}
