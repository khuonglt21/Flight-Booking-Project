import express from "express";
import flightDetailController from "../controllers/showFlightControllers";
const router = express.Router();
import productController from "../controllers/productController";
import errorControllers from "../controllers/errorControllers";

// co the xoa di

import {ticketModel} from "../schemas/Ticket.model";
import {passengerModel} from "../schemas/Passenger.model";
import {contactModel} from "../schemas/Contact.model";
import {ticketHistoryModel} from "../schemas/TicketHistory.model";
//
router.get('/booking', productController.showHome);

router.get('/support',((req, res) => {
    res.render('demo')
}))

router.get('/flight',  flightDetailController.showDetailFlight);

// router.get("/flight",productController.searchFlight);

// [GET] fill passage info

router.get("/booking-flight/:flightId-:passengers", productController.bookingFlight)
//[GET] get prebook detail

router.get('/prebooking/:flightId-:passengers', flightDetailController.showInfoFlight);

// [POST] post payment detail
router.post('/payment', productController.paymentBooking);
//[GET] get payment detail
router.get('/payment/:flightId-:passengers', productController.getPaymentBooking);

//[POST] /home/confirm-payment -confirm payment
router.post('/confirm-payment/:flightId-:passengers', productController.confirmPayment);

router.get("/get", async (req, res, next) => {
    let ticket = await ticketModel.find({bookingCode: "AKYCXAGS"}).populate([
        {path: "passengerID"}
       ]);
    return res.json(ticket)
});

router.get("/payment-success", productController.paymentSuccess)
// router.get("/payment-success", async (req, res, next) =>{
//     const bookingCode = req.query.code;
//     let ticket = await ticketModel.find({bookingCode}).populate([
//         {path: "passengerID"}
//     ]);
//     return res.json(ticket);
// })


export default router
