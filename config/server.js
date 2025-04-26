import express from "express"
import cors from "cors"
import helmet from "helmet";
import morgan from "morgan";
import bcrypt from "bcrypt";
import { dbConnection } from "./mongo.js";

import authRoutes from "../src/auth/auth.routes.js"
import categoriesRoutes from "../src/categories/categories.routes.js"

import User from "../src/users/user.model.js"

let flag = true

const middlewares = (app)=>{
    app.use(express.urlencoded({extended: false})) //Para los forms
    app.use(express.json()) // Para que JS entienda los JSON
    app.use(cors()) // dominios que pueden acceder
    app.use(helmet()) // Es para la seguridad
    app.use(morgan('dev')) // Muestra mensajes para nuestras rutas (POST,PUT etc)
}

const routes = (app) => {
    app.use("/almacenadora/auth/", authRoutes)
    
    app.use("/almacenadora/categories/post/", categoriesRoutes)
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

export const initServer = ()=>{
    const app = express() // crea el server
    const port= process.env.PORT || 3007

    try {
        middlewares(app)
        conectarDb()
        routes(app)
        app.listen(port)
        console.log(`Server running on port ${port}`)

        if (flag) {
            crearAdmin()
        }
    } catch (error) {
        console.log(`Server init failed ${error}`)
    }
}