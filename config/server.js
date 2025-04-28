import express from "express"
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcrypt";
import { dbConnection } from "./mongo.js";

import authRoutes from "../src/auth/auth.routes.js"
import categoriesRoutes from "../src/categories/categories.routes.js"
import proveedoresRoutes from "../src/proveedores/proveedores.routes.js"
import productsRoutes from "../src/products/products.routes.js"
import inputsRoutes from "../src/inputControl/input.routes.js"
import employeesRoutes from "../src/employees/employee.routes.js"

import User from "../src/users/user.model.js"
import Category from "../src/categories/category.model.js"
import Role from "../src/role/role.model.js"

let flag = true
let flagCategory = true
let flagRole = true

const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) //Para los forms
    app.use(express.json()) // Para que JS entienda los JSON
    app.use(cors()) // dominios que pueden acceder
    app.use(helmet()) // Es para la seguridad
    app.use(morgan('dev')) // Muestra mensajes para nuestras rutas (POST,PUT etc)
}

const routes = (app) => {
    app.use("/almacenadora/auth/", authRoutes)
    app.use("/almacenadora/categories/", categoriesRoutes)
    app.use("/almacenadora/proveedores/", proveedoresRoutes)
    app.use("/almacenadora/products/", productsRoutes)
    app.use("/almacenadora/inputs/", inputsRoutes)
    app.use("/almacenadora/employees/", employeesRoutes)
}

const conectarDb = async () => {
    try {
        await dbConnection();
        console.log('DB Online');
    } catch (error) {
        console.log('Error al conectarse a la DB',error)
    }
}

// Crear adimin
export const crearAdmin = async () => {
    try {
        const existeAdmin = await User.findOne({ email: "admin@admin.com"})

        if (!existeAdmin) {
            const salt = await bcrypt.genSalt(10)
            const hashedPass = await bcrypt.hashSync("1234567", salt)

            const adminUser = await User.create({
                name: 'Admin',
                email: 'admin@admin.com',
                password: hashedPass,
                role: 'ADMIN_ROLE'
            })

            await adminUser.save()
            console.log("Admin creado")
            flag = false
        }else{
            console.log("Admin ya existe")
        }
    } catch (error) {
        return console.log(`Error al crear admin ${error}`)
    }
}

// Categoria por defecto
export const crearCate = async () => {
    const existeCate = await Category.findOne({ name: "Productos Sin Categoria" })

    if (!existeCate) {
        const defaultCategory = await Category.create({
            name: "Productos Sin Categoria",
            description: "Categoria por defecto para los productos sin categoria"
        })

        await defaultCategory.save()
        console.log("Categoria por defecto creada")
        flagCategory = false
        
    }else{
        console.log("Categoria por defecto ya existe")
    }
}

// Crear rol por defecto
export const crearRol = async () => {
    const existeRolAdmin = await Role.findOne({ name: "ADMIN_ROLE" })
    const existeRolUser = await Role.findOne({ name: "USER_ROLE" })

    if (!existeRolAdmin && !existeRolUser) {
        
        const defaultRoleAdmin = await Role.create({
            role: "ADMIN_ROLE",
            description: "Rol por defecto para los administradores"
        })
        const defaultRoleUser =await Role.create({
            role: "USER_ROLE",
            description: "Rol por defecto para los usuarios"
        })


        await defaultRoleAdmin.save()
        await defaultRoleUser.save()
        console.log("Roles creados")
        flagRole = false
        
    }else{
        console.log("Rol por defecto ya existe")
    }
}

export const initServer = ()=>{
    const app = express() // crea el server
    const port= process.env.PORT || 3000

    try {
        middlewares(app)
        conectarDb()
        routes(app)
        app.listen(port)
        console.log(`Server running on port ${port}`)

        if (flag) {
            crearAdmin()
        }

        if (flagCategory) {
            crearCate()
        }

        if (flagRole) {
            crearRol()
        }
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}