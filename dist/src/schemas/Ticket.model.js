"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ticketSchema = new mongoose_1.default.Schema({
    flightID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "FlightDetail", required: true },
    passengerID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Passenger", required: true },
    contactID: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "Contact", required: true },
    isPurchased: { type: Boolean, default: false },
    bookingCode: {
        type: String,
        required: [true, "No booking code found!"],
        min: [1, "Must be at least 1, but got {VALUE}"]
    },
});
const ticketModel = mongoose_1.default.model("Ticket", ticketSchema);
exports.ticketModel = ticketModel;
//# sourceMappingURL=Ticket.model.js.map