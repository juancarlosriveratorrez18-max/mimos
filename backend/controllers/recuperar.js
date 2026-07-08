import { crearCodigoRecuperacion, obtenerCodigoValido, marcarComoUsado } from '../models/recuperar.js';
import { obtenerPorEmail, actualizarUsuario } from '../models/user.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// enviar código de recuperación
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'El correo electrónico es requerido' });
        }

        const { data: usuario, error: errorUsuario } = await obtenerPorEmail(email);
        if (errorUsuario || !usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();

        const { error: errorCodigo } = await crearCodigoRecuperacion(usuario.id, codigo);
        if (errorCodigo) {
            return res.status(500).json({ error: 'Error al generar el código de recuperación' });
        }

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Tu código de recuperación es: ${codigo}`,
            html: `
                <h2>Recuperación de contraseña</h2>
                <p>Hola ${usuario.nombre || 'Usuario'},</p>
                <p>Tu código de recuperación es:</p>
                <h1 style="color:#39a900; font-size:36px;">${codigo}</h1>
                <p>Este código es válido por 15 minutos. Si no solicitaste este código, por favor ignora este correo.</p>
                <p>Gracias,</p>
                <p>El equipo de soporte</p>
                <p>No compartas este código con nadie</p>
            `
        });

        return res.status(200).json({ message: 'Código de recuperación enviado al correo' });

    } catch (error) {
        console.error('Error en forgotPassword:', error);
        return res.status(500).json({ error: 'Error al enviar el código de recuperación' });
    }
};

// verificar código y cambiar contraseña
export const verifyCode = async (req, res) => {
    try {
        const { email, codigo, newPassword } = req.body;

        if (!email || !codigo || !newPassword) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const { data: usuario } = await obtenerPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { data: codigoRecord } = await obtenerCodigoValido(usuario.id, codigo);
        if (!codigoRecord) {
            return res.status(400).json({ error: 'Código de recuperación inválido o expirado' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const { error: errorUpdate } = await actualizarUsuario(usuario.id, { password: hashedPassword });
        if (errorUpdate) {
            return res.status(500).json({ error: 'Error al actualizar la contraseña' });
        }

        await marcarComoUsado(codigoRecord.id);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Contraseña cambiada exitosamente',
            html: `
                <div style="font-family:sans-serif; max-width:600px; margin:0 auto; padding:20px; border:1px solid #ddd; border-radius:5px;">
                    <h2 style="color:#333;">Notificación de cambio de contraseña</h2>
                    <p>Hola ${usuario.nombre || 'Usuario'},</p>
                    <p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
                    <div style="background-color:#f9f9f9; padding:15px; border-left:4px solid #39a900; margin-top:20px;">
                        <p style="margin:0; font-size:14px; color:#555;">
                            Si no realizaste este cambio, te recomendamos que cambies tu contraseña inmediatamente y contactes a nuestro equipo de soporte.
                        </p>
                    </div>
                    <p style="color:#555; font-size:14px; margin-top:30px;">Gracias,</p>
                </div>
            `
        });

        return res.status(200).json({ message: 'Contraseña cambiada exitosamente' });

    } catch (error) {
        console.error('Error en verifyCode:', error);
        return res.status(500).json({ error: 'Error al verificar el código o cambiar la contraseña' });
    }
};