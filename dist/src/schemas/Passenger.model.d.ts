import mongoose from "mongoose";
declare const passengerModel: mongoose.Model<{
    firstName: string;
    lastName: string;
    paxType: "Adult" | "Child" | "Infant";
    title: string;
    birthDay: Date;
    nationality: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    firstName: string;
    lastName: string;
    paxType: "Adult" | "Child" | "Infant";
    title: string;
    birthDay: Date;
    nationality: string;
}>>;
export { passengerModel };
