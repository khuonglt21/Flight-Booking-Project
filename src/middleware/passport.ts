import passport from "passport";
import User from "../schemas/User.model";
import LocalStrategy from "passport-local";
import GoogleStrategy from 'passport-google-oauth20';
import bcrypt from 'bcrypt';

passport.use(new LocalStrategy(
   function (username, password, done) {
        User.findOne({username: username}, function (err, user) {
            bcrypt.compare(password, user?.password, function(err, result) {

                if (err) {
                    return done({code: 400, message: err.message});
                }
                if (!user) {
                    return done(null, false);
                }
                if (result) {
                    return done(null, user);
                }
                return done(null, false);

            });
        });
    }
));

//Google login
passport.use(new GoogleStrategy({
        clientID: "974260312324-a8iuqjb0bcdjbak79bgblp1tf9pli5ar.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/auth/google/callback",
        passReqToCallback: true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile, 'profile')
            let existingUser = await User.findOne({ 'google.id': profile.id });
            // if user exists return the user
            // console.log(existingUser);
            if (existingUser) {
                return done(null, existingUser);
            }
            // if user does not exist create a new user
            // console.log('Creating new user...');
            const newUser = new User({
                google: {
                    id: profile.id,
                },
                username: profile.emails[0].value,
                password: '1',
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email:profile.emails[0].value
            });
            await newUser.save();
            // console.log(newUser, 'newUser')
            return done(null, newUser);
        } catch (error) {
            return done(null, false)
        }
    }
));

// After login , create session and cookie
passport.serializeUser((user, done) => {
    // user là biến hứng được từ bên passport.use Stragery ở trên
    done(null, user["_id"])
});

// Tại các lần truy cập lần sau, passport sẽ kiểm tra xem trong session có lưu giá trị đã cài ở trên không, nếu có thì xác minh là đã đăng nhập thành công

passport.deserializeUser(async (userID, done) => {
    const user = await User.findOne({_id: userID});
    // console.log(user,'userID'+ userID);
    if (user) {
        // Nếu tìm ra được user thì gắn nó vào trong req.user
        done(null, user);
    } else {
        console.log("User not found!")
    }
})

export default passport;