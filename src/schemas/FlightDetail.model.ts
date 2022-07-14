import {Schema, model} from 'mongoose';

const FlightDetailSchema = new Schema({
    flightID: {type: Schema.Types.ObjectId, required: true, ref: 'Flight'},
    typeID: {type: Schema.Types.ObjectId, required: true, ref: 'Class'},
    price: {type: Number, required: true},
    remainingSeats: {type: Number, required: true},
    baggage: {type: Number, required: true},//hành lý ký gửi
    luggage: {type: Number, required: true}//hành lý xách tay
});

FlightDetailSchema.index({flightID: 1, typeID: 1}, {unique: true});

const flightDetailModel = model("FlightDetail", FlightDetailSchema);

export default flightDetailModel;