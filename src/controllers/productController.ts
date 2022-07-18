import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";

class ProductController {
    constructor() {
    }

    // [GET] /home/booking
    async showHome(req, res, next) {
        console.log(req.user)
        let user = req.user;
        let airports = await airportModel.find({});
        let classNames = await classModel.find({});
        return res.render('home', {airports, classNames, user})
    }

    // [GET] /home/flight?
    async searchFlight(req, res, next) {
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

        return res.json(searchDetailFlight);


    }

    async bookingFlight(req, res, next) {
        // return res.json("hello")
        return res.render("flight/passenger")


    }

    // code above here
}

export default new ProductController();