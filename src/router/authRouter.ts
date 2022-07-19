import express from "express";

const router = express.Router();
import passport from "../middleware/passport";
import {authController} from "../controllers/authController";
import multer from "multer"
import {app} from '../../index';

// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/img/avatar')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})


router.get('/login', authController.renderLogin);
router.get('/register', authController.renderRegister);
router.get('/loginGoogle', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get(
    "/google/callback",
    passport.authenticate('google'),
    (req, res) => {
        res.redirect("/admin/list-users")
    }
)
router.post('/register', upload.single('avatar'), authController.registerUser);

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login'/*,
    successRedirect: '/admin/list-users'*/
}), (req, res, next) => {
    let prevUrl = app.get("prevUrl");
    if(req.user["isBanned"]) {
        return next({code: 403, message: "Your account has been banned!"})
    }
    if(req.user["role"] === "admin") {
        prevUrl = "/admin/list-users"
    }
    return res.redirect(prevUrl)
});


export default router;