import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import Proveedor from "../proveedores/proveedor.model.js";

export const saveProduct = async (req, res) => {
  try {
    const data = req.body;
    const category = await Category.findById(data.category);
    const proveedor = await Proveedor.findById(data.proveedor);

    const product = await Product.create({
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      category: category._id,
      proveedor: proveedor._id,
      image: data.image,
      ventas: data.ventas || 0,
      entrada: data.entrada || Date.now(),
      vencimiento: data.vencimiento || null,
    });

    const productConCategoria = await Product.findById(product._id)
      .populate({ path: "category", select: "name" })
      .populate({ path: "proveedor", select: "nombre" });

    res.status(200).json({
      ss: true,
      msg: "Ahí está tu producto mirá…",
      productConCategoria,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const query = { estado: true };

    const products = await Product.find(query)
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path: "proveedor",
        select: "nombre",
      });

    res.status(200).json({
      ss: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting products",
      error: error.message,
    });
  }
};

export const searchProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ss: false,
        msg: "No se encontró el producto",
      });
    }

    res.status(200).json({
      ss: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error searching product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...data } = req.body;
    const category = await Category.findById(data.category);
    const proveedor = await Proveedor.findById(data.proveedor);
    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    if (!proveedor) {
        return res.status(404).json({
          message: "Proveedor not found",
        });
      }

    // Asegurarse de que las fechas (si se envían) sean válidas
    if (data.entrada && isNaN(new Date(data.entrada))) {
      return res.status(400).json({
        message: "Formato inválido para la fecha de entrada.",
      });
    }

    if (data.vencimiento && isNaN(new Date(data.vencimiento))) {
      return res.status(400).json({
        message: "Formato inválido para la fecha de vencimiento",
      });
    }

    const updatedProducto = await Product.findByIdAndUpdate(id, data, {
      new: true,
    });

    res.status(200).json({
      ss: true,
      msg: "Actualicé el producto oíste…..",
      updatedProducto,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { estado: false },
      { new: true }
    );

    res.status(200).json({
      ss: true,
      msg: "Eliminaste el producto oiste.....",
      deletedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
