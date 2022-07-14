import express from "express";
const router = express.Router();
import passport from "../middleware/passport";
import {userController} from "../controllers/userController";

router.get('/login', ((req, res, next) => {
    res.render('login')
}));
router.get('/register', ((req, res, next) => {
    let message = ''
    res.render('signup',{message: message})
}));

router.post('/register', async(req, res, next) => {
    console.log(req.body);
   await userController.checkConfirmPassword(req,res);
})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/auth/login',
    successRedirect: '/home/booking'
}));


export default router;