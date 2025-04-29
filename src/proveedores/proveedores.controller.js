import Proveedor from './proveedor.model.js';

export const saveProveedor = async (req, res) => {
  try {
    const { nombre, telefono, email } = req.body;

    const proveedor = await Proveedor.create({
      nombre,
      telefono,
      email,
    });

    res.status(200).json({
      ss: true,
      msg: 'Proveedor guardado correctamente',
      proveedor,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al guardar el proveedor",
      error: error.message,
    });
  }
};

export const getProveedores = async (req, res) => {
  try {
    const proveedores = await Proveedor.find({ estado: true });

    res.status(200).json({
      ss: true,
      proveedores,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener los proveedores",
      error: error.message,
    });
  }
};

export const searchProveedorById = async (req, res) => {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findById(id);

    if (!proveedor) {
      return res.status(404).json({
        ss: false,
        msg: 'No se encontró el proveedor',
      });
    }

    res.status(200).json({
      ss: true,
      proveedor,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al obtener el proveedor",
      error: error.message,
    });
  }
};

export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updatedProveedor = await Proveedor.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
      ss: true,
      msg: 'Proveedor actualizado correctamente',
      updatedProveedor,
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al actualizar el proveedor",
      error: error.message,
    });
  }
};

export const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;

    await Proveedor.findByIdAndUpdate(id, { estado: false }, { new: true });

    return res.status(200).json({
      ss: true,
      msg: 'Proveedor eliminado correctamente',
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Error al eliminar el proveedor",
      error: error.message,
    });
  }
};
