export const categoryExists = (req,res,next) => {
    if (!req.body.name) {
        return res.status(404).json({
            message: "Category not found"
        })
    }
    next()
}

export const categoryExistsForDelete = (req,res,next) => {
    if(!req.body.confirm){
        return res.status(400).json({
            message: "Estas seguro de eliminar la categoría? Envía un valor 'true' para confirmar"
        })
    }

    if (!req.params.id) {
        return res.status(404).json({
            message: "Category not found"
        })
    }
    next()
}