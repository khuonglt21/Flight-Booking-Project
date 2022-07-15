import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";


class CreateFlightController {
    constructor() {
    }

    async createClass(req, res, next) {
        const classNames = ["economy", "business"]
        try {
            for (let i = 0; i < classNames.length; i++) {
                await classModel.create({class: classNames[i]});
            }
            res.json({message: "Create class successfully"})

        } catch (err) {
            console.log(err.message);
            return res.json({err: err.message})
        }
    }

    // create city
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
        ]
        try {
            for (let i = 0; i < cityNames.length; i++) {
                await airportModel.create(cityNames[i]);
            }
            res.json({message: "Create airports successfully"})

        } catch (err) {
            console.log(err.message);
            return res.json({err: err.message})
        }
    }

    // [POST] /flight/create-flight
    // create Flight
    async createFlight(req, res, next) {

        try {
            await flightModel.create(req.body);
            return res.json(await flightModel.find({}));
        } catch (err) {
            return res.json({err: err.message})
        }


    }

    //[GET] show form create flights

    async showCreateFlight(req, res, next) {
        try {
            const airports = await airportModel.find({}) || [];
            console.log(airports)

            return res.render("flight/create", {airports})


        } catch (err) {
            return res.json({err: err.message})

        }
    }

    //[GET] /flight/create-detail
    async showCreateDetail(req, res, next) {
        try {
            const flights = await flightModel.find({}) || [];
            const classNames = await classModel.find({}) || [];
            // return res.json([flights,classNames])
            // console.log({flights,classNames})

            return res.render("flight/detail", {flights, classNames})
        } catch (e) {
            return res.json(
                {err: e.message}
            )
        }

    }

    // [POST] /flight/create-detail

    async createDetailFlight(req, res, next) {
        try {
            // return res.json(req.body)

            await flightDetailModel.create(req.body);
            return res.json({message: "createDetailFlight successfully"});


        } catch (e) {
            return res.json(
                {err: e.message}
            )
        }

    }

    // [GET] /detial-flihght
    async showDetailFlight(req, res, next) {

        const departureSearch = "HAN";
        const arrivalSearch = "SGN";
        const passengers = parseInt("3");
        const dateSearch = (new Date("2022-07-19")).getTime();

        const searchFlight = {remainingSeats: {$gt: passengers}}

        let fullDetailFlight = await flightDetailModel.find(searchFlight)
            .populate([
                {
                    path: "flightID", select: [], populate: [
                        {path: "departure", match: {code: departureSearch}},
                        {path: "arrival", match: {code: arrivalSearch}}
                    ]
                },
                {path: "typeID", match: {class: "economy"}, select: "class"}
            ])

        let searchDetailFlight = fullDetailFlight.filter(flight => {
            return flight["typeID"]
                && flight.flightID["departure"]
                && flight.flightID["arrival"]
                && (new Date(fullDetailFlight[0].flightID["date"])).getTime() === dateSearch;
        })
        return res.json(searchDetailFlight);

    }


    // code above here
}

export default new CreateFlightController()