import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { hash } from "argon2";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { dbConnection } from "./mongo.js";

import authRoutes from "../src/auth/auth.routes.js";
import categoriesRoutes from "../src/categories/categories.routes.js";
import proveedoresRoutes from "../src/proveedores/proveedores.routes.js";
import productsRoutes from "../src/products/products.routes.js";
import usersRoutes from "../src/users/user.routes.js";
import inputRoutes from "../src/inputControl/input.routes.js";
import outputRoutes from "../src/outputControl/output.routes.js";
import movementsRoutes from "../src/movements/movement.routes.js";
import clientsRoutes from "../src/clients/client.routes.js";
import notificationsRoutes from "../src/notifications/notification.routes.js";
import User from "../src/users/user.model.js";
import Category from "../src/categories/category.model.js";
import Role from "../src/role/role.model.js";

import { checkStockAndExp } from "../src/alerts/alerts.controller.js";

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cors());
  app.use(helmet());
  app.use(morgan("dev"));
};

const routes = (app) => {
  app.use("/almacenadora/auth/", authRoutes);
  app.use("/almacenadora/categories/", categoriesRoutes);
  app.use("/almacenadora/proveedores/", proveedoresRoutes);
  app.use("/almacenadora/products/", productsRoutes);
  app.use("/almacenadora/users/", usersRoutes);
  app.use("/almacenadora/input/", inputRoutes);
  app.use("/almacenadora/output/", outputRoutes);
  app.use("/almacenadora/movements/", movementsRoutes);
  app.use("/almacenadora/clients/", clientsRoutes);
  app.use("/almacenadora/notifications/", notificationsRoutes);
};

const conectarDb = async () => {
  try {
    await dbConnection();
    console.log("DB Online");
  } catch (error) {
    console.log("Error al conectarse a la DB", error);
    throw error; // Propagar el error para manejo superior
  }
};

// Crear admin
export const crearAdmin = async () => {
  try {
    const existeAdmin = await User.findOne({ email: "admin@admin.com" });

    if (!existeAdmin) {
      const hashedPass = await hash("1234567");

      const adminUser = new User({
        name: "Admin",
        email: "admin@admin.com",
        password: hashedPass,
        role: "ADMIN_ROLE",
      });

      await adminUser.save();
      console.log("Admin creado exitosamente");
    } else {
      console.log("El admin ya existe");
    }
  } catch (error) {
    console.error("Error al crear admin:", error);
    throw error;
  }
};

// Crear categoría por defecto
export const crearCate = async () => {
  try {
    const existeCate = await Category.findOne({ name: "Productos Sin Categoria" });

    if (!existeCate) {
      const defaultCategory = new Category({
        name: "Productos Sin Categoria",
        description: "Categoria por defecto para productos sin categoría",
      });

      await defaultCategory.save();
      console.log("Categoría por defecto creada");
    } else {
      console.log("La categoría por defecto ya existe");
    }
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

// Crear roles por defecto
export const crearRol = async () => {
  try {
    const rolesPorDefecto = [
      {
        role: "ADMIN_ROLE",
        description: "Rol para administradores del sistema",
      },
      {
        role: "USER_ROLE",
        description: "Rol para usuarios estándar",
      },
    ];

    for (const rol of rolesPorDefecto) {
      const existeRol = await Role.findOne({ role: rol.role });
      if (!existeRol) {
        await Role.create(rol);
        console.log(`Rol ${rol.role} creado`);
      } else {
        console.log(`El rol ${rol.role} ya existe`);
      }
    }
  } catch (error) {
    console.error("Error al crear roles:", error);
    throw error;
  }
};

// Configuración de alertas
const setupAlertas = () => {
  setInterval(() => {
    checkStockAndExp();
  }, 60000); // Cada 1 minuto (60000 ms)
};

// Configuración del servidor
const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const initServer = async () => {
  const port = process.env.PORT || 3007;

  try {
    // Configuración inicial
    middlewares(app);
    await conectarDb();
    routes(app);

    // Creación de datos iniciales
    await crearRol();
    await crearCate();
    await crearAdmin();

    // Configurar Socket.io
    io.on("connection", (socket) => {
      console.log("Nuevo cliente conectado");
      socket.on("disconnect", () => {
        console.log("Cliente desconectado");
      });
    });

    
    setupAlertas();

    
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

export { io };