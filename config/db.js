import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        
            const dbURI = process.env.DATABASE_URL;
        
            if (!dbURI) {
                throw new Error('MONGODB_URI not defined');
            }
            await mongoose.connect(dbURI);
            console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
        process.exit(1);

        
    }

};
export default connectDB;