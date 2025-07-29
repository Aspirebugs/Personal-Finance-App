import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
if(!MONGODB_URL) {
    console.log("mongoDB Url doesn't exist");
    process.exit(1);
}
        
export const DBConnection = async () => {
    try {
    await mongoose.connect(MONGODB_URL, { 
    });
    console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Error while connecting to the database:", error.message);
        process.exit(1);
    }
};