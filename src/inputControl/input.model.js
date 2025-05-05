import { Schema, model } from "mongoose";

const InputSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product', 
        required: [true, 'El producto es obligatorio']
    },
    date: {
        type: Date,
        default: Date.now, 
        required: true
    },
    quantity: {
        type: Number,
        required: [true, 'La cantidad añadida es obligatoria'],
        min: [1, 'La cantidad debe ser al menos 1'] 
    },
    employee: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'El empleado es obligatorio']
    }
});

export default model('Input', InputSchema);