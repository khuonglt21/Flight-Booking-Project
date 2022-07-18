"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const User_model_1 = __importDefault(require("../schemas/User.model"));
exports.adminController = {
    renderListUser: async (req, res, next) => {
        const users = await User_model_1.default.find();
        let admin = req.user.username;
        res.render('list-user', { users: users, admin: admin });
    },
    bannedUser: async (req, res, next) => {
        console.log(req.query);
        let userId = Object.keys(req.query);
        console.log(userId[0]);
        const user = await User_model_1.default.findById(userId[0]);
        if (user.isBanned) {
            let isBanned = false;
            await User_model_1.default.updateOne({ _id: userId }, { isBanned: isBanned });
        }
        else {
            let isBanned = true;
            await User_model_1.default.updateOne({ _id: userId }, { isBanned: isBanned });
        }
        res.redirect('/admin/list-users');
    }
};
//# sourceMappingURL=adminController.js.map