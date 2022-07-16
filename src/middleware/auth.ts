const auth ={
    checkAuth: function(req, res,next) {
        // console.log(req.user);
        if(req.isAuthenticated){
            next()
        }else{
            res.redirect('/auth/login')
        }
    }
}

export default auth