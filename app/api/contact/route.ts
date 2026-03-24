import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { name, email, subject, message, to } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: 'Campos requeridos faltantes' },
      { status: 400 }
    );
  }

  const recipients = ['javicam@gmail.com'];
  if (to && to !== 'javicam@gmail.com') recipients.push(to);

  try {
    await resend.emails.send({
      from: 'Portfolio Mateo Vázquez <no-reply@mateovazquez.uy>',
      to: recipients,
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
      `
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error al enviar el email' },
      { status: 500 }
    );
  }
}
