import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";
import {app} from "../../index";
import nanoid from "nanoid"; // must using nanoid @2.1.9
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
        return res.json(searchDetailFlight);

    }

    async bookingFlight(req, res, next) {
        const passengers = req.params.passengers;
        const flightId = req.params.flightId;
        let quantityPassenger = passengers.split('.');
        const searchFlight = {_id: req.params.flightId}

        // find info of flight
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


        // res.render('list-tickets', {flightInfo: fullDetailFlight, date: date, quantityPassenger: quantityPassenger});



        const bookingCode = nanoid(8).toUpperCase();
        const flightDetail = {flightInfo: fullDetailFlight, date, quantityPassenger, passengers, flightId, bookingCode};
        app.set("flightDetail", flightDetail);


        return res.render("flight/passenger", {
            flightInfo: fullDetailFlight,
            date: date,
            quantityPassenger: quantityPassenger,
            passengers,
            flightId
        })


    }

    //[POST] home/payment
    async paymentBooking(req, res, next) {
        let bookingData = req.body;


        app.set("bookingData", req.body)
        return res.json(req.body);
    }

    //[GET] home/payment/:id-:pax
    async getPaymentBooking(req, res, next) {
        let bookingData = app.get("bookingData") || {};
        if (bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers) {
            return next({code: 401, message: "Unauthenzied"})
        }
        let flightDetail = app.get("flightDetail") || {};
        let {flightInfo, date, quantityPassenger, passengers, flightId, bookingCode} = flightDetail;

        //create booking code


        let allBookingData = {flightDetail, bookingData, totalPayment: undefined};


        let totalPayment = 0;
        let price = flightInfo[0].price;

        totalPayment += quantityPassenger[0] * price; // for adult
        totalPayment += quantityPassenger[1] * (price * 0.9); // for child
        totalPayment += quantityPassenger[1] * 110000; // for infant

        allBookingData.totalPayment = totalPayment;
        // save allBokingData
        app.set("allBookingData", allBookingData);

        return res.render("flight/payment2", {
            flightInfo,
            date,
            quantityPassenger,
            passengers,
            flightId,
            totalPayment,
            bookingCode
        })
        return res.json(bookingData);
    }

    //[POST] /home/confirm-payment
    async confirmPayment(req, res, next) {
        let allBookingData = app.get("allBookingData") || {};
        let bookingData = allBookingData.bookingData || {};
        // console.log(req.params)
        // console.log(bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers)
        if (bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers) {
            return next({code: 401, message: "Unauthenzied"})
        }
        const paymentInfo = req.body;
        // function to check payment method

        // random payment true or false
        let paymentResult = Math.random() < 0.5;
        console.log(paymentResult)

        let {passengers, flightId, bookingCode} = allBookingData.flightDetail;
        // if payment failure - payment again
     /*   if (!paymentResult) {
            return res.render("flight/paymentFailure", {passengers, flightId});
        }*/
        // if payment sucessfull

        












        return res.render("flight/paymentSuccess", {passengers, flightId, bookingCode});
    }

    // code above here
}

export default new ProductController();