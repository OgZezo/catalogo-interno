import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handshake de CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { form, buyerEmail } = await req.json()

    // 2. Montagem do HTML no Servidor (Igual ao KawaCoffee)
    const itemsHtml = form.items.map((item: any) => `
      <tr>
        <td style="padding:12px; border-bottom:1px solid #2a2a32; color:#e8e8ec;">
          <b>${item.product.name}</b><br/>
          <small>${item.product.category}</small>
        </td>
        <td style="padding:12px; border-bottom:1px solid #2a2a32; text-align:center; color:#f5a623;">
          ${item.quantity}
        </td>
      </tr>
    `).join('')

    // 3. Chamada segura ao Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Departamento de TI - Adriano e Couto<${Deno.env.get('FROM_EMAIL')}>`,
        to: [buyerEmail, "jose@adrianoecoutoadv.com"], // Lista de destinatários
        reply_to: form.requester_email,
        subject: `[SOLICITAÇÃO DE EQUIPAMENTOS] ${form.requester_name} - ${form.department}`,
        html: `<div style="background:#0a0a0b; color:#fff; padding:20px;">
                <h2>Nova Solicitação de Equipamentos</h2>
                <table width="100%">${itemsHtml}</table>
               </div>`,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200 
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})