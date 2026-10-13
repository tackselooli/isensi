import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import useLanguage from '../../hooks/useLanguage';
import useAxiosFetch from '../../hooks/useAxiosFetch';

// Static fallback product list (used when /classes returns nothing).
const FALLBACK_PRODUCTS = [
  { _id: 'p1', name: 'Resistance Band Set', price: 180000, image: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600' },
  { _id: 'p2', name: 'Yoga Mat Premium', price: 320000, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600' },
  { _id: 'p3', name: 'Adjustable Dumbbells', price: 1250000, image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600' },
  { _id: 'p4', name: 'Kettlebell 16kg', price: 680000, image: 'https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=600' },
  { _id: 'p5', name: 'Foam Roller', price: 145000, image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=600' },
  { _id: 'p6', name: 'Jump Rope Pro', price: 95000, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600' },
];

const Products = () => {
  const { t, dir, language } = useLanguage();
  const axiosFetch = useAxiosFetch();
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);

  useEffect(() => {
    axiosFetch
      .get('/classes')
      .then((res) => Array.isArray(res.data) && res.data.length > 0 && setProducts(res.data))
      .catch(() => {});
  }, [axiosFetch]);

  const fmtPrice = (p) => {
    if (language === 'fa') {
      return Number(p).toLocaleString('fa-IR') + ' ' + t('common.toman');
    }
    return Number(p).toLocaleString() + ' ' + t('common.toman');
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 pt-24 pb-16"
      dir={dir}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600 mb-3">
            {t('nav.products')}
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p._id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400'; }}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{p.name}</h3>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold mb-4">{fmtPrice(p.price || 0)}</p>
                <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold shadow-lg hover:scale-[1.02] transition-transform">
                  {t('common.addToCart')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
