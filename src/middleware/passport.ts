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