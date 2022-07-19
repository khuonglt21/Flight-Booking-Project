import mongoose from 'mongoose';

//  arrival: {type: mongoose.Schema.Types.ObjectId, ref: "Airport"},

const ticketSchema = new mongoose.Schema({
    flightID: {type: mongoose.Schema.Types.ObjectId, ref: "FlightDetail", required: true},
    passengerID: {type: mongoose.Schema.Types.ObjectId, ref: "Passenger", required: true},
    contactID: {type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true},
    isPurchased: {type: Boolean, default: false},
    bookingCode: {
        type: String,
        required: [true, "No booking code found!"],
        min: [1, "Must be at least 1, but got {VALUE}"]
    },
});


const ticketModel = mongoose.model("Ticket", ticketSchema);

export {ticketModel} ;

