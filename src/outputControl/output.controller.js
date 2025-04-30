import Output from "./output.model.js";
import Product from "../products/product.model.js";

export const saveOutput = async (req, res) => {
  try {
    const { product, date, employee, quantity, reason, destination } = req.body;
    const existingProduct = await Product.findById(product);

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // Usa la variable existingProduct para actualizar el stock
    existingProduct.stock -= quantity;

    await existingProduct.save(); // Guarda el producto actualizado

    const outputRecord = new Output({
      product: existingProduct._id, // Referencia al ID del producto encontrado
      date,
      employee,
      quantityRemoved: quantity,
      reason,
      destination,
    });

    await outputRecord.save();

    res.status(200).json({
      message: "Output saved successfully",
      outputRecord,
      currentStock: existingProduct.stock, // Devuelve el stock actualizado
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving output",
      error: error.message,
    });
  }
};

export const getOutputs = async (req, res) => {
  try {
    const outputs = await Output.find()
      .populate("product")
      .populate("employee");

    res.status(200).json({
      message: "Outputs obtained successfully",
      outputs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting outputs",
      error: error.message,
    });
  }
};

export const getoutputId = async (req, res) => {
  try {
    const { id } = req.params;

    const output = await Output.findById(id);

    if (!output) {
      return res.status(404).json({
        message: "Output not found",
      });
    } else {
      res.status(200).json({
        output,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error getting output",
      error: error.message,
    });
  }
};

export const deleteOutput = async (req, res) => {
  try {
    const { id } = req.params;

    const desactivedOutput = await Output.findByIdAndUpdate(
      id,
      { active: false },
      { new: true }
    );

    if (!desactivedOutput) {
      return res.status(404).json({
        message: "Output not found",
      });
    }

    res.status(200).json({
      message: "Output deleted successfully",
      desactivedOutput,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting output",
      error: error.message,
    });
  }
};

export const updateOutput = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantityRemoved: newQuantityRemoved, reason, destination} = req.body;

    const originalOutput = await Output.findById(id);

    if (!originalOutput) {
      return res.status(404).json({ message: "Output record not found" });
    }

    const originalQuantityRemoved = originalOutput.quantityRemoved;
    const originalProductId = originalOutput.product;

    const updateData = {
      quantityRemoved: Number(newQuantityRemoved), 
      reason: reason, 
      destination: destination,
    };

    const product = await Product.findById(originalProductId);

    if (!product) {
      return res.status(404).json({ message: "Associated product not found" });
    }

    const quantityDifference = updateData.quantityRemoved - originalQuantityRemoved;

    const updatedOutput = await Output.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedOutput) {
      return res.status(500).json({ message: "Error updating output record." });
    }

    if (quantityDifference !== 0) {
      product.stock -= quantityDifference;
      await product.save();
    }

    res.status(200).json({
      message: "Output record updated successfully",
      updatedOutput,
      currentProductStock: product.stock,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating output record",
      error: error.message,
    });
  }
};

