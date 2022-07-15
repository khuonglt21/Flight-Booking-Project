import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    username: String,
    password: String,
    role: String,
    google: {id: {type: String}}
});
const user = model('user', userSchema);

export default user;