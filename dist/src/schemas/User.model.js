"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    role: String,
    google: { id: { type: String } }
});
const user = (0, mongoose_1.model)('user', userSchema);
exports.default = user;
//# sourceMappingURL=User.model.js.map