import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    username: {type:String,required:true,unique: true},
    password: {type:String},
    role: {type:String,default:'user'},
    google: {id: {type: String}},
    isBanned: {type:Boolean,default:false},
    firstName: {type:String},
    lastName: {type:String},
    email: {type:String, required: true},
    avatarUrl: {type:String,default:'/public/img/avatar/avatar-default.png'}
});
const user = model('User', userSchema);

export default user;