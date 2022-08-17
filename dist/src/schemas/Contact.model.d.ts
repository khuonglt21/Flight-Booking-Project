import mongoose from "mongoose";
declare const contactModel: mongoose.Model<{
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    paymentMethod?: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, any, {}, "type", {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    paymentMethod?: string;
}>>;
export { contactModel };
