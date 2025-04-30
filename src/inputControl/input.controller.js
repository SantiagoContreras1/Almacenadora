import Input from "./input.model.js";
import Product from "../products/product.model.js";
import Output from "../outputControl/output.model.js";

export const saveInput = async (req, res) => {
    try {
        const employeeId = req.user._id; 
        const { quantityAdded } = req.body;
        const product = req.product;

        const inputRecord = new Input({
            product: product._id, 
            quantityAdded,
            employee: employeeId
        });

        await inputRecord.save();

        product.stock += quantityAdded;
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
        const { quantityAdded: newQuantityAdded } = req.body;

        const originalInput = await Input.findById(id);

        if (!originalInput) {
            return res.status(404).json({ message: "Input not found" });
        }

        const product = await Product.findById(originalInput.product);

        if (!product) {
            return res.status(404).json({ message: "Associated product not found" });
        }

        const quantityDifference = newQuantityAdded - originalInput.quantityAdded;

        const updatedInput = await Input.findByIdAndUpdate(
            id,
            { quantityAdded: newQuantityAdded },
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

export const getMovementsInventory = async (req, res) => {
  try {
    const product = req.product;

    const entradas = await Input.find({ product: product._id })
      .populate("employee", "name")
      .sort({ createdAt: -1 }); 

    const salidas = await Output.find({ product: product._id })
      .populate("employee", "name")
      .sort({ date: -1 });

    const movimientos = [
      ...entradas.map((entrada) => ({
        tipo: "entrada",
        fecha: entrada.createdAt,
        cantidad: entrada.quantityAdded,
        empleado: entrada.employee,
        detalles: entrada,
      })),
      ...salidas.map((salida) => ({
        tipo: "salida",
        fecha: salida.date,
        cantidad: salida.quantityRemoved,
        empleado: salida.employee,
        razon: salida.reason,
        destino: salida.destination,
        detalles: salida,
      })),
    ];

    movimientos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

    res.status(200).json({
      message: "Movimientos del producto obtenidos exitosamente",
      producto: {
        id: product._id,
        nombre: product.name,
        stockActual: product.stock,
      },
      movimientos,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los movimientos del inventario",
      error: error.message,
    });
  }
};

export const getTopMovedProducts = async (req, res) => {
    try {
      const entradas = await Input.aggregate([
        {
          $group: {
            _id: "$product",
            entradas: { $sum: "$quantityAdded" }
          }
        }
      ]);
  
      const salidas = await Output.aggregate([
        {
          $group: {
            _id: "$product",
            salidas: { $sum: "$quantityRemoved" }
          }
        }
      ]);
  
      const movimientos = {};
  
      entradas.forEach(e => {
        movimientos[e._id] = { entradas: e.entradas, salidas: 0 };
      });
  
      salidas.forEach(s => {
        if (!movimientos[s._id]) movimientos[s._id] = { entradas: 0, salidas: 0 };
        movimientos[s._id].salidas = s.salidas;
      });
  
      const resultado = Object.entries(movimientos).map(([productId, datos]) => ({
        productId,
        totalMovimientos: datos.entradas + datos.salidas,
        entradas: datos.entradas,
        salidas: datos.salidas
      }));
  
      resultado.sort((a, b) => b.totalMovimientos - a.totalMovimientos);

  
      res.status(200).json({
        message: "Productos más movidos",
        productos: resultado
      });
  
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener productos más movidos",
        error: error.message
      });
    }
  };
  
