import Proveedor from './proveedor.model.js';
import Category from '../categories/category.model.js';

export const saveProveedor = async (req,res) => {
    try {
        const data = req.body
        const proveedor = await Proveedor.create({
            nombre: data.nombre,
            telefono: data.telefono,
            email: data.email,
            contacto: data.contacto,
            direccion: data.direccion
        })

        await proveedor.save()
        res.status(200).json({
            ss: true,
            msg: 'Proveedor guardado correctamente',
            proveedorConCategoria
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: "Error al guardar el proveedor",
            error: error.message
        })
    }
}

export const getProveedores = async (req,res) => {

    try {
        const query = { estado:true }

        const proveedores = await Proveedor.find(query)
            .populate({
                path: "productos",
                select: "name"
            })

        res.status(200).json({
            ss:true,
            proveedores
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener los proveedores",
            error: error.message
        })
    }
}

export const searchProveedorById = async (req,res) => {
    try {
        const { id } = req.params

        const proveedor = await Proveedor.findById(id)
            .populate({
                path: "productos",
                select: "name"
            })

        if (!proveedor){
            return res.status(404).json({
                ss:false,
                msg: 'No se encontró el proveedor'
            })
        }

        res.status(200).json({
            ss:true,
            proveedor
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el proveedor",
            error: error.message
        })
    }
}

export const updateProveedor = async (req,res) => {
    try {
        const {id} = req.params
        const {...data} = req.body

        //Primero se busca el proveedor por id, se le manda la data y se actualiza
        const updatedProveedor = await Proveedor.findByIdAndUpdate(id,data,{new:true})
            .populate({
                path: "productos",
                select: "name"
            })
        
        res.status(200).json({
            ss: true,
            msg: 'Proveedor actualizado correctamente',
            updatedProveedor
        })

    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar el proveedor",
            error: error.message
        })
    }
}

export const deleteProveedor = async (req,res) => {
    try {
        const {id} = req.params

        //Primero se busca el proveedor por id para bananearlo
        await Proveedor.findByIdAndUpdate(id,{estado:false},{new:true})

        return res.status(200).json({
            ss: true,
            msg: 'Proveedor eliminado correctamente'
        })
        
    } catch (error) {
        return res.status(500).json({
            msg: "Error al eliminar el proveedor",
            error: error.message
        })
    }
}
