"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const flightSchema = new mongoose_1.default.Schema({
    flightCode: { type: 'String', required: true, maxlength: 255, unique: true },
    departure: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Airport" },
    arrival: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Airport" },
    STD: { type: String, required: true },
    STA: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    airline: { type: String, required: true }
});
const flightModel = mongoose_1.default.model('Flight', flightSchema);
exports.default = flightModel;
//# sourceMappingURL=Flight.model.js.map