"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const passport_1 = __importDefault(require("../middleware/passport"));
const authController_1 = require("../controllers/authController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/avatar');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
router.get('/login', authController_1.authController.renderLogin);
router.get('/register', authController_1.authController.renderRegister);
router.get('/loginGoogle', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback", passport_1.default.authenticate('google'), (req, res) => {
    res.redirect("/admin/list-users");
});
router.post('/register', upload.single('avatar'), authController_1.authController.registerUser);
router.post('/login', passport_1.default.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/admin/list-users'
}));
exports.default = router;
//# sourceMappingURL=authRouter.js.map