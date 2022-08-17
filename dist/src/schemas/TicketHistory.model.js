"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketHistoryModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ticketHistorySchema = new mongoose_1.default.Schema({
    bookingCode: { type: 'String' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User" },
    createDate: { type: 'Date', default: Date.now() }
});
const ticketHistoryModel = mongoose_1.default.model('TicketHistory', ticketHistorySchema);
exports.ticketHistoryModel = ticketHistoryModel;
//# sourceMappingURL=TicketHistory.model.js.map