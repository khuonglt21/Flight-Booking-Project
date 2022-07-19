const errorControllers ={
    errorRender: function (error,req, res,next) {
        let {code, message} = error;
        if(!code) {
           code = 404;
           message = "Your request not found"
        }
        res.render('error', {code, message})
    }
}

export default errorControllers