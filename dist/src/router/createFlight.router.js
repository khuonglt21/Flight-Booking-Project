"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const createFlight_controller_1 = __importDefault(require("../controllers/createFlight.controller"));
exports.default = router;
router.get('/', (req, res, next) => {
    return res.json({ message: "go to create" });
});
router.get('/create-flight', createFlight_controller_1.default.showCreateFlight);
router.post('/create-flight', createFlight_controller_1.default.createFlight);
router.get('/create-class', createFlight_controller_1.default.createClass);
router.get('/create-airport', createFlight_controller_1.default.createCity);
router.get('/create-detail', createFlight_controller_1.default.showCreateDetail);
router.post('/create-detail', createFlight_controller_1.default.createDetailFlight);
router.get('/detail-flight', createFlight_controller_1.default.showDetailFlight);
router.get('/prebooking/:flightID-:passengers', (req, res, next) => {
});
//# sourceMappingURL=createFlight.router.js.map