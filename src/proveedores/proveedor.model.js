import { Schema,model } from "mongoose";

const ProveedorSchema = Schema({
    nombre:{
        type: String,
        required: [true, "Ingresa el nombre del proveedor."]
    },
    password:{
        type: String,
        required: [true, "Ingresa la contraseña del proveedor."]
    },
    telefono:{
        type: String,
        required: [true, "Ingresa el teléfono del proveedor."]
    },
    email:{
        type: String,
        required: [true, "Ingresa el correo electrónico del proveedor."],
        unique: true
    },
    TipoProductos:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Ingresa el tipo de productos del proveedor."]
    },
    estado:{
        type: Boolean,
        default: true
    }
})

export default model('Proveedor', ProveedorSchema);