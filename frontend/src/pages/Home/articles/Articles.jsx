import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../../features/articles/articleThunks';
import { motion } from 'framer-motion';
import ArticleCard from './articleCard';
import SectionHeading from '../../../components/sectionHeading/SectionHeading';
import useLanguage from '../../../hooks/useLanguage';

// NOTE: the previous version declared the component as `const articles = () => {...}`
// (lowercase) and then shadowed it inside with `const { articles } = useSelector(...)`.
// Both bugs are fixed here: the component is `Articles` (PascalCase) and the
// destructured array is renamed to `articleList`.
const Articles = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { articles: articleList, status, error } = useSelector((state) => state.articles);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(3);

  useEffect(() => {
    dispatch(fetchArticles({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  if (status === 'loading') {
    return <p className="text-center text-gray-600">{t('common.loading')}</p>;
  }
  if (status === 'failed') {
    return (
      <p className="text-center text-red-600">
        {t('articlesPage.loadError')}: {error}
      </p>
    );
  }

  return (
    <div className="w-full px-4 md:w-[85%] mx-auto my-24 md:my-32">
      <SectionHeading title={t('home.recentArticles')} link="/articles" />

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
      >
        {(articleList || []).map((article, index) => (
          <motion.div
            key={article._id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Articles;
