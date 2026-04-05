import mongoose from 'mongoose';
 const { Schema } = mongoose;
 
 const categorySchema = new Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        description: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
 }, { timestamps: true });

export default mongoose.model('Category', categorySchema);