"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Airport_model_1 = __importDefault(require("../schemas/Airport.model"));
const Class_model_1 = __importDefault(require("../schemas/Class.model"));
const Flight_model_1 = __importDefault(require("../schemas/Flight.model"));
const FlightDetail_model_1 = __importDefault(require("../schemas/FlightDetail.model"));
class CreateFlightController {
    constructor() {
    }
    async createClass(req, res, next) {
        const classNames = ["economy", "business"];
        try {
            for (let i = 0; i < classNames.length; i++) {
                await Class_model_1.default.create({ class: classNames[i] });
            }
            res.json({ message: "Create class successfully" });
        }
        catch (err) {
            console.log(err.message);
            return res.json({ err: err.message });
        }
    }
    async createCity(req, res, next) {
        const cityNames = [
            {
                name: "Nội Bài",
                city: "Hà Nội",
                code: "HAN"
            },
            {
                name: "Tân Sơn Nhất",
                city: "TP HCM",
                code: "SGN"
            },
            {
                name: "Đà Nẵng",
                city: "Đà Nẵng",
                code: "DAD"
            },
            {
                name: "Phú Quốc",
                city: "Phú Quốc",
                code: "PQC"
            },
            {
                name: "Cam Ranh",
                city: "Nha Trang",
                code: "CXR"
            },
        ];
        try {
            for (let i = 0; i < cityNames.length; i++) {
                await Airport_model_1.default.create(cityNames[i]);
            }
            res.json({ message: "Create airports successfully" });
        }
        catch (err) {
            console.log(err.message);
            return res.json({ err: err.message });
        }
    }
    async createFlight(req, res, next) {
        try {
            await Flight_model_1.default.create(req.body);
            return res.json(await Flight_model_1.default.find({}));
        }
        catch (err) {
            return res.json({ err: err.message });
        }
    }
    async showCreateFlight(req, res, next) {
        try {
            const airports = await Airport_model_1.default.find({}) || [];
            console.log(airports);
            return res.render("flight/create", { airports });
        }
        catch (err) {
            return res.json({ err: err.message });
        }
    }
    async showCreateDetail(req, res, next) {
        try {
            const flights = await Flight_model_1.default.find({}) || [];
            const classNames = await Class_model_1.default.find({}) || [];
            return res.render("flight/detail", { flights, classNames });
        }
        catch (e) {
            return res.json({ err: e.message });
        }
    }
    async createDetailFlight(req, res, next) {
        try {
            await FlightDetail_model_1.default.create(req.body);
            return res.json({ message: "createDetailFlight successfully" });
        }
        catch (e) {
            return res.json({ err: e.message });
        }
    }
    async showDetailFlight(req, res, next) {
        const departureSearch = "HAN";
        const arrivalSearch = "SGN";
        const passengers = parseInt("3");
        const dateSearch = (new Date("2022-07-19")).getTime();
        const searchFlight = { remainingSeats: { $gt: passengers } };
        let fullDetailFlight = await FlightDetail_model_1.default.find(searchFlight)
            .populate([
            {
                path: "flightID", select: [], populate: [
                    { path: "departure", match: { code: departureSearch } },
                    { path: "arrival", match: { code: arrivalSearch } }
                ]
            },
            { path: "typeID", match: { class: "economy" }, select: "class" }
        ]);
        let searchDetailFlight = fullDetailFlight.filter(flight => {
            return flight["typeID"]
                && flight.flightID["departure"]
                && flight.flightID["arrival"]
                && (new Date(fullDetailFlight[0].flightID["date"])).getTime() === dateSearch;
        });
        return res.json(searchDetailFlight);
    }
}
exports.default = new CreateFlightController();
//# sourceMappingURL=createFlight.controller.js.map