import Product from '../products/product.model.js';

export const validarProductoExiste = async (req, res, next) => {
    const { product: productId } = req.body; 

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
    }

    req.product = product;
    next();
};