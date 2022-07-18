import User from '../schemas/User.model'


export const authController = {
    registerUser:async (req, res,next) => {
        // console.log(req.body);
        console.log('1')
       // return  res.json(req.file);
        let file = req.file

        // console.log(userAvatarPath)
        if(req.body.username){
            if (req.body.password === req.body.confirmPassword) {
                const user = new User({
                    username: req.body.username,
                    password: req.body.password,
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
            }else{
                let message = 'your password is not correct'
                res.render('signup',{message: message})
            }
        }
    },
    renderLogin: async(req,res,next) =>{
        res.render('login')
    },
    renderRegister: async(req,res,next) =>{
        let message ='';
        res.render('signup',{message:message})
    },

}