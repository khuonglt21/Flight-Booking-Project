import mongoose from 'mongoose';
declare const ticketModel: mongoose.Model<{
    flightID: mongoose.Types.ObjectId;
    passengerID: mongoose.Types.ObjectId;
    contactID: mongoose.Types.ObjectId;
    isPurchased: boolean;
    bookingCode: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    flightID: mongoose.Types.ObjectId;
    passengerID: mongoose.Types.ObjectId;
    contactID: mongoose.Types.ObjectId;
    isPurchased: boolean;
    bookingCode: string;
}>>;
export { ticketModel };
