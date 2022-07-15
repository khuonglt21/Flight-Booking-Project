import express from "express";
import flightDetail from "../controllers/showFlightControllers";
const router = express.Router();


router.get('/booking', (req, res) => {
    res.render('home')
});

router.get('/support',((req, res) => {
    res.render('demo')
}))

router.get('/list-ticket', async(req, res,next) => {
    const flightInfo = await flightDetail.showDetailFlight(req,res,next);
    // console.log(flightInfo);
    res.render('middle',{flightInfo:flightInfo})
})

export default router