import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, LogOut, Zap, ArrowLeft, Search, Loader2, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getProducts, createProduct, updateProduct, deleteProduct, getSession, signOut } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../lib/mockData';
import ProductModal from '../components/ProductModal';
import type { Product } from '../types';

export default function AdminPage() {
  const nav = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) { nav('/admin/login'); return; }
      setAuthed(true);
      load();
    }).catch(() => {
      // Supabase not configured: allow demo mode
      setAuthed(true);
      setUseMock(true);
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    });
  }, []);

  const load = () => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch(() => { setUseMock(true); setProducts(MOCK_PRODUCTS); })
      .finally(() => setLoading(false));
  };

  const handleSave = async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (useMock) {
      if (editing) {
        setProducts((ps) => ps.map((p) => p.id === editing.id ? { ...p, ...data } : p));
      } else {
        const newP: Product = { ...data, id: Date.now().toString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        setProducts((ps) => [newP, ...ps]);
      }
      return;
    }
    if (editing) await updateProduct(editing.id, data);
    else await createProduct(data);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    setDeleting(id);
    if (useMock) { setProducts((ps) => ps.filter((p) => p.id !== id)); setDeleting(null); return; }
    try { await deleteProduct(id); load(); }
    finally { setDeleting(null); }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = async () => { await signOut(); nav('/admin/login'); };

  if (authed === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={28} color="var(--amber)" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* <div style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#0a0a0b" />
            </div> */}
            <img style={{ width: 42, height: 42}} src="/logo.svg" alt="logo" />
            <div style={{ height: 20, width: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
              Painel Admin
            </span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.8rem' }}>
              <ArrowLeft size={14} /> Ver catálogo
            </Link>
            <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: '0.8rem' }} onClick={handleLogout}>
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        {/* Demo notice */}
        {useMock && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'center' }}>
            <ShieldAlert size={16} color="var(--amber)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.82rem', color: 'var(--text2)' }}>
              <strong style={{ color: 'var(--amber)' }}>Modo demo</strong> — Supabase não configurado. Dados são locais e não persistem. Configure as variáveis de ambiente para ativar o banco de dados.
            </p>
          </motion.div>
        )}

        {/* Title row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>Produtos</h1>
            <p style={{ color: 'var(--text3)', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}>
              {products.length} produto(s) cadastrado(s)
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
            <Plus size={15} /> Novo Produto
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', maxWidth: 360, marginBottom: 24 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input placeholder="Buscar por nome ou categoria..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 60, color: 'var(--text3)' }}>
            <Loader2 size={28} color="var(--amber)" style={{ animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p>Carregando produtos...</p>
          </div>
        ) : (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg3)' }}>
                  {['Produto', 'Categoria', 'Status', 'Ações'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text3)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: 40, textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem' }}>Nenhum produto encontrado.</td></tr>
                ) : filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {p.image_url && (
                          <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8, flexShrink: 0, background: 'var(--bg3)' }} />
                        )}
                        <div>
                          <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</p>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text3)', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden', maxWidth: 280 }}>{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="tag tag-amber">{p.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={p.available ? 'tag tag-green' : 'tag tag-red'}>
                        {p.available ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => { setEditing(p); setModalOpen(true); }}>
                          <Pencil size={13} /> Editar
                        </button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                          onClick={() => handleDelete(p.id)} disabled={deleting === p.id}>
                          {deleting === p.id ? <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={13} />}
                          Excluir
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        product={editing}
      />
    </div>
  );
}
