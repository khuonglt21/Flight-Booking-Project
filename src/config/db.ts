import mongoose from "mongoose";
import {logger} from "../logger/winston";

const DB_URL = process.env.DB_URL || "";
export default async function connectDB() {
    try {
        await mongoose.connect(DB_URL);
        console.log('Connected to database');
    } catch (err) {
        logger.error(err)
    }
}