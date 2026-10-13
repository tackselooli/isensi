import React from 'react';
import { Link } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';

const Cart = ({ item }) => {
  const { t, language } = useLanguage();
  const { _id, name, image, availableSeats, price, totalEnrolled } = item || {};

  const fmtPrice = (p) =>
    language === 'fa'
      ? Number(p || 0).toLocaleString('fa-IR') + ' ' + t('common.toman')
      : Number(p || 0).toLocaleString() + ' ' + t('common.toman');

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 duration-300 m-4">
      <img
        src={image || 'https://via.placeholder.com/300x200'}
        alt={name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200'; }}
      />
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3" style={{ minHeight: '3rem' }}>
          {name}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {t('classesPage.availableSeats')}:{' '}
          <span className="text-gray-700 dark:text-gray-200 font-semibold">{availableSeats ?? '—'}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          {t('common.price')}:{' '}
          <span className="text-gray-700 dark:text-gray-200 font-semibold">
            {price ? fmtPrice(price) : t('common.free')}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t('classesPage.enrolled')}:{' '}
          <span className="text-gray-700 dark:text-gray-200 font-semibold">{totalEnrolled ?? 0}</span>
        </p>
        <Link to={`/class/${_id}`} className="block">
          <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-2 rounded-lg shadow-lg font-bold transition-colors duration-300">
            {t('common.viewDetails')}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
