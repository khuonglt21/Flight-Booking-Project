import User from '../schemas/User.model';

import {ticketModel} from "../schemas/Ticket.model";
import {passengerModel} from "../schemas/Passenger.model";
import {contactModel} from "../schemas/Contact.model";
import {ticketHistoryModel} from "../schemas/TicketHistory.model";
import flightDetailModel from "../schemas/FlightDetail.model";
import flightModel from "../schemas/Flight.model";
import {app} from "../../index"

const userController = {
    showInfo : (req,res,next) => {
        // console.log(req.user+'123');
        const user = req.user;
        // console.log(user+'123');
        // res.json(user);
        res.render('edit-info',{user: user})
    },
    editInfo :async (req,res,next) => {
        // console.log('1')
        const user = req.body;
        let file = req.file
        if (file) {
            let userAvatarPath = "/public/img/avatar/" + file.filename
            user.avatarUrl = userAvatarPath
            await User.findOneAndUpdate({_id:user.id},{avatarUrl:user.avatarUrl,
                firstName:user.firstName,
                lastName:user.lastName,
                username:user.username,
                password:user.password});
        }else{
            await User.findOneAndUpdate({_id:user.id},
                {avatarUrl:user.avatarUrl,
                firstName:user.firstName,
                lastName:user.lastName,
                username:user.username,
                password:user.password});
        }

        // alert('update completed');
        res.redirect('/home/booking');
    },
    displayHistory:async (req, res) => {
        let userID = req.user._id;
            const userHistory = [];
            let bookingCodes = await ticketHistoryModel.distinct("bookingCode",{userID});
            for (const bookingCode of bookingCodes) {
                let flightDetail = (await ticketModel.findOne({bookingCode}))._id;
                let ticketQuantity = await ticketModel.find({bookingCode}).count();
                let flight = await flightDetailModel.findOne({id : flightDetail}, {"flightID" : 1})
                    .populate({
                        path: "flightID",
                        select: ["date", "airline"],
                        populate: [{
                            path: "departure" ,
                            select: ["city", "code"]},
                            {
                                path: "arrival",
                                select: ["city", "code"]
                            }]
                    });
                let flightInfo = flight.flightID;
                let departure = flightInfo["departure"];
                let arrival = flightInfo["arrival"];
                let date = flightInfo["date"];
                let airline = flightInfo["airline"];

                // flightInfo["bookingCode"] = bookingCode;
                const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone : 'Asia/Bangkok'};
                date = date.toLocaleDateString('en-GB', options);

                let infoFlight = {departure, arrival, date, airline, bookingCode, ticketQuantity}
                userHistory.push(infoFlight)
            }
        // return res.json(userHistory)
        // return res.json(user)
        res.render('flight/displayHistoryUser',{userHistory, user: req.user});
    }
};

export default userController