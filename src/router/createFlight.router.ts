import express from 'express';

const router = express.Router();
import CreateFlightController from "../controllers/createFlight.controller"

export default router;


router.get('/', (req, res, next) => {
    return res.json({message: "go to create"})
})

router.get('/create-flight', CreateFlightController.showCreateFlight);
router.post('/create-flight', CreateFlightController.createFlight);

router.get('/create-class', CreateFlightController.createClass);
router.get('/create-airport', CreateFlightController.createCity);

router.get('/create-detail', CreateFlightController.showCreateDetail);
router.post('/create-detail', CreateFlightController.createDetailFlight);

router.get('/detail-flight', CreateFlightController.showDetailFlight);
