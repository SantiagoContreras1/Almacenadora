import Input from "./input.model.js";
import Product from "../products/product.model.js";

export const saveInput = async (req, res) => {
    try {
        const employeeId = req.user._id; 
        const { quantity } = req.body;
        const product = req.product;

        const inputRecord = new Input({
            product: product._id, 
            quantity,
            employee: employeeId
        });

        await inputRecord.save();
        product.stock += quantity;
        product.entrada = Date.now();
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

export const getinputId = async (req, res) =>{
    try {
        const { id } = req.params;

        const input = await Input.findById(id);

        if (!input) {
            return res.status(404).json({
                message: "Input not found"
            });
        } else {
            res.status(200).json({
                input
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Error getting input",
            error: error.message
        })
    }
}

export const deleteInput = async (req, res) => {
    try {
        const { id } = req.params;
        const deactivatedInput = await Input.findByIdAndUpdate(id, { estado: false }, { new: true }
        );

        if (!deactivatedInput) {
            return res.status(404).json({
                message: "Input not found or already inactive"
            });
        }
        res.status(200).json({
            message: "Input deactivated successfully",
            deactivatedInput 
        });

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({
                message: "Invalid Input ID",
                error: error.message
            });
        }

        res.status(500).json({
            message: "Error deactivating input",
            error: error.message
        });
    }
}

export const updateInput = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const originalInput = await Input.findById(id);

        if (!originalInput) {
            return res.status(404).json({ message: "Input not found" });
        }

        const product = await Product.findById(originalInput.product);

        if (!product) {
            return res.status(404).json({ message: "Associated product not found" });
        }

        const quantityDifference = quantity - originalInput.quantity;

        const updatedInput = await Input.findByIdAndUpdate(
            id,
            { quantity: Number(quantity) },
            { new: true }
        );

        product.stock += quantityDifference;
        await product.save();

        res.status(200).json({
            message: "Input and product stock updated successfully",
            updatedInput,
            currentProductStock: product.stock
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating input and product stock",
            error: error.message
        });
    }
}

  
