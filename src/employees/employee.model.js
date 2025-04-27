import { Schema, model } from "mongoose"

const EmployeeSchema = Schema({
    name:{ 
        type: String, 
        required: [true,'El nombre del empleado, ingresalo porfa']
    },
    apellido:{
        type: String, 
        required: [true,'El apellido del empleado, ingresalo porfa']
    },
    puesto:{
        type: String,
        required: [true,'El nombre del puesto, ingresalo porfa']
    },
    estado:{
        type: Boolean,
        default: true 
    }

})

export default model('Employee',EmployeeSchema)