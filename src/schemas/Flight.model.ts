import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({
    flightCode: {type: 'String', required: true, maxlength: 255},
    departure: {type: mongoose.Schema.Types.ObjectId, ref: "Airport"},
    arrival: {type: mongoose.Schema.Types.ObjectId, ref: "Airport"},
    STD: {type: String, required: true},
    STA: {type: String, required: true},
    date: {type: Date, required: true},
    type: {type: String, required: true}
});
const flightModel = mongoose.model('Flight', flightSchema);
export default flightModel;