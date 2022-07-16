import express from "express";
const router = express.Router();
import passport from "../middleware/passport";
import {authController} from "../controllers/authController";

router.get('/login', authController.renderLogin);
router.get('/register', authController.renderRegister);

router.post('/register', authController.registerUser)

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/home/booking'
}));


export default router;