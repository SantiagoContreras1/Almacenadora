import Product from "../products/product.model.js"
import { saveNotification } from "../notifications/notificaction.controller.js"
import { io } from "../../config/server.js"

export const checkStockAndExp = async () => {
    try {
        const lowStock = await Product.find({
            stock: {$lte: 20},
            estado: true
        })

        // CERCA DE EXP
        const today = new Date()

        const cercaExp = await Product.find({
            vencimiento: {
                $gte: today,
                $lte: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) // Próximos 7 días
            }
        })

        // Se va a hacer solo si hay algo
        if(lowStock.length > 0 || cercaExp.length >0){
            io.emit("alerts",{
                lowStock,
                cercaExp
            })

            for (const product of lowStock) {
                const msg = `Producto "${product.name}" con stock bajo: ${product.stock}`;
                await saveNotification("LOW_STOCK", msg, product._id);
            }

            for (const product of cercaExp) {
                const vencimientoFormateado = product.vencimiento.toISOString().split("T")[0];
                const msg = `Producto "${product.name}" vence pronto (Fecha: ${vencimientoFormateado})`;
                await saveNotification("EXPIRATION", msg, product._id);
            }
        }


    } catch (error) {
        console.log("Error al notificar")
        console.log(error)
    }
}