import User from '../schemas/User.model'

export const adminController= {
    renderListUser:async (req,res,next) => {
        const users = await User.find();
        let admin = req.user.username
        // console.log(users);
        res.render('list-user',{users: users,admin: admin});
    },
    bannedUser:async (req, res,next) => {
        console.log(req.query);
        let userId = Object.keys(req.query);
        console.log(userId[0])
        const user = await User.findById(userId[0]);
        // console.log(user.isBanned +'1')
        if(user.isBanned){
            let isBanned = false;
            await  User.updateOne({_id:userId},{isBanned:isBanned})
        }else{
            let isBanned = true;
            await  User.updateOne({_id:userId},{isBanned:isBanned})
        }
        // console.log(user.isBanned +'2')
        res.redirect('/admin/list-users')
    }
}