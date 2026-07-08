// controllers/Auth.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { crearUsuario, obtenerPorEmail } from '../models/user.js'; // ← .js + obtenerPorEmail

// registro
export const registro = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // validar datos
        if (!nombre || !email || !password) {
            return res.status(400).json({
                error: "Faltan datos obligatorios"
            });
        }

        // verificamos que el email no existe
        const { data: usuarioExiste } = await obtenerPorEmail(email); // ← ahora está importada
        if (usuarioExiste) {
            return res.status(400).json({
                error: "El email ya está registrado"
            });
        }

        // encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // rol por defecto
        const rolPorDefecto = "usuarios";

        // guardar en la base de datos
        const { data: nuevoUsuario, error } = await crearUsuario(
            nombre,
            email,
            hashedPassword,
            rolPorDefecto
        );

        if (error) {
            return res.status(500).json({
                error: "Error al crear el usuario"
            });
        }

        return res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: {
                id: nuevoUsuario[0].id,        // ← nuevoUsuario, no data
                nombre: nuevoUsuario[0].nombre,
                email: nuevoUsuario[0].email,
                rol: nuevoUsuario[0].rol
            }
        });

    } catch (error) {
        console.log("Error en el registro:", error); // ← console, no concole
        return res.status(500).json({
            error: error.message
        });
    }
};

//crear login

export const login = async (req,res) => {
    try {
        const {email,password} = req.body;
    // validamos que todos los campos esten llenos
    if (!email || !password){
        return res.status(400).json({
     
            error: "todos los campos son requeridos: email y password"
        });
    }

// validamos si el correo existe
const {data: usuario} = await obtenerPorEmail(email);
if (!usuario){
    return res.status(400).json({
        error: "El email no está registrado"
    });
}

// validamos la contraseña
const passwordValida = await bcrypt.compare(password, usuario.password);
if (!passwordValida){
    return res.status(400).json({
        error: "Contraseña incorrecta"
    });
}

//generamos el token JWT
    const token = jwt.sign(
        {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol
        },
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );

    return res.status(200).json({
        message: "Login exitoso",
        token
    });

} catch (error){
    console.error("Error en el login:", error);
        return res.status(500).json({
            error: error.message
        });
}

};