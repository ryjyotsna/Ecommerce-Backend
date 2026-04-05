import mongoose from 'mongoose';
const{Schema} = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true 
    },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);