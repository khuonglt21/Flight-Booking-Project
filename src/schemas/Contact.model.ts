import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    firstName: {type:String , required:[true, "Missing first name"]},
    lastName: {type:String , required:[true, "Missing last name"]},
    phone: {type: Number , required:[true, "Missing phone"]},
    email: {type:String , required:[true, "Missing email"]},
    paymentMethod: {type:String}
});

const contactModel = mongoose.model('Contact', contactSchema);
export {contactModel};