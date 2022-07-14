"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_model_1 = __importDefault(require("../schemas/User.model"));
const router = express_1.default.Router();
router.get('/list-users', async (req, res) => {
    const users = await User_model_1.default.find();
    console.log(users);
});
exports.default = router;
//# sourceMappingURL=adminRouter.js.map