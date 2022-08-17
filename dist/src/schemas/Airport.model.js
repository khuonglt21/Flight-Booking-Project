"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const airportSchema = new mongoose_1.default.Schema({
    name: { type: "String", required: true, maxlength: 255 },
    city: { type: "String", maxlength: 1000 },
    code: { type: "String", unique: true }
});
const airportModel = mongoose_1.default.model('Airport', airportSchema);
exports.default = airportModel;
//# sourceMappingURL=Airport.model.js.map