import mongoose from "mongoose";

const airportSchema = new mongoose.Schema({
    name: {type: "String", required: true, maxlength: 255},
    city: {type: "String", maxlength: 1000},
    code: {type: "String", unique: true}
});

const airportModel = mongoose.model('Airport', airportSchema);

export default airportModel;
