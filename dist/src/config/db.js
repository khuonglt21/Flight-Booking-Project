"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = require("../logger/winston");
const DB_URL = process.env.DB_URL || "";
async function connectDB() {
    try {
        await mongoose_1.default.connect(DB_URL);
        console.log('Connected to database');
    }
    catch (err) {
        winston_1.logger.error(err);
    }
}
exports.default = connectDB;
//# sourceMappingURL=db.js.map