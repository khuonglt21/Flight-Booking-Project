import express from "express";
import flightDetailController from "../controllers/showFlightControllers";
const router = express.Router();
import productController from "../controllers/productController";


router.get('/booking', productController.showHome);

router.get('/support',((req, res) => {
    res.render('demo')
}))

router.get('/flight',  flightDetailController.showDetailFlight);

// router.get("/flight",productController.searchFlight);

// [GET] fill passage info
router.get("/booking-flight", productController.bookingFlight)

router.get('/prebooking/:flightId-:passengers', flightDetailController.showInfoFlight);
export default router