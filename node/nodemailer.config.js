const nodemailer = require('nodemailer');

// Transporter usando Mailinator SMTP (solo para pruebas, no para producción)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'coralillo18kim@gmail.com',
    pass: 'fsla nstl zezu xvoz'
  }
});
/**
 * Envía un correo usando Mailinator
 * @param {string} to - destinatario (ejemplo: prueba@mailinator.com)
 * @param {string} subject - asunto del correo
 * @param {string} text - cuerpo del correo
 */
async function enviarCorreo(to, { nombre, fechaIngreso, fechaSalida, numPersonas   }) {
  const mailOptions = {
    from: '"Stillalp" <reservas@stillalp.com>',
    to,
    subject: 'Confirmación de Reserva',
    html: plantillaCorreo({ nombre, fechaIngreso, fechaSalida, numPersonas }),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error enviando correo:', error);
    throw error;
  }
}

function plantillaCorreo({ nombre, fechaIngreso, fechaSalida, numPersonas }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #222;">
      <h2>¡Reserva confirmada!</h2>
      <p>Hola <strong>${nombre}</strong>,</p>
      <p>Tu reservación en nuestro hotel ha sido registrada con éxito. Aquí tienes los detalles:</p>
      <ul>
        <li><strong>Fecha de ingreso:</strong> ${fechaIngreso}</li>
        <li><strong>Fecha de salida:</strong> ${fechaSalida}</li>
        <li><strong>Número de personas:</strong> ${numPersonas}</li>
      </ul>
      <p>¡Gracias por elegirnos! Te esperamos.</p>
      <hr>
      <small>Este es un correo automático, por favor no respondas a este mensaje.</small>
    </div>
  `;
}

module.exports = { enviarCorreo };