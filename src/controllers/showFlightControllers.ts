import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";

class ShowFlightController {
    constructor() {
    }

    async showDetailFlight(req, res, next) {
        console.log(req.query);
        // Thực hiện tìm kiếm chuyến bay theo dữ liệu đầu vào
        const {
            from: departureSearch,
            to: arrivalSearch,
            class: className,
            departure: departDate,
            passengers: totalPassenger,
            ...rest
        } = req.query
        let dateSplit = departDate.split("/"); // tách ra để format lại date input từ dạng mm/dd/yyyy về dạng yyyy-mm-dd , để đưa vào new Date() k bị lỗi
        const passengers = parseInt(totalPassenger[0]) + parseInt(totalPassenger[1])
        console.log(passengers)
        const dateSearch = (new Date(`${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`)).getTime();

        const searchFlight = {remainingSeats: {$gt: passengers}}
        let fullDetailFlight = await flightDetailModel.find(searchFlight)
            .populate([
                {
                    path: "flightID", select: [], populate: [
                        {path: "departure", match: {code: departureSearch}},
                        {path: "arrival", match: {code: arrivalSearch}}
                    ]
                },
                {path: "typeID", match: {class: className}, select: "class"}
            ])

        let searchDetailFlight = fullDetailFlight.filter(flight => {
            return flight["typeID"]
                && flight.flightID["departure"]
                && flight.flightID["arrival"]
                && (new Date(fullDetailFlight[0].flightID["date"])).getTime() === dateSearch;
        });

        // Kết quả sau khi tìm kiếm

        let passengersSearch = totalPassenger.join("."); // tạo định dạng cho
        //


        console.log(passengersSearch)

        // return res.json(searchDetailFlight);
        res.render('middle', {flightInfo: searchDetailFlight, passengersSearch})
    };

    async showInfoFlight(req, res, next) {
        // console.log(req.params)
        const passengers = req.params.passengers;
        let quantityPassenger = passengers.split('.');
        // console.log(quantityPassenger);
        const searchFlight = {_id: req.params.flightId}
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
        res.render('list-tickets', {flightInfo: fullDetailFlight, date: date, quantityPassenger: quantityPassenger});
    }
}

export default new ShowFlightController()