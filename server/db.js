import mongoose from 'mongoose';

const connectPayrollDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://mohankumarmmm12:mohankumarmmm12@cluster0.kjp2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectPayrollDB;