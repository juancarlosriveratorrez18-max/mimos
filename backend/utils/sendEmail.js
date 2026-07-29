import nodemailer from 'nodemailer';

console.log('EMAIL_USER cargado:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD cargado:', process.env.EMAIL_PASSWORD ? 'SI (oculto)' : 'NO - undefined');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verifica la conexión con Gmail al arrancar el servidor
transporter.verify((error, success) => {
    if (error) {
        console.error('❌ Error de conexión con Gmail:', error);
    } else {
        console.log('✅ Servidor de correo listo para enviar mensajes');
    }
});

export const enviarConfirmacionPedido = async (email, nombreUsuario, pedidoId, total) => {
    console.log('📧 Intentando enviar correo a:', email);

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
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Correo enviado exitosamente. ID:', info.messageId);
        return { success: true, message: 'Correo enviado' };
    } catch (error) {
        console.error('❌ Error al enviar correo:', error);
        return { success: false, error: error.message };
    }
};