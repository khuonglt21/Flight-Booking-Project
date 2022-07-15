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
    }
}

export default new ShowFlightController()