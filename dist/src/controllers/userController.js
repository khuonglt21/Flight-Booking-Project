"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const User_model_1 = __importDefault(require("../schemas/User.model"));
exports.userController = {
    checkConfirmPassword: async (req, res) => {
        if (req.body.username) {
            if (req.body.password === req.body.confirmPassword) {
                const user = new User_model_1.default({
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role
                });
                await user.save();
                res.redirect('/auth/login');
            }
            else {
                let message = 'your password is not match';
                res.render('signup', { message: message });
            }
        }
    }
};
//# sourceMappingURL=userController.js.map