export const existeProveedor = async (req,res,next) => {

    if (!req.params.id) {
        return res.status(404).json({
            msg: "Proveedor not found"
        })
    }
    
    next();
}

