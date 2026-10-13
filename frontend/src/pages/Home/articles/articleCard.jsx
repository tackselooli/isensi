import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLanguage from '../../../hooks/useLanguage';

// ArticleCard — single article preview shown on the home and articles pages.
// Falls back to a placeholder image if `imageUrl` is missing or fails to load.
const PLACEHOLDER = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800';

const ArticleCard = ({ article }) => {
  const { t, language } = useLanguage();
  const { _id, title, imageUrl, authorName, publicationDate } = article || {};

  const formattedDate = publicationDate
    ? new Date(publicationDate).toLocaleDateString(language === 'fa' ? 'fa-IR' : 'en-US')
    : '';

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative w-full lg:h-[630px] sm:h-[650px] md:h-[700px] bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      <img
        src={imageUrl || PLACEHOLDER}
        alt={title || 'Article'}
        className="w-full h-[80%] object-cover object-center opacity-70"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black to-transparent">
        <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
          {title}
        </h2>
        <p className="text-gray-300 text-sm mb-4">
          {t('articlesPage.author')}: {authorName} | {t('articlesPage.publishDate')}: {formattedDate}
        </p>
        <Link
          to={`/articles/${_id}`}
          className="bg-white text-black px-4 py-2 rounded-lg text-center font-bold hover:bg-gray-300 transition-all"
        >
          {t('common.viewArticle')}
        </Link>
      </div>
    </motion.div>
  );
};

export default ArticleCard;
