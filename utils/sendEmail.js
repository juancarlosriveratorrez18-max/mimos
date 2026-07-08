import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const enviarConfirmacionPedido = async (email, nombreUsuario, pedidoId, total) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `✅ Pedido Confirmado - Heladería Minions #${pedidoId}`,
        html: `
            <h1 style="color: green;">¡Gracias por tu pedido!</h1>

            <p>Hola ${nombreUsuario},</p>

            <p>Tu pedido ha sido confirmado exitosamente.</p>

            <p><strong>Número de Pedido:</strong> #${pedidoId}</p>

            <p><strong>Total:</strong> $${total.toLocaleString('es-CO')}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Correo enviado' };
    } catch (error) {
        console.error('Error al enviar correo:', error);
        return { success: false, error: error.message };
    }
};