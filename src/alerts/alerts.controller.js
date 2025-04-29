import Product from "../products/product.model.js"
import { io } from "../../config/server.js"

export const checkStockAndExp = async () => {
    try {
        const lowStock = await Product.find({
            stock: {$lte: 5},
            estado: true
        })

        // CERCA DE EXP
        const today = new Date()

        const cercaExp = await Product.find({
            salida: {
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
        }


    } catch (error) {
        console.log("Error al notificar")
        console.log(error)
    }
}