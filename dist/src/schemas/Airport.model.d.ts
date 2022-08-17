import mongoose from "mongoose";
declare const airportModel: mongoose.Model<{
    name: string;
    city?: string;
    code?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    name: string;
    city?: string;
    code?: string;
}>>;
export default airportModel;
