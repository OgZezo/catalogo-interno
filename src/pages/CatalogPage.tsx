import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Search, Zap, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartProvider, useCart } from '../lib/cartContext';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { getProducts } from '../lib/supabase';
import { MOCK_PRODUCTS } from '../lib/mockData';
import type { Product } from '../types';

const CATEGORIES = ['Todos', 'Headsets', 'Mouses', 'Mousepads', 'Monitores', 'Hubs USB', 'Teclados', 'Webcams', 'Outros'];

function CatalogInner() {
  const { total } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setProducts(MOCK_PRODUCTS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === 'Todos' || p.category === category;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, search, category]);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(10,10,11,0.85)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* <div style={{ width: 32, height: 32, background: 'var(--amber)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={18} color="#0a0a0b" />
            </div> */}
            <img style={{ width: 42, height: 42}} src="/logo.svg" alt="logo" />
            <div>
              <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.01em' }}>Adriano & </span>
              <span style={{ color: 'var(--amber)', fontWeight: 800, fontSize: '1rem' }}>Couto</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/admin" style={{ color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', transition: 'color 0.2s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text2)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}>
              <Settings size={14} /> Admin
            </Link>
            <button
              className="btn btn-primary"
              style={{ position: 'relative', padding: '8px 16px' }}
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={16} />
              Carrinho
              {total > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  style={{
                    position: 'absolute', top: -7, right: -7,
                    background: 'var(--bg)', color: 'var(--amber)',
                    border: '1.5px solid var(--amber)',
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.68rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  }}>
                  {total}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        maxWidth: 1200, margin: '0 auto', padding: '72px 24px 48px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center',
      }}>
        <div>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="tag tag-amber" style={{ marginBottom: 16, display: 'inline-flex' }}>
              <Zap size={10} /> Catálogo interno
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16 }}>
              Solicite seus<br />
              <span style={{ color: 'var(--amber)' }}>equipamentos</span><br />
              com agilidade.
            </h1>
            <p style={{ color: 'var(--text2)', fontSize: '1rem', lineHeight: 1.6, maxWidth: 440 }}>
              Escolha os equipamentos que você precisa, adicione ao carrinho e envie a solicitação diretamente para o setor de compras em segundos.
            </p>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
            padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          }}>
          {[
            { n: products.filter(p => p.available).length, label: 'Disponíveis', color: 'var(--green)' },
            { n: CATEGORIES.length - 1, label: 'Categorias', color: 'var(--amber)' },
            { n: '24h', label: 'Resposta média para suporte', color: 'var(--text)' },
            { n: '100%', label: 'Digital', color: 'var(--text)' },
          ].map(({ n, label, color }) => (
            <div key={label} style={{ background: 'var(--bg3)', borderRadius: 8, padding: '14px 16px' }}>
              <p style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{n}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Filters */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 32px' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              placeholder="Buscar equipamento..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '7px 14px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font-head)', transition: 'all 0.2s',
                  background: category === cat ? 'var(--amber)' : 'var(--bg3)',
                  color: category === cat ? '#0a0a0b' : 'var(--text2)',
                  border: category === cat ? 'none' : '1px solid var(--border)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{ height: 340, background: 'var(--bg2)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: 80, color: 'var(--text3)' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: '1rem' }}>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
            {filtered.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default function CatalogPage() {
  return (
    <CartProvider>
      <CatalogInner />
    </CartProvider>
  );
}
