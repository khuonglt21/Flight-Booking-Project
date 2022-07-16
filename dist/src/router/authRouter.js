"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("../middleware/passport"));
const authController_1 = require("../controllers/authController");
router.get('/login', authController_1.authController.renderLogin);
router.get('/register', authController_1.authController.renderRegister);
router.post('/register', authController_1.authController.registerUser);
router.post('/login', passport_1.default.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/home/booking'
}));
exports.default = router;
//# sourceMappingURL=authRouter.js.map