"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_model_1 = __importDefault(require("../schemas/User.model"));
const userController = {
    showInfo: (req, res, next) => {
        const user = req.user;
        res.render('edit-info', { user: user });
    },
    editInfo: async (req, res, next) => {
        console.log('1');
        const user = req.body;
        let file = req.file;
        if (file) {
            let userAvatarPath = "/public/img/avatar/" + file.filename;
            user.avatarUrl = userAvatarPath;
            await User_model_1.default.findOneAndUpdate({ _id: user.id }, { avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password });
        }
        else {
            await User_model_1.default.findOneAndUpdate({ _id: user.id }, { avatarUrl: user.avatarUrl,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                password: user.password });
        }
        res.redirect('/home/booking');
    }
};
exports.default = userController;
//# sourceMappingURL=userController.js.map