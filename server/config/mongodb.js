import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/imagify`)
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); // Exit the process if the connection fails
    }
};

export default connectDB;
