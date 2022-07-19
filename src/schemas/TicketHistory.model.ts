import mongoose from "mongoose";

const ticketHistorySchema = new mongoose.Schema({
    bookingCode: {type: 'String'},
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    createDate: {type: 'Date', default: Date.now()}
});

const ticketHistoryModel = mongoose.model('TicketHistory', ticketHistorySchema);
export {ticketHistoryModel};
