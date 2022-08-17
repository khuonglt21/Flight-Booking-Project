"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FlightDetailSchema = new mongoose_1.Schema({
    flightID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Flight' },
    typeID: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Class' },
    price: { type: Number, required: true },
    remainingSeats: { type: Number, required: true },
    baggage: { type: Number, required: true },
    luggage: { type: Number, required: true }
});
FlightDetailSchema.index({ flightID: 1, typeID: 1 }, { unique: true });
const flightDetailModel = (0, mongoose_1.model)("FlightDetail", FlightDetailSchema);
exports.default = flightDetailModel;
//# sourceMappingURL=FlightDetail.model.js.map