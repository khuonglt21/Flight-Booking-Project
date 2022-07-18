"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const User_model_1 = __importDefault(require("../schemas/User.model"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
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
passport_1.default.use(new passport_google_oauth20_1.default({
    clientID: "974260312324-a8iuqjb0bcdjbak79bgblp1tf9pli5ar.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3000/auth/google/callback",
    passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        console.log(profile, 'profile');
        let existingUser = await User_model_1.default.findOne({ 'google.id': profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = new User_model_1.default({
            google: {
                id: profile.id,
            },
            username: profile.emails[0].value,
            password: '1',
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
        });
        await newUser.save();
        return done(null, newUser);
    }
    catch (error) {
        return done(null, false);
    }
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