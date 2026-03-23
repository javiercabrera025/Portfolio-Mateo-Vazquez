import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';

// Variables de entorno necesarias en Vercel:
// SMTP_USER  → la cuenta Gmail que envía (ej: javicam@gmail.com)
// SMTP_PASS  → App Password de Google (Cuenta > Seguridad > Contraseñas de aplicación)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message, contactEmail } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
    contactEmail?: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const recipients = ['javicam@gmail.com'];
  if (contactEmail && contactEmail !== 'javicam@gmail.com') {
    recipients.push(contactEmail);
  }

  const mailOptions = {
    from: `"Portfolio Mateo Vázquez" <${process.env.SMTP_USER}>`,
    to: recipients.join(', '),
    replyTo: email,
    subject: `Nuevo contacto: ${subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="margin-bottom: 24px;">Nuevo mensaje de contacto</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #666; width: 100px;">Nombre</td>
            <td style="padding: 8px 0; font-weight: 500;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Email</td>
            <td style="padding: 8px 0;">
              <a href="mailto:${email}" style="color: inherit;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #666;">Asunto</td>
            <td style="padding: 8px 0;">${subject}</td>
          </tr>
        </table>
        <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
        <p style="color: #666; margin-bottom: 8px;">Mensaje:</p>
        <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
}
