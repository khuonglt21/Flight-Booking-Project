"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../schemas/User.model"));
const Ticket_model_1 = require("../schemas/Ticket.model");
const TicketHistory_model_1 = require("../schemas/TicketHistory.model");
const FlightDetail_model_1 = __importDefault(require("../schemas/FlightDetail.model"));
const userController = {
    showInfo: (req, res, next) => {
        const user = req.user;
        res.render('edit-info', { user: user });
    },
    editInfo: async (req, res, next) => {
        const user = req.body;
        let file = req.file;
        if (file) {
            let userAvatarPath = "/public/img/avatar/" + file.filename;
            user.avatarUrl = userAvatarPath;
            await User_model_1.default.findOneAndUpdate({ _id: user.id }, { avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password });
        }
        else {
            await User_model_1.default.findOneAndUpdate({ _id: user.id }, { avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password });
        }
        res.redirect('/home/booking');
    },
    displayHistory: async (req, res) => {
        let userID = req.user._id;
        const userHistory = [];
        let bookingCodes = await TicketHistory_model_1.ticketHistoryModel.distinct("bookingCode", { userID });
        for (const bookingCode of bookingCodes) {
            let flightDetail = (await Ticket_model_1.ticketModel.findOne({ bookingCode }))._id;
            let ticketQuantity = await Ticket_model_1.ticketModel.find({ bookingCode }).count();
            let flight = await FlightDetail_model_1.default.findOne({ id: flightDetail }, { "flightID": 1 })
                .populate({
                path: "flightID",
                select: ["date", "airline"],
                populate: [{
                        path: "departure",
                        select: ["city", "code"]
                    },
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
            const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Bangkok' };
            date = date.toLocaleDateString('en-GB', options);
            let infoFlight = { departure, arrival, date, airline, bookingCode, ticketQuantity };
            userHistory.push(infoFlight);
        }
        res.render('flight/displayHistoryUser', { userHistory, user: req.user });
    }
};
exports.default = userController;
//# sourceMappingURL=userController.js.map