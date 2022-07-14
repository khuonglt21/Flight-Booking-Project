import passport from "passport";
import User from "../schemas/User.model";
import LocalStrategy from "passport-local"

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
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
    }
));

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport;