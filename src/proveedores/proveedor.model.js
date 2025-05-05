import { Schema, model } from "mongoose";

const ProveedorSchema = Schema({
  nombre: {
    type: String,
    required: [true, "Ingresa el nombre del proveedor."],
  },
  contacto: {
    type: String,
    required: [true, "Ingresa el nombre del contacto."],
  },
  direccion: {
    type: String,
    required: [true, "Ingresa la direccion de la direccion"],
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
