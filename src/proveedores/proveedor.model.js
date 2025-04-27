import { Schema, model } from "mongoose";

const ProveedorSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Ingresa el nombre del proveedor."],
  },
  telefono: {
    type: String,
    required: [true, "Ingresa el teléfono del proveedor."],
  },
  email: {
    type: String,
    required: [true, "Ingresa el correo electrónico del proveedor."],
    unique: true,
  },
  productos: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Ingresa el tipo de productos del proveedor."],
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

ProveedorSchema.methods.toJSON = function () {
  const { __v, _id, ...proveedor } = this.toObject();
  proveedor.uid = _id;
  return proveedor;
};

export default model("Proveedor", ProveedorSchema);
