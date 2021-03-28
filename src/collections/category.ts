import { Schema } from 'mongoose';

export const categorySchema : Schema = new Schema({
    description: {
        type: String, 
        unique: true,
        required: [true, 'the name to category is necesary' ]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    state: {
        type: Boolean,
        default: true,
        required: true
    }
})