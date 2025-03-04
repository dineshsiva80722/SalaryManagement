import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected');
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default connectDB;