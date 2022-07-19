import User from '../schemas/User.model'
import bcrypt from 'bcrypt';
const saltRounds = 10;
import {app} from '../../index';

export const authController = {
    registerUser:async (req, res,next) => {
        let file = req.file;
        let encryptedPassword= '';
        // console.log(userAvatarPath)
        if(req.body.username){
            if (req.body.password === req.body.confirmPassword) {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.password, salt, async function(err, hash) {
                        if(err){
                            console.log(err.message);
                        }else{
                            encryptedPassword = hash;
                            const user = new User({
                                username: req.body.username,
                                password: encryptedPassword,
                                role: req.body.role,
                                isBanned: req.body.isBanned,
                                firstName: req.body.firstName,
                                lastName: req.body.lastName,
                                email: req.body.email
                            });
                            if (file) {
                                let userAvatarPath = "/public/img/avatar/" + file.filename
                                user.avatarUrl = userAvatarPath
                            }
                            await user.save();
                            res.redirect('/auth/login')
                        }
                    });
                });

            }else{
                let message = 'your password is not correct'
                res.render('signup',{message: message})
            }
        }
    },
    renderLogin: async(req,res,next) =>{
        const prevUrl = req.headers.referer || "/home/booking"
        // console.log(prevUrl)
        app.set("prevUrl",prevUrl);
        res.render('login')
    },
    renderRegister: async(req,res,next) =>{
        let message ='';
        res.render('signup',{message:message})
    },

}