import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../../features/articles/articleThunks';
import { motion } from 'framer-motion';
import ArticleCard from '../Home/articles/articleCard';
import SectionHeading from '../../components/sectionHeading/SectionHeading';
import Pagination from '../../components/Pagination/Pagination';
import useLanguage from '../../hooks/useLanguage';

const ArticlesPage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { articles, status, error, pagination } = useSelector((state) => state.articles);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6);

  useEffect(() => {
    dispatch(fetchArticles({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (page) => setCurrentPage(page);

  if (status === 'loading') {
    return <p className="text-center text-gray-600 mt-32">{t('common.loading')}</p>;
  }
  if (status === 'failed') {
    return (
      <p className="text-center text-red-600 mt-32">
        {t('articlesPage.loadError')}: {error}
      </p>
    );
  }

  return (
    <div className="w-full px-4 md:w-[85%] mx-auto my-24 md:my-32">
      <div className="relative text-center mb-16">
        <SectionHeading title={t('articlesPage.title')} />
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
      >
        {(articles || []).map((article, index) => (
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

      {pagination?.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ArticlesPage;
