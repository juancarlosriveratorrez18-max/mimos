import express from "express";
import dotenv from "dotenv";
import { conectaDB,supabase } from "./config/supabase.js";
import AuthRoutes from "./routes/auth.js";
import UserRoutes from "./routes/user.js";
import HeladoRoutes from "./routes/helados.js";
//carga de variables de entorno
dotenv.config();
conectaDB();

//creamos la aplicacion de express
const app = express();

//leer el json 
app.use(express.json());

//creamos la ruta 
app.get("/", (req, res) => {
    res.json({
        Mensaje: "Bienvenido al backend de MIMOS",
        Estado: "En linea",
        Version: "1.0.0"
    });
});

//rutas de autenticacion
app.use('/auth', AuthRoutes);
app.use('/user', UserRoutes);
app.use('/api', HeladoRoutes);

//configuramos el puerto
const PORT = 3000;

//PONER A ESCUCHAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});