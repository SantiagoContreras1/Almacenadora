import {Schema, model} from 'mongoose';

const UserSchema = Schema({
    name:{
        type: String,
        required: [true, "Ingresa tu nombre."]
    },
    email:{
        type: String,
        required: [true, "Ingresa tu correo electrónico."],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Ingresa tu contraseña."]
    },
    role:{
        type: String,
        default: "user"
    },
    estado:{
        type: Boolean,
        default: true
    }
})

UserSchema.methods.toJSON = function () {
    const { __v, password, ...user } = this.toObject();
    return user;
}

export default model('User', UserSchema);