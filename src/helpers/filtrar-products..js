import Category from "../categories/category.model.js";

// Buscar un producto por su categoría
export const findProductByCategory = async (name) => {
    const category = await Category.findOne( { name })

    if(!category) {
        throw new Error(`La categoría ${name} no existe`)
    }

    return category._id
}

// Por rango de fecha
export const findProductsByDate = (entrada) => {
    const date = new Date(entrada)

    if(isNaN(date)){
        throw new Error("Formato de la fecha inválido, YYYY/MM/DD")
    }

    return{
        $gte: date,
        $lt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Sumar un día a la fecha de entrada
    }
}

// Por nombre del product
export const findByNameProduct = (name) => {
    return{
        $regex: name,
        $options: 'i' // Ignorar mayúsculas y minúsculas
    }
}