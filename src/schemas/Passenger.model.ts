import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema({
    paxType: {
        type: String,
        enum: ["Adult","Child", "Infant"],
        required: true
    },
    title: {type:String , required:[true, "Missing first title"]},
    firstName: {type:String , required:[true, "Missing first name"]},
    lastName: {type:String , required:[true, "Missing last name"]},
    birthDay: {type:Date , required:[true, "Missing birth day"]},
    nationality: {type:String , required:[true, "Missing nationality"]}
});

const passengerModel = mongoose.model('Passenger',passengerSchema);
export {passengerModel} ;