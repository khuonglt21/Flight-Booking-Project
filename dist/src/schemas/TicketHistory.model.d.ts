import mongoose from "mongoose";
declare const ticketHistoryModel: mongoose.Model<{
    bookingCode?: string;
    userId?: mongoose.Types.ObjectId;
    createDate?: Date;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    bookingCode?: string;
    userId?: mongoose.Types.ObjectId;
    createDate?: Date;
}>>;
export { ticketHistoryModel };
