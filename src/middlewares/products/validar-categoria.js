export const categoryExists = (req,res,next) => {
    if (!req.body.name) {
        return res.status(404).json({
            message: "Category not found"
        })
    }
    next()
}

export const categoryExistsForDelete = (req,res,next) => {
    if (!req.params.id) {
        return res.status(404).json({
            message: "Category not found"
        })
    }
    next()
}