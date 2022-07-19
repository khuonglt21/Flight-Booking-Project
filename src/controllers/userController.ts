import User from '../schemas/User.model'

const userController = {
    showInfo : (req,res,next) => {
        // console.log(req.user+'123');
        const user = req.user;
        // console.log(user+'123');
        // res.json(user);
        res.render('edit-info',{user: user})
    },
    editInfo :async (req,res,next) => {
        console.log('1')
        const user = req.body;
        let file = req.file
        if (file) {
            let userAvatarPath = "/public/img/avatar/" + file.filename
            user.avatarUrl = userAvatarPath
            await User.findOneAndUpdate({_id:user.id},{avatarUrl:user.avatarUrl,
                firstName:user.firstName,
                lastName:user.lastName,
                username:user.username,
                password:user.password});
        }else{
            await User.findOneAndUpdate({_id:user.id},
                {avatarUrl:user.avatarUrl,
                firstName:user.firstName,
                lastName:user.lastName,
                username:user.username,
                password:user.password});
        }

        // alert('update completed');
        res.redirect('/home/booking');
    },
    displayHistory:(req, res) => {
        let user = {
            bookingCode:'441414',
            airlines:'VietnamAirlines',
            quantityTicket:'3',
            STD:'20/7/2022',
            departurePlace:'HNA',
            arrivalPlace:'HCM',
            class:'economy',
            username:'Taylor Swift'
        };
        // return res.json(user)
        res.render('flight/displayHistoryUser',{user:user});
    }
};

export default userController