import {Schema,model} from 'mongoose';

const FlightDetailSchema = new Schema({
    flightID: {type:Schema.Types.ObjectId, required:true, ref:'Flight'},
    typeID: {type:Schema.Types.ObjectId, required:true, ref:'Class'},
    price: {type:Number,required:true},
    remainingSeats: {type:Number,required:true},
    baggage: {type:Number,required:true},//hành lý ký gửi
    luggage: {type:Number,required:true}//hành lý xách tay
});

const flightDetailModel =model("FlightDetail",FlightDetailSchema);

export default flightDetailModel;