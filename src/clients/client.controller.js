import Client from './client.model.js';

export const saveClient = async (req, res) => {
  try {
    const data = req.body;

    const client = await Client.create({
      tipo: data.tipo,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      direccion: data.direccion
    });

    await client.save();

    res.status(200).json({
      ss: true,
      msg: 'Cliente guardado correctamente',
      client
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al guardar el cliente",
      error: error.message
    });
  }
};

export const getClients = async (req, res) => {
  try {
    const query = { estado: true };

    const clients = await Client.find(query);

    res.status(200).json({
      ss: true,
      clients
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los clientes",
      error: error.message
    });
  }
};

export const searchClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        ss: false,
        msg: 'No se encontró el cliente'
      });
    }

    res.status(200).json({
      ss: true,
      client
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener el cliente",
      error: error.message
    });
  }
};

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;

    const updatedClient = await Client.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ss: true,
      msg: 'Cliente actualizado correctamente',
      updatedClient
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar el cliente",
      error: error.message
    });
  }
};

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    await Client.findByIdAndUpdate(id, { estado: false }, { new: true });

    return res.status(200).json({
      ss: true,
      msg: 'Cliente eliminado correctamente'
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar el cliente",
      error: error.message
    });
  }
};
