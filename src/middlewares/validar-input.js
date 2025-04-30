export const validarCantidadPositiva = (req, res, next) => {
    const { quantityAdded } = req.body;

    if (typeof quantityAdded !== 'number' || quantityAdded <= 0) {
        return res.status(400).json({ message: "La cantidad añadida debe ser un número positivo" });
    }

    next(); 
};