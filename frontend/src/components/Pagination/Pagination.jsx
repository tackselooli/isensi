import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-12">
      <motion.div
        className="flex items-center "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Previous Button */}
        <Link
          to={`?page=${Math.max(currentPage - 1, 1)}`}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className={`px-4 py-2 rounded-full border-2 border-gray-300 ${
            currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
          } shadow-lg transform hover:scale-105 transition-all`}
        >
          <span className="text-gray-600 font-semibold">‹</span>
        </Link>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <Link
            key={number}
            to={`?page=${number}`}
            onClick={() => onPageChange(number)}
            className={`px-4 py-2 mr-2 rounded-full border-2 border-gray-300 ${
              number === currentPage
                ? 'bg-blue-500 text-white font-bold'
                : 'bg-white text-gray-600 hover:bg-blue-100'
            } shadow-lg transform hover:scale-105 transition-all`}
          >
            {number}
          </Link>
        ))}

        {/* Next Button */}
        <Link
          to={`?page=${Math.min(currentPage + 1, totalPages)}`}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className={`px-4 py-2 mr-2 rounded-full border-2 border-gray-300 ${
            currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-white'
          } shadow-lg transform hover:scale-105 transition-all`}
        >
          <span className="text-gray-600 font-semibold">›</span>
        </Link>
      </motion.div>
    </div>
  );
};

export default Pagination;
