import Product from "./product.model.js";
import Category from "../categories/category.model.js";
import Proveedor from "../proveedores/proveedor.model.js";

import {
    findProductByCategory,
    findProductsByDate,
    findByNameProduct
} from '../helpers/filtrar-products..js';

export const saveProduct = async (req, res) => {
    try {
        const data = req.body
        const category = await Category.findById(data.category)
        const proveedor = await Proveedor.findById(data.proveedor)

        const product = await Product.create({
            name: data.name,
            description: data.description,
            picture: data.picture || "",
            price: data.price,
            stock: data.stock,
            category: category._id,
            proveedor: proveedor._id,
            ventas: data.ventas || 0,
            entrada: data.entrada || Date.now(),
            salida: data.salida || null
        })

        proveedor.productos.push(product._id)
        await proveedor.save()

        const productConCategoria = await Product.findById(product._id)
            .populate({
                path: "category",
                select: "name"
            })
            .populate({
                path: "proveedor",
                select: "nombre"
            })

        res.status(200).json({
            ss: true,
            msg: 'Ahí está tu producto mirá…',
            productConCategoria
        })

    } catch (error) {
        res.status(500).json({
            message: "Error saving product",
            error: error.message
        })
    }
}


export const getProducts = async (req,res) => {
    try {
        const query = { estado: true }
        const { name,category,entrada} = req.query

        if(name){
            query.name = findByNameProduct(name)
        }

        if(category){
            query.category = await findProductByCategory(category)
        }

        if(entrada){
            query.entrada = findProductsByDate(entrada)
        }


        const products = await Product.find(query)
            .populate({
                path: "category",
                select: "name"
            })
            .populate({
                path: "proveedor",
                select: "nombre"
            })

        if(products.length === 0){
            return res.status(404).json({
                ss:false,
                msg: 'No se encontraron productos'
            })
        }


        res.status(200).json({
            ss:true,
            products
        })
    } catch (error) {
        res.status(500).json({
            message: "Error getting products",
            error: error.message
        })
    }
}

export const searchProduct = async (req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                ss:false,
                msg: 'No se encontró el producto'
            })
        }

        res.status(200).json({
            ss:true,
            product
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Error searching product",
            error: error.message
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { ...data } = req.body
        const category = await Category.findById(data.category)

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        // Asegurarse de que las fechas (si se envían) sean válidas
        if (data.entrada && isNaN(new Date(data.entrada))) {
            return res.status(400).json({
                message: "Formato inválido para la fecha de entrada."
            })
        }

        if (data.salida && isNaN(new Date(data.salida))) {
            return res.status(400).json({
                message: "Formato inválido para la fecha de salida."
            })
        }

        const updatedProducto = await Product.findByIdAndUpdate(id, data, { new: true })

        res.status(200).json({
            ss: true,
            msg: 'Actualicé el producto oíste…..',
            updatedProducto
        })

    } catch (error) {
        res.status(500).json({
            message: "Error updating product",
            error: error.message
        })
    }
}


export const deleteProduct = async (req,res) => {
    try {
        const {id} = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            })
        }

        const proveedor = await Proveedor.findOne(product.proveedor)
        if(proveedor){
            proveedor.productos.pull(product._id)
            await proveedor.save()
        }


        const deletedProduct = await Product.findByIdAndUpdate(id,{estado:false},{new:true})

        res.status(200).json({
            ss:true,
            msg:'Eliminaste el producto oiste.....',
            deletedProduct
        })

    } catch (error) {
        res.status(500).json({
            message: "Error deleting product",
            error: error.message
        })
    }
}

// GETS ESPECIALES
export const getProductStock = async (req,res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({
                ss:false,
                msg: 'No se encontró el producto'
            })
        }

        const stock = product.stock

        res.status(200).json({
            ss:true,
            stock: `El stock del producto ${product.name} es: ${stock}`
        })


    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el stock del producto",
            error: error.message
        })
    }
}

export const getTotalStock = async (req,res) => {
    try {
        const products = await Product.find({ estado: true })
        let totalStock = 0
        let totalValue = 0

        for (const product of products) {
            totalStock += product.stock
            totalValue += product.price * product.stock
        }

        res.status(200).json({
            ss:true,
            totalStock: `El stock total es: ${totalStock}`,
            totalValue: `El valor total del stock es: Q${totalValue}`
        })

        
    } catch (error) {
        return res.status(500).json({
            msg: "Error al obtener el stock total", 
            error: error.message
        })
    }
}