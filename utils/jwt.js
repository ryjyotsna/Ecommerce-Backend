import jwt from 'jsonwebtoken';

const generateRegistrationOptToken = (user) => ({mail,otp}) => {
    return jwt.sign({ 
        mail, 
        otp,
        type:"REGISTER_OTP"
     }, process.env.OTP_JWT_SECRET, { expiresIn: '5m' });
};
export { generateRegistrationOptToken };