"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const showFlightControllers_1 = __importDefault(require("../controllers/showFlightControllers"));
const router = express_1.default.Router();
router.get('/booking', (req, res) => {
    res.render('home');
});
router.get('/support', ((req, res) => {
    res.render('demo');
}));
router.get('/list-ticket', async (req, res, next) => {
    const flightInfo = await showFlightControllers_1.default.showDetailFlight(req, res, next);
    res.render('middle', { flightInfo: flightInfo });
});
exports.default = router;
//# sourceMappingURL=productRouter.js.map