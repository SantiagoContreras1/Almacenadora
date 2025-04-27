export const existeProveedor = async (req,res,next) => {

    if (!req.params.id) {
        return res.status(404).json({
            msg: "Proveedor not found"
        })
    }
    
    next();
}

export const existeProveedorForDelete = async (req,res,next) => {
    if(!req.body.confirm){
        return res.status(400).json({
            msg: "Estas seguro de eliminar el proveedor? Envía un valor 'true' para confirmar"
        })
    }

    if (!req.params.id) {
        return res.status(404).json({
            msg: "Proveedor not found"
        })
    }
    
    next()
}