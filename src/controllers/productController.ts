import airportModel from "../schemas/Airport.model";
import classModel from "../schemas/Class.model";
import flightModel from "../schemas/Flight.model";
import flightDetailModel from "../schemas/FlightDetail.model";
import {app} from "../../index";
import nanoid from "nanoid"; // must using nanoid @2.1.9
import QRCode from "qrcode";

import {ticketModel} from "../schemas/Ticket.model";
import {passengerModel} from "../schemas/Passenger.model";
import {contactModel} from "../schemas/Contact.model";
import {ticketHistoryModel} from "../schemas/TicketHistory.model";

const axios = require('axios').default;


class ProductController {
    constructor() {
    }

    // [GET] /home/booking
    async showHome(req, res, next) {
        // console.log(req.user)
        let user = req.user;
        let airports = await airportModel.find({});
        let classNames = await classModel.find({});
        const url = 'http://api.openweathermap.org/data/2.5/weather?id=1581130&appid=05f149a851779d5c599f4979a1f30bfd';
        const response = await axios.get(url);
        const data = response.data;
        return res.render('booking', {airports, classNames, user})
    }

    // [GET] /home/flight?
    async searchFlight(req, res, next) {
        // console.log(req.query);
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
        // console.log(passengers)
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

    //[GET] home/booking-
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
        let user = req.user

        return res.render("flight/booking-flight", {
            flightInfo: fullDetailFlight,
            date: date,
            quantityPassenger: quantityPassenger,
            passengers,
            flightId,
            user
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

        // check if payment oke

        const paymentStatus = (await ticketModel.findOne({bookingCode}, {isPurchased: 1}) || {}).isPurchased;
        // nếu đã thanh toán thành công thì không cho trở về trang này
        // console.log({paymentStatus})
        if (paymentStatus) {
            return res.redirect(`/home/payment-success?code=${bookingCode}`);
        }


        //

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
        // return res.json(bookingData);

        return res.render("flight/payment2", {
            flightInfo,
            date,
            quantityPassenger,
            passengers,
            flightId,
            totalPayment,
            bookingCode,
            user: req.user
        })
    }

    //[POST] /home/confirm-payment
    async confirmPayment(req, res, next) {
        let allBookingData = app.get("allBookingData") || {};
        let bookingData = allBookingData.bookingData || {};
        let flightDetail = allBookingData.flightDetail || {};
        // console.log(req.params)
        // console.log(bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers)
        if (bookingData.flightId !== req.params.flightId || bookingData.paxQuantity !== req.params.passengers) {
            return next({code: 401, message: "Unauthenzied"})
        }
        const paymentInfo = req.body;
        // function to check payment method

        // random payment true or false
        let paymentResult = Math.random() < 0.5;
        // console.log(paymentResult)
        let {passengers, flightId, bookingCode} = allBookingData.flightDetail;

        if (!paymentResult) {
            return res.render("flight/paymentFailure", {passengers, flightId, user: req.user});
        }
        // if payment sucessfully


        // return res.json(req.user)
        let paxData = bookingData.paxData || {};
        let flightInfo = flightDetail.flightInfo[0] || {};
        let userInfo = req.user || {_id: "62d3d8de48afb485d809212e"};
        let paymentMethod = req.body.paymentMethod || "Card"

        try {
            const listWorks = [];
            // 1: create contact model
            let {
                contactFirstName: firstName,
                contactLastName: lastName,
                contactPhoneNumber: phone,
                contactEmail: email
            } = paxData.contact[0];

            let newContact = new contactModel({
                firstName,
                lastName,
                phone,
                email,
                paymentMethod
            });
            const contact = newContact.save();
            listWorks.push(contact);

            // 2, 3: create passenger and ticket model
            // create adult model
            paxData.adult.forEach((adultInfor, index) => {
                let paxType = "Adult";
                let title = adultInfor[`titleAdult${index}`];
                let firstName = adultInfor[`firstNameAdult${index}`];
                let lastName = adultInfor[`lastNameAdult${index}`];
                let birthDay = adultInfor[`dobAdult${index}`];
                let nationality = adultInfor[`nationalityAdult${index}`];
                // create adult model
                let newAdult = new passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                // create ticket model
                let newTicket = new ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newAdult._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });

                listWorks[`adult${index}`] = newAdult.save();
                listWorks[`ticketAdult${index}`] = newTicket.save();

            });

            // create child model
            paxData.child.forEach((childInfor, index) => {
                let paxType = "Child";
                let title = childInfor[`titleChild${index}`];
                let firstName = childInfor[`firstNameChild${index}`];
                let lastName = childInfor[`lastNameChild${index}`];
                let birthDay = childInfor[`dobChild${index}`];
                let nationality = childInfor[`nationalityChild${index}`];
                // create child model
                let newChild = new passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                // create ticket model
                let newTicket = new ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newChild._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });

                listWorks[`child${index}`] = newChild.save();
                listWorks[`ticketChild${index}`] = newTicket.save();
            });

