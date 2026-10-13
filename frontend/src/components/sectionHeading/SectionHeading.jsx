import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useLanguage from '../../hooks/useLanguage';

// SectionHeading — title with an optional "See all" link.
const SectionHeading = ({ title, link }) => {
  const { t } = useLanguage();

  return (
    <div className="relative mb-8 flex items-center justify-between">
      {/* Placeholder for alignment (empty) */}
      <div className="w-20 hidden md:block"></div>

      {/* Title in the Center */}
      <h2 className="flex-1 text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 text-center">
        {title}
      </h2>

      {/* See More Button on the Right (or Left in LTR) */}
      {link && (
        <div className="pr-4">
          <Link
            to={link}
            className="inline-block px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300"
          >
            {t('common.seeAll')}
          </Link>
        </div>
      )}
    </div>
  );
};

SectionHeading.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default SectionHeading;
