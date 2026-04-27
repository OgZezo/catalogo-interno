import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '../lib/cartContext';
import { sendSolicitationEmail } from '../lib/email';
import type { RequestForm } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
}

const BUYER_EMAIL = import.meta.env.VITE_BUYER_EMAIL ?? 'messias.bandeira65@gmail.com';

export default function CartDrawer({ open, onClose }: Props) {
  const { items, remove, update, clear, total } = useCart();
  const [step, setStep] = useState<'cart' | 'form' | 'sending' | 'done'>('cart');
  const [form, setForm] = useState({ name: '', email: '', department: '' });
  const [error, setError] = useState('');

const handleSend = async () => {
  // 1. Validação de segurança (Fast Fail)
  if (!form.name || !form.email || !form.department) {
    setError('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  setError('');
  setStep('sending');

  try {
    // 2. Montagem do Payload seguindo estritamente a interface RequestForm
    const req: RequestForm = {
      requester_name: form.name.trim(),
      requester_email: form.email.trim().toLowerCase(),
      department: form.department,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        justification: item.justification || ''
      }))
    };

    // 3. Chamada da lib que agora usa o supabase.functions.invoke
    await sendSolicitationEmail(req, BUYER_EMAIL);

    // 4. Feedback visual de sucesso
    setStep('done');

    // 5. Cleanup com Delay para o usuário ler a mensagem de sucesso
    setTimeout(() => {
      clear(); // Limpa o carrinho no Context
      setForm({ name: '', email: '', department: '' });
      setStep('cart');
      onClose();
    }, 3000);

    } catch (e: unknown) {
      // 6. Tratamento de erro detalhado
      const msg = e instanceof Error ? e.message : 'Erro inesperado no servidor.';
      console.error('Falha no checkout:', e);
      setError('Não conseguimos processar sua solicitação: ' + msg);
      setStep('form');
    }
};

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100, backdropFilter: 'blur(4px)' }}
          />
          {/* Drawer */}
          <motion.div
            key="drawer"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, maxWidth: '100vw',
              background: 'var(--bg2)', borderLeft: '1px solid var(--border)',
              zIndex: 101, display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {step === 'done' ? 'Solicitação Enviada!' : step === 'form' ? 'Seus Dados' : 'Carrinho'}
                </h2>
                {step === 'cart' && <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginTop: 2 }}>{total} item(s)</p>}
              </div>
              <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

              {step === 'done' && (
                <div style={{ textAlign: 'center', paddingTop: 60 }}>
                  <CheckCircle2 size={56} color="var(--green)" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>Solicitação enviada!</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.85rem' }}>
                    O email foi enviado para a equipe de compras. Você será contactado em breve.
                  </p>
                </div>
              )}

              {step === 'sending' && (
                <div style={{ textAlign: 'center', paddingTop: 60 }}>
                  <Loader2 size={40} color="var(--amber)" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: 'var(--text2)' }}>Enviando solicitação...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {step === 'form' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text2)', marginBottom: 4 }}>
                    Informe seus dados para enviarmos a solicitação ao setor de compras.
                  </p>
                  {[
                    { label: 'Nome completo *', key: 'name', type: 'text', placeholder: 'João da Silva' },
                    { label: 'Seu e-mail *', key: 'email', type: 'email', placeholder: 'joao@empresa.com' },
                    { label: 'Departamento *', key: 'department', type: 'text', placeholder: 'Tecnologia, Financeiro...' },
                  ].map(({ label, key, type, placeholder }) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{label}</label>
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={form[key as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                      />
                    </div>
                  ))}

                  {/* Summary */}
                  <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, marginTop: 4 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'var(--font-mono)' }}>Resumo</p>
                    {items.map((i) => (
                      <div key={i.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text2)', marginBottom: 4 }}>
                        <span>{i.product.name}</span>
                        <span style={{ color: 'var(--amber)' }}>×{i.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {error && <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>}
                </div>
              )}

              {step === 'cart' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {items.length === 0 && (
                    <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text3)' }}>
                      <p style={{ fontSize: '2rem', marginBottom: 12 }}>🛒</p>
                      <p>Nenhum item adicionado ainda.</p>
                    </div>
                  )}
                  {items.map((item) => (
                    <div key={item.product.id} style={{
                      background: 'var(--bg3)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)', padding: 14,
                    }}>
                      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                        <img src={item.product.image_url} alt={item.product.name}
                          style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 2 }}>{item.product.name}</p>
                          <span className="tag tag-amber">{item.product.category}</span>
                        </div>
                        <button onClick={() => remove(item.product.id)} style={{ background: 'none', color: 'var(--text3)', padding: 4, cursor: 'pointer', border: 'none', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>Qtd.</label>
                        <input
                          type="number" min={1} max={10} value={item.quantity}
                          onChange={(e) => update(item.product.id, Number(e.target.value), item.justification)}
                          style={{ width: 64 }}
                        />
                      </div>
                      <textarea
                        placeholder="Justificativa (opcional)..."
                        value={item.justification}
                        onChange={(e) => update(item.product.id, item.quantity, e.target.value)}
                        rows={2}
                        style={{ fontSize: '0.78rem', resize: 'none' }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {(step === 'cart' || step === 'form') && items.length > 0 && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                {step === 'form' && (
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setStep('cart')}>
                    Voltar
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                  onClick={step === 'cart' ? () => setStep('form') : handleSend}
                >
                  {step === 'cart' ? 'Continuar' : <><Send size={14} /> Enviar Solicitação</>}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
