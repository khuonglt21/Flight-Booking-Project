import {Schema, model} from 'mongoose';

const classSchema = new Schema({
    class: {type: String,unique: true, required: true},
})

const classModel = model('Class', classSchema);

export default classModel;