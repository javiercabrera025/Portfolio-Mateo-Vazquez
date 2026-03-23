import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// Variable de entorno necesaria en Vercel:
// RESEND_API_KEY → tu API key de resend.com

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body as {
    name: string;
    email: string;
    subject: string;
    message: string;
  };

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Campos requeridos faltantes' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Mateo Vázquez <onboarding@resend.dev>',
      to: ['javicam@gmail.com'],
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
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Error al enviar el email' });
  }
}
