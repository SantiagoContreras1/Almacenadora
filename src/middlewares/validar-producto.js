import Product from "../products/product.model.js";

export const validarProductoExiste = async (req, res, next) => {
  try {
    const productId = req.body?.product || req.params?.id || req.query?.product;

    if (!productId) {
      return res.status(400).json({
        message: "ID del producto no proporcionado",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    req.product = product;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Error al validar el producto",
      error: error.message,
    });
  }
};