            // create infant model
            paxData.infant.forEach((infantInfor, index) => {
                let paxType = "Infant";
                let title = infantInfor[`titleInfant${index}`];
                let firstName = infantInfor[`firstNameInfant${index}`];
                let lastName = infantInfor[`lastNameInfant${index}`];
                let birthDay = infantInfor[`dobInfant${index}`];
                let nationality = infantInfor[`nationalityInfant${index}`];
                // Create infant model
                let newInfant = new passengerModel({
                    paxType,
                    title,
                    firstName,
                    lastName,
                    birthDay,
                    nationality
                });
                // create ticket model
                let newTicket = new ticketModel({
                    flightID: flightInfo._id,
                    passengerID: newInfant._id,
                    contactID: newContact._id,
                    isPurchased: paymentResult,
                    bookingCode: flightDetail.bookingCode
                });

                listWorks[`infant${index}`] = newInfant.save();
                listWorks[`ticketInfant${index}`] = newTicket.save();
            });
            // 4: create ticket history model

            let newTicketHistory = new ticketHistoryModel({
                bookingCode: flightDetail.bookingCode,
                userId: userInfo._id
            });
            let ticketHistory = newTicketHistory.save()
            listWorks.push(ticketHistory);

            // 5: Promise all model
            const result = await Promise.all(listWorks);

            if (result[result.length - 1]) {
                console.log("Save sucessfully");


            } else {
                next({code: 500, message: "Save data failure, contact to admin for details!"});
            }

        } catch (err) {
            err.code = 500;
            console.log(err.message);
            return next(err)
        }

        // Render e ticket fo passenger
        // finding all ticket by bookingCode

        // const allTicket = await ticketModel.find({bookingCode : flightDetail.bookingCode}).populate([
        //     {path: "flightID"},
        //     {path: "passengerID"},
        //     {path: "contactID"}
        //    ]);

        // let ticket = await ticketModel.find({bookingCode : flightDetail.bookingCode}).populate([
        //     {path: "passengerID"}
        // ]);
        // return res.json(ticket);


        /*   try {
               let code : String = await flightDetail.bookingCode;

               // Lỗi không lấy được hết thông tin chuyến bay


               let apiUrl = 'http://localhost:3000/home/payment-success?code=' + code;
               // let apiUrl = 'http://localhost:3000/home/payment-success?code=' + "PPJB8KGZ";
               console.log(apiUrl)
               const response = await axios.get(apiUrl);
               const response2 = await axios.get(apiUrl);
               // const response = await axios.get('http://localhost:3000/home/payment-success?code=F6UKRBZ8');
               console.log(response2.data);
               return res.json(response2.data);
           } catch (err) {
               console.log(err.message);
           }*/

        // if payment failure - payment again


        let code: String = await flightDetail.bookingCode;
        await setTimeout(async () => {
            // let ticket = await ticketModel.find({bookingCode: flightDetail.bookingCode}).populate([
            //     {path: "passengerID"}
            // ]);
            // return res.json(ticket);
            return res.redirect(`/home/payment-success?code=${code}`)
        }, 500);

        /*


        return res.send(`<script>
                            setTimeout(()=> {
                                location.href = "/home/payment-success?code=${code}"
                            }, 10)

                        </script>
                        <a href="../../home/payment-success?code=${code}">Show ticket</a>`)
        return res.redirect('/home/payment-success?code=' + code);

        // Show save as pdf
        // Show print button
        // Send e-ticket to email*/
        // return res.render("flight/paymentSuccess", {passengers, flightId, bookingCode});
    }

    async paymentSuccess(req, res, next) {
        const bookingCode = req.query.code;
        let allBookingData = app.get("allBookingData") || {};
        let flightDetail = allBookingData.flightDetail || {};
        let bookingData = allBookingData.bookingData || {};
        let {passengers, flightId, bookingCode : code} = flightDetail;

        // let code: String = await flightDetail.bookingCode;


        if (!code || code !== bookingCode) {
            return next({code: 401, message: "This is not your booking code"})
        }

        try {
            // let ticket = await ticketModel.find({bookingCode}).populate([
            //         {path: "passengerID"}
            //     ])
            // ;
            const allTicket = await ticketModel.find({bookingCode : flightDetail.bookingCode}).populate([
                {path: "passengerID"},
                {path: "contactID"}
               ]);
            // return res.json(allTicket);
            // console.log(ticket)

            let flightInfo = (flightDetail.flightInfo || [])[0] || {};

            let flight = flightInfo.flightID || {};
            let departure = flight.departure || {} ;
            let arrival = flight.arrival || {} ;

            let {flightCode, airline, type, STA, STD,  date} = flight;
            let paxData = bookingData.paxData || {};
            let contact = paxData.contact || {};
            let adult = paxData.adult || {};
            let child = paxData.child || {};
            let infant = paxData.infant || {};



            let qr= await QRCode.toDataURL(bookingCode);
            // console.log(qr);
            let qrSrc = qr;
            let data = {passengers, flightCode, airline, type, STA, STD,
                date, departure, arrival,contact,adult, child, infant, bookingCode ,flightId , qrSrc, user: req.user}
            // return res.json(data)
            return res.render("flight/paymentSuccess",data);
            /*

            let
            * 1. hãng
            1.1 flightCode
            * 2. bookingCdoe
            * 2 Ngày bay
            * 3. STD
            * 4. STA,
            5. departure
            * 6. arrival
            * 7. adult[]
            * 8. child[]
            * 9. infant[]
            * */

            // let











        } catch (e) {
            console.log(e.message)
        }


    }

    // code above here
}

export default new ProductController();