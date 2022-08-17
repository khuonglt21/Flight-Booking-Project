"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const User_model_1 = __importDefault(require("../schemas/User.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const saltRounds = 10;
const index_1 = require("../../index");
exports.authController = {
    registerUser: async (req, res, next) => {
        let file = req.file;
        let encryptedPassword = '';
        if (req.body.username) {
            if (req.body.password === req.body.confirmPassword) {
                bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
                    bcrypt_1.default.hash(req.body.password, salt, async function (err, hash) {
                        if (err) {
                            console.log(err.message);
                        }
                        else {
                            encryptedPassword = hash;
                            const user = new User_model_1.default({
                                username: req.body.username,
                                password: encryptedPassword,
                                role: req.body.role,
                                isBanned: req.body.isBanned,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email
                            });
                            if (file) {
                                let userAvatarPath = "/public/img/avatar/" + file.filename;
                                user.avatarUrl = userAvatarPath;
                            }
                            await user.save();
                            res.redirect('/auth/login');
                        }
                    });
                });
            }
            else {
                let message = 'your password is not correct';
                res.render('signup', { message: message });
            }
        }
    },
    renderLogin: async (req, res, next) => {
        const prevUrl = req.headers.referer || "/home/booking";
        index_1.app.set("prevUrl", prevUrl);
        res.render('login');
    },
    renderRegister: async (req, res, next) => {
        let message = '';
        res.render('signup', { message: message });
    },
};
//# sourceMappingURL=authController.js.map