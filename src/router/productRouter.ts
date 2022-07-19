import express from "express";
import flightDetailController from "../controllers/showFlightControllers";
const router = express.Router();
import productController from "../controllers/productController";
import errorControllers from "../controllers/errorControllers";
import auth from "../middleware/auth";


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

router.get("/booking-flight/:flightId-:passengers",auth.checkAuth, productController.bookingFlight)
//[GET] get prebook detail

router.get('/prebooking/:flightId-:passengers', flightDetailController.showInfoFlight);

// [POST] post payment detail
router.post('/payment',auth.checkAuth, productController.paymentBooking);
//[GET] get payment detail
router.get('/payment/:flightId-:passengers',auth.checkAuth, productController.getPaymentBooking);

//[POST] /home/confirm-payment -confirm payment
router.post('/confirm-payment/:flightId-:passengers',auth.checkAuth, productController.confirmPayment);

//[GET] /home/payment-success
router.get("/payment-success",auth.checkAuth, productController.paymentSuccess);

export default router
