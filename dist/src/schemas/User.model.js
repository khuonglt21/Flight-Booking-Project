"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' },
    google: { id: { type: String } },
    isBanned: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    avatarUrl: { type: String, default: '/public/img/avatar/avatar-default.png' }
});
const user = (0, mongoose_1.model)('user', userSchema);
exports.default = user;
//# sourceMappingURL=User.model.js.map