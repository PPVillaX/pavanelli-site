import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { getContactSettings } from '@/lib/settings';

// Rate limiting: simple in-memory store (use Redis in production)
const rateLimit = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now - entry.lastReset > RATE_WINDOW) {
    rateLimit.set(ip, { count: 1, lastReset: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT) {
    return true;
  }

  entry.count++;
  return false;
}

export async function POST(request: Request) {
  try {
    // Rate limiting
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0] || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Muitas mensagens enviadas. Tente novamente mais tarde.' },
        { status: 429 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, e-mail e mensagem são obrigatórios.' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de e-mail inválido.' },
        { status: 400 }
      );
    }

    // Save to Supabase
    const supabase = createAdminClient();
    const { error: dbError } = await supabase.from('contacts').insert({
      name,
      email,
      phone: phone || null,
      message,
    });

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json(
        { error: 'Erro ao salvar a mensagem. Tente novamente.' },
        { status: 500 }
      );
    }

    // Send email notification via Resend (if API key is configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const contactSettings = await getContactSettings();
        const notificationEmail = contactSettings.notification_email || contactSettings.contact_email;

        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'contato@pavanelliarquitetura.com.br',
          to: notificationEmail,
          subject: `[Site] Nova mensagem de ${name}`,
          html: `
            <h2>Nova mensagem do site</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            ${phone ? `<p><strong>Telefone:</strong> ${phone}</p>` : ''}
            <p><strong>Mensagem:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
            <p style="color: #999; font-size: 12px;">Enviado pelo formulário de contato do site Pavanelli Arquitetura.</p>
          `,
        });
      } catch (emailError) {
        // Don't fail the request if email fails — message is already saved
        console.error('Resend email error:', emailError);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Mensagem enviada com sucesso!' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    );
  }
}
