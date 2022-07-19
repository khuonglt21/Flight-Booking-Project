"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showFlightControllers_1 = __importDefault(require("../controllers/showFlightControllers"));
const router = express_1.default.Router();
const productController_1 = __importDefault(require("../controllers/productController"));
const Ticket_model_1 = require("../schemas/Ticket.model");
router.get('/booking', productController_1.default.showHome);
router.get('/support', ((req, res) => {
    res.render('demo');
}));
router.get('/flight', showFlightControllers_1.default.showDetailFlight);
router.get("/booking-flight/:flightId-:passengers", productController_1.default.bookingFlight);
router.get('/prebooking/:flightId-:passengers', showFlightControllers_1.default.showInfoFlight);
router.post('/payment', productController_1.default.paymentBooking);
router.get('/payment/:flightId-:passengers', productController_1.default.getPaymentBooking);
router.post('/confirm-payment/:flightId-:passengers', productController_1.default.confirmPayment);
router.get("/get", async (req, res, next) => {
    let ticket = await Ticket_model_1.ticketModel.find({ bookingCode: "AKYCXAGS" }).populate([
        { path: "passengerID" }
    ]);
    return res.json(ticket);
});
router.get("/payment-success", productController_1.default.paymentSuccess);
exports.default = router;
//# sourceMappingURL=productRouter.js.map