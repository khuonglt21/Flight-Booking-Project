import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";

class ShowFlightController {
    constructor() {
    }

    async showDetailFlight(req, res, next) {

        /*const searchFlight = {
            flightID: {
                departure: {code: "HAN"},
                arrival: {code: "HAN"},
                date: "2022-07-14T00:00:00.000Z",
            },
            typeID: {
                class: "economy"
            }
        }*/
        const searchFlight = {}
        // const searchFlight = {'flightID.departure.code' : {$regex: "HAN", $options: "gim"}}
        // const searchFlight = {luggage : 10}

        let fullDetailFlight = await flightDetailModel.find(searchFlight)
            .populate([
                {
                    path: "flightID", select: [], populate: [
                        {path: "departure"},
                        {path: "arrival"}
                    ]
                },
                {path: "typeID", select: "class"}
            ])
        // console.log(fullDetailFlight[0].flightID["departure"]["code"])
        return (fullDetailFlight)
    };

    async showInfoFlight(req, res, next) {
       console.log(req.params)
        const passengers = req.params.passengers;
       let quantityPassenger = passengers.split('.');
        console.log(quantityPassenger);
        const searchFlight = {_id:req.params.flightId}
        let fullDetailFlight = await flightDetailModel.find(searchFlight)
            .populate([
                {
                    path: "flightID", select: [], populate: [
                        {path: "departure"},
                        {path: "arrival"}
                    ]
                },
                {path: "typeID", select: "class"}
            ])

        const options = {weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'};
        options["timeZone"] = 'Asia/Bangkok';
        let date = fullDetailFlight[0].flightID["date"].toLocaleDateString('en-GB', options);
        res.render('list-tickets', {flightInfo: fullDetailFlight, date: date,quantityPassenger: quantityPassenger});
    }
}

export default new ShowFlightController()