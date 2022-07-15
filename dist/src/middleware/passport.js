"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const User_model_1 = __importDefault(require("../schemas/User.model"));
const passport_local_1 = __importDefault(require("passport-local"));
passport_1.default.use(new passport_local_1.default(function (username, password, done) {
    User_model_1.default.findOne({ username: username }, function (err, user) {
        console.log(user);
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (user.password != password) {
            return done(null, false);
        }
        return done(null, user);
    });
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user["_id"]);
});
passport_1.default.deserializeUser(async (userID, done) => {
    const user = await User_model_1.default.findOne({ _id: userID });
    if (user) {
        done(null, user);
    }
    else {
        console.log("User not found!");
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map