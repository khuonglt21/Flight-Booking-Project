const auth ={
    checkAuth: function(req, res,next) {
        if(req.isAuthenticated()){
            if(req.user.isBanned) {
                return next({code: 403, message: "You account has been banned"});
            }
            next()
        }else{
            res.redirect('/auth/login')
        }
    }
}

export default auth