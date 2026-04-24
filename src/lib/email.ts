import type { RequestForm } from '../types';

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL ?? 'jose@adrianoecoutoadv.com';

export async function sendRequestEmail(
  form: RequestForm,
  buyerEmail: string
): Promise<void> {
  const itemsHtml = form.items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #2a2a32;">
            <strong style="color:#e8e8ec;">${item.product.name}</strong>
            <br/><span style="color:#9898a8;font-size:12px;">${item.product.category}</span>
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #2a2a32;text-align:center;color:#f5a623;font-weight:700;">
            ${item.quantity}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #2a2a32;color:#9898a8;font-size:13px;">
            ${item.justification || '—'}
          </td>
        </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0b;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#111114;border:1px solid #2a2a32;border-radius:12px 12px 0 0;padding:28px 32px;border-bottom:none;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="color:#e8e8ec;font-size:18px;font-weight:800;vertical-align:middle;">⚡ Equipa<span style="color:#f5a623;">Tech</span></span>
                </td>
                <td align="right">
                  <span style="background:rgba(245,166,35,0.12);color:#f5a623;border:1px solid rgba(245,166,35,0.25);border-radius:999px;padding:4px 12px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">Nova Solicitação</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#111114;border:1px solid #2a2a32;border-top:none;border-bottom:none;padding:0 32px 28px;">
            <h1 style="color:#e8e8ec;font-size:22px;font-weight:800;margin:0 0 8px;">Solicitação de Equipamentos</h1>
            <p style="color:#9898a8;font-size:14px;margin:0 0 28px;">
              Recebida em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}.
            </p>

            <!-- Requester info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1f;border:1px solid #2a2a32;border-radius:8px;margin-bottom:24px;">
              <tr>
                <td style="padding:16px 20px;">
                  <p style="color:#5a5a6a;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 12px;">Dados do Solicitante</p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="color:#9898a8;font-size:13px;padding:3px 0;width:110px;">Nome</td>
                      <td style="color:#e8e8ec;font-size:13px;font-weight:600;padding:3px 0;">${form.requester_name}</td>
                    </tr>
                    <tr>
                      <td style="color:#9898a8;font-size:13px;padding:3px 0;">E-mail</td>
                      <td style="padding:3px 0;"><a href="mailto:${form.requester_email}" style="color:#f5a623;font-size:13px;font-weight:600;text-decoration:none;">${form.requester_email}</a></td>
                    </tr>
                    <tr>
                      <td style="color:#9898a8;font-size:13px;padding:3px 0;">Departamento</td>
                      <td style="color:#e8e8ec;font-size:13px;font-weight:600;padding:3px 0;">${form.department}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- Items table -->
            <p style="color:#5a5a6a;font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 10px;">Itens Solicitados</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1f;border:1px solid #2a2a32;border-radius:8px;overflow:hidden;">
              <thead>
                <tr style="background:#0a0a0b;">
                  <th style="padding:10px 12px;text-align:left;color:#5a5a6a;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;">Produto</th>
                  <th style="padding:10px 12px;text-align:center;color:#5a5a6a;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;">Qtd.</th>
                  <th style="padding:10px 12px;text-align:left;color:#5a5a6a;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:500;">Justificativa</th>
                </tr>
              </thead>
              <tbody>${itemsHtml}</tbody>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0a0a0b;border:1px solid #2a2a32;border-top:1px solid #2a2a32;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
            <p style="color:#5a5a6a;font-size:12px;margin:0;">
              Gerado automaticamente pelo EquipaTech. Responda ao solicitante:
              <a href="mailto:${form.requester_email}" style="color:#f5a623;text-decoration:none;">${form.requester_email}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `EquipaTech <${FROM_EMAIL}>`,
      to: [buyerEmail],
      reply_to: form.requester_email,
      subject: `[Solicitação] ${form.requester_name} — ${form.department}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message?: string })?.message ?? 'Erro ao enviar e-mail via Resend.');
  }
}