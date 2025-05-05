import { Schema, model } from "mongoose";

const ClientSchema = Schema({
  tipo: {
    type: String,
    enum: ["individual", "empresa"],
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  direccion: {
    type: String,
    required: false,
  },
  estado: {
    type: Boolean,
    default: true,
  },
});

ClientSchema.methods.toJSON = function () {
  const { __v, _id, ...client } = this.toObject();
  client.uid = _id;
  return client;
};

export default model("Client", ClientSchema);
