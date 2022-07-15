import express from "express";
import flightDetail from "../controllers/showFlightControllers";
const router = express.Router();
import productController from "../controllers/productController";


router.get('/booking', productController.showHome);

router.get('/support',((req, res) => {
    res.render('demo')
}))

router.get('/list-ticket', async(req, res,next) => {
    const flightInfo = await flightDetail.showDetailFlight(req,res,next);
    // console.log(flightInfo);
    res.render('middle',{flightInfo:flightInfo})
});

router.get("/flight",productController.searchFlight);

// [GET] fill passage info
router.get("/booking-flight", productController.bookingFlight)

router.get('/prebooking/:flightId-:passengers', flightDetail.showInfoFlight);
export default router