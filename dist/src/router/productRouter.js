"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/booking', (req, res) => {
    res.render('home');
});
router.get('/support', ((req, res) => {
    res.render('demo');
}));
exports.default = router;
//# sourceMappingURL=productRouter.js.map