export const admin ={
    checkAdmin:function (req,res,next) {
        // console.log(req.user);
        if(req.user.role == 'admin'){
            next()
        }else{
            res.redirect('/home/booking')
        }
    }
}