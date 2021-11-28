import mongoose from "mongoose";
import { config } from 'dotenv';
config();

export async function connect() {
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/${process.env.DB_NAME}`, {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
    });
}