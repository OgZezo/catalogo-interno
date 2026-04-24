import { motion } from 'framer-motion';
import { ShoppingCart, Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types';
import { useCart } from '../lib/cartContext';

export default function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const [added, setAdded] = useState(false);
  const inCart = items.some((i) => i.product.id === product.id);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s, transform 0.2s',
        position: 'relative',
      }}
      whileHover={{ y: -4, borderColor: 'rgba(245,166,35,0.4)' }}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden', background: 'var(--bg3)' }}>
        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <div style={{
          position: 'absolute', top: 10, left: 10,
        }}>
          <span className="tag tag-amber">{product.category}</span>
        </div>
        {!product.available && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(10,10,11,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--text2)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Indisponível
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, marginBottom: 6 }}>{product.name}</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text2)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.description}
          </p>
        </div>

        {/* Specs */}
        {Object.keys(product.specs).length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
              <span key={k} style={{
                fontSize: '0.68rem', fontFamily: 'var(--font-mono)',
                color: 'var(--text3)', background: 'var(--bg3)',
                border: '1px solid var(--border)', borderRadius: 4,
                padding: '2px 7px',
              }}>
                {k}: <span style={{ color: 'var(--text2)' }}>{v}</span>
              </span>
            ))}
          </div>
        )}

        {/* Add button */}
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          disabled={!product.available}
          style={{
            marginTop: 'auto',
            justifyContent: 'center',
            opacity: product.available ? 1 : 0.4,
            background: inCart ? 'rgba(74,222,128,0.15)' : undefined,
            color: inCart ? 'var(--green)' : undefined,
            border: inCart ? '1px solid rgba(74,222,128,0.3)' : undefined,
          }}
        >
          {added ? (
            <><CheckCircle size={15} /> Adicionado!</>
          ) : inCart ? (
            <><Plus size={15} /> Adicionar mais</>
          ) : (
            <><ShoppingCart size={15} /> Solicitar</>
          )}
        </button>
      </div>
    </motion.div>
  );
}
