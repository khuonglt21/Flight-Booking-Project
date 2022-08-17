"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passengerModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const passengerSchema = new mongoose_1.default.Schema({
    paxType: {
        type: String,
        enum: ["Adult", "Child", "Infant"],
        required: true
    },
    title: { type: String, required: [true, "Missing first title"] },
    firstName: { type: String, required: [true, "Missing first name"] },
    lastName: { type: String, required: [true, "Missing last name"] },
    birthDay: { type: Date, required: [true, "Missing birth day"] },
    nationality: { type: String, required: [true, "Missing nationality"] }
});
const passengerModel = mongoose_1.default.model('Passenger', passengerSchema);
exports.passengerModel = passengerModel;
//# sourceMappingURL=Passenger.model.js.map