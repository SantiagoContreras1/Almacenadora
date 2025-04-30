import { Schema, model } from "mongoose";

const OutputSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'El producto es obligatorio']
    },
    date: {
        type: Date,
        default: Date.now,
    },
    employee: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: [true, 'El empleado es obligatorio']
    },
    quantityRemoved: {
        type: Number,
        required: [true, 'La cantidad retirada es obligatoria'],
        min: [1, 'La cantidad debe ser al menos 1']
    },
    reason: {
        type: String,
        required: [true, 'El motivo es obligatorio']
    },
    destination: {
        type: String,
        required: [true, 'El destino es obligatorio']
    }
}, { timestamps: true });

export default model('Output', OutputSchema);
