import User from '../schemas/User.model'

export const userController = {
    checkConfirmPassword:async (req, res) => {
        if(req.body.username){
            if (req.body.password === req.body.confirmPassword) {
                const user = new User({
                    username: req.body.username,
                    password: req.body.password,
                    role: req.body.role
                });
                await user.save();
                res.redirect('/auth/login')
            }else{
                let message = 'your password is not match';
                res.render('signup', {message:message})
            }
        }
    }
}