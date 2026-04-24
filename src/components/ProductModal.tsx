import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import type { Product } from '../types';

const CATEGORIES = ['Headsets', 'Mouses', 'Mousepads', 'Monitores', 'Hubs USB', 'Teclados', 'Webcams', 'Outros'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  product?: Product | null;
}

const empty = (): Omit<Product, 'id' | 'created_at' | 'updated_at'> => ({
  name: '', description: '', category: 'Headsets',
  image_url: '', available: true, specs: {},
});

export default function ProductModal({ open, onClose, onSave, product }: Props) {
  const [form, setForm] = useState(empty());
  const [specs, setSpecs] = useState<[string, string][]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      const { id, created_at, updated_at, specs: s, ...rest } = product;
      void id; void created_at; void updated_at;
      setForm({ ...rest, specs: {} });
      setSpecs(Object.entries(s));
    } else {
      setForm(empty());
      setSpecs([]);
    }
    setError('');
  }, [product, open]);

  const addSpec = () => setSpecs((s) => [...s, ['', '']]);
  const removeSpec = (i: number) => setSpecs((s) => s.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, k: string, v: string) =>
    setSpecs((s) => s.map((entry, idx) => idx === i ? [k, v] : entry));

  const handleSave = async () => {
    if (!form.name || !form.description || !form.category) {
      setError('Preencha nome, descrição e categoria.'); return;
    }
    setSaving(true); setError('');
    try {
      const specObj = Object.fromEntries(specs.filter(([k]) => k.trim()));
      await onSave({ ...form, specs: specObj });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, backdropFilter: 'blur(4px)' }} />
          <motion.div key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
            style={{
              position: 'fixed', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '24px 16px',
              zIndex: 201, pointerEvents: 'none',
            }}
          >
          <div style={{
            width: '100%', maxWidth: 560, maxHeight: '100%', overflowY: 'auto',
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            padding: 28, pointerEvents: 'all',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{product ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button className="btn btn-ghost" style={{ padding: '6px 10px' }} onClick={onClose}><X size={16} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Nome *', key: 'name', type: 'text', placeholder: 'Ex: Headset HyperX Cloud II' },
                { label: 'URL da Imagem', key: 'image_url', type: 'url', placeholder: 'https://...' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>Descrição *</label>
                <textarea rows={3} placeholder="Descreva o produto..." value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>Categoria *</label>
                  <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text2)', marginBottom: 6, fontWeight: 600 }}>Disponibilidade</label>
                  <select value={form.available ? 'true' : 'false'} onChange={(e) => setForm((f) => ({ ...f, available: e.target.value === 'true' }))}>
                    <option value="true">Disponível</option>
                    <option value="false">Indisponível</option>
                  </select>
                </div>
              </div>

              {/* Specs */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text2)', fontWeight: 600 }}>Especificações</label>
                  <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={addSpec}>
                    <Plus size={12} /> Adicionar
                  </button>
                </div>
                {specs.map(([k, v], i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                    <input placeholder="Campo" value={k} onChange={(e) => updateSpec(i, e.target.value, v)} style={{ flex: 1 }} />
                    <input placeholder="Valor" value={v} onChange={(e) => updateSpec(i, k, e.target.value)} style={{ flex: 1 }} />
                    <button onClick={() => removeSpec(i)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 4 }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--red)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {error && <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 12, marginBottom: -4 }}>{error}</p>}

            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={onClose}>Cancelar</button>
              <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleSave} disabled={saving}>
                {saving ? 'Salvando...' : product ? 'Salvar Alterações' : 'Criar Produto'}
              </button>
            </div>
          </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}