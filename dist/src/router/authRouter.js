"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("../middleware/passport"));
const userController_1 = require("../controllers/userController");
router.get('/login', ((req, res, next) => {
    res.render('login');
}));
router.get('/register', ((req, res, next) => {
    let message = '';
    res.render('signup', { message: message });
}));
router.post('/register', async (req, res, next) => {
    console.log(req.body);
    await userController_1.userController.checkConfirmPassword(req, res);
});
router.post('/login', passport_1.default.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/home/booking'
}));
exports.default = router;
//# sourceMappingURL=authRouter.js.map