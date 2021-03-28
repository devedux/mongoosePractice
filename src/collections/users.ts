import { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un role válido'
}

export const usuarioSchema : Schema  = new Schema({
    name: {
        type: String,
        required: [true, 'the name is necesary']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'the email is necesary']
    },
    password: {
        type: String,
        required: true
    },

    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    state: {
        type: Boolean,
        default: true, 
        required: true
    },
    google: {
        type: Boolean,
        default: false
    } 
});

usuarioSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser único'
} )

// toJSON lo llamamos cuando siempre tratamos de imprimir
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject ();
    delete userObject.password;

    return userObject;
}
