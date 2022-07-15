const errorControllers ={
    errorRender: function (error,req, res,next) {
        res.render('error')
    }
}

export default errorControllers