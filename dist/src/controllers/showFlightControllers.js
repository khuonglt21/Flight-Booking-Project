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
const FlightDetail_model_1 = __importDefault(require("../schemas/FlightDetail.model"));
class ShowFlightController {
    constructor() {
    }
    async showDetailFlight(req, res, next) {
        const _a = req.query, { from: departureSearch, to: arrivalSearch, class: className, departure: departDate, passengers: totalPassenger, page } = _a, rest = __rest(_a, ["from", "to", "class", "departure", "passengers", "page"]);
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
        let user = req.user;
        let currentPage = page ? +page : 1;
        const perPage = 2;
        let totalItems = searchDetailFlight.length;
        let totalPage = Math.ceil(totalItems / perPage);
        currentPage = currentPage > totalPage ? totalPage : currentPage;
        currentPage = currentPage < 1 ? 1 : currentPage;
        currentPage = isNaN(currentPage) ? 1 : currentPage;
        let prevPage = currentPage - 1;
        let nextPage = currentPage + 1;
        let pageConfig = { prevPage, currentPage, nextPage, totalPage };
        let start = (currentPage - 1) * (perPage);
        let end = start + perPage;
        let resultSearchFlight = searchDetailFlight.slice(start, end);
        res.render('flight', { flightInfo: resultSearchFlight, passengersSearch, user, pageConfig });
    }
    ;
    async showInfoFlight(req, res, next) {
        const passengers = req.params.passengers;
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
        let user = req.user;
        const options = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
        options["timeZone"] = 'Asia/Bangkok';
        let date = fullDetailFlight[0].flightID["date"].toLocaleDateString('en-GB', options);
        res.render('prebooking', {
            flightInfo: fullDetailFlight,
            date: date,
            quantityPassenger: quantityPassenger,
            user
        });
    }
}
exports.default = new ShowFlightController();
//# sourceMappingURL=showFlightControllers.js.map