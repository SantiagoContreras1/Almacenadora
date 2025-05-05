import Input from "../inputControl/input.model.js";
import Output from "../outputControl/output.model.js";
import { startOfWeek, endOfWeek, subWeeks, format } from "date-fns";
export const getAllMovements = async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query;
    const inputs = await Input.find()
      .populate("product")
      .populate("employee")
      .sort({ date: -1 });
    const outputs = await Output.find()
      .populate("product")
      .populate("employee")
      .sort({ date: -1 });

    const formattedInputs = inputs.map((input) => ({
      id: input._id,
      date: input.date,
      productName: input.product ? input.product.name : "Producto eliminado",
      type: "Entrada",
      quantity: input.quantity,
      user: input.employee.name,
    }));

    const formattedOutputs = outputs.map((output) => ({
      id: output._id,
      date: output.date,
      productName: output.product ? output.product.name : "Producto eliminado",
      type: "Salida",
      quantity: output.quantity,
      user: output.employee.name,
      reason: output.reason,
      destination: output.destination,
    }));

    const allMovements = [...formattedInputs, ...formattedOutputs]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(Number(offset), Number(offset) + Number(limit));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const movementsToday = allMovements.filter((movement) => {
      const movementDate = new Date(movement.date);
      return movementDate >= today && movementDate < tomorrow;
    });

    res.status(200).json({
      success: true,
      inputs: formattedInputs.length,
      outputs: formattedOutputs.length,
      movements: allMovements,
      today: movementsToday.length,
      total: formattedInputs.length + formattedOutputs.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener movimientos" });
  }
};

export const getWeeklyInventoryMovements = async (req, res) => {
  try {
    const now = new Date();

    const weeks = [];
    for (let i = 4; i >= 0; i--) {
      const start = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
      const end = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });

      start.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(23, 59, 59, 999);

      weeks.push({ start, end });
    }

    const weekData = [];

    for (let i = 0; i < weeks.length; i++) {
      const { start, end } = weeks[i];
      const weekLabel = `${format(start, "dd MMM")} - ${format(end, "dd MMM")}`;

      const [inputCount, outputCount] = await Promise.all([
        Input.countDocuments({
          date: { $gte: start, $lte: end },
        }),
        Output.countDocuments({
          date: { $gte: start, $lte: end },
        }),
      ]);

      weekData.push({
        name: weekLabel,
        entradas: inputCount,
        salidas: outputCount,
      });
    }

    res.status(200).json({
      success: true,
      movements: weekData,
    });
  } catch (error) {
    console.error("Error al obtener movimientos semanales:", error);
    res.status(500).json({
      message: "Error al obtener movimientos semanales",
      error: error.message,
    });
  }
};
