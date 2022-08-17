"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Airport_model_1 = __importDefault(require("../schemas/Airport.model"));
const Class_model_1 = __importDefault(require("../schemas/Class.model"));
const FlightDetail_model_1 = __importDefault(require("../schemas/FlightDetail.model"));
const index_1 = require("../../index");
const nanoid_1 = __importDefault(require("nanoid"));
const qrcode_1 = __importDefault(require("qrcode"));
const Ticket_model_1 = require("../schemas/Ticket.model");
const Passenger_model_1 = require("../schemas/Passenger.model");
const Contact_model_1 = require("../schemas/Contact.model");
const TicketHistory_model_1 = require("../schemas/TicketHistory.model");
const axios = require('axios').default;
class ProductController {
    constructor() {
    }
    async showHome(req, res, next) {
        let user = req.user;
        let airports = await Airport_model_1.default.find({});
        let classNames = await Class_model_1.default.find({});
        const url = 'http://api.openweathermap.org/data/2.5/weather?id=1581130&appid=05f149a851779d5c599f4979a1f30bfd';
        const response = await axios.get(url);
        const data = response.data;
        return res.render('booking', { airports, classNames, user });
    }
    async searchFlight(req, res, next) {
        const _a = req.query, { from: departureSearch, to: arrivalSearch, class: className, departure: departDate, passengers: totalPassenger } = _a, rest = __rest(_a, ["from", "to", "class", "departure", "passengers"]);
        let dateSplit = departDate.split("/");
        const passengers = parseInt(totalPassenger[0]) + parseInt(totalPassenger[1]);
        const dateSearch = (new Date(`${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`)).getTime();
        const searchFlight = { remainingSeats: { $gt: passengers } };
        let fullDetailFlight = await FlightDetail_model_1.default.find(searchFlight)
            .populate([
            {
                path: "flightID", select: [], populate: [
                    { path: "departure", match: { code: departureSearch } },
                    { path: "arrival", match: { code: arrivalSearch } }
                ]
            },
            { path: "typeID", match: { class: className }, select: "class" }
        ]);
        let searchDetailFlight = fullDetailFlight.filter(flight => {
            return flight["typeID"]
                && flight.flightID["departure"]
                && flight.flightID["arrival"]
                && (new Date(fullDetailFlight[0].flightID["date"])).getTime() === dateSearch;
        });
        let passengersSearch = totalPassenger.join(".");
        return res.json(searchDetailFlight);
    }
    async bookingFlight(req, res, next) {
        const passengers = req.params.passengers;
        const flightId = req.params.flightId;
        let quantityPassenger = passengers.split('.');
        const searchFlight = { _id: req.params.flightId };
        let fullDetailFlight = await FlightDetail_model_1.default.find(searchFlight)
            .populate([
            {
                path: "flightID", select: [], populate: [
                    { path: "departure" },
                    { path: "arrival" }
                ]
            },
            { path: "typeID", select: "class" }
        ]);
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        options["timeZone"] = 'Asia/Bangkok';
        let date = fullDetailFlight[0].flightID["date"].toLocaleDateString('en-GB', options);
        const bookingCode = (0, nanoid_1.default)(8).toUpperCase();
        const flightDetail = { flightInfo: fullDetailFlight, date, quantityPassenger, passengers, flightId, bookingCode };
        index_1.app.set("flightDetail", flightDetail);
        let user = req.user;
        return res.render("flight/booking-flight", {
            flightInfo: fullDetailFlight,
            date: date,
            quantityPassenger: quantityPassenger,
            passengers,
            flightId,
            user
        });
    }
    async paymentBooking(req, res, next) {
        let bookingData = req.body;
        index_1.app.set("bookingData", req.body);
        return res.json(req.body);
    }
    async getPaymentBooking(req, res, next) {
        let bookingData = index_1.app.get("bookingData") || {};
        if (bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers) {
            return next({ code: 401, message: "Unauthenzied" });
        }
        let flightDetail = index_1.app.get("flightDetail") || {};
        let { flightInfo, date, quantityPassenger, passengers, flightId, bookingCode } = flightDetail;
        const paymentStatus = (await Ticket_model_1.ticketModel.findOne({ bookingCode }, { isPurchased: 1 }) || {}).isPurchased;
        if (paymentStatus) {
            return res.redirect(`/home/payment-success?code=${bookingCode}`);
        }
        let allBookingData = { flightDetail, bookingData, totalPayment: undefined };
        let totalPayment = 0;
        let price = flightInfo[0].price;
        totalPayment += quantityPassenger[0] * price;
        totalPayment += quantityPassenger[1] * (price * 0.9);
        totalPayment += quantityPassenger[1] * 110000;
        allBookingData.totalPayment = totalPayment;
        index_1.app.set("allBookingData", allBookingData);
        return res.render("flight/payment2", {
            flightInfo,
            date,
            quantityPassenger,
            passengers,
            flightId,
            totalPayment,
            bookingCode,
            user: req.user
        });
    }
    async confirmPayment(req, res, next) {
        let allBookingData = index_1.app.get("allBookingData") || {};
        let bookingData = allBookingData.bookingData || {};
        let flightDetail = allBookingData.flightDetail || {};
        if (bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers) {
            return next({ code: 401, message: "Unauthenzied" });
        }
        const paymentInfo = req.body;
        let paymentResult = Math.random() < 0.5;
        let { passengers, flightId, bookingCode } = allBookingData.flightDetail;
        if (!paymentResult) {
            return res.render("flight/paymentFailure", { passengers, flightId, user: req.user });
        }
        let paxData = bookingData.paxData || {};
        let flightInfo = flightDetail.flightInfo[0] || {};
        let userInfo = req.user || { _id: "62d3d8de48afb485d809212e" };
        let paymentMethod = req.body.paymentMethod || "Card";
        try {
            const listWorks = [];
            let { contactFirstName: firstName, contactLastName: lastName, contactPhoneNumber: phone, contactEmail: email } = paxData.contact[0];
            let newContact = new Contact_model_1.contactModel({
                firstName,
                lastName,
                phone,
                email,
                paymentMethod
            });
            const contact = newContact.save();
            listWorks.push(contact);
            paxData.adult.forEach((adultInfor, index) => {
                let paxType = "Adult";
                let title = adultInfor[`titleAdult${index}`];
                let firstName = adultInfor[`firstNameAdult${index}`];
                let lastName = adultInfor[`lastNameAdult${index}`];
                let birthDay = adultInfor[`dobAdult${index}`];
                let nationality = adultInfor[`nationalityAdult${index}`];
                let newAdult = new Passenger_model_1.passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                let newTicket = new Ticket_model_1.ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newAdult._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });
                listWorks[`adult${index}`] = newAdult.save();
                listWorks[`ticketAdult${index}`] = newTicket.save();
            });
            paxData.child.forEach((childInfor, index) => {
                let paxType = "Child";
                let title = childInfor[`titleChild${index}`];
                let firstName = childInfor[`firstNameChild${index}`];
                let lastName = childInfor[`lastNameChild${index}`];
                let birthDay = childInfor[`dobChild${index}`];
                let nationality = childInfor[`nationalityChild${index}`];
                let newChild = new Passenger_model_1.passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                let newTicket = new Ticket_model_1.ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newChild._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });
                listWorks[`child${index}`] = newChild.save();
                listWorks[`ticketChild${index}`] = newTicket.save();
            });
            paxData.infant.forEach((infantInfor, index) => {
                let paxType = "Infant";
                let title = infantInfor[`titleInfant${index}`];
                let firstName = infantInfor[`firstNameInfant${index}`];
                let lastName = infantInfor[`lastNameInfant${index}`];
                let birthDay = infantInfor[`dobInfant${index}`];
                let nationality = infantInfor[`nationalityInfant${index}`];
                let newInfant = new Passenger_model_1.passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                let newTicket = new Ticket_model_1.ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newInfant._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });
                listWorks[`infant${index}`] = newInfant.save();
                listWorks[`ticketInfant${index}`] = newTicket.save();
            });
            let newTicketHistory = new TicketHistory_model_1.ticketHistoryModel({
                bookingCode: flightDetail.bookingCode,
                userId: userInfo._id
            });
            let ticketHistory = newTicketHistory.save();
            listWorks.push(ticketHistory);
            const result = await Promise.all(listWorks);
            if (result[result.length - 1]) {
                console.log("Save sucessfully");
            }
            else {
                next({ code: 500, message: "Save data failure, contact to admin for details!" });
            }
        }
        catch (err) {
            err.code = 500;
            console.log(err.message);
            return next(err);
        }
        let code = await flightDetail.bookingCode;
        await setTimeout(async () => {
            return res.redirect(`/home/payment-success?code=${code}`);
        }, 500);
    }
    async paymentSuccess(req, res, next) {
        const bookingCode = req.query.code;
        let allBookingData = index_1.app.get("allBookingData") || {};
        let flightDetail = allBookingData.flightDetail || {};
        let bookingData = allBookingData.bookingData || {};
        let { passengers, flightId, bookingCode: code } = flightDetail;
        if (!code || code !== bookingCode) {
            return next({ code: 401, message: "This is not your booking code" });
        }
        try {
            const allTicket = await Ticket_model_1.ticketModel.find({ bookingCode: flightDetail.bookingCode }).populate([
                { path: "passengerID" },
                { path: "contactID" }
            ]);
            let flightInfo = (flightDetail.flightInfo || [])[0] || {};
            let flight = flightInfo.flightID || {};
            let departure = flight.departure || {};
            let arrival = flight.arrival || {};
            let { flightCode, airline, type, STA, STD, date } = flight;
            let paxData = bookingData.paxData || {};
            let contact = paxData.contact || {};
            let adult = paxData.adult || {};
            let child = paxData.child || {};
            let infant = paxData.infant || {};
            let qr = await qrcode_1.default.toDataURL(bookingCode);
            let qrSrc = qr;
            let data = { passengers, flightCode, airline, type, STA, STD,
                date, departure, arrival, contact, adult, child, infant, bookingCode, flightId, qrSrc, user: req.user };
            return res.render("flight/paymentSuccess", data);
        }
        catch (e) {
            console.log(e.message);
        }
    }
}
exports.default = new ProductController();
//# sourceMappingURL=productController.js.map