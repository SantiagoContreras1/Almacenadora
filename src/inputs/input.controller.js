import Input from "./input.model.js";
import Employee from "../employees/employee.model.js";

export const saveInput = async (req, res) => {
    try {
        const employeeId = req.user._id; 
        const { quantityAdded } = req.body;
        const product = req.product;

        // --- Lógica para registrar la entrada y actualizar el stock ---
        const inputRecord = new Input({
            product: product._id, // Usas el ID del producto encontrado
            quantityAdded,
            employee: employeeId
        });

        await inputRecord.save();

        product.stock += quantityAdded; // Actualizamos el stock
        await product.save();

        res.status(200).json({
            message: "Stock saved successfully",
            inputRecord,
            currentStock: product.stock
        });
    } catch (error) {
        res.status(500).json({
            message: "Error saving input",
            error: error.message
        })
    }
}

export const getInputs = async (req, res) => {
    try {
        const inputs = await Input.find().populate('product').populate('employee')

        res.status(200).json({
            message: "Inputs obtenidos exitosamente",
            inputs
        })
    } catch (error) {
        res.status(500).json({
            message: "Error getting inputs",
            error: error.message
        })
    }
}


export const deleteInput = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedInput = await Input.findByIdAndDelete(id);

        res.status(200).json({
            message: "Input deleted successfully",
            deletedInput
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting input",
            error: error.message
        });
    }
}