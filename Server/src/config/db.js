import mongoose from "mongoose";
import { dbName } from "../utils/constant.js";


const connectDB = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`);
        console.log(`\n MongoDB connected, HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
       console.error('MONGODB CONNECTION FAILED', error);
       process.exit(1);   //forcefully stops the server so that app doesn't run in a broken state
    }
}

export {connectDB};