import mongoose from "mongoose";
declare const flightModel: mongoose.Model<{
    type: string;
    date: Date;
    flightCode: string;
    STD: string;
    STA: string;
    airline: string;
    departure?: mongoose.Types.ObjectId;
    arrival?: mongoose.Types.ObjectId;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    type: string;
    date: Date;
    flightCode: string;
    STD: string;
    STA: string;
    airline: string;
    departure?: mongoose.Types.ObjectId;
    arrival?: mongoose.Types.ObjectId;
}>>;
export default flightModel;
